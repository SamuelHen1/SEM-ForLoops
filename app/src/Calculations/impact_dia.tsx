// src/calculations/impact_dia.ts
import neoList from "../data/neos_enriched.json";

interface NEO {
  neo_reference_id: string;
  name: string;
  impact_energy_min_Mt: number;
  impact_energy_max_Mt: number;
}

// Empirical scaling law: D ≈ 74 · E^0.294  (D in meters, E in megatons)
function craterDiameterMeters(E_Mt: number): number {
  return 74 * Math.pow(E_Mt, 0.294);
}

export function getCraterDiameterById(neo_reference_id: string): number | null {
  const neo = (neoList as NEO[]).find(n => n.neo_reference_id === neo_reference_id);
  if (!neo) return null;
  const avgEnergy = (neo.impact_energy_min_Mt + neo.impact_energy_max_Mt) / 2;
  return craterDiameterMeters(avgEnergy);
}
