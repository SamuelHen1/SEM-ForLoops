// src/App.tsx
import { Link, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import GlobePage from "./pages/GlobePage";
import AsteroidSettings from "./pages/AsteroidSettings";

export default function App() {
  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column" }}>
      {/* Header / Navigation */}
      <header style={{ padding: "10px 16px", background: "#0b0b0b", color: "white" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: 700 }}>
            Meteor Madness
          </Link>
          <nav style={{ display: "flex", gap: 12 }}>
            <NavLink
              to="/"
              style={({ isActive }) => ({ color: isActive ? "#9ae6b4" : "#ddd", textDecoration: "none" })}
              end
            >
              Home
            </NavLink>
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

      {/* Page content */}
      <div style={{ flex: 1, position: "relative" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/globe" element={<GlobePage />} />
          <Route path="/settings" element={<AsteroidSettings />} />
          <Route path="*" element={<div style={{ padding: 24 }}>Page not found</div>} />
        </Routes>
      </div>
    </div>
  );
}
