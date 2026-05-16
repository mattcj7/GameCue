# GameCue Tickets

**Version:** 0.1  
**Status:** Draft / living ticket plan  
**Primary workflow:** Plan here, implement one small Codex ticket at a time.  
**Initial stack:** React + TypeScript + Vite + Tone.js.  
**Core rule:** `.gamecue.json` is the source of truth. Tone.js is only the first playback adapter.

---

## 1. Operating Rules for Codex

Every Codex ticket prompt should include this rule block:

```text
Implement this ticket only.
Do not implement future-ticket features.
Do not refactor unrelated systems.
Do not introduce new architecture unless required by this ticket.
Keep generation logic separate from playback logic.
Keep Tone.js code out of core/model/generation/template/serialization files.
Provide files changed, commands run, build/test result, and manual verification steps.
```

A good ticket should be small enough that it can be manually checked in about 5–10 minutes.

---

## 2. Phase Map

| Phase | Focus | Tickets |
|---|---|---|
| Phase 0 | Planning pack | T0000A–T0000E |
| Phase 1 | App skeleton | T0001–T0004 |
| Phase 2 | Music brain | T0005–T0012 |
| Phase 3 | Playback | T0013–T0018 |
| Phase 4 | Save/load | T0019–T0023 |
| Phase 5 | Regeneration and variations | T0024–T0028 |
| Phase 6 | Game export | T0029–T0034 |
| Phase 7 | Editing tools | T0035–T0040 |
| Phase 8 | Polish and better sounds | T0041–T0046 |
| Phase 9 | AI assistant later | T0047–T0050 |

---

## 3. Architecture Boundaries

### 3.1 Core must stay engine-agnostic

These folders must not import Tone.js:

```text
src/core/model
src/core/theory
src/core/templates
src/core/generation
src/core/serialization
```

Tone.js belongs only under:

```text
src/playback/tone
```

### 3.2 Project data is plain JSON

Saved projects should contain only serializable plain data:

```text
*.gamecue.json
```

Do not save Tone.js objects, browser audio objects, or runtime-only playback state.

### 3.3 MVP is not a DAW

Avoid during MVP:

- Waveform editing
- Live recording
- VST/AU plugin hosting
- Full piano roll before basic generation/playback works
- Advanced mastering
- AI full-song audio generation
- Custom low-level audio engine

---

# Phase 0 — Planning Pack

## T0000A — Full Design Document

**Goal:** Create the master design reference for GameCue.  
**Dependencies:** None  
**Allowed areas:** `docs/`  
**Do not touch:** Source code

### Requirements

- Define product purpose, MVP scope, non-goals, architecture, future C#/JUCE path, and design decision log.

### Non-goals

- No implementation.

### Acceptance Criteria

- `docs/GameCue_Full_Design_Document.md` exists and can guide future tickets.

### Manual Verification

1. Open the document.
2. Confirm it explains what GameCue is and is not.
3. Confirm MVP scope and future roadmap are included.

---

## T0000B — MVP Technical Design

**Goal:** Create the technical design for the first playable MVP.  
**Dependencies:** T0000A  
**Allowed areas:** `docs/`  
**Do not touch:** Source code

### Requirements

- Define initial repo structure, MVP schema, cue templates, playback abstraction, and first implementation path.

### Non-goals

- No implementation.

### Acceptance Criteria

- `docs/GameCue_MVP_Technical_Design.md` exists and is specific enough to support T0001–T0010.

### Manual Verification

1. Open the document.
2. Confirm it includes repo structure, schema, and first implementation sequence.

---

## T0000C — Tickets.md

**Goal:** Create the detailed ticket plan for GameCue.  
**Dependencies:** T0000A, T0000B  
**Allowed areas:** `docs/`  
**Do not touch:** Source code

### Requirements

- Include T0001–T0050.
- Group tickets into phases.
- Include goal, dependencies, non-goals, acceptance criteria, and manual verification.

### Non-goals

- No implementation.

### Acceptance Criteria

- `docs/Tickets.md` exists and T0001 is ready to hand to Codex.

### Manual Verification

1. Open `Tickets.md`.
2. Confirm every ticket has a unique ID.
3. Confirm T0001 is immediately actionable.

---

## T0000D — Codex Prompt Playbook

**Goal:** Create reusable Codex prompt templates.  
**Dependencies:** T0000C  
**Allowed areas:** `docs/`  
**Do not touch:** Source code

### Requirements

- Include default ticket prompt, bugfix prompt, refactor prompt, docs-update prompt, and manual-verification prompt.

### Non-goals

- No implementation.
- No custom skills yet.

### Acceptance Criteria

- `docs/Codex_Prompt_Playbook.md` exists and prompts are copy/paste usable.

### Manual Verification

1. Open the playbook.
2. Confirm it tells Codex to implement one ticket only.
3. Confirm it includes a T0001-ready prompt pattern.

---

## T0000E — AGENTS.md

**Goal:** Create repo-level instructions for Codex/agents.  
**Dependencies:** T0000A–T0000D  
**Allowed areas:** repo root, `docs/`  
**Do not touch:** Source implementation

### Requirements

- Define project purpose, architecture boundaries, ticket workflow, test expectations, docs expectations, and manual verification expectations.

### Non-goals

- No implementation.
- No custom skills yet.

### Acceptance Criteria

- `AGENTS.md` exists and tells Codex to check design docs and implement one ticket at a time.

### Manual Verification

1. Open `AGENTS.md`.
2. Confirm it gives Codex clear project context.
3. Confirm it discourages scope creep.

---

# Phase 1 — App Skeleton

## T0001 — Project Skeleton

**Goal:** Create the initial Vite + React + TypeScript GameCue app skeleton.  
**Dependencies:** T0000C  
**Allowed areas:** repo root, `src/app`, `src/ui`, `docs`  
**Do not touch:** Tone.js playback, generation logic, save/load logic

### Requirements

