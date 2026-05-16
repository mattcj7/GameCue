# GameCue Naming and Code Conventions

**Project:** GameCue  
**Version:** 0.1  
**Status:** Draft / Living Convention Guide  
**Purpose:** Define naming, module, folder, and future namespace conventions so Codex creates consistent files and identifiers as the project grows.

---

# 1. Purpose

This document gives Codex and human contributors concrete naming rules for GameCue.

Use this document when creating or reviewing:

- Files
- Folders
- TypeScript types
- React components
- Core helper functions
- Generation functions
- Playback adapters
- Serialization helpers
- Project schema fields
- Future C# namespaces
- Test files
- Documentation files

The goal is to prevent naming drift and avoid vague names as the project grows one ticket at a time.

---

# 2. Project Naming

The official project and product name is:

```text
GameCue
```

Use:

```text
GameCue
.gamecue.json
GameCueProject
CueSettings
NoteEvent
Track
Section
MixSettings
PlaybackEngine
TonePlaybackEngine
```

Avoid old or alternate names unless discussing historical design notes:

```text
CaseCue
MusicApp
SongMaker
BeatForge
CueSmith
Sheridan CueSmith
```

If the product is renamed later, make it an explicit design decision in:

```text
docs/Design_Update_Companion.md
```

---

# 3. TypeScript Namespace Rule

Do **not** use TypeScript `namespace` blocks.

Use ES modules and folder boundaries instead.

Avoid:

```ts
namespace GameCue.Core {
  export interface GameCueProject {}
}
```

Use:

```ts
export interface GameCueProject {}
```

and organize by folder:

```text
src/core/model/GameCueProject.ts
src/core/generation/generateProject.ts
src/playback/tone/TonePlaybackEngine.ts
```

## 3.1 Why No TypeScript Namespaces?

GameCue is a Vite + React + TypeScript project. ES modules are the normal module boundary.

Using TypeScript namespaces would add unnecessary complexity and make imports less consistent.

---

# 4. Future C# Namespace Rule

C# is a future option only. Do not create C# projects during the MVP unless a ticket explicitly requires it.

If C# projects are added later, use clear `GameCue.*` namespaces.

Recommended future C# namespace pattern:

```csharp
namespace GameCue.Core;
namespace GameCue.Core.Model;
namespace GameCue.Core.Generation;
namespace GameCue.Core.Serialization;
namespace GameCue.Export;
namespace GameCue.Desktop;
namespace GameCue.Audio;
namespace GameCue.Audio.Rendering;
```

Avoid vague namespaces:

```csharp
namespace App;
namespace Music;
namespace Helpers;
namespace Engine;
namespace Stuff;
```

C# code should still respect the same architecture rule:

```text
Core data/generation should not depend on playback/rendering engines.
```

---

# 5. Folder Ownership

Use folders as architecture boundaries.

```text
src/app/                 App composition and top-level orchestration
src/core/model/          Plain project types and schema-compatible models
src/core/theory/         Notes, scales, chords, rhythm helpers
src/core/templates/      Cue templates and generation profiles
src/core/generation/     Music/event generation
src/core/serialization/  Project serialization and validation
src/core/export/         Future export helpers
src/core/ai/             Future structured AI command helpers

src/playback/            Playback interfaces and engine-agnostic playback contracts
src/playback/tone/       Tone.js playback adapter only

src/ui/controls/         Cue controls, transport controls, generation controls
src/ui/tracks/           Track list, track cards, mute/solo/regenerate controls
src/ui/project/          Save/load/export/project summary UI
src/ui/shared/           Reusable UI primitives

docs/                    Planning, design, prompt, verification, and workflow docs
```

Do not create new top-level folders unless a ticket explicitly requires them.

---

# 6. Import Rules

## 6.1 Core Import Rules

`src/core` must stay engine-agnostic.

Allowed:

```ts
// src/core/generation/generateProject.ts
import type { GameCueProject } from "../model/GameCueProject";
import { getScaleNotes } from "../theory/scales";
```

Not allowed:

```ts
import * as Tone from "tone";
import React from "react";
```

Core must not import from:

```text
src/ui/
src/playback/tone/
Tone.js
Web Audio APIs
DOM APIs
React components
```

## 6.2 UI Import Rules

UI may import types and functions from core.

Allowed:

