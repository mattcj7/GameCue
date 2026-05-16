---
name: gamecue-manual-verification
description: Use after each GameCue ticket to create a practical 5-10 minute human verification checklist.
---

# GameCue Manual Verification

Use this skill after a GameCue ticket is implemented, before merging a branch, or after a bugfix that needs human confirmation.

## Required Context

Before writing verification steps, review:

- `AGENTS.md`
- `docs/Tickets.md`
- `docs/GameCue_Manual_Verification_Guide.md`
- The completed ticket description or completion report

## Verification Goal

Manual verification should answer:

> Did this ticket work, and did it break anything obvious?

Keep most checklists to **5-10 minutes** unless the ticket is unusually broad.

## Standard Verification Categories

Include only the categories that apply:

- Build verification
- Test verification
- Browser/UI verification
- Audio playback verification
- Save/load verification
- Export verification
- Regression smoke test
- Documentation check

## Standard Commands

Use commands that actually exist in the project. Common commands are:

```bash
npm install
npm run build
npm test
npm run dev
```

Expected default results:

- `npm run build` completes without TypeScript/Vite errors.
- `npm test` passes when tests exist.
- `npm run dev` starts the app for browser checks.

If tests are not configured yet, state `Tests: not present/not configured` instead of treating that as a failure.

## Browser Verification Rules

For UI-related tickets, include steps to check:

- App loads without a blank screen.
- Browser console has no fatal errors.
- New UI appears in the expected place.
- User interaction works as described by the ticket.
- Existing obvious UI still works.

## Audio Verification Rules

For playback-related tickets, include steps to check:

- Audio starts only after a user gesture.
- Play/stop behavior is predictable.
- Looping matches cue length.
- Mute/solo behavior works when applicable.
- No obvious overlapping playback after stop/regenerate/load.
- No console errors from Tone.js or disposed objects.

## Save/Load Verification Rules

For `.gamecue.json` tickets, include steps to check:

- Save produces a file with the expected extension.
- Saved JSON is readable and contains expected metadata.
- Load restores the project without crashing.
- Invalid files show a controlled error.
- Failed loads do not destroy the current project state.

## Export Verification Rules

For export tickets, include steps to check:

- Export file is created.
- Filename is safe and useful.
- Metadata is preserved when applicable.
- Export reflects project data, not stale playback state.
- Any known export limitations are documented.

## Output Format

Use this format:

```text
Manual Verification Checklist

Ticket:
[ID + title]

Commands:
1. [command]
   Expected: [result]

Browser/UI:
1. [step]
   Expected: [result]

Ticket-specific checks:
1. [step]
   Expected: [result]

Regression smoke test:
1. [step]
   Expected: [result]

Pass/fail notes:
- Build: pass/fail/not run
- Tests: pass/fail/not present/not run
- Browser: pass/fail/not applicable
- Audio: pass/fail/not applicable
- Save/load: pass/fail/not applicable
- Export: pass/fail/not applicable
```

## Good Checklist Rules

- Be specific enough that a tired human can follow it.
- Include expected results after each meaningful step.
- Mention failure signs when useful.
- Do not require deep code review unless the ticket is specifically a review task.
- Do not create a massive QA plan for a tiny ticket.
