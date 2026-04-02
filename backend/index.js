require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const https = require("https");
const http = require("http");
const { Client, LocalAuth } = require("whatsapp-web.js");
const QRCode = require("qrcode");

const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173", "*"] }));

const PORT = process.env.PORT || 3001;
const GEMINI_KEY = process.env.GEMINI_KEY;

// ============================================================
// 📚 STEP 1 — LOAD nexity.txt KNOWLEDGE BASE
// ============================================================
let KB_PAIRS = [];

function loadKB() {
  try {
    const file = fs.readFileSync(path.join(__dirname, "nexity.txt"), "utf-8");
    const blocks = file.split(/\n\n+/);
    KB_PAIRS = [];

    blocks.forEach((block) => {
      const qMatch = block.match(/Q:\s*(.*)/i);
      const aMatch = block.match(/A:\s*([\s\S]*)/i);
      if (qMatch && aMatch) {
        KB_PAIRS.push({
          q: qMatch[1].toLowerCase().trim(),
          a: aMatch[1].trim(),
        });
      }
    });

    // Also support pipe-separated format:  question|answer
    const lines = file.split("\n");
    lines.forEach((line) => {
      if (line.includes("|")) {
        const [q, a] = line.split("|");
        if (q && a) {
          KB_PAIRS.push({ q: q.toLowerCase().trim(), a: a.trim() });
        }
      }
    });

    // Deduplicate
    KB_PAIRS = KB_PAIRS.filter(
      (v, i, a) => a.findIndex((t) => t.q === v.q) === i
    );

    console.log(`✅ KB Loaded: ${KB_PAIRS.length} entries`);
  } catch (err) {
    console.log("❌ nexity.txt load error:", err.message);
  }
}

function findInKB(msg) {
  const lower = msg.toLowerCase();
  for (let item of KB_PAIRS) {
    if (lower.includes(item.q) || item.q.includes(lower.split(" ")[0])) {
      return item.a;
    }
  }
  return null;
}

// ============================================================
// 🌐 STEP 2 — WEBSITE SCRAPER (nexityrealestate.com + bayut)
// ============================================================
const NEXITY_URLS = [
  "https://nexityrealestate.com/",
  "https://www.bayut.com/companies/nexity-real-estate-106487/",
];

function fetchURL(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "text/html",
        },
        timeout: 8000,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }
    );
    req.on("error", () => resolve(""));
    req.on("timeout", () => { req.destroy(); resolve(""); });
  });
}

function extractText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 3000); // limit context
}

async function searchWebsites(question) {
  console.log("🌐 Searching Nexity websites...");
  for (const url of NEXITY_URLS) {
    try {
      const html = await fetchURL(url);
      if (!html) continue;
      const text = extractText(html);
      if (text.length > 200) {
        // Ask Gemini to answer from this page content
        const prompt = `You are a helpful assistant for Nexity Real Estate Dubai.

Here is content from their website (${url}):
---
${text}
---

Customer question: "${question}"

Answer the customer's question using the website content above.
If the answer is not in the content, say "not found" only.
Keep the answer short, friendly, and professional.`;

        const answer = await askGemini(prompt, true);
        if (
          answer &&
          !answer.toLowerCase().includes("not found") &&
          answer.length > 20
        ) {
          console.log(`✅ Answer found from: ${url}`);
          return answer;
        }
      }
    } catch (e) {
      console.log("Website fetch error:", e.message);
    }
  }
  return null;
}

// ============================================================
// 🤖 STEP 3 — GEMINI AI FALLBACK
// ============================================================
async function askGemini(prompt, raw = false) {
  return new Promise((resolve) => {
    if (!GEMINI_KEY) {
      console.log("❌ GEMINI_KEY not set in .env");
      return resolve(null);
    }

    const payload = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    });

    const req = https.request(
      {
        hostname: "generativelanguage.googleapis.com",
        path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            if (json?.error) {
              console.log("❌ Gemini error:", json.error.message);
              return resolve(null);
            }
            const text =
              json?.candidates?.[0]?.content?.parts?.[0]?.text;
            resolve(text || null);
          } catch (e) {
            console.log("❌ Gemini parse error:", e.message);
            resolve(null);
          }
        });
      }
    );

    req.on("error", (e) => {
      console.log("❌ Gemini request error:", e.message);
      resolve(null);
    });

    req.write(payload);
    req.end();
  });
}

