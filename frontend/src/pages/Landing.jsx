import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div style={styles.wrapper}>
      {/* BG */}
      <div style={styles.bgGrad} />
      <div style={styles.bgGrid} />

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.badge}>
          <span style={styles.dot} />
          Powered by Gemini AI × WhatsApp
        </div>
        <h1 style={styles.h1}>
          Automate Dubai Real Estate<br />
          <span style={{ color: "var(--accent)" }}>on WhatsApp</span> in Minutes
        </h1>
        <p style={styles.desc}>
          Nexity AI Bot handles property inquiries, qualifies leads, books visits,
          and answers questions 24/7 — from nexity.txt, live websites, or Gemini AI.
        </p>
        <div style={styles.btnRow}>
          <button className="btn btn-green btn-lg" onClick={() => navigate("/connect")}>
            📱 Connect WhatsApp
          </button>
          <button className="btn btn-outline btn-lg" onClick={() => navigate("/dashboard")}>
            📊 Open Dashboard
          </button>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          {[
            { val: "3-Step", label: "Lead capture flow" },
            { val: "3-Layer", label: "Answer priority" },
            { val: "24/7", label: "Auto response" },
            { val: "0-Code", label: "Setup required" },
          ].map((s) => (
            <div key={s.label} style={styles.stat}>
              <div style={styles.statVal}>{s.val}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={styles.features}>
        {[
          { icon: "📄", title: "nexity.txt First", desc: "Bot checks your custom knowledge base before anything else" },
          { icon: "🌐", title: "Website Fallback", desc: "Scrapes nexityrealestate.com & Bayut for live property data" },
          { icon: "🤖", title: "Gemini AI Backup", desc: "Answers any general question using Google Gemini 1.5 Flash" },
          { icon: "🎯", title: "Lead Capture", desc: "Collects purpose, type, bedrooms, location, budget, name & phone" },
          { icon: "📅", title: "Visit Booking", desc: "Schedules property visits and sends confirmation automatically" },
          { icon: "📊", title: "Live Dashboard", desc: "Track leads, messages, and bot status in real-time" },
        ].map((f) => (
          <div key={f.title} style={styles.featCard}>
            <div style={styles.featIcon}>{f.icon}</div>
            <h3 style={styles.featTitle}>{f.title}</h3>
            <p style={styles.featDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", position: "relative", overflow: "hidden" },
  bgGrad: { position: "fixed", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,211,102,0.07) 0%, transparent 70%)", pointerEvents: "none" },
  bgGrid: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)", backgroundSize: "60px 60px", opacity: .2, pointerEvents: "none" },
  hero: { maxWidth: 700, margin: "0 auto", padding: "8rem 2rem 4rem", textAlign: "center", position: "relative", zIndex: 1 },
  badge: { display: "inline-flex", alignItems: "center", gap: 8, background: "var(--green-dim)", border: "1px solid rgba(37,211,102,.25)", borderRadius: 100, padding: ".4rem 1rem", fontSize: ".8rem", color: "var(--accent)", marginBottom: "1.5rem" },
  dot: { width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", animation: "pulse 2s infinite", display: "inline-block" },
  h1: { fontFamily: "'Syne',sans-serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: "1.2rem" },
  desc: { color: "var(--text2)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 520, margin: "0 auto 2rem" },
  btnRow: { display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" },
  statsRow: { display: "flex", gap: "2.5rem", justifyContent: "center", flexWrap: "wrap" },
  stat: { textAlign: "center" },
  statVal: { fontFamily: "'Syne',sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--accent)" },
  statLabel: { fontSize: ".78rem", color: "var(--text3)" },
  features: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.2rem", maxWidth: 900, margin: "0 auto", padding: "0 2rem 6rem", position: "relative", zIndex: 1 },
  featCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem", transition: ".2s" },
  featIcon: { fontSize: "1.8rem", marginBottom: ".75rem" },
  featTitle: { fontFamily: "'Syne',sans-serif", fontSize: ".95rem", fontWeight: 700, marginBottom: ".4rem" },
  featDesc: { color: "var(--text2)", fontSize: ".82rem", lineHeight: 1.6 },
};
