# GameCue Full Design Document

**Version:** 0.1  
**Status:** Draft / Living Design Document  
**Primary Goal:** Build a fast, practical game-music cue generator for indie game development.  
**Initial Tech Path:** React + TypeScript + Vite + Tone.js  
**Future Tech Paths:** Tauri desktop wrapper, C# helper/export tooling, optional JUCE renderer only if needed later.

---

# 1. Product Summary

## 1.1 Working Name

**GameCue**

Alternative names considered:

- CueForge
- CueSmith
- GameCue Studio
- Sheridan CueSmith

For now, the project will use **GameCue**.

## 1.2 Product Purpose

GameCue is a lightweight music creation tool focused on generating, editing, and exporting **loopable music cues for games**.

The tool is not intended to replace a full digital audio workstation such as FL Studio, Ableton, Logic, Cubase, or Reaper. Instead, it is intended to help quickly produce usable game music sketches, loops, stingers, and variations that can be exported into a game project.

## 1.3 Target User

The primary target user is an indie game developer who:

- Wants custom game music but is not a trained composer.
- Needs fast iteration for menu themes, investigation ambience, chase loops, suspense music, discovery stings, and emotional scenes.
- Wants editable generated music rather than a single finished black-box audio file.
- Wants game-friendly exports such as loopable WAVs, MIDI files, stems, and organized Unity folders.
- Prefers simple, practical controls over full professional DAW complexity.

## 1.4 Design Philosophy

GameCue should be:

- **Fast** — generate useful ideas quickly.
- **Editable** — output should be structured as notes, tracks, patterns, and sections.
- **Game-focused** — prioritize loopable cues, stingers, variations, and Unity-friendly export.
- **Simple first** — avoid full DAW scope until the core tool is useful.
- **Engine-agnostic** — the song/project model should not be locked to Tone.js.
- **Codex-friendly** — implementation should use clear small tickets, typed models, schemas, tests, and predictable folder structure.

---

# 2. Problem Statement

Game developers often need music for prototypes and vertical slices before they can afford or commission finished original scores. Existing options have tradeoffs:

| Option | Problem |
|---|---|
| Royalty-free music packs | Generic, hard to customize, may not match exact mood |
| Full DAWs | Powerful but intimidating and slow for non-musicians |
| AI audio generators | Fast but difficult to edit, loop, stem, or control precisely |
| Hiring composers | Best quality but not always available during early prototyping |
| Manual composition | Hard for users without music training |

GameCue fills the gap by generating editable game-ready music sketches.

---

# 3. Product Goals

## 3.1 Primary Goals

GameCue should allow the user to:

1. Select a game cue type.
2. Select mood, key, tempo, intensity, and length.
3. Generate a multi-track loop.
4. Play, stop, and loop the cue.
5. Mute, solo, and regenerate individual tracks.
6. Save and load project files.
7. Export project data.
8. Eventually export MIDI, WAV, stems, and Unity-ready folders.

## 3.2 Secondary Goals

Later versions should support:

- Section-based arrangement.
- Intensity variations.
- Stingers.
- Piano-roll editing.
- Drum-grid editing.
- MIDI export.
- Loopable WAV export.
- Stem export.
- AI-assisted composition commands.
- Desktop packaging.
- Optional higher-quality renderer.

## 3.3 Non-Goals for Early Versions

The early version should **not** attempt to support:

- Full DAW timeline editing.
- Professional mixing/mastering suite.
- Recording vocals or live instruments.
- VST/AU plugin hosting.
- Plugin export.
- Advanced waveform editing.
- Real-time collaborative editing.
- AI-generated finished vocal songs.
- Mobile-first interface.
- A custom low-level audio engine.

---

# 4. MVP Scope

## 4.1 MVP Definition

The MVP is a browser-based app that generates and plays loopable game music cues using Tone.js.

The first useful version should support:

- React + TypeScript + Vite app shell.
- Tone.js playback engine.
- GameCue project model.
- Cue templates.
- Basic deterministic generation.
- Four initial tracks:
  - Drums/percussion
  - Bass/pulse
  - Chords/pad
  - Melody/motif
- Cue generation controls:
  - Cue type
  - Mood
  - BPM
  - Key
  - Intensity
  - Length in bars
- Play/stop/loop.
- Track mute/solo.
- Regenerate all.
- Regenerate selected track.
- Save/load `.gamecue.json`.

## 4.2 MVP Cue Types

Initial cue types:

| Cue Type | Purpose |
|---|---|
| Investigation | Low-key background music for detective/exploration scenes |
| Suspense | Rising tension and uncertainty |
| Chase | Faster action loop |
| Menu Theme | Main menu or pause screen loop |
| Discovery Sting | Short reveal cue |
| Emotional Scene | Sad, reflective, or heartfelt cue |
| Dark Ambient | Minimal mood bed |

## 4.3 MVP Instruments

Initial instrument categories:

