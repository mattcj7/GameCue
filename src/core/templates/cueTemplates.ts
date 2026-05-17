import { cueTypes } from "../model";
import type { CueType } from "../model";
import type { CueTemplate, TemplateId } from "./CueTemplate";

export const cueTemplates = [
  {
    id: "investigation_template",
    cueType: "investigation",
    displayName: "Investigation",
    description: "Quiet tension and subtle movement for detective or exploration scenes.",
    bpmRange: [70, 95],
    defaultMode: "minor",
    recommendedBars: [16],
    allowedMoods: ["dark", "mysterious"],
    generationProfile: {
      density: "sparse",
      percussionStyle: "minimal_pulse",
      bassStyle: "sparse_pulse",
      harmonyStyle: "long_pads",
      melodyStyle: "sparse_motif",
      fxStyle: "soft_hits",
      loopIntent: "ambient_bed",
    },
    trackPresets: [
      {
        trackType: "drums",
        name: "Low Percussion",
        instrumentId: "minimal_electronic_kit",
        enabledByDefault: true,
        density: "sparse",
      },
      {
        trackType: "bass",
        name: "Pulse Bass",
        instrumentId: "sub_pulse",
        enabledByDefault: true,
        density: "sparse",
      },
      {
        trackType: "pad",
        name: "Dark Pad",
        instrumentId: "dark_pad",
        enabledByDefault: true,
        density: "sparse",
      },
      {
        trackType: "melody",
        name: "Sparse Motif",
        instrumentId: "soft_pluck",
        enabledByDefault: true,
        density: "sparse",
      },
      {
        trackType: "fx",
        name: "Soft Atmosphere",
        instrumentId: "ambient_texture",
        enabledByDefault: false,
        density: "very_sparse",
      },
    ],
  },
  {
    id: "suspense_template",
    cueType: "suspense",
    displayName: "Suspense",
    description: "Rising tension, unease, and repeated low-end pressure.",
    bpmRange: [80, 110],
    defaultMode: "minor",
    recommendedBars: [8, 16],
    allowedMoods: ["dark", "creepy", "urgent"],
    generationProfile: {
      density: "sparse",
      percussionStyle: "ticking",
      bassStyle: "ostinato",
      harmonyStyle: "dissonant_pad",
      melodyStyle: "fragmented",
      fxStyle: "riser_fx",
      loopIntent: "looping",
    },
    trackPresets: [
      {
        trackType: "drums",
        name: "Ticking Pulse",
        instrumentId: "minimal_electronic_kit",
        enabledByDefault: true,
        density: "sparse",
      },
      {
        trackType: "bass",
        name: "Low Ostinato",
        instrumentId: "sub_pulse",
        enabledByDefault: true,
        density: "moderate",
      },
      {
        trackType: "pad",
        name: "Dissonant Pad",
        instrumentId: "dark_pad",
        enabledByDefault: true,
        density: "sparse",
      },
      {
        trackType: "fx",
        name: "Suspense Texture",
        instrumentId: "ambient_texture",
        enabledByDefault: true,
        density: "sparse",
      },
      {
        trackType: "melody",
        name: "Fragmented Motif",
        instrumentId: "soft_pluck",
        enabledByDefault: false,
        density: "very_sparse",
      },
    ],
  },
  {
    id: "chase_template",
    cueType: "chase",
    displayName: "Chase",
    description: "Fast action and pursuit with driving rhythm and a strong loop boundary.",
    bpmRange: [120, 160],
    defaultMode: "minor",
    recommendedBars: [8, 16],
    allowedMoods: ["urgent", "heroic", "dark"],
    generationProfile: {
      density: "dense",
      percussionStyle: "driving",
      bassStyle: "driving",
      harmonyStyle: "rhythmic_stabs",
      melodyStyle: "action_motif",
      fxStyle: "impact_hits",
      loopIntent: "looping",
    },
    trackPresets: [
      {
        trackType: "drums",
        name: "Driving Drums",
        instrumentId: "minimal_electronic_kit",
        enabledByDefault: true,
        density: "dense",
      },
      {
        trackType: "bass",
        name: "Action Bass",
        instrumentId: "sub_pulse",
        enabledByDefault: true,
        density: "dense",
      },
      {
        trackType: "chords",
        name: "Rhythmic Chords",
        instrumentId: "dark_pad",
        enabledByDefault: true,
        density: "moderate",
      },
      {
        trackType: "melody",
        name: "Action Motif",
        instrumentId: "simple_lead",
        enabledByDefault: true,
        density: "moderate",
      },
      {
        trackType: "fx",
        name: "Impact Layer",
        instrumentId: "ambient_texture",
        enabledByDefault: false,
        density: "sparse",
      },
    ],
  },
  {
    id: "menu_theme_template",
    cueType: "menu_theme",
    displayName: "Menu Theme",
    description: "A recognizable but loopable theme that sets the tone without becoming busy.",
    bpmRange: [70, 110],
    defaultMode: "major",
    recommendedBars: [16, 32],
    allowedMoods: ["hopeful", "heroic", "mysterious"],
    generationProfile: {
      density: "moderate",
      percussionStyle: "minimal_pulse",
      bassStyle: "supportive",
      harmonyStyle: "clear_progression",
      melodyStyle: "strong_theme",
      fxStyle: "shimmer",
      loopIntent: "looping",
    },
    trackPresets: [
      {
        trackType: "chords",
        name: "Theme Chords",
        instrumentId: "dark_pad",
        enabledByDefault: true,
        density: "moderate",
      },
      {
        trackType: "pad",
        name: "Support Pad",
        instrumentId: "ambient_texture",
        enabledByDefault: true,
        density: "sparse",
      },
      {
        trackType: "bass",
        name: "Support Bass",
        instrumentId: "sub_pulse",
        enabledByDefault: true,
        density: "sparse",
      },
      {
        trackType: "melody",
        name: "Theme Lead",
        instrumentId: "simple_lead",
        enabledByDefault: true,
        density: "moderate",
      },
      {
        trackType: "drums",
        name: "Light Percussion",
        instrumentId: "minimal_electronic_kit",
        enabledByDefault: false,
        density: "sparse",
      },
    ],
  },
  {
    id: "discovery_sting_template",
    cueType: "discovery_sting",
    displayName: "Discovery Sting",
    description: "A short reveal cue with a clear start, payoff, and fast resolution.",
    bpmRange: [84, 128],
    defaultMode: "major",
    recommendedBars: [4, 8],
    allowedMoods: ["hopeful", "heroic", "mysterious"],
    generationProfile: {
      density: "sparse",
      percussionStyle: "accent_hits",
      bassStyle: "single_accent",
      harmonyStyle: "impact_chord",
      melodyStyle: "resolving_phrase",
      fxStyle: "shimmer",
      loopIntent: "stinger",
    },
    trackPresets: [
      {
        trackType: "fx",
        name: "Reveal Shimmer",
        instrumentId: "ambient_texture",
        enabledByDefault: true,
        density: "sparse",
      },
      {
        trackType: "chords",
        name: "Impact Chord",
        instrumentId: "dark_pad",
        enabledByDefault: true,
        density: "sparse",
      },
      {
        trackType: "pad",
        name: "Glow Pad",
        instrumentId: "ambient_texture",
        enabledByDefault: true,
        density: "very_sparse",
      },
      {
        trackType: "melody",
        name: "Resolve Lead",
        instrumentId: "soft_pluck",
        enabledByDefault: true,
        density: "sparse",
      },
      {
        trackType: "bass",
        name: "Accent Bass",
        instrumentId: "sub_pulse",
        enabledByDefault: false,
        density: "very_sparse",
      },
    ],
  },
  {
    id: "emotional_scene_template",
    cueType: "emotional_scene",
    displayName: "Emotional Scene",
    description: "Slow reflective support for sad, intimate, or gently hopeful moments.",
    bpmRange: [55, 85],
    defaultMode: "minor",
    recommendedBars: [16],
    allowedMoods: ["sad", "hopeful"],
    generationProfile: {
      density: "sparse",
      percussionStyle: "none",
      bassStyle: "supportive",
      harmonyStyle: "soft_progression",
      melodyStyle: "lyrical",
      fxStyle: "none",
      loopIntent: "ambient_bed",
    },
    trackPresets: [
      {
        trackType: "pad",
        name: "Soft Pad",
        instrumentId: "dark_pad",
        enabledByDefault: true,
        density: "sparse",
      },
      {
        trackType: "chords",
        name: "Gentle Harmony",
        instrumentId: "soft_pluck",
        enabledByDefault: true,
        density: "sparse",
      },
      {
        trackType: "bass",
        name: "Support Bass",
        instrumentId: "sub_pulse",
        enabledByDefault: false,
        density: "very_sparse",
      },
      {
        trackType: "melody",
        name: "Lyrical Lead",
        instrumentId: "simple_lead",
        enabledByDefault: true,
        density: "sparse",
      },
      {
        trackType: "drums",
        name: "Soft Pulse",
        instrumentId: "minimal_electronic_kit",
        enabledByDefault: false,
        density: "very_sparse",
      },
    ],
  },
  {
    id: "dark_ambient_template",
    cueType: "dark_ambient",
    displayName: "Dark Ambient",
    description: "Minimal dread and atmosphere with slow movement and low melodic activity.",
    bpmRange: [50, 90],
    defaultMode: "minor",
    recommendedBars: [16, 32],
    allowedMoods: ["dark", "creepy", "mysterious"],
    generationProfile: {
      density: "very_sparse",
      percussionStyle: "none",
      bassStyle: "drone",
      harmonyStyle: "long_pads",
      melodyStyle: "none",
      fxStyle: "shimmer",
      loopIntent: "ambient_bed",
    },
    trackPresets: [
      {
        trackType: "pad",
        name: "Drone Pad",
        instrumentId: "dark_pad",
        enabledByDefault: true,
        density: "very_sparse",
      },
      {
        trackType: "fx",
        name: "Texture Bed",
        instrumentId: "ambient_texture",
        enabledByDefault: true,
        density: "very_sparse",
      },
      {
        trackType: "bass",
        name: "Low Drone",
        instrumentId: "sub_pulse",
        enabledByDefault: true,
        density: "very_sparse",
      },
      {
        trackType: "melody",
        name: "Ghost Motif",
        instrumentId: "soft_pluck",
        enabledByDefault: false,
        density: "very_sparse",
      },
      {
        trackType: "drums",
        name: "Sparse Hits",
        instrumentId: "minimal_electronic_kit",
        enabledByDefault: false,
        density: "very_sparse",
      },
    ],
  },
] as const satisfies readonly CueTemplate[];

assertTemplateCoverage(cueTemplates);

function assertTemplateCoverage(templates: readonly CueTemplate[]): void {
  const templateIds = new Set<TemplateId>();
  const templateCueTypes = new Set<CueType>();

  for (const template of templates) {
    if (templateIds.has(template.id)) {
      throw new Error(`Duplicate cue template id: ${template.id}`);
    }

    if (templateCueTypes.has(template.cueType)) {
      throw new Error(`Duplicate cue template cueType: ${template.cueType}`);
    }

    templateIds.add(template.id);
    templateCueTypes.add(template.cueType);
  }

  for (const cueType of cueTypes) {
    if (!templateCueTypes.has(cueType)) {
      throw new Error(`Missing cue template for cue type: ${cueType}`);
    }
  }
}
