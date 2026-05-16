const placeholderSections = [
  {
    title: "Cue Controls",
    description: "Cue generation controls will be added in a later ticket.",
  },
  {
    title: "Track List",
    description: "Generated tracks will appear here once project generation exists.",
  },
  {
    title: "Transport",
    description: "Playback controls will be wired after the playback tickets begin.",
  },
  {
    title: "Save / Load",
    description: "Project file actions will be added after the core project model exists.",
  },
] as const;

function App() {
  return (
    <main className="app-shell">
      <header className="hero-panel">
        <p className="eyebrow">Project Skeleton</p>
        <h1>GameCue</h1>
        <p className="tagline">Generate loopable game music cues</p>
      </header>

      <section className="panel-grid" aria-label="GameCue placeholder sections">
        {placeholderSections.map((section) => (
          <section key={section.title} className="panel">
            <h2>{section.title}</h2>
            <p>{section.description}</p>
          </section>
        ))}
      </section>
    </main>
  );
}

export default App;