| Track Type | Initial Sound |
|---|---|
| Drums | Basic synthesized percussion |
| Bass | Simple mono synth or low pulse |
| Chords/Pad | Poly synth pad |
| Melody/Motif | Simple synth lead |
| FX/Stinger | Optional short noise/synth hit later |

The MVP does not require sampled orchestral instruments. Synth placeholders are acceptable.

---

# 5. Core User Workflows

## 5.1 Generate a Cue

1. User opens GameCue.
2. User selects cue type, mood, key, BPM, intensity, and length.
3. User clicks **Generate Cue**.
4. System creates a project with sections, tracks, and notes.
5. User presses **Play**.
6. Loop plays using Tone.js.

## 5.2 Regenerate One Track

1. User likes the drums and bass but dislikes the melody.
2. User locks or leaves existing tracks unchanged.
3. User clicks **Regenerate Melody**.
4. System replaces only melody notes.
5. User previews again.

## 5.3 Create Variations

1. User generates a suspense cue.
2. User clicks **Create Higher Intensity Variation**.
3. System keeps the same key and core motif.
4. System increases rhythm density, note range, and percussion activity.
5. User exports both base and intense variations.

## 5.4 Save and Load

1. User creates a cue.
2. User saves `.gamecue.json`.
3. Later, user loads the project.
4. Tracks, notes, cue settings, and instruments restore correctly.

## 5.5 Export to Game Project

Later workflow:

1. User finalizes cue.
2. User chooses **Export for Unity**.
3. System creates organized folder:
   - Full loop WAV
   - Optional stems
   - MIDI
   - Project JSON
   - Metadata file
4. User imports audio assets into Unity.

---

# 6. High-Level Architecture

## 6.1 Architecture Overview

```text
GameCue
  ├── GameCue Core
  │   ├── Project model
  │   ├── Music theory helpers
  │   ├── Cue templates
  │   ├── Pattern generators
  │   ├── Arrangement generator
  │   └── Serialization
  │
  ├── GameCue Web
  │   ├── React UI
  │   ├── App state
  │   ├── Controls
  │   ├── Track panels
  │   └── Tone.js playback adapter
  │
  └── Future Engines
      ├── MIDI export
      ├── WAV export
      ├── C# helper tools
      ├── Tauri desktop wrapper
      └── Optional JUCE renderer
```

## 6.2 Core Design Rule

The generation logic must not be locked inside Tone.js.

Tone.js should be treated as one playback backend. The project data should be engine-agnostic.

Correct:

```text
Project JSON -> Playback Adapter -> Tone.js
```

Incorrect:

```text
Tone.js objects are the source of truth
```

## 6.3 Engine Boundary

The system should separate:

| Layer | Responsibility |
|---|---|
| Core | Song data, notes, sections, templates, generation |
| UI | Controls, panels, buttons, user interaction |
| Playback Engine | Converts project notes into audible playback |
| Export | Converts project to files |
| Storage | Save/load project JSON |

---

# 7. Proposed Repository Structure

```text
gamecue/
  package.json
  README.md
  docs/
    GameCue_Full_Design_Document.md
    GameCue_MVP_Technical_Design.md
    Tickets.md
  src/
    app/
      App.tsx
      main.tsx
      styles.css
    core/
      model/
        GameCueProject.ts
        Track.ts
        Section.ts
        NoteEvent.ts
        Instrument.ts
      theory/
        keys.ts
        scales.ts
        chords.ts
        rhythm.ts
      templates/
        cueTemplates.ts
        investigationTemplate.ts
        suspenseTemplate.ts
        chaseTemplate.ts
        menuTemplate.ts
      generation/
        generateProject.ts
        generateDrums.ts
        generateBass.ts
        generateChords.ts
        generateMelody.ts
        generateVariation.ts
      serialization/
        projectSerializer.ts
        projectValidator.ts
    playback/
      PlaybackEngine.ts
      tone/
        TonePlaybackEngine.ts
        toneInstrumentFactory.ts
        toneScheduler.ts
    ui/
      controls/
        CueControls.tsx
        TransportControls.tsx
      tracks/
        TrackList.tsx
        TrackCard.tsx
      project/
        SaveLoadPanel.tsx
      shared/
        Button.tsx
        Select.tsx
  tests/
    core/
      generation.test.ts
      serialization.test.ts
      theory.test.ts
```

---

# 8. Project File Format

## 8.1 File Extension

GameCue project files should use:

```text
.gamecue.json
```

## 8.2 Design Goals

The project file should be:

- Human-readable.
- Versioned.
- Engine-agnostic.
- Easy to diff in Git.
- Easy for C#, TypeScript, or C++ to parse later.
- Stable enough to survive future renderer changes.

