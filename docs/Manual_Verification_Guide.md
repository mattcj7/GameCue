# GameCue Manual Verification Guide

**Project:** GameCue  
**Version:** 0.1  
**Status:** Draft / Living Guide  
**Purpose:** Provide repeatable manual checks after each Codex ticket so GameCue stays stable while being built one small ticket at a time.

---

# 1. Purpose

This guide defines how to manually verify GameCue after each ticket.

Manual verification matters because many GameCue features involve:

- Browser behavior
- UI state
- Audio playback
- File downloads
- File uploads
- Generated music structure
- User-perceived behavior

Automated tests are useful, but they will not catch every bad UI, audio, or workflow problem.

---

# 2. Verification Philosophy

Every ticket should end with:

```text
Build/test check
  ↓
Manual browser check
  ↓
Ticket-specific verification
  ↓
Regression smoke test if needed
  ↓
Result recorded
```

The goal is not to do a massive QA cycle after every small ticket.

The goal is to answer:

> Did this ticket work, and did it break anything obvious?

Most ticket checks should take **5–10 minutes**.

---

# 3. Standard Verification Result Template

Use this after each ticket.

```text
Manual Verification Result

Ticket:
[ID + title]

Date:
[date]

Branch:
[branch name]

Commands run:
- [command]
- [command]

Result:
- Build: pass/fail
- Tests: pass/fail/not present
- Browser verification: pass/fail
- Audio verification: pass/fail/not applicable
- Save/load verification: pass/fail/not applicable
- Export verification: pass/fail/not applicable

What I checked:
1. [step]
2. [step]
3. [step]

Issues found:
- [issue or none]

Screenshots/audio notes:
- [optional]

Recommendation:
- Ready for next ticket
- Needs bugfix
- Needs design review
- Needs docs update
```

---

# 4. Standard Commands

## 4.1 Install

Run when dependencies change or on fresh clone:

```bash
npm install
```

Expected:

```text
Dependencies install without fatal errors.
```

Failure signs:

- Package conflict
- Missing package
- Node version issue
- Install script failure

---

## 4.2 Development Server

Run for browser verification:

```bash
npm run dev
```

Expected:

```text
Vite dev server starts and shows a local URL.
```

Failure signs:

- Dev server fails to start
- Port conflict that does not recover
- TypeScript/Vite fatal error
- Blank page with console errors

---

## 4.3 Production Build

Run after every implementation ticket:

```powershell
npm.cmd run build
```

Expected:

```text
Build succeeds without TypeScript errors.
```

