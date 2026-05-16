# GameCue Starter Skills Reference

**Project:** GameCue  
**Version:** 0.1  
**Status:** Draft / Planning Reference  
**Purpose:** List the starter project-specific skills we may create or reference when writing Codex prompts for GameCue.

---

# 1. How To Use This Document

This document is a planning reference for GameCue prompt creation.

Use it when deciding:

- Which skill a Codex prompt should reference.
- Whether a new skill is worth creating.
- What rules a skill should enforce.
- How to keep Codex working one small ticket at a time.
- How to prevent architecture drift and scope creep.

This file does **not** mean all skills must be created immediately.

The recommended approach is:

```text
Start with docs + AGENTS.md
  ↓
Use normal Codex prompts for early tickets
  ↓
Create skills only when repeated patterns emerge
  ↓
Keep skills small and purpose-specific
```

---

# 2. Skill Strategy

## 2.1 Why Use Skills?

Skills help Codex stay consistent across repeated work.

For GameCue, skills should help enforce:

- One-ticket-at-a-time implementation.
- Tone.js isolation.
- Engine-agnostic core logic.
- `.gamecue.json` as the source of truth.
- Manual verification after each ticket.
- Clear completion reports.
- No full DAW scope creep.

## 2.2 When To Create a Skill

Create a skill when:

- We repeat the same prompt rules often.
- Codex starts drifting on architecture boundaries.
- A category of work becomes common.
- A specialized workflow needs extra guardrails.
- Verification steps become consistent enough to standardize.

Do **not** create a skill just because it sounds cool.

## 2.3 Starter Skill Folder Pattern

Suggested structure:

```text
.codex/
  skills/
    gamecue-ticket-runner/
      SKILL.md
    gamecue-design-check/
      SKILL.md
    gamecue-core-generation/
      SKILL.md
    gamecue-audio-playback/
      SKILL.md
    gamecue-save-load/
      SKILL.md
    gamecue-export/
      SKILL.md
    gamecue-ui/
      SKILL.md
    gamecue-manual-verification/
      SKILL.md
    gamecue-doc-updater/
      SKILL.md
```

---

# 3. Starter Skills List

## 3.1 gamecue-ticket-runner

**Purpose:** General-purpose skill for implementing one GameCue ticket at a time.

Use for:

- Normal implementation tickets.
- Small feature work.
- Ticketed bugfixes.
- Ticketed refactors.

Should enforce:

- Read docs first.
- Implement one ticket only.
- Stay in allowed areas.
- Respect do-not-touch areas.
- Do not implement future tickets.
- Provide completion report.
- Provide manual verification steps.

Best for tickets:

```text
T0001 — Project Skeleton
T0002 — Core Project Model
T0003 — Basic App Layout
T0004 — Cue Controls UI
T0012 — Full Project Generator
T0024 — Regenerate Selected Track
```

Prompt add-on:

```text
Use the gamecue-ticket-runner skill if available. Implement this ticket only and follow docs/Tickets.md exactly.
```

---

## 3.2 gamecue-design-check

**Purpose:** Check proposed work against GameCue design docs before or after implementation.

Use for:

- Architecture review.
- Scope creep checks.
- Ticket completion review.
- Design decision validation.
- Checking whether a change belongs now or later.

Should enforce:

- Compare work against design docs.
- Identify scope creep.
- Identify architecture violations.
- Identify docs that need updating.
- Recommend whether to proceed, defer, or create a new ticket.

Best for:

```text
Before starting playback work
Before changing project schema
Before adding a dependency
After a large ticket report
When deciding C# / Tauri / JUCE timing
```

Prompt add-on:

```text
Use the gamecue-design-check skill if available. Review this proposed change against the design docs and ticket scope.
```

---

## 3.3 gamecue-core-generation

**Purpose:** Guide music theory and generation work.

Use for:

- Scales.
- Chords.
- Cue templates.
- Drum generation.
- Bass generation.
- Chord/pad generation.
- Melody/motif generation.
- Variation generation.

Should enforce:

