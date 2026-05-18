import type { CueSettings, GameCueProject } from "../../core/model";

export interface ProjectSummaryProps {
  settings: CueSettings;
  project: GameCueProject | null;
}

function formatOptionLabel(value: string): string {
  return value
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function ProjectSummary({ settings, project }: ProjectSummaryProps) {
  const totalEvents =
    project?.tracks.reduce((eventCount, track) => eventCount + track.events.length, 0) ?? 0;
  const summaryItems = [
    {
      label: "Cue",
      value: `${formatOptionLabel(settings.type)} / ${formatOptionLabel(settings.mood)}`,
    },
    {
      label: "Tempo",
      value: `${settings.bpm} BPM / Intensity ${settings.intensity}`,
    },
    {
      label: "Harmony",
      value: `${settings.key} ${formatOptionLabel(settings.mode)}`,
    },
    {
      label: "Structure",
      value: `${settings.bars} bars / ${settings.timeSignature}`,
    },
    {
      label: "Project",
      value: project?.title ?? "Not generated yet",
    },
    {
      label: "Output",
      value:
        project === null
          ? "0 tracks / 0 events"
          : `${project.tracks.length} tracks / ${totalEvents} events`,
    },
  ] as const;

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
