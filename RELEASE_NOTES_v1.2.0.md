# InfinityLens369 v1.2.0 — Transition Engine

## Release theme

v1.2 begins Sprint 2 on the v2.0 roadmap: smoother movement between visual states.

The goal is simple: mode and preset changes should feel like a performance bridge, not a hard UI jump.

## Added

- Stage-level Transition Engine
- Transition style selector
- Morph speed slider
- `T` hotkey to cycle transition styles
- Transition-wrapped Next Trip
- Transition-wrapped Random Trip
- Transition-wrapped Auto Trip cycles
- Transition-wrapped Safe Mode
- Transition-wrapped Slow Flow
- Transition-wrapped Reset Visuals
- Transition-wrapped Motion Profiles
- Transition-wrapped manual mode selection
- Transition metadata in JSON receipt export
- Isolated `src/transitions.css` animation layer

## Transition styles

- **Bloom Flash** — bright portal flare
- **Warp Tunnel** — radial lens sweep
- **Glitch Cut** — pixel tear jump
- **Soft Fade** — gentle crossfade veil
- **Beat Pulse** — ring pulse bridge

## Notes

This is a stage-level transition pass. It does not blend shader outputs at the WebGL framebuffer level yet. That deeper shader morphing can come later after the transition UX is stable.

## Claim boundary

InfinityLens369 remains claim-safe creative software: an art, math, and music-reactive visualization engine. It is not a physics, consciousness, medical, or diagnostic proof engine.
