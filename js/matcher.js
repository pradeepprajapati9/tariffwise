// matcher.js — local keyword-based category detector.
//
// No API key, no server, no cost — runs entirely in the browser and works for
// every visitor instantly. Maps a free-text product description to one of the
// categories defined in data.js. Good enough for common products; the optional
// Gemini path (gemini.js) can still refine results if the user provides a key.

import { CATEGORIES } from "./data.js";

// Keyword → category. More specific categories are listed first so that, on a
// tie, the specific one wins (e.g. "silver ring" → precious, not generic jewelry).
const RULES = [
  ["jewelry_precious", ["silver", "gold", "platinum", "diamond", "sterling", "precious", "18k", "14k"]],
  ["ceramics", ["ceramic", "pottery", "porcelain", "clay", "terracotta", "mug", "cup", "plate", "bowl", "dinnerware"]],
  ["candles", ["candle", "tealight", "tea light", "scented candle", "wax melt", "votive"]],
  ["footwear", ["shoe", "shoes", "sneaker", "sandal", "boot", "boots", "slipper", "heel", "footwear", "loafer"]],
  ["leather_bags", ["bag", "handbag", "purse", "wallet", "backpack", "tote", "clutch", "satchel"]],
  ["toys", ["toy", "toys", "puzzle", "doll", "plush", "teddy", "board game", "action figure", "lego", "game"]],
  ["electronics_acc", ["cable", "charger", "adapter", "phone case", "phone cover", "earphone", "headphone", "earbud", "usb", "screen protector", "power bank"]],
  ["cosmetics", ["cosmetic", "skincare", "soap", "cream", "lotion", "serum", "lipstick", "makeup", "shampoo", "perfume", "beauty", "moisturizer", "balm"]],
  ["stationery", ["stationery", "notebook", "journal", "diary", "poster", "art print", "sticker", "greeting card", "postcard", "pen", "planner", "print"]],
  ["textiles_home", ["blanket", "cushion", "pillow", "throw", "bedsheet", "bed sheet", "curtain", "rug", "towel", "tapestry", "quilt"]],
  ["home_decor", ["decor", "decoration", "wall art", "showpiece", "handicraft", "ornament", "photo frame", "picture frame", "vase", "figurine", "wall hanging"]],
  ["clothing_knit", ["t-shirt", "tshirt", "t shirt", "tee", "sweater", "hoodie", "jersey", "polo", "tank top", "leggings", "socks", "knit", "sweatshirt"]],
  ["clothing_woven", ["shirt", "dress", "blouse", "trouser", "pants", "jeans", "skirt", "jacket", "coat", "saree", "sari", "kurta", "woven", "gown", "suit"]],
  ["jewelry", ["jewelry", "jewellery", "bracelet", "earring", "necklace", "pendant", "anklet", "bangle", "brooch", "ring", "charm", "imitation"]],
];

/**
 * Detect the best category for a product description.
 * @param {string} description
 * @returns {{categoryKey:string, hts:string, reason:string}}
 */
export function matchCategory(description) {
  const text = " " + String(description).toLowerCase().trim() + " ";

  let best = null;
  let bestScore = 0;
  let bestHit = "";

  for (const [categoryKey, keywords] of RULES) {
    let score = 0;
    let firstHit = "";
    for (const kw of keywords) {
      // word-ish boundary so "ring" doesn't match "earring" incorrectly, but
      // still allows "silver ring" etc.
      if (text.includes(" " + kw) || text.includes(kw + " ") || text.includes(kw + "s ")) {
        score++;
        if (!firstHit) firstHit = kw;
      }
    }
    // RULES order gives specific categories priority on ties (strictly greater
    // needed to overwrite, so earlier/more-specific entries hold their lead).
    if (score > bestScore) {
      bestScore = score;
      best = categoryKey;
      bestHit = firstHit;
    }
  }

  if (!best) {
    return {
      categoryKey: "other",
      hts: CATEGORIES.other.hts,
      reason: "no keyword matched — using a safe average",
    };
  }

  return {
    categoryKey: best,
    hts: CATEGORIES[best].hts,
    reason: `matched "${bestHit}"`,
  };
}
