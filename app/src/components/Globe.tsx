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
  Ray,
  Cartesian2,
  Cartesian3,
  Color,
  ColorMaterialProperty,
  CallbackProperty,
  JulianDate,
  Primitive,
  GeometryInstance,
  CircleGeometry,
  EllipsoidSurfaceAppearance,
  Material,
  type Property,
  type TerrainProvider,
  type ImageryProvider,
  type Viewer,
} from "cesium";

import Crater from "./Crater";
import RefreshButton from "./refresh_button";
import { getImpact } from "../state/impactBus";
import { computeRadii } from "../utils/impact";
import { estimateCasualties, type CasualtyEstimate } from "../services/populationDensity";

const token = import.meta.env.VITE_CESIUM_ION_TOKEN as string | undefined;
if (token) Ion.defaultAccessToken = token;

// --- Meteor & FX tuning ---
const METEOR_MS = 2200;
const EXPLOSION_MS = 1250;
const OUTLINE_ALPHA = 0.9;

// ------------------------------------
// WATER (Tsunami) COMPONENT (surface-safe)
// ------------------------------------
function Water({
  viewer,
  center,
  initialRadius = 2_000_000,
  waves = 5,
  duration = 10,
  waveAmplitude = 0.2,
  waveWavelength = 0.25,
  onEnd,
}: {
  viewer: Viewer;
  center: Cartesian3;
  initialRadius?: number;
  waves?: number;
  duration?: number;
  waveAmplitude?: number;
  waveWavelength?: number;
  onEnd?: () => void;
}) {
  const primitivesRef = useRef<Primitive[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const rippleRadiiRef = useRef<number[]>([]);
  const frameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!viewer) return;

    // ---- Tsunami Audio ----
    const audio = new Audio("/Tsunami.mp3");
    audio.volume = 0.6;
    audioRef.current = audio;
    const tryPlay = () => {
      audio.play().catch(() => {
        document.body.addEventListener("click", () => audio.play().catch(() => { }), { once: true });
      });
    };
    const playTimeout = setTimeout(tryPlay, 2200);
    const stopAudio = () => {
      audio.pause();
      audio.currentTime = 0;
    };

    const globe = viewer.scene.globe;
    const maxRadius = Math.min(initialRadius * 5, 10_000_000);

    const randomOffsets = Array.from({ length: waves }, () => Math.random() * (initialRadius / 4));
    const phaseOffsets = Array.from({ length: waves }, () => Math.random() * Math.PI * 2);

    const material = new Material({
      fabric: {
        type: "WaterRipple",
        uniforms: {
          time: 0,
          color: new Color(0.0, 0.6, 1.0, 0.7),
          alpha: 1.0,
          amplitude: waveAmplitude,
          wavelength: waveWavelength,
        },
        source: `
          uniform float time;
          uniform vec4 color;
          uniform float alpha;
          uniform float amplitude;
          uniform float wavelength;
          czm_material czm_getMaterial(czm_materialInput materialInput)
          {
            czm_material m = czm_getDefaultMaterial(materialInput);
            vec2 uv = materialInput.st - 0.5;
            float dist = length(uv) * 2.0;
            float wave = sin(dist / wavelength - time) * amplitude;
            float fade = 1.0 - dist;
            m.diffuse = color.rgb;
            m.alpha = color.a * alpha * (fade*0.6 + wave*0.4);
            return m;
          }
        `,
      },
    });

    // One appearance reused; ensure geometry uses matching vertex format.
    const appearance = new EllipsoidSurfaceAppearance({
      material,
      translucent: true,
      flat: true,
    } as any);

    rippleRadiiRef.current = Array.from({ length: waves }, (_, i) =>
      i === 0 ? initialRadius * 0.05 : initialRadius - i * (initialRadius / waves) + randomOffsets[i]
    );

    const isRippleOverWater = (centerCarto: Cartographic, radius: number, samplePoints = 12) => {
      for (let i = 0; i < samplePoints; i++) {
        const angle = (i / samplePoints) * 2 * Math.PI;
        const lat = centerCarto.latitude + (radius / 6378137.0) * Math.cos(angle);
        const lon = centerCarto.longitude + (radius / 6378137.0) * Math.sin(angle);
        const height = globe.getHeight(new Cartographic(lon, lat));
        if (height !== undefined && height > 0) return false; // land
      }
      return true;
    };

    const animate = (time: number) => {
      if (startTimeRef.current === null) startTimeRef.current = time;
      const t = (time - startTimeRef.current) * 0.001;
      const alphaBase = Math.max(0, 1 - t / duration);

      primitivesRef.current.forEach((p) => viewer.scene.primitives.remove(p));
      primitivesRef.current = [];

      const centerCarto = Cartographic.fromCartesian(center);
      const growthFactor = Math.min(1, t / duration);

      rippleRadiiRef.current = rippleRadiiRef.current.map((_r, idx) =>
        Math.min(
          initialRadius * 0.05 +
          (maxRadius - initialRadius * 0.05) * growthFactor -
          idx * (initialRadius / waves) +
          randomOffsets[idx],
          maxRadius
        )
      );

      rippleRadiiRef.current.forEach((radius, idx) => {
        if (radius <= 0 || alphaBase <= 0) return;
        if (!isRippleOverWater(centerCarto, radius)) return;

        const geom = new CircleGeometry({
          center,
          radius,
          height: 0,
          vertexFormat: EllipsoidSurfaceAppearance.VERTEX_FORMAT,
        });

        (appearance.material as any).uniforms.time = t + phaseOffsets[idx];
        (appearance.material as any).uniforms.alpha = alphaBase * (1 - (idx / waves) * 0.5 + 0.5);

        const prim = new Primitive({
          geometryInstances: new GeometryInstance({ geometry: geom }),
          appearance,
          asynchronous: false,
        });

        primitivesRef.current.push(prim);
        viewer.scene.primitives.add(prim);
      });

      viewer.scene.requestRender();

      if (alphaBase > 0) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        primitivesRef.current.forEach((p) => viewer.scene.primitives.remove(p));
        primitivesRef.current = [];
        stopAudio();
        onEnd && onEnd();
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      clearTimeout(playTimeout);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      primitivesRef.current.forEach((p) => viewer.scene.primitives.remove(p));
      primitivesRef.current = [];
      stopAudio();
    };
  }, [viewer, center, initialRadius, waves, duration, waveAmplitude, waveWavelength, onEnd]);

  return null;
}

