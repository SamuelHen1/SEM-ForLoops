// src/utils/impact.ts
import type { ImpactParams } from "../state/impactBus";


// === π-scaling crater diameter (Earth, simple crater regime) =================
export function estimateCraterDiameterM(
    diameterM: number,        // impactor diameter
    velocityMS: number,       // impact speed
    rhoImpKgM3: number,       // impactor density
    rhoTargetKgM3 = 2500,     // typical rock/soil
    g = 9.81,                 // m/s^2
    angleDeg = 45             // impact angle to horizontal
): number {
    if (!diameterM || !velocityMS || !rhoImpKgM3) return 0;

    const theta = (angleDeg * Math.PI) / 180;

    // Transient crater scaling (π-scaling style) for rock targets (simple regime)
    const D_transient =
        1.8 *
        Math.pow(g, -0.22) *
        Math.pow(velocityMS * Math.sin(theta), 0.44) *
        Math.pow(rhoImpKgM3 / rhoTargetKgM3, 1 / 3) *
        Math.pow(diameterM, 0.78);

    // Final simple crater is a bit larger than transient
    const D_final = 1.25 * D_transient;
    return D_final; // meters
}

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

export function computeRadii(p: ImpactParams) {
    // Keep KE for blast/thermal effects
    const KE = kineticEnergyJ(p);

    // Crater size from π-scaling (depends on size, speed, density, angle, gravity)
    const craterDiameterM = estimateCraterDiameterM(
        p.diameterM,
        p.velocityMS,
        p.densityKgM3,
        2500,                 // target density (rock/soil)
        9.81,                 // Earth gravity
        p.angleDeg ?? 45
    );
    const craterRadiusM = craterDiameterM / 2;

    // Blast radius: keep your current visual scaling (energy → damage footprint)
    const blastRadiusM = craterRadiusM * 6; // tweak for visuals if you like

    return { KE, craterRadiusM, blastRadiusM };
}

