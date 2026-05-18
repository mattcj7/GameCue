import { describe, expect, it } from "vitest";

import {
  isSupportedToneInstrumentId,
  isToneDrumLane,
  supportedToneInstrumentIds,
  toneDrumLanes,
} from "../../src/playback/tone/toneInstrumentTypes";

describe("toneInstrumentTypes", () => {
  it("lists the T0014-supported Tone instrument ids", () => {
    expect(supportedToneInstrumentIds).toEqual([
      "minimal_electronic_kit",
      "sub_pulse",
      "dark_pad",
      "simple_lead",
    ]);
  });

  it("flags supported and unsupported instrument ids correctly", () => {
    expect(isSupportedToneInstrumentId("minimal_electronic_kit")).toBe(true);
    expect(isSupportedToneInstrumentId("simple_lead")).toBe(true);
    expect(isSupportedToneInstrumentId("soft_pluck")).toBe(false);
    expect(isSupportedToneInstrumentId("ambient_texture")).toBe(false);
  });

  it("recognizes the current drum lane aliases for the electronic kit", () => {
    expect(toneDrumLanes).toEqual(["kick", "snare", "hat", "closed_hat", "open_hat"]);
    expect(isToneDrumLane("kick")).toBe(true);
    expect(isToneDrumLane("hat")).toBe(true);
    expect(isToneDrumLane("closed_hat")).toBe(true);
    expect(isToneDrumLane("rim")).toBe(false);
  });
});
