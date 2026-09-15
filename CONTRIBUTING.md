# Contributing to Pulseboard

Thanks for helping improve Pulseboard. Small, focused contributions are welcome.

## Local setup

```bash
git clone https://github.com/bhargav-del/pulseboard.git
cd pulseboard
python3 -m http.server 4173
```

Open <http://localhost:4173> in a browser. For the desktop packaging scripts, use Node 20 and run `npm install`.

## Before opening a pull request

- Keep the app dependency-light and privacy-friendly.
- Run `node --check app.js`.
- Test the main interaction at desktop and mobile widths.
- Update the README or changelog when behavior changes.
- Keep pull requests focused and explain the user impact.

## Commit style

Use short, imperative messages such as `Add empty state for incidents` or `Fix mobile task layout`.
