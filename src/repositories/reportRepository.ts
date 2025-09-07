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
      },
      update: {
        name: input.name,
        term: input.term,
        date: new Date(input.date),
        percentage: input.percentage ?? null,
        data: input.data,
      },
    });
  },

  async delete(id: string) {
    await prisma.report.delete({ where: { id } }).catch(() => null);
  },

  // Student-centric queries (grouped by student name for now)
  async listStudents(opts: { q?: string; skip: number; take: number; sortField: "lastUpdatedAt" | "name"; sortDir: "asc" | "desc" }) {
    const { q, skip, take, sortField, sortDir } = opts;
    const where = q ? { name: { contains: q, mode: "insensitive" as const } } : undefined;
    const orderBy = sortField === "name" ? { name: sortDir } : { _max: { updatedAt: sortDir } };
  const groups = await prisma.report.groupBy({
      by: ["name"],
      where,
      _count: { _all: true },
      _max: { updatedAt: true, date: true },
      orderBy,
      skip,
      take,
    });
  return groups.map((g: { name: string; _count: { _all: number }; _max: { updatedAt: Date | null; date: Date | null } }) => ({
      name: g.name,
      reportCount: g._count._all,
      lastUpdatedAt: g._max.updatedAt?.toISOString?.(),
      lastDate: g._max.date?.toISOString?.(),
    })) as Array<{ name: string; reportCount: number; lastUpdatedAt?: string; lastDate?: string }>;
  },

  async countStudents(q?: string) {
    const where = q ? { name: { contains: q, mode: "insensitive" as const } } : undefined;
    // groupBy with count to compute number of distinct names
    const groups = await prisma.report.groupBy({ by: ["name"], where, _count: { _all: true } });
    return groups.length;
  },

  async listReportsByStudent(
    name: string,
    opts: { q?: string; skip: number; take: number; sortField: "date" | "updatedAt"; sortDir: "asc" | "desc" }
  ) {
    const { skip, take, sortField, sortDir, q } = opts;
    const where = q
      ? {
          AND: [
            { name },
            {
              OR: [
                { id: { contains: q } },
                { term: { contains: q, mode: "insensitive" as const } },
              ],
            },
          ],
        }
      : { name };
    const rows = await prisma.report.findMany({ where, orderBy: { [sortField]: sortDir }, skip, take });
  return rows.map((r: { id: string; term: string; date: Date; percentage: number | null; updatedAt: Date }) => ({
      id: r.id,
      term: r.term,
      date: r.date.toISOString(),
      percentage: r.percentage ?? undefined,
      updatedAt: r.updatedAt?.toISOString?.(),
    })) as Array<{ id: string; term: string; date: string; percentage?: number; updatedAt?: string }>;
  },
  async countReportsByStudent(name: string, q?: string) {
    const where = q
      ? {
          AND: [
            { name },
            {
              OR: [
                { id: { contains: q } },
                { term: { contains: q, mode: "insensitive" as const } },
              ],
            },
          ],
        }
      : { name };
    return prisma.report.count({ where });
  },
};
