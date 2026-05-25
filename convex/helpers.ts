// hello
import type { ApiResult } from "../lib/types";

export function ok<T>(data: T): ApiResult<T> {
  return { success: true, data, error: null };
}

export function fail<T>(message: string, data: T): ApiResult<T> {
  return { success: false, data, error: message };
}

export function emptyOk(): ApiResult<null> {
  return { success: true, data: null, error: null };
}

export function toNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
