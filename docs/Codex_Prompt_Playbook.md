# GameCue Codex Prompt Playbook

**Project:** GameCue  
**Version:** 0.1  
**Status:** Draft / Living Prompt Guide  
**Purpose:** Provide reusable Codex prompts so GameCue can be built one small, controlled ticket at a time.

---

# 1. Core Workflow

GameCue development should follow this loop:

```text
Plan in ChatGPT
  ↓
Create/update design docs
  ↓
Write one small Codex ticket
  ↓
Codex implements that ticket only
  ↓
Run build/tests
  ↓
Manually verify
  ↓
Report results back to ChatGPT
  ↓
Update docs/tickets
  ↓
Move to next ticket
```

Codex should not be asked to freestyle large parts of the app.

---

# 2. Universal Codex Rules

Paste these into most Codex prompts.

```text
Follow these project rules:

- Implement the requested ticket only.
- Do not implement future-ticket features.
- Do not refactor unrelated code.
- Do not introduce new architecture unless required by this ticket.
- Keep the .gamecue.json project model as the source of truth.
- Keep Tone.js isolated under src/playback/tone.
- Do not import Tone.js from src/core.
- Keep core generation logic engine-agnostic.
- Prefer small, typed, testable functions.
- Use TypeScript strict mode.
- Avoid unnecessary dependencies.
- Update docs only when the ticket asks for docs updates or when implementation changes documented behavior.
- At the end, report:
  - Files changed
  - Commands run
  - Build/test result
  - Manual verification steps
  - Any risks or follow-up tickets
```

---

# 2A. Standard Verification Commands on Windows

Use this verification order in Codex Windows shells:

```powershell
npm.cmd run build
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

PowerShell blocking `npm.ps1` is not a code failure.

Missing `npm` on `PATH` is not a code failure.

Do not waste time repeatedly probing `npm` PATH issues once a known-good command works.

Do not use raw Node ESM source-file imports for verification when the code depends on Vite/TypeScript module resolution.

Always report which verification command path was used.

---

# 3. Standard Ticket Implementation Prompt

Use this for normal Codex tickets.

```text
We are working on the GameCue project.

Before coding, review:
- docs/GameCue_Full_Design_Document.md
- docs/GameCue_MVP_Technical_Design.md
- docs/Tickets.md
- AGENTS.md if present

Implement this ticket only:

Ticket:
[PASTE TICKET ID AND TITLE]

Goal:
[PASTE GOAL]

Dependencies:
[PASTE DEPENDENCIES]

Allowed areas:
[PASTE ALLOWED AREAS]

Do not touch:
[PASTE DO NOT TOUCH AREAS]

Requirements:
[PASTE REQUIREMENTS]

Non-goals:
[PASTE NON-GOALS]

Acceptance criteria:
[PASTE ACCEPTANCE CRITERIA]

Manual verification:
[PASTE MANUAL VERIFICATION]

Project rules:
- Implement the requested ticket only.
- Do not implement future-ticket features.
- Do not refactor unrelated code.
- Do not introduce new architecture unless required by this ticket.
- Keep the .gamecue.json project model as the source of truth.
- Keep Tone.js isolated under src/playback/tone.
- Do not import Tone.js from src/core.
- Keep core generation logic engine-agnostic.
- Prefer small, typed, testable functions.
- Use TypeScript strict mode.
- Avoid unnecessary dependencies.
- Use the Windows/Codex verification order from docs/Codex_Prompt_Playbook.md. Prefer npm.cmd run build, then the full npm path, then local tsc/vite shims.
- Do not waste time on raw Node ESM source imports when Vite/TypeScript module resolution is required.

After implementation, provide:
- Summary of what changed
- Files changed
- Commands run
- Build/test results
- Manual verification steps
- Any risks or follow-up tickets
```

---

# 4. T0001 Starter Prompt

Use this when starting the repo.

```text
We are starting the GameCue project from the design documents. Implement T0001 only.

Ticket:
T0001 — Project Skeleton

