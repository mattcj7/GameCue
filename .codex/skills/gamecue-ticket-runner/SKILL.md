---
name: gamecue-ticket-runner
description: Use for implementing one small GameCue ticket at a time while enforcing scope, architecture boundaries, and completion reporting.
---

# GameCue Ticket Runner

Use this skill when Codex is asked to implement a normal GameCue ticket, ticketed bugfix, small refactor, or small feature from `docs/Tickets.md`.

## Required Context

Before coding, review the relevant parts of:

- `AGENTS.md`
- `docs/GameCue_Full_Design_Document.md`
- `docs/GameCue_MVP_Technical_Design.md`
- `docs/Tickets.md`
- `docs/Codex_Prompt_Playbook.md`

If the user pasted a ticket body, treat the pasted ticket as the controlling scope for this run.

## Ticket Discipline

- Implement **one ticket only**.
- Do not implement future-ticket features.
- Do not refactor unrelated code.
- Do not change architecture unless the ticket requires it.
- Stay inside the ticket's allowed areas when they are listed.
- Respect the ticket's do-not-touch areas.
- If useful work is discovered outside scope, report it as a follow-up instead of implementing it.
- Prefer the smallest complete implementation that satisfies the acceptance criteria.

## GameCue Architecture Rules

- `.gamecue.json` project data is the source of truth.
- Do not make Tone.js objects, browser audio objects, or React component state the project data model.
- Keep `src/core/` engine-agnostic.
- Do not import Tone.js, browser audio APIs, DOM APIs, or React components into `src/core/`.
- Keep Tone.js code under `src/playback/tone/`.
- Keep UI components focused on rendering, user input, and orchestration.
- Put generation, theory, serialization, and validation logic in the correct `src/core/*` areas.
- Use TypeScript strict mode and avoid unnecessary dependencies.

## Implementation Process

1. Identify the exact ticket ID, title, and acceptance criteria.
2. Inspect the existing repo before editing.
3. Make the smallest set of changes needed for the ticket.
4. Add or update tests when the ticket creates testable logic.
5. Run relevant commands when possible.
6. Do a final scope check against the ticket.
7. Produce a completion report.

## Default Commands

Use the commands that exist in the repo. Common GameCue commands are expected to be:

```bash
npm install
npm run build
npm test
npm run dev
```

Do not invent commands that are not configured. If a command is missing, report that clearly.

For Codex Windows verification, use this build order:

```powershell
npm.cmd run build
& 'C:\Program Files\nodejs\npm.cmd' run build
& .\node_modules\.bin\tsc.cmd -b
& .\node_modules\.bin\vite.cmd build
```

If `npm.ps1` is blocked or `npm` is missing from `PATH`, treat that as an environment issue, not a code failure.

Do not waste time repeatedly probing `npm` PATH issues once one verification path works.

Do not use raw Node ESM imports against TypeScript source files for verification when the code depends on Vite/TypeScript module resolution.

Always report which verification path you used.

## Completion Report

End with:

- Summary of what changed
- Files changed
- Commands run
- Build/test result
- Manual verification steps
- Risks or follow-ups

## Scope Guardrail Language

When tempted to do more than the ticket asks, use this approach:

```text
Out of scope for this ticket. Recommended follow-up: [short follow-up ticket idea].
```
