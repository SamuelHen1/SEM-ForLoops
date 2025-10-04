import React, { useEffect, useRef, useState } from "react";
import {
  Viewer,
  Ion,
  createWorldTerrainAsync,
  Math as CesiumMath,
  EllipsoidTerrainProvider,
  Rectangle,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import MeteorIntro from "../components/meteor_intro";

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN ?? "";

const GlobePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);

  const [showMeteor, setShowMeteor] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!containerRef.current) return;

      try {
        const terrainProvider = await createWorldTerrainAsync();

        if (!mounted) return;

        viewerRef.current = new Viewer(containerRef.current, {
          terrainProvider,
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          timeline: false,
          animation: false,
          fullscreenButton: false,
          vrButton: false,
        });

        viewerRef.current.camera.flyTo({
          destination: Rectangle.fromDegrees(-180, -90, 180, 90),
          orientation: {
            heading: CesiumMath.toRadians(0),
            pitch: CesiumMath.toRadians(-90),
            roll: 0,
          },
          duration: 2,
        });
      } catch (err) {
        console.error("Cesium terrain init failed — fallback:", err);

        if (!mounted || !containerRef.current) return;

        viewerRef.current = new Viewer(containerRef.current, {
          terrainProvider: new EllipsoidTerrainProvider(),
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          timeline: false,
          animation: false,
          fullscreenButton: false,
          vrButton: false,
        });

        viewerRef.current.camera.flyTo({
          destination: Rectangle.fromDegrees(-180, -90, 180, 90),
          orientation: {
            heading: CesiumMath.toRadians(0),
            pitch: CesiumMath.toRadians(-90),
            roll: 0,
          },
          duration: 2,
        });
      }
    })();

    return () => {
      mounted = false;
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  // auto-hide meteor after animation completes
  useEffect(() => {
    if (showMeteor) {
      const timer = setTimeout(() => setShowMeteor(false), 2800); // match meteor animation
      return () => clearTimeout(timer);
    }
  }, [showMeteor]);

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      {/* Cesium globe */}
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />

      {/* button to launch meteor */}
      {!showMeteor && (
        <button
          onClick={() => setShowMeteor(true)}
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 24px",
            background: "#ff8800",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 16,
            boxShadow: "0 0 25px rgba(255,136,0,0.6)",
            zIndex: 1000,
          }}
        >
          Launch Meteor ☄️
        </button>
      )}

      {/* meteor overlay */}
      {showMeteor && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2000,
            pointerEvents: "none", // allow globe interaction while animation plays
          }}
        >
          <MeteorIntro />
        </div>
      )}
    </div>
  );
};

export default GlobePage;
