import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ActionResult = "success" | "error" | "info";

export type ActionState = {
  result?: ActionResult;
  message?: string;
  details?: unknown;
};

export const success = (message = "done") =>
  ({
    result: "success",
    message,
  }) as ActionState;

export const error = (message = "error", details?: unknown) =>
  ({
    result: "error",
    message,
    details,
  }) as ActionState;

export const noChanges = (message = "noChanges") =>
  ({
    result: "info",
    message,
  }) as ActionState;
