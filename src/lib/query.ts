export type SortDir = "asc" | "desc";

export interface PagingParams {
  page: number;
  pageSize: number;
}

export interface SortParams {
  sortField: string;
  sortDir: SortDir;
}

export function getUrl(request: Request) {
  return new URL(request.url);
}

export function readPaging(url: URL, defaults: PagingParams = { page: 0, pageSize: 10 }): PagingParams {
  const page = Math.max(0, Number(url.searchParams.get("page") ?? defaults.page));
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get("pageSize") ?? defaults.pageSize)));
  return { page, pageSize };
}

export function readSearch(url: URL): string {
  return (url.searchParams.get("q") ?? "").trim();
}

export function readSort(url: URL, allowed: string[], fallback: string): SortParams {
  const sortFieldParam = url.searchParams.get("sortField") ?? fallback;
  const sortDirParam = (url.searchParams.get("sortDir") ?? "desc").toLowerCase() as SortDir;
  const sortField = allowed.includes(sortFieldParam) ? sortFieldParam : fallback;
  const sortDir: SortDir = sortDirParam === "asc" ? "asc" : "desc";
  return { sortField, sortDir };
}
