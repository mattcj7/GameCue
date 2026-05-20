import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { generateProject } from "../../src/core/generation";
import type { CueSettings } from "../../src/core/model";
import {
  serializeProject,
  validateProject,
  type ValidationError,
  type ValidationResult,
} from "../../src/core/serialization";

function createSettings(overrides: Partial<CueSettings> = {}): CueSettings {
  return {
    type: "investigation",
    mood: "dark",
    intensity: 3,
    bpm: 86,
    key: "D",
    mode: "minor",
    bars: 16,
    timeSignature: "4/4",
    ...overrides,
  };
}

function createParsedProject(overrides: Partial<CueSettings> = {}): Record<string, unknown> {
  return JSON.parse(serializeProject(generateProject(createSettings(overrides)))) as Record<string, unknown>;
}

function expectValidationError(
  result: ValidationResult<unknown>,
  path: string,
  message: string,
): void {
  expect(result.ok).toBe(false);

  if (result.ok) {
    return;
  }

  expect(result.errors).toContainEqual({ path, message });
}

function getErrors(result: ValidationResult<unknown>): ValidationError[] {
  expect(result.ok).toBe(false);

  if (result.ok) {
    return [];
  }

  return result.errors;
}

describe("validateProject", () => {
  it("accepts a generated project and returns the original object", () => {
    const project = generateProject(createSettings());
    const result = validateProject(project);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value).toBe(project);
    }
  });

  it("accepts a generated project after serialize and parse round-trip", () => {
    const project = generateProject(createSettings({ type: "suspense", mood: "creepy" }));
    const roundTrippedProject = JSON.parse(serializeProject(project));
    const result = validateProject(roundTrippedProject);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value).toEqual(project);
    }
  });

  it("fails when schemaVersion is missing", () => {
    const invalidProject = createParsedProject();
    delete invalidProject.schemaVersion;

    const result = validateProject(invalidProject);

    expectValidationError(result, "schemaVersion", "Schema version is required");
  });

  it("fails when schemaVersion is unsupported", () => {
    const invalidProject = createParsedProject();
    invalidProject.schemaVersion = "9.9";

    const result = validateProject(invalidProject);

    expectValidationError(result, "schemaVersion", "Unsupported schema version");
  });

  it("fails when cue is missing", () => {
    const invalidProject = createParsedProject();
    delete invalidProject.cue;

    const result = validateProject(invalidProject);

    expectValidationError(result, "cue", "Cue object is required");
  });

  it("fails when tracks are missing", () => {
    const invalidProject = createParsedProject();
    delete invalidProject.tracks;

    const result = validateProject(invalidProject);

    expectValidationError(result, "tracks", "Tracks array is required");
  });

  it("fails when track IDs are duplicated", () => {
    const invalidProject = createParsedProject();
    const tracks = invalidProject.tracks as Array<Record<string, unknown>>;
    tracks[1]!.id = tracks[0]!.id;

    const result = validateProject(invalidProject);

    expectValidationError(result, "tracks[1].id", "Track ID must be unique");
  });

  it("fails invalid event timing cases for negative start, non-positive duration, and cue overflow", () => {
    const invalidProject = createParsedProject();
    const tracks = invalidProject.tracks as Array<Record<string, unknown>>;
    const events = tracks[0]!.events as Array<Record<string, unknown>>;

    events[0]!.startBeat = -0.25;
    events[1]!.durationBeats = 0;
    events[2]!.startBeat = 63.5;
    events[2]!.durationBeats = 1;

    const result = validateProject(invalidProject);

    expectValidationError(result, "tracks[0].events[0].startBeat", "Start beat must be non-negative");
    expectValidationError(result, "tracks[0].events[1].durationBeats", "Duration must be greater than 0");
    expectValidationError(
      result,
      "tracks[0].events[2].durationBeats",
      "Event must end within cue length of 64 beats",
    );
  });

  it("fails when BPM is outside the supported range", () => {
    const invalidProject = createParsedProject();
    const cue = invalidProject.cue as Record<string, unknown>;
    cue.bpm = 221;

    const result = validateProject(invalidProject);

    expectValidationError(result, "cue.bpm", "BPM must be between 40 and 220");
  });

  it("fails when bars is not a positive integer", () => {
    const invalidProject = createParsedProject();
    const cue = invalidProject.cue as Record<string, unknown>;
    cue.bars = 0;

    const result = validateProject(invalidProject);

    expectValidationError(result, "cue.bars", "Bars must be a positive integer");
  });

  it("fails invalid enum values across cue, track, and event fields", () => {
    const invalidProject = createParsedProject();
    const cue = invalidProject.cue as Record<string, unknown>;
    const tracks = invalidProject.tracks as Array<Record<string, unknown>>;
    const firstEvent = (tracks[0]!.events as Array<Record<string, unknown>>)[0]!;

    cue.type = "boss_battle";
    cue.mood = "grim";
    cue.mode = "dorian";
    cue.timeSignature = "3/4";
    tracks[0]!.type = "strings";
    tracks[0]!.instrument = "piano";
    firstEvent.type = "control";

    const result = validateProject(invalidProject);
    const errors = getErrors(result);

    expect(errors).toContainEqual({
      path: "cue.type",
      message:
        "Cue type must be one of: investigation, suspense, chase, menu_theme, discovery_sting, emotional_scene, dark_ambient",
    });
    expect(errors).toContainEqual({
      path: "cue.mood",
      message: "Mood must be one of: dark, hopeful, creepy, urgent, sad, heroic, mysterious",
    });
    expect(errors).toContainEqual({
      path: "cue.mode",
      message: "Mode must be one of: major, minor",
    });
    expect(errors).toContainEqual({
      path: "cue.timeSignature",
      message: "Time signature must be one of: 4/4",
    });
    expect(errors).toContainEqual({
      path: "tracks[0].type",
      message: "Track type must be one of: drums, bass, chords, pad, melody, fx",
    });
    expect(errors).toContainEqual({
      path: "tracks[0].instrument",
      message:
        "Instrument must be one of: minimal_electronic_kit, sub_pulse, dark_pad, simple_lead, soft_pluck, ambient_texture",
    });
    expect(errors).toContainEqual({
      path: "tracks[0].events[0].type",
      message: "Event type must be one of: note, drum",
    });
  });

  it("returns multiple errors when several fields are invalid", () => {
    const invalidProject = {
      projectId: 42,
      title: "",
      createdAt: 123,
      updatedAt: null,
      cue: {
        type: "unknown",
        mood: "wrong",
        intensity: 8,
        bpm: 300,
        key: "",
        mode: "wrong",
        bars: 0,
        timeSignature: "3/4",
      },
      sections: [
        {
          id: 99,
          name: "",
          startBar: -1,
          bars: 0,
          intensity: 0,
        },
      ],
      tracks: [
        {
          id: "track_duplicate",
          name: "",
          type: "bad",
          instrument: "bad",
          muted: "no",
          solo: 1,
          locked: null,
          events: [
            {
              id: 5,
              type: "bad",
              pitch: "",
              startBeat: -1,
              durationBeats: 0,
              velocity: 2,
            },
          ],
        },
        {
          id: "track_duplicate",
          name: "Second track",
          type: "drums",
          instrument: "minimal_electronic_kit",
          muted: false,
          solo: false,
          locked: false,
          events: "not-an-array",
        },
      ],
      mix: {
        masterVolume: 2,
        tracks: [
          {
            trackId: "missing_track",
            volume: -0.1,
            pan: 2,
          },
        ],
      },
    };

    const result = validateProject(invalidProject);
    const errors = getErrors(result);

    expect(errors.length).toBeGreaterThan(10);
    expect(errors).toContainEqual({ path: "schemaVersion", message: "Schema version is required" });
    expect(errors).toContainEqual({ path: "projectId", message: "Project ID must be a string" });
    expect(errors).toContainEqual({ path: "cue.bpm", message: "BPM must be between 40 and 220" });
    expect(errors).toContainEqual({ path: "tracks[1].id", message: "Track ID must be unique" });
    expect(errors).toContainEqual({
      path: "mix.tracks[0].trackId",
      message: "Track mix must reference an existing track ID",
    });
  });

  it("does not mutate the input object during validation", () => {
    const project = createParsedProject({ type: "menu_theme", mood: "hopeful", key: "C", mode: "major" });
    const originalProject = structuredClone(project);

    validateProject(project);

    expect(project).toEqual(originalProject);
  });

  it("keeps validator source free of Tone, playback, app, ui, and browser file APIs", () => {
    const validatorSource = readFileSync(
      join(process.cwd(), "src", "core", "serialization", "validateProject.ts"),
      "utf8",
    );

    const forbiddenPatterns = [
      /from\s+["']tone["']/,
      /from\s+["'][^"']*playback[^"']*["']/,
      /from\s+["'][^"']*app[^"']*["']/,
      /from\s+["'][^"']*ui[^"']*["']/,
      /\bBlob\b/,
      /\bURL\.createObjectURL\b/,
      /\bdocument\b/,
      /\bwindow\b/,
    ];

    for (const forbiddenPattern of forbiddenPatterns) {
      expect(validatorSource).not.toMatch(forbiddenPattern);
    }
  });
});
