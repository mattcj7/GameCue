export function TransportControls() {
  return (
    <section aria-labelledby="transport-title">
      <div className="panel-header transport-header">
        <div>
          <h2 id="transport-title" className="panel-title">
            Transport
          </h2>
          <p className="panel-description">
            Playback stays disabled until the playback tickets wire the engine and browser audio.
          </p>
        </div>
        <p className="transport-status">Status: Not Ready</p>
      </div>

      <div className="transport-actions" aria-label="Transport placeholder actions">
        <button type="button" className="placeholder-button" disabled>
          Play
        </button>
        <button type="button" className="placeholder-button" disabled>
          Stop
        </button>
        <button type="button" className="placeholder-button" disabled>
          Loop Off
        </button>
      </div>
    </section>
  );
}
