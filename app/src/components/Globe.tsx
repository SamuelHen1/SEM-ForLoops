import { useEffect, useRef, useState } from "react";
import { Viewer as ViewerComponent, ImageryLayer, type CesiumComponentRef } from "resium";
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
  Cartesian2,
  Cartesian3,
  type TerrainProvider,
  type ImageryProvider,
} from "cesium";

import Water from "./Tsunami";

const token = import.meta.env.VITE_CESIUM_ION_TOKEN as string | undefined;
if (token) Ion.defaultAccessToken = token;

export default function Globe() {
  const [terrain, setTerrain] = useState<TerrainProvider>();
  const [satellite, setSatellite] = useState<ImageryProvider>();
  const [labels, setLabels] = useState<ImageryProvider>();
  const [roads, setRoads] = useState<ImageryProvider>();
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [tsunamis, setTsunamis] = useState<Cartesian3[]>([]);

  const viewerRef = useRef<CesiumComponentRef<CesiumViewer> | null>(null);
  const [viewerReady, setViewerReady] = useState(false);
  const viewerCallback = (ref: CesiumComponentRef<CesiumViewer> | null) => {
    viewerRef.current = ref;
    setViewerReady(!!ref?.cesiumElement);
  };

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
        });
        if (!cancelled) setSatellite(esriSat);
      } catch {
        const fallback = new UrlTemplateImageryProvider({
          url: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        });
        if (!cancelled) setSatellite(fallback);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const v = viewerRef.current?.cesiumElement;
    if (!viewerReady || !v) return;
    v.scene.globe.enableLighting = false;
    v.shadows = false;
    v.scene.globe.depthTestAgainstTerrain = true;
    v.scene.requestRenderMode = true;
  }, [viewerReady]);

  useEffect(() => {
    const viewer = viewerRef.current?.cesiumElement;
    if (!viewerReady || !viewer) return;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((click: { position: Cartesian2 }) => {
      const { scene } = viewer;
      let carto: Cartographic | null = null;

      if (scene.pickPositionSupported) {
        const pos = scene.pickPosition(click.position);
        if (pos) carto = Cartographic.fromCartesian(pos);
      }

      if (!carto) {
        const ray = viewer.camera.getPickRay(click.position);
        if (ray) {
          const globePos = scene.globe.pick(ray, scene);
          if (globePos) carto = Cartographic.fromCartesian(globePos);
        }
      }

      if (!carto) return;

      const height = scene.globe.getHeight(carto);
      if (height === undefined || height > 0) return;

      const pos = Cartesian3.fromRadians(carto.longitude, carto.latitude, 0);

      setTimeout(() => {
        setTsunamis(prev => [...prev, pos]);
      }, 1000); // 5s delay

      const lat = CesiumMath.toDegrees(carto.latitude);
      const lon = CesiumMath.toDegrees(carto.longitude);
      setClickedCoords({ lat, lon });

      scene.requestRender();
    }, ScreenSpaceEventType.LEFT_CLICK);

    return () => { handler.destroy(); };
  }, [viewerReady]);

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
      </ViewerComponent>

      {clickedCoords && (
        <div style={{
          position: "absolute",
          top: 10,
          left: 10,
          background: "rgba(0,0,0,0.55)",
          color: "white",
          padding: "6px 10px",
          borderRadius: "6px",
          fontSize: "14px",
          userSelect: "none",
        }}>
          Lat: {clickedCoords.lat.toFixed(4)}, Lon: {clickedCoords.lon.toFixed(4)}
        </div>
      )}

      {viewerReady &&
        tsunamis.map((pos, i) => (
          <Water
            key={i}
            viewer={viewerRef.current!.cesiumElement!}
            center={pos}
            waves={5}
            duration={10}
            waveAmplitude={0.2}
            waveWavelength={0.25}
            onEnd={() => {
              setTsunamis(prev => prev.filter((_, idx) => idx !== i));
            }}
          />
        ))
      }
    </>
  );
}
