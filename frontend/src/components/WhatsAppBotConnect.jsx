import React, { useEffect, useState } from "react";

export default function WhatsAppBotConnect({ qrImage, status, isReady, onRefresh }) {
  const [timer, setTimer] = useState(120);

  useEffect(() => {
    if (status !== "qr") return;
    setTimer(120);
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status, qrImage]);

  const statusConfig = {
    starting: { color: "#ffb347", icon: "⟳", label: "Server Starting...", desc: "Please wait while the bot initializes" },
    qr: { color: "#25d366", icon: "📱", label: "Scan QR Code", desc: "Open WhatsApp → Settings → Linked Devices → Link a Device" },
    ready: { color: "#00ff88", icon: "✅", label: "WhatsApp Connected!", desc: "Your bot is live and responding to messages" },
    error: { color: "#ff4f6d", icon: "❌", label: "Connection Error", desc: "Check if the backend server is running on port 3001" },
  };

  const cfg = statusConfig[status] || statusConfig.starting;

  return (
    <div style={styles.wrapper} className="animate-fade">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>WhatsApp Connection</h2>
          <p style={styles.subtitle}>Connect your WhatsApp to activate the Nexity AI bot</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onRefresh}>🔄 Refresh</button>
      </div>

      <div style={styles.grid}>
        {/* QR Panel */}
        <div style={styles.qrPanel}>
          {/* Status badge */}
          <div style={{ ...styles.statusBadge, borderColor: cfg.color + "44", background: cfg.color + "11" }}>
            <span>{cfg.icon}</span>
            <span style={{ color: cfg.color, fontSize: ".85rem", fontWeight: 600 }}>{cfg.label}</span>
          </div>

          {/* QR or Status Display */}
          <div style={styles.qrBox}>
            {status === "qr" && qrImage ? (
              <>
                <img src={qrImage} alt="WhatsApp QR" style={styles.qrImg} />
                <div style={styles.timerWrap}>
                  <div style={{ ...styles.timerNum, color: timer < 30 ? "#ff4f6d" : "#00ff88" }}>
                    {String(timer).padStart(2, "0")}
                  </div>
                  <div style={styles.timerLabel}>seconds remaining</div>
                  {timer === 0 && (
                    <button className="btn btn-outline btn-sm" style={{ marginTop: ".75rem" }} onClick={onRefresh}>
                      🔄 Refresh QR
                    </button>
                  )}
                </div>
              </>
            ) : status === "ready" ? (
              <div style={styles.readyDisplay}>
                <div style={styles.readyIcon}>✅</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#00ff88" }}>
                  Bot is Live!
                </div>
                <p style={{ color: "var(--text2)", fontSize: ".85rem", marginTop: ".5rem", textAlign: "center" }}>
                  Your Nexity AI bot is now active and responding to WhatsApp messages
                </p>
              </div>
            ) : status === "error" ? (
              <div style={styles.readyDisplay}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
                <div style={{ color: "#ff4f6d", fontWeight: 600, marginBottom: ".5rem" }}>Connection Failed</div>
                <p style={{ color: "var(--text2)", fontSize: ".85rem", textAlign: "center" }}>
                  Make sure backend is running:<br/>
                  <code style={{ color: "#ffb347" }}>node wa-server.js</code>
                </p>
              </div>
            ) : (
              <div style={styles.readyDisplay}>
                <div style={styles.spinner} />
                <p style={{ color: "var(--text2)", fontSize: ".85rem", marginTop: "1rem" }}>
                  Initializing WhatsApp client...
                </p>
              </div>
            )}
          </div>

          <p style={{ color: "var(--text2)", fontSize: ".82rem", textAlign: "center", lineHeight: 1.6 }}>
            {cfg.desc}
          </p>
        </div>

        {/* Right Info Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {/* How to scan */}
          <div className="card">
            <div className="card-title">📋 How to Connect</div>
            {[
              { step: "1", text: "Open WhatsApp on your phone" },
              { step: "2", text: "Go to Settings → Linked Devices" },
              { step: "3", text: "Tap 'Link a Device'" },
              { step: "4", text: "Scan the QR code on the left" },
              { step: "5", text: "Bot activates automatically!" },
            ].map((s) => (
              <div key={s.step} style={styles.stepItem}>
                <div style={styles.stepNum}>{s.step}</div>
                <div style={{ fontSize: ".85rem" }}>{s.text}</div>
              </div>
            ))}
          </div>

          {/* Connection Status */}
          <div className="card">
            <div className="card-title">📡 System Status</div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
              {[
                { label: "Backend Server", ok: status !== "error", val: "Port 3001" },
                { label: "WhatsApp Client", ok: isReady, val: isReady ? "Connected" : "Waiting" },
                { label: "Gemini AI", ok: true, val: "Active" },
                { label: "Knowledge Base", ok: true, val: "nexity.txt loaded" },
              ].map((item) => (
                <div key={item.label} style={styles.statusRow}>
                  <span style={{ color: "var(--text2)", fontSize: ".82rem" }}>{item.label}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".82rem" }}>
                    <span style={{ color: item.ok ? "#25d366" : "#ff4f6d" }}>●</span>
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bot Features */}
          <div className="card">
            <div className="card-title">🤖 Bot Capabilities</div>
            {[
              "Dubai real estate property search",
              "Lead capture (name, phone, budget, location)",
              "nexity.txt knowledge base answers",
              "Live website scraping for latest listings",
              "Gemini AI for general questions",
              "Auto booking confirmation",
            ].map((f) => (
              <div key={f} style={{ display: "flex", gap: ".5rem", marginBottom: ".5rem", fontSize: ".82rem" }}>
                <span style={{ color: "#25d366" }}>✓</span>
                <span style={{ color: "var(--text2)" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { padding: "2rem", maxWidth: 1100 },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem" },
  title: { fontSize: "1.6rem", fontWeight: 700 },
  subtitle: { color: "var(--text2)", fontSize: ".9rem", marginTop: ".3rem" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" },
  qrPanel: {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", padding: "2rem",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem",
  },
  statusBadge: {
    display: "flex", alignItems: "center", gap: 8,
    border: "1px solid", borderRadius: 100, padding: ".45rem 1rem",
  },
  qrBox: {
    background: "var(--surface2)", borderRadius: "var(--radius)",
    padding: "1.5rem", width: "100%", display: "flex",
    flexDirection: "column", alignItems: "center", minHeight: 280,
    justifyContent: "center",
  },
  qrImg: { width: 220, height: 220, borderRadius: 12, border: "4px solid white" },
  timerWrap: { textAlign: "center", marginTop: "1rem" },
  timerNum: { fontFamily: "'Syne',sans-serif", fontSize: "2.2rem", fontWeight: 800 },
  timerLabel: { fontSize: ".78rem", color: "var(--text3)" },
  readyDisplay: { display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem" },
  readyIcon: { fontSize: "3.5rem", marginBottom: "1rem" },
  spinner: {
    width: 56, height: 56, border: "3px solid var(--border)",
    borderTop: "3px solid var(--green)", borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  stepItem: { display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".75rem" },
  stepNum: {
    width: 26, height: 26, borderRadius: "50%",
    background: "var(--green-dim)", border: "1px solid rgba(37,211,102,.3)",
    display: "grid", placeItems: "center",
    fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".78rem",
    color: "var(--green)", flexShrink: 0,
  },
  statusRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
};
