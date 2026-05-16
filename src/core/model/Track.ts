import type { NoteEvent } from "./NoteEvent";
import type { InstrumentId, TrackId, TrackType } from "./projectTypes";

export interface Track {
  id: TrackId;
  name: string;
  type: TrackType;
  instrument: InstrumentId;
  muted: boolean;
  solo: boolean;
  locked: boolean;
  events: NoteEvent[];
}
