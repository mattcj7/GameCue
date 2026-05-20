export function parseProjectJson(projectText: string): unknown {
  return JSON.parse(projectText) as unknown;
}