- Create a Vite + React + TypeScript project.
- Enable TypeScript strict mode.
- Create folder structure:

```text
src/app
src/core/model
src/core/theory
src/core/templates
src/core/generation
src/core/serialization
src/playback
src/playback/tone
src/ui/controls
src/ui/tracks
src/ui/project
src/ui/shared
```

- Add simple `App.tsx` displaying:
  - GameCue
  - Generate loopable game music cues
  - Placeholder Cue Controls
  - Placeholder Track List
  - Placeholder Transport
  - Placeholder Save/Load
- Add README run instructions.
- Ensure app builds.

### Non-goals

- No Tone.js.
- No audio.
- No generator.
- No schema.
- No save/load.

### Acceptance Criteria

- `npm install` works.
- `npm run dev` starts the app.
- `npm run build` succeeds.
- App shows the GameCue shell.

### Manual Verification

1. Run `npm install`.
2. Run `npm run dev`.
3. Open local app.
4. Confirm GameCue heading and placeholders appear.
5. Run `npm run build`.

---

## T0002 — Core Project Model

**Goal:** Add TypeScript data models for GameCue project files.  
**Dependencies:** T0001  
**Allowed areas:** `src/core/model`, `src/core/serialization`, tests if present  
**Do not touch:** playback, generation, real UI behavior

### Requirements

Create model types/interfaces for:

- `GameCueProject`
- `CueSettings`
- `Section`
- `Track`
- `NoteEvent`
- `MixSettings`
- `TrackMixSettings`
- `CueType`
- `Mood`
- `TrackType`
- `InstrumentId`

Add `createExampleProject()`.

### Non-goals

- No generation logic.
- No playback.
- No file save/load.

### Acceptance Criteria

- TypeScript compiles.
- Example project object is valid.
- Model files do not import Tone.js.

### Manual Verification

1. Run `npm run build`.
2. Inspect model files.
3. Confirm all types are plain JSON-compatible data.

---

## T0003 — Basic App Layout

**Goal:** Replace placeholders with a clean first layout.  
**Dependencies:** T0001, T0002  
**Allowed areas:** `src/app`, `src/ui`, CSS  
**Do not touch:** playback, generation

### Requirements

- Add left cue-control area.
- Add main/right track-list area.
- Add transport area.
- Add save/load panel placeholder.
- Keep styling simple and readable.

### Non-goals

- No real cue controls yet.
- No real track data yet.
- No playback.

### Acceptance Criteria

- UI is readable.
- Labeled sections are visible.
- Build succeeds.

### Manual Verification

1. Run app.
2. Confirm sections are visible and readable.
3. Resize browser.
4. Run build.

---

## T0004 — Cue Controls UI

**Goal:** Add controlled UI inputs for cue settings.  
**Dependencies:** T0002, T0003  
**Allowed areas:** `src/ui/controls`, `src/app`, model types if needed  
**Do not touch:** generation, playback

### Requirements

Add controls for:

- Cue type
- Mood
- BPM
- Key
- Mode
- Intensity
- Bars

Controls should update React state and show current selected settings.

### Non-goals

- No Generate Cue behavior yet.
- No audio.
- No deep validation.

### Acceptance Criteria

- User can change each field.
- Current settings update visibly.
- Build succeeds.

### Manual Verification

1. Run app.
2. Change each control.
3. Confirm visible state updates.
4. Run build.

---

# Phase 2 — Music Brain

## T0005 — Music Theory Helpers

**Goal:** Implement basic music theory helpers for notes, scales, and chords.  
**Dependencies:** T0002  
**Allowed areas:** `src/core/theory`, tests  
**Do not touch:** playback

### Requirements

- Chromatic notes.
- Major scale.
- Natural minor scale.
- Note transpose by semitone.
- Scale degree to note.
- Basic triad generation.
- Simple chord progression resolution.

### Non-goals

- No advanced chord theory.
- No perfect enharmonic spelling requirement.
- No generator pipeline.

### Acceptance Criteria

- Can generate D minor and C major scales.
- Can resolve basic major/minor triads.
- Build/test succeeds.

### Manual Verification

1. Run tests/build.
2. Confirm C major returns C D E F G A B.
3. Confirm D minor returns D E F G A A#/Bb C or project-approved spelling.

---

## T0006 — Cue Template System

**Goal:** Add cue template definitions for initial cue types.  
**Dependencies:** T0002, T0005  
**Allowed areas:** `src/core/templates`, model updates if needed, tests  
**Do not touch:** playback

### Requirements

Templates:

- Investigation
- Suspense
- Chase
- Menu Theme
- Discovery Sting
- Emotional Scene
- Dark Ambient

Each template defines ID, display name, description, BPM range, default mode, recommended bars, allowed moods, generation profile, and track presets.

### Non-goals

- No actual note generation.
- No Tone.js.

### Acceptance Criteria

- Template can be selected by cue type.
- Defaults are reasonable.
- Build succeeds.

### Manual Verification

1. Inspect templates.
2. Confirm Chase is faster than Investigation.
3. Confirm Dark Ambient and Emotional Scene are sparse.
4. Run build.

---

## T0007 — Chord Progression Generator

**Goal:** Generate chord progressions from cue settings and template profile.  
**Dependencies:** T0005, T0006  
**Allowed areas:** `src/core/generation`, `src/core/theory`, tests  
**Do not touch:** playback

### Requirements

- Generate progression for selected key/mode.
- Support initial major/minor progression sets.
- Support suspense-style progressions.
- Return structured chord data.
- Fit progression to selected bar count.

### Non-goals

- No advanced voicing.
- No melody.
- No audio.

### Acceptance Criteria

- D minor investigation returns plausible minor progression.
- C major menu returns plausible major progression.
- Build/test succeeds.

### Manual Verification

1. Run generation tests/debug.
2. Confirm progression is not empty.
3. Confirm chords fit selected cue length.
4. Run build.

---

## T0008 — Drum Pattern Generator

