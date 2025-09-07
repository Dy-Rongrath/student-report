import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReportDataSchema } from "@/domain/report/types";
import { randomUUID } from "crypto";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = Math.max(0, Number(url.searchParams.get("page") ?? 0));
    const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get("pageSize") ?? 10)));
    const q = (url.searchParams.get("q") ?? "").trim();
    const sortFieldParam = url.searchParams.get("sortField") ?? "date";
    const sortDirParam = (url.searchParams.get("sortDir") ?? "desc").toLowerCase() as "asc" | "desc";

  const allowedSort: Record<string, true> = { id: true, name: true, term: true, date: true, percentage: true, updatedAt: true };
    const sortField = allowedSort[sortFieldParam] ? sortFieldParam : "date";
    const sortDir: "asc" | "desc" = sortDirParam === "asc" ? "asc" : "desc";

    const where = q
      ? {
          OR: [
            { id: { contains: q } },
            { name: { contains: q, mode: "insensitive" as const } },
            { term: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    const [total, rows] = await Promise.all([
      prisma.report.count({ where }),
      prisma.report.findMany({
        where,
        orderBy: { [sortField]: sortDir },
        skip: page * pageSize,
        take: pageSize,
      }),
    ]);

    type Row = typeof rows[number];
    const summaries = rows.map((r: Row) => ({
      id: r.id,
      name: r.name,
      term: r.term,
      date: r.date.toISOString(),
      percentage: r.percentage ?? undefined,
      updatedAt: (r.updatedAt as Date).toISOString(),
    }));
    return NextResponse.json({ rows: summaries, total });
  } catch {
    // On failure, return empty list but don't crash UI
    return NextResponse.json({ rows: [], total: 0 }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = ReportDataSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
    }
    const d = parsed.data;
    const id = randomUUID();
    const created = await prisma.report.create({
      data: {
        id,
        name: d.student.name,
        term: d.term,
        date: new Date(d.date),
        percentage: d.percentage ?? null,
        data: JSON.stringify(d),
      },
      select: { id: true },
    });
    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "Create failed" }, { status: 500 });
  }
}
