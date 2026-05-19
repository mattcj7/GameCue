import type { CueSettings } from "../../core/model";
import { cueModes, cueTypes, moods } from "../../core/model";

const keyOptions = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;
const intensityOptions = [1, 2, 3, 4, 5] as const;

export interface CueControlsProps {
  settings: CueSettings;
  onSettingChange: <Field extends keyof CueSettings>(
    field: Field,
    value: CueSettings[Field],
  ) => void;
  onGenerateCue: () => void;
}

function formatOptionLabel(value: string): string {
  return value
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function isValidBarCount(bars: number): boolean {
  return Number.isFinite(bars) && Number.isInteger(bars) && bars >= 1;
}

export function CueControls({ settings, onSettingChange, onGenerateCue }: CueControlsProps) {
  const hasValidBars = isValidBarCount(settings.bars);

  const handleBpmChange = (value: string) => {
    const nextBpm = Number.parseInt(value, 10);

    if (!Number.isNaN(nextBpm)) {
      onSettingChange("bpm", nextBpm);
    }
  };

  const handleBarsChange = (value: string) => {
    const nextBars = Number.parseInt(value, 10);

    if (!Number.isNaN(nextBars)) {
      onSettingChange("bars", nextBars);
    }
  };

  return (
    <section aria-labelledby="cue-controls-title">
      <div className="panel-header">
        <h2 id="cue-controls-title" className="panel-title">
          Cue Controls
        </h2>
        <p className="panel-description">
          Choose the cue settings and generate a deterministic project from the current values.
        </p>
      </div>

      <form className="cue-controls-form">
        <label className="field">
          <span className="field-label">Cue Type</span>
          <select
            className="field-input"
            value={settings.type}
            onChange={(event) => onSettingChange("type", event.target.value as CueSettings["type"])}
          >
            {cueTypes.map((cueType) => (
              <option key={cueType} value={cueType}>
                {formatOptionLabel(cueType)}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">Mood</span>
          <select
            className="field-input"
            value={settings.mood}
            onChange={(event) => onSettingChange("mood", event.target.value as CueSettings["mood"])}
          >
            {moods.map((mood) => (
              <option key={mood} value={mood}>
                {formatOptionLabel(mood)}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">BPM</span>
          <input
            className="field-input"
            type="number"
            min={40}
            max={220}
            step={1}
            value={settings.bpm}
            onChange={(event) => handleBpmChange(event.target.value)}
          />
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field-label">Key</span>
            <select
              className="field-input"
              value={settings.key}
              onChange={(event) => onSettingChange("key", event.target.value)}
            >
              {keyOptions.map((keyOption) => (
                <option key={keyOption} value={keyOption}>
                  {keyOption}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field-label">Mode</span>
            <select
              className="field-input"
              value={settings.mode}
              onChange={(event) => onSettingChange("mode", event.target.value as CueSettings["mode"])}
            >
              {cueModes.map((mode) => (
                <option key={mode} value={mode}>
                  {formatOptionLabel(mode)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="field-row">
          <label className="field">
            <span className="field-label">Intensity</span>
            <select
              className="field-input"
              value={settings.intensity}
              onChange={(event) =>
                onSettingChange("intensity", Number.parseInt(event.target.value, 10) as CueSettings["intensity"])
              }
            >
              {intensityOptions.map((intensity) => (
                <option key={intensity} value={intensity}>
                  {intensity}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field-label">Bars</span>
            <input
              className="field-input"
              type="number"
              min={1}
              step={1}
              value={settings.bars}
              aria-invalid={!hasValidBars}
              onChange={(event) => handleBarsChange(event.target.value)}
            />
          </label>
        </div>

        <button
          type="button"
          className="placeholder-button primary-button"
          disabled={!hasValidBars}
          aria-disabled={!hasValidBars}
          onClick={onGenerateCue}
        >
          Generate Cue
        </button>

        <p className="field-note">
          {!hasValidBars
            ? "Bars must be a whole number of at least 1 before you can generate a cue."
            : `Time signature is fixed at ${settings.timeSignature} for now. Generate a cue, then use transport to play, stop, or loop the latest project.`}
        </p>
      </form>
    </section>
  );
}
