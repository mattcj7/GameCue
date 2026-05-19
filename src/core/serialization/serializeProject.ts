import type { GameCueProject } from "../model";

export function serializeProject(project: GameCueProject): string {
  return JSON.stringify(project, null, 2);
}