```ts
import type { CueSettings } from "../../core/model/CueSettings";
import { generateProject } from "../../core/generation/generateProject";
```

UI should not directly import Tone.js.

Avoid:

```ts
import * as Tone from "tone";
```

UI should trigger playback through app orchestration or a playback engine interface, not by scheduling audio directly.

## 6.3 Playback Import Rules

Playback may import core model types.

Allowed:

```ts
import type { GameCueProject } from "../core/model/GameCueProject";
```

Tone.js imports are allowed only under:

```text
src/playback/tone/
```

Allowed:

```ts
// src/playback/tone/TonePlaybackEngine.ts
import * as Tone from "tone";
```

Not allowed:

```ts
// src/core/generation/generateMelody.ts
import * as Tone from "tone";
```

---

# 7. File Naming Conventions

## 7.1 React Components

Use `PascalCase.tsx`.

Examples:

```text
App.tsx
CueControls.tsx
TransportControls.tsx
TrackList.tsx
TrackCard.tsx
SaveLoadPanel.tsx
ProjectSummary.tsx
```

## 7.2 Model and Type Files

Use `PascalCase.ts` for primary model/type files.

Examples:

```text
GameCueProject.ts
CueSettings.ts
Section.ts
Track.ts
NoteEvent.ts
MixSettings.ts
PlaybackEngine.ts
```

## 7.3 Core Helper Modules

Use `camelCase.ts` for helper/function modules.

Examples:

```text
scales.ts
chords.ts
rhythm.ts
cueTypes.ts
generateProject.ts
generateDrums.ts
generateBass.ts
generateChords.ts
generateMelody.ts
projectSerializer.ts
projectValidator.ts
```

## 7.4 Tone.js Adapter Files

Use `PascalCase.ts` for classes/adapters and `camelCase.ts` for helper factories.

Examples:

```text
TonePlaybackEngine.ts
toneInstrumentFactory.ts
toneScheduler.ts
toneEventMapper.ts
```

## 7.5 Test Files

Use the same base name as the module plus `.test.ts`.

Examples:

```text
scales.test.ts
chords.test.ts
generateProject.test.ts
projectSerializer.test.ts
projectValidator.test.ts
TonePlaybackEngine.test.ts
```

## 7.6 Documentation Files

Use `Title_Case_With_Underscores.md`.

Examples:

```text
GameCue_Full_Design_Document.md
GameCue_MVP_Technical_Design.md
Naming_And_Code_Conventions.md
Manual_Verification_Guide.md
Design_Update_Companion.md
```

---

# 8. Type and Interface Naming

Use clear domain names.

Recommended model/type names:

```ts
GameCueProject
CueSettings
CueType
CueMood
CueIntensity
MusicalKey
MusicalMode
TimeSignature
Section
SectionId
Track
TrackId
TrackType
InstrumentId
NoteEvent
DrumEvent
ControlEvent
ProjectEvent
MixSettings
TrackMixSettings
CueTemplate
TrackPreset
GenerationProfile
PlaybackEngine
PlaybackState
ValidationResult
ValidationError
```

Avoid vague names:

```ts
Data
Thing
ObjectData
MusicObject
SongStuff
GeneratorData
AudioManager
Manager
Helper
Util
Processor
```

## 8.1 ID Type Naming

Use explicit ID aliases when helpful:

```ts
export type ProjectId = string;
export type SectionId = string;
export type TrackId = string;
export type EventId = string;
export type InstrumentId = string;
```

Avoid generic ID names in shared types:

```ts
id2
thingId
objectId
```

## 8.2 Enum / Union Naming

Prefer string literal unions for simple project values.

Example:

```ts
export type CueType =
  | "investigation"
  | "suspense"
  | "chase"
  | "menu_theme"
  | "discovery_sting"
  | "emotional_scene"
  | "dark_ambient";
```

Use clear lowercase serialized values for `.gamecue.json`.

Avoid random casing in saved values:

```text
MenuTheme
menuTheme
MENU_THEME
```

Prefer:

```text
menu_theme
```

---

# 9. Function Naming

Use verb-based function names.

Recommended examples:

```ts
createExampleProject()
createProjectId()
createTrackId()
generateProject()
generateDrumEvents()
generateBassEvents()
generateChordEvents()
generateMelodyEvents()
generateVariation()
resolveCueTemplate()
resolveChordProgression()
getScaleNotes()
getChordNotes()
transposeNote()
serializeProject()
deserializeProject()
validateProject()
validateTrack()
validateEventTiming()
createToneInstrument()
mapEventToTonePart()
```

