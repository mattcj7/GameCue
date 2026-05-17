import { transposeNote, type NoteName } from "./notes";

export const scaleModes = ["major", "minor"] as const;

export type ScaleMode = (typeof scaleModes)[number];

const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11] as const;
const naturalMinorScaleIntervals = [0, 2, 3, 5, 7, 8, 10] as const;

function getScaleFromIntervals(
  rootNote: string,
  intervals: readonly number[],
): NoteName[] {
  return intervals.map((interval) => transposeNote(rootNote, interval));
}

export function getMajorScale(rootNote: string): NoteName[] {
  return getScaleFromIntervals(rootNote, majorScaleIntervals);
}

export function getNaturalMinorScale(rootNote: string): NoteName[] {
  return getScaleFromIntervals(rootNote, naturalMinorScaleIntervals);
}

export function getScaleNotes(rootNote: string, mode: ScaleMode): NoteName[] {
  if (mode === "major") {
    return getMajorScale(rootNote);
  }

  return getNaturalMinorScale(rootNote);
}

export function getScaleDegreeNote(
  rootNote: string,
  mode: ScaleMode,
  degree: number,
): NoteName {
  if (!Number.isInteger(degree) || degree < 1 || degree > 7) {
    throw new RangeError(`Scale degree must be an integer from 1 to 7: ${degree}`);
  }

  return getScaleNotes(rootNote, mode)[degree - 1];
}
