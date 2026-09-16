# Changelog

## v1.0.5 — 2026-09-15

- Published a fully self-contained Windows desktop app.
- Added a portable `.exe` with the full runtime and product UI bundled inside.
- Bundled the browser UI inside the Electron application archive so users do not need separate HTML, CSS, or JavaScript files.
- Kept the Windows release install-free: download and run the portable app.

## v1.0.0 — 2026-09-15

- Added a portable Windows desktop app build.
- Added a GitHub Actions workflow that builds and publishes the `.exe` to Releases.
- Hardened the desktop shell with context isolation, sandboxing, and disabled Node integration.
- Kept the original browser experience available through GitHub Pages.
- Added an Android 7+ (API 24+) Capacitor build scheduled for 08:00 IST on September 16, 2026.

