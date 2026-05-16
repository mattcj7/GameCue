# GameCue MVP Technical Design v0.1

**Project:** GameCue  
**Purpose:** Fast, editable game-music cue generation for indie games  
**Initial Stack:** React + TypeScript + Vite + Tone.js  
**Future Direction:** Tauri desktop wrapper, C# export/helper tooling, optional JUCE renderer only if needed later  
**Status:** Starter technical design for Codex-driven implementation

---

## 1. Product Goal

GameCue is a lightweight music-generation tool for creating **loopable game music cues**. It is not intended to be a full DAW, professional mastering suite, or AI song generator. Its first job is to quickly create usable musical sketches for games, especially Unity projects.

The user should be able to choose a cue type, mood, key, tempo, length, and intensity, then generate a playable multi-track music loop with drums, bass, chords/pads, melody/motif, and optional stingers.

The long-term goal is to make a tool that helps rapidly create game-ready musical ideas such as:

- Investigation ambience
- Suspense loops
- Chase/action loops
- Main menu themes
- Discovery stings
- Emotional scene beds
- Dark ambient background music
- Boss/fight loops

---

## 2. MVP Scope

The MVP should prove one thing:

> Can GameCue generate, play, edit lightly, save, and reload useful loopable game-music cues?

### MVP Features

- Create a new cue project
- Select cue type
- Select mood
- Select key
- Select BPM
- Select loop length: 8, 16, or 32 bars
- Select intensity: 1–5
- Generate a multi-track cue
- Play, stop, and loop playback
- Mute and solo tracks
- Regenerate one track at a time
- Save project as `.gamecue.json`
- Load project from `.gamecue.json`
- Keep generated music represented as editable project data, not just audio

### MVP Track Types

| Track Type | Purpose |
|---|---|
| Drums / Percussion | Rhythm, tension, pulse, action feel |
| Bass / Pulse | Low-end motion and harmonic grounding |
| Chords / Pad | Harmonic bed and mood |
| Melody / Motif | Memorable theme or repeated phrase |
| FX / Stinger | Optional hits, rises, impacts, transitions |

---

## 3. Non-Goals for MVP

These should **not** be included in the first build:

- Full DAW timeline editing
- Audio recording
- Vocal generation
- Waveform editing
- Plugin hosting
- VST/AU support
- Full mixer automation
- Professional mastering tools
- JUCE integration
- C# desktop app
- AI-generated finished songs
- Audio-to-MIDI transcription
- Complex piano-roll editing
- Cloud accounts or sharing

The MVP should stay small, fast, and practical.

---

## 4. Recommended Tech Stack

### Initial Stack

```text
React
TypeScript
Vite
Tone.js
CSS Modules or plain CSS
Vitest
Zod or TypeScript-first validation later
```

### Why This Stack

React + TypeScript makes the UI and data model easier to build and maintain. Tone.js gives us fast browser-based playback without writing low-level audio code. Vite keeps the development loop fast.

### Future Stack Options

| Future Need | Recommended Direction |
|---|---|
| Desktop packaging | Tauri |
| Batch export helper | C# / .NET CLI tool |
| Unity export helper | C# / .NET CLI tool |
| Higher-quality native rendering | Separate JUCE renderer |
| Professional audio/plugin support | JUCE later, not now |

---

## 5. High-Level Architecture

GameCue should be split into two major layers from day one:

```text
GameCue Core
  - Project model
  - Music theory helpers
  - Cue templates
  - Pattern generators
  - Save/load schema
  - Export planning

GameCue Web
  - React UI
  - Tone.js playback
  - User interactions
  - Browser file save/load
```

The important rule:

> Music generation logic should not live inside Tone.js components.

Tone.js is the playback engine. GameCue Core is the music brain.

---

## 6. Proposed Repo Structure

