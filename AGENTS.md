# AGENTS.md

# GameCue Agent Instructions

**Project:** GameCue  
**Purpose:** Generate, edit, and export loopable music cues for games.  
**Initial Stack:** React + TypeScript + Vite + Tone.js  
**Primary Workflow:** Implement one small ticket at a time from `docs/Tickets.md`.

---

# 1. Read These First

Before implementing any ticket, review the relevant project docs:

```text
docs/GameCue_Full_Design_Document.md
docs/GameCue_MVP_Technical_Design.md
docs/Tickets.md
docs/Codex_Prompt_Playbook.md
docs/Naming_And_Code_Conventions.md
docs/UI_Style_Guide.md
```

If a ticket changes architecture, data model, playback, export behavior, or long-term direction, also update or recommend updates to the relevant docs.

---

# 2. Project Goal

GameCue is a lightweight game-music cue generator.

It should help users quickly create:

- Investigation ambience
- Suspense loops
- Chase/action loops
- Menu themes
- Discovery stings
- Emotional scene cues
- Dark ambient background loops

GameCue is **not** a full DAW, plugin host, mastering suite, or AI full-song generator.

---

# 3. MVP Direction

The MVP is a browser-based app that uses:

```text
React + TypeScript + Vite
Tone.js playback
Engine-agnostic .gamecue.json project files
Rule-based music generation
```

The first usable version should:

- Generate a cue from user settings.
- Create structured tracks/events.
- Play, stop, and loop the cue.
- Mute and solo tracks.
- Regenerate individual tracks.
- Save/load `.gamecue.json`.
- Eventually export MIDI and game-ready assets.

---

# 4. Core Architecture Rule

The `.gamecue.json` project model is the source of truth.

Correct architecture:

```text
GameCue Project Data
  ↓
Playback Adapter
  ↓
Tone.js
```

Incorrect architecture:

```text
Tone.js objects are the source of truth
```

Do not store runtime Tone.js objects, browser audio objects, or non-serializable values in the project model.

---

# 5. Source Boundaries

## 5.1 Core Must Stay Engine-Agnostic

Files under `src/core/` must not import Tone.js or browser audio APIs.

Core areas:

```text
src/core/model/
src/core/theory/
src/core/templates/
src/core/generation/
src/core/serialization/
```

Allowed in core:

- Plain TypeScript types
- Music theory helpers
- Cue templates
- Project generation
- Serialization/validation
- JSON-compatible data

Not allowed in core:

```ts
import * as Tone from "tone";
import { Synth } from "tone";
```

Also avoid direct use of:

- Web Audio API
- DOM APIs
- React state
- UI components
- Runtime audio engine objects

## 5.2 Tone.js Belongs Only in Playback Adapter

Tone.js code belongs under:

```text
src/playback/tone/
```

Tone.js may be used for:

- Synths
- Samplers
- Scheduling
- Transport
- Effects
- Audio graph setup
- Playback cleanup/disposal

Tone.js should never become the project data format.

## 5.3 UI Should Not Own Business Logic

React components should not contain complex generation, theory, serialization, or Tone.js scheduling logic.

UI components may:

- Display controls
- Update app state
- Trigger generation/playback/save/load actions
- Display project summaries
- Display errors

UI components should delegate real work to:

- `src/core/*`
- `src/playback/*`
- `src/app/*` orchestration as needed

---

# 6. Expected Repo Structure

Use this structure unless a ticket explicitly changes it:

```text
src/
  app/
    App.tsx
    main.tsx
    styles.css

  core/
    model/
    theory/
    templates/
    generation/
    serialization/

  playback/
    PlaybackEngine.ts
    tone/

  ui/
    controls/
    tracks/
    project/
    shared/

docs/
  GameCue_Full_Design_Document.md
  GameCue_MVP_Technical_Design.md
  Tickets.md
  Codex_Prompt_Playbook.md
```

Future folders may include:

```text
src/core/export/
src/core/ai/
docs/spikes/
docs/design-decisions/
```

Only add new folders when they are needed for the current ticket.

---

