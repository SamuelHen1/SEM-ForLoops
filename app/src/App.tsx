// src/App.tsx
import { Link, Routes, Route, NavLink, Navigate } from "react-router-dom";
import GlobePage from "./pages/GlobePage";
import AsteroidSettings from "./pages/AsteroidSettings";

export default function App() {
  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "10px 16px", background: "#0b0b0b", color: "white" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link to="/globe" style={{ color: "white", textDecoration: "none", fontWeight: 700 }}>
            Meteor Madness
          </Link>
          <nav style={{ display: "flex", gap: 12 }}>
            <NavLink
              to="/globe"
              style={({ isActive }) => ({ color: isActive ? "#9ae6b4" : "#ddd", textDecoration: "none" })}
            >
              Globe
            </NavLink>
            <NavLink
              to="/settings"
              style={({ isActive }) => ({ color: isActive ? "#9ae6b4" : "#ddd", textDecoration: "none" })}
            >
              Asteroid Settings
            </NavLink>
          </nav>
        </div>
      </header>

      <div style={{ flex: 1, position: "relative" }}>
        <Routes>
          {/* Default route goes to Globe */}
          <Route path="/" element={<Navigate to="/globe" replace />} />
          <Route path="/globe" element={<GlobePage />} />
          <Route path="/settings" element={<AsteroidSettings />} />
          <Route path="*" element={<div style={{ padding: 24 }}>Page not found</div>} />
        </Routes>
      </div>
    </div>
  );
}
