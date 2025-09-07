-- Create Student table
CREATE TABLE IF NOT EXISTS "Student" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- Add studentId to Report and index
ALTER TABLE "Report" ADD COLUMN IF NOT EXISTS "studentId" TEXT;
CREATE INDEX IF NOT EXISTS "Report_studentId_idx" ON "Report" ("studentId");

-- Foreign key
DO $$
BEGIN
  ALTER TABLE "Report"
  ADD CONSTRAINT "Report_studentId_fkey"
  FOREIGN KEY ("studentId") REFERENCES "Student"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
