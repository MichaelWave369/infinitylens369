# InfinityLens369 v1.18.4 — Circuit Cathedral Lock Hotfix

## Purpose

This hotfix makes the Circuit Cathedral identity pass deterministic and prevents the previous tunnel-bloom look from returning after selecting the Machine Cathedral preset.

## What changed

- Circuit Cathedral now re-locks its intended mode and palette after selection.
- Mode/palette selection is resolved by visible option labels instead of relying on fragile control-group lookup.
- The retune now checks whether **Kaleido Trip** and **Abyss Cyan** are actually selected before deciding it is complete.
- Circuit Cathedral now uses calmer drive/response/glow values for a darker machine-temple presentation.
- Transition overlay strips are hidden more aggressively to suppress the remaining horizontal artifact.

## Test flow

1. Load the app fresh.
2. Click **Circuit Cathedral**.
3. Confirm **Visual mode** becomes **Kaleido Trip**.
4. Confirm palette becomes **Abyss Cyan**.
5. Confirm the top-left stage label remains hidden.
6. Switch to Aurora Veil, Dream Pool, Acid Melt, and Cosmic Drift.
7. Confirm the Circuit Cathedral filter/grid clears when leaving the preset.

## Boundary

This is a visual identity and UI cleanup hotfix. It does not change the shader core, audio analysis model, or local-first privacy behavior.
