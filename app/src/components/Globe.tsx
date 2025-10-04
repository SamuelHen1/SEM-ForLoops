// src/components/Globe.tsx
import { useEffect, useState } from "react";
import { Viewer } from "resium";
import { Ion, createWorldTerrainAsync, type TerrainProvider } from "cesium";

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

export default function Globe() {
    const [terrain, setTerrain] = useState<TerrainProvider>();

    useEffect(() => {
        let canceled = false;
        (async () => {
            try {
                const tp = await createWorldTerrainAsync();
                if (!canceled) setTerrain(tp);
            } catch {
                setTerrain(undefined); // fallback: no terrain
            }
        })();
        return () => { canceled = true; };
    }, []);

    return (
        <Viewer
            full
            terrainProvider={terrain}
            baseLayerPicker={false}
            animation={false}
            timeline={false}
            scene3DOnly
            style={{ position: "absolute", inset: 0 }}
        />
    );
}
