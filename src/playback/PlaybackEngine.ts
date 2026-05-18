import type { GameCueProject, TrackId } from "../core/model";

export interface PlaybackEngine {
  loadProject(project: GameCueProject): Promise<void>;
  play(): Promise<void>;
  stop(): Promise<void>;
  pause(): Promise<void>;
  setLoop(enabled: boolean): void;
  setBpm(bpm: number): void;
  setTrackMuted(trackId: TrackId, muted: boolean): void;
  setTrackSolo(trackId: TrackId, solo: boolean): void;
  dispose(): Promise<void>;
}