## 8.3 Initial Schema Example

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
  "sections": [
    {
      "id": "section_loop_a",
      "name": "Loop A",
      "startBar": 0,
      "bars": 16,
      "intensity": 3
    }
  ],
  "tracks": [
    {
      "id": "track_drums",
      "name": "Percussion",
      "type": "drums",
      "instrument": "minimal_electronic_kit",
      "muted": false,
      "solo": false,
      "locked": false,
      "events": [
        {
          "id": "event_001",
          "type": "drum",
          "pitch": "kick",
          "startBeat": 0,
          "durationBeats": 0.25,
          "velocity": 0.85
        }
      ]
    },
    {
      "id": "track_bass",
      "name": "Pulse Bass",
      "type": "bass",
      "instrument": "sub_pulse",
      "muted": false,
      "solo": false,
      "locked": false,
      "events": [
        {
          "id": "event_002",
          "type": "note",
          "pitch": "D2",
          "startBeat": 0,
          "durationBeats": 1,
          "velocity": 0.75
        }
      ]
    }
  ],
  "mix": {
    "masterVolume": 0.85,
    "tracks": [
      {
        "trackId": "track_drums",
        "volume": 0.9,
        "pan": 0
      },
      {
        "trackId": "track_bass",
        "volume": 0.8,
        "pan": 0
      }
    ]
  }
}
```

---

# 9. Core Data Model

## 9.1 GameCueProject

Represents the full saved project.

Fields:

- `schemaVersion`
- `projectId`
- `title`
- `createdAt`
- `updatedAt`
- `cue`
- `sections`
- `tracks`
- `mix`

## 9.2 CueSettings

Represents user-selected generation controls.

Fields:

- `type`
- `mood`
- `intensity`
- `bpm`
- `key`
- `mode`
- `bars`
- `timeSignature`

## 9.3 Section

Represents a section of a song/cue.

Fields:

- `id`
- `name`
- `startBar`
- `bars`
- `intensity`

Initial MVP may only have one section: `Loop A`.

## 9.4 Track

Represents one musical lane.

Fields:

- `id`
- `name`
- `type`
- `instrument`
- `muted`
- `solo`
- `locked`
- `events`

Track types:

- `drums`
- `bass`
- `chords`
- `pad`
- `melody`
- `fx`

## 9.5 NoteEvent

Represents a musical note or drum event.

Fields:

- `id`
- `type`
- `pitch`
- `startBeat`
- `durationBeats`
- `velocity`

Event types:

- `note`
- `drum`
- `control` later

## 9.6 MixSettings

Represents volume, pan, and later simple effects.

Initial fields:

- `masterVolume`
- `track volume`
- `track pan`

Future fields:

- reverb
- delay
- filter cutoff
- low-pass
- high-pass
- compression preset

---

# 10. Music Theory System

## 10.1 Supported Keys

Initial keys:

```text
C, C#, D, D#, E, F, F#, G, G#, A, A#, B
```

Flat display names can be added later.

## 10.2 Supported Modes

Initial modes:

- Major
- Minor

Later modes:

- Dorian
- Phrygian
- Harmonic minor
- Pentatonic
- Blues

## 10.3 Scale Degree System

Generation should prefer scale degrees internally.

Example in D minor:

| Degree | Note |
|---|---|
| 1 | D |
| 2 | E |
| b3 | F |
| 4 | G |
| 5 | A |
| b6 | Bb |
| b7 | C |

This lets generators work across keys.

## 10.4 Chord Progressions

Initial progression sets:

### Minor / Dark

```text
i - VI - III - VII
i - iv - VI - V
i - VII - VI - VII
i - VI - iv - V
```

### Major / Hopeful

```text
I - V - vi - IV
I - IV - V - I
vi - IV - I - V
```

### Suspense

```text
i - bII
i - iv - bII - V
i pedal with shifting upper notes
```

## 10.5 Rhythm Grid

Initial timing unit:

```text
16th-note grid
```

In 4/4:

```text
1 bar = 4 beats
1 beat = 4 sixteenth steps
1 bar = 16 steps
```

---

# 11. Cue Template System

## 11.1 Template Responsibilities

Cue templates define:

- BPM range
- Default mode
- Instrument defaults
- Rhythm density
- Chord progression style
- Bass behavior
- Melody behavior
- Drum/percussion density
- FX/stinger use
- Loop length recommendations

## 11.2 Template Shape

```ts
export interface CueTemplate {
  id: string;
  displayName: string;
  description: string;
  bpmRange: [number, number];
  defaultMode: "major" | "minor";
  defaultBars: number[];
  allowedMoods: string[];
  trackPresets: TrackPreset[];
  generationProfile: GenerationProfile;
}
```

## 11.3 Investigation Template

Purpose:

- Quiet, subtle, loopable background.
- Should not distract from dialogue or environmental sounds.

Defaults:

| Setting | Value |
|---|---|
| BPM | 70–95 |
| Mode | Minor |
| Bars | 16 |
| Drums | Minimal or none |
| Bass | Sparse pulse |
| Chords | Dark pad |
| Melody | Short motif, low density |
| FX | Optional soft hit |

Generation behavior:

- Long pad notes.
- Sparse bass.
- Melody should use short repeating motifs.
- Avoid busy drums.

## 11.4 Suspense Template

Purpose:

- Rising tension and danger.

Defaults:

| Setting | Value |
|---|---|
| BPM | 80–120 |
| Mode | Minor |
| Bars | 8 or 16 |
| Drums | Ticking/pulse |
| Bass | Repeating ostinato |
| Chords | Dissonant pad |
| Melody | Minimal |
| FX | Swells/hits later |

Generation behavior:

- Repeated low note.
- Half-step tension possible.
- Increased density at higher intensity.

## 11.5 Chase Template

Purpose:

- Fast action or pursuit sequence.

Defaults:

| Setting | Value |
|---|---|
| BPM | 120–165 |
| Mode | Minor |
| Bars | 16 |
| Drums | Active |
| Bass | Driving pattern |
| Chords | Short stabs or pad |
| Melody | Rhythmic motif |
| FX | Impact hits later |

Generation behavior:

- Higher drum density.
- Bass on eighths or sixteenths.
- Repeating motif.
- Strong loop boundary.

## 11.6 Menu Theme Template

Purpose:

- Memorable but loopable mood-setter.

Defaults:

| Setting | Value |
|---|---|
| BPM | 70–110 |
| Mode | Major or Minor |
| Bars | 16 or 32 |
| Drums | Optional |
| Bass | Simple |
| Chords | Clear progression |
| Melody | Stronger motif |
| FX | Optional |

Generation behavior:

- More memorable melody.
- Balanced density.
- Works as repeated loop.

## 11.7 Discovery Sting Template

Purpose:

- Short cue for clue reveal, case break, or discovery.

Defaults:

| Setting | Value |
|---|---|
| BPM | Flexible |
| Mode | Major or Minor |
| Bars | 1–4 |
| Drums | None or hit |
| Bass | One accent |
| Chords | Impact chord |
| Melody | Short rise/fall |
| FX | Important later |

Generation behavior:

- Short.
- Clear start and finish.
- Not necessarily loopable.

## 11.8 Emotional Scene Template

Purpose:

- Sad, reflective, family, loss, regret, hope.

Defaults:

| Setting | Value |
|---|---|
| BPM | 55–85 |
| Mode | Minor or Major |
| Bars | 16 |
| Drums | None |
| Bass | Sparse |
| Chords | Piano/pad |
| Melody | Slow and expressive |
| FX | None initially |

Generation behavior:

- Longer notes.
- Lower density.
- Avoid harsh percussion.

## 11.9 Dark Ambient Template

Purpose:

- Atmosphere, dread, background unease.

Defaults:

| Setting | Value |
|---|---|
| BPM | 50–90 |
| Mode | Minor |
| Bars | 16 or 32 |
| Drums | None or sparse |
| Bass | Drone |
| Chords | Long pad |
| Melody | Very sparse |
| FX | Later important |

Generation behavior:

- Drones.
- Very slow changes.
- Low melodic density.

---

# 12. Generation System

## 12.1 Generation Pipeline

```text
CueSettings
  ↓
