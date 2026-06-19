# InfinityLens369 v1.16.0 — Showcase Console

## Summary

v1.16.0 adds a boot-safe **Showcase Console** sidecar for public demos, projection, streams, and first-time handoff sessions. It stages presentation modes by requesting existing controls instead of changing the React/WebGL core.

## Added

- Safe Showcase for calmer public entry with Safe, Slow Flow, and comfort-control requests when available.
- Gallery Tour for guided public exploration using Auto Trip, Next, and Random controls.
- Performance Showcase for cinematic/fullscreen staging and live projection preparation.
- Exit Showcase to clear showcase styling and exit browser fullscreen when the browser permits it.
- Copy Showcase Note for public feedback and demo handoff notes.
- Alt+S shortcut to cycle showcase modes.
- Showcase styling for safe, gallery, and performance presentation states.

## Boot-safety boundary

The core visualizer still renders first. Showcase Console loads after the existing sidecars and before version sync. If the sidecar fails, the core visualizer remains available.

## Claim boundary

Showcase Console is presentation support only. It does not alter source audio, upload files, diagnose viewer comfort, or make scientific, medical, or accessibility-compliance claims.

## Test flow

1. Fresh load the app.
2. Confirm the visualizer appears before interacting with Showcase Console.
3. Scroll to **Showcase Console**.
4. Try **Safe Showcase**, **Gallery Tour**, **Performance Showcase**, and **Exit Showcase**.
5. Press **Alt+S** to cycle showcase modes.
6. Click **Copy Showcase Note**.
7. Confirm visible labels sync to **v1.16.0**.
