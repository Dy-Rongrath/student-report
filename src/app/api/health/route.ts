import { prisma } from "@/lib/prisma";
import { json } from "@/lib/http";

export async function GET() {
  try {
    // cheap query to validate connectivity
    await prisma.$queryRaw`SELECT 1`;
  return json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "DB error";
  return json({ ok: false, error: msg }, { status: 503 });
  }
}
