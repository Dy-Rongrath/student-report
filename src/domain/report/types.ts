import { z } from "zod";

export interface Score {
  subject: string;
  indicator?: string;
  score: number;
  maxScore?: number;
  grade?: string;
  remark?: string;
}

export interface Student {
  id: string;
  name: string;
  className: string;
  rollNo?: string;
  dob?: string;
  gender?: "Male" | "Female" | "Other";
  address?: string;
  guardianName?: string;
  session?: string;
}

export interface SchoolInfo {
  name: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface ReportData {
  school: SchoolInfo;
  student: Student;
  term: string;
  date: string;
  teacherName?: string;
  scores: Score[];
  totalScore: number;
  percentage: number;
  comments: string;
}

export const ScoreSchema = z.object({
  subject: z.string(),
  indicator: z.string().optional(),
  score: z.number(),
  maxScore: z.number().optional(),
  grade: z.string().optional(),
  remark: z.string().optional(),
});

export const StudentSchema = z.object({
  id: z.string(),
  name: z.string(),
  className: z.string(),
  rollNo: z.string().optional(),
  dob: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  address: z.string().optional(),
  guardianName: z.string().optional(),
  session: z.string().optional(),
});

export const SchoolInfoSchema = z.object({
  name: z.string(),
  logoUrl: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
});

export const ReportDataSchema = z.object({
  school: SchoolInfoSchema,
  student: StudentSchema,
  term: z.string(),
  date: z.string(),
  teacherName: z.string().optional(),
  scores: z.array(ScoreSchema),
  totalScore: z.number(),
  percentage: z.number(),
  comments: z.string(),
});

export type ReportDataZod = z.infer<typeof ReportDataSchema>;
