import type { InstrumentId } from "../../core/model";

export const supportedToneInstrumentIds = [
  "minimal_electronic_kit",
  "sub_pulse",
  "dark_pad",
  "simple_lead",
] as const;

export type SupportedToneInstrumentId = (typeof supportedToneInstrumentIds)[number];

export const toneDrumLanes = [
  "kick",
  "snare",
  "hat",
  "closed_hat",
  "open_hat",
] as const;

export type ToneDrumLane = (typeof toneDrumLanes)[number];

export function isSupportedToneInstrumentId(
  instrumentId: InstrumentId,
): instrumentId is SupportedToneInstrumentId {
  return supportedToneInstrumentIds.includes(instrumentId as SupportedToneInstrumentId);
}

export function isToneDrumLane(lane: string): lane is ToneDrumLane {
  return toneDrumLanes.includes(lane as ToneDrumLane);
}
