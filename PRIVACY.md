# Privacy Policy — xDebug Pro

_Last updated: 2026-07-12_

**xDebug Pro does not collect, transmit, sell, or share any data. Full stop.**

## What data the extension handles

- **Your per-domain settings.** Which domains have Xdebug enabled, the chosen IDE
  profile (PHPStorm / VS Code / custom), the mode (debug / profile / trace), and
  any custom session key you enter. These are stored locally on your device using
  the browser's `chrome.storage.local` API. They never leave your machine.
- **Xdebug cookies.** To start or stop a debugging session, the extension sets or
  removes standard Xdebug cookies (`XDEBUG_SESSION`, `XDEBUG_TRIGGER`,
  `XDEBUG_PROFILE`, `XDEBUG_TRACE`) on the domains you toggle. These are ordinary
  cookies read by your own PHP server; the extension does not send them anywhere.
- **Nothing else.** xDebug Pro does not read page content, form data, or the
  bodies of your web requests or responses.

## What the extension does NOT do

- No analytics, telemetry, crash reporting, or usage tracking.
- No network requests to any server operated by us or a third party.
- No advertising, no ad injection, no affiliate redirection.
- No remote code loading. All code ships in the extension package and runs under a
  strict Content Security Policy.

## Permissions and why they are needed

- `cookies` — to set and remove the Xdebug session cookies that start/stop a
  debugging session on the sites you choose.
- `storage` — to save your per-domain settings locally.
- `tabs` — to know the current tab's URL so the correct per-domain state and
  toolbar icon/badge are shown.
- `activeTab` — to act on the site you are currently viewing.
- `webNavigation` — to refresh the toolbar icon/badge when you navigate between
  pages.
- `host_permissions: <all_urls>` — Xdebug is used against whatever local or remote
  dev host you point it at, so cookie changes must be able to apply to any site you
  explicitly toggle. Cookies are only ever set for domains you enable yourself.

## Data deletion

Uninstalling the extension removes all locally stored settings. Disabling a domain
clears the Xdebug cookies the extension set for it.

## Open source

The full source code is public so anyone can verify these claims:
<https://github.com/theconcept-technologies/xdebug-pro-extension>

## Contact

theconcept technologies — <https://theconcept-technologies.com>
