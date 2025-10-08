import { clsx, type ClassValue } from "clsx";

// Temporary workaround - remove tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