Goal:
Create the initial Vite + React + TypeScript GameCue app skeleton.

Before coding, review:
- docs/GameCue_Full_Design_Document.md
- docs/GameCue_MVP_Technical_Design.md
- docs/Tickets.md
- AGENTS.md if present

Requirements:
- Create a Vite + React + TypeScript project.
- Enable TypeScript strict mode.
- Create the initial folder structure:
  - src/app
  - src/core/model
  - src/core/theory
  - src/core/templates
  - src/core/generation
  - src/core/serialization
  - src/playback
  - src/playback/tone
  - src/ui/controls
  - src/ui/tracks
  - src/ui/project
  - src/ui/shared
- Create a simple App.tsx that displays:
  - GameCue
  - Generate loopable game music cues
  - Placeholder sections for Cue Controls, Track List, Transport, and Save/Load
- Add README run instructions.
- Ensure npm run dev works.
- Ensure npm run build works.

Non-goals:
- Do not add Tone.js yet.
- Do not implement playback.
- Do not implement generation.
- Do not implement save/load.
- Do not implement project schema.
- Do not implement future tickets.

Architecture rules:
- Keep the app simple.
- Do not introduce state management libraries.
- Do not add unnecessary dependencies.
- Do not add audio code.

After implementation, provide:
- Files changed
- Commands run
- Build result
- Manual verification steps
- Any risks or follow-up tickets
```

---

# 5. Bugfix Prompt

Use this after a ticket when something breaks.

```text
We are working on GameCue. Fix the bug described below only.

Before coding, review the relevant ticket in:
- docs/Tickets.md

Bug:
[DESCRIBE BUG]

Observed behavior:
[WHAT HAPPENED]

Expected behavior:
[WHAT SHOULD HAPPEN]

Relevant command output:
[PASTE BUILD/TEST/CONSOLE OUTPUT]

Relevant files:
[LIST FILES IF KNOWN]

Constraints:
- Fix only this bug.
- Do not implement new features.
- Do not refactor unrelated code.
- Keep Tone.js isolated under src/playback/tone.
- Do not import Tone.js from src/core.
- Preserve existing public types unless the bug requires a targeted type fix.
- Add or update tests if this bug is testable.

After fixing, provide:
- Root cause
- Files changed
- Commands run
- Build/test results
- Manual verification steps
- Any follow-up ticket suggestions
```

---

# 6. Build Failure Prompt

Use this when `npm run build` fails.

```text
GameCue build is failing. Fix the build failure only.

Command:
npm run build

Build output:
[PASTE FULL BUILD OUTPUT]

Constraints:
- Fix only the build failure.
- Do not implement new features.
- Do not change architecture unless required by the error.
- Do not suppress TypeScript errors with any unless there is no better option.
- Keep strict typing.
- Keep Tone.js out of src/core.

After fixing, provide:
- Root cause
- Files changed
- Commands run
- Build result
- Manual verification steps
```

---

# 7. Test Failure Prompt

Use this when tests fail.

```text
GameCue tests are failing. Fix the failing tests or the implementation bug causing them.

Command:
[PASTE TEST COMMAND]

Test output:
[PASTE FULL TEST OUTPUT]

Constraints:
- Do not delete or weaken tests unless they are clearly wrong.
- Prefer fixing implementation over changing tests.
- If a test is wrong, explain why and update it narrowly.
- Do not implement unrelated features.
- Keep core logic engine-agnostic.

After fixing, provide:
- Root cause
- Whether code or test was changed
- Files changed
- Commands run
- Test result
- Build result if run
- Manual verification steps
```

---

# 8. Refactor Prompt

Use this only when we intentionally approve a refactor.

```text
We are working on GameCue. Perform this approved refactor only.

Approved refactor:
[DESCRIBE REFACTOR]

Reason:
[WHY THIS REFACTOR IS NEEDED]

Allowed areas:
[LIST ALLOWED FILES/FOLDERS]

Do not touch:
[LIST DO-NOT-TOUCH AREAS]

