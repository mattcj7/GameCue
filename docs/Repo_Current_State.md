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
Project status: App skeleton, core project model, and basic app layout implemented
Last completed ticket: T0003 — Basic App Layout
Current ticket: None
Next recommended ticket: T0004 — Cue Controls UI
Current branch: Not created yet
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
AGENTS.md
```

## 2.3 Current Implementation Status

```text
Source code status: T0003 basic app layout exists
Vite project created: Yes
React app created: Yes
Tone.js installed: No
Core model created: Yes
Basic app layout created: Yes
Generation system created: No
Playback system created: No
Save/load created: No
Export system created: No
Tests created: No
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
      templates/
      generation/
      serialization/
    playback/
      tone/
    ui/
      controls/
      tracks/
      project/
      shared/
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

---

# 6. Current Ticket

```text
Ticket: None
Branch: None
Status: Complete for T0003
```

## Active Ticket Notes

```text
T0003 was completed without introducing Tone.js, generation logic, playback logic, save/load behavior, export logic, or real control behavior.
```

---

# 7. Build and Test Status

Update after each ticket.

## 7.1 Last Commands Run

```text
- local TypeScript compiler build via node_modules/.bin/tsc.cmd -b
- local Vite production build via node_modules/.bin/vite.cmd build
```

## 7.2 Last Build Result

```text
Pass
```

## 7.3 Last Test Result

```text
No tests yet.
```

## 7.4 Last Manual Verification Result

```text
Build verification passed. Browser layout verification still recommended for a human pass.
```

---

# 8. Known Issues Summary

Current known issues:

```text
No functional implementation issues identified in T0003.
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
Status: Clean
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

# 10. Next Recommended Action

```text
Start T0004 — Cue Controls UI.
```

Recommended branch:

```text
gamecue/t0004-cue-controls-ui
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
