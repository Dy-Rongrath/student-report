import { ReportRepository, type ReportSummary } from "@/repositories/reportRepository";
import { StudentRepository } from "@/repositories/studentRepository";
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
    const student = await StudentRepository.upsertByName(data.student.name);
    return ReportRepository.create({
      id,
      name: data.student.name,
      term: data.term,
      date: data.date,
      percentage: data.percentage ?? null,
      data: JSON.stringify(data),
      studentId: student.id,
    });
  },

  async upsertFromReportData(id: string, data: ReportData) {
    const student = await StudentRepository.upsertByName(data.student.name);
    return ReportRepository.upsert(id, {
      name: data.student.name,
      term: data.term,
      date: data.date,
      percentage: data.percentage ?? null,
      data: JSON.stringify(data),
      studentId: student.id,
    });
  },

  async deleteById(id: string) {
    await ReportRepository.delete(id);
  },

  async listStudents(opts: { q?: string; skip: number; take: number; sortField: "lastUpdatedAt" | "name"; sortDir: "asc" | "desc" }) {
    const [total, rows] = await Promise.all([
      StudentRepository.countWithReports(opts.q),
      StudentRepository.listWithAggregates(opts),
    ]);
    return { rows, total } as { rows: Array<{ name: string; reportCount: number; lastUpdatedAt?: string; lastDate?: string }>; total: number };
  },

  async getStudentRecord(name: string, opts: { q?: string; skip: number; take: number; sortField: "date" | "updatedAt"; sortDir: "asc" | "desc" }) {
    // Resolve by Student to ensure we filter via FK for correctness (handles renames/merges)
    const student = await StudentRepository.findByName(name);
    if (!student) return { name, reports: [], total: 0 } as {
      name: string;
      total: number;
      reports: Array<{ id: string; term: string; date: string; percentage?: number; updatedAt?: string }>;
    };
    const [reports, total] = await Promise.all([
      ReportRepository.listReportsByStudentId(student.id, opts),
      ReportRepository.countReportsByStudentId(student.id, opts.q),
    ]);
    return { name, reports, total } as { name: string; total: number; reports: Array<{ id: string; term: string; date: string; percentage?: number; updatedAt?: string }> };
  },

  async renameStudent(oldName: string, newName: string) {
    if (!newName.trim()) throw new Error("New name is required");
    const old = await StudentRepository.findByName(oldName);
    const existingTarget = await StudentRepository.findByName(newName);
    if (existingTarget) {
      // Merge: point reports to target studentId and update name field; delete old student if present
      await ReportRepository.renameStudent(oldName, newName, existingTarget.id);
      if (old) await StudentRepository.deleteByName(oldName);
      return existingTarget;
    }
    // Regular rename: update reports' name and rename the student record
    await ReportRepository.renameStudent(oldName, newName, old?.id);
    await StudentRepository.rename(oldName, newName);
    return await StudentRepository.findByName(newName);
  },

  async deleteStudent(name: string) {
    await ReportRepository.deleteStudent(name);
    await StudentRepository.deleteByName(name);
  },
};
