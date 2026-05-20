import { useEffect, useState } from "react";
import type { GameCueProject } from "../../core/model";
import { downloadProjectFile } from "./saveProjectFile";

interface SaveLoadPanelProps {
  project: GameCueProject | null;
}

export function SaveLoadPanel({ project }: SaveLoadPanelProps) {
  const [saveFeedback, setSaveFeedback] = useState("Generate a cue before saving.");

  useEffect(() => {
    if (project === null) {
      setSaveFeedback("Generate a cue before saving.");
      return;
    }

    setSaveFeedback("Ready to save.");
  }, [project]);

  const handleSaveProject = () => {
    if (project === null) {
      return;
    }

    const fileName = downloadProjectFile(project);
    setSaveFeedback(`Project saved as ${fileName}.`);
  };

  return (
    <section aria-labelledby="save-load-title">
      <div className="panel-header">
        <h2 id="save-load-title" className="panel-title">
          Save / Load
        </h2>
        <p className="panel-description">
          Save the current generated project as a `.gamecue.json` file. Load stays disabled until
          T0022 adds browser file parsing and validation.
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
        <button type="button" className="placeholder-button" disabled>
          Load .gamecue.json
        </button>
      </div>

      <p className="project-feedback" aria-live="polite">
        {saveFeedback}
      </p>
    </section>
  );
}
