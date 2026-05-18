import { describe, expect, it } from "vitest";
import { cueTypes, type CueSettings, type NoteEvent } from "../../src/core/model";
import type { GeneratedChordProgression } from "../../src/core/generation/chordProgressions";
import { generateChordPad, generateChordProgression } from "../../src/core/generation";

function createSettings(overrides: Partial<CueSettings> = {}): CueSettings {
  return {
    type: "investigation",
    mood: "dark",
    intensity: 3,
    bpm: 86,
    key: "D",
    mode: "minor",
    bars: 8,
    timeSignature: "4/4",
    ...overrides,
  };
}

function createSettingsForCueType(cueType: CueSettings["type"]): CueSettings {
  switch (cueType) {
    case "investigation":
      return createSettings({ type: "investigation", mood: "mysterious", intensity: 2, bpm: 82 });
    case "suspense":
      return createSettings({ type: "suspense", mood: "creepy", intensity: 4, bpm: 96 });
    case "chase":
      return createSettings({ type: "chase", mood: "urgent", intensity: 5, bpm: 140 });
    case "menu_theme":
      return createSettings({
        type: "menu_theme",
        mood: "heroic",
        intensity: 3,
        bpm: 98,
        key: "C",
        mode: "major",
        bars: 16,
      });
    case "discovery_sting":
      return createSettings({
        type: "discovery_sting",
        mood: "hopeful",
        intensity: 4,
        bpm: 110,
        key: "F",
        mode: "major",
        bars: 4,
      });
    case "emotional_scene":
      return createSettings({
        type: "emotional_scene",
        mood: "sad",
        intensity: 2,
        bpm: 68,
        bars: 8,
      });
    case "dark_ambient":
      return createSettings({
        type: "dark_ambient",
        mood: "creepy",
        intensity: 3,
        bpm: 58,
        bars: 8,
      });
  }
}