- No Tone.js imports.
- No browser audio APIs.
- Return plain JSON-compatible project data.
- Keep generated events inside cue length.
- Keep notes in key/mode unless documented.
- Use beat-based timing.
- Keep functions small and testable.
- Prefer deterministic or seed-ready design.

Best for tickets:

```text
T0005 — Music Theory Helpers
T0006 — Cue Template System
T0007 — Chord Progression Generator
T0008 — Drum Pattern Generator
T0009 — Bassline Generator
T0010 — Chord / Pad Generator
T0011 — Melody / Motif Generator
T0012 — Full Project Generator
T0026 — Low / Medium / High Intensity Variations
T0028 — Preserve Motif During Variation
```

Prompt add-on:

```text
Use the gamecue-core-generation skill if available. Keep this work engine-agnostic and do not import Tone.js.
```

---

## 3.4 gamecue-audio-playback

**Purpose:** Guide Tone.js playback work.

Use for:

- Playback engine interface.
- Tone.js instrument factory.
- Tone.js scheduler.
- Play/stop/loop controls.
- Mute/solo.
- Cleanup and disposal.
- Audio timing bugs.

Should enforce:

- Tone.js imports only under `src/playback/tone`.
- Project data remains source of truth.
- Dispose old Tone objects.
- Avoid overlapping audio.
- Keep UI from owning audio scheduling logic.
- Respect BPM, mute, solo, and loop length.

Best for tickets:

```text
T0013 — PlaybackEngine Interface
T0014 — Tone.js Instrument Factory
T0015 — Tone.js Scheduler
T0016 — Play / Stop / Loop Controls
T0017 — Track Mute / Solo
T0018 — Playback Cleanup and Dispose Safety
T0041 — Better Instrument Presets
T0044 — Reverb Presets
T0045 — Delay Presets
```

Prompt add-on:

```text
Use the gamecue-audio-playback skill if available. Keep Tone.js isolated and include audio cleanup/disposal notes in the completion report.
```

---

## 3.5 gamecue-save-load

**Purpose:** Guide project serialization, validation, saving, and loading.

Use for:

- Project serializer.
- Project validator.
- Browser file save.
- Browser file load.
- Invalid file errors.
- Schema changes.
- Backward compatibility planning.

Should enforce:

- `.gamecue.json` is source of truth.
- Use plain JSON-compatible data only.
- Do not serialize Tone.js objects.
- Validate before applying loaded data.
- Invalid files should not crash the app.
- Failed loads should not destroy current state.

Best for tickets:

```text
T0019 — Project Serializer
T0020 — Project Validator
T0021 — Save .gamecue.json
T0022 — Load .gamecue.json
T0023 — Invalid File Error Handling
T0043 — Track Volume / Pan Persistence
```

Prompt add-on:

```text
Use the gamecue-save-load skill if available. Preserve schemaVersion and keep saved files engine-agnostic.
```

---

## 3.6 gamecue-export

**Purpose:** Guide game-focused export work.

Use for:

- MIDI export.
- Metadata export.
- Unity folder export planning.
- Browser WAV export research.
- Loop boundary verification.
- Stem export design.

Should enforce:

- Export from project data, not Tone runtime objects.
- Use safe filenames.
- Preserve cue metadata.
- Keep Unity-friendly naming in mind.
- Do not implement WAV/stems unless ticket asks.
- Clearly document export limitations.

Best for tickets:

```text
T0029 — MIDI Export
T0030 — Unity Folder Export Plan
T0031 — Export Metadata File
T0032 — Browser WAV Export Research Spike
T0033 — Loop Boundary Verification
T0034 — Stem Export Design
```

Prompt add-on:

```text
Use the gamecue-export skill if available. Export from GameCueProject data and do not make Tone.js the source of truth.
```

---

## 3.7 gamecue-ui

**Purpose:** Guide UI implementation without drifting into DAW complexity.

Use for:

- App layout.
- Cue controls.
- Transport controls.
- Track list.
- Save/load panel.
- Read-only note viewer.
- Basic editing UI.
- Polish passes.

Should enforce:

