import type { CueSettings } from "./CueSettings";
import type { MixSettings } from "./MixSettings";
import type { Section } from "./Section";
import type { Track } from "./Track";
import type { ProjectId, SchemaVersion } from "./projectTypes";

export interface GameCueProject {
  schemaVersion: SchemaVersion;
  projectId: ProjectId;
  title: string;
  createdAt: string;
  updatedAt: string;
  cue: CueSettings;
  sections: Section[];
  tracks: Track[];
  mix: MixSettings;
}
