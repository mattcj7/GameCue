import { describe, expect, it } from "vitest";
import { createExampleProject } from "../../src/core/model";
import { createProjectFileName } from "../../src/ui/project/saveProjectFile";

describe("createProjectFileName", () => {
  it("creates a lowercase safe .gamecue.json filename from the project title", () => {
    const project = createExampleProject();
    project.title = " Dark Alley: Investigation / v1 ";

    expect(createProjectFileName(project)).toBe("dark-alley-investigation-v1.gamecue.json");
  });

  it("collapses repeated separators in the generated file name", () => {
    const project = createExampleProject();
    project.title = "Menu___Theme   Final!!!";

    expect(createProjectFileName(project)).toBe("menu-theme-final.gamecue.json");
  });

  it("falls back to the default file name when the title has no safe characters", () => {
    const project = createExampleProject();
    project.title = "!!!";

    expect(createProjectFileName(project)).toBe("gamecue-project.gamecue.json");
  });
});