Select CueTemplate
  ↓
Resolve BPM / key / mode / bars
  ↓
Choose chord progression
  ↓
Generate sections
  ↓
Generate tracks
      ├── drums
      ├── bass
      ├── chords/pad
      └── melody/motif
  ↓
Apply intensity rules
  ↓
Create mix defaults
  ↓
Return GameCueProject
```

## 12.2 Deterministic Seed

Eventually, generation should support a seed.

Benefits:

- Same settings + same seed = same cue.
- User can save/regenerate predictably.
- Bugs are easier to reproduce.
- Variations can branch from a known base.

Initial field:

```json
"seed": 123456
```

## 12.3 Intensity Rules

Intensity scale:

```text
1 = very sparse
2 = sparse
3 = moderate
4 = active
5 = very active
```

Intensity affects:

| Area | Low Intensity | High Intensity |
|---|---|---|
| Drums | Few hits | More hits |
| Bass | Long notes | Repeating pulse |
| Chords | Long pads | Rhythmic stabs |
| Melody | Sparse motif | More notes |
| Velocity | Softer | Stronger |
| Register | Lower | Wider range |

## 12.4 Drum Generation

MVP drum generation should use simple pattern presets.

Basic drum lanes:

- Kick
- Snare
- Closed hat
- Low hit
- Perc hit

Example chase pattern:

```text
Kick:  1 . . . 2 . . . 3 . . . 4 . . .
Snare: . . . . 2 . . . . . . . 4 . . .
Hat:   x . x . x . x . x . x . x . x .
```

Example investigation pattern:

```text
Low hit: 1 . . . . . . . 3 . . . . . . .
Hat:     optional sparse ticks
```

## 12.5 Bass Generation

Bass should initially follow root notes from the chord progression.

Behavior by cue:

| Cue Type | Bass Behavior |
|---|---|
| Investigation | Sparse root pulses |
| Suspense | Repeating root ostinato |
| Chase | Driving eighth/sixteenth pattern |
| Menu | Simple root/fifth movement |
| Emotional | Long supportive notes |
| Dark Ambient | Drone |

## 12.6 Chord/Pad Generation

Chord track should use:

- Long chord pads for ambience.
- Short stabs for action/chase later.
- Root-position triads initially.
- Inversions later.

Initial chord duration:

```text
1 chord per bar or 1 chord every 2 bars
```

## 12.7 Melody/Motif Generation

Melody generation should not attempt full advanced composition at first.

MVP melody rules:

- Use scale tones.
- Use short motifs.
- Repeat with small variation.
- Prefer stepwise movement.
- Use chord tones on strong beats.
- Use rests often.
- Stay within comfortable range.

Motif example:

```text
Degree 1 -> b3 -> 4 -> 5
```

Then repeat with variation:

```text
Degree 1 -> b3 -> 4 -> b3
```

## 12.8 Variation Generation

Later system should support:

- Increase intensity.
- Decrease intensity.
- Change melody.
- Change drums.
- Change bass.
- Keep motif but alter rhythm.
- Create intro/outro from loop.

---

# 13. Playback System

## 13.1 PlaybackEngine Interface

```ts
export interface PlaybackEngine {
  loadProject(project: GameCueProject): Promise<void>;
  play(): Promise<void>;
  stop(): Promise<void>;
  pause(): Promise<void>;
  setLoop(enabled: boolean): void;
  setBpm(bpm: number): void;
  setTrackMuted(trackId: string, muted: boolean): void;
  setTrackSolo(trackId: string, solo: boolean): void;
  dispose(): Promise<void>;
}
```

## 13.2 TonePlaybackEngine

Responsibilities:

- Convert project tracks/events to Tone.js parts.
- Create basic instruments.
- Schedule playback.
- Respect BPM.
- Respect mute/solo.
- Loop over project length.
- Dispose old scheduled parts when project changes.

## 13.3 Scheduling Model

All note events use `startBeat`.

Conversion:

```text
beats -> Tone.js time
```

Example:

```ts
const toneTime = `${event.startBeat / 4}:0:0`;
```

Exact conversion can be refined once implementation begins.

## 13.4 Instrument Factory

Initial instruments:

| Instrument ID | Tone.js Type |
|---|---|
| minimal_electronic_kit | Synth/noise synth mapping |
| sub_pulse | MonoSynth |
| dark_pad | PolySynth |
| simple_lead | Synth |
| soft_pluck | Synth or PluckSynth |

---

# 14. User Interface Design

## 14.1 Initial Layout

```text
+-----------------------------------------------------+
| GameCue                                             |
| Generate loopable game music cues                   |
+----------------------+------------------------------+
| Cue Controls         | Track List                    |
| - Cue Type           | - Drums     [M] [S] [Regen]   |
| - Mood               | - Bass      [M] [S] [Regen]   |
| - BPM                | - Chords    [M] [S] [Regen]   |
| - Key                | - Melody    [M] [S] [Regen]   |
| - Intensity          |                              |
| - Bars               |                              |
| [Generate Cue]       |                              |
+----------------------+------------------------------+
| Transport: [Play] [Stop] [Loop]                     |
+-----------------------------------------------------+
| Save / Load Project                                 |
+-----------------------------------------------------+
```

## 14.2 MVP UI Components

| Component | Purpose |
|---|---|
| App | Main layout and state |
| CueControls | User selects cue settings |
| TransportControls | Play, stop, loop |
| TrackList | Displays generated tracks |
| TrackCard | Mute/solo/regenerate per track |
| SaveLoadPanel | Save/load `.gamecue.json` |
| ProjectSummary | Shows current cue details |

## 14.3 Later UI Components

| Component | Purpose |
|---|---|
| PianoRollLite | Edit melody/bass/chords |
| DrumGrid | Edit percussion |
| SectionArranger | Arrange intro/loop/outro |
| VariationPanel | Generate variations |
| ExportPanel | MIDI/WAV/stem/export options |
| PromptAssistant | AI-assisted edits later |

---

# 15. Save / Load System

## 15.1 Save

Initial web save should:

1. Serialize project to JSON.
2. Create Blob.
3. Trigger file download as `.gamecue.json`.

## 15.2 Load

Initial web load should:

1. User selects `.gamecue.json`.
2. App parses JSON.
3. Validator checks schema version and required fields.
4. Project is loaded into app state.
5. Playback engine loads project.

## 15.3 Validation

Validator should check:

- `schemaVersion` exists.
- `cue` exists.
- `tracks` is an array.
- Track IDs are unique.
- Event start/duration values are valid.
- BPM is within supported range.
- Bars is positive.

---

# 16. Export Roadmap

## 16.1 Export Phase 1

- `.gamecue.json`

## 16.2 Export Phase 2

- MIDI export

MIDI export should include:

- Tempo
- Tracks
- Note events
- Drum events mapped to General MIDI drum notes where possible

## 16.3 Export Phase 3

- WAV export

Possible approaches:

1. Browser offline rendering using Web Audio.
2. Desktop renderer later.
3. C# helper renderer.
4. JUCE renderer much later.

## 16.4 Export Phase 4

- Stem export

Stems:

```text
full_loop.wav
drums.wav
bass.wav
chords.wav
melody.wav
fx.wav
```

## 16.5 Export Phase 5

- Unity export folder

```text
Exports/
  Dark_Alley_Investigation/
    Audio/
      Dark_Alley_Investigation_loop.wav
      Dark_Alley_Investigation_drums.wav
      Dark_Alley_Investigation_bass.wav
      Dark_Alley_Investigation_pad.wav
      Dark_Alley_Investigation_melody.wav
    Midi/
      Dark_Alley_Investigation.mid
    Source/
      Dark_Alley_Investigation.gamecue.json
    README.md
