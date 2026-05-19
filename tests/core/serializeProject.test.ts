import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { generateProject } from "../../src/core/generation";
import type { CueSettings } from "../../src/core/model";
import { serializeProject } from "../../src/core/serialization";

function createSettings(overrides: Partial<CueSettings> = {}): CueSettings {
  return {
    type: "investigation",
    mood: "dark",
    intensity: 3,
    bpm: 86,
    key: "D",
    mode: "minor",
    bars: 16,
    timeSignature: "4/4",
    ...overrides,
  };
}

function readSerializationSourceFiles(): string[] {
  const currentDirectory = dirname(fileURLToPath(import.meta.url));
  const serializationDirectory = join(currentDirectory, "..", "..", "src", "core", "serialization");

  return readdirSync(serializationDirectory)
    .filter((fileName) => fileName.endsWith(".ts"))
    .map((fileName) => readFileSync(join(serializationDirectory, fileName), "utf8"));
}

describe("serializeProject", () => {
  it("serializes a generated project to pretty JSON", () => {
    const project = generateProject(createSettings());
    const serializedProject = serializeProject(project);

    expect(serializedProject.startsWith("{\n")).toBe(true);
    expect(serializedProject).toContain('\n  "schemaVersion": "0.1"');
    expect(serializedProject).toContain('\n    "type": "investigation"');
  });

  it("parses back to a plain object with preserved schemaVersion and cue settings", () => {
    const project = generateProject(createSettings({ type: "suspense", mood: "creepy" }));
    const parsedProject = JSON.parse(serializeProject(project));

    expect(parsedProject.schemaVersion).toBe(project.schemaVersion);
    expect(parsedProject.cue).toEqual(project.cue);
  });

  it("preserves sections, tracks, events, and mix settings during round-trip serialization", () => {
    const project = generateProject(createSettings({ type: "chase", mood: "urgent", intensity: 5 }));
    const parsedProject = JSON.parse(serializeProject(project));

    expect(parsedProject.sections).toEqual(project.sections);
    expect(parsedProject.tracks).toEqual(project.tracks);
    expect(parsedProject.tracks[0]?.events).toEqual(project.tracks[0]?.events);
    expect(parsedProject.mix).toEqual(project.mix);
  });

  it("does not mutate the original project", () => {
    const project = generateProject(createSettings({ type: "menu_theme", mood: "hopeful", mode: "major", key: "C" }));
    const originalProject = structuredClone(project);

    serializeProject(project);

    expect(project).toEqual(originalProject);
  });

  it("does not inject obvious runtime-only keys into generated project output", () => {
    const project = generateProject(createSettings({ type: "dark_ambient", mood: "mysterious" }));
    const serializedProject = serializeProject(project);

    expect(serializedProject).not.toContain("playbackEngine");
    expect(serializedProject).not.toContain("transport");
    expect(serializedProject).not.toContain('"Tone"');
    expect(serializedProject).not.toContain("audioContext");
    expect(serializedProject).not.toContain("reactState");
  });

  it("keeps serialization source free of Tone, playback, app, ui, and browser-file imports", () => {
    const sourceFiles = readSerializationSourceFiles();
    const forbiddenPatterns = [
      /from\s+["']tone["']/,
      /from\s+["'][^"']*playback[^"']*["']/,
      /from\s+["'][^"']*app[^"']*["']/,
      /from\s+["'][^"']*ui[^"']*["']/,
      /from\s+["']react["']/,
      /\bBlob\b/,
      /\bURL\.createObjectURL\b/,
      /\bdocument\b/,
      /\bwindow\b/,
    ];

    for (const sourceFile of sourceFiles) {
      for (const forbiddenPattern of forbiddenPatterns) {
        expect(sourceFile).not.toMatch(forbiddenPattern);
      }
    }
  });
});
