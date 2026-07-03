// calc.js — the core math (pure functions, no UI — so it is easy to test)

import {
  CATEGORIES,
  COUNTRY_EXTRA,
  US_FEES,
  SHIP_MODES,
  DE_MINIMIS_REMOVED_DATE,
} from "./data.js";

// Format a number as a USD amount
export function money(n) {
  return "$" + (Math.round(n * 100) / 100).toFixed(2);
}

// Compute the Merchandise Processing Fee
function calcMPF(value) {
  if (value < US_FEES.informalThreshold) {
    // small parcel = flat informal fee
    return US_FEES.mpfInformalFlat;
  }
  const raw = value * US_FEES.mpfRate;
  return Math.min(Math.max(raw, US_FEES.mpfMin), US_FEES.mpfMax);
}

/**
 * Calculate the total landed cost.
 * @param {Object} input
 * @param {string} input.categoryKey  - key into CATEGORIES
 * @param {number} input.value        - product value in USD
 * @param {string} input.countryKey   - key into COUNTRY_EXTRA
 * @param {string} input.shipMode      - "air" | "sea"
 * @param {number} [input.marginPct]  - desired profit margin % (default 25%)
 * @returns {Object} breakdown
 */
export function calculateLandedCost(input) {
  const {
    categoryKey,
    value,
    countryKey,
    shipMode = "air",
    marginPct = 25,
  } = input;

  const cat = CATEGORIES[categoryKey] || CATEGORIES.other;
  const country = COUNTRY_EXTRA[countryKey] || COUNTRY_EXTRA.other;
  const mode = SHIP_MODES[shipMode] || SHIP_MODES.air;

  const val = Number(value) || 0;

  // Total duty rate = category base + country extra
  const dutyRate = cat.baseDuty + country.extra;
  const duty = val * dutyRate;

  // Customs fees
  const mpf = calcMPF(val);
  const hmf = mode.hmf ? val * US_FEES.hmfRate : 0;

  // Total on the customs/duty side
  const totalDutyFees = duty + mpf + hmf;

  // Landed cost = product value + all import charges
  const landedCost = val + totalDutyFees;

  // Recommended selling price = landed cost + margin
  const margin = Number(marginPct) || 0;
  const suggestedPrice = landedCost * (1 + margin / 100);

  return {
    // inputs echo
    category: cat.label,
    htsCode: cat.hts,
    country: country.label,
    countryNote: country.note,
    shipMode: mode.label,
    productValue: val,

    // rates
    baseDutyRate: cat.baseDuty,
    countryExtraRate: country.extra,
    totalDutyRate: dutyRate,

    // amounts
    duty,
    mpf,
    hmf,
    totalDutyFees,
    landedCost,
    marginPct: margin,
    suggestedPrice,

    // context
    deMinimisRemoved: DE_MINIMIS_REMOVED_DATE,
    // Before the de minimis change, a sub-$800 parcel entered duty-free ($0).
    savingsLostVsOldRule: val < 800 ? totalDutyFees : 0,
  };
}
