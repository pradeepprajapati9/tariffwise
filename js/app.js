// app.js — wires the form to the calculation + AI (UI logic)

import { CATEGORIES, COUNTRY_EXTRA, SHIP_MODES } from "./data.js";
import { calculateLandedCost, money } from "./calc.js";
import { suggestCategory, saveApiKey, getApiKey } from "./gemini.js";
import { matchCategory } from "./matcher.js";
import { AI_ENABLED, AFFILIATE_URL } from "./config.js";

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

  // Auto-detect always works via the local matcher — no key required.
  $("aiBtn").addEventListener("click", onAiSuggest);

  // The optional Gemini key box is only for users who want AI-refined matching.
  if (AI_ENABLED) {
    $("saveKeyBtn").addEventListener("click", onSaveKey);
    $("apiKey").value = localStorage.getItem("tariffwise_gemini_key") || "";
  } else {
    document.querySelector(".keybox").style.display = "none";
  }

  // Show a worked example on load so visitors instantly see what the tool does
  // instead of a blank form (the #1 reason first-time users bounce).
  $("productDesc").value = "cotton t-shirt";
  $("value").value = "20";
  $("category").value = "clothing_knit";
  runCalc({ example: true });
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

  // 1) Instant local match — always works, no key, no server.
  const local = matchCategory(desc);
  $("category").value = local.categoryKey;
  flash(
    $("aiStatus"),
    `Detected: ${CATEGORIES[local.categoryKey].label} (${local.reason})`
  );

  // 2) If the user provided their own Gemini key, optionally refine. Any
  //    failure is silent — the local result already stands.
  if (AI_ENABLED && getApiKey()) {
    $("aiBtn").disabled = true;
    try {
      const s = await suggestCategory(desc);
      if (CATEGORIES[s.categoryKey]) {
        $("category").value = s.categoryKey;
        flash(
          $("aiStatus"),
          `AI-refined: ${CATEGORIES[s.categoryKey].label} — HTS ${s.hts} (${s.reason})`
        );
      }
    } catch {
      /* keep the local result */
    } finally {
      $("aiBtn").disabled = false;
    }
  }
}

function onCalculate(e) {
  e.preventDefault();
  runCalc({ example: false });
}

// Reads the form, calculates, and renders. Shared by the submit handler and the
// on-load example.
function runCalc({ example }) {
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

  renderResult(r, example);
}

function pct(n) {
  return (n * 100).toFixed(1) + "%";
}

function renderResult(r, isExample = false) {
  const box = $("result");

  // Plain-language shock line — the strongest hook for a first-time seller.
  const shock =
    r.savingsLostVsOldRule > 0
      ? `<div class="alert">💥 This used to be <strong>free</strong> to ship to the US.
         Since the $800 de-minimis rule ended (29 Aug 2025), it now costs you about
         <strong>${money(r.savingsLostVsOldRule)}</strong> in duty &amp; fees.</div>`
      : "";

  const exampleTag = isExample
    ? `<p class="example-tag">👋 Example shown — change the values above for your own product.</p>`
    : "";

  box.innerHTML = `
    ${exampleTag}
    ${shock}

    <div class="result-hero">
      <div class="hero-num">
        <span class="hero-num-label">Total cost to land in the US</span>
        <span class="hero-num-value">${money(r.landedCost)}</span>
        <span class="hero-num-sub">your ${money(r.productValue)} product + duty &amp; fees</span>
      </div>
      <div class="hero-num accent">
        <span class="hero-num-label">Charge at least</span>
        <span class="hero-num-value">${money(r.suggestedPrice)}</span>
        <span class="hero-num-sub">to keep a ${r.marginPct}% profit</span>
      </div>
    </div>

    <!-- Money slot: relevant Amazon products for sellers, tagged for affiliate income -->
    <a class="cta-card" href="${AFFILIATE_URL}" target="_blank" rel="noopener nofollow sponsored">
      <span class="cta-icon">📦</span>
      <span class="cta-text">
        <strong>Stock up on shipping &amp; packing supplies</strong>
        <span>Boxes, mailers, tape &amp; scales on Amazon →</span>
      </span>
    </a>
    <p class="affiliate-note">As an Amazon Associate, we earn from qualifying purchases.</p>

    <details class="result-card breakdown-box">
      <summary>See how this is calculated</summary>
      <table class="breakdown">
        <tr><td>Product value</td><td>${money(r.productValue)}</td></tr>
        <tr><td>Category (HTS ${r.htsCode})</td><td>${r.category}</td></tr>
        <tr><td>Country of origin</td><td>${r.country}</td></tr>
        <tr class="sub"><td>Base duty (category)</td><td>${pct(r.baseDutyRate)}</td></tr>
        <tr class="sub"><td>Country tariff</td><td>${pct(r.countryExtraRate)}</td></tr>
        <tr><td>Import duty (${pct(r.totalDutyRate)})</td><td>${money(r.duty)}</td></tr>
        <tr><td>Customs processing fee (MPF)</td><td>${money(r.mpf)}</td></tr>
        ${r.hmf > 0 ? `<tr><td>Harbor fee (HMF, sea freight)</td><td>${money(r.hmf)}</td></tr>` : ""}
        <tr class="total"><td>Total landed cost</td><td>${money(r.landedCost)}</td></tr>
        <tr class="price"><td>Suggested price (+${r.marginPct}%)</td><td>${money(r.suggestedPrice)}</td></tr>
      </table>
      <p class="note">${r.countryNote}</p>
    </details>

    <p class="disclaimer">Estimate only — not customs or legal advice. Actual duty
    depends on the exact HTS code and current trade rules.</p>
  `;
  if (!isExample) box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Small helper to show a status message
function flash(el, msg, isError = false) {
  el.textContent = msg;
  el.className = "status" + (isError ? " err" : " ok");
}

init();
