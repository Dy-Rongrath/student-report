import { NextResponse } from "next/server";
import { ReportRepository } from "@/server/repositories/reportRepository";
import { getUrl, readSearch, readSort } from "@/lib/query";

function toCsvValue(v: unknown) {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

export async function GET(request: Request) {
  try {
  const url = getUrl(request);
  const q = readSearch(url);
  const { sortField, sortDir } = readSort(url, ["id", "name", "term", "date", "percentage", "updatedAt"], "date");
  const limit = Math.min(5000, Math.max(1, Number(url.searchParams.get("limit") ?? 5000)));

  const rows = await ReportRepository.list({ q, sortField, sortDir, skip: 0, take: limit });

  const header = ["id", "name", "term", "date", "percentage", "updatedAt"];
    const lines = [header.join(",")];
  for (const r of rows) {
      lines.push([
        toCsvValue(r.id),
        toCsvValue(r.name),
        toCsvValue(r.term),
    toCsvValue(r.date),
        toCsvValue(r.percentage ?? ""),
    toCsvValue(r.updatedAt ?? ""),
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
