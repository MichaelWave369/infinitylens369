# InfinityLens369 v1.12.0 — Gallery Console

## Status

Sprint 12 adds a boot-safe Gallery Console sidecar for public scene discovery and v2.0 runway onboarding.

## What shipped

- Added `src/gallery-console.ts`.
- Added `src/gallery-console-loader.ts` as a proper ES module wrapper.
- Added `src/gallery-console.css`.
- Loaded Gallery Console after Launch Console and before version sync.
- Added curated one-click scene entries:
  - Liquid Light
  - Machine Cathedral
  - Deep Portal
  - Performance Ready
- Added Copy Gallery Note for sharing the public page with a short starter guide.
- Added v2 runway status action.
- Updated version sync for Gallery Console labels and stale stage notes.
- Bumped package version to `1.12.0`.

## Test flow

1. Run `npm run build`.
2. Open a fresh page load.
3. Confirm the core visualizer appears before side panels finish loading.
4. Scroll to Gallery Console.
5. Click Liquid Light, Machine Cathedral, Deep Portal, and Performance Ready.
6. Click Copy Gallery Note.
7. Click v2 runway.
8. Confirm visible labels sync to `v1.12.0`.

## Claim boundary

Gallery Console is a public discovery and onboarding layer. It does not upload audio, does not embed audio in shares, and does not make scientific or metaphysical claims. It only clicks existing live controls and helps visitors explore safely.