Constraints:
- Preserve current behavior.
- Do not add new features.
- Do not remove existing tests.
- Keep public project file shape compatible unless explicitly approved.
- Keep Tone.js isolated under src/playback/tone.
- Keep src/core engine-agnostic.
- Update docs only if architecture or behavior changes.

After refactor, provide:
- What changed
- Why behavior should be unchanged
- Files changed
- Commands run
- Build/test results
- Manual verification steps
- Risks
```

---

# 9. Documentation Update Prompt

Use when implementation changes require docs updates.

```text
Update GameCue documentation for the completed change below.

Completed change:
[DESCRIBE CHANGE]

Relevant ticket:
[PASTE TICKET ID]

Docs to review:
- docs/GameCue_Full_Design_Document.md
- docs/GameCue_MVP_Technical_Design.md
- docs/Tickets.md
- docs/Design_Update_Companion.md if present
- README.md if user-facing setup changed

Constraints:
- Update only documentation related to this change.
- Do not rewrite entire docs unless necessary.
- Preserve ticket IDs and phase structure.
- Add design decision notes if the change affects architecture.
- Add manual verification notes if the change affects testing.

After updating, provide:
- Docs changed
- Summary of updates
- Any open questions
```

---

# 10. Manual Verification Prompt

Use when Codex has implemented a ticket and you want a human test checklist.

```text
Create a manual verification checklist for this completed GameCue ticket.

Ticket:
[PASTE TICKET ID AND TITLE]

Implementation summary:
[PASTE CODEX SUMMARY]

Files changed:
[PASTE FILES CHANGED]

Known limitations:
[PASTE LIMITATIONS]

Checklist requirements:
- Include exact commands to run.
- Include browser/app steps.
- Include expected results.
- Include failure signs to watch for.
- Keep the checklist doable in 5–10 minutes.
- Include whether screenshots/audio confirmation are useful.

Do not change code.
```

---

# 11. Ticket Completion Report Prompt

Use this after Codex finishes and you paste the results back into ChatGPT or another planning review.

```text
Review this GameCue ticket completion report and tell me:
1. Whether the ticket appears complete.
2. Whether Codex stayed in scope.
3. What I should manually verify.
4. Whether docs need updating.
5. What the next ticket should be.

Ticket:
[PASTE TICKET ID AND TITLE]

Codex summary:
[PASTE SUMMARY]

Files changed:
[PASTE FILES]

Commands run:
[PASTE COMMANDS]

Build/test results:
[PASTE RESULTS]

Manual verification results:
[PASTE YOUR RESULTS IF AVAILABLE]
```

---

# 12. Design Decision Prompt

Use this when we need to decide direction before coding.

```text
We need to make a GameCue design decision before coding.

Decision topic:
[DESCRIBE TOPIC]

Options:
1. [OPTION A]
2. [OPTION B]
3. [OPTION C]

Current constraints:
- MVP should stay small.
- Tone.js is the first playback adapter.
- Core project model should be engine-agnostic.
- C# and JUCE are future options, not MVP requirements.
- GameCue is focused on loopable game music cues, not a full DAW.

Please evaluate:
- Fastest implementation path
- Long-term flexibility
- Risk of scope creep
- Impact on current tickets
- Recommended decision
- Whether this should be added to the Design Decision Log
```

---

# 13. Scope Creep Check Prompt

Use when Codex or we accidentally start expanding a ticket.

```text
Check this proposed GameCue work for scope creep.

Current ticket:
[PASTE TICKET]

Proposed extra work:
[DESCRIBE EXTRA WORK]

Evaluate:
- Is this required for the current ticket?
- Does it belong in a later ticket?
- Does it violate MVP scope?
- Does it risk locking us to Tone.js?
- Should we create a new ticket instead?

Give a clear recommendation:
- Do now
- Defer
- Reject
- Create separate ticket
```

---

# 14. Audio Playback Ticket Prompt

Use for Tone.js playback tickets.

```text
We are implementing a GameCue playback ticket. Implement this ticket only.

