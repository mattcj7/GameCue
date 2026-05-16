# GameCue Project Skeleton Layout

**Project:** GameCue  
**Version:** 0.1  
**Purpose:** Define the initial repo/file structure for `T0001 — Project Skeleton` before implementation begins.

---

# 1. Skeleton Goal

The first implementation ticket should create a clean **Vite + React + TypeScript** project shell for GameCue.

T0001 should establish:

- Basic repo structure
- Basic app shell
- Placeholder UI regions
- Documentation placement
- TypeScript strict mode
- Build/dev commands

T0001 should **not** implement:

- Tone.js
- Audio playback
- Music generation
- Save/load
- Project schema
- Export
- AI features
- Editing tools

---

# 2. Intended Root Structure

```text
gamecue/
  AGENTS.md
  README.md
  package.json
  package-lock.json
  index.html
  vite.config.ts
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json

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

  public/
    vite.svg

  src/
    app/
      App.tsx
      main.tsx
      styles.css

    core/
      model/
        .gitkeep
      theory/
        .gitkeep
      templates/
        .gitkeep
      generation/
        .gitkeep
      serialization/
        .gitkeep

    playback/
      .gitkeep
      tone/
        .gitkeep

    ui/
      controls/
        .gitkeep
      tracks/
        .gitkeep
      project/
        .gitkeep
      shared/
        .gitkeep
```

---

# 3. Folder Purpose

## 3.1 Root

```text
gamecue/
```

The repo root contains package files, TypeScript config, Vite config, README, and top-level agent instructions.

Expected root files:

| File | Purpose |
|---|---|
| `AGENTS.md` | Standing instructions for Codex/agents |
| `README.md` | Setup, run, build, and project overview |
| `package.json` | Scripts and dependencies |
| `package-lock.json` | Locked npm dependency versions |
| `index.html` | Vite HTML entry |
| `vite.config.ts` | Vite configuration |
| `tsconfig.json` | TypeScript project config |
| `tsconfig.app.json` | App-specific TypeScript config |
| `tsconfig.node.json` | Node/tooling TypeScript config |

---

## 3.2 Docs

```text
docs/
```

The `docs` folder stores project planning, ticketing, prompt, and verification references.

Expected docs:

| File | Purpose |
|---|---|
| `GameCue_Full_Design_Document.md` | Master product and architecture reference |
| `GameCue_MVP_Technical_Design.md` | MVP-specific technical design |
| `Tickets.md` | Ticket roadmap from T0000A–T0050 |
| `Codex_Prompt_Playbook.md` | Reusable Codex prompt templates |
| `GameCue_Starter_Skills_Reference.md` | Planned Codex skill reference |
| `Manual_Verification_Guide.md` | Manual test/verification process |
| `Repo_Current_State.md` | Living repo sync document |
| `Design_Update_Companion.md` | Approved design changes and decision log |
| `Codex_Ticket_Handoff_Template.md` | One-ticket Codex handoff template |
| `Known_Issues_And_Followups.md` | Bugs, limitations, and deferred items |
| `Prompt_Context_Pack.md` | Short prompt reset/context blocks |

---

## 3.3 Public

```text
public/
```

Static public assets served by Vite.

Initial contents can remain the default Vite assets.

Later this may contain:

- Icons
- Placeholder images
- Static demo files
- Sample project files

Do not add audio samples during T0001.

---

# 4. Source Layout

## 4.1 App Layer

```text
src/app/
  App.tsx
  main.tsx
  styles.css
```

The app layer owns the top-level React entry and app shell.

### `main.tsx`

Purpose:

- Imports React.
- Imports ReactDOM.
- Mounts `<App />`.
- Imports global styles.

Expected shape:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### `App.tsx`

Purpose:

- Displays first GameCue app shell.
- Shows placeholder sections.
- Does not implement real app logic yet.

Expected visible content:

```text
GameCue
Generate loopable game music cues

Cue Controls
Track List
Transport
Save / Load
```

Recommended simple structure:

```tsx
function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>GameCue</h1>
        <p>Generate loopable game music cues.</p>
      </header>

      <section className="workspace">
        <aside className="panel">
          <h2>Cue Controls</h2>
          <p>Controls will be added in T0004.</p>
        </aside>

        <section className="panel">
          <h2>Track List</h2>
          <p>Generated tracks will appear here.</p>
        </section>
      </section>

      <section className="panel">
        <h2>Transport</h2>
        <p>Playback controls will be added later.</p>
      </section>

      <section className="panel">
        <h2>Save / Load</h2>
        <p>Project file actions will be added later.</p>
      </section>
    </main>
  );
}

export default App;
```

### `styles.css`

Purpose:

- Basic layout only.
- Keep styling simple.
- Avoid full UI design/polish pass.

T0001 styling should be basic and readable.

---

## 4.2 Core Layer

```text
src/core/
  model/
  theory/
  templates/
  generation/
  serialization/
```

The core layer must remain engine-agnostic.

Core should **not** import:

```ts
import * as Tone from "tone";
```

Core should also avoid:

- React components
- Browser audio APIs
- DOM references
- UI state
- Runtime audio objects

### `src/core/model/`

Future purpose:

- `GameCueProject`
- `CueSettings`
- `Track`
- `Section`
- `NoteEvent`
- `MixSettings`

T0001 status:

```text
Folder only.
No model implementation yet.
```

### `src/core/theory/`

Future purpose:

- Notes
- Scales
- Chords
- Scale degrees
- Rhythm helpers

T0001 status:

```text
Folder only.
No theory implementation yet.
```

### `src/core/templates/`

Future purpose:

- Investigation template
- Suspense template
- Chase template
- Menu template
- Emotional template
- Dark ambient template

