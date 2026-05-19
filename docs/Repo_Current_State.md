# GameCue Repo Current State

**Project:** GameCue  
**Version:** 0.1  
**Status:** Living Repo Sync Document  
**Purpose:** Keep ChatGPT, Codex, and the user aligned on what actually exists in the repo.

---

# 1. Why This File Exists

This file should be updated after each Codex ticket so future prompts are grounded in the current repo state.

Because ChatGPT may not be able to see the live repo directly, this document acts as the shared memory of:

- Current branch
- Completed tickets
- Current folder structure
- Installed dependencies
- Scripts
- Build/test status
- Known issues
- Next recommended ticket

Update this file after each meaningful repo change.

---

# 2. Current Snapshot

## 2.1 Project Status

```text
Project status: App skeleton, core project model, basic app layout, cue controls UI, music theory helpers, cue templates, chord progression generation, drum pattern generation, bassline generation, chord/pad generation, melody/motif generation, full project generation, playback engine interface, Tone.js instrument factory, Tone.js scheduler, play/stop/loop transport controls, track mute/solo playback controls, playback cleanup/dispose safety hardening, and core test runner implemented
Last completed ticket: T0018 — Playback Cleanup and Dispose Safety
Current ticket: None
Next recommended ticket: T0019 — Project Serializer
Current branch: gamecue/t0018-playback-cleanup-dispose-safety
Repo initialized: Yes
```

## 2.2 Current Planning Docs

Expected docs prepared before T0001:

```text
docs/GameCue_Full_Design_Document.md
docs/GameCue_MVP_Technical_Design.md
docs/Tickets.md
docs/Codex_Prompt_Playbook.md
docs/GameCue_Starter_Skills_Reference.md
docs/Manual_Verification_Guide.md
docs/Repo_Current_State.md
docs/Design_Update_Companion.md
docs/Codex_Ticket_Handoff_Template.md
docs/Known_Issues_And_Followups.md
docs/Prompt_Context_Pack.md
docs/Naming_And_Code_Conventions.md
docs/UI_Style_Guide.md
AGENTS.md
.codex/skills/
```

## 2.3 Current Implementation Status

```text
Source code status: Deterministic full-project generation is now implemented by composing the existing chord, drum, bass, chord/pad, and melody generators into a complete JSON-compatible `GameCueProject`, with stable project metadata, shared harmonic alignment across tonal tracks, UI Generate Cue wiring, generated track/event summaries, an engine-agnostic `PlaybackEngine` contract in `src/playback`, an isolated Tone.js playback adapter in `src/playback/tone`, a `TonePlaybackEngine` that maps project events into Tone transport scheduling with loop/BPM control, reload-safe cleanup, partial-load rollback, idempotent disposal guards, a playback-active scheduler gate that suppresses stray post-stop/post-pause callbacks, a per-load token that binds scheduled callbacks to the currently loaded project session, and preserved mute/solo overrides across reloads, and app-level transport wiring that loads the latest generated project on Play, stops and resets playback, preserves loop state, surfaces simple playback status/errors, keeps per-track mute/solo UI state synchronized with playback before and during transport, and suppresses unhandled dispose rejections during app unmount
Vite project created: Yes
React app created: Yes
Tone.js installed: Yes
Core model created: Yes
Basic app layout created: Yes
Cue controls UI created: Yes
Music theory helpers created: Yes
Cue template system created: Yes
Generation system created: Yes
Playback system created: Interface, Tone instrument factory, Tone.js scheduler adapter, and transport control wiring
Save/load created: No
Export system created: No
Tests created: Yes
```

---

# 3. Local Environment

Update this section once implementation begins.

## 3.1 Runtime Versions

```text
Node version: 24.14.0
npm version: 11.6.4
OS: Windows
Editor: Codex desktop
```

Suggested commands:

```bash
node --version
npm --version
```

## 3.2 Package Scripts

