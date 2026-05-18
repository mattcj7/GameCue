import type { CueSettings, NoteEvent } from "../model";
import { getScaleDegreeNote, getScaleNotes } from "../theory";
import type { CueTemplate } from "../templates";
import { getCueTemplate } from "../templates";
import {
  generateChordProgression,
  type GeneratedChord,
  type GeneratedChordProgression,
} from "./chordProgressions";

const beatsPerBarForFourFour = 4;
const defaultMelodyOctave = 4;
const accentMelodyOctave = 5;
const scaleNoteCount = 7;

export type MelodyStyle =
  | "sparse_motif"
  | "fragmented"
  | "action_motif"
  | "strong_theme"
  | "resolving_phrase"
  | "lyrical"
  | "minimal_motif";

export interface MelodyRequest {
  settings: CueSettings;
  chordProgression?: GeneratedChordProgression;
  template?: CueTemplate;
}

export interface GeneratedMelody {
  cueType: CueSettings["type"];
  bars: number;
  beatsPerBar: number;
  totalBeats: number;
  style: MelodyStyle;
  events: NoteEvent[];
}

interface MelodyEventDraft {
  pitch: string;
  startBeat: number;
  durationBeats: number;
  velocity: number;
}

interface MelodySlot {
  offset: number;
  durationBeats: number;
  noteSource: "chord" | "scale";
  stepDelta?: number;
  resolveDegree?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  accent?: boolean;
}

interface ScaleNoteChoice {
  noteName: string;
  scaleIndex: number;
}

