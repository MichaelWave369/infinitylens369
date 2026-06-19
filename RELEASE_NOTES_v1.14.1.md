# InfinityLens369 v1.14.1 — System Health Build Hotfix

## What changed

This is a small build-stability hotfix for the v1.14 System Health Console.

- Replaced the clipboard readiness check with a runtime-safe helper.
- Avoided TypeScript TS2774 by not testing a DOM function reference that the compiler already treats as always defined.
- Kept the copy diagnostics fallback path intact.
- Bumped visible release labels to v1.14.1.

## Why this matters

The System Health Console should help users diagnose browser capability without breaking the TypeScript production build.

## Test flow

1. Run `npm run build`.
2. Run `npm run dev`.
3. Scroll to System Health Console.
4. Click `Refresh checks`.
5. Click `Copy diagnostics`.
6. Confirm labels show `v1.14.1`.

## Boundary

This does not add new diagnostics. It is a build hotfix for clipboard support detection and release label sync.
