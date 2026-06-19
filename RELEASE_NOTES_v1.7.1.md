# InfinityLens369 v1.7.1 — Capture Studio Build Hotfix

## Summary

v1.7.1 fixes a TypeScript build failure introduced during the Capture Studio sprint.

The v1.7.0 `main.tsx` file dynamically imported `capture-studio.ts` directly. That file was written as a side-effect script with no exports, so TypeScript correctly reported:

```text
TS2306: File 'src/capture-studio.ts' is not a module.
```

## Fix

- Added `src/capture-studio-loader.ts` as a tiny ES module wrapper.
- The wrapper side-effect imports `capture-studio.ts` and exports an empty module marker.
- `main.tsx` now dynamically imports `capture-studio-loader` instead of importing `capture-studio.ts` directly.
- Package version bumped to `1.7.1`.

## Test Flow

```bash
git pull
npm install
npm run build
npm run dev
```

Then verify:

1. Fresh app boot still works.
2. Preset Studio loads after the main app.
3. Capture Studio loads after the main app.
4. Capture frame still saves a local thumbnail.
5. GitHub Pages deploy no longer blocks on the TypeScript module error.

## Boundary

This is a build/runtime safety hotfix only. It does not change Capture Studio behavior or the shader core.
