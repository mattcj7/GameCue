# GameCue Design Update Companion

**Project:** GameCue  
**Version:** 0.1  
**Status:** Living Design Companion  
**Purpose:** Track approved design changes, decisions, and ticket-to-design alignment without constantly rewriting the full design document.

---

# 1. Purpose

The full design document is the main reference, but the project will evolve as tickets are implemented.

This companion tracks:

- Approved design changes
- Architecture decisions
- Scope decisions
- Ticket impacts
- Follow-up docs needed
- Reasons behind decisions

Use this file when the design changes faster than the main design document.

---

# 2. How To Use This File

Add a new entry when:

- A design decision is made.
- A ticket changes behavior from the original plan.
- A schema field is added or changed.
- A dependency is approved.
- A future feature is deferred or rejected.
- A scope boundary is clarified.
- A new ticket is created due to implementation findings.

Do not add noise for tiny implementation details that do not affect design.

---

# 3. Design Decision Entry Template

```markdown
## D000X — Decision Title

**Date:** YYYY-MM-DD  
**Status:** Proposed / Approved / Superseded  
**Related Tickets:** T000X, T000Y  
**Affected Areas:** docs, src/core, src/playback, src/ui, etc.

### Decision

Describe the decision.

### Reason

Explain why this decision was made.

### Impact

Describe what changes because of this decision.

### Non-Goals

Clarify what this decision does not mean.

### Follow-Up

- [ ] Update full design doc?
- [ ] Update Tickets.md?
- [ ] Create new ticket?
- [ ] Update AGENTS.md?
```

---

# 4. Current Design Decisions

## D0001 — Start With Tone.js Web App

**Date:** 2026-05-15  
**Status:** Approved  
**Related Tickets:** T0001–T0018  
**Affected Areas:** architecture, playback, MVP scope

### Decision

GameCue starts as a React + TypeScript + Vite web app using Tone.js for browser playback.

### Reason

This is the fastest path to a playable prototype. It avoids the overhead of native audio, C++, JUCE, or a custom engine during the MVP.

### Impact

- Initial app is web-based.
- Tone.js is introduced only when playback tickets begin.
- Browser development remains the primary early workflow.

### Non-Goals

- This does not mean Tone.js owns the project data.
- This does not prevent C#, Tauri, or JUCE later.
- This does not mean GameCue is a full DAW.

### Follow-Up

- [x] Captured in full design doc
- [x] Captured in AGENTS.md
- [x] Captured in Tickets.md

---

## D0002 — `.gamecue.json` Is the Source of Truth

**Date:** 2026-05-15  
**Status:** Approved  
**Related Tickets:** T0002, T0012, T0019–T0023  
**Affected Areas:** project model, serialization, playback, export

### Decision

GameCue project files use plain engine-agnostic `.gamecue.json` data as the source of truth.

### Reason

This keeps the project portable across Tone.js, C#, Tauri, or a future JUCE renderer.

### Impact

- Core data must be serializable.
- Playback adapters read project data.
- Tone.js runtime objects are never saved in project files.

### Non-Goals

- This does not finalize every schema field.
- This does not require full schema migration support in MVP.

### Follow-Up

- [x] Captured in full design doc
- [x] Captured in AGENTS.md
- [x] Captured in Tickets.md

---

## D0003 — Core Logic Must Stay Engine-Agnostic

**Date:** 2026-05-15  
**Status:** Approved  
**Related Tickets:** T0002–T0012  
**Affected Areas:** src/core, generation, theory, templates

### Decision

Files under `src/core` must not import Tone.js or browser audio APIs.

### Reason

Generation, music theory, templates, and serialization should remain reusable by future playback/rendering engines.

### Impact

- Tone.js belongs under `src/playback/tone`.
- Core functions return plain data.
- Tests can run without audio dependencies.

### Non-Goals

- This does not prevent UI from calling core functions.
- This does not prevent playback adapters from consuming core data.

### Follow-Up

- [x] Captured in AGENTS.md
- [x] Captured in starter skills reference

---

## D0004 — Build Game Cues, Not a Full DAW

**Date:** 2026-05-15  
**Status:** Approved  
**Related Tickets:** All MVP tickets  
**Affected Areas:** scope, UI, roadmap

### Decision

GameCue focuses first on loopable game cues, stingers, variations, and simple editable song sketches.

### Reason

A full DAW would be much slower and risk overwhelming the MVP.

### Impact

- No full timeline editor in MVP.
- No waveform editing.
- No plugin hosting.
- No advanced mastering.
- Editing tools come later and remain lightweight.

### Non-Goals

- This does not prevent basic note or drum editing later.
- This does not prevent export to external DAWs.

### Follow-Up

- [x] Captured in full design doc
- [x] Captured in AGENTS.md

---

## D0005 — Delay Tone.js Until Playback Tickets

