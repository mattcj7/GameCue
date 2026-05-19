interface TransportControlsProps {
  hasProject: boolean;
  isPlaying: boolean;
  isLoopEnabled: boolean;
  statusText: string;
  errorText?: string | null;
  onPlay: () => void | Promise<void>;
  onStop: () => void | Promise<void>;
  onToggleLoop: () => void;
}

export function TransportControls({
  hasProject,
  isPlaying,
  isLoopEnabled,
  statusText,
  errorText,
  onPlay,
  onStop,
  onToggleLoop,
}: TransportControlsProps) {
  return (
    <section aria-labelledby="transport-title">
      <div className="panel-header transport-header">
        <div>
          <h2 id="transport-title" className="panel-title">
            Transport
          </h2>
          <p className="panel-description">
            {hasProject
              ? "Play uses the latest generated cue and starts browser audio from your click."
              : "Generate a cue to enable playback controls."}
          </p>
        </div>
        <p className="transport-status">Status: {statusText}</p>
      </div>

      <div className="transport-actions" aria-label="Transport actions">
        <button
          type="button"
          className="placeholder-button primary-button"
          disabled={!hasProject}
          onClick={onPlay}
        >
          Play
        </button>
        <button
          type="button"
          className="placeholder-button"
          disabled={!hasProject}
          onClick={onStop}
        >
          Stop
        </button>
        <button
          type="button"
          className="placeholder-button"
          disabled={!hasProject}
          onClick={onToggleLoop}
        >
          {isLoopEnabled ? "Loop On" : "Loop Off"}
        </button>
      </div>

      <p className="transport-feedback">
        {!hasProject
          ? "No project has been generated yet."
          : isPlaying
            ? "Playback is running."
            : "Playback is stopped at the cue start."}
      </p>
      {errorText ? (
        <p className="transport-error" role="alert">
          Playback error: {errorText}
        </p>
      ) : null}
    </section>
  );
}
