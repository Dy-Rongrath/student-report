import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  if (existingAdmin) {
    console.log('⚠️  Admin user already exists. Skipping...');
    return;
  }

  // Create admin user
  const hashedPassword = await hash('admin123', 12);

  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Admin user created successfully!');
  console.log('📧 Email: admin@example.com');
  console.log('🔑 Password: admin123');
  console.log('👤 Role: ADMIN');
  console.log('');

  // Get admin user for creating students
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  if (!adminUser) {
    throw new Error('Admin user not found');
  }

  // Optional: Create some sample students
  console.log('📚 Creating sample students...');

  await prisma.student.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@school.com',
      studentId: 'STU001',
      dateOfBirth: new Date('2008-05-15'),
      class: 'Grade 10A',
      createdById: adminUser.id,
    },
  });

  await prisma.student.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@school.com',
      studentId: 'STU002',
      dateOfBirth: new Date('2007-08-22'),
      class: 'Grade 11B',
      createdById: adminUser.id,
    },
  });

  await prisma.student.create({
    data: {
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@school.com',
      studentId: 'STU003',
      dateOfBirth: new Date('2009-03-10'),
      class: 'Grade 9A',
      createdById: adminUser.id,
    },
  });

  console.log('✅ Created 3 sample students');

  // Optional: Create sample reports
  console.log('📝 Creating sample reports...');

  const allStudents = await prisma.student.findMany();

  if (allStudents.length > 0) {
    await prisma.report.create({
      data: {
        studentId: allStudents[0].id,
        subject: 'Mathematics',
        grade: 'A',
        semester: 'Fall',
        academicYear: '2024-2025',
        teacher: 'Mr. Johnson',
        comments: 'Excellent performance in algebra and geometry. Shows strong problem-solving skills. Keep up the good work!',
        createdById: adminUser.id,
      },
    });

    await prisma.report.create({
      data: {
        studentId: allStudents[0].id,
        subject: 'English',
        grade: 'B+',
        semester: 'Fall',
        academicYear: '2024-2025',
        teacher: 'Ms. Williams',
        comments: 'Good writing skills and creative thinking. Needs improvement in grammar. Practice more grammar exercises.',
        createdById: adminUser.id,
      },
    });

    await prisma.report.create({
      data: {
        studentId: allStudents[1].id,
        subject: 'Science',
        grade: 'A-',
        semester: 'Fall',
        academicYear: '2024-2025',
        teacher: 'Dr. Smith',
        comments: 'Excellent laboratory work and understanding of scientific concepts. Outstanding student!',
        createdById: adminUser.id,
      },
    });

    console.log('✅ Created 3 sample reports');
  }

  console.log('');
  console.log('🎉 Database seeding completed!');
  console.log('');
  console.log('You can now sign in with:');
  console.log('  Email: admin@example.com');
  console.log('  Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