- Keep components small.
- Avoid complex UI libraries unless approved.
- Do not put Tone.js scheduling in UI components.
- Do not put generation logic inside UI components.
- Avoid full DAW UI scope.
- Keep labels clear and practical.

Best for tickets:

```text
T0003 — Basic App Layout
T0004 — Cue Controls UI
T0016 — Play / Stop / Loop Controls
T0017 — Track Mute / Solo
T0021 — Save .gamecue.json
T0022 — Load .gamecue.json
T0036 — Read-Only Note Viewer
T0037 — Editable Melody Notes
T0040 — Editable Drum Grid
T0046 — UI Polish Pass
```

Prompt add-on:

```text
Use the gamecue-ui skill if available. Keep this UI simple and avoid full DAW scope.
```

---

## 3.8 gamecue-manual-verification

**Purpose:** Create repeatable manual verification checklists after each ticket.

Use for:

- Any ticket completion.
- Build checks.
- Browser UI checks.
- Audio playback checks.
- Save/load checks.
- Export checks.
- Regression smoke tests.

Should enforce:

- Exact commands to run.
- Browser steps.
- Expected results.
- Failure signs.
- 5–10 minute checklist.
- Audio confirmation steps when relevant.

Best for:

```text
After every ticket
Before merging a branch
Before starting the next ticket
After bugfixes
After playback/export changes
```

Prompt add-on:

```text
Use the gamecue-manual-verification skill if available. Produce a 5–10 minute human checklist for this completed ticket.
```

---

## 3.9 gamecue-doc-updater

**Purpose:** Keep project docs aligned after completed work.

Use for:

- Ticket status updates.
- Design decision log updates.
- Schema changes.
- Architecture changes.
- README changes.
- Verification guide updates.
- New follow-up ticket creation.

Should enforce:

- Do not rewrite whole docs unnecessarily.
- Update only relevant sections.
- Preserve ticket IDs.
- Add design decisions when architecture changes.
- Add follow-up tickets instead of silently expanding scope.

Best for:

```text
After completed tickets
After schema changes
After major bug discoveries
After architecture decisions
After adding dependencies
After changing run/build/test commands
```

Prompt add-on:

```text
Use the gamecue-doc-updater skill if available. Update only the docs affected by this completed ticket.
```

---

## 3.10 gamecue-ai-assistant

**Purpose:** Later skill for AI-assisted music edit commands.

Use for:

- Prompt-to-command schema.
- Structured AI edit commands.
- AI validation.
- Applying AI-generated edits.
- Guardrails.

Should enforce:

- AI outputs structured commands.
- Validate before applying.
- No unreviewed destructive edits.
- No unstructured mutation of project files.
- Do not generate black-box audio as the MVP path.
- Respect locked tracks.

Best for tickets:

```text
T0047 — AI Command Schema
T0048 — Prompt-to-Structured-Edit Prototype
T0049 — Regenerate From AI Instruction
T0050 — AI Safety / Validation Layer
```

Prompt add-on:

```text
Use the gamecue-ai-assistant skill if available. AI should produce validated structured edits, not unstructured project mutations.
```

---

# 4. Recommended Creation Order

Do **not** create every skill immediately.

Recommended order:

```text
1. gamecue-ticket-runner
2. gamecue-manual-verification
3. gamecue-core-generation
4. gamecue-audio-playback
5. gamecue-save-load
6. gamecue-design-check
7. gamecue-doc-updater
8. gamecue-export
9. gamecue-ui
10. gamecue-ai-assistant
```

## 4.1 Why This Order?

| Order | Skill | Reason |
|---|---|---|
| 1 | ticket-runner | Needed for every Codex ticket |
| 2 | manual-verification | Supports our test-after-each-ticket workflow |
| 3 | core-generation | Needed before playback |
| 4 | audio-playback | Needed once Tone.js starts |
| 5 | save-load | Needed after core/playback |
| 6 | design-check | Useful once decisions start branching |
| 7 | doc-updater | Useful after implementation cycle begins |
| 8 | export | Later phase |
| 9 | ui | Helpful, but AGENTS.md is probably enough early |
| 10 | ai-assistant | Much later |

