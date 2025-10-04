// src/pages/Home.tsx
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div style={{ padding: 24 }}>
            <h1 style={{ marginBottom: 8 }}>Meteor Madness</h1>
            <p style={{ margin: "8px 0 24px" }}>
                Welcome! Choose a tool below to get started.
            </p>

            <div style={{ display: "grid", gap: 12, maxWidth: 420 }}>
                <Link
                    to="/globe"
                    style={{
                        display: "block",
                        padding: "14px 16px",
                        borderRadius: 10,
                        background: "#111",
                        color: "white",
                        textDecoration: "none",
                        border: "1px solid #2a2a2a",
                    }}
                >
                    🌍 Open Globe viewer
                </Link>

                <Link
                    to="/settings"
                    style={{
                        display: "block",
                        padding: "14px 16px",
                        borderRadius: 10,
                        background: "#111",
                        color: "white",
                        textDecoration: "none",
                        border: "1px solid #2a2a2a",
                    }}
                >
                    ☄️ Asteroid settings
                </Link>
            </div>
        </div>
    );
}
