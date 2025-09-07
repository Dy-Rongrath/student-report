-- Improve list/search performance
CREATE INDEX IF NOT EXISTS "Report_date_idx" ON "Report" ("date" DESC);
CREATE INDEX IF NOT EXISTS "Report_name_idx" ON "Report" (LOWER("name"));
CREATE INDEX IF NOT EXISTS "Report_term_idx" ON "Report" (LOWER("term"));
CREATE INDEX IF NOT EXISTS "Report_percentage_idx" ON "Report" ("percentage");
