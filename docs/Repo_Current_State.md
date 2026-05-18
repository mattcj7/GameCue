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
Project status: App skeleton, core project model, basic app layout, cue controls UI, music theory helpers, cue templates, chord progression generation, drum pattern generation, bassline generation, chord/pad generation, melody/motif generation, and core test runner implemented
Last completed ticket: T0011 — Melody / Motif Generator
Current ticket: None
Next recommended ticket: T0012 — Full Project Generator
Current branch: gamecue/t0011-melody-motif-generator
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
Source code status: Deterministic core melody/motif generation is now implemented alongside the existing chord, drum, bass, and chord/pad generators, using cue-aware density, in-scale note selection, strong-beat chord-tone preference, intentional rests, and focused Vitest coverage
Vite project created: Yes
React app created: Yes
Tone.js installed: No
Core model created: Yes
Basic app layout created: Yes
Cue controls UI created: Yes
Music theory helpers created: Yes
Cue template system created: Yes
Generation system created: Partially
Playback system created: No
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
      templates.test.ts
      theory.test.ts
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
| Docs — Windows Codex Verification Guidance | Documentation | Not created | N/A | Added standing Windows/Codex build verification order and raw Node ESM verification cautions to workflow docs and starter skills |
| T0003A — Document Starter Codex Skills | Documentation | docs/document-starter-skills | N/A | Documents the starter `.codex/skills` files that were added during the T0003 merge |

---

# 6. Current Ticket

```text
Ticket: None
Branch: gamecue/t0011-melody-motif-generator
Status: Complete for T0011 implementation
```

## Active Ticket Notes

```text
This branch implements T0011 in `src/core/generation` and `tests/core` only, adding melody/motif event generation without changing UI, playback, save/load, export, or the existing chord, drum, bassline, and chord/pad generator behavior.
```

---

# 7. Build and Test Status

Update after each ticket.

## 7.1 Last Commands Run

```text
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
Build and test verification passed for T0011 using `C:\Program Files\nodejs\npm.cmd`. Vitest now covers melody generation across cue types, in-key note selection, strong-beat chord-tone anchoring, timing bounds, deterministic sorting, sparse Investigation output, more active Chase/Menu motifs, and very low-density Dark Ambient behavior.
```

---

# 8. Known Issues Summary

Current known issues:

```text
No functional implementation issues identified in T0011 from build and test verification.
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
Tone.js installed: No
Status: Folder skeleton only
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
Start T0012 — Full Project Generator.
```

Recommended branch:

```text
gamecue/t0012-full-project-generator
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

---

# 13. Rule

If this file disagrees with the repo, the repo wins.

Update this file to match reality before creating new prompts.
