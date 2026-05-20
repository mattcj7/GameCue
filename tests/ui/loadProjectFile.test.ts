import { describe, expect, it } from "vitest";
import { formatValidationError, readProjectFileText } from "../../src/ui/project/loadProjectFile";

describe("readProjectFileText", () => {
  it("reads project file text through the browser File API shape", async () => {
    const projectFile = new File(
      ['{\n  "schemaVersion": "0.1"\n}'],
      "project.gamecue.json",
      { type: "application/json" },
    );

    await expect(readProjectFileText(projectFile)).resolves.toBe('{\n  "schemaVersion": "0.1"\n}');
  });
});

describe("formatValidationError", () => {
  it("formats a validation error using its path and message", () => {
    expect(
      formatValidationError({
        path: "tracks",
        message: "Tracks array is required",
      }),
    ).toBe("tracks: Tracks array is required");
  });
});
