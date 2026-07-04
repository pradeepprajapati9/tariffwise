// app.js — wires the form to the calculation + AI (UI logic)

import { CATEGORIES, COUNTRY_EXTRA, SHIP_MODES } from "./data.js";
import { calculateLandedCost, money } from "./calc.js";
import { suggestCategory, saveApiKey, getApiKey } from "./gemini.js";
import { AI_ENABLED } from "./config.js";

// --- Populate dropdowns from data.js (single source of truth) ---
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
  $("country").value = "CN"; // most common origin

  $("calcForm").addEventListener("submit", onCalculate);

  if (AI_ENABLED) {
    $("aiBtn").addEventListener("click", onAiSuggest);
    $("saveKeyBtn").addEventListener("click", onSaveKey);
    // Show the user's own saved key (not the built-in demo key)
    $("apiKey").value = localStorage.getItem("tariffwise_gemini_key") || "";
  } else {
    // AI disabled: hide the AI button and the optional key box entirely
    $("aiBtn").style.display = "none";
    document.querySelector(".keybox").style.display = "none";
  }
}

function onSaveKey() {
  saveApiKey($("apiKey").value);
  flash($("keyStatus"), "API key saved in this browser only.");
}

async function onAiSuggest() {
  const desc = $("productDesc").value.trim();
  if (!desc) {
    flash($("aiStatus"), "Enter a product name or description first.", true);
    return;
  }
  if (!getApiKey()) {
    flash($("aiStatus"), "Add your free Gemini API key below to use AI classification.", true);
    return;
  }
  $("aiBtn").disabled = true;
  flash($("aiStatus"), "Classifying product…");
  try {
    const s = await suggestCategory(desc);
    $("category").value = s.categoryKey;
    flash(
      $("aiStatus"),
      `Suggested: ${CATEGORIES[s.categoryKey].label} — HTS ${s.hts} (${s.reason})`
    );
  } catch (e) {
    const msg =
      e.message === "no-key"
        ? "No Gemini API key found."
        : "AI classification failed: " + e.message;
    flash($("aiStatus"), msg, true);
  } finally {
    $("aiBtn").disabled = false;
  }
}

function onCalculate(e) {
  e.preventDefault();
  const value = parseFloat($("value").value);
  if (!value || value <= 0) {
    flash($("aiStatus"), "Enter a valid product value in USD.", true);
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
  const notice =
    r.savingsLostVsOldRule > 0
      ? `<div class="alert">Before 29 August 2025, this shipment qualified for
         duty-free entry under the $800 de minimis exemption. That exemption has
         ended, so an estimated <strong>${money(r.savingsLostVsOldRule)}</strong>
         in duty and fees now applies.</div>`
      : "";

  box.innerHTML = `
    ${notice}
    <div class="result-card">
      <table class="breakdown">
        <tr><td>Product value</td><td>${money(r.productValue)}</td></tr>
        <tr><td>HTS code</td><td>${r.htsCode}</td></tr>
        <tr><td>Category</td><td>${r.category}</td></tr>
        <tr><td>Country of origin</td><td>${r.country}</td></tr>
        <tr class="sub"><td>Base duty (category)</td><td>${pct(r.baseDutyRate)}</td></tr>
        <tr class="sub"><td>Country tariff</td><td>${pct(r.countryExtraRate)}</td></tr>
        <tr><td>Total duty (${pct(r.totalDutyRate)})</td><td>${money(r.duty)}</td></tr>
        <tr><td>Merchandise Processing Fee (MPF)</td><td>${money(r.mpf)}</td></tr>
        ${r.hmf > 0 ? `<tr><td>Harbor Maintenance Fee (HMF)</td><td>${money(r.hmf)}</td></tr>` : ""}
        <tr class="total"><td>Total landed cost</td><td>${money(r.landedCost)}</td></tr>
        <tr class="price"><td>Recommended price (+${r.marginPct}% margin)</td><td>${money(r.suggestedPrice)}</td></tr>
      </table>
      <p class="note">${r.countryNote}</p>
    </div>
    <p class="disclaimer">Estimate only — not customs or legal advice. Actual duty
    depends on the exact HTS code and current trade rules.</p>
  `;
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Small helper to show a status message
function flash(el, msg, isError = false) {
  el.textContent = msg;
  el.className = "status" + (isError ? " err" : " ok");
}

init();
