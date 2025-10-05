import { useEffect, useMemo, useState } from "react";
import raw from "../data/neos_enriched.json";
import { setImpact } from "../state/impactBus";

type CloseApproach = {
  relative_velocity_kms?: number;
};

type NEO = {
  neo_reference_id: string;
  name: string;
  // dataset fields used
  estimated_diameter_km_mean?: number;
  density_assumed_kg_m3?: number;
  close_approach?: CloseApproach;
};

const DEFAULTS = {
  diameterM: 10000,     // 10 km
  velocityMS: 20000,  // 20 km/s
  densityKgM3: 3000,  // stony asteroid assumption
};

function computeEnergyMt(diameterM: number, velocityMS: number, densityKgM3: number): number {
  // KE = 1/2 * m * v^2, with m = rho * (4/3 * pi * r^3)
  const r = diameterM / 2;
  const volume = (4 / 3) * Math.PI * r * r * r; // m^3
  const mass = densityKgM3 * volume;            // kg
  const keJ = 0.5 * mass * velocityMS * velocityMS; // J
  // 1 Mt TNT = 4.184e15 J
  return keJ / 4.184e15;
}

export default function AsteroidSettings() {
  // Persistent state
  const [diameterM, setDiameterM] = useState<number>(() => {
    const v = localStorage.getItem("diameterM");
    return v ? Number(v) : DEFAULTS.diameterM;
  });
  const [velocityMS, setVelocityMS] = useState<number>(() => {
    const v = localStorage.getItem("velocity");
    return v ? Number(v) : DEFAULTS.velocityMS;
  });
  const [densityKgM3, setDensityKgM3] = useState<number>(() => {
    const d = localStorage.getItem("density");
    return d ? Number(d) : DEFAULTS.densityKgM3;
  });
  const [selectedNeoId, setSelectedNeoId] = useState<string>(() => {
    return localStorage.getItem("selectedNeoId") || "";
  });

  // Temp state (form)
  const [tempDiameterM, setTempDiameterM] = useState<number>(diameterM);
  const [tempVelocityMS, setTempVelocityMS] = useState<number>(velocityMS);
  const [tempDensityKgM3, setTempDensityKgM3] = useState<number>(densityKgM3);
  const [tempNeoId, setTempNeoId] = useState<string>(selectedNeoId);

  const [asteroids, setAsteroids] = useState<NEO[]>([]);
  const [error, setError] = useState<string | null>(null);

  // load NEO list
  useEffect(() => {
    try {
      const items: NEO[] = Array.isArray(raw) ? (raw as NEO[]) : (raw as any).items ?? [];
      setAsteroids(items);
    } catch (e: any) {
      setError(e?.message || "Failed to parse asteroids JSON");
    }
  }, []);

  // default select first NEO if none selected
  useEffect(() => {
    if (!selectedNeoId && asteroids.length > 0) {
      setSelectedNeoId(asteroids[0].neo_reference_id);
      setTempNeoId(asteroids[0].neo_reference_id);
    }
  }, [asteroids, selectedNeoId]);

  // Energy is always derived from current temp inputs
  const tempEnergyMt = useMemo(
      () => computeEnergyMt(tempDiameterM, tempVelocityMS, tempDensityKgM3),
      [tempDiameterM, tempVelocityMS, tempDensityKgM3]
  );

  const applyAsteroid = (neo: NEO) => {
    const dM =
        neo.estimated_diameter_km_mean && neo.estimated_diameter_km_mean > 0
            ? neo.estimated_diameter_km_mean * 1000
            : DEFAULTS.diameterM;

    const vMS =
        neo.close_approach?.relative_velocity_kms && neo.close_approach.relative_velocity_kms > 0
            ? neo.close_approach.relative_velocity_kms * 1000
            : DEFAULTS.velocityMS;

    const rho = neo.density_assumed_kg_m3 && neo.density_assumed_kg_m3 > 0
        ? neo.density_assumed_kg_m3
        : DEFAULTS.densityKgM3;

    setTempDiameterM(dM);
    setTempVelocityMS(vMS);
    setTempDensityKgM3(rho);
    setTempNeoId(neo.neo_reference_id);
  };

  const handleSave = () => {
    // persist
    localStorage.setItem("diameterM", String(tempDiameterM));
    localStorage.setItem("velocity", String(tempVelocityMS));
    localStorage.setItem("density", String(tempDensityKgM3));
    localStorage.setItem("selectedNeoId", tempNeoId || "");

    // update memory copies
    setDiameterM(tempDiameterM);
    setVelocityMS(tempVelocityMS);
    setDensityKgM3(tempDensityKgM3);
    setSelectedNeoId(tempNeoId);

    // push to impact bus (include derived energyMt for consistency)
    setImpact({
      diameterM: tempDiameterM,
      velocityMS: tempVelocityMS,
      densityKgM3: tempDensityKgM3,
      energyMt: tempEnergyMt,
      material: "rock",
      angleDeg: 45,
      neo_reference_id: tempNeoId || undefined,
    });

    alert("Settings saved (derived energy updated). Check console for details.");
    console.log("[Saved impact params]", {
      diameterM: tempDiameterM,
      velocityMS: tempVelocityMS,
      densityKgM3: tempDensityKgM3,
      derivedEnergyMt: tempEnergyMt,
      neo_reference_id: tempNeoId || undefined,
    });
  };

  const handleReset = () => {
    setTempDiameterM(DEFAULTS.diameterM);
    setTempVelocityMS(DEFAULTS.velocityMS);
    setTempDensityKgM3(DEFAULTS.densityKgM3);
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
          <h2 style={{ marginBottom: 16 }}>Impact Parameters</h2>

          <div style={{ display: "grid", gap: 14, maxWidth: 480 }}>
            <label>
              Diameter (m)
              <input
                  type="number"
                  value={tempDiameterM}
                  onChange={(e) => setTempDiameterM(Math.max(0, Number(e.target.value)))}
                  style={{ width: "100%", padding: 8, marginTop: 6 }}
                  min={0}
              />
            </label>

            <label>
              Velocity (m/s)
              <input
                  type="number"
                  value={tempVelocityMS}
                  onChange={(e) => setTempVelocityMS(Math.max(0, Number(e.target.value)))}
                  style={{ width: "100%", padding: 8, marginTop: 6 }}
                  min={0}
              />
            </label>

            <label>
              Density (kg/m³)
              <input
                  type="number"
                  value={tempDensityKgM3}
                  onChange={(e) => setTempDensityKgM3(Math.max(0, Number(e.target.value)))}
                  style={{ width: "100%", padding: 8, marginTop: 6 }}
                  min={0}
              />
            </label>

            <label>
              Derived Energy (Mt TNT)
              <input
                  type="number"
                  value={Number.isFinite(tempEnergyMt) ? tempEnergyMt : 0}
                  readOnly
                  style={{ width: "100%", padding: 8, marginTop: 6, background: "#f5f5f5" }}
              />
            </label>

            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button style={{ padding: "10px 14px", borderRadius: 8, cursor: "pointer" }} onClick={handleSave}>
                Save
              </button>
              <button style={{ padding: "10px 14px", borderRadius: 8, cursor: "pointer" }} onClick={handleReset}>
                Reset defaults
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: NEO presets */}
        <aside>
          <h3 style={{ marginBottom: 12 }}>Preset Asteroids</h3>
          {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

          <div style={{ display: "grid", gap: 8, maxHeight: 540, overflow: "auto" }}>
            {asteroids.map((neo) => {
              const dM =
                  neo.estimated_diameter_km_mean && neo.estimated_diameter_km_mean > 0
                      ? neo.estimated_diameter_km_mean * 1000
                      : undefined;
              const vMS =
                  neo.close_approach?.relative_velocity_kms && neo.close_approach.relative_velocity_kms > 0
                      ? neo.close_approach.relative_velocity_kms * 1000
                      : undefined;
              const rho = neo.density_assumed_kg_m3;

              const previewMt = dM && vMS && rho ? computeEnergyMt(dM, vMS, rho) : undefined;

              return (
                  <button
                      key={neo.neo_reference_id}
                      onClick={() => applyAsteroid(neo)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 4,
                        padding: "10px 12px",
                        borderRadius: 8,
                        cursor: "pointer",
                        border: "1px solid #ccc",
                        background: neo.neo_reference_id === tempNeoId ? "#e8fff0" : "#f9f9f9",
                      }}
                      title={`diam≈${dM ? dM.toLocaleString() + " m" : "n/a"}, v≈${vMS ? (vMS / 1000).toFixed(2) + " km/s" : "n/a"}, ρ≈${rho ?? "n/a"} kg/m³`}
                  >
                    <div style={{ fontWeight: 600 }}>{neo.name}</div>
                    <div style={{ fontSize: 12, color: "#444" }}>
                      {dM ? `D≈${dM.toLocaleString()} m` : "D=n/a"} ·{" "}
                      {vMS ? `v≈${(vMS / 1000).toFixed(2)} km/s` : "v=n/a"} ·{" "}
                      {typeof rho === "number" ? `ρ≈${rho} kg/m³` : "ρ=n/a"}
                      {typeof previewMt === "number" ? ` · E≈${previewMt.toExponential(2)} Mt` : ""}
                    </div>
                  </button>
              );
            })}
          </div>
        </aside>
      </div>
  );
}
