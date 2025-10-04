// New function to get average impact energy
import neoList from "../data/neos_enriched.json";
import type { NEO } from "../Types/Neo";

export function getAverageImpactEnergyById(neo_reference_id: string): number | null {
  const neo = (neoList as NEO[]).find(n => n.neo_reference_id === neo_reference_id);
  if (!neo) return null;
  return (neo.impact_energy_min_Mt + neo.impact_energy_max_Mt) / 2;
}

