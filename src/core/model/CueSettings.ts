import type {
  CueIntensity,
  CueMode,
  CueType,
  Mood,
  TimeSignature,
} from "./projectTypes";

export interface CueSettings {
  type: CueType;
  mood: Mood;
  intensity: CueIntensity;
  bpm: number;
  key: string;
  mode: CueMode;
  bars: number;
  timeSignature: TimeSignature;
}
