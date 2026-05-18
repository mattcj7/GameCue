import { describe, expect, it } from "vitest";
import { generateProject } from "../../src/core/generation";
import type { CueSettings } from "../../src/core/model";
import type { PlaybackEngine } from "../../src/playback";

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

function createMockPlaybackEngine(): PlaybackEngine {
  return {
    async loadProject() {},
    async play() {},
    async stop() {},
    async pause() {},
    setLoop() {},
    setBpm() {},
    setTrackMuted() {},
    setTrackSolo() {},
    async dispose() {},
  };
}

describe("PlaybackEngine", () => {
  it("allows a mock implementation to load a generated project", async () => {
    const playbackEngine = createMockPlaybackEngine();
    const project = generateProject(createSettings({ type: "chase", mood: "urgent", bpm: 140 }));

    await expect(playbackEngine.loadProject(project)).resolves.toBeUndefined();
    await expect(playbackEngine.play()).resolves.toBeUndefined();
    await expect(playbackEngine.stop()).resolves.toBeUndefined();
    await expect(playbackEngine.pause()).resolves.toBeUndefined();
    await expect(playbackEngine.dispose()).resolves.toBeUndefined();
  });

  it("uses the existing TrackId type for track-specific controls", () => {
    const playbackEngine = createMockPlaybackEngine();
    const project = generateProject(createSettings());
    const trackId = project.tracks[0]?.id;

    expect(trackId).toBeDefined();

    if (trackId === undefined) {
      throw new Error("Expected generateProject to produce at least one track.");
    }

    expect(() => {
      playbackEngine.setLoop(true);
      playbackEngine.setBpm(project.cue.bpm);
      playbackEngine.setTrackMuted(trackId, true);
      playbackEngine.setTrackSolo(trackId, false);
    }).not.toThrow();
  });
});