describe("generateChordPad", () => {
  it("generates chord/pad events for a Dark Ambient cue", () => {
    const chordPad = generateChordPad({
      settings: createSettings({ type: "dark_ambient", mood: "creepy", bpm: 58 }),
    });

    expect(chordPad.events.length).toBeGreaterThan(0);
    expect(chordPad.cueType).toBe("dark_ambient");
  });

  it("generates chord/pad events for every cue type", () => {
    for (const cueType of cueTypes) {
      const chordPad = generateChordPad({ settings: createSettingsForCueType(cueType) });

      expect(chordPad.events.length).toBeGreaterThan(0);
      expect(chordPad.cueType).toBe(cueType);
    }
  });

  it('marks every generated event as type "note"', () => {
    const chordPad = generateChordPad({
      settings: createSettings({ type: "suspense", mood: "creepy", intensity: 4, bpm: 98 }),
    });

    expect(chordPad.events.every((event) => event.type === "note")).toBe(true);
  });

  it("includes multiple notes per harmonic hit", () => {
    for (const cueType of cueTypes) {
      const chordPad = generateChordPad({ settings: createSettingsForCueType(cueType) });
      const simultaneousEventCounts = new Map<number, number>();

      for (const event of chordPad.events) {
        simultaneousEventCounts.set(
          event.startBeat,
          (simultaneousEventCounts.get(event.startBeat) ?? 0) + 1,
        );
      }

      expect(Math.max(...simultaneousEventCounts.values())).toBeGreaterThanOrEqual(3);
    }
  });

  it("keeps every generated event within valid timing bounds", () => {
    const chordPad = generateChordPad({
      settings: createSettings({ type: "chase", mood: "urgent", intensity: 5, bpm: 144 }),
    });

    for (const event of chordPad.events) {
      expect(event.startBeat).toBeGreaterThanOrEqual(0);
      expect(event.durationBeats).toBeGreaterThan(0);
      expect(event.startBeat + event.durationBeats).toBeLessThanOrEqual(chordPad.totalBeats);
    }
  });

  it("returns events sorted deterministically by beat, pitch, and duration", () => {
    const settings = createSettings({ type: "chase", mood: "urgent", intensity: 4, bpm: 132 });
    const firstChordPad = generateChordPad({ settings });
    const secondChordPad = generateChordPad({ settings });

    expect(secondChordPad.events).toEqual(firstChordPad.events);
    expect(firstChordPad.events).toEqual(getSortedEvents(firstChordPad.events));
  });

  it("uses long note durations for Dark Ambient and Emotional Scene", () => {
    const darkAmbient = generateChordPad({
      settings: createSettings({ type: "dark_ambient", mood: "creepy", intensity: 3, bpm: 58 }),
    });
    const emotional = generateChordPad({
      settings: createSettings({ type: "emotional_scene", mood: "sad", intensity: 2, bpm: 68 }),
    });

    expect(darkAmbient.events.every((event) => event.durationBeats >= 8)).toBe(true);
    expect(emotional.events.every((event) => event.durationBeats >= 4)).toBe(true);
  });

  it("makes Chase shorter and more rhythmic than Dark Ambient", () => {
    const chase = generateChordPad({
      settings: createSettings({ type: "chase", mood: "urgent", intensity: 5, bpm: 140 }),
    });
    const darkAmbient = generateChordPad({
      settings: createSettings({ type: "dark_ambient", mood: "creepy", intensity: 3, bpm: 58 }),
    });

    expect(getAverageDuration(chase.events)).toBeLessThan(getAverageDuration(darkAmbient.events));
    expect(chase.events.length).toBeGreaterThan(darkAmbient.events.length);
  });

  it("bases generated note pitches on the active progression chord notes", () => {
    const settings = createSettings({
      type: "menu_theme",
      mood: "heroic",
      key: "C",
      mode: "major",
    });
    const chordProgression = generateChordProgression({ settings });
    const chordPad = generateChordPad({ settings, chordProgression });

    for (const event of chordPad.events) {
      const activeChord = chordProgression.chords.find(
        (chord) =>
          event.startBeat >= chord.startBeat &&
          event.startBeat < chord.startBeat + chord.durationBeats,
      );

      expect(activeChord).toBeDefined();
      expect(activeChord!.notes).toContain(stripOctave(event.pitch));
    }
  });

  it("voices B major triad tones above the root when the chord wraps", () => {
    const settings = createSettings({ key: "B", mode: "major", bars: 1 });
    const chordPad = generateChordPad({
      settings,
      chordProgression: createChordProgressionStub(settings, ["B", "D#", "F#"]),
    });

    expect(getPitchesAtBeat(chordPad.events, 0)).toEqual(["B3", "D#4", "F#4"]);
  });

  it("voices A minor triad tones above the root when the chord wraps", () => {
    const settings = createSettings({ key: "A", mode: "minor", bars: 1 });
    const chordPad = generateChordPad({
      settings,
      chordProgression: createChordProgressionStub(settings, ["A", "C", "E"]),
    });

    expect(getPitchesAtBeat(chordPad.events, 0)).toEqual(["A3", "C4", "E4"]);
  });

  it("keeps non-wrapped C major triads in the base octave", () => {
    const settings = createSettings({ key: "C", mode: "major", bars: 1 });
    const chordPad = generateChordPad({
      settings,
      chordProgression: createChordProgressionStub(settings, ["C", "E", "G"]),
    });

    expect(getPitchesAtBeat(chordPad.events, 0)).toEqual(["C3", "E3", "G3"]);
  });

  it("adds the extra top voice one octave above the highest assigned tone", () => {
    const settings = createSettings({ type: "menu_theme", key: "A", mode: "minor", bars: 1 });
    const chordPad = generateChordPad({
      settings,
      chordProgression: createChordProgressionStub(settings, ["A", "C", "E"]),
    });

    expect(getPitchesAtBeat(chordPad.events, 0)).toEqual(["A3", "C4", "E4", "E5"]);
  });
});

function getSortedEvents(events: readonly NoteEvent[]): NoteEvent[] {
  return [...events].sort((left, right) => {
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
  });
}

function getAverageDuration(events: readonly NoteEvent[]): number {
  return events.reduce((sum, event) => sum + event.durationBeats, 0) / events.length;
}

function stripOctave(pitch: string): string {
  return pitch.replace(/\d+$/, "");
}

function getPitchesAtBeat(events: readonly NoteEvent[], startBeat: number): string[] {
  return events
    .filter((event) => event.startBeat === startBeat)
    .map((event) => event.pitch);
}

function createChordProgressionStub(
  settings: CueSettings,
  notes: readonly string[],
): GeneratedChordProgression {
  return {
    key: settings.key,
    mode: settings.mode,
    bars: settings.bars,
    beatsPerBar: 4,
    totalBeats: settings.bars * 4,
    style: settings.mode === "major" ? "major" : "minor",
    chords: [
      {
        chordId: "chord_0001",
        symbol: settings.mode === "major" ? "I" : "i",
        degree: 1,
        root: notes[0] as GeneratedChordProgression["chords"][number]["root"],
        quality: settings.mode === "major" ? "major" : "minor",
        notes: [...notes] as GeneratedChordProgression["chords"][number]["notes"],
        startBeat: 0,
        durationBeats: 4,
        barIndex: 0,
      },
    ],
  };
}
