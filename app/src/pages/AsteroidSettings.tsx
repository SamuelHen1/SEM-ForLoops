// src/pages/AsteroidSettings.tsx
import { useState } from "react";

export default function AsteroidSettings() {
    const [diameter, setDiameter] = useState<number>(100); // meters
    const [velocity, setVelocity] = useState<number>(20000); // m/s
    const [density, setDensity] = useState<number>(3000); // kg/m^3 (stony default)
    const [angle, setAngle] = useState<number>(45); // degrees

    return (
        <div style={{ padding: 24, maxWidth: 560 }}>
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
                    Entry angle (°)
                    <input
                        type="number"
                        value={angle}
                        onChange={(e) => setAngle(Number(e.target.value))}
                        style={{ width: "100%", padding: 8, marginTop: 6 }}
                    />
                </label>

                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                    <button
                        style={{ padding: "10px 14px", borderRadius: 8, cursor: "pointer" }}
                        onClick={() => {
                            console.log("Asteroid settings saved:", { diameter, velocity, density, angle });
                            alert("Settings saved (check console). Next step: wire to Globe.");
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
                            setAngle(45);
                        }}
                    >
                        Reset defaults
                    </button>
                </div>
            </div>
        </div>
    );
}
