import type { ValidationError } from "../../core/serialization";

export async function readProjectFileText(file: File): Promise<string> {
  return file.text();
}

export function formatValidationError(error: ValidationError): string {
  return `${error.path}: ${error.message}`;
}
