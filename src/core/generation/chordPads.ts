import type { CueSettings, NoteEvent } from "../model";
import { chromaticNotes } from "../theory";
import type { CueTemplate } from "../templates";
import { getCueTemplate } from "../templates";
import {
  generateChordProgression,
  type GeneratedChord,
  type GeneratedChordProgression,
} from "./chordProgressions";

const beatsPerBarForFourFour = 4;
const defaultChordOctave = 3;

export type ChordPadStyle = CueTemplate["generationProfile"]["harmonyStyle"];

export interface ChordPadRequest {
  settings: CueSettings;
  chordProgression?: GeneratedChordProgression;
  template?: CueTemplate;
}

export interface GeneratedChordPad {
  cueType: CueSettings["type"];
  bars: number;
  beatsPerBar: number;
  totalBeats: number;
  style: ChordPadStyle;
  events: NoteEvent[];
}

interface ChordPadEventDraft {
  pitch: string;
  startBeat: number;
  durationBeats: number;
  velocity: number;
}

export function generateChordPad(request: ChordPadRequest): GeneratedChordPad {
  const { settings } = request;
  const template = resolveTemplate(settings, request.template);
  const chordProgression =
    request.chordProgression ?? generateChordProgression({ settings, template });

  validateChordProgression(settings, chordProgression);

  const style = template.generationProfile.harmonyStyle;
  const rawEvents = createChordPadEvents(settings, chordProgression);
  const events = rawEvents
    .sort(compareChordPadEvents)
    .map((event, index) => ({
      id: createChordPadEventId(index),
      type: "note" as const,
      pitch: event.pitch,
      startBeat: event.startBeat,
      durationBeats: event.durationBeats,
      velocity: event.velocity,
    }));

  return {
    cueType: settings.type,
    bars: chordProgression.bars,
    beatsPerBar: chordProgression.beatsPerBar,
    totalBeats: chordProgression.totalBeats,
    style,
    events,
  };
}

function resolveTemplate(settings: CueSettings, template?: CueTemplate): CueTemplate {
  const resolvedTemplate = template ?? getCueTemplate(settings.type);

  if (resolvedTemplate.cueType !== settings.type) {
    throw new RangeError(
      `Template cue type ${resolvedTemplate.cueType} does not match settings type ${settings.type}.`,
    );
  }

  return resolvedTemplate;
}

function validateChordProgression(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
): void {
  if (settings.timeSignature !== "4/4") {
    throw new RangeError(
      `Unsupported time signature for chord/pad generation: ${settings.timeSignature}`,
    );
  }

  if (chordProgression.beatsPerBar !== beatsPerBarForFourFour) {
    throw new RangeError(
      `Unsupported beats per bar for chord/pad generation: ${chordProgression.beatsPerBar}`,
    );
  }
}

function createChordPadEvents(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
): ChordPadEventDraft[] {
  switch (settings.type) {
    case "investigation":
      return createHeldChordEvents(settings, chordProgression, false);
    case "suspense":
      return createSuspenseChordEvents(settings, chordProgression);
    case "chase":
      return createChaseChordEvents(settings, chordProgression);
    case "menu_theme":
      return createHeldChordEvents(settings, chordProgression, true);
    case "discovery_sting":
      return createDiscoveryChordEvents(settings, chordProgression);
    case "emotional_scene":
      return createEmotionalChordEvents(settings, chordProgression);
    case "dark_ambient":
      return createDarkAmbientChordEvents(settings, chordProgression);
  }
}

function createHeldChordEvents(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
  includeTopVoice: boolean,
): ChordPadEventDraft[] {
  const velocity = getChordPadVelocity(settings.type, settings.intensity);

  return chordProgression.chords.flatMap((chord) =>
    createChordHitEvents({
      chord,
      startBeat: chord.startBeat,
      endBeat: chord.startBeat + chord.durationBeats,
      totalBeats: chordProgression.totalBeats,
      velocity,
      includeTopVoice,
    }),
  );
}

function createSuspenseChordEvents(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
): ChordPadEventDraft[] {
  const velocity = getChordPadVelocity(settings.type, settings.intensity);
  const pulseOffsets =
    settings.intensity >= 4 ? [0, 1.5, 3] : settings.intensity >= 2 ? [0, 2] : [0];
  const targetDuration = settings.intensity >= 4 ? 1 : 1.5;

  return chordProgression.chords.flatMap((chord) =>
    pulseOffsets.flatMap((offset) => {
      const startBeat = chord.startBeat + offset;
      const endBeat = Math.min(
        chord.startBeat + chord.durationBeats,
        startBeat + targetDuration,
      );

      return createChordHitEvents({
        chord,
        startBeat,
        endBeat,
        totalBeats: chordProgression.totalBeats,
        velocity,
      });
    }),
  );
}

function createChaseChordEvents(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
): ChordPadEventDraft[] {
  const velocity = getChordPadVelocity(settings.type, settings.intensity);
  const stabOffsets =
    settings.intensity >= 4 ? [0, 1, 2, 3] : settings.intensity >= 2 ? [0, 2] : [0];
  const stabDuration = settings.intensity >= 4 ? 0.5 : 0.75;

  return chordProgression.chords.flatMap((chord) =>
    stabOffsets.flatMap((offset) => {
      const startBeat = chord.startBeat + offset;
      const endBeat = Math.min(
        chord.startBeat + chord.durationBeats,
        startBeat + stabDuration,
      );

      return createChordHitEvents({
        chord,
        startBeat,
        endBeat,
        totalBeats: chordProgression.totalBeats,
        velocity,
      });
    }),
  );
}

