# InfinityLens369 v1.9.1 — Stage Sync Hotfix

## Summary

v1.9.1 fixes stale visible release labels that could remain on the public GitHub Pages build after the sidecar studio panels loaded.

## What changed

- Bumped package metadata to `1.9.1`.
- Updated the runtime version sync layer to patch visible `InfinityLens369 v...` text across the rendered page.
- Added Capture Studio, Recording Studio, and Performance Console text-node sync for visible panel labels.
- Replaced the old v1.5 stage notice with the current v1.9 Performance Console message when stale text appears.
- Added a short safety sync loop during boot so React first-paint labels and delayed sidecar labels are both corrected.

## Test flow

1. Run `npm run build`.
2. Deploy to GitHub Pages.
3. Hard-refresh the page.
4. Confirm the stage badge reads `InfinityLens369 v1.9.1`.
5. Scroll the docked right panel and confirm Capture Studio, Recording Studio, and Performance Console labels are current.
6. Confirm the bottom-left stage notice no longer mentions v1.5.

## Claim boundary

This is a UI synchronization hotfix only. It does not alter shader behavior, audio analysis, capture output, recording output, or the local-first privacy model.
