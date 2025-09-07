"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Typography } from "@mui/material";

export function ManageStudentActions({ name }: { name: string }) {
  const router = useRouter();
  const [renameOpen, setRenameOpen] = useState(false);
  const [newName, setNewName] = useState(name);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const onRename = async () => {
    const nn = newName.trim();
    if (!nn || nn === name) return setRenameOpen(false);
    await fetch(`/api/students/${encodeURIComponent(name)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ newName: nn }) });
    setRenameOpen(false);
    router.push(`/students/${encodeURIComponent(nn)}`);
    router.refresh();
  };
  const onDelete = async () => {
    await fetch(`/api/students/${encodeURIComponent(name)}`, { method: "DELETE" });
    setDeleteOpen(false);
    router.push(`/students`);
    router.refresh();
  };
  return (
    <Stack direction="row" spacing={1}>
      <Button size="small" variant="outlined" onClick={() => { setNewName(name); setRenameOpen(true); }}>Rename</Button>
      <Button size="small" color="error" variant="outlined" onClick={() => setDeleteOpen(true)}>Delete</Button>

      <Dialog open={renameOpen} onClose={() => setRenameOpen(false)}>
        <DialogTitle>Rename student</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="New name" fullWidth value={newName} onChange={(e) => setNewName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameOpen(false)}>Cancel</Button>
          <Button onClick={onRename} disabled={!newName.trim()} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete student</DialogTitle>
        <DialogContent>
          <Typography>This will delete all reports for &quot;{name}&quot;. This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={onDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
