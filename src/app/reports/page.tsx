"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent, Button, Stack, Typography, IconButton, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Box, Tooltip, Chip, Skeleton } from "@mui/material";
import { useRouter } from "next/navigation";
import { DataGrid, GridColDef, GridRenderCellParams, GridPaginationModel, GridSortModel, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarDensitySelector, GridToolbarQuickFilter, GridFilterModel, GridColumnVisibilityModel } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

type Summary = {
  id: string;
  name: string;
  term: string;
  date: string;
  percentage?: number;
  updatedAt?: string;
};

export default function ReportsIndexPage() {
  const router = useRouter();
  const mounted = useRef(false);
  const [isMounted, setIsMounted] = useState(false);
  const [items, setItems] = useState<Summary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [], quickFilterValues: [] });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: "updatedAt", sort: "desc" }] as GridSortModel);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [duplicateId, setDuplicateId] = useState<string | null>(null);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({ date: false });

  const refresh = useCallback(async () => {
    setLoading(true);
    const sort = sortModel[0];
    const params = new URLSearchParams({
      page: String(paginationModel.page),
      pageSize: String(paginationModel.pageSize),
      q: query,
      sortField: sort?.field ?? "date",
      sortDir: (sort?.sort as "asc" | "desc" | undefined) ?? "desc",
    });
    const res = await fetch(`/api/reports?${params.toString()}`, { cache: "no-store" });
    const data = (await res.json()) as { rows: Summary[]; total: number };
    setItems(data.rows);
    setTotal(data.total);
    setLoading(false);
  }, [paginationModel.page, paginationModel.pageSize, query, sortModel]);

  useEffect(() => {
    mounted.current = true;
  setIsMounted(true);
    return () => {
      mounted.current = false;
    };
  }, []);

  // Persist sort & pagination (client only)
  useEffect(() => {
    try {
      const s = localStorage.getItem("reports:sortModel");
      const p = localStorage.getItem("reports:paginationModel");
      const f = localStorage.getItem("reports:quickFilter");
      const cv = localStorage.getItem("reports:columnVisibility");
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
        if (Array.isArray(values)) {
          setFilterModel({ items: [], quickFilterValues: values });
          setQuery(values.join(" ").trim());
        }
      }
      if (cv) {
        const parsed = JSON.parse(cv) as GridColumnVisibilityModel;
        if (parsed && typeof parsed === "object") setColumnVisibilityModel(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("reports:sortModel", JSON.stringify(sortModel)); } catch {}
  }, [sortModel]);
  useEffect(() => {
    try { localStorage.setItem("reports:paginationModel", JSON.stringify(paginationModel)); } catch {}
  }, [paginationModel]);
  useEffect(() => {
    try { localStorage.setItem("reports:quickFilter", JSON.stringify(filterModel.quickFilterValues ?? [])); } catch {}
  }, [filterModel]);

  const copyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setSnack({ open: true, message: "ID copied", severity: "success" });
    } catch {
      setSnack({ open: true, message: "Copy failed", severity: "error" });
    }
  };

  const timeAgo = (iso: string) => {
    const d = new Date(iso).getTime();
    const now = Date.now();
    const diff = Math.max(0, Math.floor((now - d) / 1000));
    const units: [number, Intl.RelativeTimeFormatUnit][] = [
      [60, "second"],
      [60, "minute"],
      [24, "hour"],
      [7, "day"],
      [4.34524, "week"],
      [12, "month"],
    ];
    let unit: Intl.RelativeTimeFormatUnit = "year";
    let value = Math.floor(diff / (60 * 60 * 24 * 365));
  const rest = diff;
    let denom = 1;
    for (let i = 0, acc = 1; i < units.length; i++) {
      const [n, u] = units[i];
      if (rest < acc * n) { unit = units[i-1]?.[1] ?? "second"; denom = acc; break; }
      acc *= n;
      unit = u; denom = acc;
    }
    if (denom === 0) denom = 1;
    value = Math.max(1, Math.floor(diff / denom));
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
    return rtf.format(-value, unit);
  };

  // Custom toolbar for DataGrid (handlers from closure)
  const ReportsToolbar = () => (
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
        <Button onClick={() => { setFilterModel({ items: [], quickFilterValues: [] }); setQuery(""); setPaginationModel((m) => ({ ...m, page: 0 })); }} variant="outlined" size="small">Clear</Button>
      </Box>
    </GridToolbarContainer>
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Debounced search refresh
  useEffect(() => {
    const t = setTimeout(() => {
      setPaginationModel((m) => ({ ...m, page: 0 }));
      refresh();
    }, 300);
    return () => clearTimeout(t);
  }, [query, refresh]);

  const onDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/reports/${encodeURIComponent(deleteId)}`, { method: "DELETE" });
    if (!res.ok) {
      setSnack({ open: true, message: "Failed to delete", severity: "error" });
    } else {
      setSnack({ open: true, message: "Deleted", severity: "success" });
    }
    setDeleteId(null);
    await refresh();
  };

  const onDuplicate = async (id: string) => {
    try {
      // Fetch existing, then create a new report via collection POST (auto id)
      const res = await fetch(`/api/reports/${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error(`Load failed: ${res.status}`);
      const data = await res.json();
      const save = await fetch(`/api/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!save.ok) throw new Error(`Save failed: ${save.status}`);
      const j = (await save.json().catch(() => ({}))) as { id?: string };
      setSnack({ open: true, message: j?.id ? `Duplicated as ${j.id}` : `Duplicated`, severity: "success" });
      await refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Duplicate failed";
      setSnack({ open: true, message: msg, severity: "error" });
    }
  };

  const onExport = async () => {
    const sort = sortModel[0];
    const params = new URLSearchParams({
      q: query,
      sortField: sort?.field ?? "date",
      sortDir: (sort?.sort as "asc" | "desc" | undefined) ?? "desc",
      limit: "5000",
    });
    const url = `/api/reports/export?${params.toString()}`;
    window.open(url, "_blank");
  };

  return (
    <Card>
      <CardHeader
        title="Reports"
        subheader="Search, sort, export, duplicate, or delete."
        action={
          <Button startIcon={<AddIcon />} variant="contained" color="primary" component={Link} href="/reports/create">
            Create
          </Button>
        }
      />
      <CardContent>
  <Stack sx={{ mb: 1 }} />

        {loading ? (
          <Box sx={{ py: 1 }}>
            <Stack spacing={1}>
              <Skeleton variant="rounded" height={36} />
              <Skeleton variant="rounded" height={36} />
              <Skeleton variant="rounded" height={36} />
              <Skeleton variant="rounded" height={36} />
              <Skeleton variant="rounded" height={36} />
            </Stack>
          </Box>
    ) : items.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>No reports found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Try adjusting your search or create a new report.</Typography>
            <Button startIcon={<AddIcon />} component={Link} href="/reports/create">Create your first report</Button>
          </Box>
        ) : (
          <div style={{ width: "100%" }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary">Legend:</Typography>
              <Chip size="small" color="success" label=">= 80%" />
              <Chip size="small" color="warning" label="50–79%" />
              <Chip size="small" color="error" label="< 50%" />
            </Stack>
            {!isMounted ? (
              <Box sx={{ height: 360 }} />
            ) : (
            <DataGrid
              autoHeight
      disableRowSelectionOnClick
              density="compact"
              filterMode="server"
      rows={items}
              getRowId={(r) => r.id}
              slots={{ toolbar: ReportsToolbar }}
              onRowDoubleClick={(p) => router.push(`/reports/${encodeURIComponent((p.row as Summary).id)}`)}
              filterModel={filterModel}
              onFilterModelChange={(model) => {
                if (!mounted.current) return;
                setFilterModel(model);
                const qv = (model.quickFilterValues ?? []).join(" ").trim();
                setQuery(qv);
              }}
              columnVisibilityModel={columnVisibilityModel}
              onColumnVisibilityModelChange={(model) => {
                if (!mounted.current) return;
                setColumnVisibilityModel(model);
                try { localStorage.setItem("reports:columnVisibility", JSON.stringify(model)); } catch {}
              }}
              columns={([
                { field: "id", headerName: "ID", flex: 0.6, renderCell: (p) => (
                  <Tooltip title="Copy ID">
                    <Typography fontFamily="monospace" sx={{ cursor: "pointer" }} onClick={() => copyId(String(p.value))}>
                      {p.value}
                    </Typography>
                  </Tooltip>
                ) },
                { field: "name", headerName: "Name", flex: 1 },
                { field: "term", headerName: "Term", flex: 0.8 },
                { field: "updatedAt", headerName: "Updated", flex: 0.8, renderCell: (p) => {
                  const v = typeof p.value === "string" ? p.value : null;
                  if (!v) return <Typography color="text.secondary">-</Typography>;
                  return (
                    <Tooltip title={new Date(v).toLocaleString()}>
                      <Typography>{timeAgo(v)}</Typography>
                    </Tooltip>
                  );
                } },
                { field: "date", headerName: "Date", flex: 0.8, hide: true },
                { field: "percentage", headerName: "%", flex: 0.5, sortable: true, renderCell: (p) => {
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
                  renderCell: (params: GridRenderCellParams<Summary>) => (
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
                        <IconButton size="small" onClick={() => setDuplicateId(params.row.id)} aria-label="duplicate">
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => setDeleteId(params.row.id)} aria-label="delete">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  ),
                },
              ] as GridColDef<Summary>[])}
              paginationMode="server"
              sortingMode="server"
              rowCount={total}
              paginationModel={paginationModel}
              onPaginationModelChange={(m) => { if (mounted.current) setPaginationModel(m); }}
              sortingOrder={["desc", "asc"]}
              sortModel={sortModel}
              onSortModelChange={(m) => { if (mounted.current) setSortModel(m.length ? m : [{ field: "updatedAt", sort: "desc" }]); }}
              pageSizeOptions={[5, 10, 25, 50]}
            />
            )}
          </div>
        )}
      </CardContent>

      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete report {deleteId}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={onDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(duplicateId)} onClose={() => setDuplicateId(null)}>
        <DialogTitle>Duplicate report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create a copy of report {duplicateId}? You can edit it after it’s created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDuplicateId(null)}>Cancel</Button>
          <Button variant="contained" onClick={async () => { if (duplicateId) { await onDuplicate(duplicateId); setDuplicateId(null); } }}>Duplicate</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack((s) => ({ ...s, open: false }))}>{snack.message}</Alert>
      </Snackbar>
    </Card>
  );
}
