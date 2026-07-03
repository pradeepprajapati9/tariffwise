// gemini.js — optional AI se HTS code + category suggest karna
//
// User apni FREE Gemini API key daale (aistudio.google.com se milti hai).
// Key na ho to app phir bhi chalta hai (manual category se) — AI sirf helper hai.
// Key browser me localStorage me rehti hai, kahin bhejī nahi jaati (server nahi hai).

import { CATEGORIES } from "./data.js";

const MODEL = "gemini-2.0-flash"; // free tier, tez
const KEY_STORE = "tariffwise_gemini_key";

export function saveApiKey(key) {
  if (key) localStorage.setItem(KEY_STORE, key.trim());
  else localStorage.removeItem(KEY_STORE);
}

export function getApiKey() {
  return localStorage.getItem(KEY_STORE) || "";
}

/**
 * Product ke description se best category key + HTS code suggest karo.
 * @param {string} description - user ne jo product likha
 * @returns {Promise<{categoryKey:string, hts:string, reason:string}>}
 */
export async function suggestCategory(description) {
  const key = getApiKey();
  if (!key) throw new Error("no-key");

  // AI ko sirf hamari valid categories me se chunne do (galat category na de)
  const options = Object.entries(CATEGORIES)
    .map(([k, v]) => `${k}: ${v.label} (HTS ${v.hts})`)
    .join("\n");

  const prompt = `You are a US customs classification helper.
A seller wants to ship this product to the USA:
"${description}"

Choose the single BEST matching category from this list:
${options}

Reply ONLY as compact JSON, no markdown:
{"categoryKey":"<one key from the list>","hts":"<HTS code>","reason":"<max 8 words why>"}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(
    key
  )}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 120 },
    }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Gemini API error ${res.status}: ${t.slice(0, 200)}`);
  }

  const json = await res.json();
  const text =
    json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

  // JSON nikalo (kabhi kabhi AI ```json wrap kar deta hai)
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI ne saaf jawab nahi diya: " + text.slice(0, 100));

  const parsed = JSON.parse(match[0]);

  // Safety: agar AI ne galat key di to "other" pe fallback
  if (!CATEGORIES[parsed.categoryKey]) {
    parsed.categoryKey = "other";
    parsed.hts = CATEGORIES.other.hts;
    parsed.reason = (parsed.reason || "") + " (adjusted)";
  }
  return parsed;
}
