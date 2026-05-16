# GameCue Known Issues and Followups

**Project:** GameCue  
**Version:** 0.1  
**Status:** Living Issue / Follow-Up Tracker  
**Purpose:** Track bugs, limitations, deferred improvements, and follow-up tickets discovered during implementation.

---

# 1. Purpose

This file prevents small issues from getting lost between Codex tickets.

Use this file to track:

- Bugs found during manual verification
- Known limitations
- Deferred improvements
- Potential refactors
- Follow-up tickets
- Design concerns
- Technical debt

This file should not replace GitHub Issues if we use them later. It is a lightweight project-local tracker.

---

# 2. Issue Severity

Use these severity levels:

| Severity | Meaning |
|---|---|
| Critical | Blocks app from running/building |
| High | Breaks core workflow |
| Medium | Important but workaround exists |
| Low | Minor annoyance or polish item |
| Note | Observation or future idea |

---

# 3. Status Values

Use these statuses:

| Status | Meaning |
|---|---|
| Open | Needs attention |
| In Progress | Being handled now |
| Deferred | Intentionally postponed |
| Fixed | Resolved but not yet fully verified |
| Verified | Fixed and manually verified |
| Closed | No longer relevant |
| Superseded | Replaced by another issue/ticket |

---

# 4. Issue Entry Template

```markdown
## ISSUE-000X — Short Title

**Status:** Open  
**Severity:** Medium  
**Found During:** T000X  
**Related Tickets:** T000X, T000Y  
**Area:** UI / core / playback / save-load / export / docs  
**Date Found:** YYYY-MM-DD

### Problem

Describe the issue.

### Expected Behavior

Describe what should happen.

### Actual Behavior

Describe what happened.

### Evidence

Paste build output, console output, screenshot notes, or manual verification notes.

### Workaround

Describe any workaround.

### Recommended Fix

Describe likely fix or next step.

### Follow-Up Ticket

T00XX — Ticket title, or `Not assigned`.

### Resolution Notes

Add once fixed.
```

---

# 5. Current Known Issues

```text
No implementation issues yet.
```

---

# 6. Deferred Improvements

## FOLLOWUP-0001 — Consider Creating Project-Specific Codex Skills

**Status:** Deferred  
**Severity:** Note  
**Found During:** Planning  
**Related Tickets:** T0000F–T0000J optional  
**Area:** workflow/docs  
**Date Found:** 2026-05-15

### Problem

We have identified useful project-specific skills, but creating all of them before T0001 may delay implementation.

### Expected Behavior

Skills should support repeated Codex workflows without becoming a distraction.

### Actual Behavior

Skills are currently planned in `docs/GameCue_Starter_Skills_Reference.md` but not created.

### Workaround

Use `AGENTS.md`, `docs/Codex_Prompt_Playbook.md`, and `docs/Codex_Ticket_Handoff_Template.md`.

### Recommended Fix

Create skills only when repeated prompt patterns become common.

### Follow-Up Ticket

Optional:

```text
T0000F — Create gamecue-ticket-runner Skill
T0000G — Create gamecue-manual-verification Skill
T0000H — Create gamecue-core-generation Skill
```

### Resolution Notes

N/A

---

## FOLLOWUP-0002 — Decide Default Key for First Generator

**Status:** Deferred  
**Severity:** Low  
**Found During:** Planning  
**Related Tickets:** T0004, T0012  
**Area:** core generation / UI  
**Date Found:** 2026-05-15

### Problem

The default key has not been finalized.

### Expected Behavior

The app should start with a sensible default key and mode.

### Actual Behavior

Design docs mention D minor and C minor as possible defaults.

### Workaround

Use D minor unless changed during T0004 or T0012.

### Recommended Fix

Make final decision during T0004 Cue Controls UI or T0012 Full Project Generator.

### Follow-Up Ticket

T0004 or T0012

### Resolution Notes

N/A

---

## FOLLOWUP-0003 — Decide Whether Ambient Cues Default to No Drums

**Status:** Deferred  
**Severity:** Low  
**Found During:** Planning  
**Related Tickets:** T0006, T0008  
**Area:** cue templates / drum generation  
**Date Found:** 2026-05-15

### Problem

Dark ambient and emotional cues may sound better without drums by default.

### Expected Behavior

Templates should reflect game cue purpose.

### Actual Behavior

Current plan supports drums/percussion track, but sparse or disabled behavior needs final decision.

### Workaround

Generate very sparse percussion initially.

### Recommended Fix

During T0006/T0008, decide whether templates can mark drums as optional or disabled by default.

### Follow-Up Ticket

T0006 or T0008

### Resolution Notes

N/A

---

# 7. Closed Issues

```text
None yet.
```

---

# 8. Bugfix Prompt Helper

When an issue needs Codex work, use this summary:

```text
Fix ISSUE-000X only.

Problem:
[Paste problem]

Expected:
[Paste expected behavior]

Actual:
[Paste actual behavior]

Evidence:
[Paste evidence]

Constraints:
- Fix only this issue.
- Do not implement unrelated features.
- Preserve architecture boundaries.
- Update Known_Issues_And_Followups.md when complete.
```

---

# 9. Review Routine

After each ticket:

1. Check manual verification result.
2. Add issues if anything failed.
3. Add followups if Codex suggested work outside scope.
4. Mark fixed issues as verified after retest.
5. Keep this file concise and actionable.
