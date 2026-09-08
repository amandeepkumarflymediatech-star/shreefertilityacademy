import { PrismaClient } from '@prisma/client';
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shreefertilityacademy.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@shreefertilityacademy.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // 2. Create Tutors
  const tutor1 = await prisma.user.upsert({
    where: { email: 'tutor1@shreefertilityacademy.com' },
    update: { 
      password: hashedPassword,
      isApproved: true,
      bio: 'Expert in IVF Mentorship with over 10 years of experience.',
      experience: '10+ years coaching IVF professionals.',
      languages: 'English, Hindi',
      image: '/tutor-1.jpg',
    },
    create: {
      email: 'tutor1@shreefertilityacademy.com',
      name: 'Dr. Sarah',
      password: hashedPassword,
      role: 'TUTOR',
      isApproved: true,
      bio: 'Expert in IVF Mentorship with over 10 years of experience.',
      experience: '10+ years coaching IVF professionals.',
      languages: 'English, Hindi',
      image: '/tutor-1.jpg',
    },
  });

  // 3. Create Student
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: { password: hashedPassword },
    create: {
      email: 'student@example.com',
      name: 'Alice Student',
      password: hashedPassword,
      role: 'STUDENT',
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
