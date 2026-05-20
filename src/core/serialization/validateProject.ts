import type { GameCueProject } from "../model";
import {
  cueModes,
  cueTypes,
  instrumentIds,
  moods,
  noteEventTypes,
  schemaVersions,
  timeSignatures,
  trackTypes,
} from "../model";

const minSupportedBpm = 40;
const maxSupportedBpm = 220;
const beatsPerBar = 4;

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: ValidationError[] };

export interface ValidationError {
  path: string;
  message: string;
}

export function validateProject(value: unknown): ValidationResult<GameCueProject> {
  if (!isRecord(value)) {
    return {
      ok: false,
      errors: [{ path: "project", message: "Project must be a non-null object" }],
    };
  }

  const errors: ValidationError[] = [];

  validateSchemaVersion(value.schemaVersion, errors);
  validateStringField(value.projectId, "projectId", "Project ID", errors);
  validateStringField(value.title, "title", "Title", errors);
  validateStringField(value.createdAt, "createdAt", "Created timestamp", errors);
  validateStringField(value.updatedAt, "updatedAt", "Updated timestamp", errors);

  const cue = validateObjectField(value.cue, "cue", "Cue object is required", errors);
  const totalBeats = cue ? validateCue(cue, errors) : undefined;

  const sections = validateArrayField(value.sections, "sections", "Sections array is required", errors);
  if (sections) {
    validateSections(sections, errors);
  }

  const tracks = validateArrayField(value.tracks, "tracks", "Tracks array is required", errors);
  const trackIds = tracks ? validateTracks(tracks, totalBeats, errors) : new Set<string>();

  const mix = validateObjectField(value.mix, "mix", "Mix settings are required", errors);
  if (mix) {
    validateMix(mix, trackIds, errors);
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: value as unknown as GameCueProject };
}

function validateCue(cue: Record<string, unknown>, errors: ValidationError[]): number | undefined {
  validateEnumField(cue.type, "cue.type", "Cue type", cueTypes, errors);
  validateEnumField(cue.mood, "cue.mood", "Mood", moods, errors);
  validateBpm(cue.bpm, errors);
  validateStringField(cue.key, "cue.key", "Key", errors, { allowEmpty: false });
  validateEnumField(cue.mode, "cue.mode", "Mode", cueModes, errors);
  validateIntensityField(cue.intensity, "cue.intensity", "Intensity", errors);
  const bars = validatePositiveIntegerField(cue.bars, "cue.bars", "Bars", errors);
  validateEnumField(
    cue.timeSignature,
    "cue.timeSignature",
    "Time signature",
    timeSignatures,
    errors,
  );

  return bars === undefined ? undefined : bars * beatsPerBar;
}

function validateSections(sections: unknown[], errors: ValidationError[]): void {
  for (const [index, sectionValue] of sections.entries()) {
    const sectionPath = `sections[${index}]`;
    const section = validateObjectField(sectionValue, sectionPath, "Section must be an object", errors);

    if (!section) {
      continue;
    }

    validateStringField(section.id, `${sectionPath}.id`, "Section ID", errors);
    validateStringField(section.name, `${sectionPath}.name`, "Section name", errors);
    validateNonNegativeIntegerField(
      section.startBar,
      `${sectionPath}.startBar`,
      "Section start bar",
      errors,
    );
    validatePositiveIntegerField(section.bars, `${sectionPath}.bars`, "Section bars", errors);
    validateIntensityField(section.intensity, `${sectionPath}.intensity`, "Section intensity", errors);
  }
}

function validateTracks(
  tracks: unknown[],
  totalBeats: number | undefined,
  errors: ValidationError[],
): Set<string> {
  const trackIds = new Set<string>();

  for (const [index, trackValue] of tracks.entries()) {
    const trackPath = `tracks[${index}]`;
    const track = validateObjectField(trackValue, trackPath, "Track must be an object", errors);

    if (!track) {
      continue;
    }

    const trackId = validateStringField(track.id, `${trackPath}.id`, "Track ID", errors);

    if (trackId) {
      if (trackIds.has(trackId)) {
        addError(errors, `${trackPath}.id`, "Track ID must be unique");
      } else {
        trackIds.add(trackId);
      }
    }

    validateStringField(track.name, `${trackPath}.name`, "Track name", errors);
    validateEnumField(track.type, `${trackPath}.type`, "Track type", trackTypes, errors);
    validateEnumField(
      track.instrument,
      `${trackPath}.instrument`,
      "Instrument",
      instrumentIds,
      errors,
    );
    validateBooleanField(track.muted, `${trackPath}.muted`, "Muted flag", errors);
    validateBooleanField(track.solo, `${trackPath}.solo`, "Solo flag", errors);
    validateBooleanField(track.locked, `${trackPath}.locked`, "Locked flag", errors);

    const events = validateArrayField(track.events, `${trackPath}.events`, "Events array is required", errors);
    if (events) {
      validateEvents(events, trackPath, totalBeats, errors);
    }
  }

  return trackIds;
}

