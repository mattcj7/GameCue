export const schemaVersions = ["0.1"] as const;

export type SchemaVersion = (typeof schemaVersions)[number];

export type ProjectId = string;
export type SectionId = string;
export type TrackId = string;
export type EventId = string;

export const cueTypes = [
  "investigation",
  "suspense",
  "chase",
  "menu_theme",
  "discovery_sting",
  "emotional_scene",
  "dark_ambient",
] as const;

export type CueType = (typeof cueTypes)[number];

export const moods = [
  "dark",
  "hopeful",
  "creepy",
  "urgent",
  "sad",
  "heroic",
  "mysterious",
] as const;

export type Mood = (typeof moods)[number];

export const cueModes = ["major", "minor"] as const;

export type CueMode = (typeof cueModes)[number];

export type CueIntensity = 1 | 2 | 3 | 4 | 5;

export const trackTypes = [
  "drums",
  "bass",
  "chords",
  "pad",
  "melody",
  "fx",
] as const;

export type TrackType = (typeof trackTypes)[number];

export const instrumentIds = [
  "minimal_electronic_kit",
  "sub_pulse",
  "dark_pad",
  "simple_lead",
  "soft_pluck",
  "ambient_texture",
] as const;

export type InstrumentId = (typeof instrumentIds)[number];

export const noteEventTypes = ["note", "drum"] as const;

export type NoteEventType = (typeof noteEventTypes)[number];

export const timeSignatures = ["4/4"] as const;

export type TimeSignature = (typeof timeSignatures)[number];
