import type { ReportData } from "@/app/reports/types";

const store = new Map<string, ReportData>();

export function saveReport(id: string, data: ReportData) {
  store.set(id, data);
}

export function getReport(id: string): ReportData | undefined {
  return store.get(id);
}

export function deleteReport(id: string): boolean {
  return store.delete(id);
}

export type ReportSummary = {
  id: string;
  name: string;
  term: string;
  date: string;
  percentage?: number;
};

export function listReports(): ReportSummary[] {
  const items: ReportSummary[] = [];
  for (const [id, data] of store.entries()) {
    items.push({
      id,
      name: data.student.name,
      term: data.term,
      date: data.date,
      percentage: data.percentage,
    });
  }
  // Newest first
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
