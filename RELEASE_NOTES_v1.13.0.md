# InfinityLens369 v1.13.0 — Roadmap Console

## Summary

v1.13.0 adds a boot-safe Roadmap Console sidecar for public feedback, tester notes, and v2.0 runway visibility.

The core React/WebGL visualizer still renders first. Roadmap Console loads after the existing studios and before version sync, so a sidecar failure should not block the visual stage.

## Added

- Roadmap Console sidecar module and loader
- Roadmap Console panel styling
- v2 runway status cards
- Copy Feedback Note action
- Copy v2 Runway action
- Open Issue Tracker action
- Release Stack status action
- Version sync support for Roadmap Console labels

## Test flow

1. Open a fresh instance of the GitHub Page or local dev server.
2. Confirm the visualizer renders first.
3. Scroll the docked right studio panel to Roadmap Console.
4. Click **Copy feedback note**.
5. Click **Copy v2 runway**.
6. Click **Open issue tracker** and confirm a GitHub issue tab opens.
7. Click **Release stack** and confirm the status text updates.
8. Confirm visible labels sync to `v1.13.0`.

## Claim boundary

Roadmap Console is a project feedback and release-navigation helper. It does not collect analytics, upload audio, or make scientific claims. Feedback remains user-directed through clipboard text or GitHub issue submission.
