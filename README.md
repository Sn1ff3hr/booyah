# Business Inventory Demo

This repository contains a simple web-based inventory page. It demonstrates a form to add products and an inventory list table. It includes language support for English and Spanish.

## Development

This project now includes a `package.json` for managing dependencies and scripts:
- To run linters: `npm run lint` (uses ESLint with Standard JS style guide)
- To run tests (currently a placeholder): `npm test`

The site is configured as a Progressive Web App (PWA) with a service worker, manifest for offline support, and placeholder icon files (`icon-192x192.png`, `icon-512x512.png`). A strict Content Security Policy is included to reduce cross-site scripting risks.

For deployments that require Cross-Origin Resource Sharing (CORS), configure your static host (e.g. Cloudflare Pages or Netlify) to send `Access-Control-Allow-Origin` headers as appropriate.

This project follows public security guidance from NIST and CISA. No third-party binaries are committed, keeping the supply chain minimal.

## Custom Domain

A `CNAME` file is included in this repository (`www.marxia.com`). If you are using a static hosting provider that supports CNAME files for custom domain configuration (like GitHub Pages or Netlify), ensure your DNS settings are correctly pointing your domain to the host.

## Security & Compliance
The recommended deployment should enable HTTPS and HTTP security headers. The following are included or configured:
- `Content-Security-Policy`: Configured via a meta tag in `index.html`.
- `X-Content-Type-Options: nosniff` and `Referrer-Policy: same-origin`: These can be enabled via a `_headers` file in the repository, compatible with hosting platforms like Netlify and Cloudflare Pages.

These headers help align with NIST and CISA best practices.

## Features
- Product entry form with dynamic tax fields
- Capture product images using the device camera
- QR scanning placeholder triggered by the `-` icon
- QR printing using a QR icon with a message reminder
- Inventory list with totals
- Basic i18n with a single language toggle button that auto-detects the user language
- Separate UIs for business owners (`owner.html`), end consumers (`consumer.html`),
  and an Android-friendly view (`android.html`)

This project is intended as a starting point and does not yet integrate with external services such as Flutter, Firebase, or logistics systems.
