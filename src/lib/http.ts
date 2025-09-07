import { NextResponse } from "next/server";
import type { ZodSchema } from "zod";

export function json<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data as unknown as Record<string, unknown>, init);
}

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return json(data, { status: 200, ...init });
}

export function jsonError(message: string, status = 400, extra?: Record<string, unknown>) {
  return json({ ok: false, error: message, ...(extra ?? {}) }, { status });
}

export async function parseJson<T>(request: Request): Promise<T> {
  return (await request.json()) as T;
}

export async function parseAndValidate<T>(request: Request, schema: ZodSchema<T>) {
  const body = await parseJson<unknown>(request);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Invalid payload", parsed.error.flatten());
  }
  return parsed.data as T;
}

export class ValidationError extends Error {
  details?: unknown;
  constructor(message: string, details?: unknown) {
    super(message);
    this.name = "ValidationError";
    this.details = details;
  }
}
