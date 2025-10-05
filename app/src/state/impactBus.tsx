// src/state/impactBus.ts
export type ImpactParams = {
    diameterM: number;     // asteroid diameter (m)
    velocityMS: number;    // impact speed (m/s)
    densityKgM3: number;   // kg/m^3
    energyMt?: number | null; // if asteroid has a known max impact energy (Mt TNT)
    material?: "rock" | "soil";
    angleDeg?: number;     // 90 = vertical
    neo_reference_id?: string; // <-- add this
};

type Listener = (p: ImpactParams) => void;

let state: ImpactParams = {
    diameterM: 100,
    velocityMS: 20000,
    densityKgM3: 3000,
    energyMt: null,
    material: "rock",
    angleDeg: 45,
};

const listeners = new Set<Listener>();

export function getImpact(): ImpactParams {
    return state;
}

export function setImpact(patch: Partial<ImpactParams>) {
    state = { ...state, ...patch };
    listeners.forEach((fn) => fn(state));
}

export function subscribeImpact(fn: Listener) {
    listeners.add(fn);
    // fire once so subscribers get current
    fn(state);
    return () => listeners.delete(fn);
}
