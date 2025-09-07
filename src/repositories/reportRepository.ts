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
    return rows.map((r) => ({
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
};
