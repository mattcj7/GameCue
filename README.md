# GameCue

GameCue is a lightweight tool for generating loopable game music cues for games.

## Current Status

`T0001 — Project Skeleton` is implemented.

The app currently provides a Vite + React + TypeScript shell with placeholder sections for:

- Cue Controls
- Track List
- Transport
- Save / Load

No playback, music generation, save/load behavior, export flow, or project schema is implemented yet.

## MVP Direction

GameCue starts with:

- React
- TypeScript
- Vite
- Engine-agnostic project data

Tone.js playback is intentionally deferred to later playback tickets. The long-term architecture keeps `.gamecue.json` project data as the source of truth.

## Setup

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

Open the local URL shown by Vite.

## Build

```bash
npm run build
```

## Run Tests

```bash
npm test
```

## Preview Production Build

```bash
npm run preview
```

## Current Non-Goals

T0001 does not implement:

- Tone.js playback
- Audio scheduling
- Music generation
- Project model/schema types
- Save/load behavior
- MIDI or WAV export
- AI assistant features
- Editing tools

## Manual Verification for T0001

1. Run `npm install`.
2. Run `npm run dev`.
3. Open the local Vite URL.
4. Confirm the `GameCue` heading appears.
5. Confirm `Generate loopable game music cues` appears.
6. Confirm the placeholder sections appear:
   - `Cue Controls`
   - `Track List`
   - `Transport`
   - `Save / Load`
7. Confirm there are no fatal browser console errors.
8. Stop the dev server.
9. Run `npm run build`.
10. Confirm the build succeeds.
