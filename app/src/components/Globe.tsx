// src/components/Globe.tsx
import { useEffect, useRef, useState } from "react";
import {
  Viewer as ViewerComponent,
  ImageryLayer,
  Entity,
  EllipseGraphics,
  PointGraphics,
  type CesiumComponentRef,
} from "resium";
import {
  Ion,
  createWorldTerrainAsync,
  UrlTemplateImageryProvider,
  Viewer as CesiumViewer,
  Cartographic,
  Math as CesiumMath,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  EllipsoidTerrainProvider,
  Ray,
  Cartesian2,
  Cartesian3,
  Color,
  type PositionProperty,
  ColorMaterialProperty,
  CallbackProperty,
  JulianDate,
  ClassificationType,
  type TerrainProvider,
  type ImageryProvider,
} from "cesium";

const token = import.meta.env.VITE_CESIUM_ION_TOKEN as string | undefined;
if (token) Ion.defaultAccessToken = token;

// --- Explosion tuning ---
const EXPLOSION_MS = 1250;
const MAX_RADIUS_M = 1500000;
const OUTLINE_ALPHA = 0.9;

// --- Meteor tuning ---
const METEOR_MS = 1200;                // flight duration
const METEOR_PIXEL_PAD = 16;           // how far in from the corners
const METEOR_SIZE_PX = 8;              // visual size of the meteor dot

type Explosion = {
  id: number;
  lat: number;
  lon: number;
  start: JulianDate;
};

type Meteor = {
  id: number;
  start: Cartesian3;
  target: Cartesian3;
  startTime: JulianDate;
  durationSec: number;
};


