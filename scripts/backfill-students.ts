import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const names = await prisma.report.findMany({
    where: { studentId: null },
    distinct: ["name"],
    select: { name: true },
  });
  console.log(`Found ${names.length} distinct student names to backfill.`);
  let created = 0;
  let updatedReports = 0;
  for (const n of names) {
    const name = n.name;
    const student = await prisma.student.upsert({ where: { name }, update: {}, create: { name } });
    const res = await prisma.report.updateMany({ where: { name, studentId: null }, data: { studentId: student.id } });
    created += 1;
    updatedReports += res.count;
    console.log(`Linked ${res.count} reports to student '${name}'.`);
  }
  console.log(`Backfill complete. Students touched: ${created}, Reports updated: ${updatedReports}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