```

---

# 17. Future AI Assistant

## 17.1 AI Purpose

AI should assist composition but not replace the structured project model.

The AI should generate structured edits, not only black-box audio.

Examples:

```text
Make this darker.
Make this more like a chase.
Add a sad piano motif.
Regenerate the bass but keep the rhythm.
Make a higher intensity variation.
Create a discovery sting from this motif.
```

## 17.2 AI Output Format

AI should output structured instructions:

```json
{
  "operation": "regenerateTrack",
  "trackType": "melody",
  "constraints": {
    "mood": "sad",
    "density": "low",
    "preserveMotif": true
  }
}
```

or:

```json
{
  "operation": "updateCueSettings",
  "changes": {
    "mood": "darker",
    "intensity": 4
  }
}
```

## 17.3 Guardrails

AI should not be responsible for:

- Directly mutating state without validation.
- Producing unstructured project files.
- Bypassing schema validation.
- Replacing deterministic core generation.

---

# 18. Future C# and JUCE Strategy

## 18.1 C# Comfort Path

Because C# is more comfortable for long-term development, the project should allow future C# tooling.

Possible future projects:

```text
GameCue.Core.CSharp
GameCue.Export.CSharp
GameCue.Desktop
GameCue.BatchRenderer
```

C# could handle:

- Batch export
- Project validation
- Unity folder generation
- MIDI export
- Desktop app UI
- File management

## 18.2 JUCE Strategy

Do not begin with JUCE.

JUCE should only be considered if the project later needs:

- Higher-quality native audio rendering.
- Plugin-style architecture.
- Better synth/effect engine.
- Professional audio performance.
- Native desktop audio engine.

If used, JUCE should be a renderer backend, not the brain.

```text
.gamecue.json
  ↓