function validateEvents(
  events: unknown[],
  trackPath: string,
  totalBeats: number | undefined,
  errors: ValidationError[],
): void {
  for (const [index, eventValue] of events.entries()) {
    const eventPath = `${trackPath}.events[${index}]`;
    const event = validateObjectField(eventValue, eventPath, "Event must be an object", errors);

    if (!event) {
      continue;
    }

    validateStringField(event.id, `${eventPath}.id`, "Event ID", errors);
    validateEnumField(event.type, `${eventPath}.type`, "Event type", noteEventTypes, errors);
    validateStringField(event.pitch, `${eventPath}.pitch`, "Pitch", errors, { allowEmpty: false });

    const startBeat = validateNonNegativeNumberField(
      event.startBeat,
      `${eventPath}.startBeat`,
      "Start beat",
      errors,
    );
    const durationBeats = validatePositiveNumberField(
      event.durationBeats,
      `${eventPath}.durationBeats`,
      "Duration",
      errors,
    );

    validateRangeField(event.velocity, `${eventPath}.velocity`, "Velocity", 0, 1, errors);

    if (
      totalBeats !== undefined &&
      startBeat !== undefined &&
      durationBeats !== undefined &&
      startBeat + durationBeats > totalBeats
    ) {
      addError(
        errors,
        `${eventPath}.durationBeats`,
        `Event must end within cue length of ${totalBeats} beats`,
      );
    }
  }
}

function validateMix(
  mix: Record<string, unknown>,
  trackIds: ReadonlySet<string>,
  errors: ValidationError[],
): void {
  validateRangeField(mix.masterVolume, "mix.masterVolume", "Master volume", 0, 1, errors);

  const mixTracks = validateArrayField(
    mix.tracks,
    "mix.tracks",
    "Track mix settings array is required",
    errors,
  );

  if (!mixTracks) {
    return;
  }

  for (const [index, mixTrackValue] of mixTracks.entries()) {
    const mixTrackPath = `mix.tracks[${index}]`;
    const mixTrack = validateObjectField(
      mixTrackValue,
      mixTrackPath,
      "Track mix settings must be an object",
      errors,
    );

    if (!mixTrack) {
      continue;
    }

    const trackId = validateStringField(mixTrack.trackId, `${mixTrackPath}.trackId`, "Track ID", errors);

    if (trackId && !trackIds.has(trackId)) {
      addError(errors, `${mixTrackPath}.trackId`, "Track mix must reference an existing track ID");
    }

    validateRangeField(mixTrack.volume, `${mixTrackPath}.volume`, "Track volume", 0, 1, errors);
    validateRangeField(mixTrack.pan, `${mixTrackPath}.pan`, "Track pan", -1, 1, errors);
  }
}

function validateSchemaVersion(
  schemaVersion: unknown,
  errors: ValidationError[],
): void {
  if (schemaVersion === undefined) {
    addError(errors, "schemaVersion", "Schema version is required");
    return;
  }

  if (typeof schemaVersion !== "string") {
    addError(errors, "schemaVersion", "Schema version must be a string");
    return;
  }

  if (!(schemaVersions as readonly string[]).includes(schemaVersion)) {
    addError(errors, "schemaVersion", "Unsupported schema version");
  }
}

function validateBpm(value: unknown, errors: ValidationError[]): void {
  if (value === undefined) {
    addError(errors, "cue.bpm", "BPM is required");
    return;
  }

  if (typeof value !== "number" || !Number.isFinite(value) || !Number.isInteger(value)) {
    addError(errors, "cue.bpm", "BPM must be a finite integer");
    return;
  }

  if (value < minSupportedBpm || value > maxSupportedBpm) {
    addError(errors, "cue.bpm", `BPM must be between ${minSupportedBpm} and ${maxSupportedBpm}`);
  }
}

function validateIntensityField(
  value: unknown,
  path: string,
  label: string,
  errors: ValidationError[],
): number | undefined {
  if (value === undefined) {
    addError(errors, path, `${label} is required`);
    return undefined;
  }

  if (typeof value !== "number" || !Number.isFinite(value) || !Number.isInteger(value)) {
    addError(errors, path, `${label} must be an integer between 1 and 5`);
    return undefined;
  }

  if (value < 1 || value > 5) {
    addError(errors, path, `${label} must be between 1 and 5`);
    return undefined;
  }

  return value;
}

function validateStringField(
  value: unknown,
  path: string,
  label: string,
  errors: ValidationError[],
  options: { allowEmpty?: boolean } = {},
): string | undefined {
  if (value === undefined) {
    addError(errors, path, `${label} is required`);
    return undefined;
  }

  if (typeof value !== "string") {
    addError(errors, path, `${label} must be a string`);
    return undefined;
  }

  if (!options.allowEmpty && value.trim().length === 0) {
    addError(errors, path, `${label} must not be empty`);
    return undefined;
  }

  return value;
}