function createDiscoveryChordEvents(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
): ChordPadEventDraft[] {
  const velocity = getChordPadVelocity(settings.type, settings.intensity);
  const activeChordCount = settings.intensity >= 4 ? 2 : 1;

  return chordProgression.chords.flatMap((chord, index) => {
    if (index >= activeChordCount) {
      return [];
    }

    return createChordHitEvents({
      chord,
      startBeat: chord.startBeat,
      endBeat: Math.min(chord.startBeat + chord.durationBeats, chord.startBeat + 1.5),
      totalBeats: chordProgression.totalBeats,
      velocity,
    });
  });
}

function createEmotionalChordEvents(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
): ChordPadEventDraft[] {
  const velocity = getChordPadVelocity(settings.type, settings.intensity);

  return chordProgression.chords.flatMap((chord) =>
    createChordHitEvents({
      chord,
      startBeat: chord.startBeat,
      endBeat: chord.startBeat + chord.durationBeats,
      totalBeats: chordProgression.totalBeats,
      velocity,
      includeTopVoice: true,
    }),
  );
}

function createDarkAmbientChordEvents(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
): ChordPadEventDraft[] {
  const velocity = getChordPadVelocity(settings.type, settings.intensity);
  const events: ChordPadEventDraft[] = [];

  for (let index = 0; index < chordProgression.chords.length; index += 2) {
    const chord = chordProgression.chords[index];
    const nextChord = chordProgression.chords[index + 1];
    const endBeat = chord.startBeat + chord.durationBeats + (nextChord?.durationBeats ?? 0);

    events.push(
      ...createChordHitEvents({
        chord,
        startBeat: chord.startBeat,
        endBeat,
        totalBeats: chordProgression.totalBeats,
        velocity,
      }),
    );
  }

  return events;
}

function createChordHitEvents({
  chord,
  startBeat,
  endBeat,
  totalBeats,
  velocity,
  includeTopVoice = false,
}: {
  chord: GeneratedChord;
  startBeat: number;
  endBeat: number;
  totalBeats: number;
  velocity: number;
  includeTopVoice?: boolean;
}): ChordPadEventDraft[] {
  if (startBeat < 0 || startBeat >= totalBeats) {
    return [];
  }

  const boundedEndBeat = Math.min(endBeat, totalBeats);
  const durationBeats = Number((boundedEndBeat - startBeat).toFixed(2));

  if (durationBeats <= 0) {
    return [];
  }

  return createChordPitches(chord, includeTopVoice).map((pitch) => ({
    pitch,
    startBeat,
    durationBeats,
    velocity,
  }));
}

function createChordPitches(chord: GeneratedChord, includeTopVoice: boolean): string[] {
  const basePitches = chord.notes.reduce<string[]>((pitches, note, index) => {
    if (index === 0) {
      return [`${note}${defaultChordOctave}`];
    }

    const previousPitch = pitches[pitches.length - 1];
    const previousNote = stripOctave(previousPitch);
    const previousOctave = getPitchOctave(previousPitch);
    const nextOctave =
      getChromaticIndex(note) <= getChromaticIndex(previousNote)
        ? previousOctave + 1
        : previousOctave;

    return [...pitches, `${note}${nextOctave}`];
  }, []);

  if (!includeTopVoice) {
    return basePitches;
  }

  const topVoicePitch = basePitches[basePitches.length - 1];

  return [...basePitches, raisePitchByOctave(topVoicePitch)];
}

function getChromaticIndex(note: string): number {
  return chromaticNotes.indexOf(note as (typeof chromaticNotes)[number]);
}

function stripOctave(pitch: string): string {
  return pitch.replace(/\d+$/, "");
}

function getPitchOctave(pitch: string): number {
  const octaveMatch = pitch.match(/(\d+)$/);

  if (!octaveMatch) {
    throw new RangeError(`Pitch is missing an octave: ${pitch}`);
  }

  return Number(octaveMatch[1]);
}

function raisePitchByOctave(pitch: string): string {
  return `${stripOctave(pitch)}${getPitchOctave(pitch) + 1}`;
}

function getChordPadVelocity(
  cueType: CueSettings["type"],
  intensity: CueSettings["intensity"],
): number {
  const baseVelocityByCueType: Record<CueSettings["type"], number> = {
    investigation: 0.48,
    suspense: 0.58,
    chase: 0.72,
    menu_theme: 0.6,
    discovery_sting: 0.8,
    emotional_scene: 0.54,
    dark_ambient: 0.42,
  };

  return clampVelocity(baseVelocityByCueType[cueType] + (intensity - 1) * 0.03);
}

function clampVelocity(value: number): number {
  return Math.min(1, Math.max(0, Number(value.toFixed(2))));
}

function compareChordPadEvents(left: ChordPadEventDraft, right: ChordPadEventDraft): number {
  if (left.startBeat !== right.startBeat) {
    return left.startBeat - right.startBeat;
  }

  if (left.pitch !== right.pitch) {
    return left.pitch.localeCompare(right.pitch);
  }

  if (left.durationBeats !== right.durationBeats) {
    return left.durationBeats - right.durationBeats;
  }

  return left.velocity - right.velocity;
}

function createChordPadEventId(index: number): string {
  return `pad_${String(index + 1).padStart(4, "0")}`;
}
