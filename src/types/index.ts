// Common types for the application

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  dateOfBirth?: string;
  enrollmentDate: string;
  class?: string;
  avatar?: string;
}

export interface Report {
  id: string;
  studentId: string;
  subject: string;
  grade: string | number;
  semester: string;
  academicYear: string;
  teacher: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportWithStudent extends Report {
  student: Student;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type Grade = 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'F';

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
}