**Goal:** Generate simple drum/percussion events.  
**Dependencies:** T0002, T0006  
**Allowed areas:** `src/core/generation`, tests  
**Do not touch:** playback

### Requirements

- Generate beat-based drum events.
- Support kick, snare, hat, low hit, perc hit.
- Vary density by intensity.
- Chase should be more active than Investigation.
- Events must stay within cue length.

### Non-goals

- No sampled drums.
- No Tone.js mapping.
- No drum grid UI.

### Acceptance Criteria

- Drum events generate.
- High intensity creates more activity than low intensity.
- Event timing is valid.
- Build/test succeeds.

### Manual Verification

1. Generate Investigation intensity 1.
2. Generate Chase intensity 5.
3. Confirm Chase has more events.
4. Run build.

---

## T0009 — Bassline Generator

**Goal:** Generate bass note events from chord progression and cue profile.  
**Dependencies:** T0007  
**Allowed areas:** `src/core/generation`, tests  
**Do not touch:** playback

### Requirements

- Bass follows chord roots initially.
- Cue type affects rhythm:
  - Investigation: sparse
  - Suspense: ostinato
  - Chase: driving
  - Emotional: long supportive notes
  - Dark Ambient: drone
- Notes should be in a low register.
- Events stay within cue length.

### Non-goals

- No glides/slides.
- No advanced fills.
- No playback.

### Acceptance Criteria

- Bass events generate for each cue type.
- Chase is more rhythmically active than Emotional.
- Build/test succeeds.

### Manual Verification

1. Generate Investigation bass.
2. Generate Chase bass.
3. Confirm Chase has more movement.
4. Run build.

---

## T0010 — Chord / Pad Generator

**Goal:** Generate chord/pad note events from chord progression.  
**Dependencies:** T0007  
**Allowed areas:** `src/core/generation`, tests  
**Do not touch:** playback

### Requirements

- Convert progression chords to note events.
- Use longer durations for ambient cues.
- Use shorter/stab behavior for Chase if appropriate.
- Keep notes within cue length.

### Non-goals

- No advanced inversions.
- No audio effects.

### Acceptance Criteria

- Chord events are generated.
- Events include multiple notes per chord.
- Durations match cue type reasonably.
- Build/test succeeds.

### Manual Verification

1. Generate Dark Ambient pad.
2. Confirm long notes.
3. Generate Chase chords.
4. Confirm more rhythmic behavior if implemented.
5. Run build.

---

## T0011 — Melody / Motif Generator

**Goal:** Generate simple melody/motif note events.  
**Dependencies:** T0005, T0007  
**Allowed areas:** `src/core/generation`, tests  
**Do not touch:** playback

### Requirements

- Generate short motif-based melodies.
- Use scale tones.
- Prefer chord tones on strong beats.
- Use rests.
- Vary density by cue type and intensity.

### Non-goals

- No advanced composition.
- No AI.
- No piano roll.

### Acceptance Criteria

- Melody events generate.
- Notes are in key/mode.
- Investigation melody is sparse.
- Menu or Chase melody is more active.
- Build/test succeeds.

### Manual Verification

1. Generate Investigation melody.
2. Generate Menu Theme melody.
3. Confirm Menu Theme is more active.
4. Run build.

---

## T0012 — Full Project Generator

**Goal:** Generate a complete `GameCueProject` from cue settings.  
**Dependencies:** T0007, T0008, T0009, T0010, T0011  
**Allowed areas:** `src/core/generation`, `src/app` for Generate button wiring, tests  
**Do not touch:** Tone.js playback

### Requirements

- Add `generateProject(settings)`.
- Create cue metadata, one section, drum track, bass track, chord/pad track, melody/motif track, and mix defaults.
- Wire Generate Cue button to app state.
- Display generated tracks and event counts.

### Non-goals

- No audio playback.
- No save/load.
- No per-track regeneration.

### Acceptance Criteria

- Clicking Generate Cue creates project data.
- Track list shows generated tracks.
- Event counts display.
- Build/test succeeds.

### Manual Verification

1. Run app.
2. Select Investigation and Generate Cue.
3. Confirm tracks appear.
4. Select Chase and generate again.
5. Confirm event counts differ.
6. Run build.

---

# Phase 3 — Playback

## T0013 — PlaybackEngine Interface

**Goal:** Define the engine-agnostic playback interface.  
**Dependencies:** T0012  
**Allowed areas:** `src/playback`, tests  
**Do not touch:** Tone.js implementation beyond placeholder

### Requirements

Create `PlaybackEngine` interface with:

- `loadProject`
- `play`
- `stop`
- `pause`
- `setLoop`
- `setBpm`
- `setTrackMuted`
- `setTrackSolo`
- `dispose`

### Non-goals

- No actual sound.
- No Tone.js scheduling.

### Acceptance Criteria

- Interface compiles.
- Interface file has no Tone.js import.
- Build succeeds.

### Manual Verification

1. Inspect interface.
2. Confirm it references only project model types.
3. Run build.

---

## T0014 — Tone.js Instrument Factory

**Goal:** Add Tone.js instruments for initial track/instrument types.  
**Dependencies:** T0013  
**Allowed areas:** `src/playback/tone`, package dependencies  
**Do not touch:** core generation logic

### Requirements

- Install Tone.js.
- Add instrument factory.
- Support minimal electronic kit, sub pulse, dark pad, and simple lead.
- Keep factory isolated under `playback/tone`.

### Non-goals

- No scheduler yet.
- No UI playback yet.
- No advanced effects.

### Acceptance Criteria

- Tone.js dependency added.
- Instrument factory compiles.
- No Tone imports outside `src/playback/tone`.
- Build succeeds.

### Manual Verification

1. Search for Tone imports.
2. Confirm they only exist under `src/playback/tone`.
3. Run build.

---

## T0015 — Tone.js Scheduler

