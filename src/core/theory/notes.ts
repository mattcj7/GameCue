export const chromaticNotes = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

export type NoteName = (typeof chromaticNotes)[number];

const normalizedNoteNames: Record<string, NoteName> = {
  C: "C",
  "B#": "C",
  "C#": "C#",
  Db: "C#",
  D: "D",
  "D#": "D#",
  Eb: "D#",
  E: "E",
  Fb: "E",
  "E#": "F",
  F: "F",
  "F#": "F#",
  Gb: "F#",
  G: "G",
  "G#": "G#",
  Ab: "G#",
  A: "A",
  "A#": "A#",
  Bb: "A#",
  B: "B",
  Cb: "B",
};

function formatNoteName(noteName: string): string {
  const trimmedNoteName = noteName.trim().replace(/♯/g, "#").replace(/♭/g, "b");
  const match = /^([A-Ga-g])([#b]?)$/.exec(trimmedNoteName);

  if (!match) {
    throw new RangeError(`Invalid note name: ${noteName}`);
  }

  const [, letter, accidental] = match;

  return `${letter.toUpperCase()}${accidental}`;
}

function getNoteIndex(noteName: NoteName): number {
  return chromaticNotes.indexOf(noteName);
}

export function normalizeNoteName(noteName: string): NoteName {
  const formattedNoteName = formatNoteName(noteName);
  const normalizedNoteName = normalizedNoteNames[formattedNoteName];

  if (!normalizedNoteName) {
    throw new RangeError(`Unsupported note name: ${noteName}`);
  }

  return normalizedNoteName;
}

export function transposeNote(noteName: string, semitoneOffset: number): NoteName {
  if (!Number.isInteger(semitoneOffset)) {
    throw new RangeError(`Semitone offset must be an integer: ${semitoneOffset}`);
  }

  const normalizedNoteName = normalizeNoteName(noteName);
  const startIndex = getNoteIndex(normalizedNoteName);
  const nextIndex =
    (startIndex + semitoneOffset + chromaticNotes.length) % chromaticNotes.length;

  return chromaticNotes[nextIndex];
}
