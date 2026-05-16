import type { CueSettings } from "../../core/model";

export interface ProjectSummaryProps {
  settings: CueSettings;
}

function formatOptionLabel(value: string): string {
  return value
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function ProjectSummary({ settings }: ProjectSummaryProps) {
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