Ticket:
[PASTE TICKET ID AND TITLE]

Before coding, review:
- docs/GameCue_Full_Design_Document.md
- docs/GameCue_MVP_Technical_Design.md
- docs/Tickets.md
- src/playback/ if it exists
- src/core/model/ if it exists

Playback rules:
- Tone.js may only be imported under src/playback/tone.
- Do not import Tone.js into src/core.
- UI/app may use playback interfaces/adapters but must not import raw tone.
- Do not store Tone.js objects in GameCueProject or .gamecue.json.
- Dispose old Tone.js objects when projects reload.
- Avoid overlapping audio when regenerating or reloading.
- Invalidate queued callbacks from previously loaded projects after reload/regenerate.
- Keep scheduling based on project note events.
- Keep the playback adapter replaceable.

Requirements:
[PASTE REQUIREMENTS]

Non-goals:
[PASTE NON-GOALS]

Acceptance criteria:
[PASTE ACCEPTANCE CRITERIA]

Manual verification:
[PASTE MANUAL VERIFICATION]

After implementation, provide:
- Files changed
- How Tone.js is isolated
- Commands run
- Build/test result
- Manual audio verification steps
- Whether human audible playback was actually confirmed
- Cleanup/dispose behavior
- Known audio limitations
```

---

# 15. Core Generation Ticket Prompt

Use for music theory/generation tickets.

```text
We are implementing a GameCue core generation ticket. Implement this ticket only.

Ticket:
[PASTE TICKET ID AND TITLE]

Before coding, review:
- docs/GameCue_Full_Design_Document.md
- docs/GameCue_MVP_Technical_Design.md
- docs/Tickets.md
- src/core/model/ if it exists
- src/core/theory/ if it exists
- src/core/templates/ if it exists
- src/core/generation/ if it exists

Core generation rules:
- Do not import Tone.js.
- Do not use browser audio APIs.
- Return plain JSON-compatible data.
- Prefer deterministic or seed-ready helper functions.
- Keep functions small and testable.
- Keep note timing in beats.
- Keep events inside cue length.
- Keep generated notes in key/mode unless intentionally documented.
- Do not mutate React state from core functions.

Requirements:
[PASTE REQUIREMENTS]

Non-goals:
[PASTE NON-GOALS]

Acceptance criteria:
[PASTE ACCEPTANCE CRITERIA]

Manual verification:
[PASTE MANUAL VERIFICATION]

After implementation, provide:
- Files changed
- Commands run
- Build/test result
- How generated data stays engine-agnostic
- Manual verification steps
- Any follow-up tickets
```

---

# 16. Save / Load Ticket Prompt

Use for serialization, validation, save, and load tickets.

```text
We are implementing a GameCue save/load ticket. Implement this ticket only.

Ticket:
[PASTE TICKET ID AND TITLE]

Before coding, review:
- docs/GameCue_Full_Design_Document.md
- docs/GameCue_MVP_Technical_Design.md
- docs/Tickets.md
- src/core/model/
- src/core/serialization/ if it exists

Save/load rules:
- .gamecue.json is the source of truth.
- Saved files must contain plain JSON-compatible data only.
- Do not serialize Tone.js objects or runtime audio state.
- Keep serializer core under src/core/serialization and free of playback, Tone.js, React, DOM, and browser file APIs.
- Preserve schemaVersion.
- Validate loaded data before applying it.
- Invalid files should not crash the app.
- Invalid files should not destroy the current project state.

Requirements:
[PASTE REQUIREMENTS]

Non-goals:
[PASTE NON-GOALS]

Acceptance criteria:
[PASTE ACCEPTANCE CRITERIA]

Manual verification:
[PASTE MANUAL VERIFICATION]

After implementation, provide:
- Files changed
- Commands run
- Build/test result
- Example saved file shape if relevant
- Manual verification steps
- Error handling notes
```

---

# 17. UI Ticket Prompt

Use for layout and controls tickets.

```text
We are implementing a GameCue UI ticket. Implement this ticket only.

