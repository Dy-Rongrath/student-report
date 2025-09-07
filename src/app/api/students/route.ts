import { json } from "@/lib/http";
import { getUrl, readPaging, readSearch, readSort } from "@/lib/query";
import { ReportService } from "@/services/reportService";

export async function GET(request: Request) {
  try {
    const url = getUrl(request);
    const { page, pageSize } = readPaging(url);
    const q = readSearch(url);
    const { sortField, sortDir } = readSort(url, ["name", "lastUpdatedAt"], "lastUpdatedAt");
    const { rows, total } = await ReportService.listStudents({ q, skip: page * pageSize, take: pageSize, sortField: sortField as "name" | "lastUpdatedAt", sortDir });
    return json({ rows, total });
  } catch {
    return json({ rows: [], total: 0 }, { status: 200 });
  }
}
