# TariffWise — US Landed-Cost Calculator

A free tool for online sellers to estimate the **total cost of shipping a product to the USA** — duty, customs fees, landed cost, and a suggested selling price — in seconds.

**Live:** https://pradeepprajapati9.github.io/tariffwise/

## Why it matters

On **29 August 2025**, the US ended the **$800 de minimis exemption**. Previously, low-value parcels (under $800) entered duty-free. Now every parcel is subject to tariffs and customs fees. This directly affects small sellers on Etsy, eBay, Shopify, and dropshipping platforms — many of whom have no easy way to calculate their new costs. TariffWise fills that gap.

## Features

- Enter product value, category, and country of origin to instantly see duty, customs fees, total landed cost, and a suggested price.
- Automatic category detection from a product description — built in, no key or setup required.
- Optional AI-refined classification for power users who add their own free Gemini key.
- No login or account connection required — open and use.
- All calculation constants live in a single file (`js/data.js`) for easy updates.

## Running locally

The app uses native ES modules, so it must be served over HTTP (not opened via `file://`):

```
http://localhost/pr/tariffwise/
```

Any static server works (XAMPP, `python -m http.server`, etc.).

## Testing

Run the calculation logic tests:

```
node test_calc.mjs
```

## Project structure

| File | Purpose |
|------|---------|
| `index.html` | UI |
| `css/style.css` | Styling |
| `js/data.js` | HTS categories, country tariff rates, and fee constants |
| `js/calc.js` | Calculation logic (pure functions) |
| `js/gemini.js` | Optional AI HTS classification |
| `js/app.js` | UI wiring |
| `test_calc.mjs` | Calculation tests |

## Disclaimer

This tool provides **estimates only** — not legal or customs advice. Actual tariffs depend on a product's exact HTS code and current trade rules, which change frequently. Verify the rates in `js/data.js` against official sources (USITC HTS, US CBP, Federal Register) before relying on them.

## Roadmap

- [ ] Replace estimated rates with official USITC HTS data
- [ ] Browser extension with auto-detection on Etsy / eBay / Amazon listings
- [ ] Saved history via Supabase login
- [ ] Multi-country support (EU, UK)
- [ ] Affiliate integrations (shipping tools, Shopify)

## License

MIT — see [LICENSE](LICENSE).
