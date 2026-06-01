# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static marketing site for **Lasso BJJ Madrid** (a Brazilian Jiu-Jitsu academy in the Salamanca district of Madrid). There is no build system, package manager, or backend — it is plain HTML/CSS/JS served as-is. Primary content language is **Spanish (`lang="es"`)**.

## Build, run, deploy

- **No build step.** Open `index.html` directly or serve the repo root with any static server, e.g. `python3 -m http.server` then visit `http://localhost:8000`.
- **Deploy is automatic.** Pushing to `main` triggers `.github/workflows/static.yml`, which uploads the entire repo root to GitHub Pages. There is no staging environment — a merge to `main` is a production release. Live site: `https://lassobjjmadrid.com`.
- **No tests, linter, or formatter** are configured.

## Architecture

The whole page is a single long `index.html` composed of anchored sections (`#about`, `#prices`, `#schedule`, `#contact`, etc.) navigated via smooth-scroll. Third-party libs (jQuery, Bootstrap 3.3.7, Font Awesome, cookieconsent) are loaded from CDNs in `index.html`; there are no local vendored dependencies.

JavaScript lives in `scripts/`, each file an independent jQuery `$(document).ready(...)` module loaded via `<script>` tags at the bottom of `index.html` (load order matters — see lines ~90-94):

- `lasso.js` — core UX: smooth-scroll nav (deliberately skips Bootstrap accordion/modal triggers), navbar behavior.
- `lasso-contact.js` — contact-form validation and submission. **No backend**: submission is `mailto`-based (`CONTACT_CONFIG.emailService = 'mailto'`), designed to be swapped for a real service later.
- `lasso-map.js` — Google Maps embed enhancements; academy address/coords/contact are hardcoded in `ACADEMY_LOCATION`.
- `lasso-cookies.js` / `lasso-privacy.js` — cookie-consent banner and privacy handling.
- `lasso-i18n.js` — currently empty (i18n placeholder; site is Spanish-only).

Styles in `styles/`: `landing-page.css` (Bootstrap-derived landing template base) and `lasso.css` (site-specific overrides — edit this for custom styling).

## Editing pricing and promotional offers

Most ongoing changes are price/offer updates (see git history). These are **hardcoded HTML in `index.html`**, not data-driven:

- **Prices**: the `#prices` section uses `.precio-card` blocks. Each shows a `.new-price` (current price). An offer is represented by uncommenting the `.old-price` (struck-through original) and the `.precio-etiqueta` label next to the active `.new-price`.
- **Promo banner**: a `.promo-banner` block near the top is commented out when no offer is running; uncomment and edit its `.old-inline`/`.new-inline`/`.arrow` spans to activate a campaign.
- To **end an offer**, re-comment the `old-price`, `precio-etiqueta`, and promo banner blocks and set `.new-price` to the regular price (this is the recurring pattern in commits like "Remove oferta from everywhere", "November regular prices").

## Google Ads

`googleads/campaigns.json` holds Google Ads Performance Max campaign definitions (headlines, descriptions, geo/language targeting) for marketing — it is **not used by the site at runtime**, it's a reference artifact for ad setup.
