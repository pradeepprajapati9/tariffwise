// data.js — all of TariffWise's constants in one place (easy to update).
//
// IMPORTANT DISCLAIMER: These rates are for ESTIMATION only, not legal advice.
// Actual tariffs depend on each product's exact HTS code, trade deals, and rules
// that change frequently. The values below are typical rates for common
// categories. Verify/update them against the sources before public launch.
//
// Sources (last reviewed July 2026):
//  - USITC HTS (hts.usitc.gov) — MFN base duty rates
//  - US CBP / Federal Register — de minimis $800 exemption ended 29 Aug 2025;
//    indefinitely suspended for all modes by interim final rules (Jun/Jul 2026).
//  - Feb 20 2026: Supreme Court struck down IEEPA "reciprocal" country tariffs.
//    Replaced by a flat ~10% Section 122 baseline on nearly all imports.
//    China still carries Section 301 (~25%), so ~35% total above MFN.
//  NOTE: country tariffs change often — re-check the sources periodically.

// When these tariff figures were last reviewed (shown to users for transparency).
export const RATES_AS_OF = "July 2026";

// Date the de minimis exemption ended — below this, parcels were previously duty-free.
export const DE_MINIMIS_REMOVED_DATE = "2025-08-29";

// Fixed US customs fees (2025 approx — verify before launch)
export const US_FEES = {
  // Merchandise Processing Fee: 0.3464% of value, min ~$32.71 max ~$634.62 (formal entry)
  mpfRate: 0.003464,
  mpfMin: 32.71,
  mpfMax: 634.62,
  // Flat MPF for informal entries (small parcels, ~< $2500)
  mpfInformalFlat: 2.62,
  informalThreshold: 2500,
  // Harbor Maintenance Fee: applies only to ocean/sea freight (0.125%)
  hmfRate: 0.00125,
  // Rough customs-broker estimate (if a broker is used)
  brokerEstimate: 15.0,
};

// Category → HTS code + typical MFN (base) duty rate.
// These are the categories where most small sellers operate (Etsy/eBay/Shopify).
export const CATEGORIES = {
  clothing_knit: {
    label: "Apparel — knit (t-shirt, sweater)",
    hts: "6109.10",
    baseDuty: 0.165, // ~16.5% typical apparel
  },
  clothing_woven: {
    label: "Apparel — woven (shirt, dress)",
    hts: "6206.30",
    baseDuty: 0.155,
  },
  jewelry: {
    label: "Jewelry — imitation / costume",
    hts: "7117.90",
    baseDuty: 0.11,
  },
  jewelry_precious: {
    label: "Jewelry — precious metal (silver/gold)",
    hts: "7113.11",
    baseDuty: 0.05,
  },
  leather_bags: {
    label: "Bags & purses (leather)",
    hts: "4202.21",
    baseDuty: 0.09,
  },
  footwear: {
    label: "Footwear / shoes",
    hts: "6403.99",
    baseDuty: 0.10,
  },
  home_decor: {
    label: "Home decor / handicraft",
    hts: "4420.90",
    baseDuty: 0.032,
  },
  candles: {
    label: "Candles",
    hts: "3406.00",
    baseDuty: 0.0, // often free
  },
  ceramics: {
    label: "Ceramics / pottery / mugs",
    hts: "6912.00",
    baseDuty: 0.095,
  },
  toys: {
    label: "Toys & games",
    hts: "9503.00",
    baseDuty: 0.0, // most toys free
  },
  electronics_acc: {
    label: "Electronics accessories (cable, case)",
    hts: "8517.62",
    baseDuty: 0.0,
  },
  cosmetics: {
    label: "Cosmetics / skincare / soap",
    hts: "3304.99",
    baseDuty: 0.0,
  },
  stationery: {
    label: "Stationery / paper / art prints",
    hts: "4911.91",
    baseDuty: 0.0,
  },
  textiles_home: {
    label: "Home textiles (blanket, cushion)",
    hts: "6304.91",
    baseDuty: 0.058,
  },
  other: {
    label: "Other / not sure",
    hts: "9999.00",
    baseDuty: 0.05, // safe average estimate
  },
};

// Country of origin → additional tariff (added ON TOP of the base duty).
// Reflects the post-Feb-2026 landscape: a flat ~10% Section 122 baseline on
// nearly all imports (the IEEPA "reciprocal" country tariffs were struck down
// on 20 Feb 2026), with China still carrying Section 301 on top.
// NOTE: these change often — re-verify against the sources periodically.
export const COUNTRY_EXTRA = {
  CN: { label: "China", extra: 0.35, note: "10% Section 122 baseline + ~25% Section 301 (some goods far higher)." },
  IN: { label: "India", extra: 0.10, note: "10% Section 122 baseline (reciprocal tariff struck down Feb 2026)." },
  VN: { label: "Vietnam", extra: 0.10, note: "10% Section 122 baseline (was ~46% reciprocal, struck down Feb 2026)." },
  BD: { label: "Bangladesh", extra: 0.10, note: "10% Section 122 baseline." },
  TR: { label: "Turkey", extra: 0.10, note: "10% Section 122 baseline." },
  MX: { label: "Mexico", extra: 0.0, note: "USMCA-qualified goods usually duty-free; otherwise 10% baseline." },
  CA: { label: "Canada", extra: 0.0, note: "USMCA-qualified goods usually duty-free; otherwise 10% baseline." },
  GB: { label: "United Kingdom", extra: 0.10, note: "10% Section 122 baseline." },
  EU: { label: "European Union", extra: 0.10, note: "10% Section 122 baseline (was 20% reciprocal, struck down Feb 2026)." },
  other: { label: "Other country", extra: 0.10, note: "10% Section 122 baseline (applies to most countries)." },
};

// Shipping mode — HMF applies only to sea freight
export const SHIP_MODES = {
  air: { label: "Air / courier (DHL, FedEx)", hmf: false },
  sea: { label: "Sea / ocean freight", hmf: true },
};
