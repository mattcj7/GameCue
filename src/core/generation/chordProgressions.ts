import type { CueMode, CueSettings } from "../model";
import { resolveChordProgression, type ResolvedChord } from "../theory/progressions";
import type { CueTemplate } from "../templates/CueTemplate";
import { getCueTemplate } from "../templates/templateLookup";

type ProgressionPattern = readonly string[];

const beatsPerBarForFourFour = 4;

const majorProgressionPatterns = [
  ["I", "V", "vi", "IV"],
  ["I", "IV", "V", "I"],
  ["I", "vi", "IV", "V"],
  ["vi", "IV", "I", "V"],
] as const satisfies readonly ProgressionPattern[];

const minorProgressionPatterns = [
  ["i", "VI", "III", "VII"],
  ["i", "iv", "VI", "V"],
  ["i", "VII", "VI", "VII"],
  ["i", "VI", "iv", "V"],
  ["i", "III", "VII", "VI"],
] as const satisfies readonly ProgressionPattern[];

const suspenseProgressionPatterns = [
  ["i", "bII"],
  ["i", "iv", "bII", "V"],
  ["i", "bII", "i", "V"],
  ["i", "VII", "bII", "V"],
] as const satisfies readonly ProgressionPattern[];

const drivingMinorProgressionPatterns = [
  ["i", "VII", "VI", "VII"],
  ["i", "VI", "VII", "V"],
  ["i", "VII", "VI", "V"],
] as const satisfies readonly ProgressionPattern[];

const gentleMajorProgressionPatterns = [
  ["I", "vi", "IV", "V"],
  ["I", "IV", "I", "V"],
  ["I", "V", "IV", "I"],
] as const satisfies readonly ProgressionPattern[];

const gentleMinorProgressionPatterns = [
  ["i", "III", "VII", "VI"],
  ["i", "VI", "III", "VII"],
  ["i", "iv", "VI", "III"],
] as const satisfies readonly ProgressionPattern[];

const sparseMajorProgressionPatterns = [
  ["I", "IV"],
  ["I", "V"],
  ["vi", "IV"],
] as const satisfies readonly ProgressionPattern[];

const sparseMinorProgressionPatterns = [
  ["i", "VII"],
  ["i", "VI"],
  ["i", "i", "VII", "VII"],
] as const satisfies readonly ProgressionPattern[];

const stingerMajorProgressionPatterns = [
  ["I", "V"],
  ["I", "IV"],
  ["vi", "IV"],
] as const satisfies readonly ProgressionPattern[];

const stingerMinorProgressionPatterns = [
  ["i", "V"],
  ["i", "VII"],
  ["i", "bII"],
] as const satisfies readonly ProgressionPattern[];

export type ChordProgressionStyle =
  | "major"
  | "minor"
  | "suspense"
  | "driving"
  | "gentle"
  | "sparse"
  | "stinger";

export interface ChordProgressionRequest {
  settings: CueSettings;
  template?: CueTemplate;
}

export interface GeneratedChord {
  chordId: string;
  symbol: string;
  degree: number;
  root: ResolvedChord["root"];
  quality: ResolvedChord["quality"];
  notes: ResolvedChord["notes"];
  startBeat: number;
  durationBeats: number;
  barIndex: number;
}

export interface GeneratedChordProgression {
  key: CueSettings["key"];
  mode: CueSettings["mode"];
  bars: CueSettings["bars"];
  beatsPerBar: number;
  totalBeats: number;
  style: ChordProgressionStyle;
  chords: GeneratedChord[];
}

