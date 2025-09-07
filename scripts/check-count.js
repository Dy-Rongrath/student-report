const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    const count = await prisma.report.count();
    console.log('Report count:', count);
  } catch (e) {
    console.error('Error counting reports:', e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