```text
gamecue/
  README.md
  package.json
  vite.config.ts
  tsconfig.json
  index.html

  src/
    app/
      App.tsx
      App.css
      main.tsx

    core/
      model/
        GameCueProject.ts
        Track.ts
        NoteEvent.ts
        CueSettings.ts
        Section.ts

      theory/
        keys.ts
        scales.ts
        chords.ts
        rhythm.ts
        random.ts

      templates/
        CueTemplate.ts
        investigationTemplate.ts
        suspenseTemplate.ts
        chaseTemplate.ts
        menuThemeTemplate.ts
        discoveryStingTemplate.ts
        emotionalSceneTemplate.ts
        darkAmbientTemplate.ts
        index.ts

      generation/
        generateCue.ts
        generateDrums.ts
        generateBass.ts
        generateChords.ts
        generateMelody.ts
        generateFx.ts
        variation.ts

      serialization/
        saveProject.ts
        loadProject.ts
        validateProject.ts

    playback/
      PlaybackEngine.ts
      tone/
        TonePlaybackEngine.ts
        toneInstruments.ts
        toneScheduler.ts

    ui/
      components/
        CueControls.tsx
        TransportControls.tsx
        TrackList.tsx
        TrackRow.tsx
        ProjectHeader.tsx
        JsonProjectPanel.tsx

      hooks/
        useGameCueProject.ts
        usePlaybackEngine.ts

    tests/
      generation.test.ts
      serialization.test.ts
      theory.test.ts
```

---

## 7. Core Project Model

GameCue should save projects as `.gamecue.json` files.

### Example Project

```json
{
  "schemaVersion": "0.1",
  "id": "project_dark_alley_loop",
  "title": "Dark Alley Loop",
  "createdAt": "2026-05-15T00:00:00.000Z",
  "updatedAt": "2026-05-15T00:00:00.000Z",
  "settings": {
    "cueType": "investigation",
    "mood": "dark",
    "key": "D minor",
    "bpm": 88,
    "bars": 16,
    "timeSignature": "4/4",
    "intensity": 3
  },
  "tracks": [
    {
      "id": "track_drums_01",
      "name": "Low Percussion",
      "type": "drums",
      "instrument": "dark_percussion",
      "muted": false,
      "solo": false,
      "locked": false,
      "events": []
    },
    {
      "id": "track_bass_01",
      "name": "Pulse Bass",
      "type": "bass",
      "instrument": "sub_pulse",
      "muted": false,
      "solo": false,
      "locked": false,
      "events": []
    },
    {
      "id": "track_pad_01",
      "name": "Cold Pad",
      "type": "chords",
      "instrument": "dark_pad",
      "muted": false,
      "solo": false,
      "locked": false,
      "events": []
    },
    {
      "id": "track_melody_01",
      "name": "Sparse Motif",
      "type": "melody",
      "instrument": "soft_pluck",
      "muted": false,
      "solo": false,
      "locked": false,
      "events": []
    }
  ]
}
```

---

## 8. TypeScript Model Draft

### GameCueProject

```ts
export interface GameCueProject {
  schemaVersion: '0.1';
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  settings: CueSettings;
  tracks: Track[];
}
```

### CueSettings

```ts
export type CueType =
  | 'investigation'
  | 'suspense'
  | 'chase'
  | 'menu_theme'
  | 'discovery_sting'
  | 'emotional_scene'
  | 'dark_ambient';

export type CueMood =
  | 'dark'
  | 'hopeful'
  | 'creepy'
  | 'urgent'
  | 'sad'
  | 'heroic'
  | 'mysterious';

export interface CueSettings {
  cueType: CueType;
  mood: CueMood;
  key: string;
  bpm: number;
  bars: 8 | 16 | 32;
  timeSignature: '4/4';
  intensity: 1 | 2 | 3 | 4 | 5;
}
```

### Track

```ts
export type TrackType = 'drums' | 'bass' | 'chords' | 'melody' | 'fx';

export interface Track {
  id: string;
  name: string;
  type: TrackType;
  instrument: string;
  muted: boolean;
  solo: boolean;
  locked: boolean;
  events: NoteEvent[];
}
```

### NoteEvent

```ts
export interface NoteEvent {
  id: string;
  note: string;
  startBeat: number;
  durationBeats: number;
  velocity: number;
}
```

