import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { icon: "📊", label: "Dashboard", path: "/dashboard" },
  { icon: "📱", label: "WhatsApp Connect", path: "/connect" },
  { icon: "🎯", label: "Leads", path: "/leads" },
  { icon: "📁", label: "Knowledge Base", path: "/kb" },
  { icon: "📈", label: "Analytics", path: "/analytics" },
];

export default function Sidebar({ isReady }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo} onClick={() => navigate("/")}>
        <div style={styles.logoIcon}>💬</div>
        <div>
          <div style={styles.logoText}>Nexity AI</div>
          <div style={styles.logoSub}>WhatsApp Bot</div>
        </div>
      </div>

      {/* Status Pill */}
      <div style={{ padding: "0 1rem", marginBottom: "1.5rem" }}>
        <div style={{ ...styles.statusPill, background: isReady ? "rgba(37,211,102,.12)" : "rgba(255,179,71,.12)", border: `1px solid ${isReady ? "rgba(37,211,102,.3)" : "rgba(255,179,71,.3)"}` }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: isReady ? "#25d366" : "#ffb347", animation: "pulse 2s infinite", display: "inline-block" }} />
          <span style={{ fontSize: ".78rem", color: isReady ? "#25d366" : "#ffb347" }}>
            {isReady ? "Bot Connected" : "Waiting for Scan"}
          </span>
        </div>
      </div>

      {/* Nav */}
      <div style={styles.navSection}>
        <div style={styles.navLabel}>NAVIGATION</div>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <div
              key={item.path}
              style={{ ...styles.navItem, ...(active ? styles.navItemActive : {}) }}
              onClick={() => navigate(item.path)}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
              {active && <span style={styles.activeDot} />}
            </div>
          );
        })}
      </div>

      {/* Bottom */}
      <div style={styles.sidebarBottom}>
        <div style={styles.navItem} onClick={() => navigate("/")}>
          <span style={styles.navIcon}>🏠</span>
          <span>Landing Page</span>
        </div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 240, minHeight: "100vh", background: "var(--surface)",
    borderRight: "1px solid var(--border)", display: "flex",
    flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
  },
  logo: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "1.5rem 1.2rem", cursor: "pointer",
    borderBottom: "1px solid var(--border)", marginBottom: "1rem",
  },
  logoIcon: {
    width: 38, height: 38,
    background: "linear-gradient(135deg,#25d366,#128c7e)",
    borderRadius: 10, display: "grid", placeItems: "center", fontSize: 20,
  },
  logoText: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1rem" },
  logoSub: { fontSize: ".72rem", color: "var(--text3)" },
  statusPill: {
    display: "flex", alignItems: "center", gap: 8, padding: ".45rem .9rem",
    borderRadius: 100,
  },
  navSection: { flex: 1, padding: "0 0" },
  navLabel: {
    fontSize: ".65rem", letterSpacing: ".1em", color: "var(--text3)",
    padding: ".5rem 1.2rem", textTransform: "uppercase",
  },
  navItem: {
    display: "flex", alignItems: "center", gap: ".75rem",
    padding: ".65rem 1.2rem", cursor: "pointer", color: "var(--text2)",
    transition: ".15s", fontSize: ".88rem", position: "relative",
    borderLeft: "3px solid transparent",
  },
  navItemActive: {
    color: "var(--accent)", background: "var(--green-dim)",
    borderLeft: "3px solid var(--accent)",
  },
  navIcon: { width: 20, textAlign: "center", fontSize: 16 },
  activeDot: {
    marginLeft: "auto", width: 6, height: 6,
    background: "var(--accent)", borderRadius: "50%",
  },
  sidebarBottom: { borderTop: "1px solid var(--border)", padding: ".5rem 0" },
};
