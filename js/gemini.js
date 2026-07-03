// gemini.js — optional AI classification of the product's HTS code + category.
//
// The user supplies their own FREE Gemini API key (from aistudio.google.com).
// Without a key the app still works fully via manual category selection — the
// AI is only a convenience. The key is stored in the browser's localStorage and
// is never sent to any server of ours (there is no server).

import { CATEGORIES } from "./data.js";

const MODEL = "gemini-2.0-flash"; // free tier, fast
const KEY_STORE = "tariffwise_gemini_key";

export function saveApiKey(key) {
  if (key) localStorage.setItem(KEY_STORE, key.trim());
  else localStorage.removeItem(KEY_STORE);
}

export function getApiKey() {
  return localStorage.getItem(KEY_STORE) || "";
}

/**
 * Suggest the best category key + HTS code from a product description.
 * @param {string} description - the product text the user entered
 * @returns {Promise<{categoryKey:string, hts:string, reason:string}>}
 */
export async function suggestCategory(description) {
  const key = getApiKey();
  if (!key) throw new Error("no-key");

  // Constrain the model to our known categories so it can't invent one.
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

  // Extract the JSON object (the model sometimes wraps it in ```json fences).
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("could not read the AI response: " + text.slice(0, 100));

  const parsed = JSON.parse(match[0]);

  // Safety: if the model returned an unknown key, fall back to "other".
  if (!CATEGORIES[parsed.categoryKey]) {
    parsed.categoryKey = "other";
    parsed.hts = CATEGORIES.other.hts;
    parsed.reason = (parsed.reason || "") + " (adjusted)";
  }
  return parsed;
}