For drums, the `note` field can hold symbolic drum names at first:

```text
kick
snare
closed_hat
open_hat
low_tom
impact
riser
```

---

## 9. Cue Template System

Each cue type should define defaults and generation behavior.

### CueTemplate

```ts
export interface CueTemplate {
  cueType: CueType;
  label: string;
  defaultBpm: number;
  bpmRange: [number, number];
  recommendedMoods: CueMood[];
  defaultBars: 8 | 16 | 32;
  trackPlan: TrackPlan[];
  chordBehavior: ChordBehavior;
  rhythmBehavior: RhythmBehavior;
  melodyBehavior: MelodyBehavior;
}
```

### TrackPlan

```ts
export interface TrackPlan {
  type: TrackType;
  defaultName: string;
  defaultInstrument: string;
  enabledByDefault: boolean;
}
```

---

## 10. Initial Cue Types

### Investigation

Purpose: quiet tension, mystery, subtle movement.

```text
BPM: 72–96
Common keys: D minor, E minor, A minor
Tracks: low percussion, pulse bass, dark pad, sparse motif
Rhythm: sparse, low density
Melody: short repeated motif, lots of space
```

### Suspense

Purpose: rising tension and unease.

```text
BPM: 80–110
Tracks: ticking percussion, drone, pulse bass, dissonant pad, riser FX
Rhythm: repeated pulse, increasing density with intensity
Melody: minimal or fragmented
```

### Chase

Purpose: action, urgency, movement.

```text
BPM: 120–160
Tracks: driving drums, bass ostinato, rhythmic chords, short motif
Rhythm: high density
Melody: repeated action phrase
```

### Menu Theme

Purpose: recognizable loop that sets the tone.

```text
BPM: 70–120
Tracks: pad/chords, bass, melody, light percussion
Rhythm: moderate density
Melody: stronger identity than background cues
```

### Discovery Sting

Purpose: short musical hit for clues, reveals, success, or evidence discovery.

```text
Length: 1–4 bars later; MVP may use 8 bars with sparse content
Tracks: pad, bell/pluck, impact, shimmer
Rhythm: minimal
Melody: short resolving phrase
```

### Emotional Scene

Purpose: somber, reflective, or hopeful background.

```text
BPM: 60–90
Tracks: soft pad, piano/pluck, bass, simple melody
Rhythm: minimal percussion or none
Melody: slow and lyrical
```

### Dark Ambient

Purpose: atmosphere, tension bed, low movement.

```text
BPM: 60–90
Tracks: drone, pad, low pulse, texture FX
Rhythm: very sparse
Melody: optional or none
```

---

## 11. Generation Rules v0.1

The generator should prioritize simple, good-enough musical output over complex theory.

### Generation Input

```ts
export interface GenerateCueInput {
  title?: string;
  cueType: CueType;
  mood: CueMood;
  key: string;
  bpm: number;
  bars: 8 | 16 | 32;
  intensity: 1 | 2 | 3 | 4 | 5;
}
```

### Generation Output

```ts
export interface GenerateCueResult {
  project: GameCueProject;
}
```

### Basic Generation Steps

```text
1. Resolve cue template.
2. Resolve key and scale notes.
3. Pick chord progression.
4. Generate track list from template.
5. Generate drums based on cue type and intensity.
6. Generate bass from chord roots and rhythm behavior.
7. Generate chords/pad from progression.
8. Generate melody/motif from scale notes and cue behavior.
9. Generate optional FX/stingers.
10. Return GameCueProject.
```

---

## 12. Chord Progression Rules

Start with a small library of reliable progressions.

### Minor Key Progressions

```text
i - VI - III - VII

i - iv - VI - V

i - VII - VI - VII

i - VI - iv - V

i - III - VII - VI
```

### Major Key Progressions

```text
I - V - vi - IV

I - IV - V - IV

I - vi - IV - V

I - V - IV - I
```

For game music, minor keys should be prioritized for investigation, suspense, dark ambient, and chase cues.

