import {
  Gain,
  MembraneSynth,
  MetalSynth,
  MonoSynth,
  NoiseSynth,
  PolySynth,
  Synth,
} from "tone";

import type { InstrumentId } from "../../core/model";
import {
  isSupportedToneInstrumentId,
  type SupportedToneInstrumentId,
  type ToneDrumLane,
} from "./toneInstrumentTypes";

export type ToneTriggerDuration = number | string;
export type ToneTriggerTime = number | string;

export interface ToneInstrumentHandleBase {
  instrumentId: SupportedToneInstrumentId;
  output: Gain;
  dispose(): void;
}

export interface ToneDrumKitHandle extends ToneInstrumentHandleBase {
  kind: "drum-kit";
  triggerDrum(lane: ToneDrumLane, time?: ToneTriggerTime, velocity?: number): void;
}

export interface ToneMelodicInstrumentHandle extends ToneInstrumentHandleBase {
  kind: "melodic";
  triggerAttackRelease(
    note: string,
    duration: ToneTriggerDuration,
    time?: ToneTriggerTime,
    velocity?: number,
  ): void;
  releaseAll(time?: ToneTriggerTime): void;
}

export type ToneInstrumentHandle = ToneDrumKitHandle | ToneMelodicInstrumentHandle;

export function createToneInstrument(instrumentId: InstrumentId): ToneInstrumentHandle {
  if (!isSupportedToneInstrumentId(instrumentId)) {
    throw new Error(`Unsupported Tone instrument ID: ${instrumentId}`);
  }

  switch (instrumentId) {
    case "minimal_electronic_kit":
      return createMinimalElectronicKit();
    case "sub_pulse":
      return createSubPulse();
    case "dark_pad":
      return createDarkPad();
    case "simple_lead":
      return createSimpleLead();
  }
}

function createMinimalElectronicKit(): ToneDrumKitHandle {
  const output = new Gain(0.9).toDestination();
  const kick = new MembraneSynth({
    envelope: {
      attack: 0.001,
      decay: 0.22,
      sustain: 0,
      release: 0.08,
    },
    octaves: 5,
    pitchDecay: 0.04,
    volume: -4,
  }).connect(output);
  const snare = new NoiseSynth({
    envelope: {
      attack: 0.001,
      decay: 0.18,
      sustain: 0,
      release: 0.05,
    },
    noise: {
      type: "white",
    },
    volume: -10,
  }).connect(output);
  const hat = new MetalSynth({
    envelope: {
      attack: 0.001,
      decay: 0.05,
      release: 0.02,
    },
    harmonicity: 4.1,
    modulationIndex: 18,
    octaves: 1.5,
    resonance: 1400,
    volume: -18,
  }).connect(output);
  hat.frequency.value = 260;

  return {
    instrumentId: "minimal_electronic_kit",
    kind: "drum-kit",
    output,
    triggerDrum(lane, time, velocity = 0.8) {
      switch (lane) {
        case "kick":
          kick.triggerAttackRelease("C1", "16n", time, velocity);
          return;
        case "snare":
          snare.triggerAttackRelease("16n", time, velocity);
          return;
        case "hat":
        case "closed_hat":
          hat.triggerAttackRelease(260, "32n", time, velocity * 0.85);
          return;
        case "open_hat":
          hat.triggerAttackRelease(220, "16n", time, velocity * 0.75);
          return;
      }
    },
    dispose: createDisposer(() => {
      kick.dispose();
      snare.dispose();
      hat.dispose();
      output.dispose();
    }),
  };
}

function createSubPulse(): ToneMelodicInstrumentHandle {
  const output = new Gain(0.9).toDestination();
  const synth = new MonoSynth({
    envelope: {
      attack: 0.01,
      decay: 0.18,
      sustain: 0.65,
      release: 0.2,
    },
    filter: {
      Q: 1,
      rolloff: -24,
      type: "lowpass",
      frequency: 220,
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.18,
      sustain: 0.3,
      release: 0.4,
      baseFrequency: 90,
      octaves: 2.6,
    },
    oscillator: {
      type: "square",
    },
    volume: -10,
  }).connect(output);

  return {
    instrumentId: "sub_pulse",
    kind: "melodic",
    output,
    triggerAttackRelease(note, duration, time, velocity = 0.85) {
      synth.triggerAttackRelease(note, duration, time, velocity);
    },
    releaseAll(time) {
      synth.triggerRelease(time);
    },
    dispose: createDisposer(() => {
      synth.dispose();
      output.dispose();
    }),
  };
}

function createDarkPad(): ToneMelodicInstrumentHandle {
  const output = new Gain(0.7).toDestination();
  const synth = new PolySynth(Synth, {
    envelope: {
      attack: 0.35,
      decay: 0.4,
      sustain: 0.75,
      release: 1.8,
    },
    oscillator: {
      type: "triangle",
    },
    volume: -18,
  }).connect(output);

  return {
    instrumentId: "dark_pad",
    kind: "melodic",
    output,
    triggerAttackRelease(note, duration, time, velocity = 0.55) {
      synth.triggerAttackRelease(note, duration, time, velocity);
    },
    releaseAll(time) {
      synth.releaseAll(time);
    },
    dispose: createDisposer(() => {
      synth.dispose();
      output.dispose();
    }),
  };
}

function createSimpleLead(): ToneMelodicInstrumentHandle {
  const output = new Gain(0.75).toDestination();
  const synth = new Synth({
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.2,
      release: 0.15,
    },
    oscillator: {
      type: "sawtooth",
    },
    volume: -12,
  }).connect(output);

  return {
    instrumentId: "simple_lead",
    kind: "melodic",
    output,
    triggerAttackRelease(note, duration, time, velocity = 0.8) {
      synth.triggerAttackRelease(note, duration, time, velocity);
    },
    releaseAll(time) {
      synth.triggerRelease(time);
    },
    dispose: createDisposer(() => {
      synth.dispose();
      output.dispose();
    }),
  };
}

function createDisposer(disposeResources: () => void): () => void {
  let disposed = false;

  return () => {
    if (disposed) {
      return;
    }

    disposed = true;
    disposeResources();
  };
}
