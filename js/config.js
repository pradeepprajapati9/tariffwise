// config.js — client-side runtime configuration.
//
// ==========================================================================
//  ⚠️  SECURITY WARNING — READ THIS  ⚠️
//  This file is served to the browser AND committed to a PUBLIC repository,
//  so EVERYTHING in it is PUBLIC. Anyone can read the key below from the
//  page source or the network tab.
//
//  - Only ever put a THROWAWAY / DEMO key here (no billing, low quota).
//  - Never put a personal or billing-enabled key in this file.
//  - Rotate this key regularly at https://aistudio.google.com/apikey
//  - The permanent, secure fix is a Supabase backend (edge function) that
//    keeps the real key server-side and is never exposed to the browser.
// ==========================================================================

// Built-in Gemini key. Intentionally EMPTY — a key here would be public and
// abusable (GitHub push protection blocks committing real keys anyway).
// The secure way to give every visitor AI without their own key is a Supabase
// edge function that holds the key server-side. Leave this empty.
export const BUILTIN_GEMINI_KEY = "";

// Master switch for the AI feature. Set to false to fully disable AI
// (the tool still works via the manual category dropdown).
export const AI_ENABLED = true;

// ==========================================================================
//  Monetization — Amazon Associates affiliate link (set once, works forever)
// ==========================================================================
// Your Amazon Associates tag. Change this one value to re-point all earnings.
export const AMAZON_TAG = "tariffwise-20";

// The result CTA links here. It's an Amazon search for shipping/packing
// supplies that sellers actually buy, tagged with your Associate ID so any
// qualifying purchase earns a commission. Edit the search terms if you like.
export const AFFILIATE_URL =
  `https://www.amazon.com/s?k=shipping+boxes+packing+supplies+tape&tag=${AMAZON_TAG}`;
