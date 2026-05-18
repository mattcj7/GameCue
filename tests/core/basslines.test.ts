import { describe, expect, it } from "vitest";
import { cueTypes, type CueSettings, type NoteEvent } from "../../src/core/model";
import { generateBassline, generateChordProgression } from "../../src/core/generation";

function createSettings(
  overrides: Partial<CueSettings> = {},
): CueSettings {
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

function getExpectedBassPitch(root: string): string {
  return root === "A" || root === "A#" || root === "B" ? `${root}1` : `${root}2`;
}

describe("generateBassline", () => {
  it("generates bass events for an Investigation cue", () => {
    const bassline = generateBassline({
      settings: createSettings({ type: "investigation", intensity: 1 }),
    });

    expect(bassline.events.length).toBeGreaterThan(0);
    expect(bassline.cueType).toBe("investigation");
  });

  it("generates bass events for every cue type", () => {
    for (const cueType of cueTypes) {
      const bassline = generateBassline({ settings: createSettingsForCueType(cueType) });

      expect(bassline.events.length).toBeGreaterThan(0);
      expect(bassline.cueType).toBe(cueType);
    }
  });

  it('marks every generated event as type "note"', () => {
    const bassline = generateBassline({
      settings: createSettings({ type: "suspense", mood: "creepy", intensity: 4, bpm: 98 }),
    });

    expect(bassline.events.every((event) => event.type === "note")).toBe(true);
  });

  it("uses a low register for every generated bass pitch", () => {
    const bassline = generateBassline({
      settings: createSettings({ type: "menu_theme", mood: "heroic", key: "C", mode: "major" }),
    });

    expect(bassline.events.every((event) => /[12]$/.test(event.pitch))).toBe(true);
  });

  it("follows chord roots for generated bass events", () => {
    const settings = createSettings({ type: "chase", mood: "urgent", intensity: 5, bpm: 140 });
    const chordProgression = generateChordProgression({ settings });
    const bassline = generateBassline({ settings, chordProgression });

    for (const event of bassline.events) {
      const activeChord = chordProgression.chords.find(
        (chord) =>
          event.startBeat >= chord.startBeat &&
          event.startBeat < chord.startBeat + chord.durationBeats,
      );

      expect(activeChord).toBeDefined();
      expect(event.pitch).toBe(getExpectedBassPitch(activeChord!.root));
    }
  });

  it("keeps every generated event within valid timing bounds", () => {
    const bassline = generateBassline({
      settings: createSettings({ type: "chase", mood: "urgent", intensity: 5, bpm: 144 }),
    });

    for (const event of bassline.events) {
      expect(event.startBeat).toBeGreaterThanOrEqual(0);
      expect(event.durationBeats).toBeGreaterThan(0);
      expect(event.startBeat + event.durationBeats).toBeLessThanOrEqual(bassline.totalBeats);
    }
  });

  it("returns events sorted deterministically by beat and pitch", () => {
    const settings = createSettings({ type: "chase", mood: "urgent", intensity: 4, bpm: 132 });
    const firstBassline = generateBassline({ settings });
    const secondBassline = generateBassline({ settings });

    expect(secondBassline.events).toEqual(firstBassline.events);
    expect(firstBassline.events).toEqual(getSortedEvents(firstBassline.events));
  });

  it("makes Chase more active than Emotional Scene", () => {
    const chase = generateBassline({
      settings: createSettings({ type: "chase", mood: "urgent", intensity: 5, bpm: 140 }),
    });
    const emotional = generateBassline({
      settings: createSettings({ type: "emotional_scene", mood: "sad", intensity: 2, bpm: 68 }),
    });

    expect(chase.events.length).toBeGreaterThan(emotional.events.length);
  });

  it("keeps Dark Ambient to very few long events", () => {
    const settings = createSettings({
      type: "dark_ambient",
      mood: "creepy",
      intensity: 3,
      bpm: 58,
      bars: 8,
    });
    const bassline = generateBassline({ settings });

    expect(bassline.events.length).toBeLessThanOrEqual(settings.bars / 2);
    expect(bassline.events.every((event) => event.durationBeats >= 4)).toBe(true);
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