export function generateChordProgression(
  request: ChordProgressionRequest,
): GeneratedChordProgression {
  const { settings } = request;
  const template = resolveTemplate(settings, request.template);
  const beatsPerBar = getBeatsPerBar(settings);
  const totalBeats = settings.bars * beatsPerBar;
  const style = selectChordProgressionStyle(settings, template);
  const pattern = selectChordPattern(style, settings.mode, settings, template);
  const fittedPattern = fitPatternToBars(pattern, settings.bars);
  const resolvedChords = resolveChordProgression(settings.key, settings.mode, fittedPattern);
  const chords = resolvedChords.map((chord, index) =>
    createGeneratedChord(chord, index, beatsPerBar, totalBeats),
  );

  return {
    key: settings.key,
    mode: settings.mode,
    bars: settings.bars,
    beatsPerBar,
    totalBeats,
    style,
    chords,
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

function getBeatsPerBar(settings: CueSettings): number {
  if (settings.timeSignature !== "4/4") {
    throw new RangeError(`Unsupported time signature for chord progression generation: ${settings.timeSignature}`);
  }

  return beatsPerBarForFourFour;
}

function selectChordProgressionStyle(
  settings: CueSettings,
  template: CueTemplate,
): ChordProgressionStyle {
  if (template.generationProfile.harmonyStyle === "impact_chord") {
    return "stinger";
  }

  if (template.generationProfile.harmonyStyle === "dissonant_pad") {
    return "suspense";
  }

  if (
    template.generationProfile.bassStyle === "driving" ||
    template.generationProfile.percussionStyle === "driving"
  ) {
    return "driving";
  }

  if (
    template.generationProfile.loopIntent === "ambient_bed" &&
    template.generationProfile.density === "very_sparse"
  ) {
    return "sparse";
  }

  if (
    settings.type === "emotional_scene" ||
    template.generationProfile.harmonyStyle === "soft_progression"
  ) {
    return "gentle";
  }

  return settings.mode === "major" ? "major" : "minor";
}

function selectChordPattern(
  style: ChordProgressionStyle,
  mode: CueMode,
  settings: CueSettings,
  template: CueTemplate,
): ProgressionPattern {
  const patternOptions = getPatternOptions(style, mode);
  const selectedIndex = getDeterministicIndex(patternOptions.length, settings, template, style);

  return patternOptions[selectedIndex];
}

function getPatternOptions(
  style: ChordProgressionStyle,
  mode: CueMode,
): readonly ProgressionPattern[] {
  switch (style) {
    case "major":
      return majorProgressionPatterns;
    case "minor":
      return minorProgressionPatterns;
    case "suspense":
      return suspenseProgressionPatterns;
    case "driving":
      return mode === "major" ? majorProgressionPatterns : drivingMinorProgressionPatterns;
    case "gentle":
      return mode === "major" ? gentleMajorProgressionPatterns : gentleMinorProgressionPatterns;
    case "sparse":
      return mode === "major" ? sparseMajorProgressionPatterns : sparseMinorProgressionPatterns;
    case "stinger":
      return mode === "major" ? stingerMajorProgressionPatterns : stingerMinorProgressionPatterns;
  }
}

function getDeterministicIndex(
  count: number,
  settings: CueSettings,
  template: CueTemplate,
  style: ChordProgressionStyle,
): number {
  const signature = [
    settings.type,
    settings.mood,
    settings.key,
    settings.mode,
    settings.intensity.toString(),
    settings.bars.toString(),
    template.generationProfile.density,
    template.generationProfile.harmonyStyle,
    style,
  ].join("|");

  let hash = 0;

  for (const character of signature) {
    hash = (hash * 31 + character.charCodeAt(0)) % 2147483647;
  }

  return hash % count;
}

function fitPatternToBars(pattern: ProgressionPattern, bars: number): string[] {
  return Array.from({ length: bars }, (_, index) => pattern[index % pattern.length]);
}

function createGeneratedChord(
  chord: ResolvedChord,
  barIndex: number,
  beatsPerBar: number,
  totalBeats: number,
): GeneratedChord {
  const startBeat = barIndex * beatsPerBar;
  const durationBeats = Math.min(beatsPerBar, totalBeats - startBeat);

  return {
    chordId: createChordId(barIndex),
    symbol: chord.symbol,
    degree: chord.degree,
    root: chord.root,
    quality: chord.quality,
    notes: [...chord.notes],
    startBeat,
    durationBeats,
    barIndex,
  };
}

function createChordId(barIndex: number): string {
  return `chord_${String(barIndex + 1).padStart(4, "0")}`;
}
