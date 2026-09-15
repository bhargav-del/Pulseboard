# Pulseboard

> A calm command center for service health.

Pulseboard is a polished, local-first uptime monitoring dashboard built as a zero-build static app. It gives teams a clear view of endpoints, response times, incidents, and workspace health without burying the important signal in noise.

## Why this project exists

Most monitoring interfaces optimize for density. Pulseboard experiments with a quieter approach: show the health of the system first, keep the visual hierarchy calm, and make the next useful action obvious.

It is designed as a portfolio-quality front-end project that demonstrates:

- Responsive UI design with desktop and mobile layouts
- Local-first persistence with `localStorage`
- A monitor management flow with accessible dialog forms
- Simulated health checks and response-time history
- Incident timeline and status states
- Search / command palette (`⌘ K` or `Ctrl K`)
- Light and dark themes
- JSON report export
- Reduced-motion and keyboard-focus support
- GitHub Pages deployment with GitHub Actions

## Features

- **Overview:** operational banner, health metrics, endpoint list, recent incidents
- **Monitors:** filter by operational or degraded status, add endpoints, run checks
- **Incidents:** timeline of current and resolved incidents
- **Settings:** notification preferences and appearance controls
- **Demo mode:** safe simulated checks with no external credentials required

## Run locally

No package manager or build step is required.

```bash
git clone https://github.com/bhargav-del/pulseboard.git
cd pulseboard
python3 -m http.server 4173
```

Open <http://localhost:4173>.

## Deploy to GitHub Pages

The included workflow deploys the root directory to GitHub Pages whenever changes land on `main`.

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push a change to `main` or run the **Deploy to GitHub Pages** workflow manually.

## Product notes

The current experience deliberately uses local simulated checks so it can be hosted as a static site. A production version could add:

- A worker that performs HTTP checks on a schedule
- A small API for teams, auth, and monitor ownership
- Email / Slack / webhook notifications
- Public status pages backed by incident updates
- Historical time-series storage and retention policies

## License

MIT © 2026 Yuin

## Desktop release

The repository includes a portable Windows desktop build. Every push to `main` runs the Windows packaging workflow and publishes a `.exe` to the repository's **Releases** section. The desktop shell loads the same app locally, so it works without an API key or server.

## Android release

An Android 7.0+ build (API 24+) is scheduled for **September 16, 2026 at 10:00 IST**. The same responsive product is packaged with Capacitor as an installable APK and published to the repository's **Releases** section as `v1.0.0`.
