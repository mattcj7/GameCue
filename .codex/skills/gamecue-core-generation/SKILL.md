---
name: gamecue-core-generation
description: Use for GameCue music theory, cue templates, pattern generation, variation, and engine-agnostic project-data generation work.
---

# GameCue Core Generation

Use this skill for tickets involving music theory helpers, cue templates, generated tracks/events, drum patterns, basslines, chords/pads, melody/motifs, intensity variation, or regeneration of project data.

## Required Context

Before coding, review the relevant parts of:

- `AGENTS.md`
- `docs/GameCue_Full_Design_Document.md`
- `docs/GameCue_MVP_Technical_Design.md`
- `docs/Tickets.md`
- Existing files under `src/core/`

## Hard Boundary

Core generation must stay engine-agnostic.

Allowed in `src/core/`:

- Plain TypeScript types
- JSON-compatible data structures
- Music theory helpers
- Cue templates
- Deterministic or seed-ready generation functions
- Serialization-friendly project data

Not allowed in `src/core/`:

- Tone.js imports
- Browser audio APIs
- DOM APIs
- React components/hooks
- Runtime audio engine objects
- Non-serializable objects/functions/classes inside project data

## Project Data Rules

- Generate `GameCueProject` data or smaller plain objects that fit the project model.
- Keep `.gamecue.json` as the source of truth.
- Events should use beat-based timing, not wall-clock timing.
- Events should stay within cue length unless the ticket explicitly allows otherwise.
- Notes should stay in the selected key/mode unless a ticket or template documents an intentional exception.
- Track IDs and event IDs should be stable enough for later editing where practical.
- Avoid hidden global state.

## Musical Rules

- Keep MVP output simple and game-usable.
- Prefer loopable patterns over complex song arrangements.
- Preserve clear roles for track types:
  - Drums/percussion = pulse and tension
  - Bass/pulse = low-end motion and grounding
  - Chords/pad = harmonic bed and mood
  - Melody/motif = memorable theme or repeated phrase
  - FX/stinger = hits, rises, impacts, transitions
- Intensity should change density, rhythm, register, velocity, or layer count in understandable ways.
- Motif variation should preserve recognizable contour or rhythm when the ticket requires motif preservation.

## Code Quality Rules

- Prefer small, typed, testable functions.
- Keep random choice isolated behind helper functions.
- Prefer deterministic or seed-ready design, even if full seeded generation comes later.
- Validate inputs where reasonable.
- Use clear names over clever abstractions.
- Do not introduce a full composition engine unless a ticket requires it.

## Testing Guidance

When useful, add tests for:

- Scale/key helpers
- Chord construction
- Events staying within cue length
- Track count/type expectations
- Deterministic behavior if a seed helper exists
- Generated notes matching allowed pitch classes
- Serialization compatibility of generated output

## Completion Report Additions

In addition to the standard report, include:

- Whether any generated data model changed
- Whether output remains JSON-compatible
- Whether Tone.js/browser audio stayed out of `src/core/`
- Musical limitations or follow-up improvements