**Goal:** Schedule project note events using Tone.js.  
**Dependencies:** T0014  
**Allowed areas:** `src/playback/tone`  
**Do not touch:** core generation except bugfixes if required

### Requirements

- Implement `TonePlaybackEngine`.
- Convert project events into Tone scheduled parts.
- Respect BPM and loop length.
- Dispose old scheduled events when reloading.

### Non-goals

- No mute/solo unless trivial.
- No UI polish.
- No export.

### Acceptance Criteria

- Generated project can load into `TonePlaybackEngine`.
- Programmatic playback starts/stops.
- Build succeeds.

### Manual Verification

1. Generate/load a project through app or debug path.
2. Trigger playback if wired.
3. Confirm no console errors.
4. Run build.

---

## T0016 — Play / Stop / Loop Controls

**Goal:** Wire UI transport controls to `TonePlaybackEngine`.  
**Dependencies:** T0015  
**Allowed areas:** `src/ui/controls`, `src/app`, `src/playback`  
**Do not touch:** generation logic except integration bugs

### Requirements

- Add Play button.
- Add Stop button.
- Add Loop toggle.
- Load latest project into playback engine.
- Start browser audio context from user interaction when needed.

### Non-goals

- No track mute/solo yet.
- No save/load.
- No export.

### Acceptance Criteria

- User can generate cue.
- User can press Play and hear audio.
- Stop stops audio.
- Loop repeats cue.
- Build succeeds.

### Manual Verification

1. Generate cue.
2. Press Play.
3. Confirm audio plays.
4. Press Stop.
5. Enable loop and confirm repeat.
6. Run build.

---

## T0017 — Track Mute / Solo

**Goal:** Make track mute and solo controls affect playback.  
**Dependencies:** T0016  
**Allowed areas:** `src/ui/tracks`, `src/playback`, `src/app`  
**Do not touch:** generator internals unless track state needs minor model update

### Requirements

- Track cards display mute and solo controls.
- Muting silences a track.
- Soloing silences non-soloed tracks.
- UI shows current state.

### Non-goals

- No volume/pan.
- No regeneration.
- No export.

### Acceptance Criteria

- Mute works during playback.
- Solo works during playback.
- Build succeeds.

### Manual Verification

1. Generate cue.
2. Play.
3. Mute bass.
4. Solo melody.
5. Confirm expected audio changes.
6. Run build.

---

## T0018 — Playback Cleanup and Dispose Safety

**Goal:** Make playback stable when generating/loading repeatedly.  
**Dependencies:** T0016, T0017  
**Allowed areas:** `src/playback`, `src/app`  
**Do not touch:** core generation except bugfixes

### Requirements

- Dispose old Tone instruments/parts safely.
- Avoid overlapping playback after regenerate.
- Stop or reload safely when project changes.
- Add cleanup on app unmount.

### Non-goals

- No new user features.
- No export.

### Acceptance Criteria

- Repeated Generate/Play/Stop does not stack old audio.
- No obvious console errors.
- Build succeeds.

### Manual Verification

1. Generate cue.
2. Play.
3. Generate another cue while playing.
4. Confirm old cue does not continue underneath.
5. Repeat several times.
6. Check console.
7. Run build.

---

# Phase 4 — Save / Load

## T0019 — Project Serializer

**Goal:** Add JSON serialization for GameCue projects.  
**Dependencies:** T0012  
**Allowed areas:** `src/core/serialization`, tests  
**Do not touch:** playback

### Requirements

- Serialize project to pretty JSON.
- Preserve schema version, cue settings, sections, tracks, events, and mix.

### Non-goals

- No browser file download.
- No load UI.

### Acceptance Criteria

- Generated project can be serialized.
- JSON is readable.
- Build/test succeeds.

### Manual Verification

1. Serialize example project.
2. Confirm JSON includes cue, sections, tracks, and mix.
3. Run build.

---

## T0020 — Project Validator

**Goal:** Validate loaded `.gamecue.json` data safely.  
**Dependencies:** T0019  
**Allowed areas:** `src/core/serialization`, tests  
**Do not touch:** playback

### Requirements

Check:

- Schema version exists.
- Cue object exists.
- Tracks array exists.
- Track IDs are unique.
- Events have valid timing.
- BPM is in supported range.
- Bars is positive.

### Non-goals

- No migration system yet.
- No UI error display yet.

### Acceptance Criteria

- Valid project passes.
- Invalid project fails with useful error.
- Build/test succeeds.

### Manual Verification

1. Validate a good project.
2. Validate missing tracks.
3. Validate invalid BPM.
4. Confirm useful errors.
5. Run build.

---

## T0021 — Save .gamecue.json

**Goal:** Add browser save/download for project files.  
**Dependencies:** T0019  
**Allowed areas:** `src/ui/project`, `src/app`, serialization  
**Do not touch:** playback internals

### Requirements

- Add Save Project button.
- Serialize current project.
- Download as `.gamecue.json`.
- Disable save if no project exists.

### Non-goals

- No load yet.
- No MIDI/WAV export.

### Acceptance Criteria

- User can generate and save project.
- File extension is `.gamecue.json`.
- Build succeeds.

### Manual Verification

1. Generate cue.
2. Save project.
3. Open downloaded JSON.
4. Confirm project data exists.
5. Run build.

---

## T0022 — Load .gamecue.json

**Goal:** Add browser file load for saved GameCue projects.  
**Dependencies:** T0020, T0021  
**Allowed areas:** `src/ui/project`, `src/app`, serialization  
**Do not touch:** generation internals except integration bugs

### Requirements

- Add Load Project input/button.
- Parse selected file.
- Validate project.
- Load into app state.
- Update cue controls and track list.
- Reload playback engine if needed.

### Non-goals

- No migration yet.
- No drag/drop.

### Acceptance Criteria

- Saved project can be reloaded.
- Settings and tracks restore.
- Build succeeds.

### Manual Verification