# 7. Ticket Discipline

Implement **one ticket only**.

Every ticket should come from:

```text
docs/Tickets.md
```

For each ticket:

- Stay inside the allowed areas.
- Respect the do-not-touch areas.
- Implement only the listed requirements.
- Do not implement future-ticket features.
- Do not refactor unrelated systems.
- Do not introduce new architecture unless required.
- Do not add dependencies unless justified by the ticket.
- Prefer small, testable changes.

If you notice a needed improvement outside the ticket scope, mention it as a follow-up instead of implementing it.

---

# 8. Non-Goals During MVP

Do not implement these unless a later ticket explicitly asks for them:

- Full DAW timeline
- Full piano roll
- Waveform editing
- Live recording
- VST/AU plugin hosting
- JUCE renderer
- C# desktop app
- AI full-song generation
- Vocal generation
- Mastering suite
- Real-time collaboration
- Mobile-first UI
- Custom low-level audio engine

GameCue should remain a focused game-cue generator first.

---

# 9. Data Model Rules

Project files should be plain JSON-compatible data.

Preferred file extension:

```text
.gamecue.json
```

Project data should include:

- Schema version
- Project ID
- Title
- Cue settings
- Sections
- Tracks
- Events
- Mix settings

Do not save:

- Tone.js objects
- Functions
- Class instances that cannot serialize cleanly
- DOM references
- Audio nodes
- UI-only state
- Temporary runtime objects

When adding model fields:

- Keep names clear.
- Keep them serializable.
- Consider validation.
- Preserve backward compatibility where practical.
- Update docs if the project file shape changes.

---

# 10. Music Generation Rules

Core generation should:

- Return plain `GameCueProject` data.
- Use beat-based timing.
- Keep events inside the cue length.
- Keep notes in the selected key/mode unless intentionally documented.
- Vary density by cue type and intensity.
- Keep functions small and testable.
- Prefer deterministic or seed-ready design.
- Avoid hidden global state.

Track generation should initially support:

- Drums/percussion
- Bass/pulse
- Chords/pad
- Melody/motif

Generation should be useful before it is fancy.

---

# 11. Playback Rules

Playback should:

- Use the `PlaybackEngine` abstraction.
- Treat project data as input.
- Convert project events to scheduled audio.
- Respect BPM.
- Respect loop length.
- Respect mute/solo state.
- Dispose old scheduled audio when loading or regenerating.
- Avoid overlapping old and new projects.
- Avoid memory leaks.

Tone.js imports must stay under:

```text
src/playback/tone/
```

---

# 12. Save / Load Rules

Saving should:

- Serialize current `GameCueProject`.
- Use `.gamecue.json`.
- Pretty-print JSON.
- Preserve schema version.
- Use safe filenames.

Loading should:

- Parse JSON safely.
- Validate before applying.
- Show clear errors.
- Avoid crashing.
- Preserve the current project if loading fails.

Invalid files should not destroy app state.

---

# 13. Export Rules

Exports should be generated from project data, not from Tone.js runtime objects.

Early export roadmap:

1. `.gamecue.json`
2. MIDI
3. Metadata
4. Unity-friendly folder plan
5. WAV research spike
6. WAV/stems later

Do not implement WAV, stems, or Unity folder export unless the active ticket explicitly requires it.

---

# 14. UI Rules

UI should be simple and usable.

Prefer:

- Clear labels
- Small components
- Controlled inputs
- Readable layout
- Obvious disabled states
- Clear error messages

Avoid:

- Large UI frameworks unless approved
- Complex state libraries before needed
- DAW-like UI complexity too early
- Audio engine logic in React components
- Generation logic inside UI components

---

# 15. TypeScript Rules

Use TypeScript strictly.

Prefer:

- Explicit types
- Interfaces for project entities
- Pure helper functions
- Discriminated unions where helpful
- JSON-compatible model types
- Small modules

Avoid:

- `any`
- Broad mutable globals
- Unnecessary classes
- Silent type assertions
- Suppressing TypeScript errors without explanation

If `any` is unavoidable, include a short comment explaining why.

