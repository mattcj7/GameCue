import { transposeNote, type NoteName } from "./notes";

export const triadQualities = ["major", "minor"] as const;

export type TriadQuality = (typeof triadQualities)[number];

const triadIntervalsByQuality: Record<TriadQuality, readonly number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
};

export function getTriadNotes(rootNote: string, quality: TriadQuality): NoteName[] {
  const intervals = triadIntervalsByQuality[quality];

  return intervals.map((interval) => transposeNote(rootNote, interval));
}