1. Generate cue.
2. Save project.
3. Refresh app.
4. Load saved file.
5. Confirm settings and tracks restore.
6. Run build.

---

## T0023 — Invalid File Error Handling

**Goal:** Show safe UI errors for invalid load attempts.  
**Dependencies:** T0020, T0022  
**Allowed areas:** `src/ui/project`, `src/app`, serialization  
**Do not touch:** playback unless needed for safety

### Requirements

- Show clear error for non-JSON file.
- Show clear error for invalid schema.
- Do not crash.
- Preserve existing project if load fails.
- Error can be dismissed.

### Non-goals

- No migration.
- No advanced diagnostics UI.

### Acceptance Criteria

- Invalid file does not crash app.
- User sees understandable error.
- Existing project remains.
- Build succeeds.

### Manual Verification

1. Load a valid project.
2. Try loading random text.
3. Confirm error appears.
4. Confirm original project remains.
5. Run build.

---

# Phase 5 — Regeneration and Variations

## T0024 — Regenerate Selected Track

**Goal:** Regenerate only one selected track.  
**Dependencies:** T0012, T0017  
**Allowed areas:** `src/core/generation`, `src/ui/tracks`, `src/app`  
**Do not touch:** save/load except if project shape requires no change

### Requirements

- Add regenerate button per track.
- Regenerate selected track type only.
- Keep other tracks unchanged.
- Preserve cue settings.
- Update playback after regeneration.

### Non-goals

- No lock behavior yet.
- No AI.
- No advanced variations.

### Acceptance Criteria

- Regenerating melody changes only melody.
- Other tracks remain unchanged.
- Playback reflects updated track.
- Build/test succeeds.

### Manual Verification

1. Generate cue.
2. Note event counts.
3. Regenerate melody.
4. Confirm only melody changes.
5. Play and verify update.
6. Run build.

---

## T0025 — Lock Track Behavior

**Goal:** Add track locking to protect liked tracks during regeneration.  
**Dependencies:** T0024  
**Allowed areas:** `src/core/model`, `src/core/generation`, `src/ui/tracks`, `src/app`  
**Do not touch:** playback internals except track state pass-through

### Requirements

- Add lock/unlock control per track.
- Locked tracks are not changed by full regeneration.
- Locked tracks are not changed by future variation generation.
- UI clearly shows locked state.

### Non-goals

- No per-note lock.
- No arrangement lock.

### Acceptance Criteria

- Locked track remains unchanged after regenerate.
- Unlocking allows changes.
- Build/test succeeds.

### Manual Verification

1. Generate cue.
2. Lock drums.
3. Regenerate all or variation if available.
4. Confirm drums remain unchanged.
5. Unlock and regenerate again.
6. Run build.

---

## T0026 — Low / Medium / High Intensity Variations

**Goal:** Generate intensity variations from existing project settings.  
**Dependencies:** T0024, T0025  
**Allowed areas:** `src/core/generation`, `src/ui/controls`, `src/app`  
**Do not touch:** export

### Requirements

- Add variation controls:
  - Lower intensity
  - Same intensity variation
  - Higher intensity
- Keep cue type, key, mode, and bars.
- Respect locked tracks.

### Non-goals

- No motif preservation yet.
- No variation library.

### Acceptance Criteria

- Higher variation has more activity.
- Lower variation has less activity.
- Locked tracks remain unchanged.
- Build/test succeeds.

### Manual Verification

1. Generate cue at intensity 3.
2. Create higher variation.
3. Confirm increased density.
4. Create lower variation.
5. Confirm lower density.
6. Run build.

---

## T0027 — Create Cue Variation From Existing Project

**Goal:** Add a variation workflow that treats current cue as parent.  
**Dependencies:** T0026  
**Allowed areas:** `src/core/generation`, `src/app`, `src/ui`  
**Do not touch:** save/load except optional metadata if needed

### Requirements

- Generate a new variant based on current project.
- Keep key/mode/bars related.
- Keep title relation clear.
- Allow user to continue editing the variant.

### Non-goals

- No variation library.
- No compare UI.
- No batch export.

### Acceptance Criteria

- User can create a related variation.
- Variation differs from parent.
- Build succeeds.

### Manual Verification

1. Generate cue.
2. Create variation.
3. Confirm title/summary indicates variation.
4. Confirm event data differs.
5. Run build.

---

## T0028 — Preserve Motif During Variation

**Goal:** Keep recognizable melody/motif identity across variations.  
**Dependencies:** T0011, T0027  
**Allowed areas:** `src/core/generation`, tests  
**Do not touch:** playback

### Requirements

- Identify or store simple motif basis.
- Generate melody variation using same motif shape or starting degrees.
- Allow rhythm/density changes.
- Keep notes in key.

### Non-goals

- No advanced theme transformation.
- No AI.

### Acceptance Criteria

- Base and variation melodies share recognizable motif data.
- Variation is not identical.
- Build/test succeeds.

### Manual Verification

1. Generate menu/investigation cue.
2. Create motif-preserving variation.
3. Compare melody event summary.
4. Confirm repeated shape exists.
5. Run build.

---

# Phase 6 — Game Export

## T0029 — MIDI Export

**Goal:** Export GameCue project as a MIDI file.  
**Dependencies:** T0012, T0021  
**Allowed areas:** `src/core/export` or `src/core/serialization`, `src/ui/project`, dependencies  
**Do not touch:** Tone.js playback unless needed for shared mapping

### Requirements

- Add MIDI export function.
- Include tempo.
- Include tracks.
- Convert note events to MIDI notes.
- Map drum events to reasonable General MIDI drum notes.
- Add Export MIDI button.

### Non-goals

- No WAV export.
- No stem export.
- No advanced MIDI CC.

### Acceptance Criteria

- User can export `.mid`.
- File opens in DAW/MIDI viewer.
- Build succeeds.

### Manual Verification

1. Generate cue.
2. Export MIDI.
3. Open MIDI externally if available.
4. Confirm tempo and notes exist.
5. Run build.

