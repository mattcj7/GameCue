import type { GameCueProject } from "../../core/model";
import { serializeProject } from "../../core/serialization";

const projectFileExtension = ".gamecue.json";
const defaultProjectFileName = `gamecue-project${projectFileExtension}`;

export function createProjectFileName(project: GameCueProject): string {
  const safeTitle = project.title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (safeTitle.length === 0) {
    return defaultProjectFileName;
  }

  return `${safeTitle}${projectFileExtension}`;
}

export function downloadProjectFile(project: GameCueProject): string {
  const fileName = createProjectFileName(project);
  const serializedProject = serializeProject(project);
  const projectBlob = new Blob([serializedProject], {
    type: "application/json;charset=utf-8",
  });
  const objectUrl = URL.createObjectURL(projectBlob);
  const downloadLink = document.createElement("a");

  downloadLink.href = objectUrl;
  downloadLink.download = fileName;
  downloadLink.style.display = "none";

  document.body.append(downloadLink);

  try {
    downloadLink.click();
  } finally {
    downloadLink.remove();
    URL.revokeObjectURL(objectUrl);
  }
  return fileName;
}