Avoid unclear names:

```ts
doMusic()
makeStuff()
process()
run()
handleData()
helper()
manager()
thing()
```

## 9.1 Boolean Function Names

Boolean-returning functions should read like yes/no checks.

Examples:

```ts
isValidProject()
isTrackMuted()
isTrackSoloed()
hasSoloedTracks()
isEventInsideLoop()
canExportMidi()
```

## 9.2 Event Handler Names

React handler functions should describe the event.

Examples:

```ts
handleGenerateCue()
handleCueTypeChange()
handlePlayClick()
handleStopClick()
handleTrackMuteToggle()
handleProjectFileSelected()
```

---

# 10. Variable Naming

Use descriptive names.

Prefer:

```ts
cueSettings
selectedCueType
generatedProject
trackEvents
loopLengthBeats
sectionStartBeat
trackMixSettings
validationErrors
```

Avoid:

```ts
data
obj
stuff
thing
x
y
val
temp
```

Short names are acceptable in very small local contexts, such as array callbacks, but avoid hiding domain meaning.

---

# 11. Project Schema Naming

Saved `.gamecue.json` fields should use `camelCase`.

Recommended:

```json
{
  "schemaVersion": "0.1",
  "projectId": "project_001",
  "title": "Dark Alley Investigation",
  "createdAt": "2026-05-15T00:00:00.000Z",
  "updatedAt": "2026-05-15T00:00:00.000Z",
  "cue": {
    "type": "investigation",
    "mood": "dark",
    "intensity": 3,
    "bpm": 86,
    "key": "D",
    "mode": "minor",
    "bars": 16,
    "timeSignature": "4/4"
  },
  "sections": [],
  "tracks": [],
  "mix": {}
}
```

Use stable snake_case string values for enum-like serialized values:

```text
investigation
menu_theme
discovery_sting
dark_ambient
minimal_electronic_kit
sub_pulse
dark_pad
simple_lead
```

Do not serialize:

- Tone.js objects
- Functions
- DOM nodes
- Audio nodes
- React state objects
- Class instances that do not serialize cleanly

---

# 12. Track and Event Naming

## 12.1 Track IDs

Use stable, readable IDs.

Examples:

```text
track_drums
track_bass
track_chords
track_pad
track_melody
track_fx
```

If multiple tracks of the same type are later supported:

```text
track_melody_01
track_melody_02
```

## 12.2 Event IDs

Use stable event prefixes.

Examples:

```text
event_0001
event_0002
event_0003
```

Generated events should not rely on array index alone if they need to be edited or persisted.

## 12.3 Section IDs

Examples:

```text
section_loop_a
section_intro
section_outro
section_variation_high
```

---

# 13. React Component Conventions

## 13.1 Component Names

Use clear component names.

Examples:

```tsx
CueControls
TransportControls
TrackList
TrackCard
SaveLoadPanel
ProjectSummary
ErrorMessage
```

Avoid:

```tsx
Panel1
ThingView
MusicBox
ControlStuff
```

## 13.2 Props Types

Name props as:

```ts
export interface CueControlsProps {
  settings: CueSettings;
  onSettingsChange: (settings: CueSettings) => void;
}
```

Use:

```text
ComponentNameProps
```

Avoid:

```text
Props
IProps
DataProps
```

## 13.3 UI State

Keep UI-only state in UI/app layers.

Do not push UI-only state into `GameCueProject` unless it must be saved.

Examples of UI-only state:

```text
selectedTrackId
isSaveDialogOpen
loadErrorMessage
activePanel
```

Examples of project state:

```text
cue settings
tracks
events
mix settings
locked tracks
```

---

# 14. Class Naming

Prefer plain functions and objects for core logic.

Classes are acceptable for runtime systems like playback engines.

Allowed class examples:

```ts
TonePlaybackEngine
BrowserFileProjectStore
```

Avoid unnecessary classes for simple helpers:

```ts
ScaleHelper
ChordManager
GenerationProcessor
DataService
```

Prefer:

```ts
getScaleNotes()
getChordNotes()
generateProject()
validateProject()
```

---

# 15. Constants Naming

