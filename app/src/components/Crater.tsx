import { useEffect, useRef } from "react";
import {
  Cartesian3,
  Primitive,
  GeometryInstance,
  CircleGeometry,
  MaterialAppearance,
  Material,
  Viewer,
  Color,
} from "cesium";
import { getCraterDiameterById } from "../Calculations/impact_dia";

interface CraterProps {
  viewer: Viewer;
  center: Cartesian3;
  neo_reference_id: string;
  onEnd?: () => void;
}

export default function Crater({ viewer, center, neo_reference_id, onEnd }: CraterProps) {
  const primitivesRef = useRef<Primitive[]>([]);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!viewer) return;

    const diameter = getCraterDiameterById(neo_reference_id) ?? 5000;
    const radius = diameter / 2;

    const depressionMaterial = new Material({
      fabric: {
        type: "CraterShadow",
        uniforms: { color: new Color(0.05, 0.05, 0.05, 0.8) },
        source: `
          czm_material czm_getMaterial(czm_materialInput materialInput) {
            czm_material m = czm_getDefaultMaterial(materialInput);
            m.diffuse = color.rgb;
            m.alpha = color.a;
            return m;
          }
        `,
      },
    });

    const lavaMaterial = new Material({
      fabric: {
        type: "LavaGlow",
        uniforms: { color: new Color(1.0, 0.3, 0.0, 0.8), time: 0, radiusOffset: 0 },
        source: `
          uniform float time;
          uniform float radiusOffset;
          uniform vec4 color;
          czm_material czm_getMaterial(czm_materialInput materialInput){
            czm_material m = czm_getDefaultMaterial(materialInput);
            float pulse = 0.5 + 0.5 * sin(time * 5.0);
            m.diffuse = color.rgb * pulse;
            m.alpha = color.a * (1.0 - radiusOffset);
            return m;
          }
        `,
      },
    });

    // Static shadow
    const shadowPrim = new Primitive({
      geometryInstances: new GeometryInstance({
        geometry: new CircleGeometry({ center, radius, vertexFormat: MaterialAppearance.VERTEX_FORMAT }),
      }),
      appearance: new MaterialAppearance({ material: depressionMaterial, translucent: true, flat: true }),
      asynchronous: false,
    });
    primitivesRef.current.push(shadowPrim);
    viewer.scene.primitives.add(shadowPrim);

    // Lava rings for flow
    const lavaRings = Array.from({ length: 5 }, (_, i) => {
      const r = radius * 0.4;
      const prim = new Primitive({
        geometryInstances: new GeometryInstance({
          geometry: new CircleGeometry({ center, radius: r, vertexFormat: MaterialAppearance.VERTEX_FORMAT }),
        }),
        appearance: new MaterialAppearance({ material: lavaMaterial, translucent: true, flat: true }),
        asynchronous: false,
      });
      primitivesRef.current.push(prim);
      viewer.scene.primitives.add(prim);
      return { prim, radius: r, offset: i * 0.1 };
    });

    let startTime: number | undefined;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const t = (time - startTime) * 0.001; // seconds

      lavaRings.forEach((ring, i) => {
        const growth = radius * 0.5 * (t - i * 0.2); // delay each ring slightly
        if (growth > 0) {
          ring.prim.geometryInstances = new GeometryInstance({
            geometry: new CircleGeometry({ center, radius: ring.radius + growth, vertexFormat: MaterialAppearance.VERTEX_FORMAT }),
          });
          lavaMaterial.uniforms.time = t;
          lavaMaterial.uniforms.radiusOffset = Math.min(1, growth / radius);
        }
      });

      viewer.scene.requestRender();
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      primitivesRef.current.forEach((p) => viewer.scene.primitives.remove(p));
      primitivesRef.current = [];
      if (onEnd) onEnd();
    };
  }, [viewer, center, neo_reference_id, onEnd]);

  return null;
}
