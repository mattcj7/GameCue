import type { CueSettings, NoteEvent } from "../model";
import type { CueTemplate } from "../templates";
import { getCueTemplate } from "../templates";
import {
  generateChordProgression,
  type GeneratedChord,
  type GeneratedChordProgression,
} from "./chordProgressions";

const beatsPerBarForFourFour = 4;

export type BasslineStyle = CueTemplate["generationProfile"]["bassStyle"];

export interface BasslineRequest {
  settings: CueSettings;
  chordProgression?: GeneratedChordProgression;
  template?: CueTemplate;
}

export interface GeneratedBassline {
  cueType: CueSettings["type"];
  bars: number;
  beatsPerBar: number;
  totalBeats: number;
  style: BasslineStyle;
  events: NoteEvent[];
}

interface BassEventDraft {
  pitch: string;
  startBeat: number;
  durationBeats: number;
  velocity: number;
}

export function generateBassline(request: BasslineRequest): GeneratedBassline {
  const { settings } = request;
  const template = resolveTemplate(settings, request.template);
  const chordProgression =
    request.chordProgression ?? generateChordProgression({ settings, template });

  validateChordProgression(settings, chordProgression);

  const style = template.generationProfile.bassStyle;
  const rawEvents = createBassEvents(settings, chordProgression);
  const events = rawEvents
    .sort(compareBassEvents)
    .map((event, index) => ({
      id: createBassEventId(index),
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
      `Unsupported time signature for bassline generation: ${settings.timeSignature}`,
    );
  }

  if (chordProgression.beatsPerBar !== beatsPerBarForFourFour) {
    throw new RangeError(
      `Unsupported beats per bar for bassline generation: ${chordProgression.beatsPerBar}`,
    );
  }
}

function createBassEvents(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
): BassEventDraft[] {
  switch (settings.type) {
    case "investigation":
      return createSparseRootPulses(settings, chordProgression);
    case "suspense":
      return createOstinatoBass(settings, chordProgression);
    case "chase":
      return createDrivingBass(settings, chordProgression);
    case "menu_theme":
      return createSteadySupportBass(settings, chordProgression);
    case "discovery_sting":
      return createAccentBass(settings, chordProgression);
    case "emotional_scene":
      return createSupportiveBass(settings, chordProgression);
    case "dark_ambient":
      return createDroneBass(settings, chordProgression);
  }
}

function createSparseRootPulses(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
): BassEventDraft[] {
  const velocity = getBassVelocity(settings.type, settings.intensity);
  const chordStep = settings.intensity >= 4 ? 1 : 2;
  const pulseDuration = settings.intensity >= 4 ? 2 : 1.5;

  return chordProgression.chords.flatMap((chord, index) => {
    if (index % chordStep !== 0) {
      return [];
    }

    return createSingleRootEvent(chord, chordProgression.totalBeats, pulseDuration, velocity);
  });
}

function createOstinatoBass(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
): BassEventDraft[] {
  const velocity = getBassVelocity(settings.type, settings.intensity);
  const intervalBeats = settings.intensity >= 4 ? 1 : settings.intensity >= 2 ? 2 : 4;
  const durationBeats = intervalBeats >= 2 ? 1.5 : 0.75;

  return chordProgression.chords.flatMap((chord) =>
    createRepeatedRootEvents(
      chord,
      chordProgression.totalBeats,
      intervalBeats,
      durationBeats,
      velocity,
    ),
  );
}

function createDrivingBass(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
): BassEventDraft[] {
  const velocity = getBassVelocity(settings.type, settings.intensity);
  const intervalBeats = settings.intensity >= 4 ? 0.5 : settings.intensity >= 2 ? 1 : 2;
  const durationBeats = intervalBeats <= 0.5 ? 0.5 : intervalBeats === 1 ? 0.75 : 1.5;

  return chordProgression.chords.flatMap((chord) =>
    createRepeatedRootEvents(
      chord,
      chordProgression.totalBeats,
      intervalBeats,
      durationBeats,
      velocity,
    ),
  );
}

function createSteadySupportBass(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
): BassEventDraft[] {
  const velocity = getBassVelocity(settings.type, settings.intensity);

  return chordProgression.chords.flatMap((chord) =>
    createRepeatedRootEvents(chord, chordProgression.totalBeats, 2, 1.5, velocity),
  );
}

function createAccentBass(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
): BassEventDraft[] {
  const velocity = getBassVelocity(settings.type, settings.intensity);
  const activeChordCount = settings.intensity >= 4 ? 2 : 1;

  return chordProgression.chords.flatMap((chord, index) => {
    if (index >= activeChordCount) {
      return [];
    }

    return createSingleRootEvent(chord, chordProgression.totalBeats, 1.5, velocity);
  });
}

function createSupportiveBass(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
): BassEventDraft[] {
  const velocity = getBassVelocity(settings.type, settings.intensity);

  return chordProgression.chords.flatMap((chord) =>
    createSingleRootEvent(
      chord,
      chordProgression.totalBeats,
      chord.durationBeats,
      velocity,
    ),
  );
}

function createDroneBass(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
): BassEventDraft[] {
  const velocity = getBassVelocity(settings.type, settings.intensity);
  const events: BassEventDraft[] = [];

  for (let index = 0; index < chordProgression.chords.length; index += 2) {
    const chord = chordProgression.chords[index];
    const nextChord = chordProgression.chords[index + 1];
    const targetDuration = chord.durationBeats + (nextChord?.durationBeats ?? 0);

    events.push(
      ...createSingleRootEvent(
        chord,
        chordProgression.totalBeats,
        targetDuration,
        velocity,
      ),
    );
  }

  return events;
}

function createSingleRootEvent(
  chord: GeneratedChord,
  totalBeats: number,
  targetDuration: number,
  velocity: number,
): BassEventDraft[] {
  const durationBeats = clampDuration(targetDuration, chord.startBeat, totalBeats);

  if (durationBeats <= 0) {
    return [];
  }

  return [
    {
      pitch: getBassPitch(chord.root),
      startBeat: chord.startBeat,
      durationBeats,
      velocity,
    },
  ];
}

function createRepeatedRootEvents(
  chord: GeneratedChord,
  totalBeats: number,
  intervalBeats: number,
  durationBeats: number,
  velocity: number,
): BassEventDraft[] {
  const events: BassEventDraft[] = [];

  for (let offset = 0; offset < chord.durationBeats; offset += intervalBeats) {
    const startBeat = chord.startBeat + offset;
    const remainingChordBeats = chord.durationBeats - offset;
    const boundedDuration = clampDuration(
      Math.min(durationBeats, remainingChordBeats),
      startBeat,
      totalBeats,
    );

    if (boundedDuration <= 0) {
      continue;
    }

    events.push({
      pitch: getBassPitch(chord.root),
      startBeat,
      durationBeats: boundedDuration,
      velocity,
    });
  }

  return events;
}

function getBassPitch(root: GeneratedChord["root"]): string {
  const octave = root === "A" || root === "A#" || root === "B" ? 1 : 2;

  return `${root}${octave}`;
}

function clampDuration(durationBeats: number, startBeat: number, totalBeats: number): number {
  return Math.min(durationBeats, totalBeats - startBeat);
}

function getBassVelocity(
  cueType: CueSettings["type"],
  intensity: CueSettings["intensity"],
): number {
  const baseVelocityByCueType: Record<CueSettings["type"], number> = {
    investigation: 0.56,
    suspense: 0.62,
    chase: 0.72,
    menu_theme: 0.6,
    discovery_sting: 0.76,
    emotional_scene: 0.54,
    dark_ambient: 0.5,
  };

  return clampVelocity(baseVelocityByCueType[cueType] + (intensity - 1) * 0.04);
}

function clampVelocity(value: number): number {
  return Math.min(1, Math.max(0, Number(value.toFixed(2))));
}

function compareBassEvents(left: BassEventDraft, right: BassEventDraft): number {
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

function createBassEventId(index: number): string {
  return `bass_${String(index + 1).padStart(4, "0")}`;
}
