# Business Inventory Demo

This repository contains a simple web-based inventory page. It demonstrates a form to add products and an inventory list table. It includes language support for English and Spanish.

The site is configured as a Progressive Web App (PWA) with a service worker and manifest for offline support. A strict Content Security Policy is included to reduce cross-site scripting risks.

For deployments that require Cross-Origin Resource Sharing (CORS), configure your static host (e.g. Cloudflare Pages or Netlify) to send `Access-Control-Allow-Origin` headers as appropriate.

This project follows public security guidance from NIST and CISA. No third-party binaries are committed, keeping the supply chain minimal.

## Security & Compliance
The recommended deployment should enable HTTPS and HTTP security headers including:
- `Content-Security-Policy` as configured in `index.html`.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: same-origin`.

These headers help align with NIST and CISA best practices.

## Features
- Product entry form with dynamic tax fields
- Capture product images using the device camera
- QR scanning placeholder triggered by the `-` icon
- QR printing using a QR icon with a message reminder
- Inventory list with totals
- Basic i18n with a single language toggle button that auto-detects the user language

This project is intended as a starting point and does not yet integrate with external services such as Flutter, Firebase, or logistics systems.