If `npm.cmd` is not on `PATH`, use:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' run build
```

If `npm` is unavailable but `node_modules` exists, use:

```powershell
& .\node_modules\.bin\tsc.cmd -b
& .\node_modules\.bin\vite.cmd build
```

Notes:

```text
PowerShell blocking npm.ps1 is not a code failure.
Missing npm on PATH is not a code failure.
Raw Node ESM imports against TypeScript source files may not match Vite/TypeScript module resolution.
Always record which verification command was used.
```

Failure signs:

- TypeScript errors
- Missing imports
- Broken paths
- Build output fails

---

## 4.4 Tests

When tests exist:

```bash
npm test
```

or the project-specific test command listed in README.

Expected:

```text
Relevant tests pass.
```

Failure signs:

- Failing unit tests
- Snapshot mismatches
- Test runner not configured
- Tests hanging

---

# 5. Browser Verification Basics

## 5.1 Open the App

1. Run:

```bash
npm run dev
```

2. Open the local URL.
3. Confirm the page loads.

Expected:

```text
GameCue app appears without fatal console errors.
```

Failure signs:

- Blank white page
- Error overlay
- Console errors
- Missing layout sections
- Buttons not visible

---

## 5.2 Browser Console Check

Open developer tools and check the console.

Expected:

```text
No uncaught runtime errors.
```

Warnings may be acceptable early, but should be noted.

Failure signs:

- Uncaught exceptions
- React hook errors
- Failed module loading
- Repeated errors during playback or regeneration

---

# 6. Universal Smoke Test

Run this after most tickets once the app exists.

## Smoke Test A — App Opens

1. Run `npm run dev`.
2. Open app.
3. Confirm GameCue title appears.
4. Confirm main sections are visible.

Expected:

```text
App loads and basic UI is visible.
```

## Smoke Test B — Build Still Works

1. Stop dev server.
2. Run `npm run build`.

Expected:

```text
Build succeeds.
```

## Smoke Test C — No Obvious Console Errors

1. Open app in browser.
2. Open console.
3. Interact with visible controls.
4. Confirm no uncaught errors.

Expected:

```text
No app-breaking console errors.
```

---

# 7. Phase-Based Verification

## 7.1 Phase 1 — App Skeleton / UI

Use for:

```text
T0001–T0004
```

### Checklist

1. Run `npm install` if needed.
2. Run `npm run dev`.
3. Open the app.
4. Confirm title and description appear.
5. Confirm expected sections appear:
   - Cue Controls
   - Track List
   - Transport
   - Save/Load
6. Interact with any available controls.
7. Confirm UI state updates.
8. Run `npm run build`.

### Expected Result

```text
App displays a usable shell and builds successfully.
```

### Failure Signs

- Missing sections
- Broken layout
- Controls do not update
- Build failure
- Console errors

---

## 7.2 Phase 2 — Music Brain / Generation

Use for:

```text
T0005–T0012
```

### Checklist

1. Run tests if available.
2. Run `npm run build`.
3. Run app.
4. Select a cue type.
5. Select key/mode.
6. Set intensity.
7. Generate cue if button exists.
8. Confirm tracks appear.
9. Confirm event counts are reasonable.
10. Confirm different cue types produce different densities.

### Expected Result

```text
Generated project data appears valid, cue-specific, and engine-agnostic.
```

### Failure Signs

- Generated project is empty
- Tracks missing
- Event timings exceed cue length
- Notes obviously outside expected key
- All cue types generate identical data
- Build/test failure

---

## 7.3 Phase 3 — Playback

Use for:

```text
T0013–T0018
```

### Checklist

1. Run `npm run build`.
2. Run `npm run dev`.
3. Open app.
4. Generate cue.
5. Press Play.
6. Confirm audio starts.
7. Press Stop.
8. Confirm audio stops.
9. Enable Loop.
10. Confirm cue repeats.
11. Mute one track.
12. Confirm that track disappears from playback.
13. Solo one track.
14. Confirm only soloed track plays.
15. Generate another cue while audio is playing.
16. Confirm old audio does not continue underneath.

### Expected Result

```text
Playback starts, stops, loops, and responds to track controls without overlapping old audio.
```

### Failure Signs

- No audio after user interaction
- Audio keeps playing after Stop
- Multiple cues overlap
- Mute does nothing
- Solo does nothing
- Console errors from Tone.js
- Browser locks up or audio becomes distorted

### Audio Notes

Browser audio usually requires a user interaction before sound can start. If playback fails before clicking a button, that may be normal. If playback fails after clicking Play, it is a bug.

---

## 7.4 Phase 4 — Save / Load

Use for:

```text
T0019–T0023
```

### Checklist

1. Run `npm run build`.
2. Run app.
3. Generate cue.
4. Save `.gamecue.json`.
5. Open file in text editor.
6. Confirm readable JSON.
7. Confirm schema version exists.
8. Refresh app.
9. Load saved file.
10. Confirm cue settings restore.
11. Confirm tracks restore.
12. Try loading an invalid file.
13. Confirm error appears and app does not crash.
14. Confirm previous project remains if invalid load fails.

### Expected Result

```text
Project saves as valid JSON and reloads safely.
```

### Failure Signs

- Save button does nothing
- File extension is wrong
- JSON is malformed
- Loaded project differs from saved project
- Invalid file crashes app
- Failed load clears current project

---

## 7.5 Phase 5 — Regeneration / Variations

Use for:

```text
T0024–T0028
```

### Checklist

1. Generate cue.
2. Record visible event counts or track summaries.
3. Regenerate melody only.
4. Confirm melody changes.
5. Confirm other tracks remain unchanged.
6. Lock a track.
7. Generate variation.
8. Confirm locked track remains.
9. Create lower intensity variation.
10. Confirm less density.
11. Create higher intensity variation.
12. Confirm more density.
13. Press Play after changes if playback exists.

### Expected Result

```text
Regeneration changes only the intended musical data and respects locked tracks.
```

### Failure Signs

- Regenerating melody changes drums/bass unexpectedly
- Locked tracks change
- Variations ignore intensity
- Playback does not reflect regenerated data
- Save/load loses lock state if lock is intended to persist

---

## 7.6 Phase 6 — Game Export

Use for:

```text
T0029–T0034
```

### Checklist

1. Generate cue.
2. Export requested file type.
3. Confirm file downloads.
4. Confirm filename is safe and descriptive.
5. Open exported file if possible.
6. Confirm metadata matches current cue.
7. For MIDI, open in a MIDI viewer/DAW if available.
8. Confirm tempo and tracks are reasonable.
9. Confirm export does not require Tone.js runtime state unless explicitly designed.

### Expected Result

```text
Exports are created from project data and are usable outside the app.
```

### Failure Signs

- Export button does nothing
- File is empty
- Metadata does not match project
- MIDI has no notes
- MIDI tempo wrong
- Browser crashes during export
- Export uses unsafe filenames

---

## 7.7 Phase 7 — Editing Tools

Use for:

```text
T0035–T0040
```

### Checklist

1. Generate cue.
2. Open note viewer/editor.
3. Select melody track.
4. Confirm notes appear.
5. Edit a note if editing exists.
6. Press Play.
7. Confirm audible change.
8. Save project.
9. Reload project.
10. Confirm edit persists.
11. Repeat for bass or drums if relevant.

### Expected Result

```text
Manual edits update project data, affect playback, and persist through save/load.
```

### Failure Signs

- Notes display at wrong positions
- Edits do not affect playback
- Edits are lost after save/load
- Drum grid toggles wrong lane
- UI becomes hard to use or DAW-like too early

---

## 7.8 Phase 8 — Polish / Better Sounds

Use for:

```text
T0041–T0046
```

### Checklist

1. Generate several cue types.
2. Listen to each.
3. Adjust mixer/effect controls if available.
4. Confirm playback changes.
5. Save/load if settings are persistent.
6. Resize browser.
7. Confirm layout remains usable.
8. Check console for repeated audio/effect errors.

### Expected Result

```text
The app becomes more usable or better sounding without breaking existing workflows.
```

### Failure Signs

- Better sounds cause performance issues
- Effects stack repeatedly after play/stop
- Mixer settings do not persist when expected
- UI polish breaks layout
- Track controls become confusing

---

## 7.9 Phase 9 — AI Assistant Later

Use for:

```text
T0047–T0050
```

### Checklist

1. Generate cue.
2. Enter or provide structured command.
3. Confirm command is validated.
4. Confirm invalid command is rejected.
5. Apply valid command.
6. Confirm project updates safely.
7. Confirm locked tracks are respected.
8. Confirm no unreviewed destructive edit occurs.

### Expected Result

```text
AI-assisted edits operate through validated structured commands, not unguarded project mutation.
```

### Failure Signs

- Invalid command applies anyway
- Project corrupts
- Locked tracks change
- AI output bypasses validation
- App crashes on malformed input

---

# 8. Ticket-Specific Verification Quick Reference

| Ticket | Main Manual Check |
|---|---|
| T0001 | App skeleton loads and builds |
| T0002 | Model types compile and are JSON-compatible |
| T0003 | Layout is readable |
| T0004 | Cue controls update state |
| T0005 | Scales/chords resolve correctly |
| T0006 | Cue templates exist and defaults make sense |
| T0007 | Chord progression fits selected key/mode |
| T0008 | Drum density changes by cue/intensity |
| T0009 | Bass follows chord roots and cue behavior |
| T0010 | Chord/pad events generate with valid timing |
| T0011 | Melody uses key/mode and motif logic |
| T0012 | Full project generates tracks and events |
| T0013 | Playback interface is engine-agnostic |
| T0014 | Tone imports isolated to playback/tone |
| T0015 | Scheduler loads project without errors |
| T0016 | Play/stop/loop works |
| T0017 | Mute/solo works |
| T0018 | Regenerate/reload does not overlap audio |
| T0019 | Project serializes to readable JSON |
| T0020 | Invalid project data is rejected |
| T0021 | Save downloads `.gamecue.json` |
| T0022 | Saved project reloads correctly |
| T0023 | Invalid file shows error without crash |
| T0024 | Selected track regeneration is isolated |
| T0025 | Locked tracks are preserved |
| T0026 | Intensity variations change density |
| T0027 | Variation is distinct but related |
| T0028 | Motif is recognizable across variation |
| T0029 | MIDI exports and contains notes |
| T0030 | Unity export plan is documented |
| T0031 | Metadata export matches cue |
| T0032 | WAV export feasibility is documented |
| T0033 | Loop boundary validation catches errors |
| T0034 | Stem export design is clear |
| T0035 | Piano roll-lite design avoids DAW scope |
| T0036 | Read-only note viewer displays notes |
| T0037 | Melody edits affect playback and persist |
| T0038 | Bass edits affect playback and persist |
| T0039 | Drum grid design is small and clear |
| T0040 | Drum grid edits affect playback and persist |
| T0041 | Better presets improve sound without breaking |
| T0042 | Mixer controls affect playback |
| T0043 | Mixer settings save/load correctly |
| T0044 | Reverb presets work without buildup |
| T0045 | Delay presets work without buildup |
| T0046 | UI polish improves usability |
| T0047 | AI command schema is structured |
| T0048 | Prompt converts to proposed structured edit |
| T0049 | Valid structured edit applies safely |
| T0050 | Invalid AI commands are rejected |

---

# 9. Regression Packs

Use these after higher-risk work.

## 9.1 Basic Regression Pack

Use after most implementation tickets.

```text
1. npm run build
2. npm run dev
3. App opens
4. No console crash
5. Main UI visible
```

## 9.2 Generation Regression Pack

Use after core generation changes.

```text
1. Generate Investigation cue
2. Generate Chase cue
3. Confirm tracks exist
4. Confirm Chase is more active
5. Confirm events stay within cue length
6. Build passes
```

## 9.3 Playback Regression Pack

Use after playback/audio changes.

```text
1. Generate cue
2. Play
3. Stop
4. Loop
5. Mute bass
6. Solo melody
7. Regenerate while playing
8. Confirm no overlapping old audio
9. Check console
```

## 9.4 Save / Load Regression Pack

Use after save/load/model changes.

```text
1. Generate cue
2. Save project
3. Refresh app
4. Load project
5. Confirm settings and tracks restore
6. Try invalid file
7. Confirm safe error
```

## 9.5 Export Regression Pack

Use after export changes.

```text
1. Generate cue
2. Export target file
3. Confirm file downloads
4. Open file externally if possible
5. Confirm data matches project
```

---

# 10. Failure Handling

## 10.1 Build Fails

Use the build failure prompt from `docs/Codex_Prompt_Playbook.md`.

Do not continue to the next feature ticket until build is fixed.

## 10.2 Tests Fail

Fix failing tests before moving on unless the test failure is unrelated and documented.

## 10.3 Manual Verification Fails

Create a bugfix prompt with:

- Ticket ID
- What failed
- Expected behavior
- Actual behavior
- Console output
- Screenshots/audio notes if helpful

## 10.4 Audio Verification Is Unclear

Check:

- Did you click a user-initiated Play button?
- Is browser tab muted?
- Is system volume muted?
- Is audio blocked by browser permissions?
- Are there console errors?
- Does Stop actually stop all audio?
- Does regenerating create duplicate playback?

If unsure, document exactly what happened.

---

# 11. Done Criteria

A ticket is ready to close when:

- Requirements are implemented.
- Non-goals were not implemented.
- Build passes.
- Tests pass if present.
- Manual verification passes.
- Scope stayed within ticket.
- Completion report lists files changed and commands run.
- Any follow-up work is documented instead of silently added.

---

# 12. When To Ask For Design Review

Pause for design review if a ticket appears to require:

- New project file schema field
- New dependency
- Architecture change
- Moving core/playback boundaries
- Major UI pattern change
- Export format decision
- C# / Tauri / JUCE decision
- AI provider integration
- Full DAW-like feature expansion

Use `docs/Codex_Prompt_Playbook.md` design decision prompt.

---

# 13. Recommended Local Routine Per Ticket

For each ticket:

```text
1. Create/switch ticket branch.
2. Give Codex one ticket prompt.
3. Let Codex implement.
4. Run npm install if dependencies changed.
5. Run npm run build.
6. Run tests if present.
7. Run npm run dev.
8. Perform manual verification.
9. Paste results back into planning chat.
10. Decide bugfix, docs update, or next ticket.
```

---

# 14. Example Completed Verification

```text
Manual Verification Result

Ticket:
T0001 — Project Skeleton

Date:
2026-05-15

Branch:
gamecue/t0001-project-skeleton

Commands run:
- npm install
- npm run dev
- npm run build

Result:
- Build: pass
- Tests: not present
- Browser verification: pass
- Audio verification: not applicable
- Save/load verification: not applicable
- Export verification: not applicable

What I checked:
1. App opened in browser.
2. GameCue heading displayed.
3. Cue Controls, Track List, Transport, and Save/Load placeholders displayed.
4. No console crash.
5. Production build succeeded.

Issues found:
- None.

Recommendation:
- Ready for T0002.
```

---

# 15. Summary

Manual verification should stay simple, consistent, and tied to ticket scope.

The rule is:

```text
Do not move to the next ticket until the current ticket builds and passes its manual verification.
```

This keeps GameCue stable while we build it one small Codex ticket at a time.