// ------------------------------------
// MAIN GLOBE COMPONENT
// ------------------------------------
type ExplosionEvent = {
  id: number;
  lat: number;
  lon: number;
  start: JulianDate;
  craterRadiusM: number;
  blastRadiusM: number;
};

type ImpactSummary = {
  status: "loading" | "ready" | "error";
  data?: CasualtyEstimate;
  error?: string;
};

export default function Globe() {
  const [terrain, setTerrain] = useState<TerrainProvider>();
  const [satellite, setSatellite] = useState<ImageryProvider>();
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [meteors, setMeteors] = useState<any[]>([]);
  const [explosions, setExplosions] = useState<ExplosionEvent[]>([]);
  const [tsunamis, setTsunamis] = useState<Cartesian3[]>([]);
  const [impactSummaries, setImpactSummaries] = useState<Record<number, ImpactSummary>>({});
  const [latestImpactMeta, setLatestImpactMeta] = useState<{ id: number; lat: number; lon: number; blastRadiusM: number } | null>(null);
  const idRef = useRef(0);
  const viewerRef = useRef<CesiumComponentRef<CesiumViewer> | null>(null);
  const [viewerReady, setViewerReady] = useState(false);
  const initRef = useRef(false);

  const viewerCallback = (ref: CesiumComponentRef<CesiumViewer> | null) => {
    viewerRef.current = ref;
    setViewerReady(!!ref?.cesiumElement);
  };

  // ✅ Load Cesium World Terrain ONCE and set imagery
  useEffect(() => {
    (async () => {
      if (initRef.current) return;
      initRef.current = true;

      try {
        if (!token) throw new Error("Missing VITE_CESIUM_ION_TOKEN in app/.env");

        const tp = await createWorldTerrainAsync({
          requestVertexNormals: true,
          requestWaterMask: true,
        });

        const anyTp = tp as any;
        if (anyTp?.readyPromise) await anyTp.readyPromise;

        setTerrain(tp);

        const sat = new UrlTemplateImageryProvider({
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        });
        setSatellite(sat);
      } catch (err) {
        console.error("Cesium World Terrain failed:", err);
        alert("Failed to load Cesium World Terrain.\nCheck your VITE_CESIUM_ION_TOKEN and network access.");
      }
    })();
  }, []);

  // ✅ Force-apply terrain to the Cesium viewer
  useEffect(() => {
    const v = viewerRef.current?.cesiumElement;
    if (!v || !terrain) return;
    v.terrainProvider = terrain;
    v.scene.requestRender();
  }, [terrain]);

  useEffect(() => {
    const v = viewerRef.current?.cesiumElement;
    if (!viewerReady || !v) return;
    v.scene.globe.depthTestAgainstTerrain = true;
    v.scene.globe.enableLighting = false;
    v.scene.requestRenderMode = true;
    v.clock.shouldAnimate = true;
  }, [viewerReady]);

  // --- Meteor click handler ---
  useEffect(() => {
    const viewer = viewerRef.current?.cesiumElement;
    if (!viewerReady || !viewer) return;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click: { position: Cartesian2 }) => {
      const { scene } = viewer;

      const meteorSound = new Audio("/Meteor.mp3");
      meteorSound.volume = 0.8;
      meteorSound.play().catch(() => {
        document.body.addEventListener("click", () => meteorSound.play().catch(() => { }), { once: true });
      });

      let carto: Cartographic | null = null;
      let targetCartesian: Cartesian3 | null = null;

      if (scene.pickPositionSupported) {
        const pos = scene.pickPosition(click.position);
        if (pos) {
          carto = Cartographic.fromCartesian(pos);
          targetCartesian = pos;
        }
      }

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

      if (!carto || !targetCartesian) return;
      const lat = CesiumMath.toDegrees(carto.latitude);
      const lon = CesiumMath.toDegrees(carto.longitude);
      setClickedCoords({ lat, lon });

      const id = ++idRef.current;
      const startTime = JulianDate.now();
      const durationSec = METEOR_MS / 1000;
      const startCartesian = Cartesian3.fromDegrees(lon + 40, lat - 30, 800_000);

      const posProp: Property = new CallbackProperty((t: any) => {
        const dt = Math.max(0, JulianDate.secondsDifference(t, startTime));
        const u = Math.min(1, dt / durationSec);
        const x = 1 - Math.pow(1 - u, 2);
        const out = new Cartesian3();
        Cartesian3.lerp(startCartesian, targetCartesian, x, out);
        return out;
      }, false);

      setMeteors((prev) => [...prev, { id, posProp }]);

      // 🔥 Read latest settings when the impact happens
      const impact = getImpact();
      const { craterRadiusM, blastRadiusM } = computeRadii(impact);
      const effectiveBlastRadiusM = Math.max(blastRadiusM ?? 0, craterRadiusM ?? 0);
      setLatestImpactMeta({ id, lat, lon, blastRadiusM: effectiveBlastRadiusM });

      if (effectiveBlastRadiusM > 0) {
        setImpactSummaries((prev) => ({
          ...prev,
          [id]: { status: "loading" },
        }));

        estimateCasualties(lat, lon, effectiveBlastRadiusM)
          .then((data) => {
            setImpactSummaries((prev) => ({
              ...prev,
              [id]: { status: "ready", data },
            }));
          })
          .catch((err) => {
            console.error("Population density lookup failed", err);
            setImpactSummaries((prev) => ({
              ...prev,
              [id]: { status: "error", error: err instanceof Error ? err.message : String(err) },
            }));
          });
      } else {
        setImpactSummaries((prev) => ({
          ...prev,
          [id]: { status: "error", error: "Impact radius unavailable" },
        }));
      }

      console.log("[impact used for this click]", impact, {
        craterRadiusM,
        blastRadiusM,
        effectiveBlastRadiusM,
      });

      window.setTimeout(() => {
        setMeteors((prev) => prev.filter((m) => m.id !== id));
        setExplosions((prev) => [
          ...prev,
          { id, lat, lon, start: JulianDate.now(), craterRadiusM, blastRadiusM: effectiveBlastRadiusM },
        ]);
        setTimeout(() => {
          setTsunamis((prev) => [...prev, Cartesian3.fromDegrees(lon, lat)]);
        }, 2200);
      }, METEOR_MS);
    }, ScreenSpaceEventType.LEFT_CLICK);

    return () => handler.destroy();
  }, [viewerReady]);

  // --- UI renderers ---
  const renderMeteor = (m: any) => (
    <Entity key={`met-${m.id}`} position={m.posProp}>
      <PointGraphics
        color={Color.YELLOW}
        outlineColor={Color.WHITE}
        outlineWidth={1}
        pixelSize={8}
        disableDepthTestDistance={Infinity}
      />
    </Entity>
  );

  const latestImpactSummary = latestImpactMeta ? impactSummaries[latestImpactMeta.id] : undefined;
  const casualtyData = latestImpactSummary?.data;

  const casualtyOverlayTop = clickedCoords ? 60 : 10;

  const renderExplosion = (e: ExplosionEvent) => {
    const pos = Cartesian3.fromDegrees(e.lon, e.lat);
    const lifeSec = EXPLOSION_MS / 1000;

    // Use per-event blast radius (no more fixed MAX_RADIUS_M)
    const targetExplosionR = Math.min(e.blastRadiusM ?? 500_000, 10_000_000);

    const radiusProp = new CallbackProperty((t: any) => {
      const dt = Math.max(0, JulianDate.secondsDifference(t, e.start));
      const x = Math.min(1, dt / lifeSec);
      return Math.max(1, x * targetExplosionR);
    }, false);

    const materialProp = new ColorMaterialProperty(
      new CallbackProperty((t: any) => {
        const dt = Math.max(0, JulianDate.secondsDifference(t, e.start));
        const x = Math.min(1, dt / lifeSec);
        const alpha = 1 - x;
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
      <Entity key={`expl-${e.id}`} position={pos}>
        <EllipseGraphics
          semiMajorAxis={radiusProp}
          semiMinorAxis={radiusProp}
          material={materialProp}
          outline
          outlineColor={outlineColorProp as any}
          height={0}
        />
      </Entity>
    );
  };

  const resetGlobe = () => {
    setClickedCoords(null);
    setMeteors([]);
    setExplosions([]);
    setTsunamis([]);
    setImpactSummaries({});
    setLatestImpactMeta(null);
    const viewer = viewerRef.current?.cesiumElement;
    viewer?.camera.flyHome(1.5);
  };

  // ---------- Render ----------
  return (
    <>
      <ViewerComponent
        ref={viewerCallback as any}
        full
        terrainProvider={terrain}
        baseLayerPicker={false}
        animation
        timeline
        infoBox={false}
        selectionIndicator={false}
        navigationHelpButton={false}
        sceneModePicker={false}
        homeButton
        geocoder
        shouldAnimate
      >
        {satellite && <ImageryLayer imageryProvider={satellite} />}
        {meteors.map(renderMeteor)}
        {explosions.map(renderExplosion)}
      </ViewerComponent>

      {viewerReady && <RefreshButton onClick={resetGlobe} />}

      {clickedCoords && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 120,
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

      {latestImpactMeta && latestImpactSummary && (
        <div
          style={{
            position: "absolute",
            top: casualtyOverlayTop,
            left: 120,
            background: "rgba(12,16,24,0.75)",
            color: "white",
            padding: "10px 14px",
            borderRadius: "8px",
            fontSize: "13px",
            lineHeight: 1.5,
            width: 280,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Impact Assessment</div>
          <div>Blast radius: {(latestImpactMeta.blastRadiusM / 1000).toFixed(1)} km</div>
          {latestImpactSummary.status === "loading" && <div>Estimating population exposure...</div>}
          {latestImpactSummary.status === "error" && (
            <div style={{ color: "#fbd38d" }}>
              Population lookup failed: {latestImpactSummary.error ?? "Unknown error"}
            </div>
          )}
          {latestImpactSummary.status === "ready" && casualtyData && (
            <div>
              <div>
                Effective density: {(casualtyData.effectiveDensityPerSqKm ?? casualtyData.densityPerSqKm).toFixed(1)} ppl/km^2
              </div>
              {casualtyData.sampledMeanDensityPerSqKm !== undefined && (
                <div>
                  Sampled mean density (within 100 km): {casualtyData.sampledMeanDensityPerSqKm.toFixed(1)} ppl/km^2
                  {casualtyData.samplePointCount !== undefined && (
                    <span> ({casualtyData.samplePointCount} cells)</span>
                  )}
                </div>
              )}
              {casualtyData.localCellDensityPerSqKm !== undefined && (
                <div>
                  Local cell density: {casualtyData.localCellDensityPerSqKm.toFixed(1)} ppl/km^2
                  {casualtyData.localCellPopulation !== undefined && casualtyData.localCellAreaKm2 && (
                    <>
                      {" "}
                      ({Math.round(casualtyData.localCellPopulation).toLocaleString()} people in ~
                      {casualtyData.localCellAreaKm2.toFixed(3)} km^2)
                    </>
                  )}
                </div>
              )}
              {casualtyData.countryMeanDensityPerSqKm !== undefined && (
                <div>
                  Country mean density: {casualtyData.countryMeanDensityPerSqKm.toFixed(1)} ppl/km^2
                </div>
              )}
              <div>Impact area: {casualtyData.impactAreaKm2.toFixed(1)} km^2</div>
              <div style={{ fontWeight: 600 }}>
                Estimated casualties: {Math.round(casualtyData.estimatedCasualties).toLocaleString()}
              </div>
              {casualtyData.notes && (
                <div style={{ fontSize: "11px", marginTop: 4, opacity: 0.8 }}>
                  {casualtyData.notes}
                </div>
              )}
              <div style={{ fontSize: "11px", marginTop: 4, opacity: 0.8 }}>
                Source: {casualtyData.source}
              </div>
            </div>
          )}
        </div>
      )}

      {viewerReady &&
        tsunamis.map((pos, i) => (
          <Water
            key={i}
            viewer={viewerRef.current!.cesiumElement!}
            center={pos}
            duration={10}
            waves={5}
            waveAmplitude={0.2}
            waveWavelength={0.25}
            onEnd={() => setTsunamis((prev) => prev.filter((_, idx) => idx !== i))}
          />
        ))}

      {viewerReady &&
        explosions.map((e) => (
          <Crater
            key={`crater-${e.id}`}
            viewer={viewerRef.current!.cesiumElement!}
            center={Cartesian3.fromDegrees(e.lon, e.lat)}
            craterRadiusM={e.craterRadiusM}
            neo_reference_id={getImpact().neo_reference_id || "2000433"}
            onEnd={() => { }}
          />
        ))
      }
    </>
  );
}

