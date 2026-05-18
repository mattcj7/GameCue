import { describe, expect, it } from "vitest";
import { cueTypes, type CueSettings, type NoteEvent } from "../../src/core/model";
import { generateChordProgression, generateMelody } from "../../src/core/generation";
import { getScaleNotes } from "../../src/core/theory";

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
      });
    case "dark_ambient":
      return createSettings({
        type: "dark_ambient",
        mood: "creepy",
        intensity: 3,
        bpm: 58,
      });
  }
}

describe("generateMelody", () => {
  it("generates melody events for an Investigation cue", () => {
    const melody = generateMelody({
      settings: createSettings({ type: "investigation", mood: "mysterious", intensity: 2 }),
    });

    expect(melody.events.length).toBeGreaterThan(0);
    expect(melody.cueType).toBe("investigation");
  });

  it("generates melody output for every cue type", () => {
    for (const cueType of cueTypes) {
      const melody = generateMelody({ settings: createSettingsForCueType(cueType) });

      expect(melody.cueType).toBe(cueType);
      expect(melody.totalBeats).toBe(melody.bars * melody.beatsPerBar);
      expect(melody.events.length).toBeGreaterThan(0);
    }
  });

  it('marks every generated event as type "note"', () => {
    const melody = generateMelody({
      settings: createSettings({ type: "menu_theme", mood: "heroic", key: "C", mode: "major" }),
    });

    expect(melody.events.every((event) => event.type === "note")).toBe(true);
  });

  it("keeps every generated melody pitch inside the selected scale", () => {
    for (const cueType of cueTypes) {
      const settings = createSettingsForCueType(cueType);
      const melody = generateMelody({ settings });
      const scaleNotes = getScaleNotes(settings.key, settings.mode);

      for (const event of melody.events) {
        expect(scaleNotes).toContain(stripOctave(event.pitch));
      }
    }
  });

  it("uses active chord tones for strong-beat melody notes", () => {
    for (const cueType of cueTypes) {
      const settings = createSettingsForCueType(cueType);
      const chordProgression = generateChordProgression({ settings });
      const melody = generateMelody({ settings, chordProgression });
      const strongBeatEvents = melody.events.filter((event) => {
        const beatWithinBar = event.startBeat % chordProgression.beatsPerBar;

        return beatWithinBar === 0 || beatWithinBar === 2;
      });

      expect(strongBeatEvents.length).toBeGreaterThan(0);

      for (const event of strongBeatEvents) {
        const activeChord = chordProgression.chords.find(
          (chord) =>
            event.startBeat >= chord.startBeat &&
            event.startBeat < chord.startBeat + chord.durationBeats,
        );

        expect(activeChord).toBeDefined();
        expect(activeChord!.notes).toContain(stripOctave(event.pitch));
      }
    }
  });

  it("keeps every generated event within valid timing bounds", () => {
    const melody = generateMelody({
      settings: createSettings({ type: "chase", mood: "urgent", intensity: 5, bpm: 144 }),
    });

    for (const event of melody.events) {
      expect(event.startBeat).toBeGreaterThanOrEqual(0);
      expect(event.durationBeats).toBeGreaterThan(0);
      expect(event.startBeat + event.durationBeats).toBeLessThanOrEqual(melody.totalBeats);
    }
  });

  it("returns events sorted deterministically by beat, pitch, and duration", () => {
    const settings = createSettings({ type: "chase", mood: "urgent", intensity: 4, bpm: 132 });
    const firstMelody = generateMelody({ settings });
    const secondMelody = generateMelody({ settings });

    expect(secondMelody.events).toEqual(firstMelody.events);
    expect(firstMelody.events).toEqual(getSortedEvents(firstMelody.events));
  });

  it("keeps Investigation sparse", () => {
    const settings = createSettings({ type: "investigation", mood: "mysterious", intensity: 2, bars: 8 });
    const melody = generateMelody({ settings });

    expect(melody.events.length).toBeLessThanOrEqual(settings.bars);
  });

  it("makes Chase and Menu Theme more active than Investigation", () => {
    const sharedBars = 8;
    const investigation = generateMelody({
      settings: createSettings({
        type: "investigation",
        mood: "mysterious",
        intensity: 2,
        bars: sharedBars,
      }),
    });
    const chase = generateMelody({
      settings: createSettings({
        type: "chase",
        mood: "urgent",
        intensity: 5,
        bpm: 140,
        bars: sharedBars,
      }),
    });
    const menuTheme = generateMelody({
      settings: createSettings({
        type: "menu_theme",
        mood: "heroic",
        intensity: 3,
        bpm: 96,
        key: "C",
        mode: "major",
        bars: sharedBars,
      }),
    });

    expect(chase.events.length).toBeGreaterThan(investigation.events.length);
    expect(menuTheme.events.length).toBeGreaterThan(investigation.events.length);
  });

  it("keeps Dark Ambient to very few melody events", () => {
    const settings = createSettings({
      type: "dark_ambient",
      mood: "creepy",
      intensity: 3,
      bpm: 58,
      bars: 8,
    });
    const melody = generateMelody({ settings });

    expect(melody.events.length).toBeLessThanOrEqual(2);
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

function stripOctave(pitch: string): string {
  return pitch.replace(/\d+$/, "");
}
