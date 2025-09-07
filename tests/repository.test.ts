import { describe, it, expect, vi } from "vitest";
import * as repoMod from "@/repositories/reportRepository";

describe("ReportRepository mapping", () => {
  it("maps list rows to DTO with ISO strings", async () => {
    const date = new Date("2024-01-01T00:00:00.000Z");
    const updatedAt = new Date("2024-01-02T00:00:00.000Z");

  // Mock prisma client getter to avoid DB access
  const prismaMod = await import("@/lib/prisma");
  const spy = vi.spyOn(prismaMod as any, "prisma", "get");
  spy.mockReturnValue({
      report: {
        findMany: vi.fn().mockResolvedValue([
          { id: "a", name: "n", term: "t", date, percentage: 80, updatedAt },
        ]),
      },
    } as any);

    const rows = await repoMod.ReportRepository.list({ q: undefined, sortField: "date", sortDir: "desc", skip: 0, take: 10 });
    expect(rows[0].date).toBe(date.toISOString());
    expect(rows[0].updatedAt).toBe(updatedAt.toISOString());

  spy.mockRestore();
  });
});
