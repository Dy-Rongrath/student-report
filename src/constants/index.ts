/**
 * Application-wide constants
 */

export const APP_NAME = 'Student Report System';
export const APP_DESCRIPTION = 'Comprehensive student reporting and management system';

export const ROUTES = {
  HOME: '/',
  STUDENTS: '/students',
  STUDENT_DETAIL: (id: string) => `/students/${id}`,
  REPORTS: '/reports',
  REPORT_DETAIL: (id: string) => `/reports/${id}`,
  CREATE_REPORT: '/reports/create',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
} as const;

export const GRADES = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'] as const;

export const SEMESTERS = ['Fall', 'Spring', 'Summer'] as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

export const API_ENDPOINTS = {
  STUDENTS: '/api/students',
  REPORTS: '/api/reports',
  SUBJECTS: '/api/subjects',
} as const;

export const DATE_FORMATS = {
  FULL: 'MMMM dd, yyyy',
  SHORT: 'MMM dd, yyyy',
  YEAR: 'yyyy',
} as const;
