import ClientReport from "@/components/ClientReport";
import { prisma } from "@/lib/prisma";

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
  const db = await prisma.report.findUnique({ where: { id } }).catch(() => null);
  if (!db) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load report.</p>
      </div>
    );
  }
  const data = JSON.parse(db.data) as ApiReport;

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
