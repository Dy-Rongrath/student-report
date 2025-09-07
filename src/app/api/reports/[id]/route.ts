import { NextResponse } from "next/server";
import { ReportDataSchema } from "@/domain/report/types";
import { ReportService } from "@/services/reportService";
import { json, jsonError } from "@/lib/http";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
  const data = await ReportService.getReportData(id);
  if (data) return json(data);
  return jsonError("Not found", 404);
  } catch {
  return jsonError("Failed to load", 500);
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const json = await request.json();
  const parsed = ReportDataSchema.safeParse(json);
  if (!parsed.success) {
    return jsonError("Invalid payload", 400, { details: parsed.error.flatten() });
  }
  const d = parsed.data;
  try {
  await ReportService.upsertFromReportData(id, d);
    return NextResponse.json({ ok: true });
  } catch {
    // Provide a helpful message when the table hasn't been created yet
    return jsonError(
      "Database table missing. Apply migrations with a direct DB connection: set DIRECT_URL in .env and run `npx prisma generate && npm run prisma:deploy`, or apply prisma/migrations/*/migration.sql in your DB console.",
      503
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await ReportService.deleteById(id);
  return json({ ok: true });
}