---

## T0030 — Unity Folder Export Plan

**Goal:** Design Unity-friendly export folder structure.  
**Dependencies:** T0029  
**Allowed areas:** `docs/`, optional UI placeholder  
**Do not touch:** actual export implementation unless explicitly scoped

### Requirements

- Document folder structure.
- Define naming conventions.
- Define metadata contents.
- Define how loop/stem/MIDI/project files should be organized.

### Non-goals

- No actual zip/folder export.
- No WAV/stem export.

### Acceptance Criteria

- Export plan is documented.
- Naming conventions are clear.

### Manual Verification

1. Open docs.
2. Confirm sample Unity folder structure exists.
3. Confirm filenames are Unity-friendly.

---

## T0031 — Export Metadata File

**Goal:** Generate metadata describing exported cue.  
**Dependencies:** T0021, T0030  
**Allowed areas:** export/serialization, UI export panel  
**Do not touch:** audio rendering

### Requirements

Export metadata with title, cue type, BPM, key/mode, bars, loop length, track list, and timestamp.

### Non-goals

- No WAV.
- No full Unity folder zip.

### Acceptance Criteria

- Metadata file exports.
- Metadata matches current project.
- Build succeeds.

### Manual Verification

1. Generate cue.
2. Export metadata.
3. Open metadata.
4. Confirm fields match UI.
5. Run build.

---

## T0032 — Browser WAV Export Research Spike

**Goal:** Research browser-based WAV rendering feasibility.  
**Dependencies:** T0016  
**Allowed areas:** isolated spike file or docs  
**Do not touch:** production playback unless approved

### Requirements

- Investigate OfflineAudioContext or Tone.js offline rendering.
- Document feasibility, risks, and recommendation.
- Keep any prototype isolated.

### Non-goals

- No production WAV export.
- No stem export.
- No large refactor.

### Acceptance Criteria

- Research note exists.
- Recommendation is clear: implement browser WAV, postpone, or use helper renderer later.

### Manual Verification

1. Read spike notes.
2. Confirm recommendation is actionable.
3. Confirm unstable code is not wired into production app.

---

## T0033 — Loop Boundary Verification

**Goal:** Add checks to ensure generated cues are loop-friendly.  
**Dependencies:** T0012  
**Allowed areas:** `src/core/generation`, tests, docs  
**Do not touch:** audio renderer

### Requirements

- Validate events do not exceed loop length.
- Validate note endings do not unintentionally spill too far.
- Add tests for 8/16/32 bar cues.

### Non-goals

- No waveform loop checking.
- No WAV export.

### Acceptance Criteria

- Loop timing validation exists.
- Invalid event timing is caught.
- Build/test succeeds.

### Manual Verification

1. Generate 8-bar cue.
2. Confirm validation passes.
3. Test invalid event if available.
4. Run build.

---

## T0034 — Stem Export Design

**Goal:** Design future stem export behavior.  
**Dependencies:** T0032  
**Allowed areas:** `docs/`  
**Do not touch:** production export code unless scoped

### Requirements

- Define stem names:
  - full_loop
  - drums
  - bass
  - chords/pad
  - melody
  - fx
- Define browser vs desktop renderer considerations.

### Non-goals

- No actual stem rendering.
- No JUCE implementation.

### Acceptance Criteria

- Stem export design is documented.
- Future implementation path is clear.

### Manual Verification

1. Open design note.
2. Confirm names and groups are clear.
3. Confirm dependencies are listed.

---

# Phase 7 — Editing Tools

## T0035 — Piano Roll Lite Design

**Goal:** Design a simple note editor before implementation.  
**Dependencies:** T0012  
**Allowed areas:** `docs/`  
**Do not touch:** production UI unless scoped

### Requirements

- Define editor scope, supported tracks, grid resolution, and supported actions:
  - move note
  - resize note
  - delete note
  - add note

### Non-goals

- No implementation.
- No full DAW piano roll.

### Acceptance Criteria

- Piano Roll Lite design exists.
- Implementation tickets can follow it.

### Manual Verification

1. Open design.
2. Confirm scope is small.
3. Confirm full DAW behavior is explicitly avoided.

---

## T0036 — Read-Only Note Viewer

**Goal:** Show generated notes visually without editing.  
**Dependencies:** T0035  
**Allowed areas:** `src/ui`, `src/app`  
**Do not touch:** generation/playback except data mapping bugs

### Requirements

- Add simple read-only note grid for selected track.
- Show note positions and durations.
- Support melody/bass/chord tracks.

### Non-goals

- No editing.
- No drag/drop.
- No zoom/pan complexity.

### Acceptance Criteria

- User can select a track and see notes.
- Grid roughly matches cue length.
- Build succeeds.

### Manual Verification

1. Generate cue.
2. Select melody track.
3. Confirm notes appear.
4. Select bass.
5. Confirm different notes appear.
6. Run build.

---

## T0037 — Editable Melody Notes

**Goal:** Allow simple manual edits to melody notes.  
**Dependencies:** T0036  
**Allowed areas:** `src/ui`, `src/app`, model helpers  
**Do not touch:** playback internals except reload after edit

### Requirements

- Add melody note.
- Delete melody note.
- Change pitch.
- Change start/duration through simple controls or grid interaction.
- Update playback after edits.

### Non-goals

- No advanced drag/drop if too large.
- No chord editing.
- No undo/redo.

### Acceptance Criteria

- Melody notes can be edited.
- Edited notes play back.
- Save/load includes edits.
- Build succeeds.

### Manual Verification

1. Generate cue.
2. Edit melody note.
3. Press Play.
4. Confirm audible change.
5. Save/load.
6. Confirm edit persists.
7. Run build.

---

## T0038 — Editable Bass Notes

**Goal:** Allow simple manual edits to bass notes.  
**Dependencies:** T0037  
**Allowed areas:** `src/ui`, `src/app`  
**Do not touch:** core generation except shared edit helpers

