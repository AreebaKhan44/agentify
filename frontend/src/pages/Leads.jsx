import React, { useState } from "react";

export default function Leads({ leads }) {
  const [search, setSearch] = useState("");

  const filtered = leads.filter((l) =>
    [l.name, l.phone, l.purpose, l.location, l.type].some((v) =>
      v?.toLowerCase().includes(search.toLowerCase())
    )
  );

  function exportCSV() {
    const headers = ["Name", "Phone", "Purpose", "Type", "Bedrooms", "Location", "Budget", "Visit Date", "Time"];
    const rows = filtered.map((l) => [
      l.name, l.phone, l.purpose, l.type, l.bedrooms,
      l.location, l.budget, l.visitDate, l.timestamp,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v || ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "nexity-leads.csv"; a.click();
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 1200 }} className="animate-fade">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700 }}>Leads</h2>
          <p style={{ color: "var(--text2)", fontSize: ".9rem" }}>{leads.length} total leads captured</p>
        </div>
        <button className="btn btn-outline" onClick={exportCSV}>📥 Export CSV</button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "1.5rem", maxWidth: 400 }}>
        <span style={{ position: "absolute", left: ".9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }}>🔍</span>
        <input
          className="input"
          style={{ paddingLeft: "2.4rem" }}
          placeholder="Search by name, phone, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Leads", val: leads.length, color: "#25d366" },
          { label: "Buyers", val: leads.filter((l) => l.purpose?.toLowerCase().includes("buy")).length, color: "#4fc3f7" },
          { label: "Sellers", val: leads.filter((l) => l.purpose?.toLowerCase().includes("sell")).length, color: "#ffb347" },
          { label: "Renters", val: leads.filter((l) => l.purpose?.toLowerCase().includes("rent")).length, color: "#7effc4" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.8rem", fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: ".78rem", color: "var(--text2)", marginTop: ".3rem" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ overflowX: "auto" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text3)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎯</div>
            <div>{search ? "No leads match your search" : "No leads yet — they appear here when customers interact with your bot"}</div>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".83rem" }}>
            <thead>
              <tr>
                {["#", "Name", "Phone", "Purpose", "Property", "Bedrooms", "Location", "Budget", "Visit", "Time"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: ".75rem 1rem", color: "var(--text2)", fontWeight: 500, borderBottom: "1px solid var(--border)", fontSize: ".78rem", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.reverse().map((lead, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(30,48,36,.4)" }}>
                  <td style={{ padding: ".75rem 1rem", color: "var(--text3)", fontSize: ".75rem" }}>{filtered.length - i}</td>
                  <td style={{ padding: ".75rem 1rem", fontWeight: 500 }}>{lead.name || "—"}</td>
                  <td style={{ padding: ".75rem 1rem", color: "var(--text2)" }}>{lead.phone || "—"}</td>
                  <td style={{ padding: ".75rem 1rem" }}>
                    <span className={`badge ${lead.purpose?.toLowerCase().includes("buy") ? "badge-green" : lead.purpose?.toLowerCase().includes("sell") ? "badge-warn" : "badge-blue"}`}>
                      {lead.purpose || "—"}
                    </span>
                  </td>
                  <td style={{ padding: ".75rem 1rem", color: "var(--text2)" }}>{lead.type || "—"}</td>
                  <td style={{ padding: ".75rem 1rem", color: "var(--text2)" }}>{lead.bedrooms || "—"}</td>
                  <td style={{ padding: ".75rem 1rem", color: "var(--text2)" }}>{lead.location || "—"}</td>
                  <td style={{ padding: ".75rem 1rem", color: "var(--accent)", fontWeight: 500 }}>{lead.budget || "—"}</td>
                  <td style={{ padding: ".75rem 1rem", color: "var(--text2)" }}>{lead.visitDate || "—"}</td>
                  <td style={{ padding: ".75rem 1rem", color: "var(--text3)", fontSize: ".75rem", whiteSpace: "nowrap" }}>
                    {lead.timestamp ? new Date(lead.timestamp).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
