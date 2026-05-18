import { getTransport, start } from "tone";

import type { GameCueProject, TrackId } from "../../core/model";
import type { PlaybackEngine } from "../PlaybackEngine";
import { createToneInstrument, type ToneInstrumentHandle } from "./toneInstruments";
import { getLoopEndTime, resolveToneInstrumentId, scheduleTrackEvents } from "./toneScheduler";

interface LoadedToneTrack {
  instrument: ToneInstrumentHandle;
}

export class TonePlaybackEngine implements PlaybackEngine {
  private readonly transport = getTransport();
  private readonly loadedTracks: LoadedToneTrack[] = [];
  private readonly trackMuteState = new Map<TrackId, boolean>();
  private readonly trackSoloState = new Map<TrackId, boolean>();

  private scheduledEventIds: number[] = [];
  private project: GameCueProject | null = null;
  private loopEnabled = true;
  private disposed = false;

  async loadProject(project: GameCueProject): Promise<void> {
    this.ensureActive();
    this.resetLoadedProject();

    this.project = project;
    this.transport.bpm.value = project.cue.bpm;
    this.transport.loopStart = 0;
    this.transport.loopEnd = getLoopEndTime(project.cue.bars);
    this.transport.loop = this.loopEnabled;

    for (const track of project.tracks) {
      this.trackMuteState.set(track.id, track.muted);
      this.trackSoloState.set(track.id, track.solo);

      const instrument = createToneInstrument(resolveToneInstrumentId(track.instrument));
      this.loadedTracks.push({
        instrument,
      });

      this.scheduledEventIds.push(
        ...scheduleTrackEvents({
          track,
          instrument,
          transport: this.transport,
          isTrackAudible: (trackId) => this.isTrackAudible(trackId),
        }),
      );
    }
  }

  async play(): Promise<void> {
    this.ensureActive();

    if (this.project === null || this.transport.state === "started") {
      return;
    }

    await start();
    this.transport.start();
  }

  async stop(): Promise<void> {
    this.ensureActive();
    this.transport.stop();
    this.transport.position = 0;
    this.releaseLoadedInstruments();
  }

  async pause(): Promise<void> {
    this.ensureActive();
    this.transport.pause();
    this.releaseLoadedInstruments();
  }

  setLoop(enabled: boolean): void {
    this.ensureActive();
    this.loopEnabled = enabled;
    this.transport.loop = enabled;
  }

  setBpm(bpm: number): void {
    this.ensureActive();
    this.transport.bpm.value = bpm;
  }

  setTrackMuted(trackId: TrackId, muted: boolean): void {
    this.ensureActive();
    this.trackMuteState.set(trackId, muted);
  }

  setTrackSolo(trackId: TrackId, solo: boolean): void {
    this.ensureActive();
    this.trackSoloState.set(trackId, solo);
  }

  async dispose(): Promise<void> {
    if (this.disposed) {
      return;
    }

    this.resetLoadedProject();
    this.disposed = true;
  }

  private isTrackAudible(trackId: TrackId): boolean {
    const soloedTrackIds = [...this.trackSoloState.entries()]
      .filter(([, solo]) => solo)
      .map(([id]) => id);

    if (soloedTrackIds.length > 0) {
      return soloedTrackIds.includes(trackId);
    }

    return this.trackMuteState.get(trackId) !== true;
  }

  private resetLoadedProject(): void {
    this.transport.stop();
    this.transport.position = 0;
    this.releaseLoadedInstruments();
    this.clearScheduledEvents();
    this.disposeLoadedInstruments();
    this.trackMuteState.clear();
    this.trackSoloState.clear();
    this.project = null;
  }

  private clearScheduledEvents(): void {
    for (const scheduledEventId of this.scheduledEventIds) {
      this.transport.clear(scheduledEventId);
    }

    this.scheduledEventIds = [];
  }

  private releaseLoadedInstruments(): void {
    for (const { instrument } of this.loadedTracks) {
      if (instrument.kind === "melodic") {
        instrument.releaseAll();
      }
    }
  }

  private disposeLoadedInstruments(): void {
    while (this.loadedTracks.length > 0) {
      const loadedTrack = this.loadedTracks.pop();

      if (loadedTrack !== undefined) {
        loadedTrack.instrument.dispose();
      }
    }
  }

  private ensureActive(): void {
    if (this.disposed) {
      throw new Error("TonePlaybackEngine has been disposed.");
    }
  }
}