---

## 13. Rhythm and Density Rules

Intensity should affect density.

| Intensity | Behavior |
|---|---|
| 1 | Sparse, long notes, minimal percussion |
| 2 | Light pulse, occasional movement |
| 3 | Standard pattern density |
| 4 | More rhythmic subdivision, more percussion |
| 5 | Busy, urgent, high-energy movement |

### Example Drum Density

```text
Investigation intensity 1:
- Kick every 2 bars
- Occasional low hit
- No hats or very sparse hats

Investigation intensity 3:
- Kick every bar or every other bar
- Low pulse hits
- Sparse ticking percussion

Chase intensity 5:
- Kick/snare action pattern
- Repeated hats
- Extra percussion hits
```

---

## 14. Playback Engine Abstraction

Tone.js should be hidden behind a playback interface.

### PlaybackEngine

```ts
export interface PlaybackEngine {
  loadProject(project: GameCueProject): Promise<void>;
  play(): Promise<void>;
  stop(): Promise<void>;
  dispose(): Promise<void>;
  setTempo(bpm: number): Promise<void>;
  setTrackMuted(trackId: string, muted: boolean): Promise<void>;
  setTrackSolo(trackId: string, solo: boolean): Promise<void>;
}
```

### TonePlaybackEngine

Responsibilities:

- Create Tone.js instruments for each track
- Schedule note events
- Loop the cue length
- Respect mute/solo state
- Start/stop transport
- Dispose old instruments when loading new projects

TonePlaybackEngine should **not** generate music.

---

## 15. UI v0.1

The MVP UI should be simple and functional.

### Main Layout

```text
 --------------------------------------------------
| GameCue                                          |
| Title: [Dark Alley Loop]                         |
 --------------------------------------------------
| Cue Controls                                     |
| Type: Investigation                              |
| Mood: Dark                                       |
| Key: D minor                                     |
| BPM: 88                                          |
| Bars: 16                                         |
| Intensity: 3                                     |
| [Generate Cue]                                   |
 --------------------------------------------------
| Transport                                        |
| [Play] [Stop] [Loop: On]                         |
 --------------------------------------------------
| Tracks                                           |
| Drums        [Mute] [Solo] [Lock] [Regenerate]   |
| Bass         [Mute] [Solo] [Lock] [Regenerate]   |
| Chords/Pad   [Mute] [Solo] [Lock] [Regenerate]   |
| Melody       [Mute] [Solo] [Lock] [Regenerate]   |
| FX           [Mute] [Solo] [Lock] [Regenerate]   |
 --------------------------------------------------
| Project                                          |
| [Save .gamecue.json] [Load .gamecue.json]         |
 --------------------------------------------------
```

### UI Components

| Component | Purpose |
|---|---|
| `ProjectHeader` | Title and basic metadata |
| `CueControls` | Cue settings and generate button |
| `TransportControls` | Play/stop controls |
| `TrackList` | Track rows |
| `TrackRow` | Mute/solo/lock/regenerate |
| `JsonProjectPanel` | Debug view of project JSON during development |

---

## 16. Save and Load

### Save

The browser should download the current project as:

```text
<ProjectTitle>.gamecue.json
```

### Load

The browser should accept a `.gamecue.json` file, parse it, validate it, set it as current project, and load it into playback.

### Validation v0.1

Basic validation should confirm:

- `schemaVersion` is supported
- `settings` exists
- `tracks` is an array
- each track has `id`, `name`, `type`, `instrument`, and `events`
- each event has `note`, `startBeat`, `durationBeats`, and `velocity`

---

## 17. Export Roadmap

Export does not need to be fully implemented in the first ticket, but the project should be designed around it.

### Export Phases

| Phase | Export Type |
|---|---|
| MVP | `.gamecue.json` project file |
| Phase 2 | MIDI file export |
| Phase 3 | WAV loop export |
| Phase 4 | Stem export |
| Phase 5 | Unity-friendly folder export |

### Future Unity Export Format

