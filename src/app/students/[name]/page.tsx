import Link from "next/link";
import { ReportService } from "@/services/reportService";
import { Card, CardHeader, CardContent } from "@mui/material";
import { ClientStudentReports } from "./ClientStudentReports";

export const dynamic = "force-dynamic";

export default async function StudentDetailPage({ params, searchParams }: { params: Promise<{ name: string }>; searchParams: Promise<{ q?: string; page?: string; pageSize?: string; sort?: "date" | "updatedAt"; dir?: "asc" | "desc" }> }) {
  const { name } = await params;
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const page = Math.max(0, Number(sp.page ?? 0));
  const pageSize = Math.min(50, Math.max(5, Number(sp.pageSize ?? 10)));
  const sortField = (sp.sort ?? "date") as "date" | "updatedAt";
  const sortDir = (sp.dir ?? "desc") as "asc" | "desc";

  const { total } = await ReportService.getStudentRecord(name, { q, skip: page * pageSize, take: pageSize, sortField, sortDir });

  return (
    <Card>
      <CardHeader title={`Student: ${name}`} subheader={`Total reports: ${total}`} action={<Link href={`/reports/create?student=${encodeURIComponent(name)}`}>Create new report</Link>} />
      <CardContent>
        <ClientStudentReports name={name} />
      </CardContent>
    </Card>
  );
}
