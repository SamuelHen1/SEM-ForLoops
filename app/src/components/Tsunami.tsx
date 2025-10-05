// src/components/Tsunami.tsx
import { useEffect, useRef } from "react";
import tsunamiAudioUrl from "/Tsunami.mp3";

import {
  Primitive,
  GeometryInstance,
  CircleGeometry,
  MaterialAppearance,
  Material,
  Color,
  Cartesian3,
  Cartographic,
  VertexFormat,
  type Viewer,
} from "cesium";

interface WaterProps {
  viewer: Viewer;
  center: Cartesian3;
  initialRadius?: number;
  waves?: number;
  duration?: number;
  waveAmplitude?: number;
  waveWavelength?: number;
  onEnd?: () => void;
}

export default function Water({
  viewer,
  center,
  initialRadius = 2_000_000,
  waves = 5,
  duration = 10,
  waveAmplitude = 0.2,
  waveWavelength = 0.25,
  onEnd,
}: WaterProps) {
  const primitivesRef = useRef<Primitive[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const rippleRadiiRef = useRef<number[]>([]);
  const frameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!viewer) return;

    // Initialize audio once
    if (!audioRef.current) {
      audioRef.current = new Audio(tsunamiAudioUrl);
      audioRef.current.volume = 0.6;
    }

    // Play audio immediately when tsunami is spawned
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      // likely autoplay blocked until user gesture
    });

    const globe = viewer.scene.globe;
    const maxRadius = initialRadius * 5;

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
      } as any,
    } as any);

    rippleRadiiRef.current = Array.from({ length: waves }, (_, i) =>
      i === 0 ? initialRadius * 0.05 : initialRadius - i * (initialRadius / waves) + randomOffsets[i]
    );

    function isRippleOverWater(centerCarto: Cartographic, radius: number, samplePoints = 12) {
      for (let i = 0; i < samplePoints; i++) {
        const angle = (i / samplePoints) * 2 * Math.PI;
        const lat = centerCarto.latitude + (radius / 6378137.0) * Math.cos(angle);
        const lon = centerCarto.longitude + (radius / 6378137.0) * Math.sin(angle);
        const height = globe.getHeight(new Cartographic(lon, lat));
        if (height && height > 0) return false;
      }
      return true;
    }

    function animate(time: number) {
      if (startTimeRef.current === null) startTimeRef.current = time;
      const t = (time - startTimeRef.current) * 0.001;
      const alphaBase = Math.max(0, 1 - t / duration);

      // Clear previous frame primitives
      primitivesRef.current.forEach((p) => viewer.scene.primitives.remove(p));
      primitivesRef.current = [];

      const centerCarto = Cartographic.fromCartesian(center);
      const growthFactor = t / duration;

      // Recompute radii without an unused-map parameter
      const newRadii: number[] = new Array(rippleRadiiRef.current.length);
      for (let idx = 0; idx < rippleRadiiRef.current.length; idx++) {
        newRadii[idx] =
          initialRadius * 0.05 +
          (maxRadius - initialRadius * 0.05) * growthFactor -
          idx * (initialRadius / waves) +
          randomOffsets[idx];
      }
      rippleRadiiRef.current = newRadii;

      rippleRadiiRef.current.forEach((radius, idx) => {
        if (radius <= 0 || alphaBase <= 0) return;
        if (!isRippleOverWater(centerCarto, radius)) return;

        const geom = new CircleGeometry({
          center,
          radius,
          vertexFormat: VertexFormat.POSITION_AND_ST,
        } as any);

        const rippleAlpha = alphaBase * (1 - (idx / waves) * 0.5 + 0.5);

        (material as any).uniforms.time = t + phaseOffsets[idx];
        (material as any).uniforms.alpha = rippleAlpha;

        const prim = new Primitive({
          geometryInstances: new GeometryInstance({ geometry: geom }),
          appearance: new MaterialAppearance({
            material,
            translucent: true,
            flat: true,
          } as any),
          asynchronous: false,
        } as any);

        primitivesRef.current.push(prim);
        viewer.scene.primitives.add(prim);
      });

      viewer.scene.requestRender();

      if (alphaBase > 0) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        // cleanup at end
        primitivesRef.current.forEach((p) => viewer.scene.primitives.remove(p));
        primitivesRef.current = [];
        onEnd?.();
      }
    }

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      primitivesRef.current.forEach((p) => viewer.scene.primitives.remove(p));
      primitivesRef.current = [];
      frameRef.current = null;
      startTimeRef.current = null;
    };
  }, [viewer, center, initialRadius, waves, duration, waveAmplitude, waveWavelength, onEnd]);

  return null;
}
