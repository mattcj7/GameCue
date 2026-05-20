import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { generateProject } from "../../src/core/generation";
import type { CueSettings } from "../../src/core/model";
import { parseProjectJson, serializeProject } from "../../src/core/serialization";

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

describe("parseProjectJson", () => {
  it("parses valid serialized project JSON into the original plain data", () => {
    const project = generateProject(createSettings({ type: "suspense", mood: "creepy" }));

    expect(parseProjectJson(serializeProject(project))).toEqual(project);
  });

  it("throws for malformed JSON text", () => {
    expect(() => parseProjectJson('{"schemaVersion":')).toThrow(SyntaxError);
  });

  it("keeps serialization source free of Tone, playback, app, ui, and browser file APIs", () => {
    const sourceFiles = readSerializationSourceFiles();
    const forbiddenPatterns = [
      /from\s+["']tone["']/,
      /from\s+["'][^"']*playback[^"']*["']/,
      /from\s+["'][^"']*app[^"']*["']/,
      /from\s+["'][^"']*ui[^"']*["']/,
      /from\s+["']react["']/,
      /\bFileReader\b/,
      /\bFile\b/,
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
