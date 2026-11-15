# Jewellery store website

Static site (HTML/CSS/JS, no build step). Four pages: `index.html`, `collection.html`, `about.html`, `contact.html`.

## Preview

    powershell -ExecutionPolicy Bypass -File serve.ps1

then open http://localhost:4421/

## What to edit

| To change | Edit |
|---|---|
| Phone, WhatsApp number, address, timings, email | `assets/js/config.js` |
| The inventory (pieces, weights, purity, prices) | `assets/js/catalog.js` |
| Store name ("Swarn Rajat") | find & replace in the four `.html` files and `config.js` |
| Colours, fonts, layout | `assets/css/style.css` |

Header and footer are repeated in all four pages, so a menu change must be made in each.
After changing a CSS or JS file, bump `?v=1` on its URL in every page.

## Photos

Until real photographs exist, each piece is drawn as a gold or silver illustration by
`assets/js/jewel-art.js`. To use a photo, save it in `assets/img/` and add
`image: 'assets/img/name.jpg'` to that item in `catalog.js` (square photos work best).

## Before going live

Everything marked PLACEHOLDER in `config.js`, the sample pieces in `catalog.js`, and the
claims in the page copy (BIS hallmarking, old gold exchange, made-to-order work, timings)
must be confirmed with the store owner.