export default function Globe() {
  const [terrain, setTerrain] = useState<TerrainProvider>();
  const [satellite, setSatellite] = useState<ImageryProvider>();
  const [labels, setLabels] = useState<ImageryProvider>();
  const [roads, setRoads] = useState<ImageryProvider>();
  const [clickedCoords, setClickedCoords] =
    useState<{ lat: number; lon: number } | null>(null);

  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const idRef = useRef(0);

  // Resium viewer ref + "ready" flag
  const viewerRef = useRef<CesiumComponentRef<CesiumViewer> | null>(null);
  const [viewerReady, setViewerReady] = useState(false);
  const viewerCallback = (ref: CesiumComponentRef<CesiumViewer> | null) => {
    viewerRef.current = ref;
    setViewerReady(!!ref?.cesiumElement);
  };

  // Terrain + imagery
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (token) {
          const tp = await createWorldTerrainAsync();
          if (!cancelled) setTerrain(tp);
        } else {
          if (!cancelled) setTerrain(new EllipsoidTerrainProvider());
        }
      } catch {
        if (!cancelled) setTerrain(new EllipsoidTerrainProvider());
      }
    })();

    (async () => {
      try {
        const esriSat = new UrlTemplateImageryProvider({
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          credit:
            "Esri, Maxar, Earthstar Geographics, USDA, USGS, AeroGRID, IGN, and the GIS User Community",
        });
        if (!cancelled) setSatellite(esriSat);
      } catch {
        const fallback = new UrlTemplateImageryProvider({
          url: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
          credit: "© OpenStreetMap contributors",
        });
        if (!cancelled) setSatellite(fallback);
      }
    })();

    (async () => {
      try {
        const esriLabels = new UrlTemplateImageryProvider({
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
          credit: "Esri",
        });
        if (!cancelled) setLabels(esriLabels);
      } catch {}
    })();

    (async () => {
      try {
        const esriRoads = new UrlTemplateImageryProvider({
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
          credit: "Esri",
        });
        if (!cancelled) setRoads(esriRoads);
      } catch {}
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Scene tweaks when viewer is ready
  useEffect(() => {
    const v = viewerRef.current?.cesiumElement;
    if (!viewerReady || !v) return;
    v.scene.globe.enableLighting = false;
    v.shadows = false;
    v.scene.globe.depthTestAgainstTerrain = true;
    v.scene.requestRenderMode = true;
    v.clock.shouldAnimate = true; // needed so CallbackProperty updates over time
    // Optional bloom:
    // v.scene.postProcessStages.bloom.enabled = true;
  }, [viewerReady]);

  // CLICK HANDLER — attach only when viewer is ready
  useEffect(() => {
    const viewer = viewerRef.current?.cesiumElement;
    if (!viewerReady || !viewer) return;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click: { position: Cartesian2 }) => {
      const { scene } = viewer;

      let carto: Cartographic | null = null;
      let targetCartesian: Cartesian3 | null = null;

      // Try precise pick if something under cursor
      if (scene.pickPositionSupported) {
        const picked = scene.pick(click.position);
        if (picked) {
          const pos = scene.pickPosition(click.position);
          if (pos) {
            carto = Cartographic.fromCartesian(pos);
            targetCartesian = pos;
          }
        }
      }

      // Fallback: raycast to globe
      if (!carto) {
        const ray = viewer.camera.getPickRay(click.position) as Ray | undefined;
        if (ray) {
          const globePos = scene.globe.pick(ray, scene);
          if (globePos) {
            carto = Cartographic.fromCartesian(globePos);
            targetCartesian = globePos;
          }
        }
      }

      if (!carto || !targetCartesian) return; // clicked space

      const lat = CesiumMath.toDegrees(carto.latitude);
      const lon = CesiumMath.toDegrees(carto.longitude);
      setClickedCoords({ lat, lon });

      // --- Find a start position from a bottom screen corner ---
      const canvas = scene.canvas;
      const bl = new Cartesian2(METEOR_PIXEL_PAD, canvas.height - METEOR_PIXEL_PAD);
      const br = new Cartesian2(canvas.width - METEOR_PIXEL_PAD, canvas.height - METEOR_PIXEL_PAD);

      const screenToGround = (p: Cartesian2) => {
        const r = viewer.camera.getPickRay(p) as Ray | undefined;
        if (!r) return undefined;
        return scene.globe.pick(r, scene) ?? undefined;
      };

      let startCartesian =
        screenToGround(bl) ??
        screenToGround(br) ??
        // last-resort fallback: somewhere “down-left” of target, above surface
        Cartesian3.fromDegrees(lon + 40, lat - 30, 800000);

      // Spawn meteor (don’t explode yet; explode on arrival)
      const id = ++idRef.current;
      const startTime = JulianDate.now();
      const durationSec = METEOR_MS / 1000;

      setMeteors((prev) => [
        ...prev,
        { id, start: startCartesian, target: targetCartesian!, startTime, durationSec },
      ]);

      // When meteor arrives, trigger explosion and remove meteor
      window.setTimeout(() => {
        setMeteors((prev) => prev.filter((m) => m.id !== id));
        setExplosions((prev) => [...prev, { id, lat, lon, start: JulianDate.now() }]);
        scene.requestRender();
      }, METEOR_MS);

      scene.requestRender();
    }, ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      handler.destroy();
    };
  }, [viewerReady]);

  // ========== RENDER HELPERS ==========

  // Explosion ring
  const renderExplosion = (e: Explosion) => {
    const pos = Cartesian3.fromDegrees(e.lon, e.lat);
    const lifeSec = EXPLOSION_MS / 1000;

    const radiusProp = new CallbackProperty((t: any) => {
      const dt = Math.max(0, JulianDate.secondsDifference(t, e.start));
      const x = Math.min(1, dt / lifeSec); // 0..1
      return Math.max(1, x * MAX_RADIUS_M);
    }, false);

    const materialProp = new ColorMaterialProperty(
      new CallbackProperty((t: any) => {
        const dt = Math.max(0, JulianDate.secondsDifference(t, e.start));
        const x = Math.min(1, dt / lifeSec);
        const alpha = 1 - x;
        return new Color(1.0, 0.45, 0.0, alpha); // hot orange fading
      }, false)
    );

    const outlineColorProp = new CallbackProperty((t: any) => {
      const dt = Math.max(0, JulianDate.secondsDifference(t, e.start));
      const x = Math.min(1, dt / lifeSec);
      const alpha = OUTLINE_ALPHA * (1 - x);
      return new Color(1.0, 1.0, 1.0, alpha);
    }, false);

    return (
      <Entity key={`expl-${e.id}`} position={pos}>
        <EllipseGraphics
          semiMajorAxis={radiusProp}
          semiMinorAxis={radiusProp}
          material={materialProp}
          outline
          outlineColor={outlineColorProp as any}
          classificationType={ClassificationType.TERRAIN}
        />
      </Entity>
    );
  };

  // Meteor moving point
  const renderMeteor = (m: Meteor) => {
    // ease-out for a nicer motion
    const easeOut = (x: number) => 1 - Math.pow(1 - x, 2);

      const posProp = new CallbackProperty((t: any) => {
        const dt = Math.max(0, JulianDate.secondsDifference(t, m.startTime));
        const u = Math.min(1, dt / m.durationSec);
        const x = 1 - Math.pow(1 - u, 2); // ease-out
        const out = new Cartesian3();
        Cartesian3.lerp(m.start, m.target, x, out);
        return out;
},       false) as unknown as PositionProperty;


    return (
      <Entity key={`met-${m.id}`} position={posProp}>
        <PointGraphics
          color={Color.YELLOW}
          outlineColor={Color.WHITE}
          outlineWidth={1}
          pixelSize={METEOR_SIZE_PX}
          disableDepthTestDistance={Number.POSITIVE_INFINITY}
        />
      </Entity>
    );
  };

  return (
    <>
      <ViewerComponent
        ref={viewerCallback as any}
        full
        terrainProvider={terrain}
        baseLayerPicker={false}
        animation={false}
        timeline={false}
        selectionIndicator={false}   // ← hides green brackets
        scene3DOnly
      >
        {satellite && <ImageryLayer imageryProvider={satellite} />}
        {roads && <ImageryLayer imageryProvider={roads} alpha={0.95} />}
        {labels && <ImageryLayer imageryProvider={labels} alpha={1} />}

        {/* Meteors flying in */}
        {meteors.map(renderMeteor)}

        {/* Explosions after meteor arrival */}
        {explosions.map(renderExplosion)}
      </ViewerComponent>

      {clickedCoords && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "rgba(0,0,0,0.55)",
            color: "white",
            padding: "6px 10px",
            borderRadius: "6px",
            fontSize: "14px",
            userSelect: "none",
          }}
        >
          Lat: {clickedCoords.lat.toFixed(4)}, Lon: {clickedCoords.lon.toFixed(4)}
        </div>
      )}
    </>
  );
}
