// data.js — TariffWise ke saare numbers ek jagah (isliye update karna aasan)
//
// ⚠️ HONEST DISCLAIMER: Ye rates "estimate" ke liye hain, legal advice nahi.
// Asli tariff har product ke exact HTS code, trade deals aur roz badalte rules
// pe depend karta hai. Yahan common categories ke typical rates rakhe hain.
// Source dates neeche diye hain — build ke waqt inhe verify/update karna.
//
// Sources:
//  - USITC HTS (hts.usitc.gov) — MFN base duty rates
//  - US CBP — de minimis $800 exemption REMOVED effective 29 Aug 2025
//  - Section 301 (China) + 2025 country/reciprocal tariffs (verify latest before launch)

// De minimis khatam hone ki date — pehle iske neeche parcels tax-free the
export const DE_MINIMIS_REMOVED_DATE = "2025-08-29";

// US customs ke fixed fees (2025 approx — verify before launch)
export const US_FEES = {
  // Merchandise Processing Fee: value ka 0.3464%, min ~$32.71 max ~$634.62 (formal entry)
  mpfRate: 0.003464,
  mpfMin: 32.71,
  mpfMax: 634.62,
  // Informal entry (chhote parcels, ~< $2500) ke liye flat MPF
  mpfInformalFlat: 2.62,
  informalThreshold: 2500,
  // Harbor Maintenance Fee: sirf ocean/sea freight pe (0.125%)
  hmfRate: 0.00125,
  // Customs broker ka rough estimate (agar broker use kare)
  brokerEstimate: 15.0,
};

// Category → HTS code + typical MFN (base) duty rate
// Ye wo categories hain jahan sabse zyada chhote sellers hain (Etsy/eBay/Shopify)
export const CATEGORIES = {
  clothing_knit: {
    label: "Kapde — knit (t-shirt, sweater)",
    hts: "6109.10",
    baseDuty: 0.165, // ~16.5% typical apparel
  },
  clothing_woven: {
    label: "Kapde — woven (shirt, dress)",
    hts: "6206.30",
    baseDuty: 0.155,
  },
  jewelry: {
    label: "Jewelry / imitation gehne",
    hts: "7117.90",
    baseDuty: 0.11,
  },
  jewelry_precious: {
    label: "Jewelry — precious metal (silver/gold)",
    hts: "7113.11",
    baseDuty: 0.05,
  },
  leather_bags: {
    label: "Bags / purse (leather)",
    hts: "4202.21",
    baseDuty: 0.09,
  },
  footwear: {
    label: "Shoes / footwear",
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
    label: "Ceramic / pottery / mugs",
    hts: "6912.00",
    baseDuty: 0.095,
  },
  toys: {
    label: "Toys / games",
    hts: "9503.00",
    baseDuty: 0.0, // most toys free
  },
  electronics_acc: {
    label: "Electronics accessory (cable, case)",
    hts: "8517.62",
    baseDuty: 0.0,
  },
  cosmetics: {
    label: "Cosmetics / skincare / soap",
    hts: "3304.99",
    baseDuty: 0.0,
  },
  stationery: {
    label: "Stationery / paper / art print",
    hts: "4911.91",
    baseDuty: 0.0,
  },
  textiles_home: {
    label: "Home textile (blanket, cushion)",
    hts: "6304.91",
    baseDuty: 0.058,
  },
  other: {
    label: "Other / pata nahi",
    hts: "9999.00",
    baseDuty: 0.05, // safe average estimate
  },
};

// Country of origin → additional tariff (base duty ke UPAR extra)
// ⚠️ 2025 ke tariffs tezi se badalte hain — launch se pehle latest verify karo.
// Ye extra %, category ke base duty me ADD hota hai (approx representative values).
export const COUNTRY_EXTRA = {
  CN: { label: "China", extra: 0.30, note: "Section 301 + 2025 tariffs (high, verify latest)" },
  IN: { label: "India", extra: 0.10, note: "2025 reciprocal tariff estimate" },
  VN: { label: "Vietnam", extra: 0.20, note: "2025 tariff estimate" },
  BD: { label: "Bangladesh", extra: 0.15, note: "2025 tariff estimate" },
  TR: { label: "Turkey", extra: 0.10, note: "estimate" },
  MX: { label: "Mexico", extra: 0.0, note: "USMCA — often duty-free (rules apply)" },
  CA: { label: "Canada", extra: 0.0, note: "USMCA — often duty-free (rules apply)" },
  GB: { label: "UK", extra: 0.10, note: "estimate" },
  EU: { label: "EU (Germany/France/etc)", extra: 0.10, note: "2025 tariff estimate" },
  other: { label: "Other country", extra: 0.10, note: "safe average estimate" },
};

// Shipping mode — HMF sirf sea pe lagta hai
export const SHIP_MODES = {
  air: { label: "Air / courier (DHL, FedEx)", hmf: false },
  sea: { label: "Sea / ocean freight", hmf: true },
};
