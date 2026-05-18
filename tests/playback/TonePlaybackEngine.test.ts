import { describe, expect, it, vi, beforeEach } from "vitest";

import { generateProject } from "../../src/core/generation";
import type { CueSettings, GameCueProject, InstrumentId, NoteEvent, Track } from "../../src/core/model";
import type { PlaybackEngine } from "../../src/playback";

type CreatedHandle = {
  dispose: ReturnType<typeof vi.fn>;
  instrumentId: string;
  kind: "drum-kit" | "melodic";
  output: { disposed: boolean };
  releaseAll?: ReturnType<typeof vi.fn>;
  triggerAttackRelease?: ReturnType<typeof vi.fn>;
  triggerDrum?: ReturnType<typeof vi.fn>;
};

const mockedState = vi.hoisted(() => ({
  instrumentState: {
    createCalls: [] as InstrumentId[],
    handles: [] as CreatedHandle[],
  },
  toneStartMock: vi.fn(() => Promise.resolve()),
  transportState: {
    bpm: { value: 120 },
    clearCalls: [] as number[],
    loop: false,
    loopEnd: 0 as number | string,
    loopStart: 0 as number | string,
    pauseCalls: [] as unknown[][],
    position: "0:0:0" as number | string,
    scheduledEvents: [] as Array<{
      callback: (time: number | string) => void;
      id: number;
      time: number | string;
    }>,
    startCalls: [] as unknown[][],
    state: "stopped" as "started" | "stopped" | "paused",
    stopCalls: [] as unknown[][],
  },
}));

function resetTransportState(): void {
  mockedState.transportState.bpm.value = 120;
  mockedState.transportState.clearCalls = [];
  mockedState.transportState.loop = false;
  mockedState.transportState.loopEnd = 0;
  mockedState.transportState.loopStart = 0;
  mockedState.transportState.pauseCalls = [];
  mockedState.transportState.position = "0:0:0";
  mockedState.transportState.scheduledEvents = [];
  mockedState.transportState.startCalls = [];
  mockedState.transportState.state = "stopped";
  mockedState.transportState.stopCalls = [];
}

function resetInstrumentState(): void {
  mockedState.instrumentState.createCalls = [];
  mockedState.instrumentState.handles = [];
}

vi.mock("tone", () => {
  let nextEventId = 1;

  return {
    getTransport() {
      return {
        bpm: mockedState.transportState.bpm,
        clear(eventId: number) {
          mockedState.transportState.clearCalls.push(eventId);
          return this;
        },
        get loop() {
          return mockedState.transportState.loop;
        },
        set loop(value: boolean) {
          mockedState.transportState.loop = value;
        },
        get loopEnd() {
          return mockedState.transportState.loopEnd;
        },
        set loopEnd(value: number | string) {
          mockedState.transportState.loopEnd = value;
        },
        get loopStart() {
          return mockedState.transportState.loopStart;
        },
        set loopStart(value: number | string) {
          mockedState.transportState.loopStart = value;
        },
        pause(...args: unknown[]) {
          mockedState.transportState.pauseCalls.push(args);
          mockedState.transportState.state = "paused";
          return this;
        },
        get position() {
          return mockedState.transportState.position;
        },
        set position(value: number | string) {
          mockedState.transportState.position = value;
        },
        schedule(callback: (time: number | string) => void, time: number | string) {
          const id = nextEventId++;
          mockedState.transportState.scheduledEvents.push({ callback, id, time });
          return id;
        },
        start(...args: unknown[]) {
          mockedState.transportState.startCalls.push(args);
          mockedState.transportState.state = "started";
          return this;
        },
        get state() {
          return mockedState.transportState.state;
        },
        stop(...args: unknown[]) {
          mockedState.transportState.stopCalls.push(args);
          mockedState.transportState.state = "stopped";
          return this;
        },
      };
    },
    start: mockedState.toneStartMock,
  };
});

