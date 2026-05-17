import { describe, expect, it } from "vitest";
import type { CueSettings, NoteEvent } from "../../src/core/model";
import { generateDrumPattern } from "../../src/core/generation";

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

describe("generateDrumPattern", () => {
  it("generates drum events for an Investigation cue", () => {
    const pattern = generateDrumPattern({
      settings: createSettings({ type: "investigation", intensity: 1 }),
    });

    expect(pattern.events.length).toBeGreaterThan(0);
    expect(pattern.cueType).toBe("investigation");
  });

  it("makes Chase intensity 5 more active than Investigation intensity 1", () => {
    const investigation = generateDrumPattern({
      settings: createSettings({ type: "investigation", intensity: 1 }),
    });
    const chase = generateDrumPattern({
      settings: createSettings({ type: "chase", mood: "urgent", intensity: 5, bpm: 140 }),
    });

    expect(chase.events.length).toBeGreaterThan(investigation.events.length);
  });

  it("increases event density with higher intensity for the same cue type", () => {
    const lowIntensity = generateDrumPattern({
      settings: createSettings({ type: "investigation", intensity: 1 }),
    });
    const highIntensity = generateDrumPattern({
      settings: createSettings({ type: "investigation", intensity: 5 }),
    });

    expect(highIntensity.events.length).toBeGreaterThan(lowIntensity.events.length);
  });

  it('marks every generated event as type "drum"', () => {
    const pattern = generateDrumPattern({
      settings: createSettings({ type: "suspense", mood: "creepy", intensity: 4, bpm: 98 }),
    });

    expect(pattern.events.every((event) => event.type === "drum")).toBe(true);
  });

  it("keeps every generated event within valid timing bounds", () => {
    const pattern = generateDrumPattern({
      settings: createSettings({ type: "chase", mood: "urgent", intensity: 5, bpm: 144 }),
    });

    for (const event of pattern.events) {
      expect(event.startBeat).toBeGreaterThanOrEqual(0);
      expect(event.durationBeats).toBeGreaterThan(0);
      expect(event.startBeat + event.durationBeats).toBeLessThanOrEqual(pattern.totalBeats);
    }
  });

  it("returns events sorted deterministically by beat and lane", () => {
    const settings = createSettings({ type: "chase", mood: "urgent", intensity: 4, bpm: 132 });
    const firstPattern = generateDrumPattern({ settings });
    const secondPattern = generateDrumPattern({ settings });

    expect(secondPattern.events).toEqual(firstPattern.events);
    expect(firstPattern.events).toEqual(getSortedEvents(firstPattern.events));
  });

  it("keeps Dark Ambient sparse compared to Chase", () => {
    const darkAmbient = generateDrumPattern({
      settings: createSettings({ type: "dark_ambient", mood: "creepy", intensity: 5, bpm: 60 }),
    });
    const chase = generateDrumPattern({
      settings: createSettings({ type: "chase", mood: "urgent", intensity: 5, bpm: 140 }),
    });

    expect(darkAmbient.events.length).toBeLessThan(chase.events.length);
  });
});

function getSortedEvents(events: readonly NoteEvent[]): NoteEvent[] {
  const laneOrder = new Map<string, number>([
    ["kick", 0],
    ["snare", 1],
    ["hat", 2],
    ["low_hit", 3],
    ["perc_hit", 4],
  ]);

  return [...events].sort((left, right) => {
    if (left.startBeat !== right.startBeat) {
      return left.startBeat - right.startBeat;
    }

    return (laneOrder.get(left.pitch) ?? 0) - (laneOrder.get(right.pitch) ?? 0);
  });
}
