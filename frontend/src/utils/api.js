const BASE = "https://project-six-henna-59.vercel.app/api";

export const api = {
  async getQR() {
    const res = await fetch(`${BASE}/qr`);
    if (!res.ok) throw new Error("QR fetch failed");
    return res.json();
  },

  async getStats() {
    const res = await fetch(`${BASE}/stats`);
    if (!res.ok) throw new Error("Stats fetch failed");
    return res.json();
  },

  async getLeads() {
    const res = await fetch(`${BASE}/leads`);
    if (!res.ok) throw new Error("Leads fetch failed");
    return res.json();
  },
};




// const BASE = import.meta.env.VITE_API_URL 
//   ? `${import.meta.env.VITE_API_URL}/api`
//   : "http://localhost:3001/api";  // fallback for local dev

// export const api = {
//   async getQR() {
//     const res = await fetch(`${BASE}/qr-image`);  // qr-image returns JSON
//     if (!res.ok) throw new Error("QR fetch failed");
//     return res.json();
//   },

//   async getStats() {
//     const res = await fetch(`${BASE}/stats`);
//     if (!res.ok) throw new Error("Stats fetch failed");
//     return res.json();
//   },

//   async getLeads() {
//     const res = await fetch(`${BASE}/leads`);
//     if (!res.ok) throw new Error("Leads fetch failed");
//     return res.json();
//   },
// };
