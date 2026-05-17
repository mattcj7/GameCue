import { describe, expect, it } from "vitest";
import { getMajorScale, getNaturalMinorScale, getTriadNotes, transposeNote } from "../../src/core/theory";

describe("core theory helpers", () => {
  it('returns the C major scale for getMajorScale("C")', () => {
    expect(getMajorScale("C")).toEqual(["C", "D", "E", "F", "G", "A", "B"]);
  });

  it('returns the D natural minor scale for getNaturalMinorScale("D")', () => {
    expect(getNaturalMinorScale("D")).toEqual(["D", "E", "F", "G", "A", "A#", "C"]);
  });

  it('returns D for transposeNote("C", 2)', () => {
    expect(transposeNote("C", 2)).toBe("D");
  });

  it('returns C E G for getTriadNotes("C", "major")', () => {
    expect(getTriadNotes("C", "major")).toEqual(["C", "E", "G"]);
  });

  it('returns D F A for getTriadNotes("D", "minor")', () => {
    expect(getTriadNotes("D", "minor")).toEqual(["D", "F", "A"]);
  });
});
