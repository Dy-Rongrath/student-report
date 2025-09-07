"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ClientReport from "@/app/reports/[id]/ClientReport";
import type { ClientReportProps } from "@/app/reports/[id]/ClientReport";
import { Box, Card, CardContent, CardHeader, TextField, Typography, Button, IconButton, Stack, Divider, Snackbar, Alert, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

type ScoreInput = { indicator: string; score: number };

export default function BuilderClient() {
  const searchParams = useSearchParams();
  const prefillId = searchParams.get("id");

  const [id, setId] = useState<string>(prefillId ?? "123");
  const [student, setStudent] = useState({
    name: "SAMPHEAVIN PHURINTWADH",
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
        id,
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
      const res = await fetch(`/api/reports/${encodeURIComponent(id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        setSnack({ open: true, message: `Failed to save: ${res.status} ${e?.error ?? ""}`.trim(), severity: "error" });
      } else {
        setSnack({ open: true, message: "Saved", severity: "success" });
      }
    } finally {
      setSaving(false);
    }
  };

  const isValid = useMemo(() => {
    const basicOk = id.trim().length > 0 && student.name.trim().length > 0 && student.teacher.trim().length > 0 && student.evaluationType.trim().length > 0;
    const rowsOk = scores.length > 0 && scores.every((r) => r.indicator.trim().length > 0 && !Number.isNaN(r.score) && r.score >= 0 && r.score <= 10);
    return basicOk && rowsOk;
  }, [id, student, scores]);

  return (
    <Box className="print:block" sx={{ minHeight: "100vh", p: 2 }}>
      <Box sx={{ display: { xs: "block", md: "grid" }, gridTemplateColumns: { md: "1fr 1fr" }, gap: 2 }}>
        {/* Form - hidden on print */}
        <Box className="print:hidden">
          <Card variant="outlined">
            <CardHeader title="Report Builder" subheader="Fill the form. The preview updates live. Printing includes only the preview." />
            <CardContent>
              <Stack spacing={2}>
                <TextField label="Report ID" placeholder="e.g. 123" value={id} onChange={(e) => setId(e.target.value)} size="small" />

                <Divider textAlign="left">Student</Divider>
                <TextField label="Name" placeholder="Full name" value={student.name} onChange={(e) => setStudent({ ...student, name: e.target.value })} size="small" error={student.name.trim().length === 0} helperText={student.name.trim().length === 0 ? "Name is required." : ""} />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField fullWidth label="Grade" placeholder="e.g. 3" value={student.grade} onChange={(e) => setStudent({ ...student, grade: e.target.value })} size="small" />
                  <TextField fullWidth label="Class/Group" placeholder="e.g. Mekun 262" value={student.classGroup} onChange={(e) => setStudent({ ...student, classGroup: e.target.value })} size="small" />
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField fullWidth label="Teacher" placeholder="Teacher name" value={student.teacher} onChange={(e) => setStudent({ ...student, teacher: e.target.value })} size="small" error={student.teacher.trim().length === 0} helperText={student.teacher.trim().length === 0 ? "Teacher is required." : ""} />
                  <TextField fullWidth label="Evaluation Type" placeholder="e.g. Math Olympiad Training" value={student.evaluationType} onChange={(e) => setStudent({ ...student, evaluationType: e.target.value })} size="small" error={student.evaluationType.trim().length === 0} helperText={student.evaluationType.trim().length === 0 ? "Evaluation type is required." : ""} />
                </Stack>

                <Divider textAlign="left">Indicators</Divider>
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" size="small" onClick={loadDefaultIndicators} startIcon={<AddIcon />}>Use defaults</Button>
                  <Button variant="contained" size="small" onClick={onAddRow} startIcon={<AddIcon />}>Add</Button>
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
                      <TextField type="number" size="small" inputProps={{ step: 0.5, min: 0, max: 10 }} label="Score (0-10)" value={row.score} onChange={(e) => {
                        const v = Number(e.target.value); setScores((prev) => prev.map((r, idx) => idx === i ? { ...r, score: v } : r));
                      }} />
                      <IconButton color="error" aria-label="remove" onClick={() => onRemoveRow(i)}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>

                <TextField label="Comments" multiline minRows={3} placeholder="Overall observations, strengths, and areas to improve..." value={comments} onChange={(e) => setComments(e.target.value)} />

                <Stack direction="row" spacing={1}>
                  <Button variant="contained" color="primary" disabled={!isValid || saving} onClick={() => window.print()}>Print</Button>
                  <Button variant="contained" color="success" disabled={!isValid || saving} onClick={onSave} startIcon={saving ? <CircularProgress size={16} /> : undefined}>{saving ? "Saving…" : "Save"}</Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Preview - this is the only section that prints */}
        <Box>
          <ClientReport student={student as ClientReportProps["student"]} scores={scores as ClientReportProps["scores"]} comments={comments} />
        </Box>
      </Box>
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack((s) => ({ ...s, open: false }))}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
