"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Box, Button, Chip, Snackbar, Alert, Stack, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridFilterModel, GridPaginationModel, GridRenderCellParams, GridSortModel, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarQuickFilter } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { IconButton } from "@mui/material";

type Row = { id: string; term: string; date: string; updatedAt?: string; percentage?: number };

export function ClientStudentReports({ name }: { name: string }) {
  const [items, setItems] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [], quickFilterValues: [] });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: "date", sort: "desc" }] as GridSortModel);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error"; linkId?: string | null }>({ open: false, message: "", severity: "success", linkId: null });

  const refresh = useCallback(async () => {
    setLoading(true);
    const sort = sortModel[0];
    const params = new URLSearchParams({
      page: String(paginationModel.page),
      pageSize: String(paginationModel.pageSize),
      q: (filterModel.quickFilterValues ?? []).join(" ").trim(),
      sortField: sort?.field ?? "date",
      sortDir: (sort?.sort as "asc" | "desc" | undefined) ?? "desc",
    });
    const res = await fetch(`/api/students/${encodeURIComponent(name)}/reports?${params.toString()}`, { cache: "no-store" });
    const data = (await res.json()) as { rows: Row[]; total: number };
    setItems(data.rows);
    setTotal(data.total);
    setLoading(false);
  }, [filterModel.quickFilterValues, name, paginationModel.page, paginationModel.pageSize, sortModel]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    const t = setTimeout(() => { setPaginationModel((m) => ({ ...m, page: 0 })); refresh(); }, 250);
    return () => clearTimeout(t);
  }, [filterModel.quickFilterValues, refresh]);

  const copyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setSnack({ open: true, message: "ID copied", severity: "success" });
    } catch {
      setSnack({ open: true, message: "Copy failed", severity: "error" });
    }
  };

  const timeAgo = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso).getTime();
    const diff = Math.max(0, Math.floor((Date.now() - d) / 1000));
    const minute = 60, hour = 60 * minute, day = 24 * hour, week = 7 * day, month = Math.floor(365.25 * day / 12), year = 365.25 * day;
    const choose = (value: number, unit: Intl.RelativeTimeFormatUnit) => new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }).format(-value, unit);
    if (diff < minute) return choose(diff, "second");
    if (diff < hour) return choose(Math.floor(diff / minute), "minute");
    if (diff < day) return choose(Math.floor(diff / hour), "hour");
    if (diff < week) return choose(Math.floor(diff / day), "day");
    if (diff < month) return choose(Math.floor(diff / week), "week");
    if (diff < year) return choose(Math.floor(diff / month), "month");
    return choose(Math.floor(diff / year), "year");
  };

  const onExport = () => {
    const sort = sortModel[0];
    const params = new URLSearchParams({
      q: (filterModel.quickFilterValues ?? []).join(" ").trim(),
      sortField: (sort?.field as "date" | "updatedAt" | undefined) ?? "date",
      sortDir: (sort?.sort as "asc" | "desc" | undefined) ?? "desc",
      limit: "5000",
    });
    window.open(`/api/students/${encodeURIComponent(name)}/reports/export?${params.toString()}`, "_blank");
  };

  const onNewMonth = async (id: string) => {
    try {
      const res = await fetch(`/api/reports/${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error(`Load failed: ${res.status}`);
      const data = await res.json();
      const baseDate = new Date(data?.date ?? Date.now());
      const nextDate = new Date(baseDate);
      nextDate.setMonth(nextDate.getMonth() + 1);
      const incTerm = (() => {
        const m = /term\s*(\d+)/i.exec(String(data?.term ?? ""));
        if (m) {
          const n = Number(m[1]);
          if (Number.isFinite(n)) return String(data.term).replace(m[0], `Term ${n + 1}`);
        }
        return String(data?.term ?? "");
      })();
      const scores = Array.isArray(data?.scores)
        ? (data.scores as Array<{ indicator?: string; subject?: string }>).map((r) => ({ subject: String(r.subject ?? r.indicator ?? ""), indicator: String(r.indicator ?? r.subject ?? ""), score: 0 }))
        : [];
      const payload = {
        school: data?.school ?? { name: "Mekun Academy", logoUrl: "/logo_mekun_academy.png" },
        student: { id: "", name: String(data?.student?.name ?? name), className: String(data?.student?.className ?? ""), session: String(data?.student?.session ?? "") },
        term: incTerm,
        date: nextDate.toISOString(),
        teacherName: String(data?.teacherName ?? ""),
        scores,
        totalScore: 0,
        percentage: 0,
        comments: "",
      };
      const save = await fetch(`/api/reports`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!save.ok) throw new Error(`Save failed: ${save.status}`);
  const j = (await save.json().catch(() => ({}))) as { id?: string };
  setSnack({ open: true, message: j?.id ? `Created new month as ${j.id}` : `Created new month`, severity: "success", linkId: j?.id ?? null });
      await refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "New Month failed";
      setSnack({ open: true, message: msg, severity: "error", linkId: null });
    }
  };

  const onDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/reports/${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error(`Load failed: ${res.status}`);
      const data = await res.json();
      const save = await fetch(`/api/reports`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!save.ok) throw new Error(`Save failed: ${save.status}`);
      const j = (await save.json().catch(() => ({}))) as { id?: string };
      setSnack({ open: true, message: j?.id ? `Duplicated as ${j.id}` : `Duplicated`, severity: "success", linkId: j?.id ?? null });
      await refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Duplicate failed";
      setSnack({ open: true, message: msg, severity: "error", linkId: null });
    }
  };

  // Persist state per-student
  useEffect(() => {
    try {
      const s = localStorage.getItem(`student:${name}:sortModel`);
      const p = localStorage.getItem(`student:${name}:paginationModel`);
      const f = localStorage.getItem(`student:${name}:quickFilter`);
      if (s) {
        const parsed = JSON.parse(s) as GridSortModel;
        if (Array.isArray(parsed) && parsed.length) setSortModel(parsed);
      }
      if (p) {
        const parsed = JSON.parse(p) as GridPaginationModel;
        if (typeof parsed?.page === "number" && typeof parsed?.pageSize === "number") setPaginationModel(parsed);
      }
      if (f) {
        const values = JSON.parse(f) as string[];
        if (Array.isArray(values)) setFilterModel({ items: [], quickFilterValues: values });
      }
    } catch {}
  }, [name]);
  useEffect(() => { try { localStorage.setItem(`student:${name}:sortModel`, JSON.stringify(sortModel)); } catch {} }, [name, sortModel]);
  useEffect(() => { try { localStorage.setItem(`student:${name}:paginationModel`, JSON.stringify(paginationModel)); } catch {} }, [name, paginationModel]);
  useEffect(() => { try { localStorage.setItem(`student:${name}:quickFilter`, JSON.stringify(filterModel.quickFilterValues ?? [])); } catch {} }, [name, filterModel]);

  const Toolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <Box sx={{ flex: 1 }} />
      <GridToolbarQuickFilter debounceMs={300} />
      <Box sx={{ ml: 1 }}>
        <Button onClick={refresh} variant="outlined" size="small">Refresh</Button>
      </Box>
      <Box sx={{ ml: 1 }}>
        <Button onClick={onExport} variant="outlined" size="small">Export CSV</Button>
      </Box>
      <Box sx={{ ml: 1 }}>
        <Button component={Link} href={`/reports/create?student=${encodeURIComponent(name)}`} variant="contained" size="small">Create report</Button>
      </Box>
    </GridToolbarContainer>
  );

  const columns: GridColDef<Row>[] = [
    { field: "id", headerName: "ID", flex: 0.6, renderCell: (p) => (
      <Tooltip title="Copy ID">
        <Typography fontFamily="monospace" sx={{ cursor: "pointer" }} onClick={() => copyId(String(p.value))}>{String(p.value)}</Typography>
      </Tooltip>
    ) },
    { field: "term", headerName: "Term", flex: 0.8 },
    { field: "updatedAt", headerName: "Updated", flex: 0.8, renderCell: (p) => p.value ? (
      <Tooltip title={new Date(String(p.value)).toLocaleString()}>
        <span>{timeAgo(String(p.value))}</span>
      </Tooltip>
    ) : <span>-</span> },
    { field: "date", headerName: "Date", flex: 0.8, renderCell: (p) => new Date(String(p.value)).toLocaleDateString() },
    { field: "percentage", headerName: "%", flex: 0.5, type: "number", renderCell: (p) => {
      const v = typeof p.value === "number" ? p.value : null;
      if (v === null) return <Typography color="text.secondary">-</Typography>;
      const color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" = v >= 80 ? "success" : v >= 50 ? "warning" : "error";
      return <Chip size="small" color={color} label={`${v.toFixed(1)}%`} />;
    } },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      flex: 0.6,
      renderCell: (params: GridRenderCellParams<Row>) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ width: "100%" }}>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" component={Link} href={`/reports/create?id=${encodeURIComponent(params.row.id)}`} aria-label="edit">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View">
            <IconButton size="small" component={Link} href={`/reports/${encodeURIComponent(params.row.id)}`} aria-label="view">
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Duplicate">
            <IconButton size="small" onClick={() => onDuplicate(params.row.id)} aria-label="duplicate">
              <FileCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="New Month">
            <IconButton size="small" onClick={() => onNewMonth(params.row.id)} aria-label="new-month">
              <CalendarMonthIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Copy ID">
            <IconButton size="small" onClick={() => copyId(params.row.id)} aria-label="copy-id">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <DataGrid
        autoHeight
        disableRowSelectionOnClick
        density="compact"
        filterMode="server"
        rows={items}
        getRowId={(r) => r.id}
        columns={columns}
        loading={loading}
        slots={{ toolbar: Toolbar }}
        filterModel={filterModel}
        onFilterModelChange={(model) => setFilterModel(model)}
        paginationMode="server"
        sortingMode="server"
        rowCount={total}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortingOrder={["desc", "asc"]}
        sortModel={sortModel}
        onSortModelChange={(m) => setSortModel(m.length ? m : [{ field: "date", sort: "desc" }])}
        pageSizeOptions={[5, 10, 25, 50]}
      />

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack((s) => ({ ...s, open: false }))} action={snack.linkId ? <Button color="inherit" size="small" component={Link} href={`/reports/${encodeURIComponent(snack.linkId)}`}>Open</Button> : undefined}>
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}
