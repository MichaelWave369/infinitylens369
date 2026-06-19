# InfinityLens369 v1.8.1 — UI Sync + Studio Dock Hotfix

## Status

Patch release for the public GitHub Pages UI after the v1.8 Recording Studio sprint.

## What changed

- Added a boot-safe version sync sidecar so visible release labels stay current.
- Synced the main stage badge to `v1.8.1` without touching the large React/WebGL core.
- Synced visible Capture Studio and Recording Studio eyebrow labels to `v1.8.1`.
- Added a studio dock stylesheet that keeps the right-side control panel inside the viewport.
- The studio panel now owns its own scroll lane with a styled scrollbar.
- The panel header stays sticky so the upload/play controls remain reachable while scrolling.
- Cinematic/fullscreen presentation hides the control panel cleanly and leaves the stage full-screen.

## Test flow

1. Run `npm run build`.
2. Deploy to GitHub Pages.
3. Open a fresh/incognito page.
4. Confirm the upper-left badge shows `InfinityLens369 v1.8.1`.
5. Confirm the right panel starts at the top of the viewport.
6. Scroll inside the right panel and confirm the page itself does not drift.
7. Click Cinematic and Fullscreen to confirm the stage takes over cleanly.
8. Exit Cinematic and confirm the right studio panel returns.

## Claim boundary

This is a UI synchronization and layout patch only. It does not change shader behavior, audio handling, recording semantics, or scientific claims.
