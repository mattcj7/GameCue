import type { CueSettings } from "../model";
import { timeSignatures } from "../model";
import type { CueType } from "../model";
import { cueTemplates } from "./cueTemplates";
import type { CueTemplate, TemplateId } from "./CueTemplate";

const templateByCueType = new Map<CueType, CueTemplate>(
  cueTemplates.map((template) => [template.cueType, template]),
);

const templateById = new Map<TemplateId, CueTemplate>(
  cueTemplates.map((template) => [template.id, template]),
);

export function getCueTemplate(cueType: CueType): CueTemplate {
  const template = templateByCueType.get(cueType);

  if (!template) {
    throw new Error(`No cue template found for cue type: ${cueType}`);
  }

  return template;
}

export function getCueTemplateById(id: TemplateId): CueTemplate {
  const template = templateById.get(id);

  if (!template) {
    throw new Error(`No cue template found for id: ${id}`);
  }

  return template;
}

export function getAllCueTemplates(): readonly CueTemplate[] {
  return cueTemplates;
}

export function getDefaultCueSettingsForTemplate(template: CueTemplate): CueSettings {
  const [minimumBpm, maximumBpm] = template.bpmRange;

  return {
    type: template.cueType,
    mood: template.allowedMoods[0],
    intensity: 3,
    bpm: Math.round((minimumBpm + maximumBpm) / 2),
    key: getDefaultKeyForMode(template.defaultMode),
    mode: template.defaultMode,
    bars: template.recommendedBars[0],
    timeSignature: timeSignatures[0],
  };
}

function getDefaultKeyForMode(mode: CueTemplate["defaultMode"]): string {
  return mode === "major" ? "C" : "D";
}
