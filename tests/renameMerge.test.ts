import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ReportService } from "@/server/services/reportService";

// We will mock repositories used by the service
import * as studentRepoMod from "@/server/repositories/studentRepository";
import * as reportRepoMod from "@/server/repositories/reportRepository";

describe("ReportService.renameStudent merge behavior", () => {
  let srFind: any;
  let srDelete: any;
  let srRename: any;
  let rrRename: any;

  beforeEach(() => {
    srFind = vi.spyOn(studentRepoMod.StudentRepository, "findByName");
    srDelete = vi.spyOn(studentRepoMod.StudentRepository, "deleteByName");
    srRename = vi.spyOn(studentRepoMod.StudentRepository, "rename");
    rrRename = vi.spyOn(reportRepoMod.ReportRepository, "renameStudent");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("merges when target exists: re-point reports and deletes old student", async () => {
    srFind
      .mockResolvedValueOnce({ id: "old-id", name: "Old" }) // old
      .mockResolvedValueOnce({ id: "target-id", name: "New" }); // target

    rrRename.mockResolvedValue({ count: 3 });
    srDelete.mockResolvedValue({});

    const result = await ReportService.renameStudent("Old", "New");

    expect(rrRename).toHaveBeenCalledWith("Old", "New", "target-id");
    expect(srDelete).toHaveBeenCalledWith("Old");
    expect(result).toEqual({ id: "target-id", name: "New" });
  });

  it("regular rename when target does not exist: updates reports and student record", async () => {
    srFind
      .mockResolvedValueOnce({ id: "old-id", name: "Old" }) // old
      .mockResolvedValueOnce(null); // target

    rrRename.mockResolvedValue({ count: 2 });
    srRename.mockResolvedValue({ id: "old-id", name: "New" });

    const result = await ReportService.renameStudent("Old", "New");

    expect(rrRename).toHaveBeenCalledWith("Old", "New", "old-id");
    expect(srRename).toHaveBeenCalledWith("Old", "New");
    expect(result).toEqual({ id: "old-id", name: "New" });
  });

  it("throws for empty new name", async () => {
    await expect(ReportService.renameStudent("A", " ")).rejects.toThrow("New name is required");
  });
});
