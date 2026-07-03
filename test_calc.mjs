import { calculateLandedCost, money } from "./js/calc.js";

// Test 1: $20 cotton t-shirt from China, air
const r1 = calculateLandedCost({ categoryKey: "clothing_knit", value: 20, countryKey: "CN", shipMode: "air", marginPct: 25 });
console.log("TEST 1: $20 knit t-shirt from China (air)");
console.log("  duty rate:", (r1.totalDutyRate*100).toFixed(1)+"%", "| duty:", money(r1.duty));
console.log("  MPF:", money(r1.mpf), "| HMF:", money(r1.hmf));
console.log("  landed:", money(r1.landedCost), "| suggested:", money(r1.suggestedPrice));
console.log("  de-minimis lost:", money(r1.savingsLostVsOldRule));
console.log("  ASSERT landed > value:", r1.landedCost > 20 ? "PASS" : "FAIL");
console.log("  ASSERT small-parcel MPF flat 2.62:", r1.mpf === 2.62 ? "PASS" : "FAIL");

// Test 2: $3000 jewelry from India, sea (formal entry, HMF applies)
const r2 = calculateLandedCost({ categoryKey: "jewelry", value: 3000, countryKey: "IN", shipMode: "sea", marginPct: 30 });
console.log("\nTEST 2: $3000 jewelry from India (sea)");
console.log("  duty:", money(r2.duty), "| MPF:", money(r2.mpf), "| HMF:", money(r2.hmf));
console.log("  landed:", money(r2.landedCost), "| suggested:", money(r2.suggestedPrice));
console.log("  ASSERT HMF applies on sea:", r2.hmf > 0 ? "PASS" : "FAIL");
console.log("  ASSERT formal MPF (>min):", r2.mpf >= 32.71 ? "PASS" : "FAIL");
console.log("  ASSERT no de-minimis (val>800):", r2.savingsLostVsOldRule === 0 ? "PASS" : "FAIL");

// Test 3: unknown category + country fallback
const r3 = calculateLandedCost({ categoryKey: "xyz", value: 50, countryKey: "zzz", shipMode: "air" });
console.log("\nTEST 3: unknown category/country fallback");
console.log("  category:", r3.category, "| country:", r3.country);
console.log("  ASSERT fallback works:", r3.landedCost > 50 ? "PASS" : "FAIL");