Use `camelCase` for normal exported constants.

Examples:

```ts
export const supportedKeys = ["C", "C#", "D"] as const;
export const defaultCueSettings: CueSettings = { ... };
export const investigationTemplate: CueTemplate = { ... };
```

Use `SCREAMING_SNAKE_CASE` only for true global constants that are not domain objects.

Examples:

```ts
export const MAX_BPM = 220;
export const MIN_BPM = 40;
```

---

# 16. Error and Validation Naming

Validation result types should be explicit.

Examples:

```ts
ValidationResult
ValidationError
ProjectValidationError
validateProject()
validateTrack()
validateEventTiming()
```

Recommended shape:

```ts
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  code: string;
  message: string;
  path?: string;
}
```

Error codes should use snake_case:

```text
missing_schema_version
invalid_bpm
duplicate_track_id
event_outside_loop
```

---

# 17. Test Naming

Test names should describe behavior.

Examples:

```ts
describe("getScaleNotes", () => {
  it("returns the D natural minor scale", () => {});
});

describe("generateProject", () => {
  it("creates the expected starter tracks", () => {});
});
```

Avoid vague test names:

```ts
it("works", () => {});
it("does stuff", () => {});
```

---

# 18. Branch Naming

Use one branch per ticket.

Pattern:

```text
gamecue/t0001-project-skeleton
gamecue/t0002-core-project-model
gamecue/t0016-play-stop-loop-controls
```

Rules:

- Lowercase
- Include ticket ID
- Short descriptive slug
- One ticket per branch when practical

---

# 19. Commit Message Naming

Use ticket-first commit messages.

Examples:

```text
T0001: create GameCue project skeleton
T0002: add core project model types
T0016: wire play stop loop controls
```

Bugfix examples:

```text
Fix T0016: prevent overlapping Tone playback
Fix T0022: preserve current project on invalid load
```

Docs examples:

```text
Docs: add naming and code conventions
Docs: update repo current state after T0001
```

---

# 20. Documentation Naming

Use canonical doc names where possible.

Preferred planning docs:

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
docs/GameCue_Project_Skeleton_Layout.md
docs/Naming_And_Code_Conventions.md
```

Avoid keeping duplicate versioned and non-versioned docs side by side unless intentionally archived.

---

# 21. Dependency Naming and Wrapping

If external dependencies are added, do not scatter them throughout the app.

Examples:

- Tone.js belongs under `src/playback/tone`.
- Future MIDI export libraries should be wrapped under `src/core/export` or a focused export adapter.
- Future AI provider calls should be wrapped under a future provider layer, not mixed into UI components.

If a dependency is introduced, document:

- Why it is needed
- Which ticket added it
- Which folder owns it
- Whether it affects saved project format

---

# 22. Avoided Names

Avoid generic file and class names unless they are truly justified.

Avoid:

```text
Manager
Processor
Helper
Util
Service
Data
Stuff
Thing
Main
Common
Global
Engine
```

Acceptable only when specific:

```text
projectValidator.ts
toneInstrumentFactory.ts
PlaybackEngine.ts
midiExportService.ts
```

`PlaybackEngine` is acceptable because it names the actual abstraction.

---

# 23. Codex Prompt Add-On

Add this to Codex prompts when naming consistency matters:

```text
Also follow docs/Naming_And_Code_Conventions.md. Use GameCue naming consistently. Do not use TypeScript namespace blocks. Use ES modules and folder boundaries. Keep src/core engine-agnostic and keep Tone.js isolated under src/playback/tone.
```

---

# 24. Manual Review Checklist

When reviewing Codex output, check:

```text
1. Are files named according to this guide?
2. Are types named clearly?
3. Did Codex avoid TypeScript namespace blocks?
4. Did src/core avoid Tone.js, React, DOM, and Web Audio imports?
5. Are project schema fields camelCase?
6. Are serialized enum-like values snake_case?
7. Are functions verb-based and domain-specific?
8. Are React components PascalCase?
9. Are helper modules camelCase?
10. Did Codex avoid vague names like Manager, Helper, Stuff, or Data?
```

---

# 25. Summary

GameCue naming should be boring, explicit, and stable.

The guiding rule:

```text
Use clear domain names, ES modules, plain JSON-compatible project data, and folder boundaries instead of vague names or TypeScript namespaces.
```
