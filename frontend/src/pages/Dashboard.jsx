import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ stats, leads, isReady }) {
  const navigate = useNavigate();
  const chartRef = useRef(null);

  const recentLeads = leads.slice(-5).reverse();

  // Simple bar chart using canvas
  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const vals = [12, 19, 8, 24, 18, 31, leads.length || 7];
    const max = Math.max(...vals);
    canvas.width = canvas.offsetWidth;
    canvas.height = 160;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barW = (canvas.width - 60) / vals.length - 8;
    vals.forEach((v, i) => {
      const x = 30 + i * (barW + 8);
      const h = (v / max) * 120;
      const y = 130 - h;
      const grad = ctx.createLinearGradient(0, y, 0, 130);
      grad.addColorStop(0, "#25d366");
      grad.addColorStop(1, "#128c7e");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, h, [4, 4, 0, 0]);
      ctx.fill();
      ctx.fillStyle = "#3d5e47";
      ctx.font = "10px DM Sans";
      ctx.textAlign = "center";
      ctx.fillText(days[i], x + barW / 2, 148);
    });
  }, [leads]);

  return (
    <div style={styles.wrapper} className="animate-fade">
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Dashboard</h2>
          <p style={{ color: "var(--text2)", fontSize: ".9rem" }}>
            Nexity AI Bot — Dubai Real Estate Automation
          </p>
        </div>
        <button className="btn btn-green" onClick={() => navigate("/connect")}>
          📱 {isReady ? "Bot Connected ✓" : "Connect WhatsApp"}
        </button>
      </div>

      {/* Metrics */}
      <div style={styles.metricsGrid}>
        {[
          { icon: "🎯", label: "Leads Captured", val: stats?.totalLeads ?? 0, change: "+Today", color: "#25d366" },
          { icon: "💬", label: "Active Sessions", val: stats?.activeSessions ?? 0, change: "Live", color: "#4fc3f7" },
          { icon: "📚", label: "KB Entries", val: stats?.kbEntries ?? 0, change: "nexity.txt", color: "#ffb347" },
          { icon: "🤖", label: "Bot Status", val: isReady ? "Online" : "Offline", change: isReady ? "Running" : "Connect now", color: isReady ? "#00ff88" : "#ff4f6d" },
        ].map((m) => (
          <div key={m.label} style={{ ...styles.metricCard, borderColor: m.color + "22" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: ".78rem", color: "var(--text2)", marginBottom: ".4rem" }}>{m.icon} {m.label}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.8rem", fontWeight: 800, color: m.color }}>
                  {m.val}
                </div>
                <div style={{ fontSize: ".75rem", color: "var(--text3)", marginTop: ".3rem" }}>{m.change}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.mainGrid}>
        {/* Chart */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div className="card-title" style={{ margin: 0 }}>Message Activity</div>
            <span style={{ fontSize: ".75rem", color: "var(--text3)" }}>Last 7 days</span>
          </div>
          <canvas ref={chartRef} style={{ width: "100%", height: 160 }} />
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-title">Quick Actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            <button className="btn btn-green" style={{ justifyContent: "center" }} onClick={() => navigate("/connect")}>
              📱 WhatsApp QR Connect
            </button>
            <button className="btn btn-outline" style={{ justifyContent: "center" }} onClick={() => navigate("/leads")}>
              🎯 View All Leads
            </button>
            <button className="btn btn-ghost" style={{ justifyContent: "center" }} onClick={() => navigate("/kb")}>
              📁 Edit Knowledge Base
            </button>
            <button className="btn btn-ghost" style={{ justifyContent: "center" }} onClick={() => navigate("/analytics")}>
              📈 Analytics
            </button>
          </div>

          {/* Bot Flow Preview */}
          <div style={{ marginTop: "1.2rem", padding: "1rem", background: "var(--surface2)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: ".78rem", color: "var(--text3)", marginBottom: ".6rem" }}>ANSWER PRIORITY</div>
            {[
              { n: 1, label: "nexity.txt KB", color: "#25d366" },
              { n: 2, label: "Nexity Website", color: "#4fc3f7" },
              { n: 3, label: "Bayut Profile", color: "#ffb347" },
              { n: 4, label: "Gemini AI", color: "#7effc4" },
            ].map((s) => (
              <div key={s.n} style={{ display: "flex", gap: ".5rem", alignItems: "center", marginBottom: ".4rem" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: s.color + "22", border: `1px solid ${s.color}44`, display: "grid", placeItems: "center", fontSize: ".65rem", fontWeight: 700, color: s.color, flexShrink: 0 }}>{s.n}</div>
                <span style={{ fontSize: ".8rem", color: "var(--text2)" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="card" style={{ marginTop: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div className="card-title" style={{ margin: 0 }}>Recent Leads</div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/leads")}>View All →</button>
        </div>
        {recentLeads.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text3)" }}>
            <div style={{ fontSize: "2rem", marginBottom: ".5rem" }}>🎯</div>
            No leads yet — leads appear here when customers interact with your bot
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>{["Name", "Phone", "Purpose", "Type", "Budget", "Location", "Time"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {recentLeads.map((lead, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={styles.td}>{lead.name || "—"}</td>
                    <td style={styles.td}>{lead.phone || "—"}</td>
                    <td style={styles.td}><span className="badge badge-green">{lead.purpose || "—"}</span></td>
                    <td style={styles.td}>{lead.type || "—"}</td>
                    <td style={styles.td}>{lead.budget || "—"}</td>
                    <td style={styles.td}>{lead.location || "—"}</td>
                    <td style={{ ...styles.td, fontSize: ".75rem", color: "var(--text3)" }}>
                      {lead.timestamp ? new Date(lead.timestamp).toLocaleTimeString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { padding: "2rem", maxWidth: 1200 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" },
  title: { fontSize: "1.6rem", fontWeight: 700 },
  metricsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" },
  metricCard: {
    background: "var(--surface)", border: "1px solid", borderRadius: "var(--radius)",
    padding: "1.3rem", transition: ".2s",
  },
  mainGrid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: ".83rem" },
  th: { textAlign: "left", padding: ".65rem 1rem", color: "var(--text2)", fontWeight: 500, borderBottom: "1px solid var(--border)", fontSize: ".8rem" },
  td: { padding: ".65rem 1rem" },
};
