"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Card, CardHeader, CardContent, Button, Box } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarDensitySelector, GridToolbarQuickFilter, GridFilterModel } from "@mui/x-data-grid";

type StudentRow = { name: string; reportCount: number; lastUpdatedAt?: string; lastDate?: string };

export default function StudentsPage() {
  const [items, setItems] = useState<StudentRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [], quickFilterValues: [] });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: "lastUpdatedAt", sort: "desc" }] as GridSortModel);
  const [query, setQuery] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    const sort = sortModel[0];
    const params = new URLSearchParams({
      page: String(paginationModel.page),
      pageSize: String(paginationModel.pageSize),
      q: query,
      sortField: sort?.field ?? "lastUpdatedAt",
      sortDir: (sort?.sort as "asc" | "desc" | undefined) ?? "desc",
    });
    const res = await fetch(`/api/students?${params.toString()}`, { cache: "no-store" });
    const data = (await res.json()) as { rows: StudentRow[]; total: number };
    setItems(data.rows);
    setTotal(data.total);
    setLoading(false);
  }, [paginationModel.page, paginationModel.pageSize, query, sortModel]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPaginationModel((m) => ({ ...m, page: 0 }));
      refresh();
    }, 300);
    return () => clearTimeout(t);
  }, [query, refresh]);

  const Toolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <Box sx={{ flex: 1 }} />
      <GridToolbarQuickFilter debounceMs={300} />
      <Box sx={{ ml: 1 }}>
        <Button onClick={refresh} variant="outlined" size="small">Refresh</Button>
      </Box>
    </GridToolbarContainer>
  );

  const columns: GridColDef<StudentRow>[] = [
    { field: "name", headerName: "Student", flex: 1, renderCell: (p) => (
      <Link href={`/students/${encodeURIComponent(String(p.value))}`}>{String(p.value)}</Link>
    ) },
    { field: "reportCount", headerName: "Reports", flex: 0.5, type: "number" },
    { field: "lastUpdatedAt", headerName: "Updated", flex: 0.8, renderCell: (p) => p.value ? new Date(String(p.value)).toLocaleString() : "-" },
    { field: "lastDate", headerName: "Last Date", flex: 0.8, renderCell: (p) => p.value ? new Date(String(p.value)).toLocaleDateString() : "-" },
  ];

  return (
    <Card>
      <CardHeader title="Students" subheader="Browse students and open their report history" action={<Button component={Link} href="/reports" variant="outlined">Go to Reports</Button>} />
      <CardContent>
        <DataGrid
          autoHeight
          disableRowSelectionOnClick
          density="compact"
          filterMode="server"
          rows={items}
          getRowId={(r) => r.name}
          columns={columns}
          loading={loading}
          slots={{ toolbar: Toolbar }}
          filterModel={filterModel}
          onFilterModelChange={(model) => {
            setFilterModel(model);
            const qv = (model.quickFilterValues ?? []).join(" ").trim();
            setQuery(qv);
          }}
          paginationMode="server"
          sortingMode="server"
          rowCount={total}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortingOrder={["desc", "asc"]}
          sortModel={sortModel}
          onSortModelChange={(m) => setSortModel(m.length ? m : [{ field: "lastUpdatedAt", sort: "desc" }])}
          pageSizeOptions={[5, 10, 25, 50]}
        />
      </CardContent>
    </Card>
  );
}
