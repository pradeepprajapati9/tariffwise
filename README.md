# 🚢 TariffWise — US Landed-Cost Calculator

Sellers ke liye free tool: **"America bhejne pe ab kitna tax + customs lagega?"** — turant estimate.

## Kyun (Why now)
29 August 2025 se US ne **$800 de minimis** chhoot khatam kar di. Pehle chhote parcels
(< $800) pe koi duty nahi lagta tha — ab har parcel pe tariff + customs lagta hai.
Duniya bhar ke chhote sellers (Etsy/eBay/Shopify/dropshippers) pareshan hain, aur is
problem ka abhi koi free tool nahi. Ye whitespace hai.

## Kya karta hai
- Product ki value + category + origin country daalo
- Turant dikhata hai: **duty + customs fees + total landed cost + suggested price**
- Optional: apni **free Gemini key** daal ke AI se HTS code suggest karwao

## Chalane ka tarika (MVP — web app)
XAMPP already chal raha hai, toh browser me kholo:

```
http://localhost/pr/tariffwise/
```

> ⚠️ Note: ye ES modules use karta hai — `file://` se seedha open mat karo,
> localhost (http) se hi kholo (XAMPP se apne aap ho jayega).

## Test
Calculation logic ka test:
```bash
node test_calc.mjs
```

## Files
| File | Kaam |
|------|------|
| `index.html` | UI |
| `css/style.css` | styling |
| `js/data.js` | HTS categories + country tariff rates + fees (**yahan rates update karo**) |
| `js/calc.js` | calculation logic (pure functions) |
| `js/gemini.js` | optional AI HTS suggest |
| `js/app.js` | UI wiring |
| `test_calc.mjs` | calc logic test |

## ⚠️ Honest disclaimer
Ye **estimate** tool hai, legal/customs advice nahi. Asli tariff har product ke exact
HTS code aur roz-badalte 2025 trade rules pe depend karta hai. `js/data.js` ke rates
**launch se pehle verify/update** karo (sources: USITC HTS, US CBP, Federal Register).

## Aage (Phase 2 — jab users aayein)
- [ ] Etsy/eBay/Amazon page pe auto-detect (Chrome extension)
- [ ] History save (Supabase login)
- [ ] Multi-country (EU/UK bhi, sirf US nahi)
- [ ] Master Bot me module banao
- [ ] Affiliate links (shipping tools, Shopify) — monetization