Current expected scripts after T0001:

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview"
}
```

Actual scripts:

```text
dev: vite
build: tsc -b && vite build
test: vitest run
test:watch: vitest
preview: vite preview
```

## 3.3 Dependencies

Expected after T0001:

```text
react
react-dom
vite
typescript
@vitejs/plugin-react
```

Expected later:

```text
tone
```

Actual dependencies:

```text
react
react-dom
tone
vite
typescript
@vitejs/plugin-react
vitest
@types/node
@types/react
@types/react-dom
```

---

# 4. Folder Structure

## 4.1 Expected Initial Structure After T0001

```text
gamecue/
  AGENTS.md
  README.md
  package.json
  tsconfig.json
  vite.config.ts
  docs/
    GameCue_Full_Design_Document.md
    GameCue_MVP_Technical_Design.md
    Tickets.md
    Codex_Prompt_Playbook.md
    GameCue_Starter_Skills_Reference.md
    Manual_Verification_Guide.md
    Repo_Current_State.md
    Design_Update_Companion.md
    Codex_Ticket_Handoff_Template.md
    Known_Issues_And_Followups.md
    Prompt_Context_Pack.md
  src/
    app/
      App.tsx
      main.tsx
      styles.css
    core/
      model/
        CueSettings.ts
        GameCueProject.ts
        MixSettings.ts
        NoteEvent.ts
        Section.ts
        Track.ts
        createExampleProject.ts
        index.ts
        projectTypes.ts
      theory/
        chords.ts
        index.ts
        notes.ts
        progressions.ts
        scales.ts
      templates/
      generation/
      serialization/
    playback/
      PlaybackEngine.ts
      index.ts
      tone/
    ui/
      controls/
        CueControls.tsx
        TransportControls.tsx
      tracks/
        TrackList.tsx
      project/
        ProjectSummary.tsx
        SaveLoadPanel.tsx
      shared/
```

## 4.2 Actual Current Structure

Update after T0001.

```text
gamecue/
  .codex/
    skills/
      gamecue-audio-playback/
        SKILL.md
      gamecue-core-generation/
        SKILL.md
      gamecue-manual-verification/
        SKILL.md
      gamecue-save-load/
        SKILL.md
      gamecue-ticket-runner/
        SKILL.md
  AGENTS.md
  README.md
  index.html
  package.json
  package-lock.json
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  vite.config.ts
  docs/
  src/
    app/
      App.tsx
      main.tsx
      styles.css
    core/
      model/
        CueSettings.ts
        GameCueProject.ts
        MixSettings.ts
        NoteEvent.ts
        Section.ts
        Track.ts
        createExampleProject.ts
        index.ts
        projectTypes.ts
      theory/
        .gitkeep
        chords.ts
        index.ts
        notes.ts
        progressions.ts
        scales.ts
      templates/
        .gitkeep
        CueTemplate.ts
        cueTemplates.ts
        index.ts
        templateLookup.ts
      generation/
        .gitkeep
        basslines.ts
        chordPads.ts
        chordProgressions.ts
        drumPatterns.ts
        index.ts
      serialization/
    playback/
      tone/
    ui/
      controls/
      tracks/
      project/
      shared/
  tests/
    core/
      basslines.test.ts
      chordPads.test.ts
      chordProgressions.test.ts
      drumPatterns.test.ts
      melodies.test.ts
      projects.test.ts
      templates.test.ts
      theory.test.ts
    playback/
      PlaybackEngine.test.ts