GameCue JUCE Renderer
  ↓
WAV / stems
```

## 18.3 No Full JUCE Replacement

The project should not attempt to build a full JUCE equivalent.

Instead, it should build a focused **GameCue Audio Layer** that serves this app’s needs.

---

# 19. Testing Strategy

## 19.1 Unit Tests

Test:

- Scale generation.
- Chord generation.
- Cue template selection.
- Project generation.
- Event timing.
- Save/load serialization.
- Track regeneration behavior.
- Validator behavior.

## 19.2 Manual Tests

For every ticket, include a manual verification walkthrough.

Example:

```text
1. Run app.
2. Select Investigation.
3. Set key to D minor.
4. Generate cue.
5. Press Play.
6. Confirm audio plays.
7. Mute bass.
8. Confirm bass stops.
9. Save project.
10. Reload project.
11. Confirm settings and tracks restore.
```

## 19.3 Audio Sanity Tests

Because audio can be subjective, early tests should focus on:

- No crashes.
- Playback starts/stops correctly.
- Tracks are audible.
- Muting works.
- Loop timing is not obviously broken.
- Generated notes are in key.
- Events do not exceed cue length.

---

# 20. Coding Standards

## 20.1 General

- Use TypeScript strict mode.
- Prefer small pure functions in core generation code.
- Keep playback side effects out of generation functions.
- Keep project schema stable and versioned.
- Avoid global mutable state.
- Avoid hardcoding UI strings inside generation logic.
- Use clear file names.

## 20.2 TypeScript

- Use interfaces/types for all project entities.
- Avoid `any` unless temporary and documented.
- Prefer discriminated unions where helpful.
- Keep model files simple and dependency-light.
- Generator functions should accept settings and return data, not mutate UI state.

## 20.3 React

- Keep components small.
- Keep app state centralized enough to understand.
- Avoid complex state libraries until needed.
- Use controlled form inputs.
- Use clear props.
- Avoid mixing Tone.js code directly in UI components.

## 20.4 Tone.js

- All Tone.js logic should live under `src/playback/tone`.
- Dispose old Tone objects when regenerating/loading.
- Do not store Tone.js objects in saved project files.
- Do not make Tone.js the source of truth.

---

# 21. Implementation Tickets

## T0001 — Project Skeleton

Create Vite + React + TypeScript project.

Acceptance:

- App runs locally.
- Basic GameCue heading appears.
- Folder structure created.
- TypeScript strict mode enabled.

Manual verification:

```text
npm install
npm run dev
Open local app
Confirm GameCue heading appears
```

## T0002 — Core Project Model

Create TypeScript model files.

Acceptance:

- GameCueProject, CueSettings, Section, Track, NoteEvent, MixSettings exist.
- Types compile.
- Example project object can be created.

Manual verification:

```text
Run type check
Confirm no TypeScript errors
```

## T0003 — Cue Controls UI

Create basic form controls.

Acceptance:

- User can select cue type.
- User can select mood.
- User can set BPM.
- User can set key/mode.
- User can set intensity.
- User can set bars.

Manual verification:

```text
Change each control
Confirm state updates visually
```

## T0004 — Music Theory Helpers

Implement scales, chords, and basic progression resolution.

Acceptance:

- Can generate major/minor scales.
- Can map scale degrees to notes.
- Can generate triads.
- Can resolve basic progressions.

Manual verification:

```text
Generate D minor scale
Confirm notes are D E F G A Bb C
Generate i-VI-III-VII in D minor
Confirm reasonable chords
```

## T0005 — Cue Template System

Implement cue templates.

Acceptance:

- Initial cue templates exist.
- Template can be selected by cue type.
- Defaults can populate settings.

Manual verification:

```text
Select Investigation
Confirm default BPM/mode/bars are reasonable
Select Chase
Confirm faster BPM defaults
```

## T0006 — Project Generation

Generate a basic project from cue settings.

Acceptance:

- Generate button creates sections and tracks.
- Drums, bass, chords, melody tracks are created.
- Events stay within cue length.
- Notes follow key/mode.

Manual verification:

```text
Generate Investigation cue
Confirm four tracks appear
Generate Chase cue
Confirm more active patterns
```

## T0007 — Tone.js Playback Engine

Implement playback.

Acceptance:

- Project loads into Tone playback engine.
- Play starts audio.
- Stop stops audio.
- Loop works over cue length.

Manual verification:

```text
Generate cue
Press Play
Confirm audio plays
Press Stop
Confirm audio stops
Enable loop
Confirm cue repeats
```

## T0008 — Track Controls

Add mute, solo, and regenerate per track.

Acceptance:

- Track list displays each track.
- Mute works.
- Solo works.
- Regenerate selected track replaces only that track unless locked.

Manual verification:

```text
Play cue
Mute bass
Confirm bass disappears
Solo melody
Confirm only melody plays
Regenerate melody
Confirm other tracks remain
```

## T0009 — Save / Load Project

Implement `.gamecue.json` save/load.

Acceptance:

- User can save project.
- User can load project.
- Loaded project restores cue settings and tracks.
- Invalid file shows safe error.

Manual verification:

```text
Generate cue
Save file
Refresh app
Load file
Confirm cue returns
```

## T0010 — MVP Polish

Add basic styling and usability fixes.

Acceptance:

- Layout is usable.
- Buttons are clear.
- Track cards are readable.
- Errors are shown clearly.
- README has run instructions.

Manual verification:

```text
Open app
Generate cue
Play it
Save/load it
Confirm no confusing dead ends
```

---

# 22. Post-MVP Roadmap

## T0011 — MIDI Export

Add MIDI export support.

## T0012 — Piano Roll Lite

Simple note editing for melody/bass/chords.

## T0013 — Drum Grid

Step sequencer-style drum editing.

## T0014 — Section Arranger

Intro, loop A, loop B, outro.

## T0015 — Variation Generator

Generate low/medium/high intensity variations.

## T0016 — Unity Export Folder

Export organized game-ready folder.

## T0017 — Browser WAV Export

Attempt browser-based loopable WAV rendering.

## T0018 — Desktop Packaging

Wrap with Tauri if needed.

## T0019 — C# Export Helper

Create optional .NET utility for project validation/export.

## T0020 — AI Assistant Prototype

Structured prompt-to-edit commands.

---

# 23. Risks and Mitigations

## 23.1 Scope Creep

Risk:

- Project becomes a full DAW.

Mitigation:

- Keep MVP focused on generated game cues.
- Add editing only after generation/playback works.

## 23.2 Bad Sound Quality

Risk:

- Synth placeholders sound weak.

Mitigation:

- Accept basic sounds for MVP.
- Improve instruments later.
- Add export to MIDI so cues can be refined in external tools.

## 23.3 Audio Timing Bugs

Risk:

- Loops do not line up.

Mitigation:

- Use beat-based event timing.
- Keep loop lengths bar-aligned.
- Test simple 8/16 bar loops first.

## 23.4 Engine Lock-In

Risk:

- Tone.js becomes too embedded.

Mitigation:

- Keep project model independent.
- Keep Tone.js in adapter layer only.

## 23.5 Overbuilding Future JUCE Support

Risk:

- Time wasted designing for a future we may not need.

Mitigation:

- Only preserve clean boundaries.
- Do not implement JUCE until there is a real need.

---

# 24. Definition of Done for MVP

MVP is done when:

- User can open the app.
- User can pick a cue type and settings.
- User can generate a loopable cue.
- User can play/stop/loop the cue.
- User can hear separate track types.
- User can mute/solo tracks.
- User can regenerate at least one selected track.
- User can save and load `.gamecue.json`.
- Code has clear project model and generation/playback boundaries.
- README explains how to run it.
- The app is useful enough to generate early music ideas for a game prototype.

---

# 25. Open Questions

These can be answered during implementation:

1. Should the first UI use tabs or a single page?
2. Should default key be D minor or C minor?
3. Should generated melody be enabled by default for ambient cues?
4. Should drums be disabled by default for emotional/dark ambient cues?
5. What should the first real game target be: Case Theory, DumpLens UI ambience, or a generic test scene?
6. Should the project eventually use a desktop-first C# UI, or keep web/Tauri as the main app?
7. Should exported files follow Unity naming conventions from the beginning?
8. How soon should MIDI export be added?
9. Should style templates include specific references like “detective noir,” “sci-fi,” “southern gothic,” or keep generic labels?

---

# 26. Immediate Next Step

The next implementation step is:

```text
T0001 — Project Skeleton
```

Suggested Codex prompt:

```text
We are starting the GameCue project from the design document. Implement T0001 only.

