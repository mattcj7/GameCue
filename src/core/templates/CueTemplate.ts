import type {
  CueMode,
  CueType,
  InstrumentId,
  Mood,
  TrackType,
} from "../model";

export type TemplateId = `${CueType}_template`;

export type BpmRange = readonly [minBpm: number, maxBpm: number];

export type DensityLevel = "very_sparse" | "sparse" | "moderate" | "dense";

export interface GenerationProfile {
  density: DensityLevel;
  percussionStyle: "none" | "minimal_pulse" | "ticking" | "driving" | "accent_hits";
  bassStyle: "drone" | "sparse_pulse" | "ostinato" | "driving" | "supportive" | "single_accent";
  harmonyStyle:
    | "long_pads"
    | "dissonant_pad"
    | "rhythmic_stabs"
    | "clear_progression"
    | "impact_chord"
    | "soft_progression";
  melodyStyle:
    | "none"
    | "sparse_motif"
    | "fragmented"
    | "action_motif"
    | "strong_theme"
    | "resolving_phrase"
    | "lyrical";
  fxStyle: "none" | "soft_hits" | "riser_fx" | "impact_hits" | "shimmer";
  loopIntent: "looping" | "stinger" | "ambient_bed";
}

export interface TrackPreset {
  trackType: TrackType;
  name: string;
  instrumentId: InstrumentId;
  enabledByDefault: boolean;
  density: DensityLevel;
}

export interface CueTemplate {
  id: TemplateId;
  cueType: CueType;
  displayName: string;
  description: string;
  bpmRange: BpmRange;
  defaultMode: CueMode;
  recommendedBars: readonly number[];
  allowedMoods: readonly Mood[];
  generationProfile: GenerationProfile;
  trackPresets: readonly TrackPreset[];
}