### Requirements

- Reuse note editor for bass track.
- Support add/delete/change pitch/start/duration.
- Keep bass range reasonable if validation exists.

### Non-goals

- No slides/glides.
- No advanced bass generator.

### Acceptance Criteria

- Bass notes can be edited.
- Edited bass plays back.
- Save/load preserves edits.
- Build succeeds.

### Manual Verification

1. Generate cue.
2. Edit bass note.
3. Press Play.
4. Confirm audible change.
5. Save/load.
6. Confirm edit persists.
7. Run build.

---

## T0039 — Drum Grid Design

**Goal:** Design a simple step sequencer for drums.  
**Dependencies:** T0008  
**Allowed areas:** `docs/`  
**Do not touch:** production UI unless scoped

### Requirements

- Define drum lanes.
- Define 16th-note grid.
- Define add/remove/toggle behavior.
- Define velocity handling.
- Define pattern length behavior.

### Non-goals

- No implementation.
- No swing/groove yet.

### Acceptance Criteria

- Drum grid design exists.
- Implementation can follow it.

### Manual Verification

1. Open design.
2. Confirm lanes are clear.
3. Confirm grid behavior is small/simple.

---

## T0040 — Editable Drum Grid

**Goal:** Implement simple drum step sequencer editing.  
**Dependencies:** T0039  
**Allowed areas:** `src/ui`, `src/app`, model helpers  
**Do not touch:** Tone instrument factory except mapping bugfixes

### Requirements

- Show drum lanes.
- Show 16th-note steps.
- Toggle drum hits on/off.
- Update project events.
- Playback reflects edits.
- Save/load preserves edits.

### Non-goals

- No advanced velocity editor.
- No swing.
- No multi-pattern arranger.

### Acceptance Criteria

- User can toggle kick/snare/hat events.
- Playback changes.
- Save/load preserves drum edits.
- Build succeeds.

### Manual Verification

1. Generate cue.
2. Open drum grid.
3. Toggle kick off/on.
4. Press Play.
5. Confirm difference.
6. Save/load.
7. Run build.

---

# Phase 8 — Polish and Better Sounds

## T0041 — Better Instrument Presets

**Goal:** Improve default instruments while keeping Tone.js isolated.  
**Dependencies:** T0014, T0016  
**Allowed areas:** `src/playback/tone`  
**Do not touch:** core project model unless adding approved instrument IDs

### Requirements

- Improve dark pad, bass pulse, simple lead, and percussion presets.
- Keep CPU reasonable.
- Avoid external samples unless approved.

### Non-goals

- No sample library system.
- No VST/JUCE.
- No full effects chain.

### Acceptance Criteria

- Presets sound better than MVP placeholders.
- Existing projects still load.
- Build succeeds.

### Manual Verification

1. Generate Investigation and Chase cues.
2. Listen to pad/bass/drums.
3. Confirm no console errors.
4. Run build.

---

## T0042 — Basic Mixer Controls

**Goal:** Add visible mixer controls for tracks.  
**Dependencies:** T0017  
**Allowed areas:** `src/ui/tracks`, `src/app`, playback interface if needed  
**Do not touch:** generator unless mix defaults need minor update

### Requirements

- Add volume slider per track.
- Add pan slider per track if simple.
- Update playback engine.
- Update project mix settings.

### Non-goals

- No advanced mixer.
- No automation.
- No effects sends.

### Acceptance Criteria

- Track volume affects playback.
- Pan affects playback if implemented.
- Build succeeds.

### Manual Verification

1. Generate cue.
2. Play.
3. Lower melody volume.
4. Confirm melody gets quieter.
5. Run build.

---

## T0043 — Track Volume / Pan Persistence

**Goal:** Ensure mixer settings serialize and restore correctly.  
**Dependencies:** T0042, T0022  
**Allowed areas:** serialization, UI, playback integration  
**Do not touch:** generator except mix default helpers

### Requirements

- Save volume/pan to project file.
- Load volume/pan from project file.
- Apply loaded values to playback.
- Validate ranges.

### Non-goals

- No automation.
- No effects.

### Acceptance Criteria

- Saved mix settings reload.
- Invalid mix values handled safely.
- Build/test succeeds.

### Manual Verification

1. Generate cue.
2. Change volumes.
3. Save project.
4. Refresh/load.
5. Confirm values restored.
6. Run build.

---

## T0044 — Reverb Presets

**Goal:** Add simple reverb presets for mood.  
**Dependencies:** T0042  
**Allowed areas:** `src/playback/tone`, UI/model if needed  
**Do not touch:** core generation except storing selected preset

### Requirements

- Add presets:
  - off
  - small room
  - dark hall
  - wide ambient
- Apply globally or per-track using smallest safe implementation.
- Keep settings serializable if persisted.

### Non-goals

- No advanced effect routing.
- No mastering.

### Acceptance Criteria

- User can select reverb preset.
- Playback changes audibly.
- Build succeeds.

### Manual Verification

1. Generate cue.
2. Play.
3. Toggle reverb presets.
4. Confirm audible difference.
5. Run build.

---

## T0045 — Delay Presets

**Goal:** Add simple delay presets for atmosphere.  
**Dependencies:** T0044  
**Allowed areas:** `src/playback/tone`, UI/model if needed  
**Do not touch:** generation

### Requirements

- Add presets:
  - off
  - subtle echo
  - dotted delay
  - wide pulse
- Apply to suitable tracks or globally.
- Keep stable with playback cleanup.

### Non-goals

- No advanced modulation.
- No automation.

### Acceptance Criteria

- Delay presets can be toggled.
- Playback remains stable.
- Build succeeds.

### Manual Verification

1. Generate cue.
2. Play.
3. Toggle delay.
4. Confirm audible effect.
5. Stop/start playback.
6. Run build.

---

## T0046 — UI Polish Pass

