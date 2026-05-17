import { describe, expect, it } from "vitest";
import type { CueSettings } from "../../src/core/model";
import { generateChordProgression } from "../../src/core/generation";

const investigationSettings: CueSettings = {
  type: "investigation",
  mood: "dark",
  intensity: 3,
  bpm: 86,
  key: "D",
  mode: "minor",
  bars: 16,
  timeSignature: "4/4",
};

const menuThemeSettings: CueSettings = {
  type: "menu_theme",
  mood: "hopeful",
  intensity: 3,
  bpm: 96,
  key: "C",
  mode: "major",
  bars: 16,
  timeSignature: "4/4",
};

describe("generateChordProgression", () => {
  it("returns a non-empty progression for D minor Investigation", () => {
    const progression = generateChordProgression({ settings: investigationSettings });

    expect(progression.chords.length).toBeGreaterThan(0);
    expect(progression.mode).toBe("minor");
  });

  it("returns a non-empty progression for C major Menu Theme", () => {
    const progression = generateChordProgression({ settings: menuThemeSettings });

    expect(progression.chords.length).toBeGreaterThan(0);
    expect(progression.mode).toBe("major");
  });

  it("sets totalBeats to bars multiplied by beatsPerBar", () => {
    const progression = generateChordProgression({ settings: investigationSettings });

    expect(progression.totalBeats).toBe(progression.bars * progression.beatsPerBar);
  });

  it("generates chords with valid bounded timing", () => {
    const progression = generateChordProgression({ settings: investigationSettings });

    for (const chord of progression.chords) {
      expect(chord.startBeat).toBeGreaterThanOrEqual(0);
      expect(chord.durationBeats).toBeGreaterThan(0);
      expect(chord.startBeat + chord.durationBeats).toBeLessThanOrEqual(progression.totalBeats);
    }
  });

  it("generates one chord per requested bar for the current MVP behavior", () => {
    const progression = generateChordProgression({ settings: investigationSettings });

    expect(progression.chords).toHaveLength(investigationSettings.bars);
  });
});
