import { prisma } from "@/lib/prisma";

export const StudentRepository = {
  async findByName(name: string) {
    return prisma.student.findUnique({ where: { name } }).catch(() => null);
  },
  async create(name: string) {
    return prisma.student.create({ data: { name } });
  },
  async upsertByName(name: string) {
    return prisma.student.upsert({ where: { name }, update: {}, create: { name } });
  },
  async deleteByName(name: string) {
    return prisma.student.delete({ where: { name } }).catch(() => null);
  },
  async rename(oldName: string, newName: string) {
    // If target exists, just delete old and re-point reports in service layer
    return prisma.student.update({ where: { name: oldName }, data: { name: newName } }).catch(() => null);
  },

  async countWithReports(q?: string) {
    const where = {
      AND: [
        q ? { name: { contains: q, mode: "insensitive" as const } } : {},
        { reports: { some: {} } },
      ],
    };
    return prisma.student.count({ where });
  },

  async listWithAggregates(opts: { q?: string; skip: number; take: number; sortField: "name" | "lastUpdatedAt"; sortDir: "asc" | "desc" }) {
    const { q, skip, take, sortField, sortDir } = opts;
    const pattern = q ? `%${q}%` : "";
    if (sortField === "lastUpdatedAt") {
      // Use raw SQL to get students ordered by latest report.updatedAt
      type Row = { name: string; id: string; last_updated_at: Date | null; last_date: Date | null; report_count: bigint };
      const rows = (await prisma.$queryRawUnsafe(
        `SELECT s.name, r."studentId" AS id,
                MAX(r."updatedAt") AS last_updated_at,
                MAX(r."date") AS last_date,
                COUNT(*) AS report_count
         FROM "Report" r
         JOIN "Student" s ON s.id = r."studentId"
         WHERE ($1 = '' OR s.name ILIKE $1)
         GROUP BY s.name, r."studentId"
         ORDER BY last_updated_at ${sortDir === "asc" ? "ASC" : "DESC"}
         OFFSET $2 LIMIT $3`,
        pattern, skip, take
      )) as unknown as Row[];
      return rows.map((r: Row) => ({
        name: r.name,
        reportCount: Number(r.report_count),
        lastUpdatedAt: r.last_updated_at ? r.last_updated_at.toISOString() : undefined,
        lastDate: r.last_date ? r.last_date.toISOString() : undefined,
      }));
    }
    // Sort by name using Student table, then aggregate via raw for efficiency
    const students = await prisma.student.findMany({
      where: { AND: [q ? { name: { contains: q, mode: "insensitive" } } : {}, { reports: { some: {} } }] },
      orderBy: { name: sortDir },
      skip,
      take,
      select: { id: true, name: true },
    });
    if (students.length === 0) return [] as Array<{ name: string; reportCount: number; lastUpdatedAt?: string; lastDate?: string }>;
    const ids = students.map((s: { id: string; name: string }) => s.id);
    type Agg = { id: string; report_count: bigint; last_updated_at: Date | null; last_date: Date | null };
    const agg = (await prisma.$queryRawUnsafe(
      `SELECT r."studentId" AS id,
              COUNT(*) AS report_count,
              MAX(r."updatedAt") AS last_updated_at,
              MAX(r."date") AS last_date
       FROM "Report" r
       WHERE r."studentId" = ANY($1)
       GROUP BY r."studentId"`,
      ids
    )) as unknown as Agg[];
    const byId = new Map(agg.map((a: Agg) => [a.id, a] as const));
    return students.map((s: { id: string; name: string }) => {
      const a = byId.get(s.id) as Agg | undefined;
      return {
        name: s.name,
        reportCount: a ? Number(a.report_count) : 0,
        lastUpdatedAt: a?.last_updated_at ? a.last_updated_at.toISOString() : undefined,
        lastDate: a?.last_date ? a.last_date.toISOString() : undefined,
      };
    });
  },
};