vi.mock("../../src/playback/tone/toneInstruments", () => {
  return {
    createToneInstrument(instrumentId: InstrumentId) {
      mockedState.instrumentState.createCalls.push(instrumentId);

      if (instrumentId === "minimal_electronic_kit") {
        const handle: CreatedHandle = {
          dispose: vi.fn(),
          instrumentId,
          kind: "drum-kit",
          output: { disposed: false },
          triggerDrum: vi.fn(),
        };
        mockedState.instrumentState.handles.push(handle);
        return handle;
      }

      const handle: CreatedHandle = {
        dispose: vi.fn(),
        instrumentId,
        kind: "melodic",
        output: { disposed: false },
        releaseAll: vi.fn(),
        triggerAttackRelease: vi.fn(),
      };
      mockedState.instrumentState.handles.push(handle);
      return handle;
    },
  };
});

import { TonePlaybackEngine } from "../../src/playback/tone/TonePlaybackEngine";

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

function createTrack(overrides: Partial<Track> & Pick<Track, "id" | "name" | "type" | "instrument">): Track {
  return {
    events: [],
    locked: false,
    muted: false,
    solo: false,
    ...overrides,
  };
}

function createNoteEvent(overrides: Partial<NoteEvent> & Pick<NoteEvent, "id" | "type" | "pitch">): NoteEvent {
  return {
    durationBeats: 1,
    startBeat: 0,
    velocity: 0.8,
    ...overrides,
  };
}

function createProject(overrides: Partial<GameCueProject> = {}): GameCueProject {
  return {
    schemaVersion: "0.1",
    projectId: "project_test",
    title: "Test Project",
    createdAt: "2026-05-18T00:00:00.000Z",
    updatedAt: "2026-05-18T00:00:00.000Z",
    cue: createSettings({ bars: 8, bpm: 96 }),
    sections: [
      {
        id: "section_main",
        name: "Main",
        startBar: 0,
        bars: 8,
        intensity: 3,
      },
    ],
    tracks: [],
    mix: {
      masterVolume: 0.85,
      tracks: [],
    },
    ...overrides,
  };
}

