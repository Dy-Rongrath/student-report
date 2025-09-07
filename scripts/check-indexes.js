const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    const rows = await prisma.$queryRawUnsafe(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE schemaname = 'public' AND tablename = 'Report'
      ORDER BY indexname;
    `);
    console.log('Indexes on Report:');
    for (const r of rows) {
      console.log('-', r.indexname, '\n  ', r.indexdef);
    }
  } catch (e) {
    console.error('Error checking indexes:', e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
