import type { CueIntensity, SectionId } from "./projectTypes";

export interface Section {
  id: SectionId;
  name: string;
  startBar: number;
  bars: number;
  intensity: CueIntensity;
}
