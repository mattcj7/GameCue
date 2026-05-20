import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { generateProject } from "../core/generation";
import type { CueSettings, GameCueProject, TrackId } from "../core/model";
import { timeSignatures } from "../core/model";
import type { PlaybackEngine } from "../playback";
import { TonePlaybackEngine } from "../playback/tone";
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

function hasValidBarCount(settings: CueSettings): boolean {
  return Number.isFinite(settings.bars) && Number.isInteger(settings.bars) && settings.bars >= 1;
}

type TransportStatus = "No project" | "Ready" | "Playing" | "Stopped" | "Error";

interface TrackPlaybackState {
  muted: boolean;
  solo: boolean;
}

type TrackPlaybackStateMap = Record<TrackId, TrackPlaybackState>;

function App() {
  const [cueSettings, setCueSettings] = useState<CueSettings>(defaultCueSettings);
  const [project, setProject] = useState<GameCueProject | null>(null);
  const [trackPlaybackState, setTrackPlaybackState] = useState<TrackPlaybackStateMap>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoopEnabled, setIsLoopEnabled] = useState(false);
  const [transportStatus, setTransportStatus] = useState<TransportStatus>("No project");
  const [transportError, setTransportError] = useState<string | null>(null);

  const playbackEngineRef = useRef<PlaybackEngine | null>(null);
  const projectNeedsLoadRef = useRef(false);

  useEffect(() => {
    return () => {
      const playbackEngine = playbackEngineRef.current;
      playbackEngineRef.current = null;
      projectNeedsLoadRef.current = false;

      if (playbackEngine !== null) {
        void playbackEngine.dispose().catch(() => undefined);
      }
    };
  }, []);

  const handleCueSettingChange = <Field extends keyof CueSettings>(
    field: Field,
    value: CueSettings[Field],
  ) => {
    setCueSettings((currentSettings) => ({
      ...currentSettings,
      [field]: value,
    }));
  };

  const handleGenerateCue = async () => {
    if (!hasValidBarCount(cueSettings)) {
      return;
    }

    const nextProject = generateProject(cueSettings);
    const nextTrackPlaybackState = createTrackPlaybackStateMap(nextProject);

    try {
      if (playbackEngineRef.current !== null) {
        await playbackEngineRef.current.stop();
      }

      setProject(nextProject);
      setTrackPlaybackState(nextTrackPlaybackState);
      projectNeedsLoadRef.current = true;
      setIsPlaying(false);
      setTransportError(null);
      setTransportStatus("Ready");
    } catch (error) {
      setProject(nextProject);
      setTrackPlaybackState(nextTrackPlaybackState);
      projectNeedsLoadRef.current = true;
      setIsPlaying(false);
      setTransportError(getErrorMessage(error));
      setTransportStatus("Error");
    }
  };

  const handlePlay = async () => {
    if (project === null) {
      return;
    }

    try {
      const playbackEngine = getPlaybackEngine(playbackEngineRef, isLoopEnabled);

      if (projectNeedsLoadRef.current) {
        await playbackEngine.loadProject(project);
        playbackEngine.setLoop(isLoopEnabled);
        applyTrackPlaybackState(playbackEngine, trackPlaybackState);
        projectNeedsLoadRef.current = false;
      }

      await playbackEngine.play();
      setIsPlaying(true);
      setTransportError(null);
      setTransportStatus("Playing");
    } catch (error) {
      setIsPlaying(false);
      setTransportError(getErrorMessage(error));
      setTransportStatus("Error");
    }
  };

  const handleStop = async () => {
    if (project === null) {
      return;
    }

    try {
      if (playbackEngineRef.current !== null) {
        await playbackEngineRef.current.stop();
      }

      setIsPlaying(false);
      setTransportError(null);
      setTransportStatus("Stopped");
    } catch (error) {
      setIsPlaying(false);
      setTransportError(getErrorMessage(error));
      setTransportStatus("Error");
    }
  };

  const handleToggleLoop = () => {
    if (project === null) {
      return;
    }

    const nextLoopEnabled = !isLoopEnabled;
    setIsLoopEnabled(nextLoopEnabled);

    try {
      if (playbackEngineRef.current !== null) {
        playbackEngineRef.current.setLoop(nextLoopEnabled);
      }

      if (transportStatus === "No project") {
        setTransportStatus("Ready");
      }

      setTransportError(null);
    } catch (error) {
      setTransportError(getErrorMessage(error));
      setTransportStatus("Error");
    }
  };

  const handleToggleTrackMute = (trackId: TrackId) => {
    const currentTrackState = trackPlaybackState[trackId];

    if (currentTrackState === undefined) {
      return;
    }

    const nextMuted = !currentTrackState.muted;

    setTrackPlaybackState((currentTrackPlaybackState) => ({
      ...currentTrackPlaybackState,
      [trackId]: {
        ...currentTrackPlaybackState[trackId],
        muted: nextMuted,
      },
    }));

    try {
      if (playbackEngineRef.current !== null) {
        playbackEngineRef.current.setTrackMuted(trackId, nextMuted);
      }

      setTransportError(null);
    } catch (error) {
      setTransportError(getErrorMessage(error));
      setTransportStatus("Error");
    }
  };

  const handleToggleTrackSolo = (trackId: TrackId) => {
    const currentTrackState = trackPlaybackState[trackId];

    if (currentTrackState === undefined) {
      return;
    }

    const nextSolo = !currentTrackState.solo;

    setTrackPlaybackState((currentTrackPlaybackState) => ({
      ...currentTrackPlaybackState,
      [trackId]: {
        ...currentTrackPlaybackState[trackId],
        solo: nextSolo,
      },
    }));

    try {
      if (playbackEngineRef.current !== null) {
        playbackEngineRef.current.setTrackSolo(trackId, nextSolo);
      }

      setTransportError(null);
    } catch (error) {
      setTransportError(getErrorMessage(error));
      setTransportStatus("Error");
    }
  };

  return (
    <main className="app-shell">
      <header className="panel app-header">
        <div className="app-header-copy">
          <p className="eyebrow">T0017 - Track Mute / Solo</p>
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
          <TrackList
            project={project}
            trackPlaybackState={trackPlaybackState}
            onToggleTrackMute={handleToggleTrackMute}
            onToggleTrackSolo={handleToggleTrackSolo}
          />
        </section>
      </section>

      <section className="panel transport-panel">
        <TransportControls
          hasProject={project !== null}
          isPlaying={isPlaying}
          isLoopEnabled={isLoopEnabled}
          statusText={transportStatus}
          errorText={transportError}
          onPlay={handlePlay}
          onStop={handleStop}
          onToggleLoop={handleToggleLoop}
        />
      </section>

      <section className="panel project-panel">
        <SaveLoadPanel project={project} />
      </section>
    </main>
  );
}

export default App;

function createTrackPlaybackStateMap(project: GameCueProject): TrackPlaybackStateMap {
  return Object.fromEntries(
    project.tracks.map((track) => [
      track.id,
      {
        muted: track.muted,
        solo: track.solo,
      },
    ]),
  ) as TrackPlaybackStateMap;
}

function getPlaybackEngine(
  playbackEngineRef: MutableRefObject<PlaybackEngine | null>,
  isLoopEnabled: boolean,
): PlaybackEngine {
  if (playbackEngineRef.current === null) {
    const playbackEngine = new TonePlaybackEngine();
    playbackEngine.setLoop(isLoopEnabled);
    playbackEngineRef.current = playbackEngine;
  }

  return playbackEngineRef.current;
}

function applyTrackPlaybackState(
  playbackEngine: PlaybackEngine,
  trackPlaybackState: TrackPlaybackStateMap,
): void {
  for (const [trackId, state] of Object.entries(trackPlaybackState)) {
    playbackEngine.setTrackMuted(trackId, state.muted);
    playbackEngine.setTrackSolo(trackId, state.solo);
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return "Playback is unavailable right now.";
}
