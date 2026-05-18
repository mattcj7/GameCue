import type {
  CueSettings,
  GameCueProject,
  MixSettings,
  NoteEvent,
  Section,
  Track,
} from "../model";
import { getCueTemplate } from "../templates";
import { generateBassline } from "./basslines";
import { generateChordPad } from "./chordPads";
import { generateChordProgression } from "./chordProgressions";
import { generateDrumPattern } from "./drumPatterns";
import { generateMelody } from "./melodies";

const deterministicProjectTimestamp = "2026-05-15T00:00:00.000Z";

export function generateProject(settings: CueSettings): GameCueProject {
  const template = getCueTemplate(settings.type);
  const chordProgression = generateChordProgression({ settings, template });
  const drumPattern = generateDrumPattern({ settings, template });
  const bassline = generateBassline({ settings, template, chordProgression });
  const chordPad = generateChordPad({ settings, template, chordProgression });
  const melody = generateMelody({ settings, template, chordProgression });

  const tracks: Track[] = [
    createTrack({
      id: "track_drums",
      name: "Drums",
      type: "drums",
      instrument: "minimal_electronic_kit",
      events: drumPattern.events,
    }),
    createTrack({
      id: "track_bass",
      name: "Bass",
      type: "bass",
      instrument: "sub_pulse",
      events: bassline.events,
    }),
    createTrack({
      id: "track_chords",
      name: "Chords / Pad",
      type: "chords",
      instrument: "dark_pad",
      events: chordPad.events,
    }),
    createTrack({
      id: "track_melody",
      name: "Melody / Motif",
      type: "melody",
      instrument: getMelodyInstrumentId(settings),
      events: melody.events,
    }),
  ];

  const sections: Section[] = [
    {
      id: "section_main",
      name: "Main",
      startBar: 0,
      bars: settings.bars,
      intensity: settings.intensity,
    },
  ];

  return {
    schemaVersion: "0.1",
    projectId: createProjectId(settings),
    title: createProjectTitle(settings),
    createdAt: deterministicProjectTimestamp,
    updatedAt: deterministicProjectTimestamp,
    cue: { ...settings },
    sections,
    tracks,
    mix: createMixSettings(),
  };
}

function createTrack({
  id,
  name,
  type,
  instrument,
  events,
}: Pick<Track, "id" | "name" | "type" | "instrument" | "events">): Track {
  return {
    id,
    name,
    type,
    instrument,
    muted: false,
    solo: false,
    locked: false,
    events: cloneEvents(events),
  };
}

function cloneEvents(events: readonly NoteEvent[]): NoteEvent[] {
  return events.map((event) => ({ ...event }));
}

function createProjectId(settings: CueSettings): GameCueProject["projectId"] {
  const parts = [
    settings.type,
    settings.mood,
    settings.key,
    settings.mode,
    settings.bpm.toString(),
    settings.bars.toString(),
    settings.intensity.toString(),
    settings.timeSignature,
  ];

  return `project_${parts.map(toProjectSlug).join("_")}`;
}

function createProjectTitle(settings: CueSettings): string {
  const moodLabel = formatTitleSegment(settings.mood);
  const cueTypeLabel = formatTitleSegment(settings.type);
  const modeLabel = formatTitleSegment(settings.mode);

  return `${moodLabel} ${cueTypeLabel} in ${settings.key} ${modeLabel}`;
}

function formatTitleSegment(value: string): string {
  return value
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function toProjectSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/#/g, "sharp")
    .replace(/\//g, "_")
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getMelodyInstrumentId(settings: CueSettings): Track["instrument"] {
  switch (settings.type) {
    case "chase":
    case "discovery_sting":
    case "menu_theme":
      return "simple_lead";
    case "investigation":
    case "suspense":
    case "emotional_scene":
    case "dark_ambient":
      return "soft_pluck";
  }
}

function createMixSettings(): MixSettings {
  return {
    masterVolume: 0.85,
    tracks: [
      {
        trackId: "track_drums",
        volume: 0.9,
        pan: 0,
      },
      {
        trackId: "track_bass",
        volume: 0.82,
        pan: 0,
      },
      {
        trackId: "track_chords",
        volume: 0.78,
        pan: -0.08,
      },
      {
        trackId: "track_melody",
        volume: 0.8,
        pan: 0.08,
      },
    ],
  };
}
