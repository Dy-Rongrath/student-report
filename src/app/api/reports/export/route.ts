import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function toCsvValue(v: unknown) {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") ?? "").trim();
    const sortFieldParam = url.searchParams.get("sortField") ?? "date";
    const sortDirParam = (url.searchParams.get("sortDir") ?? "desc").toLowerCase() as "asc" | "desc";
    const limit = Math.min(5000, Math.max(1, Number(url.searchParams.get("limit") ?? 5000)));

    const allowedSort: Record<string, true> = { id: true, name: true, term: true, date: true, percentage: true };
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

    const rows = await prisma.report.findMany({
      where,
      orderBy: { [sortField]: sortDir },
      take: limit,
    });

    const header = ["id", "name", "term", "date", "percentage"];
    const lines = [header.join(",")];
    for (const r of rows) {
      lines.push([
        toCsvValue(r.id),
        toCsvValue(r.name),
        toCsvValue(r.term),
        toCsvValue(r.date.toISOString()),
        toCsvValue(r.percentage ?? ""),
      ].join(","));
    }
    const body = lines.join("\n");
    return new NextResponse(body, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="reports_export.csv"`,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Export failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
