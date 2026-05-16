---
name: gamecue-audio-playback
description: Use for GameCue playback engine, Tone.js adapter, scheduling, transport controls, mute/solo, looping, and audio cleanup work.
---

# GameCue Audio Playback

Use this skill for tickets involving playback interfaces, Tone.js instruments, Tone.js scheduling, play/stop/loop controls, mute/solo, disposal safety, audio timing, or playback bugs.

## Required Context

Before coding, review the relevant parts of:

- `AGENTS.md`
- `docs/GameCue_Full_Design_Document.md`
- `docs/GameCue_MVP_Technical_Design.md`
- `docs/Tickets.md`
- Existing files under `src/playback/`
- Any project model files under `src/core/model/` needed for playback mapping

## Hard Boundary

Tone.js belongs only in the playback adapter layer.

Tone.js imports are allowed under:

```text
src/playback/tone/
```

Tone.js imports are not allowed in:

```text
src/core/
src/ui/
```

unless a ticket explicitly changes architecture and the design docs are updated.

## Source-of-Truth Rule

- Project data drives playback.
- Tone.js objects are runtime implementation details only.
- Do not store Tone.js objects in `GameCueProject` or `.gamecue.json` data.
- Do not make the current Tone.js transport/synth state the authoritative project state.

## Playback Behavior Rules

- Respect project BPM.
- Respect cue loop length.
- Respect track mute/solo state when available.
- Convert beat-based events into scheduled playback times in the adapter layer.
- Avoid duplicate scheduling when play is pressed repeatedly.
- Stop should reliably stop audible playback.
- Regenerate/load should not leave stale scheduled notes playing.
- Dispose or reuse Tone.js resources deliberately.
- Avoid memory leaks from repeated play/stop/regenerate cycles.

## Browser Audio Rules

- Assume audio start may require a user gesture.
- Handle Tone.js start/resume failures gracefully.
- Do not crash the app if audio cannot start.
- Surface a useful error or state when playback fails.

## UI Boundary Rules

UI components may trigger playback actions, but should not contain:

- Tone.js scheduling logic
- Instrument construction
- Transport cleanup logic
- Low-level audio graph setup

Prefer delegating to:

- `src/playback/PlaybackEngine.ts`
- `src/playback/tone/TonePlaybackEngine.ts`
- `src/playback/tone/toneInstruments.ts`
- `src/playback/tone/toneScheduler.ts`

## Testing and Verification Guidance

Automated tests may focus on adapter-independent behavior when practical. Manual verification should check:

- Play starts audio after a user click.
- Stop silences playback.
- Repeated play/stop does not stack audio.
- Looping feels correct for the cue length.
- Mute/solo works if implemented.
- Browser console has no fatal Tone.js errors.

## Completion Report Additions

In addition to the standard report, include:

- Where Tone.js imports exist
- How cleanup/disposal is handled
- Manual audio verification steps
- Known browser audio limitations
