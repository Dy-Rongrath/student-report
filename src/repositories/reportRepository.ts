import { prisma } from "@/lib/prisma";

export type ReportSummary = {
  id: string;
  name: string;
  term: string;
  date: string; // ISO
  percentage?: number;
  updatedAt?: string; // ISO
};

export type ReportCreate = {
  id: string;
  name: string;
  term: string;
  date: string; // ISO date
  percentage?: number | null;
  data: string; // JSON string
  studentId?: string | null;
};

export type ReportUpdate = Omit<ReportCreate, "id">;

export const ReportRepository = {
  async count(q?: string) {
    const where = q
      ? {
          OR: [
            { id: { contains: q } },
            { name: { contains: q, mode: "insensitive" as const } },
            { term: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : undefined;
    return prisma.report.count({ where });
  },

  async list(opts: { q?: string; sortField: string; sortDir: "asc" | "desc"; skip: number; take: number }) {
    const { q, sortField, sortDir, skip, take } = opts;
    const where = q
      ? {
          OR: [
            { id: { contains: q } },
            { name: { contains: q, mode: "insensitive" as const } },
            { term: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : undefined;
    const rows = await prisma.report.findMany({ where, orderBy: { [sortField]: sortDir }, skip, take });
    return rows.map((r: { id: string; name: string; term: string; date: Date; percentage?: number | null; updatedAt?: Date | null }) => ({
      id: r.id,
      name: r.name,
      term: r.term,
      date: r.date.toISOString(),
      percentage: r.percentage ?? undefined,
      updatedAt: r.updatedAt?.toISOString?.(),
    })) as ReportSummary[];
  },

  async get(id: string) {
    return prisma.report.findUnique({ where: { id } });
  },

  async create(input: ReportCreate) {
    return prisma.report.create({
      data: {
        id: input.id,
        name: input.name,
        term: input.term,
        date: new Date(input.date),
        percentage: input.percentage ?? null,
        data: input.data,
  studentId: input.studentId ?? null,
      },
      select: { id: true },
    });
  },

  async upsert(id: string, input: ReportUpdate) {
    return prisma.report.upsert({
      where: { id },
      create: {
        id,
        name: input.name,
        term: input.term,
        date: new Date(input.date),
        percentage: input.percentage ?? null,
        data: input.data,
        studentId: input.studentId ?? null,
      },
      update: {
        name: input.name,
        term: input.term,
        date: new Date(input.date),
        percentage: input.percentage ?? null,
        data: input.data,
        studentId: input.studentId,
      },
    });
  },

  async delete(id: string) {
    await prisma.report.delete({ where: { id } }).catch(() => null);
  },

  // Note: name-based student listing/counting removed in favor of StudentRepository and studentId-based queries.

  // StudentId-based versions (prefer these for correctness)
  async listReportsByStudentId(
    studentId: string,
    opts: { q?: string; skip: number; take: number; sortField: "date" | "updatedAt"; sortDir: "asc" | "desc" }
  ) {
    const { skip, take, sortField, sortDir, q } = opts;
    const where = q
      ? {
          AND: [
            { studentId },
            {
              OR: [
                { id: { contains: q } },
                { term: { contains: q, mode: "insensitive" as const } },
              ],
            },
          ],
        }
      : { studentId };
    const rows = await prisma.report.findMany({ where, orderBy: { [sortField]: sortDir }, skip, take });
    return rows.map((r: { id: string; term: string; date: Date; percentage: number | null; updatedAt: Date }) => ({
      id: r.id,
      term: r.term,
      date: r.date.toISOString(),
      percentage: r.percentage ?? undefined,
      updatedAt: r.updatedAt?.toISOString?.(),
    })) as Array<{ id: string; term: string; date: string; percentage?: number; updatedAt?: string }>;
  },
  async countReportsByStudentId(studentId: string, q?: string) {
    const where = q
      ? {
          AND: [
            { studentId },
            {
              OR: [
                { id: { contains: q } },
                { term: { contains: q, mode: "insensitive" as const } },
              ],
            },
          ],
        }
      : { studentId };
    return prisma.report.count({ where });
  },

  async renameStudent(oldName: string, newName: string, newStudentId?: string) {
    return prisma.report.updateMany({ where: { name: oldName }, data: { name: newName, studentId: newStudentId ?? undefined } });
  },

  async deleteStudent(name: string) {
    return prisma.report.deleteMany({ where: { name } });
  },
};
