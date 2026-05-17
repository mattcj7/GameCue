import { getTriadNotes, type TriadQuality } from "./chords";
import { transposeNote, type NoteName } from "./notes";
import { getScaleDegreeNote, type ScaleMode } from "./scales";

const romanNumeralDegrees = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
} as const;

interface ParsedChordSymbol {
  accidentalOffset: number;
  degree: number;
  quality: TriadQuality;
}

export interface ResolvedChord {
  symbol: string;
  degree: number;
  root: NoteName;
  quality: TriadQuality;
  notes: NoteName[];
}

function parseChordSymbol(symbol: string): ParsedChordSymbol {
  const trimmedSymbol = symbol.trim();
  const match = /^(?<accidentals>[b#]*)(?<roman>[ivIV]+)$/.exec(trimmedSymbol);

  if (!match?.groups) {
    throw new RangeError(`Invalid chord symbol: ${symbol}`);
  }

  const accidentalOffset = [...match.groups.accidentals].reduce((offset, accidental) => {
    return offset + (accidental === "b" ? -1 : 1);
  }, 0);
  const romanNumeral = match.groups.roman;
  const normalizedRomanNumeral = romanNumeral.toUpperCase() as keyof typeof romanNumeralDegrees;
  const degree = romanNumeralDegrees[normalizedRomanNumeral];

  if (!degree) {
    throw new RangeError(`Unsupported chord symbol: ${symbol}`);
  }

  const quality: TriadQuality =
    romanNumeral === normalizedRomanNumeral ? "major" : "minor";

  return {
    accidentalOffset,
    degree,
    quality,
  };
}

function normalizeProgression(progression: string | readonly string[]): string[] {
  if (typeof progression !== "string") {
    return progression.map((symbol: string) => symbol.trim()).filter(Boolean);
  }

  return progression
    .split(/\s*-\s*/)
    .map((symbol: string) => symbol.trim())
    .filter(Boolean);
}

export function resolveChordProgression(
  rootNote: string,
  mode: ScaleMode,
  progression: string | readonly string[],
): ResolvedChord[] {
  return normalizeProgression(progression).map((symbol) => {
    const parsedSymbol = parseChordSymbol(symbol);
    const scaleDegreeNote = getScaleDegreeNote(rootNote, mode, parsedSymbol.degree);
    const chordRoot =
      parsedSymbol.accidentalOffset === 0
        ? scaleDegreeNote
        : transposeNote(scaleDegreeNote, parsedSymbol.accidentalOffset);

    return {
      symbol,
      degree: parsedSymbol.degree,
      root: chordRoot,
      quality: parsedSymbol.quality,
      notes: getTriadNotes(chordRoot, parsedSymbol.quality),
    };
  });
}
