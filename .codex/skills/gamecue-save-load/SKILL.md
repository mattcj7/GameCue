---
name: gamecue-save-load
description: Use for GameCue project serialization, validation, browser save/load, schema changes, invalid-file handling, and .gamecue.json persistence work.
---

# GameCue Save / Load

Use this skill for tickets involving project serialization, validation, browser file save/load, invalid file errors, schema changes, backward compatibility planning, or `.gamecue.json` persistence.

## Required Context

Before coding, review the relevant parts of:

- `AGENTS.md`
- `docs/GameCue_Full_Design_Document.md`
- `docs/GameCue_MVP_Technical_Design.md`
- `docs/Tickets.md`
- Existing files under `src/core/model/`
- Existing files under `src/core/serialization/`

## Source-of-Truth Rule

`.gamecue.json` is the portable source of truth for GameCue projects.

Saved project files must contain plain JSON-compatible data only.

Do not serialize:

- Tone.js objects
- Browser audio objects
- DOM objects
- React component state internals
- Functions
- Class instances that cannot round-trip cleanly through JSON
- Temporary runtime caches

## Schema Rules

- Preserve `schemaVersion` when present.
- Add schema changes intentionally and document them.
- Prefer explicit validation over trusting arbitrary JSON.
- Loaded data should be normalized only in clear, documented ways.
- Failed validation should not crash the app.
- Failed loads should not destroy the current valid project state.

## Save Rules

- Save the current `GameCueProject` data, not playback runtime state.
- Use a safe filename.
- Prefer `.gamecue.json` extension.
- Include useful project metadata when the model supports it.
- Keep saved JSON readable enough for debugging when practical.

## Load Rules

- Validate before applying loaded data to app state.
- Show or return useful errors for invalid files.
- Do not partially apply invalid data.
- Do not assume the file extension alone makes content valid.
- Handle malformed JSON gracefully.

## UI Boundary Rules

UI components may expose save/load buttons and show errors, but should delegate real work to:

- `src/core/serialization/saveProject.ts`
- `src/core/serialization/loadProject.ts`
- `src/core/serialization/validateProject.ts`
- app-level orchestration hooks/services as needed

## Testing Guidance

When useful, add tests for:

- Valid project serializes and parses.
- Invalid JSON is rejected safely.
- Missing required fields fail validation.
- Schema version is preserved.
- Loaded project matches expected plain data.
- Failed load does not mutate existing project state, if state orchestration is part of the ticket.

## Manual Verification Guidance

Include steps to check:

- Save creates a `.gamecue.json` file.
- Saved file can be opened as JSON.
- Loading the saved file restores the expected project.
- Invalid files produce a controlled error.
- Current project remains intact after a failed load.

## Completion Report Additions

In addition to the standard report, include:

- Any schema/model fields added or changed
- Whether saved output remains engine-agnostic
- Validation behavior for invalid files
- Backward compatibility concerns or follow-ups
