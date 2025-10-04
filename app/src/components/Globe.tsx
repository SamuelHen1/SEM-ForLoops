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
    type TerrainProvider,
    type ImageryProvider,
} from "cesium";

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

export default function Globe() {
    const [terrain, setTerrain] = useState<TerrainProvider>();
    const [satellite, setSatellite] = useState<ImageryProvider>();
    const [labels, setLabels] = useState<ImageryProvider>();
    const [roads, setRoads] = useState<ImageryProvider>();
    const viewerRef = useRef<CesiumComponentRef<CesiumViewer> | null>(null);

    useEffect(() => {
        let cancelled = false;

        // Terrain
        (async () => {
            try {
                const tp = await createWorldTerrainAsync();
                if (!cancelled) setTerrain(tp);
            } catch {
                if (!cancelled) setTerrain(undefined);
            }
        })();

        // Base satellite imagery (Esri World Imagery)
        (async () => {
            try {
                const esriSat = new UrlTemplateImageryProvider({
                    url:
                        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
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

        // Labels (country/city names + boundaries)
        (async () => {
            try {
                const esriLabels = new UrlTemplateImageryProvider({
                    url:
                        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
                    credit: "Esri",
                });
                if (!cancelled) setLabels(esriLabels);
            } catch {}
        })();

        // Roads & transportation overlay (optional but nice)
        (async () => {
            try {
                const esriRoads = new UrlTemplateImageryProvider({
                    url:
                        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
                    credit: "Esri",
                });
                if (!cancelled) setRoads(esriRoads);
            } catch {}
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    // Uniform lighting, no shadows
    useEffect(() => {
        const v = viewerRef.current?.cesiumElement;
        if (!v) return;
        v.scene.globe.enableLighting = false;
        v.shadows = false;
    }, []);

    return (
        <ViewerComponent
            ref={viewerRef as any}
            full
            terrainProvider={terrain}
            baseLayerPicker={false}
            animation={false}
            timeline={false}
            scene3DOnly
        >
            {/* Base: true-color satellite */}
            {satellite && (
                <ImageryLayer imageryProvider={satellite} />
            )}

            {/* Overlays: drawn AFTER satellite so they appear on top */}
            {roads && (
                <ImageryLayer imageryProvider={roads} alpha={0.95} />
            )}
            {labels && (
                <ImageryLayer imageryProvider={labels} alpha={1} />
            )}
        </ViewerComponent>
    );
}