Goal:
Create a Vite + React + TypeScript project skeleton for GameCue.

Requirements:
- Use TypeScript strict mode.
- Create the initial folder structure under src:
  - app
  - core/model
  - core/theory
  - core/templates
  - core/generation
  - core/serialization
  - playback
  - playback/tone
  - ui/controls
  - ui/tracks
  - ui/project
  - ui/shared
- Create a simple App.tsx that displays:
  - GameCue
  - Generate loopable game music cues
  - Placeholder sections for Cue Controls, Track List, Transport, and Save/Load
- Do not implement Tone.js playback yet.
- Do not implement generation yet.
- Add README run instructions.
- Ensure npm run dev works.
- Ensure npm run build works.

After implementation, provide:
- Files changed
- How to run
- Manual verification steps
```

---

# 27. Design Decision Log

## D0001 — Start With Tone.js

Decision:

- Start with React + TypeScript + Tone.js.

Reason:

- Fastest way to get playable generated music in a browser.
- Easier for Codex-assisted development than C++ audio programming.

## D0002 — Project Model Is Engine-Agnostic

Decision:

- `.gamecue.json` is the source of truth, not Tone.js objects.

Reason:

- Allows future C#, Tauri, or JUCE support.

## D0003 — Game Cues Over Full Songs

Decision:

- Focus on loopable game cues, stingers, and variations.

Reason:

- Directly supports game development.
- Avoids full DAW complexity.

## D0004 — No JUCE at MVP

Decision:

- Do not use JUCE in the first version.

Reason:

- C++ and native audio complexity would slow us down.

## D0005 — C# Remains a Future Option

Decision:

- Preserve a future path for C# helper tools or desktop app.

Reason:

- User is more comfortable with C#.
- C# can support export, validation, Unity workflows, and batch tooling.

---

# 28. Glossary

| Term | Meaning |
|---|---|
| Cue | A short piece of game music for a specific purpose |
| Loop | Audio designed to repeat seamlessly |
| Stinger | Short musical hit or transition |
| Stem | Separate exported track, such as drums or bass |
| BPM | Beats per minute |
| Key | Tonal center, such as D minor |
| Mode | Major/minor or other scale type |
| Motif | Short musical idea |
| Ostinato | Repeating musical pattern |
| Pad | Sustained background harmony |
| Renderer | System that converts project data into audio |
| Tone.js | Browser audio framework used for MVP playback |
| JUCE | Native C++ audio framework considered only for later rendering |

---

# 29. Summary

GameCue should begin as a fast, focused, browser-based game music cue generator. The first version should not attempt to be a DAW, a JUCE replacement, or a full AI song generator. It should generate editable, loopable music cues for game development using a clean project model, simple music theory helpers, cue templates, and Tone.js playback.

The most important long-term decision is to keep the project format independent of the playback engine. If the `.gamecue.json` model remains the source of truth, GameCue can start simple and later grow into MIDI export, WAV rendering, desktop packaging, C# tools, or a JUCE renderer without a full rewrite.