```

---

# 5. Completed Tickets

| Ticket | Status | Branch | Commit | Notes |
|---|---|---|---|---|
| T0000A — Full Design Document | Drafted | N/A | N/A | Created in planning chat |
| T0000B — MVP Technical Design | Drafted | N/A | N/A | Created in planning chat |
| T0000C — Tickets.md | Drafted | N/A | N/A | Created in planning chat |
| T0000D — Codex Prompt Playbook | Drafted | N/A | N/A | Created in planning chat |
| T0000E — AGENTS.md | Drafted | N/A | N/A | Created in planning chat |
| T0001 — Project Skeleton | Implemented | Not created | N/A | App shell, folder skeleton, strict TypeScript config, README update |
| T0002 — Core Project Model | Implemented | Not created | N/A | Added serializable project model types, enum-like string unions, and `createExampleProject()` |
| T0003 — Basic App Layout | Implemented | Not created | N/A | Added dark responsive panel layout with placeholder UI components for project summary, cue controls, tracks, transport, and save/load |
| T0004 — Cue Controls UI | Implemented | Not created | N/A | Replaced disabled cue-setting placeholders with controlled inputs stored in app state and surfaced live in the project summary |
| T0005 — Music Theory Helpers | Implemented | Not created | N/A | Added sharp-based note normalization/transposition, major and natural minor scale helpers, triad helpers, and simple roman-numeral progression resolution |
| T0006 — Cue Template System | Implemented | Not created | N/A | Added seven engine-agnostic cue templates, typed generation profiles/track presets, cue-type and id lookup helpers, and computed default cue settings |
| T0007 — Chord Progression Generator | Implemented | Not created | N/A | Added deterministic chord progression generation from cue settings and template profiles, with structured chord output fitted to cue bar counts |
| T0007A — Add Core Test Runner | Implemented | Not created | N/A | Added Vitest, `test` and `test:watch` scripts, and focused unit tests for theory helpers, cue templates, and chord progression generation |
| T0008 — Drum Pattern Generator | Implemented | Not created | N/A | Added deterministic beat-based drum event generation for five drum lanes with template-aware density differences and focused Vitest coverage |
| T0009 — Bassline Generator | Implemented | Not created | N/A | Added deterministic beat-based bass note generation from chord roots with cue-aware rhythm profiles, low-register pitch mapping, and focused Vitest coverage |
| T0010 — Chord / Pad Generator | Implemented | gamecue/t0010a-fix-chord-pad-voicings | N/A | Reapplied the original chord/pad generator with a wrapped-voicing fix so chord tones stay stacked above the root, with focused tests for octave-aware voicing |
| T0011 — Melody / Motif Generator | Implemented | gamecue/t0011-melody-motif-generator | N/A | Added deterministic beat-based melody/motif generation driven by cue type, intensity, scale notes, and active chords, with focused Vitest coverage for in-key notes, strong-beat chord tones, timing bounds, and density differences |
| T0012 — Full Project Generator | Implemented | gamecue/t0012-full-project-generator | N/A | Added deterministic `generateProject(settings)` composition, stable project metadata and mix defaults, Generate Cue wiring in app state, generated track/event summaries in the UI, and focused Vitest coverage for project shape, timing bounds, determinism, and serialization |
| T0013 — PlaybackEngine Interface | Implemented | gamecue/t0012-full-project-generator | N/A | Added an engine-agnostic `PlaybackEngine` contract that depends only on project-model types, a playback barrel export, and focused tests proving a mock engine can load generated projects without any Tone.js dependency |
| T0014 — Tone.js Instrument Factory | Implemented | gamecue/t0014-tonejs-instrument-factory | N/A | Added isolated Tone.js instrument handles under `src/playback/tone`, installed `tone`, supported the initial drum/bass/pad/lead instrument ids, and added focused non-audio tests for supported ids, unsupported-id errors, disposal behavior, and Tone import isolation |
| T0015 — Tone.js Scheduler | Implemented | gamecue/t0015-tonejs-scheduler | N/A | Added `TonePlaybackEngine` scheduling that maps generated tracks into Tone transport events with loop/BPM control, generated-instrument fallbacks, reload-safe cleanup, and focused mocked playback tests |
| T0016 — Play / Stop / Loop Controls | Implemented | gamecue/t0016-play-stop-loop-controls | N/A | Wired `App.tsx` transport state into a long-lived `TonePlaybackEngine`, loads the latest generated project on Play, stops and resets playback on Stop, syncs loop toggles through `setLoop(...)`, and exposes simple transport status/error messaging in the UI |
| T0017 — Track Mute / Solo | Implemented | gamecue/t0016-play-stop-loop-controls | N/A | Added app-owned per-track mute/solo state, active track-card controls and status chips, reapplies mute/solo state after project load, and updates the playback engine immediately so toggles affect playback without regeneration |
| T0018 — Playback Cleanup and Dispose Safety | Implemented | gamecue/t0018-playback-cleanup-dispose-safety | N/A | Hardened `TonePlaybackEngine` reload/dispose cleanup, rolls back partial loads safely, preserves track mute/solo overrides across reloads, keeps repeated stop/pause/dispose calls safe, and suppresses unhandled dispose rejections during app unmount |
| Docs — Windows Codex Verification Guidance | Documentation | Not created | N/A | Added standing Windows/Codex build verification order and raw Node ESM verification cautions to workflow docs and starter skills |
| T0003A — Document Starter Codex Skills | Documentation | docs/document-starter-skills | N/A | Documents the starter `.codex/skills` files that were added during the T0003 merge |

---

# 6. Current Ticket

```text
Ticket: None
Branch: gamecue/t0018-playback-cleanup-dispose-safety
Status: Complete for T0018 implementation
```

## Active Ticket Notes

```text
This branch now includes T0018 across `src/app`, `src/playback/tone`, `tests/playback`, and `docs/Repo_Current_State.md`, hardening reload/dispose cleanup, clearing scheduled transport callbacks on reload/dispose, rolling back partial `loadProject(...)` failures safely, preserving mute/solo overrides across reloads, keeping repeated stop/pause/dispose calls safe, and suppressing unhandled dispose rejections during app unmount without changing core generation, save/load, export, or project-model data.
```

---

# 7. Build and Test Status

Update after each ticket.

## 7.1 Last Commands Run

```text
- rg -n -F 'from "tone"' src tests
- rg -n -F "from 'tone'" src tests
- rg -n "Tone\." src tests
- npm.cmd run build
- & 'C:\Program Files\nodejs\npm.cmd' run build
- & 'C:\Program Files\nodejs\npm.cmd' test
```

## 7.2 Last Build Result

```text
Pass
```

## 7.3 Last Test Result

```text
Pass
```

## 7.4 Last Manual Verification Result

```text
Build and test verification passed for T0018 using `C:\Program Files\nodejs\npm.cmd` after `npm.cmd` was unavailable on PATH in this shell. Tone import isolation search still shows raw Tone imports only under `src/playback/tone`, plus the existing source-string assertion in `tests/playback/toneInstruments.test.ts`. Manual browser/audio verification is still required because this environment did not perform interactive browser clicks or Web Audio playback.
```

---

# 8. Known Issues Summary

Current known issues:

```text
No functional implementation issues identified in T0018 from build and test verification. Vite still reports existing React plugin deprecation warnings during `npm test`, but the tests pass. Human audio verification is still recommended because this environment did not exercise interactive regenerate/play/stop cycles or audible Web Audio playback.
```

See:

```text
docs/Known_Issues_And_Followups.md
```

for detailed tracking once implementation begins.

---

# 9. Architecture Status

## 9.1 Core Boundary

```text
src/core exists: Yes
Tone.js imported in src/core: No
Status: Clean. `src/core/theory`, `src/core/templates`, and `src/core/generation` contain pure helper/data modules with no Tone.js, React, DOM, or browser audio imports.
```

## 9.2 Playback Boundary

```text
src/playback exists: Yes
Tone.js installed: Yes
Status: Engine-agnostic `PlaybackEngine` interface remains isolated from Tone.js, and `src/playback/tone` now contains the Tone instrument factory, scheduler helpers, and `TonePlaybackEngine`; the adapter now rolls back partial reload failures, clears tracked transport callbacks on reload/dispose, gates scheduled callbacks behind active playback state plus the currently loaded project token, keeps repeated cleanup idempotent, preserves loop state and track mute/solo overrides across reloads, and `src/app/App.tsx` still owns a single long-lived engine instance without importing raw Tone.js in UI code
```

## 9.3 Project File Format

```text
.gamecue.json schema implemented: Partially
Status: Core TypeScript project model is implemented in src/core/model; serialization and save/load behavior are not implemented yet
```

---

## 9.4 Codex Skills Status

```text
.codex/skills exists: Yes
Starter skills documented: Yes
Status: Accepted as intentional project workflow support
```

Current skills:

```text
gamecue-ticket-runner
gamecue-core-generation
gamecue-audio-playback
gamecue-save-load
gamecue-manual-verification
```

Notes:

```text
These skills were added during the T0003 merge. They are accepted as useful starter project tooling rather than reverted. Future skills should be added through explicit docs/workflow tickets.
```

---

# 10. Next Recommended Action

```text
Start T0019 — Project Serializer.
```

Recommended branch:

```text
gamecue/t0019-project-serializer
```

Recommended prompt source:

```text
docs/Codex_Prompt_Playbook.md
docs/Tickets.md
docs/Codex_Ticket_Handoff_Template.md
```

---

# 11. Update Template After Each Ticket

Copy/paste this section when updating the file.

```text
Update Date:
Ticket completed:
Branch:
Commit:
Files changed:
Commands run:
Build result:
Test result:
Manual verification result:
Known issues added:
Docs updated:
Next recommended ticket:
Notes:
```

---

# 12. Example Update

```text
Update Date:
2026-05-15

