import React, { useEffect, useState } from "react";

export default function ConnectPage({ qrImage, status, isReady, onRefresh }) {
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
    starting: {
      color: "#ffb347",
      icon: "⟳",
      label: "Server Starting...",
      desc: "Please wait while the WhatsApp client initializes",
    },
    qr: {
      color: "#25d366",
      icon: "📱",
      label: "Scan QR Code",
      desc: 'Open WhatsApp → Settings → Linked Devices → "Link a Device"',
    },
    ready: {
      color: "#00ff88",
      icon: "✅",
      label: "WhatsApp Connected!",
      desc: "Your Nexity AI bot is live and responding to messages",
    },
    error: {
      color: "#ff4f6d",
      icon: "❌",
      label: "Connection Error",
      desc: "Make sure backend is running: node wa-server.js",
    },
  };

  const cfg = statusConfig[status] || statusConfig.starting;

  return (
    <div style={styles.wrapper} className="animate-fade">
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>WhatsApp Connection</h2>
          <p style={styles.subtitle}>
            Connect your WhatsApp to activate the Nexity AI bot
          </p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onRefresh}>
          🔄 Refresh
        </button>
      </div>

      <div style={styles.grid}>
        {/* ── LEFT: QR Panel ── */}
        <div style={styles.qrPanel}>
          {/* Status Badge */}
          <div
            style={{
              ...styles.statusBadge,
              borderColor: cfg.color + "44",
              background: cfg.color + "11",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>{cfg.icon}</span>
            <span style={{ color: cfg.color, fontSize: ".85rem", fontWeight: 600 }}>
              {cfg.label}
            </span>
          </div>

          {/* QR / Status Display Box */}
          <div style={styles.qrBox}>
            {status === "qr" && qrImage ? (
              <>
                <img src={qrImage} alt="WhatsApp QR Code" style={styles.qrImg} />
                <div style={styles.timerWrap}>
                  <div style={{ ...styles.timerNum, color: timer < 30 ? "#ff4f6d" : "#00ff88" }}>
                    {String(timer).padStart(2, "0")}
                  </div>
                  <div style={styles.timerLabel}>seconds remaining</div>
                  {timer === 0 && (
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ marginTop: ".75rem" }}
                      onClick={onRefresh}
                    >
                      🔄 Refresh QR
                    </button>
                  )}
                </div>
              </>
            ) : status === "ready" ? (
              <div style={styles.centeredDisplay}>
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "#00ff88", marginBottom: ".5rem" }}>
                  Bot is Live!
                </div>
                <p style={{ color: "var(--text2)", fontSize: ".85rem", textAlign: "center", lineHeight: 1.6, maxWidth: 260 }}>
                  Your Nexity AI bot is now active and responding to WhatsApp messages 24/7
                </p>
                <div style={styles.liveStats}>
                  {[
                    { icon: "🤖", label: "AI Active" },
                    { icon: "📚", label: "KB Loaded" },
                    { icon: "⚡", label: "Auto-Reply" },
                  ].map((s) => (
                    <div key={s.label} style={styles.liveStat}>
                      <span style={{ fontSize: "1.3rem" }}>{s.icon}</span>
                      <span style={{ fontSize: ".75rem", color: "var(--text2)" }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : status === "error" ? (
              <div style={styles.centeredDisplay}>
                <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>❌</div>
                <div style={{ color: "#ff4f6d", fontWeight: 600, marginBottom: ".75rem", fontFamily: "'Syne',sans-serif" }}>
                  Connection Failed
                </div>
                <p style={{ color: "var(--text2)", fontSize: ".83rem", textAlign: "center", lineHeight: 1.7 }}>
                  Make sure backend is running:
                </p>
                <code style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, padding: ".4rem .8rem", fontSize: ".8rem", color: "#ffb347", marginTop: ".5rem", display: "block" }}>
                  node wa-server.js
                </code>
                <button className="btn btn-outline" style={{ marginTop: "1rem" }} onClick={onRefresh}>
                  🔄 Try Again
                </button>
              </div>
            ) : (
              /* starting */
              <div style={styles.centeredDisplay}>
                <div style={styles.spinner} />
                <p style={{ color: "var(--text2)", fontSize: ".85rem", marginTop: "1.2rem", textAlign: "center" }}>
                  Initializing WhatsApp client...
                  <br />
                  <span style={{ fontSize: ".78rem", color: "var(--text3)" }}>
                    This may take 10–30 seconds
                  </span>
                </p>
              </div>
            )}
          </div>

          <p style={{ color: "var(--text2)", fontSize: ".82rem", textAlign: "center", lineHeight: 1.6 }}>
            {cfg.desc}
          </p>
        </div>

        {/* ── RIGHT: Info Panels ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {/* How to Scan */}
          <div className="card">
            <div className="card-title">📋 How to Connect</div>
            {[
              { step: "1", icon: "📱", text: "Open WhatsApp on your phone" },
              { step: "2", icon: "⚙️", text: "Tap the 3 dots (⋮) → Linked Devices" },
              { step: "3", icon: "🔗", text: 'Tap "Link a Device"' },
              { step: "4", icon: "📷", text: "Point your camera at the QR code" },
              { step: "5", icon: "✅", text: "Bot activates automatically!" },
            ].map((s) => (
              <div key={s.step} style={styles.stepItem}>
                <div style={styles.stepNum}>{s.step}</div>
                <div style={{ fontSize: ".85rem" }}>
                  {s.icon} {s.text}
                </div>
              </div>
            ))}
          </div>

          {/* System Status */}
          <div className="card">
            <div className="card-title">📡 System Status</div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
              {[
                { label: "Backend Server", ok: status !== "error", val: status !== "error" ? "Running on :3001" : "Not running" },
                { label: "WhatsApp Client", ok: isReady, val: isReady ? "Connected ✓" : status === "qr" ? "Waiting for scan" : "Initializing" },
                { label: "Gemini AI", ok: true, val: "Connected" },
                { label: "Knowledge Base", ok: true, val: "nexity.txt loaded" },
                { label: "Website Scraper", ok: true, val: "nexityrealestate.com" },
              ].map((item) => (
                <div key={item.label} style={styles.statusRow}>
                  <span style={{ color: "var(--text2)", fontSize: ".82rem" }}>{item.label}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: ".82rem" }}>
                    <span style={{ color: item.ok ? "#25d366" : "#ff4f6d" }}>●</span>
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Answer Priority */}
          <div className="card">
            <div className="card-title">🧠 Answer Priority</div>
            {[
              { n: 1, label: "nexity.txt", sub: "Your custom FAQ file", color: "#25d366" },
              { n: 2, label: "nexityrealestate.com", sub: "Live website scrape", color: "#4fc3f7" },
              { n: 3, label: "Bayut Profile", sub: "Nexity listings page", color: "#ffb347" },
              { n: 4, label: "Gemini 1.5 Flash", sub: "AI general fallback", color: "#7effc4" },
            ].map((s) => (
              <div key={s.n} style={styles.priorityItem}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: s.color + "18", border: `1px solid ${s.color}44`,
                  display: "grid", placeItems: "center",
                  fontFamily: "'Syne',sans-serif", fontWeight: 700,
                  fontSize: ".75rem", color: s.color, flexShrink: 0,
                }}>
                  {s.n}
                </div>
                <div>
                  <div style={{ fontSize: ".84rem", fontWeight: 500 }}>{s.label}</div>
                  <div style={{ fontSize: ".75rem", color: "var(--text3)" }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lead Flow Preview */}
      <div className="card" style={{ marginTop: "1.5rem" }}>
        <div className="card-title">🎯 Lead Capture Flow (Auto-triggered when customer asks about property)</div>
        <div style={styles.flowRow}>
          {[
            { icon: "👋", label: "Hi/Hello", sub: "Greeting" },
            { icon: "🏠", label: "Buy/Sell?", sub: "Step 1" },
            { icon: "🏢", label: "Prop Type", sub: "Step 2" },
            { icon: "🛏️", label: "Bedrooms", sub: "Step 3" },
            { icon: "📍", label: "Location", sub: "Step 4" },
            { icon: "💰", label: "Budget", sub: "Step 5" },
            { icon: "👤", label: "Name", sub: "Step 6" },
            { icon: "📞", label: "Phone", sub: "Step 7" },
            { icon: "📅", label: "Visit Date", sub: "Step 8" },
            { icon: "✅", label: "Confirmed!", sub: "Done" },
          ].map((step, i, arr) => (
            <React.Fragment key={step.label}>
              <div style={styles.flowStep}>
                <div style={{ fontSize: "1.2rem" }}>{step.icon}</div>
                <div style={{ fontSize: ".68rem", fontWeight: 600, textAlign: "center" }}>{step.label}</div>
                <div style={{ fontSize: ".62rem", color: "var(--text3)" }}>{step.sub}</div>
              </div>
              {i < arr.length - 1 && (
                <div style={{ color: "var(--text3)", fontSize: ".85rem", flexShrink: 0 }}>→</div>
              )}
            </React.Fragment>
          ))}
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
  statusBadge: { display: "flex", alignItems: "center", gap: 10, border: "1px solid", borderRadius: 100, padding: ".5rem 1.1rem" },
  qrBox: {
    background: "var(--surface2)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", padding: "1.5rem", width: "100%",
    display: "flex", flexDirection: "column", alignItems: "center",
    minHeight: 300, justifyContent: "center",
  },
  qrImg: { width: 230, height: 230, borderRadius: 14, border: "5px solid white", display: "block" },
  timerWrap: { textAlign: "center", marginTop: "1rem" },
  timerNum: { fontFamily: "'Syne',sans-serif", fontSize: "2.4rem", fontWeight: 800 },
  timerLabel: { fontSize: ".78rem", color: "var(--text3)" },
  centeredDisplay: { display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem", width: "100%" },
  liveStats: { display: "flex", gap: "1.5rem", marginTop: "1.2rem" },
  liveStat: { display: "flex", flexDirection: "column", alignItems: "center", gap: ".3rem" },
  spinner: { width: 60, height: 60, border: "3px solid var(--border)", borderTop: "3px solid var(--green)", borderRadius: "50%", animation: "spin 1s linear infinite" },
  stepItem: { display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".65rem" },
  stepNum: {
    width: 26, height: 26, borderRadius: "50%",
    background: "var(--green-dim)", border: "1px solid rgba(37,211,102,.3)",
    display: "grid", placeItems: "center",
    fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".75rem",
    color: "var(--green)", flexShrink: 0,
  },
  statusRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".45rem 0", borderBottom: "1px solid var(--border)" },
  priorityItem: { display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".75rem" },
  flowRow: { display: "flex", alignItems: "center", gap: ".3rem", flexWrap: "wrap", marginTop: ".5rem" },
  flowStep: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: ".2rem",
    background: "var(--surface2)", border: "1px solid var(--border)",
    borderRadius: 8, padding: ".55rem .65rem", minWidth: 62,
  },
};
