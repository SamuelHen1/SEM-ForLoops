import { useState, useEffect } from "react";
import raw from "../data/neos_enriched.json";
import { setImpact } from "../state/impactBus";

type NEO = {
  neo_reference_id: string;
  name: string;
  mass_max_kg: number;
  impact_energy_max_Mt: number;
  estimated_diameter_km_mean: number;
};

export default function AsteroidSettings() {
  // Persistent state
  const [velocity, setVelocity] = useState<number>(() => {
    const v = localStorage.getItem("velocity");
    return v ? Number(v) : 20000;
  });
  const [density, setDensity] = useState<number>(() => {
    const d = localStorage.getItem("density");
    return d ? Number(d) : 3000;
  });
  const [energy, setEnergy] = useState<number>(() => {
    const e = localStorage.getItem("energy");
    return e ? Number(e) : 500000000;
  });
  const [selectedNeoId, setSelectedNeoId] = useState<string>(() => {
    return localStorage.getItem("selectedNeoId") || "";
  });

  // Temporary state for form, always initialized from persistent state
  const [tempVelocity, setTempVelocity] = useState<number>(() => {
    const v = localStorage.getItem("velocity");
    return v ? Number(v) : 20000;
  });
  const [tempDensity, setTempDensity] = useState<number>(() => {
    const d = localStorage.getItem("density");
    return d ? Number(d) : 3000;
  });
  const [tempEnergy, setTempEnergy] = useState<number>(() => {
    const e = localStorage.getItem("energy");
    return e ? Number(e) : 500000000;
  });
  const [tempNeoId, setTempNeoId] = useState<string>(() => {
    return localStorage.getItem("selectedNeoId") || "";
  });

  const [asteroids, setAsteroids] = useState<NEO[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const items: NEO[] = Array.isArray(raw) ? (raw as NEO[]) : (raw as any).items ?? [];
      setAsteroids(items);
    } catch (e: any) {
      setError(e?.message || "Failed to parse asteroids JSON");
    }
  }, []);

  // If no asteroid selected, use a default ID after asteroids are loaded
  useEffect(() => {
    if (!selectedNeoId && asteroids.length > 0) {
      setSelectedNeoId(asteroids[0].neo_reference_id);
      setTempNeoId(asteroids[0].neo_reference_id);
    }
  }, [asteroids, selectedNeoId]);

  // Apply a preset asteroid to temp state only
  const applyAsteroid = (neo: NEO) => {
    setTempEnergy(Number(neo.impact_energy_max_Mt) || 0);
    setTempDensity(3000);
    setTempNeoId(neo.neo_reference_id);
    // velocity stays as the user’s current value (or set one here if your dataset has it)
  };

  // Update impact settings whenever velocity, density, energy, or selectedNeoId changes
  useEffect(() => {
    setImpact({
      velocityMS: velocity,
      densityKgM3: density,
      energyMt: energy > 0 ? energy : null,
      material: "rock",
      angleDeg: 45,
      neo_reference_id: selectedNeoId,
    });
  }, [velocity, density, energy, selectedNeoId]);

  // Save button applies temp state to persistent state
  const handleSave = () => {
    setVelocity(tempVelocity);
    setDensity(tempDensity);
    setEnergy(tempEnergy);
    setSelectedNeoId(tempNeoId);
    localStorage.setItem("velocity", String(tempVelocity));
    localStorage.setItem("density", String(tempDensity));
    localStorage.setItem("energy", String(tempEnergy));
    localStorage.setItem("selectedNeoId", tempNeoId);
    setImpact({
      velocityMS: tempVelocity,
      densityKgM3: tempDensity,
      energyMt: tempEnergy > 0 ? tempEnergy : null,
      material: "rock",
      angleDeg: 45,
      neo_reference_id: tempNeoId,
    });
    alert("Settings saved (check console).");
    console.log("Asteroid settings saved:", { tempVelocity, tempDensity, tempEnergy, tempNeoId });
  };

  // Reset button resets temp state only
  const handleReset = () => {
    setTempVelocity(20000);
    setTempDensity(3000);
    setTempEnergy(500000000);
    setTempNeoId(asteroids[0]?.neo_reference_id || "");
  };

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 1000,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 280px",
        gap: 24,
      }}
    >
      {/* LEFT: Inputs */}
      <div>
        <h2>Asteroid Settings</h2>
        <p>Configure the impactor parameters. (These values feed the Globe via the impact bus.)</p>

        <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
          {/* REMOVE diameter input */}
          {/* <label>
            Diameter (m)
            <input
              type="number"
              value={tempDiameter}
              onChange={(e) => setTempDiameter(Number(e.target.value))}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
              min={0}
            />
          </label> */}

          <label>
            Velocity (m/s)
            <input
              type="number"
              value={tempVelocity}
              onChange={(e) => setTempVelocity(Number(e.target.value))}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
              min={0}
            />
          </label>

          <label>
            Density (kg/m³)
            <input
              type="number"
              value={tempDensity}
              onChange={(e) => setTempDensity(Number(e.target.value))}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
              min={0}
            />
          </label>

          <label>
            Energy (Mt TNT)
            <input
              type="number"
              value={tempEnergy}
              onChange={(e) => setTempEnergy(Number(e.target.value))}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
              min={0}
            />
          </label>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button
              style={{ padding: "10px 14px", borderRadius: 8, cursor: "pointer" }}
              onClick={handleSave}
            >
              Save
            </button>

            <button
              style={{ padding: "10px 14px", borderRadius: 8, cursor: "pointer" }}
              onClick={handleReset}
            >
              Reset defaults
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Presets */}
      <aside
        style={{
          borderLeft: "1px solid #ddd",
          paddingLeft: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Saved Asteroids</h3>

        {error && <div style={{ color: "crimson" }}>Error: {error}</div>}

        {!error && asteroids.length === 0 && (
          <div>No asteroids found in <code>neos_enriched.json</code>.</div>
        )}

        {!error &&
          asteroids.map((neo, i) => (
            <button
              key={`${neo.neo_reference_id || neo.name}-${i}`}
              onClick={() => applyAsteroid(neo)}
              style={{
                textAlign: "left",
                padding: "10px 12px",
                borderRadius: 8,
                cursor: "pointer",
                border: "1px solid #ccc",
                background: "#f9f9f9",
              }}
              title={`mass: ${neo.mass_max_kg} kg, energy: ${neo.impact_energy_max_Mt} Mt, diameter: ${neo.estimated_diameter_km_mean} km`}
            >
              {neo.name}
            </button>
          ))}
      </aside>
    </div>
  );
}