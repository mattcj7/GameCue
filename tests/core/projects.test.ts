import { describe, expect, it } from "vitest";
import type { CueSettings } from "../../src/core/model";
import { generateProject } from "../../src/core/generation";

function createSettings(overrides: Partial<CueSettings> = {}): CueSettings {
  return {
    type: "investigation",
    mood: "dark",
    intensity: 3,
    bpm: 86,
    key: "D",
    mode: "minor",
    bars: 16,
    timeSignature: "4/4",
    ...overrides,
  };
}

describe("generateProject", () => {
  it('returns schemaVersion "0.1" and preserves the supplied cue settings', () => {
    const settings = createSettings();
    const project = generateProject(settings);

    expect(project.schemaVersion).toBe("0.1");
    expect(project.cue).toEqual(settings);
  });

  it("creates exactly one full-length main section", () => {
    const settings = createSettings({ bars: 32, intensity: 4 });
    const project = generateProject(settings);

    expect(project.sections).toEqual([
      {
        id: "section_main",
        name: "Main",
        startBar: 0,
        bars: settings.bars,
        intensity: settings.intensity,
      },
    ]);
  });

  it("creates four generated tracks with the expected ids, types, and instruments", () => {
    const project = generateProject(createSettings());

    expect(project.tracks).toHaveLength(4);
    expect(project.tracks.map((track) => ({
      id: track.id,
      type: track.type,
      instrument: track.instrument,
    }))).toEqual([
      {
        id: "track_drums",
        type: "drums",
        instrument: "minimal_electronic_kit",
      },
      {
        id: "track_bass",
        type: "bass",
        instrument: "sub_pulse",
      },
      {
        id: "track_chords",
        type: "chords",
        instrument: "dark_pad",
      },
      {
        id: "track_melody",
        type: "melody",
        instrument: "soft_pluck",
      },
    ]);
  });

  it("ensures every generated track contains events and the mix covers each track", () => {
    const project = generateProject(createSettings());

    for (const track of project.tracks) {
      expect(track.events.length).toBeGreaterThan(0);
    }

    expect(project.mix.masterVolume).toBe(0.85);
    expect(project.mix.tracks).toHaveLength(project.tracks.length);
    expect(project.mix.tracks.map((trackMix) => trackMix.trackId)).toEqual(
      project.tracks.map((track) => track.id),
    );
  });

  it("keeps every generated event within the full project beat range", () => {
    const settings = createSettings({ type: "chase", mood: "urgent", intensity: 5, bpm: 140 });
    const project = generateProject(settings);
    const totalBeats = settings.bars * 4;

    for (const track of project.tracks) {
      for (const event of track.events) {
        expect(event.startBeat).toBeGreaterThanOrEqual(0);
        expect(event.durationBeats).toBeGreaterThan(0);
        expect(event.startBeat + event.durationBeats).toBeLessThanOrEqual(totalBeats);
      }
    }
  });

  it("produces different total event counts for Investigation and Chase cues", () => {
    const investigationProject = generateProject(
      createSettings({ type: "investigation", mood: "mysterious", intensity: 2, bpm: 82 }),
    );
    const chaseProject = generateProject(
      createSettings({ type: "chase", mood: "urgent", intensity: 5, bpm: 140 }),
    );

    const countEvents = (settingsProject: ReturnType<typeof generateProject>) =>
      settingsProject.tracks.reduce((eventCount, track) => eventCount + track.events.length, 0);

    expect(countEvents(chaseProject)).not.toBe(countEvents(investigationProject));
  });

  it("is deterministic for the same settings", () => {
    const settings = createSettings({ type: "suspense", mood: "creepy", intensity: 4, bpm: 98 });
    const firstProject = generateProject(settings);
    const secondProject = generateProject(settings);

    expect(secondProject).toEqual(firstProject);
  });

  it("rejects zero bars with a clear RangeError", () => {
    expect(() => generateProject(createSettings({ bars: 0 }))).toThrowError(
      new RangeError("Project generation requires bars to be a positive integer. Received: 0."),
    );
  });

  it("rejects negative bars with a clear RangeError", () => {
    expect(() => generateProject(createSettings({ bars: -4 }))).toThrowError(
      new RangeError("Project generation requires bars to be a positive integer. Received: -4."),
    );
  });

  it("returns plain JSON-serializable data", () => {
    const project = generateProject(
      createSettings({ type: "menu_theme", mood: "hopeful", key: "C", mode: "major" }),
    );

    expect(() => JSON.stringify(project)).not.toThrow();
    expect(JSON.parse(JSON.stringify(project))).toEqual(project);
  });
});
