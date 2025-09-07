import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { StudentRepository } from "@/server/repositories/studentRepository";

// We will mock the prisma client getter to stub underlying calls

describe("StudentRepository aggregates", () => {
  let getSpy: ReturnType<typeof vi.spyOn> | null = null;

  beforeEach(async () => {
    const prismaMod = await import("@/lib/prisma");
    getSpy = vi.spyOn(prismaMod as any, "prisma", "get");
  });

  afterEach(() => {
    getSpy?.mockRestore();
    vi.restoreAllMocks();
  });

  it("listWithAggregates(sort by lastUpdatedAt) maps raw rows to DTOs with ISO strings", async () => {
    const rows = [
      {
        name: "Alice",
        id: "s1",
        last_updated_at: new Date("2024-05-02T00:00:00.000Z"),
        last_date: new Date("2024-05-01T00:00:00.000Z"),
        report_count: BigInt(3),
      },
      {
        name: "Bob",
        id: "s2",
        last_updated_at: null,
        last_date: null,
        report_count: BigInt(1),
      },
    ];

    getSpy!.mockReturnValue({
      $queryRawUnsafe: vi.fn().mockResolvedValue(rows),
    } as any);

    const result = await StudentRepository.listWithAggregates({ q: undefined, skip: 0, take: 10, sortField: "lastUpdatedAt", sortDir: "desc" });
    expect(result).toEqual([
      {
        name: "Alice",
        reportCount: 3,
        lastUpdatedAt: rows[0].last_updated_at!.toISOString(),
        lastDate: rows[0].last_date!.toISOString(),
      },
      {
        name: "Bob",
        reportCount: 1,
        lastUpdatedAt: undefined,
        lastDate: undefined,
      },
    ]);
  });

  it("listWithAggregates(sort by name) joins student list with raw aggregates", async () => {
    const students = [
      { id: "s1", name: "Alice" },
      { id: "s2", name: "Bob" },
    ];
    const aggRows = [
      { id: "s1", report_count: BigInt(2), last_updated_at: new Date("2024-01-02T00:00:00.000Z"), last_date: new Date("2024-01-01T00:00:00.000Z") },
      { id: "s2", report_count: BigInt(0), last_updated_at: null, last_date: null },
    ];

    getSpy!.mockReturnValue({
      student: {
        findMany: vi.fn().mockResolvedValue(students),
      },
      $queryRawUnsafe: vi.fn().mockResolvedValue(aggRows),
    } as any);

    const result = await StudentRepository.listWithAggregates({ q: undefined, skip: 0, take: 10, sortField: "name", sortDir: "asc" });
    expect(result).toEqual([
      {
        name: "Alice",
        reportCount: 2,
        lastUpdatedAt: aggRows[0].last_updated_at!.toISOString(),
        lastDate: aggRows[0].last_date!.toISOString(),
      },
      {
        name: "Bob",
        reportCount: 0, // default to 0 when no aggregate
        lastUpdatedAt: undefined,
        lastDate: undefined,
      },
    ]);
  });

  it("countWithReports delegates to prisma.student.count with some()", async () => {
    const countFn = vi.fn().mockResolvedValue(5);
    getSpy!.mockReturnValue({
      student: { count: countFn },
    } as any);

    const total = await StudentRepository.countWithReports();
    expect(total).toBe(5);
    expect(countFn).toHaveBeenCalled();
  });
});
