// calc.js — asli hisaab (pure functions, koi UI nahi — isliye test karna aasan)

import {
  CATEGORIES,
  COUNTRY_EXTRA,
  US_FEES,
  SHIP_MODES,
  DE_MINIMIS_REMOVED_DATE,
} from "./data.js";

// Ek number ko $ me dikhane ke liye
export function money(n) {
  return "$" + (Math.round(n * 100) / 100).toFixed(2);
}

// Merchandise Processing Fee nikalo
function calcMPF(value) {
  if (value < US_FEES.informalThreshold) {
    // chhota parcel = flat informal fee
    return US_FEES.mpfInformalFlat;
  }
  const raw = value * US_FEES.mpfRate;
  return Math.min(Math.max(raw, US_FEES.mpfMin), US_FEES.mpfMax);
}

/**
 * Landed cost calculate karo.
 * @param {Object} input
 * @param {string} input.categoryKey  - CATEGORIES ka key
 * @param {number} input.value        - product value USD me
 * @param {string} input.countryKey   - COUNTRY_EXTRA ka key
 * @param {string} input.shipMode      - "air" | "sea"
 * @param {number} [input.marginPct]  - kitna profit % chahiye (default 25%)
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

  // Total customs/duty side
  const totalDutyFees = duty + mpf + hmf;

  // Landed cost = product value + saare import charges
  const landedCost = val + totalDutyFees;

  // Suggested selling price = landed cost + margin
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
    // "pehle kitna bachta tha" — de minimis ke pehle chhote parcel pe $0 lagta tha
    savingsLostVsOldRule: val < 800 ? totalDutyFees : 0,
  };
}
