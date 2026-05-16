import type { EventId, NoteEventType } from "./projectTypes";

export interface NoteEvent {
  id: EventId;
  type: NoteEventType;
  pitch: string;
  startBeat: number;
  durationBeats: number;
  velocity: number;
}