Ticket:
[PASTE TICKET ID AND TITLE]

Before coding, review:
- docs/GameCue_Full_Design_Document.md
- docs/GameCue_MVP_Technical_Design.md
- docs/Tickets.md
- src/app/
- src/ui/

UI rules:
- Keep components small.
- Do not mix Tone.js code directly into UI components.
- Use clear labels.
- Keep MVP layout simple.
- Avoid adding a large UI framework unless approved.
- Do not build full DAW UI unless ticket explicitly asks.
- Keep controls accessible and readable.

Requirements:
[PASTE REQUIREMENTS]

Non-goals:
[PASTE NON-GOALS]

Acceptance criteria:
[PASTE ACCEPTANCE CRITERIA]

Manual verification:
[PASTE MANUAL VERIFICATION]

After implementation, provide:
- Files changed
- Commands run
- Build result
- Manual browser verification steps
- Screens/UI behavior summary
```

---

# 18. Export Ticket Prompt

Use for MIDI/WAV/Unity export work.

```text
We are implementing a GameCue export ticket. Implement this ticket only.

Ticket:
[PASTE TICKET ID AND TITLE]

Before coding, review:
- docs/GameCue_Full_Design_Document.md
- docs/GameCue_MVP_Technical_Design.md
- docs/Tickets.md
- src/core/model/
- src/core/serialization/
- existing export docs if present

Export rules:
- Export from GameCueProject data.
- Do not make Tone.js the source of truth.
- Keep exports deterministic where possible.
- Preserve cue metadata.
- Use safe filenames.
- Keep Unity-friendly naming in mind.
- Do not implement WAV/stem export unless ticket explicitly asks.

Requirements:
[PASTE REQUIREMENTS]

Non-goals:
[PASTE NON-GOALS]

Acceptance criteria:
[PASTE ACCEPTANCE CRITERIA]

Manual verification:
[PASTE MANUAL VERIFICATION]

After implementation, provide:
- Files changed
- Commands run
- Build/test result
- Export files produced
- Manual verification steps
- Known export limitations
```

---

# 19. Skill Usage Strategy

Skills should be used when they make Codex more consistent and less likely to drift.

## 19.1 Skills We May Add Later

Potential project-specific skills:

```text
.codex/
  skills/
    gamecue-ticket-runner/
      SKILL.md
    gamecue-design-check/
      SKILL.md
    gamecue-audio-playback/
      SKILL.md
    gamecue-core-generation/
      SKILL.md
    gamecue-manual-verification/
      SKILL.md
    gamecue-doc-updater/
      SKILL.md
```

## 19.2 When to Use Skills

| Skill | Use When |
|---|---|
| `gamecue-ticket-runner` | Any normal implementation ticket |
| `gamecue-design-check` | Before/after tickets that affect architecture |
| `gamecue-audio-playback` | Tone.js playback tickets |
| `gamecue-core-generation` | Music theory/generation tickets |
| `gamecue-manual-verification` | After implementation to produce human test steps |
| `gamecue-doc-updater` | When docs need updating |

## 19.3 Skill Prompt Add-On

When skills exist, add this to Codex prompts:

```text
Use the relevant GameCue skill if available:
- gamecue-ticket-runner for general implementation
- gamecue-core-generation for theory/generation work
- gamecue-audio-playback for Tone.js playback work
- gamecue-design-check for architecture checks
- gamecue-manual-verification for final manual testing steps
- gamecue-doc-updater for documentation updates

If no matching skill exists, proceed using AGENTS.md and the design docs.
```

---

# 20. AGENTS.md Creation Prompt

Use this after docs are in the repo.

```text
Create AGENTS.md for the GameCue repo.

Before writing it, review:
- docs/GameCue_Full_Design_Document.md
- docs/GameCue_MVP_Technical_Design.md
- docs/Tickets.md
- docs/Codex_Prompt_Playbook.md

