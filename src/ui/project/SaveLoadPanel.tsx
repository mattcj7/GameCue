import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { GameCueProject } from "../../core/model";
import { parseProjectJson, validateProject } from "../../core/serialization";
import { formatValidationError, readProjectFileText } from "./loadProjectFile";
import { downloadProjectFile } from "./saveProjectFile";

interface SaveLoadPanelProps {
  project: GameCueProject | null;
  onLoadProject: (project: GameCueProject) => Promise<void>;
}

export function SaveLoadPanel({ project, onLoadProject }: SaveLoadPanelProps) {
  const [projectFeedback, setProjectFeedback] = useState("Generate a cue before saving.");
  const previousProjectRef = useRef<GameCueProject | null>(project);
  const loadInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (project === null) {
      setProjectFeedback("Generate a cue before saving.");
    } else if (previousProjectRef.current !== project) {
      setProjectFeedback("Ready to save.");
    }

    previousProjectRef.current = project;
  }, [project]);

  const handleSaveProject = () => {
    if (project === null) {
      return;
    }

    const fileName = downloadProjectFile(project);
    setProjectFeedback(`Project saved as ${fileName}.`);
  };

  const handleLoadButtonClick = () => {
    loadInputRef.current?.click();
  };

  const handleProjectFileSelected = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    try {
      const projectText = await readProjectFileText(file);
      let parsedProject: unknown;

      try {
        parsedProject = parseProjectJson(projectText);
      } catch {
        setProjectFeedback("Could not parse project JSON.");
        return;
      }

      const validationResult = validateProject(parsedProject);

      if (!validationResult.ok) {
        const firstError = validationResult.errors[0];
        const errorMessage =
          firstError === undefined
            ? "Could not load project: Validation failed."
            : `Could not load project: ${formatValidationError(firstError)}`;

        setProjectFeedback(errorMessage);
        return;
      }

      await onLoadProject(validationResult.value);
      setProjectFeedback("Project loaded.");
    } catch (error) {
      const errorMessage =
        error instanceof Error && error.message.length > 0
          ? `Could not load project: ${error.message}`
          : "Could not read project file.";

      setProjectFeedback(errorMessage);
    } finally {
      input.value = "";
    }
  };

  return (
    <section aria-labelledby="save-load-title">
      <div className="panel-header">
        <h2 id="save-load-title" className="panel-title">
          Save / Load
        </h2>
        <p className="panel-description">
          Save the current generated project as a `.gamecue.json` file or load a saved project
          back into the app.
        </p>
      </div>

      <div className="project-actions" aria-label="Project file actions">
        <button
          type="button"
          className="placeholder-button primary-button"
          disabled={project === null}
          onClick={handleSaveProject}
        >
          Save .gamecue.json
        </button>
        <button type="button" className="placeholder-button" onClick={handleLoadButtonClick}>
          Load .gamecue.json
        </button>
        <input
          ref={loadInputRef}
          type="file"
          accept=".gamecue.json,application/json"
          onChange={handleProjectFileSelected}
          style={{ display: "none" }}
        />
      </div>

      <p className="project-feedback" aria-live="polite">
        {projectFeedback}
      </p>
    </section>
  );
}
