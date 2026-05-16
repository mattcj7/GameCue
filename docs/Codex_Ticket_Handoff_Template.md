# GameCue Codex Ticket Handoff Template

**Project:** GameCue  
**Version:** 0.1  
**Status:** Reusable Prompt Template  
**Purpose:** Provide a consistent copy/paste structure for handing one ticket to Codex.

---

# 1. How To Use This Template

For each Codex task:

1. Copy the template in Section 2.
2. Fill in the ticket details from `docs/Tickets.md`.
3. Add the relevant skill add-on if applicable.
4. Paste into Codex.
5. Require Codex to report files changed, commands run, build/test results, and manual verification.

Do not give Codex multiple implementation tickets at once.

---

# 2. Standard Ticket Handoff Prompt

```text
We are working on the GameCue project.

Before coding, review:
- AGENTS.md
- docs/GameCue_Full_Design_Document.md
- docs/GameCue_MVP_Technical_Design.md
- docs/Tickets.md
- docs/Codex_Prompt_Playbook.md
- docs/Repo_Current_State.md
- docs/Design_Update_Companion.md
- docs/Manual_Verification_Guide.md

Implement this ticket only.

Ticket:
[Ticket ID — Ticket Title]

Branch:
[Suggested branch name]

Goal:
[Paste goal from Tickets.md]

Dependencies:
[Paste dependencies]

Allowed areas:
[Paste allowed areas]

Do not touch:
[Paste do-not-touch areas]

Requirements:
[Paste requirements]

Non-goals:
[Paste non-goals]

Acceptance criteria:
[Paste acceptance criteria]

Manual verification:
[Paste manual verification]

Relevant skill guidance:
[Paste skill add-on if relevant, or say "No specific skill required. Use AGENTS.md and docs."]

Project rules:
- Implement the requested ticket only.
- Do not implement future-ticket features.
- Do not refactor unrelated code.
- Do not introduce new architecture unless required by this ticket.
- Keep `.gamecue.json` as the source of truth.
- Keep `src/core` engine-agnostic.
- Keep Tone.js isolated under `src/playback/tone`.
- Do not import Tone.js from `src/core`.
- Use TypeScript strict mode.
- Avoid unnecessary dependencies.
- Keep manual verification practical.

After implementation, provide:
- Summary of what changed
- Files changed
- Commands run
- Build/test results
- Manual verification steps
- Whether docs need updating
- Whether Repo_Current_State.md should be updated
- Any risks or follow-up tickets
```

---

# 3. T0001 Filled Example

```text
We are working on the GameCue project.

Before coding, review:
- AGENTS.md
- docs/GameCue_Full_Design_Document.md
- docs/GameCue_MVP_Technical_Design.md
- docs/Tickets.md
- docs/Codex_Prompt_Playbook.md
- docs/Repo_Current_State.md
- docs/Design_Update_Companion.md
- docs/Manual_Verification_Guide.md

Implement this ticket only.

Ticket:
T0001 — Project Skeleton

Branch:
gamecue/t0001-project-skeleton

Goal:
Create the initial Vite + React + TypeScript GameCue app skeleton.

Dependencies:
T0000C

Allowed areas:
repo root, src/app, src/ui, docs

Do not touch:
Tone.js playback, generation logic, save/load logic

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
- Add simple App.tsx.
- Display:
  - GameCue
  - Generate loopable game music cues
  - Placeholder Cue Controls section
  - Placeholder Track List section
  - Placeholder Transport section
  - Placeholder Save/Load section
- Add README run instructions.
- Ensure app builds.

Non-goals:
- No Tone.js.
- No audio playback.
- No generator.
- No project schema implementation.
- No save/load.

Acceptance criteria:
- npm install works.
- npm run dev starts the app.
- npm run build succeeds.
- App displays the basic GameCue shell.

Manual verification:
1. Run npm install.
2. Run npm run dev.
3. Open local app.
4. Confirm GameCue heading appears.
5. Confirm placeholder sections appear.
6. Stop dev server.
7. Run npm run build.
8. Confirm build succeeds.

Relevant skill guidance:
Use the gamecue-ticket-runner skill if available. Implement this ticket only and stay within docs/Tickets.md.

Project rules:
- Implement the requested ticket only.
- Do not implement future-ticket features.
- Do not refactor unrelated code.
- Do not introduce new architecture unless required by this ticket.
- Keep `.gamecue.json` as the source of truth.
- Keep `src/core` engine-agnostic.
- Keep Tone.js isolated under `src/playback/tone`.
- Do not import Tone.js from `src/core`.
- Use TypeScript strict mode.
- Avoid unnecessary dependencies.
- Keep manual verification practical.

After implementation, provide:
- Summary of what changed
- Files changed
- Commands run
- Build/test results
- Manual verification steps
- Whether docs need updating
- Whether Repo_Current_State.md should be updated
- Any risks or follow-up tickets
```

