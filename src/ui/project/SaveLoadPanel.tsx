export function SaveLoadPanel() {
  return (
    <section aria-labelledby="save-load-title">
      <div className="panel-header">
        <h2 id="save-load-title" className="panel-title">
          Save / Load
        </h2>
        <p className="panel-description">
          Project file actions stay as placeholders until the save/load ticket adds parsing,
          validation, and browser file handling.
        </p>
      </div>

      <div className="project-actions" aria-label="Project file placeholder actions">
        <button type="button" className="placeholder-button" disabled>
          Save .gamecue.json
        </button>
        <button type="button" className="placeholder-button" disabled>
          Load .gamecue.json
        </button>
      </div>
    </section>
  );
}
