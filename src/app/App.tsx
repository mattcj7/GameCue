import { CueControls } from "../ui/controls/CueControls";
import { TransportControls } from "../ui/controls/TransportControls";
import { ProjectSummary } from "../ui/project/ProjectSummary";
import { SaveLoadPanel } from "../ui/project/SaveLoadPanel";
import { TrackList } from "../ui/tracks/TrackList";

function App() {
  return (
    <main className="app-shell">
      <header className="panel app-header">
        <div className="app-header-copy">
          <p className="eyebrow">T0003 - Basic App Layout</p>
          <h1>GameCue</h1>
          <p className="tagline">Generate loopable game music cues for game projects.</p>
        </div>
        <ProjectSummary />
      </header>

      <section className="workspace-grid" aria-label="GameCue workspace layout">
        <aside className="panel side-panel">
          <CueControls />
        </aside>

        <section className="panel main-panel">
          <TrackList />
        </section>
      </section>

      <section className="panel transport-panel">
        <TransportControls />
      </section>

      <section className="panel project-panel">
        <SaveLoadPanel />
      </section>
    </main>
  );
}

export default App;