export function generateMelody(request: MelodyRequest): GeneratedMelody {
  const { settings } = request;
  const template = resolveTemplate(settings, request.template);
  const chordProgression =
    request.chordProgression ?? generateChordProgression({ settings, template });

  validateChordProgression(settings, chordProgression);

  const scaleNotes = getScaleNotes(settings.key, settings.mode);
  const style = resolveMelodyStyle(settings, template);
  const rawEvents = createMelodyEvents(settings, chordProgression, scaleNotes);
  const events = rawEvents
    .sort(compareMelodyEvents)
    .map((event, index) => ({
      id: createMelodyEventId(index),
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
    throw new RangeError(`Unsupported time signature for melody generation: ${settings.timeSignature}`);
  }

  if (chordProgression.beatsPerBar !== beatsPerBarForFourFour) {
    throw new RangeError(
      `Unsupported beats per bar for melody generation: ${chordProgression.beatsPerBar}`,
    );
  }
}

function resolveMelodyStyle(settings: CueSettings, template: CueTemplate): MelodyStyle {
  if (settings.type === "dark_ambient") {
    return "minimal_motif";
  }

  switch (template.generationProfile.melodyStyle) {
    case "sparse_motif":
    case "fragmented":
    case "action_motif":
    case "strong_theme":
    case "resolving_phrase":
    case "lyrical":
      return template.generationProfile.melodyStyle;
    case "none":
      return "minimal_motif";
  }
}

function createMelodyEvents(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
  scaleNotes: readonly string[],
): MelodyEventDraft[] {
  switch (settings.type) {
    case "investigation":
      return createInvestigationMelody(settings, chordProgression, scaleNotes);
    case "suspense":
      return createSuspenseMelody(settings, chordProgression, scaleNotes);
    case "chase":
      return createChaseMelody(settings, chordProgression, scaleNotes);
    case "menu_theme":
      return createMenuThemeMelody(settings, chordProgression, scaleNotes);
    case "discovery_sting":
      return createDiscoveryStingMelody(settings, chordProgression, scaleNotes);
    case "emotional_scene":
      return createEmotionalSceneMelody(settings, chordProgression, scaleNotes);
    case "dark_ambient":
      return createDarkAmbientMelody(settings, chordProgression, scaleNotes);
  }
}

function createInvestigationMelody(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
  scaleNotes: readonly string[],
): MelodyEventDraft[] {
  return chordProgression.chords.flatMap((chord) => {
    const barIndex = chord.barIndex;
    const usePrimaryMotif = settings.intensity >= 4 || barIndex % 2 === 0;

    if (!usePrimaryMotif) {
      if (settings.intensity < 5 || barIndex % 4 !== 3) {
        return [];
      }

      return renderMelodySlots({
        settings,
        chord,
        totalBeats: chordProgression.totalBeats,
        scaleNotes,
        slots: [{ offset: 2, durationBeats: 0.5, noteSource: "chord" }],
      });
    }

    const slots: MelodySlot[] = [{ offset: 0, durationBeats: 0.5, noteSource: "chord" }];

    if (settings.intensity >= 3 && barIndex % 4 !== 1) {
      slots.push({ offset: 2.5, durationBeats: 0.5, noteSource: "scale", stepDelta: 1 });
    }

    if (settings.intensity >= 5 && barIndex % 4 === 2) {
      slots.push({ offset: 3.5, durationBeats: 0.5, noteSource: "scale", stepDelta: -1 });
    }

    return renderMelodySlots({
      settings,
      chord,
      totalBeats: chordProgression.totalBeats,
      scaleNotes,
      slots,
    });
  });
}

function createSuspenseMelody(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
  scaleNotes: readonly string[],
): MelodyEventDraft[] {
  return chordProgression.chords.flatMap((chord) => {
    const phraseVariant = chord.barIndex % 2;
    const slots: MelodySlot[] =
      phraseVariant === 0
        ? [
            { offset: 0, durationBeats: 0.5, noteSource: "chord" },
            { offset: 1.5, durationBeats: 0.5, noteSource: "scale", stepDelta: 1 },
          ]
        : [
            { offset: 0, durationBeats: 0.5, noteSource: "chord" },
            { offset: 3, durationBeats: 0.5, noteSource: "scale", stepDelta: -1 },
          ];

    if (settings.intensity >= 3) {
      slots.push({ offset: 2.5, durationBeats: 0.5, noteSource: "scale", stepDelta: -1 });
    }

    if (settings.intensity >= 4 && phraseVariant === 1) {
      slots.push({ offset: 2, durationBeats: 0.5, noteSource: "chord" });
    }

    return renderMelodySlots({
      settings,
      chord,
      totalBeats: chordProgression.totalBeats,
      scaleNotes,
      slots,
    });
  });
}

function createChaseMelody(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
  scaleNotes: readonly string[],
): MelodyEventDraft[] {
  return chordProgression.chords.flatMap((chord) => {
    const phraseVariant = chord.barIndex % 2;
    const slots: MelodySlot[] =
      phraseVariant === 0
        ? [
            { offset: 0, durationBeats: 0.5, noteSource: "chord" },
            { offset: 0.5, durationBeats: 0.5, noteSource: "scale", stepDelta: 1 },
            { offset: 1.5, durationBeats: 0.5, noteSource: "scale", stepDelta: -1 },
            { offset: 2, durationBeats: 0.5, noteSource: "chord" },
            { offset: 3, durationBeats: 0.5, noteSource: "scale", stepDelta: 1, accent: true },
          ]
        : [
            { offset: 0, durationBeats: 0.5, noteSource: "chord" },
            { offset: 1, durationBeats: 0.5, noteSource: "scale", stepDelta: 1 },
            { offset: 1.5, durationBeats: 0.5, noteSource: "scale", stepDelta: -1 },
            { offset: 2, durationBeats: 0.5, noteSource: "chord" },
            { offset: 2.5, durationBeats: 0.5, noteSource: "scale", stepDelta: 1 },
          ];

    if (settings.intensity >= 4) {
      slots.push({ offset: 3.5, durationBeats: 0.5, noteSource: "scale", stepDelta: -1 });
    }

    return renderMelodySlots({
      settings,
      chord,
      totalBeats: chordProgression.totalBeats,
      scaleNotes,
      slots,
    });
  });
}

function createMenuThemeMelody(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
  scaleNotes: readonly string[],
): MelodyEventDraft[] {
  return chordProgression.chords.flatMap((chord) => {
    const phraseEndingBar = chord.barIndex % 4 === 3;
    const slots: MelodySlot[] = [
      { offset: 0, durationBeats: 0.75, noteSource: "chord" },
      { offset: 1.5, durationBeats: 0.5, noteSource: "scale", stepDelta: 1 },
      { offset: 2, durationBeats: 0.75, noteSource: "chord" },
      phraseEndingBar
        ? { offset: 3, durationBeats: 1, noteSource: "scale", resolveDegree: 1, accent: true }
        : { offset: 3, durationBeats: 0.5, noteSource: "scale", stepDelta: -1 },
    ];

    if (settings.intensity >= 4) {
      slots.push({ offset: 1, durationBeats: 0.5, noteSource: "scale", stepDelta: 1 });
    }

    return renderMelodySlots({
      settings,
      chord,
      totalBeats: chordProgression.totalBeats,
      scaleNotes,
      slots,
    });
  });
}

function createDiscoveryStingMelody(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
  scaleNotes: readonly string[],
): MelodyEventDraft[] {
  const activeBars = settings.intensity >= 4 ? 2 : 1;

  return chordProgression.chords.flatMap((chord) => {
    if (chord.barIndex >= activeBars) {
      return [];
    }

    const slots: MelodySlot[] =
      chord.barIndex === 0
        ? [
            { offset: 0, durationBeats: 0.75, noteSource: "chord" },
            { offset: 1, durationBeats: 0.5, noteSource: "scale", stepDelta: 1 },
            { offset: 2, durationBeats: 0.75, noteSource: "chord", accent: true },
            { offset: 3, durationBeats: 0.5, noteSource: "scale", resolveDegree: 1 },
          ]
        : [
            { offset: 0, durationBeats: 1, noteSource: "chord", accent: true },
            { offset: 2, durationBeats: 1, noteSource: "scale", resolveDegree: 1 },
          ];

    return renderMelodySlots({
      settings,
      chord,
      totalBeats: chordProgression.totalBeats,
      scaleNotes,
      slots,
    });
  });
}

function createEmotionalSceneMelody(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
  scaleNotes: readonly string[],
): MelodyEventDraft[] {
  return chordProgression.chords.flatMap((chord) => {
    const phraseEndingBar = chord.barIndex % 4 === 3;
    const slots: MelodySlot[] = [{ offset: 0, durationBeats: 1.5, noteSource: "chord" }];

    if (chord.barIndex % 2 === 0 || settings.intensity >= 4 || phraseEndingBar) {
      slots.push(
        phraseEndingBar
          ? { offset: 2.5, durationBeats: 1, noteSource: "scale", resolveDegree: 1 }
          : { offset: 2.5, durationBeats: 1, noteSource: "scale", stepDelta: 1 },
      );
    }

    return renderMelodySlots({
      settings,
      chord,
      totalBeats: chordProgression.totalBeats,
      scaleNotes,
      slots,
    });
  });
}

function createDarkAmbientMelody(
  settings: CueSettings,
  chordProgression: GeneratedChordProgression,
  scaleNotes: readonly string[],
): MelodyEventDraft[] {
  const barStride = settings.intensity >= 5 ? 2 : 4;

  return chordProgression.chords.flatMap((chord) => {
    if (chord.barIndex % barStride !== 0) {
      return [];
    }

    const slots: MelodySlot[] = [{ offset: 0, durationBeats: 2, noteSource: "chord" }];

    if (settings.intensity >= 5) {
      slots.push({ offset: 2, durationBeats: 1.5, noteSource: "chord" });
    }

    return renderMelodySlots({
      settings,
      chord,
      totalBeats: chordProgression.totalBeats,
      scaleNotes,
      slots,
    });
  });
}

function renderMelodySlots({
  settings,
  chord,
  totalBeats,
  scaleNotes,
  slots,
}: {
  settings: CueSettings;
  chord: GeneratedChord;
  totalBeats: number;
  scaleNotes: readonly string[];
  slots: readonly MelodySlot[];
}): MelodyEventDraft[] {
  const tonic = getScaleDegreeNote(settings.key, settings.mode, 1);
  const anchorChoice = getAnchorScaleChoice(scaleNotes, chord, tonic);
  let previousChoice = anchorChoice;

  return slots.flatMap((slot, slotIndex) => {
    const startBeat = Number((chord.startBeat + slot.offset).toFixed(2));
    const chordEndBeat = chord.startBeat + chord.durationBeats;

    if (startBeat < chord.startBeat || startBeat >= chordEndBeat || startBeat >= totalBeats) {
      return [];
    }

    const durationBeats = Number(
      clampDuration(Math.min(slot.durationBeats, chordEndBeat - startBeat), startBeat, totalBeats).toFixed(2),
    );

    if (durationBeats <= 0) {
      return [];
    }

    const currentChoice =
      slot.noteSource === "chord"
        ? selectChordToneChoice(
            chord,
            scaleNotes,
            previousChoice.scaleIndex,
            chord.barIndex + slotIndex + settings.intensity,
            tonic,
          )
        : selectScaleToneChoice(settings, scaleNotes, previousChoice, slot);

    previousChoice = currentChoice;

    return [
      {
        pitch: `${currentChoice.noteName}${slot.accent ? accentMelodyOctave : defaultMelodyOctave}`,
        startBeat,
        durationBeats,
        velocity: getMelodyVelocity(settings.type, settings.intensity, slot),
      },
    ];
  });
}

function getAnchorScaleChoice(
  scaleNotes: readonly string[],
  chord: GeneratedChord,
  fallbackNote: string,
): ScaleNoteChoice {
  const chordToneChoices = getChordToneChoices(chord, scaleNotes);

  if (chordToneChoices.length > 0) {
    return chordToneChoices[0];
  }

  const fallbackScaleIndex = getScaleIndex(scaleNotes, fallbackNote);

  return {
    noteName: fallbackNote,
    scaleIndex: fallbackScaleIndex,
  };
}

function selectChordToneChoice(
  chord: GeneratedChord,
  scaleNotes: readonly string[],
  previousScaleIndex: number,
  variationSeed: number,
  fallbackNote: string,
): ScaleNoteChoice {
  const chordToneChoices = getChordToneChoices(chord, scaleNotes);

  if (chordToneChoices.length === 0) {
    return {
      noteName: fallbackNote,
      scaleIndex: getScaleIndex(scaleNotes, fallbackNote),
    };
  }

  const sortedChoices = [...chordToneChoices].sort((left, right) => {
    const leftDistance = getScaleDistance(left.scaleIndex, previousScaleIndex);
    const rightDistance = getScaleDistance(right.scaleIndex, previousScaleIndex);

    if (leftDistance !== rightDistance) {
      return leftDistance - rightDistance;
    }

    return left.scaleIndex - right.scaleIndex;
  });

  const maximumStableChoices = Math.min(sortedChoices.length, 2);
  const preferredRank = maximumStableChoices <= 1 ? 0 : variationSeed % maximumStableChoices;

  return sortedChoices[preferredRank];
}

function selectScaleToneChoice(
  settings: CueSettings,
  scaleNotes: readonly string[],
  previousChoice: ScaleNoteChoice,
  slot: MelodySlot,
): ScaleNoteChoice {
  const noteName =
    slot.resolveDegree !== undefined
      ? getScaleDegreeNote(settings.key, settings.mode, slot.resolveDegree)
      : scaleNotes[wrapScaleIndex(previousChoice.scaleIndex + (slot.stepDelta ?? 0))];

  return {
    noteName,
    scaleIndex: getScaleIndex(scaleNotes, noteName),
  };
}

function getChordToneChoices(
  chord: GeneratedChord,
  scaleNotes: readonly string[],
): ScaleNoteChoice[] {
  return chord.notes.flatMap((noteName) => {
    const scaleIndex = scaleNotes.indexOf(noteName);

    if (scaleIndex < 0) {
      return [];
    }

    return [
      {
        noteName,
        scaleIndex,
      },
    ];
  });
}

function getScaleIndex(scaleNotes: readonly string[], noteName: string): number {
  const scaleIndex = scaleNotes.indexOf(noteName);

  if (scaleIndex < 0) {
    throw new RangeError(`Note ${noteName} is not part of the active scale.`);
  }

  return scaleIndex;
}

function wrapScaleIndex(scaleIndex: number): number {
  return ((scaleIndex % scaleNoteCount) + scaleNoteCount) % scaleNoteCount;
}

function getScaleDistance(left: number, right: number): number {
  const directDistance = Math.abs(left - right);

  return Math.min(directDistance, scaleNoteCount - directDistance);
}

function clampDuration(durationBeats: number, startBeat: number, totalBeats: number): number {
  return Math.min(durationBeats, totalBeats - startBeat);
}

function getMelodyVelocity(
  cueType: CueSettings["type"],
  intensity: CueSettings["intensity"],
  slot: MelodySlot,
): number {
  const baseVelocityByCueType: Record<CueSettings["type"], number> = {
    investigation: 0.48,
    suspense: 0.52,
    chase: 0.68,
    menu_theme: 0.62,
    discovery_sting: 0.74,
    emotional_scene: 0.54,
    dark_ambient: 0.42,
  };

  const strongBeatAccent = slot.noteSource === "chord" ? 0.04 : 0;
  const highRegisterAccent = slot.accent ? 0.05 : 0;

  return clampVelocity(
    baseVelocityByCueType[cueType] +
      (intensity - 1) * 0.04 +
      strongBeatAccent +
      highRegisterAccent,
  );
}

function clampVelocity(value: number): number {
  return Math.min(1, Math.max(0, Number(value.toFixed(2))));
}

function compareMelodyEvents(left: MelodyEventDraft, right: MelodyEventDraft): number {
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

function createMelodyEventId(index: number): string {
  return `melody_${String(index + 1).padStart(4, "0")}`;
}
