# InfinityLens369 v1.15.0 — Accessibility Console

## Summary

v1.15.0 adds the boot-safe Accessibility Console. It gives public viewers and demo operators comfort-focused controls without touching the React/WebGL core or claiming medical/accessibility compliance.

## What changed

- Added `src/accessibility-console.ts` as a boot-safe sidecar.
- Added `src/accessibility-console-loader.ts` as a proper ES module loader.
- Added `src/accessibility-console.css` for comfort-mode styling.
- Wired the console into `src/main.tsx` after System Health Console and before version sync.
- Bumped `package.json` to `1.15.0`.
- Updated `src/version-sync.ts` to sync Accessibility Console labels and stale stage copy.
- Updated README with the v1.15 release section.

## Accessibility Console features

- Default Lens restores the public visual balance.
- Reduce Motion requests Safe/Slow controls when available and applies a calmer presentation filter.
- Soft Glow dims bloom-heavy visuals for longer viewing sessions.
- High Readability boosts panel contrast for demos, projection, and screen sharing.
- Copy Comfort Note creates a clean local note for public feedback.
- Motion Safety Note states the claim boundary directly.
- Alt+M cycles comfort modes.

## Claim boundary

Accessibility Console is presentation support only. It helps reduce visual intensity and improve readability, but it is not a medical tool, diagnostic tool, therapy tool, or formal accessibility-compliance guarantee.

## Test flow

1. `npm run build`
2. `npm run dev`
3. Fresh load the app.
4. Scroll to Accessibility Console.
5. Try Default Lens, Reduce Motion, Soft Glow, and High Readability.
6. Press Alt+M to cycle comfort modes.
7. Click Copy Comfort Note.
8. Confirm visible labels sync to `v1.15.0`.
