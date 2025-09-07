import { NextResponse } from "next/server";
import { getUrl, readSearch, readSort } from "@/lib/query";
import { ReportRepository } from "@/server/repositories/reportRepository";
import { StudentRepository } from "@/server/repositories/studentRepository";

function toCsvValue(v: unknown) {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

export async function GET(_request: Request, context: { params: Promise<{ name: string }> }) {
  const { name } = await context.params;
  try {
    const url = getUrl(_request);
    const q = readSearch(url);
    const { sortField, sortDir } = readSort(url, ["date", "updatedAt"], "date");
    const limit = Math.min(5000, Math.max(1, Number(url.searchParams.get("limit") ?? 5000)));

    const student = await StudentRepository.findByName(name);
    if (!student) {
      const header = ["id", "term", "date", "percentage", "updatedAt"];
      return new NextResponse(header.join(",") + "\n", {
        headers: {
          "content-type": "text/csv; charset=utf-8",
          "content-disposition": `attachment; filename="${encodeURIComponent(name)}_reports.csv"`,
        },
      });
    }
  const rows = await ReportRepository.listReportsByStudentId(student.id, { q, sortField: sortField as "date" | "updatedAt", sortDir, skip: 0, take: limit });

    const header = ["id", "term", "date", "percentage", "updatedAt"];
    const lines = [header.join(",")];
    for (const r of rows) {
      lines.push([
        toCsvValue(r.id),
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
        "content-disposition": `attachment; filename="${encodeURIComponent(name)}_reports.csv"`,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Export failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