Ticket completed:
T0001 — Project Skeleton

Branch:
gamecue/t0001-project-skeleton

Commit:
abc123

Files changed:
- package.json
- vite.config.ts
- src/app/App.tsx
- src/app/main.tsx
- src/app/styles.css
- README.md

Commands run:
- npm install
- npm run dev
- npm run build

Build result:
Pass

Test result:
No tests yet

Manual verification result:
Pass

Known issues added:
None

Docs updated:
README.md

Next recommended ticket:
T0002 — Core Project Model

Notes:
App shell displays expected placeholder sections.
```

## Latest Update

```text
Update Date:
2026-05-18

Ticket completed:
T0018 — Playback Cleanup and Dispose Safety

Branch:
gamecue/t0018-playback-cleanup-dispose-safety

Commit:
Not created yet

Files changed:
- src/app/App.tsx
- src/playback/tone/toneScheduler.ts
- src/playback/tone/TonePlaybackEngine.ts
- tests/playback/TonePlaybackEngine.test.ts
- docs/Repo_Current_State.md

Commands run:
- npm.cmd run build
- rg -n -F 'from "tone"' src tests
- rg -n -F "from 'tone'" src tests
- rg -n "Tone\." src tests
- & 'C:\Program Files\nodejs\npm.cmd' run build
- & 'C:\Program Files\nodejs\npm.cmd' test

