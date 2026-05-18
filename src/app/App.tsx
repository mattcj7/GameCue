import { useState } from "react";
import { generateProject } from "../core/generation";
import type { CueSettings, GameCueProject } from "../core/model";
import { timeSignatures } from "../core/model";
import { CueControls } from "../ui/controls/CueControls";
import { TransportControls } from "../ui/controls/TransportControls";
import { ProjectSummary } from "../ui/project/ProjectSummary";
import { SaveLoadPanel } from "../ui/project/SaveLoadPanel";
import { TrackList } from "../ui/tracks/TrackList";

const defaultCueSettings: CueSettings = {
  type: "investigation",
  mood: "dark",
  bpm: 86,
  key: "D",
  mode: "minor",
  intensity: 3,
  bars: 16,
  timeSignature: timeSignatures[0],
};

function App() {
  const [cueSettings, setCueSettings] = useState<CueSettings>(defaultCueSettings);
  const [project, setProject] = useState<GameCueProject | null>(null);

  const handleCueSettingChange = <Field extends keyof CueSettings>(
    field: Field,
    value: CueSettings[Field],
  ) => {
    setCueSettings((currentSettings) => ({
      ...currentSettings,
      [field]: value,
    }));
  };

  const handleGenerateCue = () => {
    setProject(generateProject(cueSettings));
  };

  return (
    <main className="app-shell">
      <header className="panel app-header">
        <div className="app-header-copy">
          <p className="eyebrow">T0012 - Full Project Generator</p>
          <h1>GameCue</h1>
          <p className="tagline">Generate loopable game music cues for game projects.</p>
        </div>
        <ProjectSummary settings={cueSettings} project={project} />
      </header>

      <section className="workspace-grid" aria-label="GameCue workspace layout">
        <aside className="panel side-panel">
          <CueControls
            settings={cueSettings}
            onSettingChange={handleCueSettingChange}
            onGenerateCue={handleGenerateCue}
          />
        </aside>

        <section className="panel main-panel">
          <TrackList project={project} />
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
