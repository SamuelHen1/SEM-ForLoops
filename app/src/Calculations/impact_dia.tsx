//import type { NEO } from "../Types/Neo"; // Correct named import, no .tsx needed for interface
import { getAverageImpactEnergyById } from "./utilities"; // Correct named import

export function getCraterDiameterById(neo_reference_id: string): number | null {
  const avgEnergy = getAverageImpactEnergyById(neo_reference_id);
  if (avgEnergy === null) return null;
  return 74 * Math.pow(avgEnergy, 0.294);
}
