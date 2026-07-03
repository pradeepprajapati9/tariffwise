// app.js — form ko calculation + AI se jodता hai (UI wiring)

import { CATEGORIES, COUNTRY_EXTRA, SHIP_MODES } from "./data.js";
import { calculateLandedCost, money } from "./calc.js";
import { suggestCategory, saveApiKey, getApiKey } from "./gemini.js";

// --- Dropdowns ko data.js se bharo (taaki ek hi jagah update ho) ---
function fillSelect(el, obj, valueLabel = (v) => v.label) {
  el.innerHTML = "";
  for (const [key, v] of Object.entries(obj)) {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = valueLabel(v);
    el.appendChild(opt);
  }
}

const $ = (id) => document.getElementById(id);

function init() {
  fillSelect($("category"), CATEGORIES);
  fillSelect($("country"), COUNTRY_EXTRA);
  fillSelect($("shipMode"), SHIP_MODES);
  $("country").value = "CN"; // sabse common origin

  // Saved API key dikhao
  $("apiKey").value = getApiKey();

  $("calcForm").addEventListener("submit", onCalculate);
  $("aiBtn").addEventListener("click", onAiSuggest);
  $("saveKeyBtn").addEventListener("click", onSaveKey);
}

function onSaveKey() {
  saveApiKey($("apiKey").value);
  flash($("keyStatus"), "✅ Key save ho gayi (sirf tumhare browser me)");
}

async function onAiSuggest() {
  const desc = $("productDesc").value.trim();
  if (!desc) {
    flash($("aiStatus"), "⚠️ Pehle product ka naam/description likho", true);
    return;
  }
  if (!getApiKey()) {
    flash($("aiStatus"), "⚠️ Pehle apni free Gemini key daalo (upar)", true);
    return;
  }
  $("aiBtn").disabled = true;
  flash($("aiStatus"), "🤖 AI soch raha hai...");
  try {
    const s = await suggestCategory(desc);
    $("category").value = s.categoryKey;
    flash(
      $("aiStatus"),
      `✅ AI: ${CATEGORIES[s.categoryKey].label} — HTS ${s.hts} (${s.reason})`
    );
  } catch (e) {
    const msg =
      e.message === "no-key"
        ? "⚠️ Gemini key nahi mili"
        : "❌ " + e.message;
    flash($("aiStatus"), msg, true);
  } finally {
    $("aiBtn").disabled = false;
  }
}

function onCalculate(e) {
  e.preventDefault();
  const value = parseFloat($("value").value);
  if (!value || value <= 0) {
    flash($("aiStatus"), "⚠️ Sahi product value ($) daalo", true);
    return;
  }

  const r = calculateLandedCost({
    categoryKey: $("category").value,
    value,
    countryKey: $("country").value,
    shipMode: $("shipMode").value,
    marginPct: parseFloat($("margin").value) || 25,
  });

  renderResult(r);
}

function pct(n) {
  return (n * 100).toFixed(1) + "%";
}

function renderResult(r) {
  const box = $("result");
  const lostLine =
    r.savingsLostVsOldRule > 0
      ? `<div class="alert">🚨 29 Aug 2025 se pehle is parcel pe <b>$0</b> lagta tha
         (de minimis chhoot). Ab lagega <b>${money(r.savingsLostVsOldRule)}</b>.</div>`
      : "";

  box.innerHTML = `
    ${lostLine}
    <div class="card">
      <table class="breakdown">
        <tr><td>📦 Product value</td><td>${money(r.productValue)}</td></tr>
        <tr><td>🏷️ HTS code</td><td>${r.htsCode}</td></tr>
        <tr><td>📂 Category</td><td>${r.category}</td></tr>
        <tr><td>🌍 Origin</td><td>${r.country}</td></tr>
        <tr class="sub"><td>Base duty (category)</td><td>${pct(r.baseDutyRate)}</td></tr>
        <tr class="sub"><td>Country extra tariff</td><td>${pct(r.countryExtraRate)}</td></tr>
        <tr><td>💰 Total duty (${pct(r.totalDutyRate)})</td><td>${money(r.duty)}</td></tr>
        <tr><td>🧾 Customs MPF fee</td><td>${money(r.mpf)}</td></tr>
        ${r.hmf > 0 ? `<tr><td>🚢 Harbor fee (HMF)</td><td>${money(r.hmf)}</td></tr>` : ""}
        <tr class="total"><td>✅ Total landed cost</td><td>${money(r.landedCost)}</td></tr>
        <tr class="price"><td>💡 Suggested price (+${r.marginPct}%)</td><td>${money(r.suggestedPrice)}</td></tr>
      </table>
      <p class="note">${r.countryNote}</p>
    </div>
    <p class="disclaimer">⚠️ Ye ek <b>estimate</b> hai, legal/customs advice nahi.
    Asli rate exact HTS code aur latest trade rules pe depend karta hai.</p>
  `;
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Chhota status message dikhane ka helper
function flash(el, msg, isError = false) {
  el.textContent = msg;
  el.className = "status" + (isError ? " err" : " ok");
}

init();