async function askGeminiGeneral(question) {
  console.log("🤖 Asking Gemini (general):", question);
  const prompt = `You are a helpful assistant. Answer this question clearly and concisely:

"${question}"

Keep the answer under 150 words. Be friendly and helpful.`;
  return await askGemini(prompt);
}

// ============================================================
// 🏠 SMART ANSWER ENGINE
// Priority: nexity.txt → websites → gemini general
// ============================================================
async function getSmartAnswer(question) {
  // 1. Check KB
  const kbAnswer = findInKB(question);
  if (kbAnswer) {
    console.log("📚 Answer from KB");
    return kbAnswer;
  }

  // 2. Check if real-estate / nexity related → scrape websites
  const reWords = [
    "nexity","property","properties","villa","villas","apartment","apartments",
    "townhouse","dubai","buy","sell","rent","price","bedroom","bedroom","location",
    "area","listing","office","contact","agent","floor","sqft","mortgage","bayut",
    "realestate","real estate","palm","marina","downtown","damac hills2", "jbr","business bay",
  ];
  const isRE = reWords.some((w) => question.toLowerCase().includes(w));

  if (isRE) {
    const webAnswer = await searchWebsites(question);
    if (webAnswer) return webAnswer;
  }

  // 3. Gemini general fallback
  const geminiAnswer = await askGeminiGeneral(question);
  if (geminiAnswer) return geminiAnswer;

  return "I'm sorry, I couldn't find an answer to that. Please contact Nexity directly at https://nexityrealestate.com/ 🏡";
}

// ============================================================
// 📋 LEAD FLOW — Dubai Real Estate Booking
// ============================================================
let leads = {};

const LEAD_STEPS = [
  { key: "purpose",   ask: "🏠 Are you looking to *Buy* ,*Sell* or *Rent** a property?" },
  { key: "type",      ask: "What type of property are you interested in?\n🏢 Apartment | 🏡 Villa | 🏘️ Townhouse | 🏗️ Other" },
  { key: "bedrooms",  ask: "How many bedrooms do you need?\n1BR | 2BR | 3BR | 4BR | 5BR+" },
  { key: "location",  ask: "📍 Which area/location in Dubai do you prefer?\n(e.g. Dubai Marina, Palm Jumeirah, Central Downtown, Damac Hills 2, Tria Dubai Silicon Oasis, Portofinio, other)" },
  { key: "budget",    ask: "💰 What is your budget range?\n(e.g. AED 500K–1M, AED 1M–3M, AED 3M+)" },
  { key: "name",      ask: "👤 Great! May I have your full name please?" },
  { key: "phone",     ask: "📞 Your contact phone number?" },
  { key: "visitDate", ask: "📅 When would you like to schedule a visit or call with our agent?\n(e.g. Tomorrow 10am, Day after Tomorrow, This weekend, ASAP)" },
];

function initLead(user) {
  if (!leads[user]) {
    leads[user] = { step: -1, data: {}, startedFlow: false };
  }
}

function isLeadTrigger(msg) {
  const triggers = [
    "buy","sell","rent","looking for","interested in","need apartment",
    "need villa","want to buy","want to sell","property","book","booking",
    "visit","agent","help me find",
  ];
  return triggers.some((t) => msg.toLowerCase().includes(t));
}

