import type { CueSettings, NoteEvent } from "../model";
import type { CueTemplate, GenerationProfile } from "../templates";
import { getCueTemplate } from "../templates";

const beatsPerBarForFourFour = 4;
const drumEventDurationBeats = 0.25;

export const drumLanes = [
  "kick",
  "snare",
  "hat",
  "low_hit",
  "perc_hit",
] as const;

export type DrumLane = (typeof drumLanes)[number];

export interface DrumPatternRequest {
  settings: CueSettings;
  template?: CueTemplate;
}

export interface GeneratedDrumPattern {
  cueType: CueSettings["type"];
  bars: CueSettings["bars"];
  beatsPerBar: number;
  totalBeats: number;
  events: NoteEvent[];
}

interface DrumEventDraft {
  pitch: DrumLane;
  startBeat: number;
  durationBeats: number;
  velocity: number;
}

const laneSortOrder = new Map<DrumLane, number>(
  drumLanes.map((lane, index) => [lane, index]),
);

export function generateDrumPattern(request: DrumPatternRequest): GeneratedDrumPattern {
  const { settings } = request;
  const template = resolveTemplate(settings, request.template);
  const beatsPerBar = getBeatsPerBar(settings);
  const totalBeats = settings.bars * beatsPerBar;
  const rawEvents: DrumEventDraft[] = [];

  for (let barIndex = 0; barIndex < settings.bars; barIndex += 1) {
    const barStartBeat = barIndex * beatsPerBar;
    const laneOffsets = getLaneOffsets(settings, template, barIndex);

    for (const lane of drumLanes) {
      for (const offset of laneOffsets[lane]) {
        const startBeat = barStartBeat + offset;

        if (startBeat < 0) {
          continue;
        }

        if (startBeat + drumEventDurationBeats > totalBeats) {
          continue;
        }

        rawEvents.push({
          pitch: lane,
          startBeat,
          durationBeats: drumEventDurationBeats,
          velocity: getLaneVelocity(lane, settings.intensity, template.generationProfile),
        });
      }
    }
  }

  const events = rawEvents
    .sort(compareDrumEvents)
    .map((event, index) => ({
      id: createDrumEventId(index),
      type: "drum" as const,
      pitch: event.pitch,
      startBeat: event.startBeat,
      durationBeats: event.durationBeats,
      velocity: event.velocity,
    }));

  return {
    cueType: settings.type,
    bars: settings.bars,
    beatsPerBar,
    totalBeats,
    events,
  };
}

function resolveTemplate(settings: CueSettings, template?: CueTemplate): CueTemplate {
  const resolvedTemplate = template ?? getCueTemplate(settings.type);

  if (resolvedTemplate.cueType !== settings.type) {
    throw new RangeError(
      `Template cue type ${resolvedTemplate.cueType} does not match settings type ${settings.type}.`,
    );
  }

  return resolvedTemplate;
}

function getBeatsPerBar(settings: CueSettings): number {
  if (settings.timeSignature !== "4/4") {
    throw new RangeError(
      `Unsupported time signature for drum pattern generation: ${settings.timeSignature}`,
    );
  }

  return beatsPerBarForFourFour;
}

function getLaneOffsets(
  settings: CueSettings,
  template: CueTemplate,
  barIndex: number,
): Record<DrumLane, readonly number[]> {
  const profile = template.generationProfile;

  switch (profile.percussionStyle) {
    case "none":
      return emptyLaneOffsets();
    case "minimal_pulse":
      return getMinimalPulseOffsets(settings.intensity, barIndex);
    case "ticking":
      return getTickingOffsets(settings.intensity, barIndex);
    case "driving":
      return getDrivingOffsets(settings.intensity, barIndex);
    case "accent_hits":
      return getAccentHitOffsets(settings.intensity, barIndex, settings.bars, profile.loopIntent);
  }
}

function emptyLaneOffsets(): Record<DrumLane, readonly number[]> {
  return {
    kick: [],
    snare: [],
    hat: [],
    low_hit: [],
    perc_hit: [],
  };
}

