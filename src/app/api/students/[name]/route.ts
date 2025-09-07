import { json, jsonError } from "@/lib/http";
import { ReportService } from "@/services/reportService";

export async function PATCH(request: Request, context: { params: Promise<{ name: string }> }) {
  const { name } = await context.params;
  const body = await request.json().catch(() => ({})) as { newName?: string };
  const newName = String(body?.newName ?? "").trim();
  if (!newName) return jsonError("newName is required", 400);
  await ReportService.renameStudent(name, newName);
  return json({ ok: true });
}

export async function DELETE(_request: Request, context: { params: Promise<{ name: string }> }) {
  const { name } = await context.params;
  await ReportService.deleteStudent(name);
  return json({ ok: true });
}
