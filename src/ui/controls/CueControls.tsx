const placeholderFields = [
  {
    label: "Cue Type",
    value: "Investigation",
  },
  {
    label: "Mood",
    value: "Dark",
  },
  {
    label: "BPM",
    value: "86",
  },
  {
    label: "Key / Mode",
    value: "D minor",
  },
  {
    label: "Intensity",
    value: "3",
  },
  {
    label: "Bars",
    value: "16",
  },
] as const;

export function CueControls() {
  return (
    <section aria-labelledby="cue-controls-title">
      <div className="panel-header">
        <h2 id="cue-controls-title" className="panel-title">
          Cue Controls
        </h2>
        <p className="panel-description">
          The real controls arrive in T0004. This layout reserves the left panel for cue settings
          and generation actions.
        </p>
      </div>

      <form className="placeholder-form">
        {placeholderFields.map((field) => (
          <label key={field.label} className="field">
            <span className="field-label">{field.label}</span>
            <input
              className="field-input"
              type="text"
              value={field.value}
              disabled
              readOnly
              aria-label={field.label}
            />
          </label>
        ))}

        <button type="button" className="placeholder-button primary-button" disabled>
          Generate Cue
        </button>
      </form>
    </section>
  );
}