```text
Exports/
  DarkAlleyLoop/
    DarkAlleyLoop_full_loop.wav
    DarkAlleyLoop_drums.wav
    DarkAlleyLoop_bass.wav
    DarkAlleyLoop_chords.wav
    DarkAlleyLoop_melody.wav
    DarkAlleyLoop.mid
    DarkAlleyLoop.gamecue.json
    README.txt
```

---

## 18. Testing Strategy

### Unit Tests

Use Vitest for pure functions.

Test areas:

- key/scale helpers
- chord generation
- rhythm utilities
- cue generation
- project serialization
- project validation
- track regeneration

### Manual Verification

Each ticket should include a manual checklist.

Example:

```text
1. Run the app.
2. Choose Investigation / Dark / D minor / 88 BPM / 16 bars / intensity 3.
3. Click Generate Cue.
4. Confirm tracks are created.
5. Click Play.
6. Confirm sound is heard.
7. Mute drums.
8. Confirm drums stop while other tracks continue.
9. Save project.
10. Reload the saved project.
11. Confirm settings and tracks are restored.
```

---

## 19. Codex Ticket Breakdown

### T0001 — Project Skeleton

**Goal:** Create the initial React + TypeScript + Vite app with folder structure.

Tasks:

- Initialize Vite React TypeScript project
- Add Tone.js
- Add Vitest
- Create folder structure
- Add placeholder App layout
- Add README with development commands

Acceptance Criteria:

- `npm install` works
- `npm run dev` starts the app
- `npm test` runs
- App displays GameCue shell

Manual Verification:

- Open local dev URL
- Confirm GameCue title appears
- Confirm no console errors

---

### T0002 — Core Project Model

**Goal:** Add TypeScript models for GameCue projects, tracks, settings, and note events.

Tasks:

- Create `GameCueProject.ts`
- Create `CueSettings.ts`
- Create `Track.ts`
- Create `NoteEvent.ts`
- Add sample project factory
- Add basic serialization helpers

Acceptance Criteria:

- TypeScript compiles
- Sample project can be created
- Tests confirm required fields exist

Manual Verification:

- App can display sample project JSON in debug panel

---

### T0003 — Cue Controls UI

**Goal:** Build controls for cue type, mood, key, BPM, bars, and intensity.

Tasks:

- Add `CueControls` component
- Add controlled form state
- Add supported cue types
- Add supported moods
- Add key selector
- Add BPM input
- Add bars selector
- Add intensity selector

Acceptance Criteria:

- User can change all cue settings
- Settings update app state

Manual Verification:

- Change each field and confirm debug JSON updates

---

### T0004 — Music Theory Helpers

**Goal:** Add simple scale, chord, and rhythm helper functions.

Tasks:

- Add minor/major scale helper
- Add chord progression resolver
- Add beat/bar utility functions
- Add deterministic random helper with optional seed
- Add unit tests

Acceptance Criteria:

- Helpers return predictable results
- Tests cover common keys and progressions

Manual Verification:

- Generate debug output for D minor and C major without errors

---

### T0005 — First Cue Generator

**Goal:** Generate an Investigation cue with drums, bass, chords, and melody tracks.

Tasks:

- Add `generateCue.ts`
- Add `investigationTemplate.ts`
- Add `generateDrums.ts`
- Add `generateBass.ts`
- Add `generateChords.ts`
- Add `generateMelody.ts`
- Wire Generate Cue button

Acceptance Criteria:

- Clicking Generate Cue creates a valid project
- Project includes at least 4 tracks
- Tracks contain note events
- Generated cue length matches selected bars

Manual Verification:

- Generate an Investigation cue
- Confirm tracks and events appear in debug panel

---

### T0006 — Tone.js Playback Engine

**Goal:** Play generated cue projects in the browser.

Tasks:

- Add `PlaybackEngine` interface
- Add `TonePlaybackEngine`
- Map track types to simple Tone.js instruments
- Schedule project events
- Loop based on cue length
- Add play/stop buttons

Acceptance Criteria:

- Generated cue plays audio
- Stop button stops playback
- Loop repeats cleanly