Build result:
Pass

Test result:
Pass

Manual verification result:
Partial pass. Build and tests passed, and the Tone import isolation search still shows raw Tone imports only under `src/playback/tone` plus the existing source-string assertion in `tests/playback/toneInstruments.test.ts`. Audible browser playback verification for regenerate/play/stop, loop, and mute/solo regression behavior still requires one manual browser/audio pass because this environment did not perform interactive clicks or Web Audio playback.

Known issues added:
- Existing Vite React plugin deprecation warnings still appear during `npm test`.
- Human audio confirmation is still required for this ticket.

Docs updated:
- docs/Repo_Current_State.md

Next recommended ticket:
T0019 — Project Serializer

Notes:
`toneScheduler.ts` and `TonePlaybackEngine.ts` now gate scheduled callbacks behind explicit playback-active state and the current loaded-project token so stale callbacks from a prior load cannot fire after reload, even when the new project reuses the same `track_*` IDs. The engine still preserves track mute/solo overrides across reloads, rolls back partial `loadProject(...)` failures by clearing scheduled callbacks and disposing any already-created instrument handles, and marks explicit disposal before cleanup so repeated `dispose()` calls are harmless and later public method calls throw clear disposed-engine errors. `App.tsx` still suppresses unhandled promise rejections if unmount-time disposal fails.
```

---

# 13. Rule

If this file disagrees with the repo, the repo wins.

Update this file to match reality before creating new prompts.
