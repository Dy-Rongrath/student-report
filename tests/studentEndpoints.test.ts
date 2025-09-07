import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as reportServiceMod from "@/services/reportService";
import * as reportRepoMod from "@/repositories/reportRepository";
import * as studentRepoMod from "@/repositories/studentRepository";
import { GET as listReports } from "@/app/api/students/[name]/reports/route";
import { GET as exportReports } from "@/app/api/students/[name]/reports/export/route";

// Helper to build a Request with query
const buildReq = (path: string) => new Request(`http://local${path}`);

describe("/api/students/[name] endpoints", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("lists per-student reports via service using studentId", async () => {
    const spy = vi.spyOn(reportServiceMod.ReportService, "getStudentRecord").mockResolvedValue({
      name: "Alice",
      total: 1,
      reports: [{ id: "r1", term: "T1", date: "2024-01-01T00:00:00.000Z", percentage: 90, updatedAt: "2024-01-02T00:00:00.000Z" }],
    });

    const res = await listReports(buildReq("/api/students/Alice/reports?page=0&pageSize=50&sortField=date&sortDir=desc"), { params: Promise.resolve({ name: "Alice" }) });
    const json = await (res as Response).json();
    expect(json.total).toBe(1);
    expect(json.rows[0].id).toBe("r1");
    expect(spy).toHaveBeenCalled();
  });

  it("exports CSV using studentId and returns header only when student not found", async () => {
    vi.spyOn(studentRepoMod.StudentRepository, "findByName").mockResolvedValue(null);

    const res = await exportReports(buildReq("/api/students/Ghost/reports/export?limit=10&sortField=date&sortDir=desc"), { params: Promise.resolve({ name: "Ghost" }) });
    const text = await (res as Response).text();
    expect(text.trim()).toBe("id,term,date,percentage,updatedAt");

    // Now with found student and rows
    vi.spyOn(studentRepoMod.StudentRepository, "findByName").mockResolvedValue({ id: "s1", name: "Alice" } as any);
    vi.spyOn(reportRepoMod.ReportRepository, "listReportsByStudentId").mockResolvedValue([
      { id: "r1", term: "T1", date: "2024-01-01T00:00:00.000Z", percentage: 90, updatedAt: "2024-01-02T00:00:00.000Z" },
    ]);

    const res2 = await exportReports(buildReq("/api/students/Alice/reports/export?limit=10&sortField=date&sortDir=desc"), { params: Promise.resolve({ name: "Alice" }) });
    const csv = await (res2 as Response).text();
    const lines = csv.trim().split("\n");
    expect(lines[0]).toBe("id,term,date,percentage,updatedAt");
    expect(lines[1]).toContain("r1");
  });
});
