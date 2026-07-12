# Chrome Web Store — Listing & Submission (xDebug Pro)

Copy-ready content for the Chrome Web Store developer dashboard, plus the
pre-submit checklist. Nothing here ships in the extension.

> **Context:** this is a **fresh first submission under a new developer account**
> (the old account was deleted after a domain switch). The store will assign a
> **brand-new extension ID** — the previous listing and ID are gone. Treat this as
> a first-time publish, not an update.

## Basics

- **Product name:** xDebug Pro
- **Category:** Developer Tools
- **Default language:** English
- **Version submitted:** `1.1.5` (`xdebug-pro-v1.1.5.zip`)

## Summary (short description — max 132 chars)

> Start & stop Xdebug PHP debug sessions from your toolbar — per domain, PHPStorm/VS Code/custom. Local, no tracking, open source.

## Detailed description

> xDebug Pro puts Xdebug control in your browser toolbar.
>
> Start and stop **Xdebug** step-debugging, profiling, and tracing sessions with a
> single click while you work on PHP apps — no bookmarklets, no editing server
> config, no fiddling with query strings. Pick your IDE and xDebug Pro sets the
> right cookies for you.
>
> **Getting started:** click the toolbar icon, pick your IDE (PHPStorm, VS Code,
> or a custom key), toggle Xdebug on for the current site, then reload — your IDE
> picks up the session. Toggle off to stop.
>
> **Features**
> - One-click enable/disable of Xdebug sessions.
> - IDE profiles: PHPStorm, VS Code, or a custom session key.
> - Debug / Profile / Trace modes — sets XDEBUG_SESSION, XDEBUG_TRIGGER,
>   XDEBUG_PROFILE and XDEBUG_TRACE cookies as appropriate.
> - Per-domain state: every site remembers its own toggle, profile and mode.
> - Toolbar badge shows the active mode (D / P / T) for the current tab.
> - Works with localhost and remote dev hosts alike.
>
> **Built to be trusted**
> - 100% local — your settings never leave your device.
> - No tracking, no analytics, no ads. Ever.
> - No network requests: the extension only sets local cookies.
> - Strict Content Security Policy; no remote code.
> - Open source, so anyone can verify it.
>
> Free and open source, from theconcept technologies.
>
> Not affiliated with, endorsed by, or an official product of the Xdebug project.
> "Xdebug" is a trademark of its respective owner; this extension is an
> independent helper that uses Xdebug's standard trigger cookies.

## Permission justifications (paste into the review form)

- **cookies** — Core function: set and remove the standard Xdebug cookies
  (XDEBUG_SESSION, XDEBUG_TRIGGER, XDEBUG_PROFILE, XDEBUG_TRACE) to start/stop a
  debugging session on the sites the user chooses.
- **storage** — Save the user's per-domain settings (enabled state, IDE profile,
  mode, custom key) locally on their device.
- **tabs** — Read the current tab's URL to show the correct per-domain state and
  to update the toolbar icon/badge for that site.
- **activeTab** — Act on the site the user is currently viewing when they toggle
  Xdebug.
- **webNavigation** — Refresh the toolbar icon/badge when the user navigates
  between pages so it reflects the current domain's state.
- **host access (`<all_urls>`)** — Xdebug is used against whatever local or remote
  dev host the developer points it at, so the extension must be able to set/clear
  cookies on any site the user explicitly toggles. Cookies are only ever set for
  domains the user enables. No page content is read or injected.

## Single purpose (required statement)

> xDebug Pro enables and disables Xdebug debugging sessions by managing the Xdebug
> trigger cookies for the domains a developer chooses, with per-IDE profiles.

## Data safety / privacy (dashboard "Privacy" tab)

- **Does this item collect user data?** No.
- **Remote code?** No — all code ships in the package.
- **Data sold/transferred to third parties?** No.
- **Used for anything besides the single purpose?** No.
- **Privacy policy URL:** publish `PRIVACY.md` at a public URL, e.g.
  `https://github.com/theconcept-technologies/xdebug-pro-extension/blob/main/PRIVACY.md`
  (the repo is already public) or a page on theconcept-technologies.com.

## Assets — READY (in repo-root `../screenshots/done/`)

- [x] **Store icon 128×128** — from `src/icons/icon-active-128.png`.
- [x] **Screenshots** 1280×800 — suggested upload order:
      1. `screenshots/done/overview.jpg` — the popup / overview.
      2. `screenshots/done/enabled.jpg` — a session enabled.
      3. `screenshots/done/custom_settings.jpg` — custom profile / settings.
      4. `screenshots/done/multi_session_mode.jpg` — multiple domains at once.
- [x] **Small promo tile** 440×280 — `screenshots/done/ads.jpg`.
- [x] **Marquee** 1400×560 — `screenshots/done/ads_big.jpg`.

## Pre-submit checklist

- [ ] Chrome Web Store **developer account** registered (one-time $5 fee) under the
      NEW account.
- [ ] Privacy policy hosted at a public URL (see above).
- [x] Production zip built: `npm run build` → zip `dist/` → `xdebug-pro-v1.1.5.zip`.
- [ ] Load-unpacked smoke test in Chrome passed (toggle a session on a
      localhost/PHP target; confirm XDEBUG_SESSION cookie is set/cleared).
- [x] GitHub repo is **public**:
      <https://github.com/theconcept-technologies/xdebug-pro-extension>.
- [ ] Submitted 1.1.5 for review (host-permission extensions may take a few days).
