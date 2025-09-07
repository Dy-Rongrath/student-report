import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ReportService } from "@/services/reportService";
import * as studentRepoMod from "@/repositories/studentRepository";
import * as reportRepoMod from "@/repositories/reportRepository";

describe("ReportService.getStudentRecord", () => {
  let srFind: any;
  let rrListById: any;
  let rrCountById: any;

  beforeEach(() => {
    srFind = vi.spyOn(studentRepoMod.StudentRepository, "findByName");
    rrListById = vi.spyOn(reportRepoMod.ReportRepository, "listReportsByStudentId");
    rrCountById = vi.spyOn(reportRepoMod.ReportRepository, "countReportsByStudentId");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns empty when student not found", async () => {
    srFind.mockResolvedValue(null);
    const res = await ReportService.getStudentRecord("Ghost", { q: undefined, skip: 0, take: 10, sortField: "date", sortDir: "desc" });
    expect(res).toEqual({ name: "Ghost", reports: [], total: 0 });
    expect(rrListById).not.toHaveBeenCalled();
  });

  it("returns mapped reports when student found", async () => {
    srFind.mockResolvedValue({ id: "s1", name: "Alice" });
    rrListById.mockResolvedValue([
      { id: "r1", term: "T1", date: "2024-01-01T00:00:00.000Z", percentage: 90, updatedAt: "2024-01-02T00:00:00.000Z" },
    ]);
    rrCountById.mockResolvedValue(1);

    const res = await ReportService.getStudentRecord("Alice", { q: undefined, skip: 0, take: 10, sortField: "date", sortDir: "desc" });
    expect(res.name).toBe("Alice");
    expect(res.total).toBe(1);
    expect(res.reports[0].id).toBe("r1");
  });
});