function validateBooleanField(
  value: unknown,
  path: string,
  label: string,
  errors: ValidationError[],
): boolean | undefined {
  if (value === undefined) {
    addError(errors, path, `${label} is required`);
    return undefined;
  }

  if (typeof value !== "boolean") {
    addError(errors, path, `${label} must be a boolean`);
    return undefined;
  }

  return value;
}

function validateEnumField<T extends string>(
  value: unknown,
  path: string,
  label: string,
  allowedValues: readonly T[],
  errors: ValidationError[],
): T | undefined {
  if (value === undefined) {
    addError(errors, path, `${label} is required`);
    return undefined;
  }

  if (typeof value !== "string") {
    addError(errors, path, `${label} must be a string`);
    return undefined;
  }

  if (!allowedValues.includes(value as T)) {
    addError(errors, path, `${label} must be one of: ${allowedValues.join(", ")}`);
    return undefined;
  }

  return value as T;
}

function validateRangeField(
  value: unknown,
  path: string,
  label: string,
  minimum: number,
  maximum: number,
  errors: ValidationError[],
): number | undefined {
  if (value === undefined) {
    addError(errors, path, `${label} is required`);
    return undefined;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    addError(errors, path, `${label} must be a finite number`);
    return undefined;
  }

  if (value < minimum || value > maximum) {
    addError(errors, path, `${label} must be between ${minimum} and ${maximum}`);
    return undefined;
  }

  return value;
}

function validatePositiveIntegerField(
  value: unknown,
  path: string,
  label: string,
  errors: ValidationError[],
): number | undefined {
  if (value === undefined) {
    addError(errors, path, `${label} is required`);
    return undefined;
  }

  if (typeof value !== "number" || !Number.isFinite(value) || !Number.isInteger(value)) {
    addError(errors, path, `${label} must be a positive integer`);
    return undefined;
  }

  if (value < 1) {
    addError(errors, path, `${label} must be a positive integer`);
    return undefined;
  }

  return value;
}

function validateNonNegativeIntegerField(
  value: unknown,
  path: string,
  label: string,
  errors: ValidationError[],
): number | undefined {
  if (value === undefined) {
    addError(errors, path, `${label} is required`);
    return undefined;
  }

  if (typeof value !== "number" || !Number.isFinite(value) || !Number.isInteger(value)) {
    addError(errors, path, `${label} must be a non-negative integer`);
    return undefined;
  }

  if (value < 0) {
    addError(errors, path, `${label} must be a non-negative integer`);
    return undefined;
  }

  return value;
}

function validateNonNegativeNumberField(
  value: unknown,
  path: string,
  label: string,
  errors: ValidationError[],
): number | undefined {
  if (value === undefined) {
    addError(errors, path, `${label} is required`);
    return undefined;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    addError(errors, path, `${label} must be a finite number`);
    return undefined;
  }

  if (value < 0) {
    addError(errors, path, `${label} must be non-negative`);
    return undefined;
  }

  return value;
}

function validatePositiveNumberField(
  value: unknown,
  path: string,
  label: string,
  errors: ValidationError[],
): number | undefined {
  if (value === undefined) {
    addError(errors, path, `${label} is required`);
    return undefined;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    addError(errors, path, `${label} must be a finite number`);
    return undefined;
  }

  if (value <= 0) {
    addError(errors, path, `${label} must be greater than 0`);
    return undefined;
  }

  return value;
}

function validateObjectField(
  value: unknown,
  path: string,
  requiredMessage: string,
  errors: ValidationError[],
): Record<string, unknown> | undefined {
  if (value === undefined) {
    addError(errors, path, requiredMessage);
    return undefined;
  }

  if (!isRecord(value)) {
    addError(errors, path, `${toLabel(path)} must be an object`);
    return undefined;
  }

  return value;
}

function validateArrayField(
  value: unknown,
  path: string,
  requiredMessage: string,
  errors: ValidationError[],
): unknown[] | undefined {
  if (value === undefined) {
    addError(errors, path, requiredMessage);
    return undefined;
  }

  if (!Array.isArray(value)) {
    addError(errors, path, `${toLabel(path)} must be an array`);
    return undefined;
  }

  return value;
}

function addError(errors: ValidationError[], path: string, message: string): void {
  errors.push({ path, message });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toLabel(path: string): string {
  const lastPathSegment = path
    .split(".")
    .at(-1)
    ?.replace(/\[\d+\]/g, "")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase();

  if (!lastPathSegment) {
    return "Value";
  }

  return lastPathSegment.charAt(0).toUpperCase() + lastPathSegment.slice(1);
}
