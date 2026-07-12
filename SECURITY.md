# Security — xDebug Pro

xDebug Pro is a developer tool that toggles Xdebug sessions from the browser. This
document explains the threat model and our design choices.

## Design principles

1. **Zero network.** The extension makes no outbound requests. There is no
   analytics, no remote config, no "phone home". You can confirm this in
   DevTools → Network while the extension runs.
2. **Local only.** All state lives in `chrome.storage.local`. Xdebug cookies are
   set and cleared through the browser `cookies` API on domains you explicitly
   enable.
3. **Minimal permissions.** `tabs`, `cookies`, `storage`, `activeTab`,
   `webNavigation`, and `host_permissions`. Nothing else. Each is justified in
   [PRIVACY.md](./PRIVACY.md).
4. **Strict CSP.** Extension pages run under
   `script-src 'self'; object-src 'self'; base-uri 'self'` — no inline scripts,
   no remote code, no `eval`.
5. **No remote code.** Everything executes from the signed package. No dynamic
   script injection into pages; the extension does not inject content scripts.
6. **No page reading.** xDebug Pro never reads page content, DOM, or request /
   response bodies. It only manages a small set of Xdebug cookies.
7. **Open source & auditable.** The full source is public and the build is
   reproducible from it.

## The cookies it manages

Only the standard Xdebug trigger cookies, and only on domains you enable:

- `XDEBUG_SESSION` — starts a step-debugging session
- `XDEBUG_TRIGGER` — triggers debug/profile/trace when the server uses
  `start_with_request=trigger`
- `XDEBUG_PROFILE` / `XDEBUG_TRACE` — set only when you pick profile or trace mode

Disabling a domain removes these cookies. The extension does not touch any other
cookies.

## Reporting a vulnerability

Please email security@theconcept-technologies.com (or open a private security
advisory on GitHub). Do not open a public issue for undisclosed vulnerabilities.
