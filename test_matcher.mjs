import { matchCategory } from "./js/matcher.js";
const cases = [
  ["cotton t-shirt", "clothing_knit"],
  ["silver ring", "jewelry_precious"],
  ["gold necklace", "jewelry_precious"],
  ["imitation earrings", "jewelry"],
  ["ceramic mug", "ceramics"],
  ["scented candle", "candles"],
  ["leather handbag", "leather_bags"],
  ["running shoes", "footwear"],
  ["wooden showpiece wall art", "home_decor"],
  ["kids toy puzzle", "toys"],
  ["phone case charger cable", "electronics_acc"],
  ["face cream skincare serum", "cosmetics"],
  ["notebook journal", "stationery"],
  ["cushion cover pillow", "textiles_home"],
  ["blue denim jeans", "clothing_woven"],
  ["random gizmo widget", "other"],
];
let pass = 0;
for (const [desc, expected] of cases) {
  const r = matchCategory(desc);
  const ok = r.categoryKey === expected;
  if (ok) pass++;
  console.log(`${ok ? "PASS" : "FAIL"}  "${desc}" → ${r.categoryKey}${ok ? "" : "  (expected " + expected + ")"}`);
}
console.log(`\n${pass}/${cases.length} passed`);