---

# 5. Minimal Starter Skill Set

If we only create three skills early, create:

```text
gamecue-ticket-runner
gamecue-manual-verification
gamecue-core-generation
```

If we create five, add:

```text
gamecue-audio-playback
gamecue-save-load
```

This gives us enough support for T0001 through T0023.

---

# 6. Prompt Selection Cheat Sheet

| Ticket Type | Use This Skill |
|---|---|
| General implementation | gamecue-ticket-runner |
| Model / generation / theory | gamecue-core-generation |
| Tone.js playback | gamecue-audio-playback |
| Save/load/validation | gamecue-save-load |
| UI layout/forms | gamecue-ui |
| Export/MIDI/WAV planning | gamecue-export |
| Docs update | gamecue-doc-updater |
| Architecture question | gamecue-design-check |
| Manual test checklist | gamecue-manual-verification |
| AI command/edit work | gamecue-ai-assistant |

---

# 7. Skill Prompt Add-On Library

Use one of these lines inside Codex prompts when applicable.

## General Ticket

```text
Use the gamecue-ticket-runner skill if available. Implement this ticket only and stay within docs/Tickets.md.
```

## Generation

```text
Use the gamecue-core-generation skill if available. Keep generation pure, engine-agnostic, beat-based, and JSON-compatible.
```

## Playback

```text
Use the gamecue-audio-playback skill if available. Keep Tone.js isolated under src/playback/tone and include cleanup/disposal behavior.
```

## Save / Load

```text
Use the gamecue-save-load skill if available. Preserve .gamecue.json as plain validated project data.
```

## UI

```text
Use the gamecue-ui skill if available. Keep the interface simple and avoid full DAW scope.
```

## Export

```text
Use the gamecue-export skill if available. Export from GameCueProject data, not Tone.js runtime objects.
```

## Verification

```text
Use the gamecue-manual-verification skill if available. Provide a practical 5–10 minute manual checklist.
```

## Docs

```text
Use the gamecue-doc-updater skill if available. Update only docs affected by this ticket.
```

## Design Check

```text
Use the gamecue-design-check skill if available. Check this proposal against the design docs and identify scope creep.
```

---

# 8. Starter SKILL.md Template

Use this as a template when creating a skill.

```markdown
---
name: gamecue-[skill-name]
description: [One-sentence description of when Codex should use this skill.]
---

# GameCue [Skill Name]

Use this skill when:
- [Condition 1]
- [Condition 2]
- [Condition 3]

## Required Context

Before acting, review:
- AGENTS.md
- docs/GameCue_Full_Design_Document.md
- docs/GameCue_MVP_Technical_Design.md
- docs/Tickets.md
- docs/Codex_Prompt_Playbook.md

## Project Rules

- Implement one ticket only.
- Do not implement future-ticket features.
- Keep `.gamecue.json` as the source of truth.
- Keep `src/core` engine-agnostic.
- Keep Tone.js isolated under `src/playback/tone`.
- Do not refactor unrelated code.
- Provide build/test/manual verification notes.

## Skill-Specific Rules

- [Rule 1]
- [Rule 2]
- [Rule 3]

## Completion Report

At the end, report:
- Summary
- Files changed
- Commands run
- Build/test result
- Manual verification steps
- Risks / follow-ups
```

---

# 9. Future Skill Creation Tickets

Suggested future planning tickets:

```text
T0000F — Create gamecue-ticket-runner Skill
T0000G — Create gamecue-manual-verification Skill
T0000H — Create gamecue-core-generation Skill
T0000I — Create gamecue-audio-playback Skill
T0000J — Create gamecue-save-load Skill
```

These are optional. We can also wait until after T0001/T0002 to add them.

---

# 10. Recommendation

For now, keep this document as the reference list.

The best immediate path is:

```text
1. Put docs in the repo.
2. Add AGENTS.md.
3. Start T0001 with the normal Codex prompt.
4. Add skills after the first few tickets if we see repeated prompt patterns.
```

Do not delay T0001 just to create every possible skill. The skills should support the workflow, not become the project.
