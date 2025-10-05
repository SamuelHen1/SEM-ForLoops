import { useState, useEffect } from "react";
import raw from "../data/neos_enriched.json"; // <-- adjust path if needed

type NEO = {
  neo_reference_id: string
  name: string;
  mass_max_kg: number;
  impact_energy_max_Mt: number;
  estimated_diameter_km_mean: number;
};

export default function AsteroidSettings() {
  const [diameter, setDiameter] = useState<number>(100); // meters
  const [velocity, setVelocity] = useState<number>(20000); // m/s
  const [density, setDensity] = useState<number>(3000); // kg/m³ (used as mass here)
  const [energy, setEnergy] = useState<number>(0); // Mt TNT

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

  const applyAsteroid = (neo: NEO) => {
    setDensity(Number(neo.mass_max_kg) || 0);
    setEnergy(Number(neo.impact_energy_max_Mt) || 0);
    setDiameter((Number(neo.estimated_diameter_km_mean) || 0) * 1000); // km → m
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
      {/* LEFT SIDE - Input Fields */}
      <div>
        <h2>Asteroid Settings</h2>
        <p>Configure the impactor parameters. (Hook this up to the Globe later.)</p>

        <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
          <label>
            Diameter (m)
            <input
              type="number"
              value={diameter}
              onChange={(e) => setDiameter(Number(e.target.value))}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>

          <label>
            Velocity (m/s)
            <input
              type="number"
              value={velocity}
              onChange={(e) => setVelocity(Number(e.target.value))}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>

          <label>
            Density (kg/m³)
            <input
              type="number"
              value={density}
              onChange={(e) => setDensity(Number(e.target.value))}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>

          <label>
            Energy (Mt TNT)
            <input
              type="number"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </label>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button
              style={{ padding: "10px 14px", borderRadius: 8, cursor: "pointer" }}
              onClick={() => {
                console.log("Asteroid settings saved:", {
                  diameter,
                  velocity,
                  density,
                  energy,
                });
                alert("Settings saved (check console).");
              }}
            >
              Save
            </button>

            <button
              style={{ padding: "10px 14px", borderRadius: 8, cursor: "pointer" }}
              onClick={() => {
                setDiameter(100);
                setVelocity(20000);
                setDensity(3000);
                setEnergy(0);
              }}
            >
              Reset defaults
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Asteroid Buttons */}
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
              key={`${neo.name}-${i}`}
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