async function handleMessage(msg) {
  const user = msg.from;
  const text = msg.body.trim();
  const lower = text.toLowerCase();

  initLead(user);
  const lead = leads[user];

  // ── Greeting / Start ──
  if (["hi","hello","hey","salam","assalam","start","help"].some((g) => lower === g || lower.startsWith(g + " "))) {
    lead.step = -1;
    lead.startedFlow = false;
    return msg.reply(
      `👋 *Welcome to Nexity Real Estate Dubai!*\n\n` +
      `I'm your AI property assistant. I can help you:\n` +
      `🏠 *Buy*  *Sell* or *Rent* a property in Dubai\n` +
      `📋 Book a consultation with our agents\n` +
      `❓Feel free to ask about Nexity Realestate Questions\n\n` 
      
    );
  }

  // ── Already in lead flow ──
  if (lead.startedFlow && lead.step >= 0 && lead.step < LEAD_STEPS.length) {
    const currentStep = LEAD_STEPS[lead.step];
    lead.data[currentStep.key] = text;
    lead.step++;

    if (lead.step < LEAD_STEPS.length) {
      return msg.reply(LEAD_STEPS[lead.step].ask);
    } else {
      // Flow complete
      lead.startedFlow = false;
      const d = lead.data;
      const summary =
        `✅ *Booking Request Received!*\n\n` +
        `📋 *Summary:*\n` +
        `• Purpose: ${d.purpose}\n` +
        `• Property: ${d.type} (${d.bedrooms})\n` +
        `• Location: ${d.location}\n` +
        `• Budget: ${d.budget}\n` +
        `• Name: ${d.name}\n` +
        `• Phone: ${d.phone}\n` +
        `• Preferred Visit: ${d.visitDate}\n\n` +
        `🎉 Our Nexity agent will contact you within *2 hours*!\n` +
        `🌐 Browse more at: https://nexityrealestate.com/`;

      // Save lead to file
      const leadLine = JSON.stringify({ user, timestamp: new Date().toISOString(), ...d }) + "\n";
      fs.appendFileSync(path.join(__dirname, "leads.json"), leadLine);
      console.log("💾 Lead saved:", d.name);

      return msg.reply(summary);
    }
  }

  // ── Trigger lead flow ──
  if (isLeadTrigger(lower) && !lead.startedFlow) {
    lead.startedFlow = true;
    lead.step = 0;
    lead.data = {};
    return msg.reply(
      `Perfect! I'll help you find the ideal property in Dubai. 🏙️\n\n` +
      LEAD_STEPS[0].ask
    );
  }

  // ── Smart answer (KB → Website → Gemini) ──
  const answer = await getSmartAnswer(text);
  return msg.reply(answer);
}

// ============================================================
// 📱 WHATSAPP CLIENT
// ============================================================
let qrImage = null;
let isReady = false;
let botStatus = "starting"; // starting | qr | ready | error

const client = new Client({
  authStrategy: new LocalAuth({ clientId: "nexity-bot" }),
  puppeteer: {
    headless: true,
    protocolTimeout: 120000,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
      "--no-zygote",
      "--disable-extensions",
      "--disable-background-networking",
      "--window-size=1280,720",
    ],
  },
});

client.on("qr", async (qr) => {
  qrImage = await QRCode.toDataURL(qr);
  botStatus = "qr";
  isReady = false;
  console.log("📱 QR Generated — scan it!");
});

client.on("ready", () => {
  isReady = true;
  botStatus = "ready";
  qrImage = null;
  console.log("✅ WhatsApp Connected & Ready!");
});

client.on("disconnected", (reason) => {
  isReady = false;
  botStatus = "starting";
  console.log("⚠️ Disconnected:", reason);
});

client.on("message", async (msg) => {
  if (msg.isGroupMsg) return; // ignore group messages
  console.log(`📩 [${msg.from}]: ${msg.body}`);
  try {
    await handleMessage(msg);
  } catch (err) {
    console.log("❌ Message handler error:", err.message);
  }
});

client.on("auth_failure", (msg) => {
  botStatus = "error";
  console.log("❌ Auth failure:", msg);
});

// ============================================================
// 🌐 REST API ROUTES
// ============================================================

// QR / Status
app.get("/api/qr", (req, res) => {
  res.json({ status: botStatus, qr: qrImage, ready: isReady });
});

// Leads
app.get("/api/leads", (req, res) => {
  try {
    const file = path.join(__dirname, "leads.json");
    if (!fs.existsSync(file)) return res.json([]);
    const lines = fs.readFileSync(file, "utf-8").trim().split("\n").filter(Boolean);
    const data = lines.map((l) => JSON.parse(l));
    res.json(data);
  } catch (e) {
    res.json([]);
  }
});

// Stats
app.get("/api/stats", (req, res) => {
  const file = path.join(__dirname, "leads.json");
  let totalLeads = 0;
  if (fs.existsSync(file)) {
    const lines = fs.readFileSync(file, "utf-8").trim().split("\n").filter(Boolean);
    totalLeads = lines.length;
  }
  res.json({
    totalLeads,
    activeSessions: Object.keys(leads).length,
    kbEntries: KB_PAIRS.length,
    botStatus,
    isReady,
  });
});

// Health
app.get("/api/health", (req, res) => {
  res.json({ ok: true, port: PORT, time: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.send(`🚀 Nexity WhatsApp Bot — Status: ${botStatus}`);
});

// ============================================================
loadKB();
client.initialize();
app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));
