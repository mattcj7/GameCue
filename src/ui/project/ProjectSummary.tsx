const summaryItems = [
  {
    label: "Project",
    value: "No cue generated yet",
  },
  {
    label: "Planned Tracks",
    value: "Percussion, Bass, Chords, Melody",
  },
  {
    label: "Schema",
    value: ".gamecue.json source of truth",
  },
  {
    label: "Next Step",
    value: "Wire cue settings in T0004",
  },
] as const;

export function ProjectSummary() {
  return (
    <section className="summary-grid" aria-label="Project summary">
      {summaryItems.map((item) => (
        <article key={item.label} className="summary-card">
          <p className="summary-label">{item.label}</p>
          <p className="summary-value">{item.value}</p>
        </article>
      ))}
    </section>
  );
}