---

# Naming and Code Conventions

Follow:

```text
docs/Naming_And_Code_Conventions.md
```

---

# 16. Testing Expectations

When possible, add or update tests for:

- Music theory helpers
- Cue template selection
- Project generation
- Serialization
- Validation
- Timing boundaries
- Track regeneration
- Export helpers

For early tickets where tests are not set up yet, at minimum ensure:

```text
npm run build
```

succeeds.

If tests exist, run the relevant test command and report the result.

---

# 17. Manual Verification Expectations

Every completed ticket report should include a small manual verification checklist.

Manual verification should include:

- Commands to run
- Browser/app steps
- Expected results
- Failure signs to watch for
- Whether audio confirmation is needed

Keep verification practical enough to complete in 5–10 minutes.

---

# 18. Documentation Expectations

Update docs only when needed.

Docs likely to update:

```text
docs/Tickets.md
docs/GameCue_Full_Design_Document.md
docs/GameCue_MVP_Technical_Design.md
docs/Codex_Prompt_Playbook.md
README.md
```

Update docs when:

- Project file shape changes.
- Architecture changes.
- New ticket behavior differs from documentation.
- A design decision is made.
- Run/build instructions change.
- Verification steps change.

Do not rewrite entire docs for small implementation tickets unless requested.

---

# 19. Dependency Rules

Avoid unnecessary dependencies.

Before adding a dependency, confirm:

- It is required by the current ticket.
- It does not conflict with MVP simplicity.
- It does not pull the project toward full DAW scope.
- It does not violate architecture boundaries.

Tone.js should not be added until the playback ticket that requires it.

---

# 20. Branch and Commit Guidance

Suggested branch names:

```text
gamecue/t0001-project-skeleton
gamecue/t0002-core-project-model
gamecue/t0016-play-stop-loop-controls
```

Suggested commit messages:

```text
T0001: create GameCue project skeleton
T0002: add core project model types
T0016: wire play stop loop controls
```

Use one branch per ticket when practical.

---

# 21. Completion Report Format

At the end of each ticket, report:

```text
Summary:
- 

Files changed:
- 

Commands run:
- 

Build/test results:
- 

Manual verification:
- 

Architecture notes:
- 

Risks / follow-ups:
- 
```

If the ticket involved playback, include:

```text
Tone.js isolation:
- 

Playback cleanup/disposal behavior:
- 

Audio verification notes:
- 
```

If the ticket involved generation, include:

```text
Engine-agnostic generation notes:
- 

Timing/key validation notes:
- 
```

If the ticket involved save/load, include:

```text
Serialization/validation notes:
- 

Invalid file behavior:
- 
```

---

# 22. Handling Uncertainty

If a requirement is ambiguous:

1. Prefer the smallest implementation consistent with the ticket.
2. Preserve architecture boundaries.
3. Avoid future-ticket work.
4. Mention the ambiguity in the completion report.
5. Suggest a follow-up ticket if needed.

Do not invent major behavior outside the docs.

---

# 23. Current Recommended Sequence

Initial sequence:

```text
T0001 — Project Skeleton
T0002 — Core Project Model
T0003 — Basic App Layout
T0004 — Cue Controls UI
T0005 — Music Theory Helpers
T0006 — Cue Template System
T0007 — Chord Progression Generator
T0008 — Drum Pattern Generator
T0009 — Bassline Generator
T0010 — Chord / Pad Generator
T0011 — Melody / Motif Generator
T0012 — Full Project Generator
```

Tone.js starts later:

```text
T0013 — PlaybackEngine Interface
T0014 — Tone.js Instrument Factory
T0015 — Tone.js Scheduler
T0016 — Play / Stop / Loop Controls
```

---

# 24. Final Reminder

GameCue should grow slowly and intentionally.

The best outcome is not the biggest app. The best outcome is a small, stable tool that can generate useful loopable game music and keep improving one ticket at a time.

When in doubt:

```text
Small ticket.
Clean boundary.
Build passes.
Manual verification.
Report clearly.
Then stop.
```
