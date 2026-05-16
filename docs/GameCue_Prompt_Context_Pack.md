# GameCue Prompt Context Pack

**Project:** GameCue  
**Version:** 0.1  
**Status:** Copy/Paste Context Pack  
**Purpose:** Provide short reusable context blocks for Codex prompts when the assistant or Codex needs to be quickly re-grounded.

---

# 1. Ultra-Short Context

Use this when a prompt needs a small reminder.

```text
You are working on GameCue, a React + TypeScript + Vite app for generating loopable game music cues. Implement one ticket only from docs/Tickets.md. Keep src/core engine-agnostic. Keep Tone.js isolated under src/playback/tone. .gamecue.json is the source of truth. Do not build a full DAW.
```

---

# 2. Standard Context

Use this at the top of normal Codex prompts.

```text
You are working on GameCue.

GameCue is a lightweight game-music cue generator for creating loopable cues such as investigation ambience, suspense loops, chase/action loops, menu themes, discovery stings, emotional cues, and dark ambient loops.

Current MVP stack:
- React
- TypeScript
- Vite
- Tone.js later for playback only

Core architecture:
- .gamecue.json project data is the source of truth.
- src/core must remain engine-agnostic.
- Tone.js code belongs only under src/playback/tone.
- Core generation returns plain JSON-compatible project data.
- React UI should not own music generation or audio scheduling.

Development workflow:
- Implement one small ticket at a time from docs/Tickets.md.
- Do not implement future-ticket features.
- Do not refactor unrelated systems.
- Run build/tests when possible.
- Provide manual verification steps.
```

---

# 3. Full Context Reset

Use this when Codex seems lost or after a long session.

```text
Reset to the GameCue project context.

GameCue is a focused tool for generating, editing, and exporting loopable game music cues. It is not a full DAW, not a plugin host, not a mastering suite, and not an AI full-song generator.

Read these docs before coding:
- AGENTS.md
- docs/GameCue_Full_Design_Document.md
- docs/GameCue_MVP_Technical_Design.md
- docs/Tickets.md
- docs/Codex_Prompt_Playbook.md
- docs/Repo_Current_State.md
- docs/Design_Update_Companion.md
- docs/Manual_Verification_Guide.md
- docs/Known_Issues_And_Followups.md

Important rules:
- Implement one ticket only.
- Stay inside the ticket's allowed areas.
- Respect do-not-touch areas.
- Do not implement future-ticket features.
- Do not refactor unrelated code.
- Keep .gamecue.json as the source of truth.
- Keep src/core engine-agnostic.
- Do not import Tone.js from src/core.
- Tone.js belongs only under src/playback/tone.
- Do not store Tone.js objects in project files.
- Avoid full DAW scope.
- Use TypeScript strict mode.
- Avoid unnecessary dependencies.
- Provide a completion report with files changed, commands run, build/test results, and manual verification steps.

If you find work outside the ticket scope, do not implement it. Report it as a follow-up.
```

---

# 4. Core Generation Context

Use for theory/generation tickets.

```text
This is a GameCue core generation ticket.

Rules:
- Do not import Tone.js.
- Do not use Web Audio APIs.
- Do not use React state inside core generation.
- Return plain JSON-compatible data.
- Use beat-based event timing.
- Keep events inside cue length.
- Keep notes in key/mode unless intentionally documented.
- Keep functions small and testable.
- Design helpers to be deterministic or seed-ready.
```

---

# 5. Playback Context

Use for Tone.js playback tickets.

```text
This is a GameCue playback ticket.

Rules:
- Tone.js may only be imported under src/playback/tone.
- Do not store Tone.js objects in GameCueProject or .gamecue.json.
- Project data is the source of truth.
- Playback adapters consume project events and schedule audio.
- Dispose old Tone.js objects when loading/regenerating.
- Avoid overlapping audio.
- Respect BPM, loop length, mute, and solo.
- Include cleanup/disposal notes in the completion report.
```

---

# 6. Save / Load Context

Use for serialization and file tickets.

```text
This is a GameCue save/load ticket.

Rules:
- .gamecue.json is the source of truth.
- Save plain JSON-compatible project data only.
- Preserve schemaVersion.
- Do not serialize Tone.js objects, audio nodes, functions, or UI-only state.
- Validate loaded data before applying it.
- Invalid files should not crash the app.
- Failed loads should preserve the current project.
```

---

# 7. UI Context

Use for UI tickets.

```text
This is a GameCue UI ticket.

Rules:
- Keep components small.
- Keep labels clear.
- Avoid full DAW complexity.
- Do not put Tone.js scheduling inside UI components.
- Do not put complex generation logic inside UI components.
- Use controlled inputs where appropriate.
- Keep layout readable and practical.
```

---

# 8. Export Context

Use for export tickets.

```text
This is a GameCue export ticket.

Rules:
- Export from GameCueProject data, not Tone.js runtime objects.
- Use safe filenames.
- Preserve cue metadata.
- Keep Unity-friendly naming in mind.
- Do not implement WAV or stem export unless this ticket explicitly asks for it.
- Document export limitations clearly.
```

---

# 9. Verification Context

Use when asking for manual checks.

```text
Create a practical GameCue manual verification checklist.

The checklist should include:
- Exact commands to run
- Browser steps
- Expected results
- Failure signs
- Audio checks if relevant
- Save/load checks if relevant
- Export checks if relevant

Keep it doable in 5–10 minutes.
```

---

# 10. Scope Guard

Use when work starts growing.

```text
Scope check this GameCue proposal.

Current ticket:
[Ticket ID]

Proposed extra work:
[Describe]

Decide:
- Required now
- Defer to later ticket
- Reject
- Split into separate ticket

Consider:
- MVP scope
- Architecture boundaries
- Tone.js isolation
- Whether src/core remains engine-agnostic
- Whether this drifts toward full DAW scope
```

---

# 11. Completion Report Reminder

Add this to the end of Codex prompts.

```text
After implementation, report:
- Summary
- Files changed
- Commands run
- Build/test results
- Manual verification steps
- Architecture notes
- Risks/follow-ups
- Whether docs need updating
- Whether Repo_Current_State.md needs updating
```

---

# 12. Current Project Snapshot

Update this block if needed.

```text
Current status:
Planning docs prepared.
Implementation not started.
Next ticket:
T0001 — Project Skeleton.

Important:
Do not add Tone.js in T0001.
Do not implement generation in T0001.
Do not implement save/load in T0001.
```
