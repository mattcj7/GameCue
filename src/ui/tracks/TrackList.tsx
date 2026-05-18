import type { GameCueProject } from "../../core/model";

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

export interface TrackListProps {
  project: GameCueProject | null;
}

export function TrackList({ project }: TrackListProps) {
  if (project === null) {
    return (
      <section aria-labelledby="track-list-title">
        <div className="panel-header">
          <h2 id="track-list-title" className="panel-title">
            Track List
          </h2>
          <p className="panel-description">
            Generated tracks will appear here once you create a project from the current cue
            settings.
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

  return (
    <section aria-labelledby="track-list-title">
      <div className="panel-header">
        <h2 id="track-list-title" className="panel-title">
          Track List
        </h2>
        <p className="panel-description">
          {project.title} includes {project.tracks.length} generated tracks.
        </p>
      </div>

      <div className="track-list" role="list" aria-label="Generated track list">
        {project.tracks.map((track) => (
          <article key={track.id} className="track-card" role="listitem">
            <div className="track-copy">
              <h3>{track.name}</h3>
              <p className="track-copy-meta">
                {track.instrument} · {track.events.length} events
              </p>
            </div>
            <div className="track-meta">
              <span className="track-type">{track.type}</span>
              <div className="track-stat-list" aria-label={`${track.name} track status`}>
                <span className="track-stat">{track.muted ? "Muted" : "Live"}</span>
                <span className="track-stat">{track.locked ? "Locked" : "Unlocked"}</span>
              </div>
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
