import * as fs from 'fs';
import * as path from 'path';

// Define the shape of your JSON objects
interface NEO {
  neo_reference_id: string;
  name: string;
  impact_energy_min_Mt: number;
  impact_energy_max_Mt: number;
  // other fields omitted for brevity
}

// --- Crater calculation function ---
function craterDiameterMeters(E_Mt: number): number {
  // Empirical scaling law: D ~ E^0.294
  // D in meters, E in megatons
  return 74 * Math.pow(E_Mt, 0.294);
}

// --- Read and parse the JSON file ---
const jsonFilePath = path.join(__dirname, '../neos_enriched.json'); // adjust filename/path
const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
const neoList: NEO[] = JSON.parse(jsonData);

// --- Exported function to get crater diameter by NEO id ---
export function getCraterDiameterById(neo_reference_id: string): number | null {
  const neo = neoList.find(n => n.neo_reference_id === neo_reference_id);
  if (!neo) return null;
  const avgEnergy = (neo.impact_energy_min_Mt + neo.impact_energy_max_Mt) / 2;
  return craterDiameterMeters(avgEnergy);
}