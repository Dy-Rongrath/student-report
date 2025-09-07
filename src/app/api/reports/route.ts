import { NextResponse } from "next/server";
import { ReportDataSchema } from "@/domain/report/types";
import { randomUUID } from "crypto";
import { getUrl, readPaging, readSearch, readSort } from "@/lib/query";
import { ReportService } from "@/services/reportService";
import { json, jsonError } from "@/lib/http";

export async function GET(request: Request) {
  try {
    const url = getUrl(request);
    const { page, pageSize } = readPaging(url);
    const q = readSearch(url);
    const { sortField, sortDir } = readSort(url, ["id", "name", "term", "date", "percentage", "updatedAt"], "date");

  const { rows, total } = await ReportService.listSummaries({ q, sortField, sortDir, skip: page * pageSize, take: pageSize });
  return json({ rows, total });
  } catch {
    // On failure, return empty list but don't crash UI
    return json({ rows: [], total: 0 }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = ReportDataSchema.safeParse(json);
    if (!parsed.success) {
      return jsonError("Invalid payload", 400, { details: parsed.error.flatten() });
    }
    const d = parsed.data;
    const id = randomUUID();
  const created = await ReportService.createFromReportData(id, d);
    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch {
    return jsonError("Create failed", 500);
  }
}
