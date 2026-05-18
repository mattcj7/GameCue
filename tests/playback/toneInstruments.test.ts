import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { beforeEach, describe, expect, it, vi } from "vitest";

type FakeToneInstance = {
  connect: (target: unknown) => FakeToneInstance;
  dispose: () => void;
  disposed: boolean;
  connectedTo: unknown[];
  triggerAttackReleaseCalls: unknown[][];
  triggerReleaseCalls: unknown[][];
  releaseAllCalls: unknown[][];
  frequency: { value: number };
};

const toneTestState = {
  instances: [] as FakeToneInstance[],
};

function createFakeToneInstance(): FakeToneInstance {
  return {
    connect(target) {
      this.connectedTo.push(target);
      return this;
    },
    dispose() {
      this.disposed = true;
    },
    disposed: false,
    connectedTo: [],
    triggerAttackReleaseCalls: [],
    triggerReleaseCalls: [],
    releaseAllCalls: [],
    frequency: { value: 0 },
  };
}

vi.mock("tone", () => {
  class FakeGain {
    disposed = false;
    connectedTo: unknown[] = [];

    constructor(readonly initialValue: number) {}

    toDestination() {
      return this;
    }

    connect(target: unknown) {
      this.connectedTo.push(target);
      return this;
    }

    dispose() {
      this.disposed = true;
    }
  }

  function makeInstrumentClass() {
    return class {
      disposed = false;
      connectedTo: unknown[] = [];
      triggerAttackReleaseCalls: unknown[][] = [];
      triggerReleaseCalls: unknown[][] = [];
      releaseAllCalls: unknown[][] = [];
      frequency = { value: 0 };

      constructor(readonly options?: unknown, readonly polyOptions?: unknown) {
        toneTestState.instances.push(this as unknown as FakeToneInstance);
      }

      connect(target: unknown) {
        this.connectedTo.push(target);
        return this;
      }

      triggerAttackRelease(...args: unknown[]) {
        this.triggerAttackReleaseCalls.push(args);
        return this;
      }

      triggerRelease(...args: unknown[]) {
        this.triggerReleaseCalls.push(args);
        return this;
      }

      releaseAll(...args: unknown[]) {
        this.releaseAllCalls.push(args);
        return this;
      }

      dispose() {
        this.disposed = true;
        return this;
      }
    };
  }

  const FakeMembraneSynth = makeInstrumentClass();
  const FakeMetalSynth = makeInstrumentClass();
  const FakeMonoSynth = makeInstrumentClass();
  const FakeNoiseSynth = makeInstrumentClass();
  const FakePolySynth = makeInstrumentClass();
  const FakeSynth = makeInstrumentClass();

  return {
    Gain: FakeGain,
    MembraneSynth: FakeMembraneSynth,
    MetalSynth: FakeMetalSynth,
    MonoSynth: FakeMonoSynth,
    NoiseSynth: FakeNoiseSynth,
    PolySynth: FakePolySynth,
    Synth: FakeSynth,
  };
});

import { createToneInstrument } from "../../src/playback/tone/toneInstruments";

describe("toneInstruments", () => {
  beforeEach(() => {
    toneTestState.instances = [];
  });

  it("creates supported instrument handles with scheduler-ready methods", () => {
    const drumKit = createToneInstrument("minimal_electronic_kit");
    const bass = createToneInstrument("sub_pulse");
    const pad = createToneInstrument("dark_pad");
    const lead = createToneInstrument("simple_lead");

    expect(drumKit.instrumentId).toBe("minimal_electronic_kit");
    expect(drumKit.kind).toBe("drum-kit");
    expect(typeof drumKit.triggerDrum).toBe("function");

    expect(bass.instrumentId).toBe("sub_pulse");
    expect(bass.kind).toBe("melodic");
    expect(typeof bass.triggerAttackRelease).toBe("function");
    expect(typeof bass.releaseAll).toBe("function");

    expect(pad.instrumentId).toBe("dark_pad");
    expect(pad.kind).toBe("melodic");

    expect(lead.instrumentId).toBe("simple_lead");
    expect(lead.kind).toBe("melodic");
  });

  it("throws a clear error for unsupported instrument ids", () => {
    expect(() => createToneInstrument("soft_pluck")).toThrowError(
      "Unsupported Tone instrument ID: soft_pluck",
    );
    expect(() => createToneInstrument("ambient_texture")).toThrowError(
      "Unsupported Tone instrument ID: ambient_texture",
    );
  });

  it("disposes the created Tone objects through the returned handle", () => {
    const drumKit = createToneInstrument("minimal_electronic_kit");
    const bass = createToneInstrument("sub_pulse");
    const pad = createToneInstrument("dark_pad");
    const lead = createToneInstrument("simple_lead");

    const createdInstances = [...toneTestState.instances];

    drumKit.dispose();
    bass.dispose();
    pad.dispose();
    lead.dispose();

    expect(createdInstances.length).toBe(6);
    expect(createdInstances.every((instance) => instance.disposed)).toBe(true);
    expect(drumKit.output.disposed).toBe(true);
    expect(bass.output.disposed).toBe(true);
    expect(pad.output.disposed).toBe(true);
    expect(lead.output.disposed).toBe(true);
  });

  it("keeps Tone imports isolated under src/playback/tone", () => {
    const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
    const srcRoot = join(repoRoot, "src");
    const files = collectSourceFiles(srcRoot);

    const toneImportFiles = files.filter((filePath) => {
      const source = readFileSync(filePath, "utf8");
      return source.includes('from "tone"') || source.includes("from 'tone'");
    });

    expect(toneImportFiles.map((filePath) => normalizeRepoPath(repoRoot, filePath))).toEqual([
      "src/playback/tone/toneInstruments.ts",
    ]);
  });
});

function collectSourceFiles(root: string): string[] {
  const entries = readdirSync(root);
  const collected: string[] = [];

  for (const entry of entries) {
    const fullPath = join(root, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      collected.push(...collectSourceFiles(fullPath));
      continue;
    }

    if (extname(fullPath) === ".ts" || extname(fullPath) === ".tsx") {
      collected.push(fullPath);
    }
  }

  return collected;
}

function normalizeRepoPath(repoRoot: string, fullPath: string): string {
  return relative(repoRoot, fullPath).replace(/\\/g, "/");
}
