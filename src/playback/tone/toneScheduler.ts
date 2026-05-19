import type { InstrumentId, NoteEvent, Track, TrackId } from "../../core/model";
import type {
  ToneDrumKitHandle,
  ToneInstrumentHandle,
  ToneMelodicInstrumentHandle,
  ToneTriggerDuration,
  ToneTriggerTime,
} from "./toneInstruments";
import { isSupportedToneInstrumentId, type SupportedToneInstrumentId, type ToneDrumLane } from "./toneInstrumentTypes";

const beatsPerBar = 4;

export interface ToneTransportScheduler {
  schedule(callback: (time: number | string) => void, time: number | string): number;
}

export interface ScheduleTrackEventsOptions {
  track: Track;
  instrument: ToneInstrumentHandle;
  transport: ToneTransportScheduler;
  isPlaybackActive: () => boolean;
  isCurrentLoadActive: () => boolean;
  isTrackAudible: (trackId: TrackId) => boolean;
}

export function resolveToneInstrumentId(instrumentId: InstrumentId): SupportedToneInstrumentId {
  if (isSupportedToneInstrumentId(instrumentId)) {
    return instrumentId;
  }

  switch (instrumentId) {
    case "soft_pluck":
      return "simple_lead";
    case "ambient_texture":
      return "dark_pad";
  }
}

export function mapGeneratedDrumLane(lane: string): ToneDrumLane {
  switch (lane) {
    case "kick":
      return "kick";
    case "snare":
      return "snare";
    case "hat":
    case "closed_hat":
      return "hat";
    case "open_hat":
      return "open_hat";
    case "low_hit":
      return "kick";
    case "perc_hit":
      return "snare";
    default:
      return "hat";
  }
}

export function beatsToToneTime(beats: number): ToneTriggerTime {
  return `${beats}*4n`;
}

export function beatsToToneDuration(beats: number): ToneTriggerDuration {
  return `${beats}*4n`;
}

export function getLoopEndTime(bars: number): ToneTriggerTime {
  return beatsToToneTime(bars * beatsPerBar);
}

export function scheduleTrackEvents({
  track,
  instrument,
  transport,
  isPlaybackActive,
  isCurrentLoadActive,
  isTrackAudible,
}: ScheduleTrackEventsOptions): number[] {
  return track.events.map((event) =>
    transport.schedule((time) => {
      if (!isPlaybackActive()) {
        return;
      }

      if (!isCurrentLoadActive()) {
        return;
      }

      if (!isTrackAudible(track.id)) {
        return;
      }

      triggerTrackEvent(instrument, event, time);
    }, beatsToToneTime(event.startBeat)),
  );
}

function triggerTrackEvent(
  instrument: ToneInstrumentHandle,
  event: NoteEvent,
  time: ToneTriggerTime,
): void {
  if (event.type === "drum" && instrument.kind === "drum-kit") {
    triggerDrumEvent(instrument, event, time);
    return;
  }

  if (event.type === "note" && instrument.kind === "melodic") {
    triggerMelodicEvent(instrument, event, time);
  }
}

function triggerDrumEvent(
  instrument: ToneDrumKitHandle,
  event: NoteEvent,
  time: ToneTriggerTime,
): void {
  instrument.triggerDrum(mapGeneratedDrumLane(event.pitch), time, event.velocity);
}

function triggerMelodicEvent(
  instrument: ToneMelodicInstrumentHandle,
  event: NoteEvent,
  time: ToneTriggerTime,
): void {
  instrument.triggerAttackRelease(
    event.pitch,
    beatsToToneDuration(event.durationBeats),
    time,
    event.velocity,
  );
}