describe("TonePlaybackEngine", () => {
  beforeEach(() => {
    resetTransportState();
    resetInstrumentState();
    mockedState.toneStartMock.mockClear();
  });

  it("satisfies the PlaybackEngine contract and loads generated project output", async () => {
    const engine: PlaybackEngine = new TonePlaybackEngine();
    const project = generateProject(createSettings());

    await expect(engine.loadProject(project)).resolves.toBeUndefined();

    expect(mockedState.instrumentState.createCalls).toEqual([
      "minimal_electronic_kit",
      "sub_pulse",
      "dark_pad",
      "simple_lead",
    ]);
    expect(mockedState.transportState.bpm.value).toBe(project.cue.bpm);
    expect(mockedState.transportState.loopStart).toBe(0);
    expect(mockedState.transportState.loopEnd).toBe("64*4n");
    expect(mockedState.transportState.scheduledEvents.length).toBeGreaterThan(0);
  });

  it("schedules project events and applies local instrument and drum-lane fallbacks", async () => {
    const engine = new TonePlaybackEngine();
    const project = createProject({
      cue: createSettings({ bars: 4, bpm: 110 }),
      tracks: [
        createTrack({
          id: "track_drums",
          name: "Drums",
          type: "drums",
          instrument: "minimal_electronic_kit",
          events: [
            createNoteEvent({ id: "event_kick", type: "drum", pitch: "low_hit", startBeat: 0 }),
            createNoteEvent({ id: "event_hat", type: "drum", pitch: "perc_hit", startBeat: 1 }),
          ],
        }),
        createTrack({
          id: "track_pad",
          name: "Pad",
          type: "pad",
          instrument: "ambient_texture",
          events: [
            createNoteEvent({
              id: "event_note",
              type: "note",
              pitch: "C4",
              startBeat: 2,
              durationBeats: 2,
              velocity: 0.65,
            }),
          ],
        }),
      ],
    });

    await engine.loadProject(project);

    expect(mockedState.instrumentState.createCalls).toEqual(["minimal_electronic_kit", "dark_pad"]);
    expect(mockedState.transportState.scheduledEvents.map((event) => event.time)).toEqual([
      "0*4n",
      "1*4n",
      "2*4n",
    ]);

    for (const scheduledEvent of mockedState.transportState.scheduledEvents) {
      scheduledEvent.callback("scheduled-time");
    }

    const drumHandle = mockedState.instrumentState.handles[0];
    const padHandle = mockedState.instrumentState.handles[1];

    expect(drumHandle?.triggerDrum?.mock.calls).toEqual([
      ["kick", "scheduled-time", 0.8],
      ["snare", "scheduled-time", 0.8],
    ]);
    expect(padHandle?.triggerAttackRelease?.mock.calls).toEqual([
      ["C4", "2*4n", "scheduled-time", 0.65],
    ]);
  });

  it("cleans up prior scheduled events and instruments when reloading a project", async () => {
    const engine = new TonePlaybackEngine();
    const firstProject = createProject({
      tracks: [
        createTrack({
          id: "track_one",
          name: "Lead",
          type: "melody",
          instrument: "simple_lead",
          events: [createNoteEvent({ id: "event_one", type: "note", pitch: "A4" })],
        }),
      ],
    });
    const secondProject = createProject({
      projectId: "project_second",
      tracks: [
        createTrack({
          id: "track_two",
          name: "Bass",
          type: "bass",
          instrument: "sub_pulse",
          events: [createNoteEvent({ id: "event_two", type: "note", pitch: "D2", startBeat: 1 })],
        }),
      ],
    });

    await engine.loadProject(firstProject);

    const firstHandles = [...mockedState.instrumentState.handles];
    const firstScheduledIds = mockedState.transportState.scheduledEvents.map((event) => event.id);

    await engine.loadProject(secondProject);

    expect(mockedState.transportState.clearCalls).toEqual(firstScheduledIds);
    expect(firstHandles.every((handle) => handle.dispose.mock.calls.length === 1)).toBe(true);
    expect(firstHandles.every((handle) => handle.releaseAll?.mock.calls.length === 1)).toBe(true);
    expect(mockedState.transportState.stopCalls.length).toBeGreaterThanOrEqual(2);
  });

  it("routes play, pause, stop, and dispose through the mocked Tone transport", async () => {
    const engine = new TonePlaybackEngine();
    const project = createProject({
      tracks: [
        createTrack({
          id: "track_lead",
          name: "Lead",
          type: "melody",
          instrument: "simple_lead",
          events: [createNoteEvent({ id: "event_note", type: "note", pitch: "E4" })],
        }),
      ],
    });

    await engine.loadProject(project);
    await engine.play();
    await engine.pause();
    await engine.stop();
    await engine.dispose();

    expect(mockedState.toneStartMock).toHaveBeenCalledTimes(1);
    expect(mockedState.transportState.startCalls).toHaveLength(1);
    expect(mockedState.transportState.pauseCalls).toHaveLength(1);
    expect(mockedState.transportState.stopCalls.length).toBeGreaterThanOrEqual(2);
    expect(mockedState.transportState.position).toBe(0);
    expect(mockedState.instrumentState.handles[0]?.releaseAll?.mock.calls.length).toBeGreaterThanOrEqual(3);
    expect(mockedState.instrumentState.handles[0]?.dispose).toHaveBeenCalledTimes(1);
  });

  it("updates runtime BPM/loop settings and respects simple mute/solo state", async () => {
    const engine = new TonePlaybackEngine();
    const project = createProject({
      tracks: [
        createTrack({
          id: "track_a",
          name: "Lead A",
          type: "melody",
          instrument: "simple_lead",
          events: [createNoteEvent({ id: "event_a", type: "note", pitch: "C4" })],
        }),
        createTrack({
          id: "track_b",
          name: "Lead B",
          type: "melody",
          instrument: "soft_pluck",
          events: [createNoteEvent({ id: "event_b", type: "note", pitch: "E4", startBeat: 1 })],
        }),
      ],
    });

    await engine.loadProject(project);

    engine.setBpm(140);
    engine.setLoop(false);
    engine.setTrackMuted("track_a", true);
    mockedState.transportState.scheduledEvents[0]?.callback("time-one");
    engine.setTrackSolo("track_b", true);
    mockedState.transportState.scheduledEvents[1]?.callback("time-two");

    expect(mockedState.transportState.bpm.value).toBe(140);
    expect(mockedState.transportState.loop).toBe(false);
    expect(mockedState.instrumentState.handles[0]?.triggerAttackRelease?.mock.calls).toEqual([]);
    expect(mockedState.instrumentState.handles[1]?.triggerAttackRelease?.mock.calls).toEqual([
      ["E4", "1*4n", "time-two", 0.8],
    ]);
  });
});