**Date:** 2026-05-15  
**Status:** Approved  
**Related Tickets:** T0001–T0014  
**Affected Areas:** dependencies, architecture

### Decision

Tone.js should not be installed during T0001–T0013 unless a ticket is intentionally revised.

### Reason

Early tickets should establish app structure, model, UI controls, theory helpers, templates, and generation without audio dependency.

### Impact

- T0001 should not add Tone.js.
- T0002–T0012 should stay pure TypeScript/core logic.
- T0014 introduces Tone.js.

### Non-Goals

- This does not delay planning the playback interface.
- This does not prevent placeholder playback UI.

### Follow-Up

- [x] Captured in Tickets.md
- [x] Captured in AGENTS.md

---

## D0006 — C# and JUCE Are Future Paths, Not MVP Paths

**Date:** 2026-05-15  
**Status:** Approved  
**Related Tickets:** future only  
**Affected Areas:** roadmap, architecture

### Decision

C# helper tools, Tauri desktop packaging, and JUCE rendering remain future options. They are not part of the first MVP.

### Reason

The fastest path is to prove the concept in a browser first. C# and JUCE remain viable later because the project model is engine-agnostic.

### Impact

- Do not add C# projects during MVP unless a later ticket explicitly does so.
- Do not add JUCE during MVP.
- Preserve clean boundaries so future renderers can consume `.gamecue.json`.

### Non-Goals

- This does not reject C#.
- This does not reject JUCE.
- This does not prevent future desktop packaging.

### Follow-Up

- [x] Captured in full design doc
- [x] Captured in AGENTS.md

---

## D0007 — Accept Starter Codex Skills as Project Workflow Support

**Date:** 2026-05-16  
**Status:** Approved  
**Related Tickets:** T0003, T0003A, future implementation tickets  
**Affected Areas:** `.codex/skills`, `AGENTS.md`, workflow docs

### Decision

GameCue will keep the starter Codex skills that were added during the T0003 merge:

```text
gamecue-ticket-runner
gamecue-core-generation
gamecue-audio-playback
gamecue-save-load
gamecue-manual-verification
```

Although these files were merged alongside T0003 rather than through a dedicated skills ticket, they align with the already-planned GameCue workflow and are useful enough to retain.

### Reason

The skills reinforce project rules that are already documented elsewhere:

- Implement one ticket at a time.
- Keep `src/core` engine-agnostic.
- Keep Tone.js isolated under `src/playback/tone`.
- Keep `.gamecue.json` as the source of truth.
- Require completion reports and manual verification.
- Avoid full DAW scope creep.

Keeping them avoids unnecessary revert churn and gives Codex reusable guardrails for upcoming tickets.

### Impact

- `.codex/skills/` is now an intentional part of the repo.
- Future Codex prompts may reference these skills when appropriate.
- `AGENTS.md` mentions the available starter skills.
- `docs/Repo_Current_State.md` lists `.codex/skills/` as part of the current repo structure.
- New skills should be added through explicit docs/workflow tickets going forward.

### Non-Goals

- This does not mean skills override `AGENTS.md`, `docs/Tickets.md`, or the active ticket prompt.
- This does not authorize Codex to implement multiple tickets at once.
- This does not add runtime app behavior.
- This does not add Tone.js, generation, playback, save/load, export, or AI features.

### Follow-Up

- [x] Keep starter skills in repo.
- [x] Update `AGENTS.md` to mention available skills.
- [x] Update `docs/Repo_Current_State.md` to include `.codex/skills/`.
- [x] Update `docs/GameCue_Starter_Skills_Reference.md` to mark current created skills.

---

# 5. Ticket Alignment Notes

## T0001 — Project Skeleton

Expected design alignment:

- Vite + React + TypeScript.
- No Tone.js.
- No generation.
- No save/load.
- Placeholder sections only.

Status:

```text
Not started.
```

## T0002 — Core Project Model

Expected design alignment:

- Plain JSON-compatible types.
- No Tone.js.
- No UI-heavy behavior.
- Include example project factory.

Status:

```text
Not started.
```

---

# 6. Open Design Questions

Track unresolved questions here.

| ID | Question | Status | Related Tickets |
|---|---|---|---|
| Q0001 | Should default key be D minor or C minor? | Open | T0004–T0012 |
| Q0002 | Should drums be disabled by default for emotional/dark ambient cues? | Open | T0006, T0008 |
| Q0003 | Should generated melody be enabled by default for ambient cues? | Open | T0011 |
| Q0004 | Should style labels include detective noir / southern gothic / sci-fi early? | Open | T0006 |
| Q0005 | How soon should MIDI export be prioritized after save/load? | Open | T0029 |

---

# 7. Superseded Decisions

Move old decisions here if replaced.

```text
None yet.
```

---

# 8. Change Log

| Date | Change |
|---|---|
| 2026-05-15 | Initial design companion created |
| 2026-05-16 | Accepted starter `.codex/skills` as intentional project workflow support |
