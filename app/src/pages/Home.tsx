// src/pages/Home.tsx
import { Link } from "react-router-dom";
import space from "../assets/space.avif"; 

export default function Home() {
    return (
        <div
            style={{
                position: "relative",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingTop: "100px",
                textAlign: "center",
                overflow: "hidden",
                color: "white",
                backgroundImage: `url(${space})`, 
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div style={{ position: "relative", zIndex: 1 }}>
                <h1 style={{ marginBottom: 8, fontSize: "2.5rem" }}>IMPACTOR</h1>
                <p style={{ margin: "8px 0 24px", fontSize: "1.1rem", color: "#ccc" }}>
                    Welcome! Choose a tool below to get started.
                </p>

                <div
                    style={{
                        display: "grid",
                        gap: 12,
                        maxWidth: 420,
                        width: "100%",
                        justifyItems: "center",
                    }}
                >
                    <Link
                        to="/globe"
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "14px 16px",
                            borderRadius: 10,
                            background: "rgba(30,30,30,0.7)",
                            color: "white",
                            textDecoration: "none",
                            border: "1px solid rgba(255,255,255,0.1)",
                            textAlign: "center",
                            backdropFilter: "blur(4px)",
                            transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.background = "rgba(80,80,80,0.8)")
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.background = "rgba(30,30,30,0.7)")
                        }
                    >
                        🌍 Open Globe Viewer
                    </Link>

                    <Link
                        to="/settings"
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "14px 16px",
                            borderRadius: 10,
                            background: "rgba(30,30,30,0.7)",
                            color: "white",
                            textDecoration: "none",
                            border: "1px solid rgba(255,255,255,0.1)",
                            textAlign: "center",
                            backdropFilter: "blur(4px)",
                            transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.background = "rgba(80,80,80,0.8)")
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.background = "rgba(30,30,30,0.7)")
                        }
                    >
                        ☄️ Asteroid Settings
                    </Link>
                </div>
            </div>
        </div>
    );
}
