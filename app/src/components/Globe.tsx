// src/components/Globe.tsx
import { useEffect, useRef, useState } from "react";
import {
    Viewer as ViewerComponent,
    ImageryLayer,
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
    type TerrainProvider,
    type ImageryProvider,
} from "cesium";

const token = import.meta.env.VITE_CESIUM_ION_TOKEN as string | undefined;
if (token) Ion.defaultAccessToken = token;

export default function Globe() {
    const [terrain, setTerrain] = useState<TerrainProvider>();
    const [satellite, setSatellite] = useState<ImageryProvider>();
    const [labels, setLabels] = useState<ImageryProvider>();
    const [roads, setRoads] = useState<ImageryProvider>();
    const [clickedCoords, setClickedCoords] = useState<{ lat: number; lon: number } | null>(null);

    // Resium viewer ref + "ready" flag
    const viewerRef = useRef<CesiumComponentRef<CesiumViewer> | null>(null);
    const [viewerReady, setViewerReady] = useState(false);
    const viewerCallback = (ref: CesiumComponentRef<CesiumViewer> | null) => {
        viewerRef.current = ref;
        setViewerReady(!!ref?.cesiumElement);
    };

    // Terrain (use ion if token exists, else ellipsoid)
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

        // Base imagery
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

        // Labels
        (async () => {
            try {
                const esriLabels = new UrlTemplateImageryProvider({
                    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
                    credit: "Esri",
                });
                if (!cancelled) setLabels(esriLabels);
            } catch {}
        })();

        // Roads
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
    }, [viewerReady]);

    // CLICK HANDLER — attach only when viewer is ready
    useEffect(() => {
        const viewer = viewerRef.current?.cesiumElement;
        if (!viewerReady || !viewer) return;

        const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
        console.log("[Globe] Click handler attached");

        handler.setInputAction((click: { position: Cartesian2 }) => {
            const { scene } = viewer;

            let carto: Cartographic | null = null;

            // 1) High-precision pick if something is under cursor and supported
            if (scene.pickPositionSupported) {
                const picked = scene.pick(click.position);
                if (picked) {
                    const pos = scene.pickPosition(click.position);
                    if (pos) carto = Cartographic.fromCartesian(pos);
                }
            }

            // 2) Fallback: raycast to globe
            if (!carto) {
                const ray = viewer.camera.getPickRay(click.position) as Ray | undefined;
                if (ray) {
                    const globePos = scene.globe.pick(ray, scene);
                    if (globePos) carto = Cartographic.fromCartesian(globePos);
                }
            }

            if (!carto) return; // clicked sky/space, ignore

            const lat = CesiumMath.toDegrees(carto.latitude);
            const lon = CesiumMath.toDegrees(carto.longitude);

            setClickedCoords({ lat, lon });
            console.log("Clicked coordinates:", { lat, lon });
            scene.requestRender();
        }, ScreenSpaceEventType.LEFT_CLICK);

        return () => {
            handler.destroy();
            console.log("[Globe] Click handler removed");
        };
    }, [viewerReady]);

    return (
        <>
            <ViewerComponent
                ref={viewerCallback as any}   // IMPORTANT: callback ref to detect readiness
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
