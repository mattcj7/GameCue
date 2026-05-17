import { describe, expect, it } from "vitest";
import { cueTypes } from "../../src/core/model";
import { getAllCueTemplates, getCueTemplate } from "../../src/core/templates";

describe("cue templates", () => {
  it('returns the Investigation template for getCueTemplate("investigation")', () => {
    const template = getCueTemplate("investigation");

    expect(template.cueType).toBe("investigation");
    expect(template.displayName).toBe("Investigation");
  });

  it('returns the Chase template for getCueTemplate("chase")', () => {
    const template = getCueTemplate("chase");

    expect(template.cueType).toBe("chase");
    expect(template.displayName).toBe("Chase");
  });

  it("has a template for every cue type", () => {
    const templateCueTypes = new Set(getAllCueTemplates().map((template) => template.cueType));

    expect(templateCueTypes).toEqual(new Set(cueTypes));
  });

  it("has a faster chase minimum BPM than investigation minimum BPM", () => {
    const chaseTemplate = getCueTemplate("chase");
    const investigationTemplate = getCueTemplate("investigation");

    expect(chaseTemplate.bpmRange[0]).toBeGreaterThan(investigationTemplate.bpmRange[0]);
  });

  it("keeps Dark Ambient and Emotional Scene sparse by profile and presets", () => {
    const sparseDensities = new Set(["sparse", "very_sparse"]);

    for (const cueType of ["dark_ambient", "emotional_scene"] as const) {
      const template = getCueTemplate(cueType);

      expect(sparseDensities.has(template.generationProfile.density)).toBe(true);
      expect(
        template.trackPresets.every((preset) => sparseDensities.has(preset.density)),
      ).toBe(true);
    }
  });
});