T0001 status:

```text
Folder only.
No template implementation yet.
```

### `src/core/generation/`

Future purpose:

- Project generator
- Drum generator
- Bassline generator
- Chord/pad generator
- Melody/motif generator
- Variation generator

T0001 status:

```text
Folder only.
No generation implementation yet.
```

### `src/core/serialization/`

Future purpose:

- Project serializer
- Project validator
- Schema version helpers

T0001 status:

```text
Folder only.
No save/load implementation yet.
```

---

## 4.3 Playback Layer

```text
src/playback/
  tone/
```

The playback layer will eventually contain the engine abstraction and Tone.js adapter.

### `src/playback/`

Future purpose:

- `PlaybackEngine.ts`
- Playback interfaces
- Engine-agnostic playback contracts

T0001 status:

```text
Folder only.
No playback interface yet unless explicitly moved from T0013.
```

### `src/playback/tone/`

Future purpose:

- `TonePlaybackEngine.ts`
- `toneInstrumentFactory.ts`
- `toneScheduler.ts`

T0001 status:

```text
Folder only.
Do not install or import Tone.js yet.
```

---

## 4.4 UI Layer

```text
src/ui/
  controls/
  tracks/
  project/
  shared/
```

The UI layer contains reusable React components.

T0001 can create folders only. Actual UI components come in later tickets.

### `src/ui/controls/`

Future purpose:

- `CueControls.tsx`
- `TransportControls.tsx`
- Intensity controls
- Key/mode selectors

T0001 status:

```text
Folder only.
```

### `src/ui/tracks/`

Future purpose:

- `TrackList.tsx`
- `TrackCard.tsx`
- Mute/solo controls
- Regenerate buttons

T0001 status:

```text
Folder only.
```

### `src/ui/project/`

Future purpose:

- `SaveLoadPanel.tsx`
- Export panel
- Project summary

T0001 status:

```text
Folder only.
```

### `src/ui/shared/`

Future purpose:

- Reusable button
- Select
- Panel
- Error message
- Layout helpers

T0001 status:

```text
Folder only.
```

---

# 5. `.gitkeep` Use

Empty folders may not be committed by Git.

To preserve the intended skeleton, T0001 may include `.gitkeep` files in empty folders:

```text
src/core/model/.gitkeep
src/core/theory/.gitkeep
src/core/templates/.gitkeep
src/core/generation/.gitkeep
src/core/serialization/.gitkeep
src/playback/.gitkeep
src/playback/tone/.gitkeep
src/ui/controls/.gitkeep
src/ui/tracks/.gitkeep
src/ui/project/.gitkeep
src/ui/shared/.gitkeep
```

These can be deleted later when real files are added.

---

# 6. Expected `package.json` Scripts

Initial scripts should be Vite-standard.

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

No test script is required in T0001 unless Vite setup provides one.

Testing can be added later.

---

# 7. Expected Initial Dependencies

T0001 dependencies should be limited to basic Vite/React/TypeScript setup.

Expected runtime dependencies:

```text
react
react-dom
```

Expected dev dependencies:

```text
@types/react
@types/react-dom
@vitejs/plugin-react
typescript
vite
```

Do **not** add during T0001:

```text
tone
midi libraries
audio rendering libraries
state management libraries
UI component libraries
testing frameworks unless intentionally added
```

---

# 8. T0001 README Contents

The initial README should include:

```text
# GameCue

GameCue is a lightweight tool for generating loopable game music cues.

## Current Status

Project skeleton only.

## Setup

npm install

## Run

npm run dev

## Build

npm run build

## MVP Direction

React + TypeScript + Vite first.
Tone.js playback comes later.
Core project data remains engine-agnostic.
.gamecue.json will be the source of truth.

## Current Non-Goals

No playback yet.
No music generation yet.
No save/load yet.
No export yet.
```

---

# 9. T0001 Manual Verification

After Codex implements T0001, verify:

```text
1. Run npm install.
2. Run npm run dev.
3. Open the local Vite URL.
4. Confirm GameCue heading appears.
5. Confirm subtitle appears.
6. Confirm placeholder sections appear:
   - Cue Controls
   - Track List
   - Transport
   - Save / Load
7. Confirm no fatal browser console errors.
8. Stop dev server.
9. Run npm run build.
10. Confirm build succeeds.
```

Expected result:

```text
The app shell loads and builds. No real music features exist yet.
```

---

# 10. T0001 Scope Guard

Codex should **not** do any of this in T0001:

```text
Install Tone.js
Create PlaybackEngine
Create GameCueProject types
Create cue templates
Create music theory helpers
Create generator functions
Create save/load file handling
Create MIDI/WAV export
Create AI assistant
Create note editor
Create drum grid
Add external UI framework
Add global state library
```

If Codex thinks any of those are needed, it should report them as future work instead.

---

# 11. Target After T0001

After T0001, the repo should be ready for:

```text
T0002 — Core Project Model
```

T0002 will add TypeScript model files such as:

```text
src/core/model/GameCueProject.ts
src/core/model/CueSettings.ts
src/core/model/Track.ts
src/core/model/Section.ts
src/core/model/NoteEvent.ts
src/core/model/MixSettings.ts
```

Do not add those during T0001 unless the ticket is intentionally revised.

---

# 12. Suggested T0001 Branch

```text
gamecue/t0001-project-skeleton
```

---

# 13. Suggested T0001 Commit Message

```text
T0001: create GameCue project skeleton
```

---

# 14. Summary

The T0001 skeleton should be boring, clean, and intentionally limited.

The goal is not to build music features yet.

The goal is to create a stable, understandable starting point that later tickets can build on without fighting project structure.
