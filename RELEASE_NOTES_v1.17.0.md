# InfinityLens369 v1.17.0 — Share Console

## Summary

v1.17 adds a boot-safe **Share Console** sidecar for public handoff. It gives viewers and testers clean copy-ready notes for app links, quick starts, showcase invites, safety boundaries, repository access, and feedback asks.

## Added

- `src/share-console.ts`
- `src/share-console-loader.ts`
- `src/share-console.css`
- Share Console panel in the right-side studio dock
- Copy App Link
- Copy Quick Start
- Copy Showcase Invite
- Copy Safety Note
- Open Repo
- Copy Feedback Ask

## Boot safety

The Share Console loads after the core React/WebGL visualizer, Preset Studio, Capture Studio, Recording Studio, Performance Console, Layer Console, Launch Console, Gallery Console, Roadmap Console, System Health Console, Accessibility Console, and Showcase Console. Version sync runs last.

## Claim boundary

Share Console only prepares public handoff text and links. It does not upload audio, export private files, change source audio, or make medical/scientific/consciousness/physics claims.

## Test flow

1. Fresh load the app.
2. Confirm the visualizer appears before side panels finish mounting.
3. Scroll to Share Console.
4. Click Copy App Link.
5. Click Copy Quick Start.
6. Click Copy Showcase Invite.
7. Click Copy Safety Note.
8. Click Open Repo.
9. Click Copy Feedback Ask.
10. Confirm visible labels sync to v1.17.0.
