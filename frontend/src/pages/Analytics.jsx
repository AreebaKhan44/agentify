import React from "react";

export default function Analytics({ leads, stats }) {
  const buyers = leads.filter((l) => l.purpose?.toLowerCase().includes("buy")).length;
  const sellers = leads.filter((l) => l.purpose?.toLowerCase().includes("sell")).length;
  const renters = leads.filter((l) => l.purpose?.toLowerCase().includes("rent")).length;
  const total = leads.length;

  const byType = {};
  leads.forEach((l) => { if (l.type) byType[l.type] = (byType[l.type] || 0) + 1; });
  const byLocation = {};
  leads.forEach((l) => { if (l.location) byLocation[l.location] = (byLocation[l.location] || 0) + 1; });

  const topLocations = Object.entries(byLocation).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topTypes = Object.entries(byType).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ padding: "2rem", maxWidth: 1200 }} className="animate-fade">
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700 }}>Analytics</h2>
        <p style={{ color: "var(--text2)", fontSize: ".9rem" }}>Real-time insights from your WhatsApp bot</p>
      </div>

      {/* Top metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { icon: "🎯", label: "Total Leads", val: total, color: "#25d366" },
          { icon: "🏠", label: "Buyers", val: buyers, color: "#4fc3f7" },
          { icon: "💰", label: "Sellers", val: sellers, color: "#ffb347" },
          { icon: "🔑", label: "Renters", val: renters, color: "#7effc4" },
        ].map((m) => (
          <div key={m.label} className="card" style={{ borderColor: m.color + "22" }}>
            <div style={{ fontSize: ".78rem", color: "var(--text2)", marginBottom: ".4rem" }}>{m.icon} {m.label}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "2rem", fontWeight: 800, color: m.color }}>{m.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Purpose breakdown */}
        <div className="card">
          <div className="card-title">Lead Purpose Breakdown</div>
          {total === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text3)" }}>No data yet</div>
          ) : (
            [{ label: "Buyers", val: buyers, color: "#25d366" }, { label: "Sellers", val: sellers, color: "#ffb347" }, { label: "Renters", val: renters, color: "#4fc3f7" }].map((s) => (
              <div key={s.label} style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", marginBottom: ".3rem" }}>
                  <span style={{ color: "var(--text2)" }}>{s.label}</span>
                  <span style={{ color: s.color, fontWeight: 600 }}>{s.val} ({total ? Math.round(s.val / total * 100) : 0}%)</span>
                </div>
                <div style={{ height: 8, background: "var(--surface2)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${total ? (s.val / total) * 100 : 0}%`, background: s.color, borderRadius: 4, transition: "1s" }} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Top locations */}
        <div className="card">
          <div className="card-title">Top Requested Locations</div>
          {topLocations.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text3)" }}>No data yet</div>
          ) : (
            topLocations.map(([loc, count], i) => (
              <div key={loc} style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", marginBottom: ".3rem" }}>
                  <span style={{ color: "var(--text2)" }}>{loc}</span>
                  <span style={{ color: "var(--accent)", fontWeight: 600 }}>{count}</span>
                </div>
                <div style={{ height: 6, background: "var(--surface2)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(count / topLocations[0][1]) * 100}%`, background: `hsl(${140 + i * 20},70%,50%)`, borderRadius: 3 }} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Property types */}
        <div className="card">
          <div className="card-title">Property Types</div>
          {topTypes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text3)" }}>No data yet</div>
          ) : (
            <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
              {topTypes.map(([type, count]) => (
                <div key={type} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: ".6rem 1rem", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "var(--accent)" }}>{count}</div>
                  <div style={{ fontSize: ".75rem", color: "var(--text2)" }}>{type}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bot info */}
        <div className="card">
          <div className="card-title">Bot Configuration</div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem", fontSize: ".85rem" }}>
            {[
              { label: "KB Entries", val: stats?.kbEntries ?? 0 },
              { label: "Bot Status", val: stats?.botStatus ?? "unknown" },
              { label: "Active Sessions", val: stats?.activeSessions ?? 0 },
              { label: "Answer Sources", val: "KB → Nexity → Bayut → Gemini" },
              { label: "AI Model", val: "Gemini 1.5 Flash" },
              { label: "Lead Fields", val: "Purpose, Type, BR, Location, Budget, Name, Phone, Visit" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: ".5rem 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ color: "var(--text2)" }}>{item.label}</span>
                <span style={{ fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
