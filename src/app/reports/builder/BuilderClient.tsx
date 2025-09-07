"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ClientReport from "@/components/ClientReport";
import type { ClientReportProps } from "@/components/ClientReport";
import { Box, Card, CardContent, CardHeader, TextField, Typography, Button, IconButton, Stack, Divider, Snackbar, Alert, CircularProgress, LinearProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

type ScoreInput = { indicator: string; score: number };

export default function BuilderClient() {
  const searchParams = useSearchParams();
  const prefillId = searchParams.get("id");
  const prefillStudentName = searchParams.get("student");

  const [id, setId] = useState<string | null>(prefillId);
  const [student, setStudent] = useState({
    name: prefillStudentName ?? "SAMPHEAVIN PHURINTWADH",
    grade: "3",
    classGroup: "Mekun 262",
    date: new Date().toLocaleDateString(),
    teacher: "RY Mengkorng",
    evaluationType: "Math Olympiad Training",
  });
  const [scores, setScores] = useState<ScoreInput[]>([
    { indicator: "Problem-Solving Skills", score: 8 },
    { indicator: "Reading and Comprehension Skills", score: 8 },
    { indicator: "Creativity, Curiosity and Inquiry", score: 7 },
    { indicator: "Accuracy of Solutions", score: 8 },
    { indicator: "Speed and Time Management", score: 7.5 },
    { indicator: "Class Participation", score: 9 },
    { indicator: "Note-Taking and Organization", score: 8 },
    { indicator: "Behavior and Attitude", score: 8 },
    { indicator: "Homework completion", score: 9.5 },
    { indicator: "Motivation and Enthusiasm", score: 9 },
  ]);
  const [comments, setComments] = useState<string>(
    "Student is performing well across most indicators and shows strong participation."
  );
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [prefilledFromLast, setPrefilledFromLast] = useState<string | null>(null);

  // Load existing report to edit if id is provided
  useEffect(() => {
    const load = async () => {
      if (!prefillId) return;
      const res = await fetch(`/api/reports/${encodeURIComponent(prefillId)}`);
      if (!res.ok) return;
      const data = await res.json();
      setId(prefillId);
      setStudent({
        name: data.student?.name ?? "",
        grade: data.student?.className ?? "",
        classGroup: data.student?.className ?? "",
        date: new Date(data.date).toLocaleDateString(),
        teacher: data.teacherName ?? "",
        evaluationType: data.term ?? "",
      });
      setScores((data.scores ?? []).map((s: { indicator?: string; subject?: string; score?: number }) => ({ indicator: s.indicator ?? s.subject ?? "", score: Number(s.score ?? 0) })));
      setComments(data.comments ?? "");
    };
    load();
  }, [prefillId]);

  // If creating a new report for a given student, suggest values based on the latest report
  useEffect(() => {
    const suggestFromLast = async () => {
      if (prefillId) return; // editing
      if (!prefillStudentName) return; // no student context
      try {
        const listRes = await fetch(`/api/students/${encodeURIComponent(prefillStudentName)}/reports?page=0&pageSize=1&sortField=date&sortDir=desc`, { cache: "no-store" });
        if (!listRes.ok) return;
        const list = (await listRes.json()) as { rows: Array<{ id: string; term: string; date: string }>; total: number };
        const last = list.rows?.[0];
        if (!last?.id) return;
        const fullRes = await fetch(`/api/reports/${encodeURIComponent(last.id)}`);
        if (!fullRes.ok) return;
        const data = await fullRes.json();
        // Compute next month date string for preview
        const lastDate = new Date(last.date);
        const nextDate = new Date(lastDate);
        nextDate.setMonth(nextDate.getMonth() + 1);
        const nextDateStr = nextDate.toLocaleDateString();
        // Try to increment term if it matches "Term N"
        const incTerm = (() => {
          const m = /term\s*(\d+)/i.exec(String(last.term ?? data.term ?? ""));
          if (m) {
            const n = Number(m[1]);
            if (Number.isFinite(n)) return String(last.term).replace(m[0], `Term ${n + 1}`);
          }
          return String(last.term ?? data.term ?? "");
        })();
        // Prefill student profile fields from last
        setStudent((s) => ({
          ...s,
          name: prefillStudentName,
          grade: String(data?.student?.className ?? s.grade ?? ""),
          classGroup: String(data?.student?.className ?? s.classGroup ?? ""),
          teacher: String(data?.teacherName ?? s.teacher ?? ""),
          evaluationType: incTerm,
          date: nextDateStr,
        }));
        // Use same indicators, reset scores to 0
        const lastIndicators: ScoreInput[] = Array.isArray(data?.scores) ? (data.scores as Array<{ indicator?: string; subject?: string }>).map((r) => ({ indicator: String(r.indicator ?? r.subject ?? ""), score: 0 })) : [];
        if (lastIndicators.length > 0) setScores(lastIndicators);
        setComments("");
        setPrefilledFromLast(last.id);
      } catch {
        // silent fail
      }
    };
    suggestFromLast();
    // Only run once on mount when creating a new report with ?student
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track unsaved changes
  useEffect(() => {
    setDirty(true);
  }, [student, scores, comments]);

  // Warn on navigate away with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const onAddRow = () => setScores((prev) => [...prev, { indicator: "", score: 0 }]);
  const onRemoveRow = (idx: number) => setScores((prev) => prev.filter((_, i) => i !== idx));

  const loadDefaultIndicators = () => {
    const defaults: ScoreInput[] = [
      { indicator: "Problem-Solving Skills", score: 8 },
      { indicator: "Reading and Comprehension Skills", score: 8 },
      { indicator: "Creativity, Curiosity and Inquiry", score: 7 },
      { indicator: "Accuracy of Solutions", score: 8 },
      { indicator: "Speed and Time Management", score: 7.5 },
      { indicator: "Class Participation", score: 9 },
      { indicator: "Note-Taking and Organization", score: 8 },
      { indicator: "Behavior and Attitude", score: 8 },
      { indicator: "Homework completion", score: 9.5 },
      { indicator: "Motivation and Enthusiasm", score: 9 },
    ];
    setScores(defaults);
  };

  const payload = useMemo(() => {
    // Build ReportData payload expected by API
    const total = scores.reduce((a, s) => a + Number(s.score || 0), 0);
    const max = scores.length * 10;
    return {
      school: {
        name: "Mekun Academy",
        logoUrl: "/logo_mekun_academy.png",
      },
      student: {
  id: id ?? "",
        name: student.name,
        className: String(student.grade),
        session: "",
      },
      term: student.evaluationType,
      date: new Date().toISOString(),
      teacherName: student.teacher,
      scores: scores.map((s) => ({ subject: s.indicator, indicator: s.indicator, score: Number(s.score) })),
      totalScore: total,
      percentage: max ? (total / max) * 100 : 0,
      comments,
    };
  }, [scores, comments, id, student]);

  const onSave = async () => {
    try {
      setSaving(true);
      const res = id
        ? await fetch(`/api/reports/${encodeURIComponent(id)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(`/api/reports`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        setSnack({ open: true, message: `Failed to save: ${res.status} ${e?.error ?? ""}`.trim(), severity: "error" });
      } else {
        if (!id) {
          const j = (await res.json().catch(() => ({}))) as { id?: string };
          if (j?.id) {
            setId(j.id);
            setSnack({ open: true, message: "Created", severity: "success" });
            // Put id in URL so refresh/edit works
            const url = new URL(window.location.href);
            url.searchParams.set("id", j.id);
            window.history.replaceState({}, "", url.toString());
          } else {
            setSnack({ open: true, message: "Created (no id returned)", severity: "success" });
          }
        } else {
          setSnack({ open: true, message: "Saved", severity: "success" });
        }
      }
    } finally {
      setSaving(false);
  setDirty(false);
    }
  };

  const isValid = useMemo(() => {
  const basicOk = (id === null || id.length > 0) && student.name.trim().length > 0 && student.teacher.trim().length > 0 && student.evaluationType.trim().length > 0;
    const rowsOk = scores.length > 0 && scores.every((r) => r.indicator.trim().length > 0 && !Number.isNaN(r.score) && r.score >= 0 && r.score <= 10);
    return basicOk && rowsOk;
  }, [id, student, scores]);

  return (
    <Box className="print:block" sx={{ minHeight: "100vh", p: 2 }}>
  <Box sx={{ display: { xs: "block", md: "grid" }, gridTemplateColumns: { md: "1fr 1fr" }, gap: 2 }}>
        {/* Form - hidden on print */}
        <Box className="print:hidden">
          <Card>
            <CardHeader
              title={id ? "Edit Report" : "Create Report"}
        subheader="Fill the form. The preview updates live. Printing includes only the preview."
              action={
                <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small" href="/reports">Back to list</Button>
          {id && <Button variant="contained" size="small" href={`/reports/${encodeURIComponent(id)}`}>View</Button>}
                </Stack>
              }
            />
            <CardContent>
              <Stack spacing={2}>
                {dirty && (
                  <Alert severity="info" variant="outlined">You have unsaved changes. Don’t forget to save.</Alert>
                )}
                {!id && prefilledFromLast && (
                  <Alert severity="success" variant="outlined">Prefilled from last report {prefilledFromLast}. Review and save.</Alert>
                )}
                {id && (
                  <TextField label="Report ID" value={id} size="small" InputProps={{ readOnly: true }} helperText="Auto-generated on create" />
                )}

                <Divider textAlign="left">Student</Divider>
                <TextField label="Student name" placeholder="e.g. Jane Doe" value={student.name} onChange={(e) => setStudent({ ...student, name: e.target.value })} size="small" error={student.name.trim().length === 0} helperText={student.name.trim().length === 0 ? "Name is required." : ""} />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField fullWidth label="Grade" placeholder="e.g. 3" value={student.grade} onChange={(e) => setStudent({ ...student, grade: e.target.value })} size="small" />
                  <TextField fullWidth label="Class/Group" placeholder="e.g. Mekun 262" value={student.classGroup} onChange={(e) => setStudent({ ...student, classGroup: e.target.value })} size="small" />
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField fullWidth label="Teacher" placeholder="Teacher name" value={student.teacher} onChange={(e) => setStudent({ ...student, teacher: e.target.value })} size="small" error={student.teacher.trim().length === 0} helperText={student.teacher.trim().length === 0 ? "Teacher is required." : ""} />
                  <TextField fullWidth label="Term / Assessment" placeholder="e.g. Term 1 or Math Olympiad" value={student.evaluationType} onChange={(e) => setStudent({ ...student, evaluationType: e.target.value })} size="small" error={student.evaluationType.trim().length === 0} helperText={student.evaluationType.trim().length === 0 ? "This field is required." : ""} />
                </Stack>

                <Divider textAlign="left">Indicators</Divider>
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" size="small" onClick={loadDefaultIndicators} startIcon={<AddIcon />}>Use defaults</Button>
                  <Button variant="contained" size="small" onClick={onAddRow} startIcon={<AddIcon />}>Add indicator</Button>
                  <Button variant="text" size="small" color="inherit" onClick={() => setScores([])}>Reset</Button>
                </Stack>
                {scores.length === 0 && (
                  <Typography variant="caption" color="error">Add at least one indicator.</Typography>
                )}
                <Stack spacing={1}>
                  {scores.map((row, i) => (
                    <Stack key={i} direction="row" spacing={1} alignItems="center">
                      <TextField fullWidth size="small" label="Indicator" placeholder="Indicator" value={row.indicator} onChange={(e) => {
                        const v = e.target.value; setScores((prev) => prev.map((r, idx) => idx === i ? { ...r, indicator: v } : r));
                      }} />
                      <TextField type="number" size="small" inputProps={{ step: 0.5, min: 0, max: 10 }} label="Score (0-10)" value={row.score}
                        error={Number.isNaN(row.score) || row.score < 0 || row.score > 10}
                        helperText={(row.score < 0 || row.score > 10) ? "Enter between 0 and 10" : ""}
                        onChange={(e) => {
                          const v = Number(e.target.value); setScores((prev) => prev.map((r, idx) => idx === i ? { ...r, score: v } : r));
                        }} />
                      <IconButton color="error" aria-label="remove" onClick={() => onRemoveRow(i)}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>

                <TextField label="Comments" multiline minRows={3} placeholder="Overall observations, strengths, and areas to improve..." value={comments} onChange={(e) => setComments(e.target.value)} />

                <Divider textAlign="left">Summary</Divider>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">Total score: {scores.reduce((a, s) => a + Number(s.score || 0), 0)} / {scores.length * 10}</Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress variant="determinate" value={Math.min(100, Math.max(0, Math.round(((scores.reduce((a, s) => a + Number(s.score || 0), 0) / (scores.length * 10 || 1)) * 100))))} />
                    </Box>
                    <Typography sx={{ minWidth: 56, textAlign: "right" }}>{Math.round(((scores.reduce((a, s) => a + Number(s.score || 0), 0) / (scores.length * 10 || 1)) * 100))}%</Typography>
                  </Stack>
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <Button variant="contained" color="success" disabled={!isValid || saving} onClick={onSave} startIcon={saving ? <CircularProgress size={16} /> : undefined}>{saving ? "Saving…" : (id ? "Save changes" : "Create report")}</Button>
                  <Button variant="outlined" color="inherit" disabled={!isValid} onClick={() => window.print()}>Print</Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Preview - this is the only section that prints */}
  <Box sx={{ position: { md: "sticky" }, top: { md: 16 } }}>
          <ClientReport student={student as ClientReportProps["student"]} scores={scores as ClientReportProps["scores"]} comments={comments} />
        </Box>
      </Box>
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack((s) => ({ ...s, open: false }))}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
