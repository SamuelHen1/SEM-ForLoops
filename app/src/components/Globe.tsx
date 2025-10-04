// src/components/Globe.tsx
import { useEffect, useRef, useState } from "react";
import {
  Viewer as ViewerComponent,
  ImageryLayer,
  Entity,
  EllipseGraphics,
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
  ColorMaterialProperty,
  CallbackProperty,
  JulianDate,
  ClassificationType,
  type TerrainProvider,
  type ImageryProvider,
} from "cesium";

const token = import.meta.env.VITE_CESIUM_ION_TOKEN as string | undefined;
if (token) Ion.defaultAccessToken = token;

// === explosion tuning ===
const EXPLOSION_MS = 1250;          // life of one blast
const MAX_RADIUS_M = 30000;         // how large the ring expands (meters)
const OUTLINE_ALPHA = 0.9;          // starting outline opacity

type Explosion = {
  id: number;
  lat: number;
  lon: number;
  start: JulianDate;
};

export default function Globe() {
  const [terrain, setTerrain] = useState<TerrainProvider>();
  const [satellite, setSatellite] = useState<ImageryProvider>();
  const [labels, setLabels] = useState<ImageryProvider>();
  const [roads, setRoads] = useState<ImageryProvider>();
  const [clickedCoords, setClickedCoords] =
    useState<{ lat: number; lon: number } | null>(null);

  const [explosions, setExplosions] = useState<Explosion[]>([]);
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

    return () => { cancelled = true; };
  }, []);

  // Scene tweaks when viewer is ready
  useEffect(() => {
    const v = viewerRef.current?.cesiumElement;
    if (!viewerReady || !v) return;
    v.scene.globe.enableLighting = false;
    v.shadows = false;
    v.scene.globe.depthTestAgainstTerrain = true;
    v.scene.requestRenderMode = true;
    v.clock.shouldAnimate = true; // ensure time advances for CallbackProperty
    // Optional: bloom for brighter “flash”
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

      if (scene.pickPositionSupported) {
        const picked = scene.pick(click.position);
        if (picked) {
          const pos = scene.pickPosition(click.position);
          if (pos) carto = Cartographic.fromCartesian(pos);
        }
      }

      if (!carto) {
        const ray = viewer.camera.getPickRay(click.position) as Ray | undefined;
        if (ray) {
          const globePos = scene.globe.pick(ray, scene);
          if (globePos) carto = Cartographic.fromCartesian(globePos);
        }
      }

      if (!carto) return; // clicked sky/space

      const lat = CesiumMath.toDegrees(carto.latitude);
      const lon = CesiumMath.toDegrees(carto.longitude);
      setClickedCoords({ lat, lon });

      // spawn explosion
      const id = ++idRef.current;
      const start = JulianDate.now();
      setExplosions((prev) => [...prev, { id, lat, lon, start }]);

      // auto-remove after life
      window.setTimeout(() => {
        setExplosions((prev) => prev.filter((e) => e.id !== id));
        scene.requestRender();
      }, EXPLOSION_MS + 100);

      scene.requestRender();
    }, ScreenSpaceEventType.LEFT_CLICK);

    return () => handler.destroy();
  }, [viewerReady]);

  // helper: render one animated blast
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
        const alpha = 1 - x; // fade out
        // hot orange
        return new Color(1.0, 0.45, 0.0, alpha);
      }, false)
    );

    const outlineColorProp = new CallbackProperty((t: any) => {
      const dt = Math.max(0, JulianDate.secondsDifference(t, e.start));
      const x = Math.min(1, dt / lifeSec);
      const alpha = OUTLINE_ALPHA * (1 - x);
      return new Color(1.0, 1.0, 1.0, alpha);
    }, false);

    return (
      <Entity key={e.id} position={pos}>
        <EllipseGraphics
          semiMajorAxis={radiusProp}
          semiMinorAxis={radiusProp}
          material={materialProp}
          outline
          outlineColor={outlineColorProp as any}
          // draw on terrain (ground primitive when height is undefined)
          classificationType={ClassificationType.TERRAIN}
          zIndex={10}
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
        scene3DOnly
      >
        {satellite && <ImageryLayer imageryProvider={satellite} />}
        {roads && <ImageryLayer imageryProvider={roads} alpha={0.95} />}
        {labels && <ImageryLayer imageryProvider={labels} alpha={1} />}
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
          Lat: {clickedCoords.lat.toFixed(4)}, Lon:{" "}
          {clickedCoords.lon.toFixed(4)}
        </div>
      )}
    </>
  );
}