---

# 4. Bugfix Handoff Prompt

```text
We are working on GameCue. Fix this bug only.

Before coding, review:
- AGENTS.md
- docs/Tickets.md
- docs/Repo_Current_State.md
- docs/Known_Issues_And_Followups.md
- Relevant source files

Related ticket:
[Ticket ID]

Bug:
[Describe the bug]

Observed behavior:
[What happened]

Expected behavior:
[What should happen]

Evidence:
[Paste console output, build output, screenshot notes, or manual verification notes]

Allowed areas:
[List files/folders likely involved]

Do not touch:
[List areas to avoid]

Constraints:
- Fix only this bug.
- Do not implement new features.
- Do not refactor unrelated code.
- Keep architecture boundaries intact.
- Add/update tests if the bug is testable.
- Update Known_Issues_And_Followups.md if this issue should be tracked.

After fixing, provide:
- Root cause
- Files changed
- Commands run
- Build/test results
- Manual verification steps
- Whether the known issue can be closed
- Any follow-up tickets
```

---

# 5. Docs Update Handoff Prompt

```text
We are updating GameCue docs after a completed ticket.

Completed ticket:
[Ticket ID — Title]

Implementation summary:
[Paste Codex summary]

Files changed:
[Paste files]

Manual verification result:
[Paste result]

Docs to review:
- docs/Repo_Current_State.md
- docs/Tickets.md
- docs/Design_Update_Companion.md
- docs/Known_Issues_And_Followups.md
- README.md if setup or commands changed

Requirements:
- Update only affected docs.
- Mark ticket status if appropriate.
- Update repo state snapshot.
- Add design decision only if architecture/design changed.
- Add known issues/followups only if needed.
- Do not rewrite whole docs.

After updating, provide:
- Docs changed
- Summary of updates
- Next recommended ticket
```

---

# 6. Completion Report Review Prompt

Use this back in ChatGPT after Codex finishes.

```text
Review this GameCue ticket completion and tell me:
1. Whether Codex stayed in scope.
2. Whether the ticket appears complete.
3. What I should manually verify.
4. Whether docs need updating.
5. Whether Repo_Current_State.md needs updating.
6. Whether there are follow-up tickets.
7. Whether we should move to the next ticket.

Ticket:
[ID + title]

Codex summary:
[Paste summary]

Files changed:
[Paste files]

Commands run:
[Paste commands]

Build/test results:
[Paste results]

Manual verification I performed:
[Paste manual result if any]

Issues noticed:
[Paste issues]
```

---

# 7. Skill Add-On Cheat Sheet

Add one line to the handoff prompt.

| Ticket Type | Add-On |
|---|---|
| General implementation | Use the gamecue-ticket-runner skill if available. |
| Core generation | Use the gamecue-core-generation skill if available. |
| Tone.js playback | Use the gamecue-audio-playback skill if available. |
| Save/load | Use the gamecue-save-load skill if available. |
| UI | Use the gamecue-ui skill if available. |
| Export | Use the gamecue-export skill if available. |
| Docs | Use the gamecue-doc-updater skill if available. |
| Manual verification | Use the gamecue-manual-verification skill if available. |
| Design review | Use the gamecue-design-check skill if available. |

---

# 8. Rule

If the prompt feels too big, the ticket is probably too big.

Split it before handing it to Codex.
