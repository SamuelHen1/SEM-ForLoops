// src/components/Globe.tsx
import { useEffect, useRef, useState } from "react";
import {
    Viewer as ViewerComponent,
    ImageryLayer,
    Cesium3DTileset,
    type CesiumComponentRef,
} from "resium";
import {
    Ion,
    IonResource,
    createWorldTerrainAsync,
    createWorldImageryAsync,
    IonWorldImageryStyle,
    UrlTemplateImageryProvider,
    Viewer as CesiumViewer,
    type TerrainProvider,
    type ImageryProvider,
} from "cesium";

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

export default function Globe() {
    const [terrain, setTerrain] = useState<TerrainProvider>();
    const [imagery, setImagery] = useState<ImageryProvider>();
    const viewerRef = useRef<CesiumComponentRef<CesiumViewer> | null>(null);

    // Load terrain + base imagery
    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const tp = await createWorldTerrainAsync();
                if (!cancelled) setTerrain(tp);
            } catch {
                setTerrain(undefined);
            }
        })();

        (async () => {
            try {
                // Satellite base layer
                const ip = await createWorldImageryAsync({
                    style: IonWorldImageryStyle.AERIAL,
                });
                if (!cancelled) setImagery(ip);
            } catch {
                // Fallback if Ion imagery is unavailable
                const fallback = new UrlTemplateImageryProvider({
                    url: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    credit: "© OpenStreetMap",
                });
                if (!cancelled) setImagery(fallback);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    // Viewer tweaks: NO shadows, NO day/night shading, NO auto-fly
    useEffect(() => {
        const v = viewerRef.current?.cesiumElement;
        if (!v) return;

        // Make the globe uniformly lit (no dark hemisphere)
        v.scene.globe.enableLighting = false; // <-- key line
        v.shadows = false;                    // <-- disable shadows
    }, [viewerRef.current]);

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
            {/* Base satellite imagery */}
            {imagery && <ImageryLayer imageryProvider={imagery} />}

            {/* Google Photorealistic 3D Tiles (Asset ID 2275207) */}
            <Cesium3DTileset
                url={IonResource.fromAssetId(2275207)}
                maximumScreenSpaceError={2}
                dynamicScreenSpaceError
                // No onReady camera moves
            />
        </ViewerComponent>
    );
}
