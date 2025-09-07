import ClientReport from "@/app/reports/[id]/ClientReport";
import { headers } from "next/headers";

type ApiReport = {
  school: { name: string; logoUrl?: string };
  student: { id: string; name: string; className: string; session?: string };
  term: string;
  date: string;
  teacherName?: string;
  scores: Array<{ subject?: string; indicator?: string; score?: number }>;
  totalScore?: number;
  percentage?: number;
  comments?: string;
};

export const dynamic = "force-dynamic";

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");
  const url = host ? `${proto}://${host}/api/reports/${encodeURIComponent(id)}` : `/api/reports/${encodeURIComponent(id)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load report.</p>
      </div>
    );
  }
  const data = (await res.json()) as ApiReport;

  const student = {
    name: data.student?.name ?? "",
    grade: data.student?.className ?? "",
    classGroup: data.student?.className ?? "",
    date: new Date(data.date).toLocaleDateString(),
    teacher: data.teacherName ?? "",
    evaluationType: data.term ?? "",
  };
  const scores = (data.scores ?? []).map((s) => ({ indicator: s.indicator ?? s.subject ?? "", score: Number(s.score ?? 0) }));
  const comments = data.comments ?? "";

  return (
    <div className="p-4">
      <ClientReport student={student} scores={scores} comments={comments} />
    </div>
  );
}