function getMinimalPulseOffsets(
  intensity: CueSettings["intensity"],
  barIndex: number,
): Record<DrumLane, readonly number[]> {
  return {
    kick: intensity >= 4 ? [0, 2] : [0],
    snare: intensity >= 5 ? [3] : [],
    hat: intensity >= 2 ? (barIndex % 2 === 0 ? [1.5, 3.5] : [3.5]) : [],
    low_hit: intensity >= 3 ? [2] : [],
    perc_hit: intensity >= 5 && barIndex % 2 === 1 ? [2.5] : [],
  };
}

function getTickingOffsets(
  intensity: CueSettings["intensity"],
  barIndex: number,
): Record<DrumLane, readonly number[]> {
  const hatOffsets =
    intensity >= 4
      ? [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
      : intensity >= 2
        ? [0, 1, 2, 3]
        : [0, 2];

  return {
    kick: intensity >= 3 ? [0, 2] : [0],
    snare: intensity >= 4 ? [3] : intensity >= 2 ? [2] : [],
    hat: hatOffsets,
    low_hit: intensity >= 5 && barIndex % 2 === 0 ? [3] : [],
    perc_hit: intensity >= 3 ? [1.5, 3.5] : intensity >= 2 ? [3.5] : [],
  };
}

function getDrivingOffsets(
  intensity: CueSettings["intensity"],
  barIndex: number,
): Record<DrumLane, readonly number[]> {
  const hatOffsets =
    intensity >= 5
      ? [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
      : intensity >= 3
        ? [0, 1, 2, 3]
        : [0, 2];

  const kickOffsets =
    intensity >= 5
      ? [0, 1, 2, 2.5, 3.5]
      : intensity >= 4
        ? [0, 1.5, 2, 3.5]
        : intensity >= 2
          ? [0, 2.5]
          : [0, 2];

  return {
    kick: kickOffsets,
    snare: [1, 3],
    hat: hatOffsets,
    low_hit: intensity >= 3 && barIndex % 2 === 0 ? [0] : [],
    perc_hit: intensity >= 4 ? [0.5, 1.5, 2.5, 3.5] : intensity >= 2 ? [3.5] : [],
  };
}

function getAccentHitOffsets(
  intensity: CueSettings["intensity"],
  barIndex: number,
  totalBars: number,
  loopIntent: GenerationProfile["loopIntent"],
): Record<DrumLane, readonly number[]> {
  const activeBars = loopIntent === "stinger" ? Math.min(totalBars, intensity >= 4 ? 2 : 1) : 1;

  if (barIndex >= activeBars) {
    return emptyLaneOffsets();
  }

  if (barIndex === 0) {
    return {
      kick: [0],
      snare: intensity >= 3 ? [1] : [],
      hat: intensity >= 4 ? [0.5, 1.5] : [],
      low_hit: [0],
      perc_hit: intensity >= 2 ? [2] : [],
    };
  }

  return {
    kick: intensity >= 5 ? [0] : [],
    snare: intensity >= 4 ? [1] : [],
    hat: [],
    low_hit: [],
    perc_hit: [0],
  };
}

function getLaneVelocity(
  lane: DrumLane,
  intensity: CueSettings["intensity"],
  profile: GenerationProfile,
): number {
  const laneBaseVelocity: Record<DrumLane, number> = {
    kick: 0.74,
    snare: 0.68,
    hat: 0.48,
    low_hit: 0.7,
    perc_hit: 0.56,
  };

  const styleAccent =
    profile.percussionStyle === "driving"
      ? 0.06
      : profile.percussionStyle === "accent_hits"
        ? 0.08
        : profile.percussionStyle === "minimal_pulse"
          ? -0.02
          : 0;

  const laneAccent =
    profile.percussionStyle === "accent_hits" && (lane === "low_hit" || lane === "perc_hit")
      ? 0.08
      : 0;

  return clampVelocity(laneBaseVelocity[lane] + (intensity - 1) * 0.05 + styleAccent + laneAccent);
}

function clampVelocity(value: number): number {
  return Math.min(1, Math.max(0, Number(value.toFixed(2))));
}

function compareDrumEvents(left: DrumEventDraft, right: DrumEventDraft): number {
  if (left.startBeat !== right.startBeat) {
    return left.startBeat - right.startBeat;
  }

  return (laneSortOrder.get(left.pitch) ?? 0) - (laneSortOrder.get(right.pitch) ?? 0);
}

function createDrumEventId(index: number): string {
  return `drum_${String(index + 1).padStart(4, "0")}`;
}
