## Copilot / AI Agent Instructions for this Repo

Purpose: help an AI coding agent become productive quickly when modifying this static construction-website MVP.

- **Big picture**: This is a small static marketing site (HTML/CSS/JS) for a contractor. Main pages live at the repo root: `index.html`, `login.html`, `dash.html`. Client-side behavior is pure vanilla JS; there is no backend in this repository.

- **Primary files to inspect**:
  - `index.html`: main landing page, contact form with `id="quoteForm"` where quote requests are collected (client-side only).
  - `script.js`: form handling and MVP comments. See the comment block where server integration is expected (Search for "FUTURE INTEGRATION").
  - `login.js`: local, client-side login with hard-coded credentials (`engineer@contractorpro.com` / `admin123`). Login sets `localStorage.contractorName` and redirects to `dash.html`.
  - `dash.js`: reads `contractorName` from `localStorage` and handles logout by clearing that key and redirecting to `login.html`.
  - `style.css`, `dash.css`, `login.css`: page styles.
  - `projects/`: image assets referenced by `index.html` project cards.

- **Architecture & data flow (concise)**:
  - All routing is file-based; pages are static HTML. Inter-page state uses `localStorage` (key: `contractorName`).
  - Form submissions are currently simulated in `script.js` (no network calls). Any new integrations should replace the client-side simulation with a call to an API endpoint and retain the existing UX (append a success message, reset form).

- **Project-specific conventions & patterns**:
  - Minimal JS: No frameworks. Keep patches small and in plain ES5/ES6 compatible code.
  - DOM hooks are by `id` (e.g., `quoteForm`, `loginForm`, `contractorName`, `logoutBtn`) — prefer these ids when adding behavior.
  - Local dev: open `index.html` (or `login.html`) in a browser; no build step, server, or bundler required.

- **Security & caution notes (do not accidentally commit secrets)**:
  - `login.js` uses hard-coded credentials for MVP and is insecure; do not treat these as production secrets. If you replace with real auth, remove the hard-coded example and add a README note.

- **When adding features (practical instructions)**:
  - To integrate a backend for quote submissions:
    1. Replace the simulation in `script.js` (look for the FUTURE INTEGRATION comment).
    2. Use `fetch()` to POST JSON to the new endpoint and handle success/error with the existing UI pattern (append `.success-message`, call `quoteForm.reset()`).
    3. Keep the form id `quoteForm` to avoid breaking existing selectors.
  - To add persistent login/session storage: replace `localStorage` usage with secure cookies or token flow and update `dash.js` and `login.js` to expect the server-side session.

- **Examples (copy-paste friendly)**
  - Quote form selector: `const quoteForm = document.getElementById('quoteForm');`
  - Read stored name in dashboard: `localStorage.getItem('contractorName')`

- **Testing & debugging tips specific to this repo**:
  - Because this is static, open pages directly in the browser and use DevTools console to observe `console.log` output (e.g., quote submit logs in `script.js`).
  - To test login flow: open `login.html`, submit the example credentials, and verify redirect to `dash.html` and that `contractorName` appears.

- **What not to change without coordination**:
  - Do not rename DOM ids used across files (`quoteForm`, `loginForm`, `contractorName`, `logoutBtn`) — many behaviors rely on them.
  - Avoid introducing framework-specific build steps (webpack, bundlers) without migrating the repo structure and documenting new dev steps.

- If anything here is unclear or you want more details (CI hooks, test harness, or adding a simple backend example), tell me which area to expand.
