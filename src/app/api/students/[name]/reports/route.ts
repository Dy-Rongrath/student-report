import { json } from "@/lib/http";
import { getUrl, readPaging, readSort, readSearch } from "@/lib/query";
import { ReportService } from "@/server/services/reportService";

export async function GET(_request: Request, context: { params: Promise<{ name: string }> }) {
  const { name } = await context.params;
  try {
    const url = getUrl(_request);
    const { page, pageSize } = readPaging(url);
    const q = readSearch(url);
    const { sortField, sortDir } = readSort(url, ["date", "updatedAt"], "date");
    const { reports, total } = await ReportService.getStudentRecord(name, {
      q,
      skip: page * pageSize,
      take: pageSize,
      sortField: sortField as "date" | "updatedAt",
      sortDir,
    });
    return json({ rows: reports, total });
  } catch {
    return json({ rows: [], total: 0 }, { status: 200 });
  }
}
