import type { TrackId } from "./projectTypes";

export interface TrackMixSettings {
  trackId: TrackId;
  volume: number;
  pan: number;
}

export interface MixSettings {
  masterVolume: number;
  tracks: TrackMixSettings[];
}
