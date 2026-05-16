const placeholderTracks = [
  {
    name: "Percussion",
    type: "drums",
    note: "Future rhythm lane",
  },
  {
    name: "Pulse Bass",
    type: "bass",
    note: "Future low-end motion",
  },
  {
    name: "Dark Pad",
    type: "chords",
    note: "Future harmonic bed",
  },
  {
    name: "Sparse Motif",
    type: "melody",
    note: "Future melodic idea",
  },
] as const;

export function TrackList() {
  return (
    <section aria-labelledby="track-list-title">
      <div className="panel-header">
        <h2 id="track-list-title" className="panel-title">
          Track List
        </h2>
        <p className="panel-description">
          Generated tracks will appear here once the project generator is connected.
        </p>
      </div>

      <div className="track-list" role="list" aria-label="Placeholder track list">
        {placeholderTracks.map((track) => (
          <article key={track.name} className="track-card" role="listitem">
            <div className="track-copy">
              <h3>{track.name}</h3>
              <p>{track.note}</p>
            </div>
            <div className="track-meta">
              <span className="track-type">{track.type}</span>
              <div className="track-actions" aria-label={`${track.name} placeholder actions`}>
                <button type="button" className="placeholder-chip" disabled>
                  Mute
                </button>
                <button type="button" className="placeholder-chip" disabled>
                  Solo
                </button>
                <button type="button" className="placeholder-chip" disabled>
                  Regen
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