Manual Verification:

- Generate cue
- Press Play
- Confirm audio starts
- Press Stop
- Confirm audio stops
- Let cue loop at least twice

---

### T0007 — Track List, Mute, Solo, Lock

**Goal:** Add basic track-level controls.

Tasks:

- Add `TrackList`
- Add `TrackRow`
- Add mute toggle
- Add solo toggle
- Add lock toggle
- Wire controls to playback/project state

Acceptance Criteria:

- Muting a track removes it from playback
- Soloing a track isolates it
- Lock state is stored in project data

Manual Verification:

- Play cue
- Mute drums
- Solo bass
- Lock melody
- Confirm state persists in debug panel

---

### T0008 — Regenerate Individual Track

**Goal:** Allow one track to be regenerated without replacing locked tracks.

Tasks:

- Add track regeneration button
- Add generator routing by track type
- Preserve track id/name unless deliberately replaced
- Skip regeneration for locked tracks

Acceptance Criteria:

- User can regenerate drums only
- User can regenerate bass only
- Locked track does not regenerate

Manual Verification:

- Generate cue
- Lock bass
- Regenerate all or selected tracks
- Confirm bass remains unchanged

---

### T0009 — Save and Load `.gamecue.json`

**Goal:** Save and reload projects.

Tasks:

- Add save helper
- Add load helper
- Add browser download support
- Add file picker support
- Add basic validation

Acceptance Criteria:

- Save downloads a `.gamecue.json` file
- Load restores the project
- Invalid files show a friendly error

Manual Verification:

- Generate cue
- Save it
- Refresh browser
- Load saved file
- Confirm settings and tracks restore

---

### T0010 — Additional Cue Templates

**Goal:** Add more cue types after the first end-to-end flow works.

Tasks:

- Add suspense template
- Add chase template
- Add menu theme template
- Add emotional scene template
- Add dark ambient template
- Add discovery sting template
- Tune generation rules by template

Acceptance Criteria:

- Each cue type generates distinct-feeling output
- All cue types play without runtime errors

Manual Verification:

- Generate each cue type
- Confirm tracks differ by cue type
- Confirm each cue plays

---

## 20. First Build Milestone

The first milestone should include T0001 through T0006.

At that point, GameCue should be able to:

```text
Start app
Choose Investigation cue settings
Generate cue
Play loop
Stop loop
View project JSON
```

That is the first real proof-of-concept.

---

## 21. Later Roadmap

### Phase 2 — Better Editing

- Drum step grid
- Simple piano-roll-lite view
- Track volume/pan
- Pattern copy/paste
- Section variations
- Humanize timing/velocity

### Phase 3 — Export

- MIDI export
- Loopable WAV export
- Stem export
- Unity folder export

### Phase 4 — Desktop App

- Package with Tauri
- Local file management
- Recent projects
- Export destination selection

### Phase 5 — Optional C# Tools

- C# batch export helper
- Unity project import helper
- Project library manager
- Automated cue pack builder

### Phase 6 — Optional JUCE Renderer

Only consider this if Tone.js/browser rendering is not good enough.

Possible role:

```text
GameCue.JuceRenderer
  input: .gamecue.json
  output: full loop WAV, stems, higher-quality rendered audio
```

JUCE should remain a renderer/backend, not the main app brain.

---

## 22. Core Design Rules

1. Keep the MVP small.
2. Keep generation logic outside Tone.js.
3. Save everything as editable project data.
4. Prioritize loopable game music over full songs.
5. Add export after playback works.
6. Add editing after generation works.
7. Do not start with JUCE.
8. Do not build a full DAW.
9. Make every ticket manually verifiable.
10. Keep future C# and JUCE paths open by protecting the `.gamecue.json` schema.

---

## 23. Immediate Next Step

Start with ticket T0001:

```text
Create the React + TypeScript + Vite project skeleton for GameCue, add Tone.js and Vitest, create the initial folder structure, and display a simple GameCue shell in the browser.
```

After T0001, continue with T0002 and T0003 before attempting audio playback.
