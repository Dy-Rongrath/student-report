import { describe, it, expect } from "vitest";
import { json, jsonError } from "@/lib/http";

describe("http utils", () => {
  it("json returns NextResponse-like object", () => {
    const res = json({ ok: true });
    expect(res.status).toBe(200);
  });

  it("jsonError wraps message and status", () => {
    const res = jsonError("bad", 422);
    expect(res.status).toBe(422);
  });
});