AGENTS.md should instruct Codex/agents to:
- Implement one ticket at a time.
- Read docs before coding.
- Preserve architecture boundaries.
- Keep src/core engine-agnostic.
- Keep Tone.js isolated under src/playback/tone.
- Keep .gamecue.json as the source of truth.
- Avoid full DAW scope.
- Avoid future-ticket features.
- Run build/tests when possible.
- Provide manual verification steps.
- Update docs only when needed.

Do not implement source code.

After creating AGENTS.md, provide:
- File created
- Summary of instructions
- Any recommended next docs
```

---

# 21. Project-Specific Skill Creation Prompt

Use later if we decide to add Codex skills to the repo.

```text
Create a project-specific Codex skill for GameCue.

Skill name:
[NAME]

Purpose:
[WHAT THE SKILL SHOULD HELP WITH]

Relevant docs:
- docs/GameCue_Full_Design_Document.md
- docs/GameCue_MVP_Technical_Design.md
- docs/Tickets.md
- AGENTS.md

Requirements:
- Create a SKILL.md file under the appropriate skill folder.
- Keep instructions concise and actionable.
- Include when to use the skill.
- Include project architecture rules.
- Include ticket-scope rules.
- Include expected final report format.
- Do not implement app source code.

After creating the skill, provide:
- File created
- Summary
- Example prompt using the skill
```

---

# 22. Post-Codex Report Template

When Codex finishes, copy this back into ChatGPT.

```text
Ticket:
[ID + title]

Branch:
[branch name if any]

Codex summary:
[paste summary]

Files changed:
[paste file list]

Commands run:
[paste commands]

Build/test result:
[paste results]

Manual verification I performed:
[paste what you checked]

Issues noticed:
[paste issues]

Question:
What should we do next?
```

---

# 23. Manual Verification Result Template

Use this after testing locally.

```text
Manual Verification Result

Ticket:
[ID + title]

Date:
[date]

Commands run:
- [command]
- [command]

Result:
- Build: pass/fail
- Tests: pass/fail/not present
- Browser verification: pass/fail
- Audio verification: pass/fail/not applicable

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
```

---

# 24. Branch Naming Convention

Suggested branch format:

```text
gamecue/t0001-project-skeleton
gamecue/t0002-core-project-model
gamecue/t0016-play-stop-loop-controls
```

Rules:

- One ticket per branch.
- Keep branch names lowercase.
- Include ticket ID.
- Use short descriptive name.
- Merge only after build and manual verification pass.

---

# 25. Commit Message Convention

Suggested format:

```text
T0001: create GameCue project skeleton
T0002: add core project model types
T0016: wire play stop loop controls
```

For bugfixes:

```text
Fix T0016: prevent overlapping Tone playback
```

For docs:

```text
Docs: update GameCue ticket plan after T0001
```

---

# 26. PR Description Template

Use when creating a pull request.

```markdown
## Ticket

T000X — Ticket Title

## Summary

- 
- 
- 

## Scope

Implemented only:
- 

Did not implement:
- 

## Files Changed

- 
- 
- 

## Verification

Commands run:
- [ ] npm install
- [ ] npm run build
- [ ] npm test

Manual verification:
- [ ] Step 1
- [ ] Step 2
- [ ] Step 3

## Screenshots / Audio Notes

Optional.

## Risks / Follow-ups

- 
```

---

# 27. Recommended First Sequence

Use these in order:

```text
1. T0000D — Codex Prompt Playbook
2. T0000E — AGENTS.md
3. T0001 — Project Skeleton
4. T0002 — Core Project Model
5. T0003 — Basic App Layout
6. T0004 — Cue Controls UI
7. T0005 — Music Theory Helpers
```

Do not add Tone.js until T0014.

---

# 28. Summary

This playbook exists to keep GameCue development controlled, testable, and easy to recover from. The goal is not to make Codex build the entire app at once. The goal is to use Codex like a disciplined junior developer working from strong design docs and small tickets.

For every ticket:

```text
Small scope.
Clear boundaries.
Build/test.
Manual verification.
Report back.
Update docs.
Then move on.
```
