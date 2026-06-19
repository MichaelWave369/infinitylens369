# InfinityLens369 v1.18.3 — Visual Cleanup Scope Hotfix

## Purpose

v1.18.3 fixes a visual-scope regression introduced during the Circuit Cathedral identity pass.

The darker Circuit Cathedral filter and cathedral/circuit overlay were staying active after switching to other scenes, which made unrelated presets look different.

## What changed

- Circuit Cathedral styling now only stays active while the Circuit Cathedral preset is actually selected.
- Switching to any other preset or mode self-clears the Circuit Cathedral body scene flag.
- Visual Cleanup now watches relevant button/select state changes and re-syncs scope safely.
- Circuit Cathedral overlay opacity and filter strength were reduced so the identity pass is less invasive.
- Stage badge and bottom stage notice remain hidden for a clean public stage.

## Test flow

1. Fresh load the app.
2. Click Circuit Cathedral and confirm the darker machine-temple treatment appears.
3. Click Aurora Veil, Dream Pool, Acid Melt, Cosmic Drift, or any other visual mode.
4. Confirm the Circuit Cathedral grid/filter disappears.
5. Confirm the stage badge remains hidden.
6. Run `npm run build`.

## Claim boundary

This is a visual-scope and presentation hotfix only. It does not change the core WebGL engine or make scientific claims about the generated visuals.
