"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent, TextField, Button, Stack, Typography, IconButton, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
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
  const [items, setItems] = useState<Summary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: "updatedAt", sort: "desc" }] as GridSortModel);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });

  const refresh = async () => {
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
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel.page, paginationModel.pageSize, sortModel]);

  // Debounced search refresh
  useEffect(() => {
    const t = setTimeout(() => {
      setPaginationModel((m) => ({ ...m, page: 0 }));
      refresh();
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

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
    <Card variant="outlined">
      <CardHeader
        title="Reports"
        action={
          <Button startIcon={<AddIcon />} variant="contained" color="primary" component={Link} href="/reports/create">
            Create
          </Button>
        }
      />
      <CardContent>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }} justifyContent="space-between" sx={{ mb: 2 }}>
          <TextField
            placeholder="Search by ID, name, or term"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ maxWidth: 420 }}
          />
          <Stack direction="row" spacing={1}>
            <Button onClick={refresh} startIcon={<RefreshIcon />} variant="outlined">Refresh</Button>
            <Button onClick={onExport} variant="outlined">Export CSV</Button>
          </Stack>
        </Stack>

        {loading ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">Loading…</Typography>
          </Stack>
    ) : items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No reports found.</Typography>
        ) : (
          <div style={{ width: "100%" }}>
            <DataGrid
              autoHeight
      disableRowSelectionOnClick
      rows={items}
              getRowId={(r) => r.id}
              columns={([
                { field: "id", headerName: "ID", flex: 0.6 },
                { field: "name", headerName: "Name", flex: 1 },
                { field: "term", headerName: "Term", flex: 0.8 },
                { field: "updatedAt", headerName: "Updated", flex: 0.8, valueFormatter: (p: { value: unknown }) => (typeof p.value === "string" ? new Date(p.value).toLocaleString() : "-") },
                { field: "date", headerName: "Date", flex: 0.8, hide: true },
                { field: "percentage", headerName: "%", flex: 0.4, valueFormatter: (p: { value: unknown }) => (typeof p.value === "number" ? p.value.toFixed(1) : "-") },
                {
                  field: "actions",
                  headerName: "Actions",
                  sortable: false,
                  filterable: false,
                  flex: 0.6,
                  renderCell: (params: GridRenderCellParams<Summary>) => (
                    <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ width: "100%" }}>
                      <IconButton size="small" color="primary" component={Link} href={`/reports/create?id=${encodeURIComponent(params.row.id)}`} aria-label="edit">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" component={Link} href={`/reports/${encodeURIComponent(params.row.id)}`} aria-label="view">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => onDuplicate(params.row.id)} aria-label="duplicate">
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => setDeleteId(params.row.id)} aria-label="delete">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  ),
                },
              ] as GridColDef<Summary>[])}
              paginationMode="server"
              sortingMode="server"
              rowCount={total}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              sortingOrder={["desc", "asc"]}
              sortModel={sortModel}
              onSortModelChange={(m) => setSortModel(m.length ? m : [{ field: "updatedAt", sort: "desc" }])}
              pageSizeOptions={[5, 10, 25, 50]}
            />
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

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack((s) => ({ ...s, open: false }))}>{snack.message}</Alert>
      </Snackbar>
    </Card>
  );
}