**Goal:** Improve overall usability and visual clarity.  
**Dependencies:** T0023, T0042  
**Allowed areas:** UI/CSS only unless small integration fixes needed  
**Do not touch:** generation/playback architecture

### Requirements

- Improve spacing, headings, labels, disabled states, error display, and track-card readability.
- Confirm narrow browser behavior is acceptable.

### Non-goals

- No redesign into full DAW.
- No new major features.

### Acceptance Criteria

- App is easier to use.
- Existing features still work.
- Build succeeds.

### Manual Verification

1. Generate cue.
2. Play/stop.
3. Mute/solo.
4. Save/load.
5. Resize browser.
6. Run build.

---

# Phase 9 — AI Assistant Later

## T0047 — AI Command Schema

**Goal:** Define structured AI edit command schema.  
**Dependencies:** T0024, T0026  
**Allowed areas:** `src/core/ai` or docs, model types  
**Do not touch:** external API calls

### Requirements

Define command types:

- `regenerateTrack`
- `updateCueSettings`
- `createVariation`
- `changeIntensity`
- `makeDarker`
- `makeMoreUrgent`

Commands must be structured JSON-compatible data.

### Non-goals

- No actual AI provider.
- No prompt UI.
- No unvalidated mutation.

### Acceptance Criteria

- Command schema exists.
- Example commands exist.
- Validation strategy documented.
- Build succeeds if code added.

### Manual Verification

1. Inspect schema.
2. Confirm commands are structured.
3. Confirm they can be validated before applying.
4. Run build if code added.

---

## T0048 — Prompt-to-Structured-Edit Prototype

**Goal:** Prototype converting plain-language request to structured edit.  
**Dependencies:** T0047  
**Allowed areas:** isolated prototype area or docs  
**Do not touch:** production mutation unless approved

### Requirements

- Add simple prompt prototype.
- Use rules or mocked output if no AI provider is configured.
- Convert phrases like “make this darker” into structured command.
- Display command before applying.

### Non-goals

- No automatic cloud calls.
- No direct unreviewed mutation.
- No full chat assistant.

### Acceptance Criteria

- User can enter simple phrase.
- App produces structured proposed edit.
- Build succeeds.

### Manual Verification

1. Enter “make this darker.”
2. Confirm structured edit appears.
3. Enter “make this more intense.”
4. Confirm intensity command appears.
5. Run build.

---

## T0049 — Regenerate From AI Instruction

**Goal:** Apply validated structured AI commands to current project.  
**Dependencies:** T0048  
**Allowed areas:** `src/core/ai`, `src/core/generation`, `src/app`  
**Do not touch:** external AI providers unless separately scoped

### Requirements

- Validate command.
- Apply command to project/settings.
- Reuse existing generation functions.
- Respect locked tracks.
- Show result in UI.

### Non-goals

- No cloud AI.
- No free-form unvalidated JSON.
- No audio generation.

### Acceptance Criteria

- Structured command can regenerate melody.
- Structured command can change intensity.
- Locked tracks are respected.
- Build/test succeeds.

### Manual Verification

1. Generate cue.
2. Submit command to make more intense.
3. Apply command.
4. Confirm project changes.
5. Lock drums and repeat.
6. Run build.

---

## T0050 — AI Safety / Validation Layer

**Goal:** Harden AI-assisted edits before any real provider integration.  
**Dependencies:** T0049  
**Allowed areas:** `src/core/ai`, validation, docs  
**Do not touch:** provider calls unless separately scoped

### Requirements

- Reject unknown operations.
- Reject malformed values.
- Clamp BPM/intensity/bars to supported ranges.
- Require review before destructive changes.
- Log command result in dev/debug summary if helpful.

### Non-goals

- No legal/copyright classifier.
- No cloud provider integration.
- No voice/vocal generation.

### Acceptance Criteria

- Invalid commands are rejected.
- Valid commands apply safely.
- Malformed command does not crash app.
- Build/test succeeds.

### Manual Verification

1. Try invalid operation.
2. Confirm rejection.
3. Try invalid BPM.
4. Confirm clamp or error.
5. Try valid command.
6. Confirm apply works.
7. Run build.

---

# First Codex Prompt — T0001

```text
We are starting the GameCue project from the design documents. Implement T0001 only.

Ticket:
T0001 — Project Skeleton

Goal:
Create the initial Vite + React + TypeScript GameCue app skeleton.

Requirements:
- Create a Vite + React + TypeScript project.
- Enable TypeScript strict mode.
- Create the initial folder structure:
  - src/app
  - src/core/model
  - src/core/theory
  - src/core/templates
  - src/core/generation
  - src/core/serialization
  - src/playback
  - src/playback/tone
  - src/ui/controls
  - src/ui/tracks
  - src/ui/project
  - src/ui/shared
- Create a simple App.tsx that displays:
  - GameCue
  - Generate loopable game music cues
  - Placeholder sections for Cue Controls, Track List, Transport, and Save/Load
- Add README run instructions.
- Ensure npm run dev works.
- Ensure npm run build works.

Non-goals:
- Do not add Tone.js yet.
- Do not implement playback.
- Do not implement generation.
- Do not implement save/load.
- Do not implement project schema.
- Do not implement future tickets.

Architecture rules:
- Keep the app simple.
- Do not introduce state management libraries.
- Do not add unnecessary dependencies.
- Do not add audio code.

After implementation, provide:
- Files changed
- Commands run
- Build result
- Manual verification steps
```

---

# Ticket Status

| Ticket | Status |
|---|---|
| T0000A | Drafted |
| T0000B | Drafted |
| T0000C | Drafted |
| T0000D | Not started |
| T0000E | Not started |
| T0001–T0050 | Planned |

---

# Completion Note Template

When a ticket is completed, append or update status using:

```text
Ticket:
Date:
Branch:
Commit:
Files changed:
Commands run:
Build/test result:
Manual verification result:
Follow-up tickets created:
Notes:
```
