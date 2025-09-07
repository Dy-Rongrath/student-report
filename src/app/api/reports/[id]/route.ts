import { NextResponse } from "next/server";
import { ReportDataSchema } from "@/domain/report/types";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const db = await prisma.report.findUnique({ where: { id } });
    if (db) return NextResponse.json(JSON.parse(db.data));
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const json = await request.json();
  const parsed = ReportDataSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;
  try {
    await prisma.report.upsert({
      where: { id },
      create: {
        id,
        name: d.student.name,
        term: d.term,
        date: new Date(d.date),
        percentage: d.percentage ?? null,
        data: JSON.stringify(d),
      },
      update: {
        name: d.student.name,
        term: d.term,
        date: new Date(d.date),
        percentage: d.percentage ?? null,
        data: JSON.stringify(d),
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    // Provide a helpful message when the table hasn't been created yet
    return NextResponse.json(
      {
        ok: false,
        error:
          "Database table missing. Apply migrations with a direct DB connection: set DIRECT_URL in .env and run `npx prisma generate && npm run prisma:deploy`, or apply prisma/migrations/*/migration.sql in your DB console.",
      },
      { status: 503 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await prisma.report.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
