import React from "react";

const sources = [
  { icon: "📄", type: "TXT File", name: "nexity.txt", desc: "Primary knowledge base — FAQs, property info, contact details", status: "active", priority: 1 },
  { icon: "🌐", type: "Website", name: "nexityrealestate.com", desc: "Live property listings and company info — scraped on demand", status: "active", priority: 2 },
  { icon: "🌐", type: "Website", name: "bayut.com/nexity-profile", desc: "Bayut listings page for Nexity Real Estate", status: "active", priority: 3 },
  { icon: "🤖", type: "AI Fallback", name: "Gemini 1.5 Flash", desc: "Handles general questions not covered by KB or websites", status: "active", priority: 4 },
];

export default function KnowledgeBase() {
  return (
    <div style={{ padding: "2rem", maxWidth: 1000 }} className="animate-fade">
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700 }}>Knowledge Base</h2>
        <p style={{ color: "var(--text2)", fontSize: ".9rem", marginTop: ".3rem" }}>
          Your bot answers questions in this priority order
        </p>
      </div>

      {/* Priority flow */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <div className="card-title">Answer Priority Flow</div>
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
          {["nexity.txt", "nexityrealestate.com", "Bayut Page", "Gemini AI"].map((s, i, arr) => (
            <React.Fragment key={s}>
              <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: ".5rem 1rem", fontSize: ".82rem", color: "var(--text)" }}>
                <span style={{ color: "var(--text3)", marginRight: ".4rem" }}>{i + 1}.</span>{s}
              </div>
              {i < arr.length - 1 && <span style={{ color: "var(--text3)" }}>→</span>}
            </React.Fragment>
          ))}
        </div>
        <p style={{ marginTop: ".75rem", fontSize: ".82rem", color: "var(--text2)" }}>
          If nexity.txt has the answer → use it. Otherwise scrape website → then Bayut → finally Gemini AI.
        </p>
      </div>

      {/* Sources */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {sources.map((s) => (
          <div key={s.name} className="card" style={{ display: "flex", alignItems: "flex-start", gap: "1.2rem" }}>
            <div style={{ width: 48, height: 48, background: "var(--green-dim)", border: "1px solid rgba(37,211,102,.2)", borderRadius: 12, display: "grid", placeItems: "center", fontSize: "1.4rem", flexShrink: 0 }}>
              {s.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".4rem" }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".95rem" }}>{s.name}</span>
                <span className="badge badge-blue" style={{ fontSize: ".68rem" }}>{s.type}</span>
                <span className="badge badge-green" style={{ fontSize: ".68rem" }}>Priority {s.priority}</span>
              </div>
              <p style={{ color: "var(--text2)", fontSize: ".83rem", lineHeight: 1.5 }}>{s.desc}</p>
            </div>
            <span className="badge badge-green">✓ Active</span>
          </div>
        ))}
      </div>

      {/* nexity.txt format guide */}
      <div className="card" style={{ marginTop: "2rem" }}>
        <div className="card-title">📝 nexity.txt Format Guide</div>
        <p style={{ color: "var(--text2)", fontSize: ".85rem", marginBottom: "1rem" }}>
          Add Q&A pairs to your nexity.txt file in this format:
        </p>
        <pre style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "1rem", fontSize: ".82rem", color: "var(--accent2)", overflow: "auto", lineHeight: 1.7 }}>
{`Q: what is nexity
A: Nexity Real Estate is a leading Dubai property company...

Q: contact number
A: Call us at +971-XX-XXXXXXX or visit nexityrealestate.com

Q: areas covered
A: We cover Dubai Marina, Palm Jumeirah, Downtown...`}
        </pre>
        <p style={{ marginTop: "1rem", fontSize: ".8rem", color: "var(--text3)" }}>
          💡 Restart the backend after editing nexity.txt to reload the knowledge base.
        </p>
      </div>
    </div>
  );
}
