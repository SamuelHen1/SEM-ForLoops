// src/utils/impact.ts
import type { ImpactParams } from "../state/impactBus";

/** Convert kinetic energy to crater radius (meters). */
export function craterRadiusFromKE(KE_J: number, material: "rock" | "soil" = "rock", angleDeg = 45) {
    const exponent = 1 / 3; // cube-root scaling
    const K = material === "soil" ? 0.0010 : 0.0005; // tune for your visuals
    const angleFactor = Math.sin((angleDeg * Math.PI) / 180); // shallow -> smaller
    const diameterM = Math.max(1, K * Math.pow(KE_J, exponent) * angleFactor);
    return diameterM / 2;
}

/** Compute KE (J). If energyMt provided, prefer that. */
export function kineticEnergyJ(p: ImpactParams) {
    if (p.energyMt && p.energyMt > 0) {
        // 1 Mt TNT = 4.184e15 J
        return p.energyMt * 4.184e15;
    }
    // Otherwise compute from m,v and density as a sphere
    const r = p.diameterM / 2;
    const volume = (4 / 3) * Math.PI * r ** 3; // m^3
    const mass = volume * p.densityKgM3;     // kg
    return 0.5 * mass * p.velocityMS ** 2;
}

/** Convenience: directly get crater & (optional) blast radius. */
export function computeRadii(p: ImpactParams) {
    const KE = kineticEnergyJ(p);
    const craterRadiusM = craterRadiusFromKE(KE, p.material ?? "rock", p.angleDeg ?? 45);

    // Optional: make a blast radius that scales a bit larger than crater
    const blastRadiusM = craterRadiusM * 6;  // tweak to taste
    return { KE, craterRadiusM, blastRadiusM };
}
