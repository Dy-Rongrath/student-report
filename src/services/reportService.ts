import { ReportRepository, type ReportSummary } from "@/repositories/reportRepository";
import type { ReportData } from "@/domain/report/types";

export type ListOptions = {
  q?: string;
  sortField: string;
  sortDir: "asc" | "desc";
  skip: number;
  take: number;
};

export const ReportService = {
  async listSummaries(opts: ListOptions): Promise<{ rows: ReportSummary[]; total: number }> {
    const [total, rows] = await Promise.all([
      ReportRepository.count(opts.q),
      ReportRepository.list(opts),
    ]);
    return { rows, total };
  },

  async getReportData(id: string): Promise<ReportData | null> {
    const db = await ReportRepository.get(id);
    if (!db) return null;
    return JSON.parse(db.data) as ReportData;
  },

  async createFromReportData(id: string, data: ReportData) {
    return ReportRepository.create({
      id,
      name: data.student.name,
      term: data.term,
      date: data.date,
      percentage: data.percentage ?? null,
      data: JSON.stringify(data),
    });
  },

  async upsertFromReportData(id: string, data: ReportData) {
    return ReportRepository.upsert(id, {
      name: data.student.name,
      term: data.term,
      date: data.date,
      percentage: data.percentage ?? null,
      data: JSON.stringify(data),
    });
  },

  async deleteById(id: string) {
    await ReportRepository.delete(id);
  },
};
