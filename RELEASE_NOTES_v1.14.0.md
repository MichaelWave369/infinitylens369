# InfinityLens369 v1.14.0 — System Health Console

v1.14 adds a boot-safe System Health Console for local browser readiness checks. It helps public testers understand whether their browser supports the runtime features InfinityLens369 uses before filing a bug report.

## Added

- Boot-safe `System Health Console` sidecar loaded after the core visualizer and existing consoles.
- WebGL2 renderer readiness check.
- Live canvas mount check.
- Web Audio support check.
- Local storage support check for preset/studio metadata.
- Canvas recording support check for `captureStream` and `MediaRecorder`.
- Clipboard helper and fullscreen support checks.
- `Refresh checks` action.
- `Copy diagnostics` action for clean feedback reports.
- `Open issue tracker` action.
- `Soft reload` action for browser recovery without pretending to preserve local audio selection.
- Version sync updates for System Health Console labels and stale stage text.

## Boot safety

The core React/WebGL app still mounts first. System Health Console loads after the existing boot-safe sidecars. If the health console fails to load, the core visualizer should remain available.

## Claim boundary

System Health Console is a local browser capability/readiness helper. It does not upload diagnostics, inspect private files, or claim to certify hardware performance. Audio remains local and user-selected.

## Test flow

1. Fresh load the page.
2. Confirm the visualizer appears before sidecar panels matter.
3. Scroll to System Health Console.
4. Click `Refresh checks`.
5. Click `Copy diagnostics`.
6. Click `Open issue tracker`.
7. Confirm visible labels sync to `v1.14.0`.
