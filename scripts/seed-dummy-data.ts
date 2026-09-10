import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { 
  User, 
  PricingPackage, 
  Course, 
  Chapter, 
  Lesson, 
  LessonProgress,
  Membership, 
  Order, 
  Payment, 
  LiveClass, 
  ClassEnrollment, 
  Coupon, 
  BlogPost, 
  Review, 
  ContactMessage 
} from '../src/models';
import { sequelize } from '../src/lib/sequelize';

async function seed() {
  console.log('🌱 Starting comprehensive dummy data seeding...');

  await sequelize.authenticate();
  console.log('✅ Database connected.');

  const hashedPassword = await bcrypt.hash('Password@123', 10);
  const adminPassword = await bcrypt.hash('Admin@123', 10);

  // ==========================================
  // 1. ADMIN USER
  // ==========================================
  let admin = await User.findOne({ where: { email: 'admin@shreefertility.com' } });
  if (!admin) {
    admin = await User.create({
      name: 'Super Admin',
      email: 'admin@shreefertility.com',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
      isApproved: true,
      onboardingStatus: 'APPROVED',
      phone: '+91 99999 00000',
      timezone: 'Asia/Kolkata',
    } as any);
  } else {
    await admin.update({ password: adminPassword, role: 'ADMIN', isApproved: true });
  }
  console.log('✅ Admin configured: admin@shreefertility.com');

  // ==========================================
  // 2. TUTORS (MENTORS)
  // ==========================================
  const dummyTutors = [
    {
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@shreefertility.com',
      password: hashedPassword,
      role: 'TUTOR',
      isActive: true,
      isApproved: true,
      onboardingStatus: 'APPROVED',
      image: '/tutor-2.jpg',
      phone: '+91 98112 34567',
      timezone: 'Asia/Kolkata',
      teachingHeadline: 'Senior Clinical Embryologist & IVF Specialist',
      experience: '12+ Years in Advanced Assisted Reproduction',
      qualifications: 'MBBS, MS (OBG), DRM (Germany), ESHRE Certified',
      languages: 'English, Hindi',
      teachingLevels: 'Intermediate, Advanced',
      teachingAges: 'Medical Postgraduates, Practicing Gynecologists',
      teachingStyle: 'Interactive case studies, hands-on lab video analysis, live Q&A',
      bio: 'Dr. Priya Sharma is a renowned reproductive specialist with over 12 years of hands-on experience in IVF, ICSI, and blastocyst culture. She has trained over 200 embryologists across India and South Asia.',
    },
    {
      name: 'Dr. Rajesh Varma',
      email: 'rajesh.varma@shreefertility.com',
      password: hashedPassword,
      role: 'TUTOR',
      isActive: true,
      isApproved: true,
      onboardingStatus: 'APPROVED',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
      phone: '+91 98450 12345',
      timezone: 'Asia/Kolkata',
      teachingHeadline: 'Consultant Andrologist & Male Infertility Lead',
      experience: '9+ Years in Micro-TESE & Andrology',
      qualifications: 'MBBS, M.Ch (Urology), Fellowship in Andrology (USA)',
      languages: 'English, Hindi, Telugu',
      teachingLevels: 'Beginner, Intermediate, Advanced',
      teachingAges: 'Urology Residents, IVF Trainees',
      teachingStyle: 'Live surgical recordings, step-by-step diagnostic workflows',
      bio: 'Dr. Rajesh specializes in male factor infertility, cryopreservation techniques, and micro-surgical sperm retrieval. Dedicated to bridging theoretical diagnostics with clinical excellence.',
    },
    {
      name: 'Dr. Ananya Sen',
      email: 'ananya.sen@shreefertility.com',
      password: hashedPassword,
      role: 'TUTOR',
      isActive: true,
      isApproved: true,
      onboardingStatus: 'APPROVED',
      image: 'https://images.unsplash.com/photo-1594824813588-44280d5d2fa5?w=400&auto=format&fit=crop&q=80',
      phone: '+91 97321 65498',
      timezone: 'Asia/Kolkata',
      teachingHeadline: 'Reproductive Endocrinologist & Ovarian Biology Researcher',
      experience: '8+ Years in Ovarian Stimulation & Hormone Protocols',
      qualifications: 'MBBS, DGO, PhD in Reproductive Sciences',
      languages: 'English, Bengali',
      teachingLevels: 'Beginner, Intermediate',
      teachingAges: 'General Practitioners, IVF Clinicians',
      teachingStyle: 'Protocol flowcharts, endocrine profiling quizzes',
      bio: 'Dr. Ananya focuses on personalized ovarian stimulation protocols for poor responders and PCOS patients. Authored 15+ international papers on reproductive endocrinology.',
    },
    {
      name: 'Dr. Vikram Malhotra',
      email: 'vikram.malhotra@shreefertility.com',
      password: hashedPassword,
      role: 'TUTOR',
      isActive: true,
      isApproved: false,
      onboardingStatus: 'UNDER_REVIEW',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
      phone: '+91 98200 98765',
      timezone: 'Asia/Kolkata',
      teachingHeadline: 'Fellow in Reproductive Medicine',
      experience: '4+ Years in IVF Labs',
      qualifications: 'MBBS, MS (OBG), Fellowship in Clinical Embryology',
      languages: 'English, Hindi, Punjabi',
      teachingLevels: 'Beginner',
      teachingAges: 'MBBS Graduates, Lab Technicians',
      teachingStyle: 'Interactive slide decks and foundational anatomy',
      bio: 'Passionate young reproductive clinician eager to mentor aspiring embryologists on foundational lab protocols, equipment maintenance, and media preparation.',
    }
  ];

  const tutorInstances: Record<string, any> = {};
  for (const tutorData of dummyTutors) {
    let t = await User.findOne({ where: { email: tutorData.email } });
    if (t) {
      await t.update(tutorData as any);
    } else {
      t = await User.create(tutorData as any);
    }
    tutorInstances[tutorData.email] = t;
  }
  console.log(`✅ ${dummyTutors.length} Tutors seeded.`);

  // ==========================================
  // 3. STUDENTS
  // ==========================================
  const dummyStudents = [
    {
      name: 'Rohan Mehta',
      email: 'student@shreefertility.com',
      phone: '+91 98989 12345',
      timezone: 'Asia/Kolkata',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Dr. Sneha Patel',
      email: 'sneha.patel@shreefertility.com',
      phone: '+91 97234 56789',
      timezone: 'Asia/Kolkata',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Dr. Arjun Nair',
      email: 'arjun.nair@shreefertility.com',
      phone: '+91 98450 11223',
      timezone: 'Asia/Kolkata',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Dr. Pooja Deshmukh',
      email: 'pooja.deshmukh@shreefertility.com',
      phone: '+91 99201 44556',
      timezone: 'Asia/Kolkata',
      image: 'https://images.unsplash.com/photo-1594824813689-cf761a2ceeb1?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Vikas Sharma',
      email: 'vikas.sharma@shreefertility.com',
      phone: '+91 98112 77889',
      timezone: 'Asia/Kolkata',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    },
  ];

  const studentInstances: Record<string, any> = {};
  for (const stu of dummyStudents) {
    let s = await User.findOne({ where: { email: stu.email } });
    if (!s) {
      s = await User.create({
        ...stu,
        password: hashedPassword,
        role: 'STUDENT',
        isActive: true,
      } as any);
    } else {
      await s.update({ password: hashedPassword, role: 'STUDENT', ...stu });
    }
    studentInstances[stu.email] = s;
  }
  const student1 = studentInstances['student@shreefertility.com'];
  const student2 = studentInstances['sneha.patel@shreefertility.com'];
  const student3 = studentInstances['arjun.nair@shreefertility.com'];
  const student4 = studentInstances['pooja.deshmukh@shreefertility.com'];
  const student5 = studentInstances['vikas.sharma@shreefertility.com'];
  const allStudents = [student1, student2, student3, student4, student5];

  console.log(`✅ ${allStudents.length} Students seeded successfully.`);

  // ==========================================
  // 4. PRICING PACKAGES
  // ==========================================
  const dummyPackages = [
    {
      title: 'Foundational IVF & Embryology Track',
      price: 24999,
      regularPrice: 35000,
      classCount: 6,
      tagline: 'Ideal for MBBS graduates and junior embryology trainees.',
      features: JSON.stringify([
        'Full access to all recorded fellowship lectures',
        '6 Live Q&A mentorship webinars',
        'Standard practical laboratory assessment worksheets',
        'Verified certificate of completion',
        '1 Year on-demand curriculum access'
      ]),
      isActive: true,
    },
    {
      title: 'Advanced Clinical Fellowship & 1-on-1 Mentorship',
      price: 49999,
      regularPrice: 75000,
      classCount: 12,
      tagline: 'Comprehensive clinical mastery with direct mentor consultation.',
      features: JSON.stringify([
        'Everything in Foundational Track',
        '12 Live Interactive 1-on-1 Mentorship Sessions',
        'Direct ICSI & Micromanipulation surgical video analysis',
        'Personalized ovarian stimulation protocol reviews',
        'Direct WhatsApp Mentor Priority Channel',
        'Lifetime alumni community access'
      ]),
      isActive: true,
    },
    {
      title: 'Masterclass: Andrology & Surgical Sperm Retrieval',
      price: 18999,
      regularPrice: 28000,
      classCount: 4,
      tagline: 'Targeted specialization in male factor infertility and Micro-TESE.',
      features: JSON.stringify([
        'Micro-TESE high-definition video dissections',
        'Semen analysis & DNA fragmentation diagnostics',
        '4 Live masterclasses with Dr. Rajesh Varma',
        'Andrology lab protocol manual PDF',
        'Certificate of Specialization'
      ]),
      isActive: true,
    }
  ];

  const packageInstances: any[] = [];
  for (const pkg of dummyPackages) {
    let p = await PricingPackage.findOne({ where: { title: pkg.title } });
    if (p) {
      await p.update(pkg as any);
    } else {
      p = await PricingPackage.create(pkg as any);
    }
    packageInstances.push(p);
  }
  console.log(`✅ ${packageInstances.length} Pricing Packages seeded.`);

  // ==========================================
  // 5. COUPONS
  // ==========================================
  const dummyCoupons = [
    {
      code: 'WELCOME2026',
      description: 'New Year Early Bird 15% Discount',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      maxUses: 100,
      usedCount: 12,
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      code: 'IVFDOCTOR5000',
      description: 'Flat Rs. 5000 Off for Practicing Clinicians',
      discountType: 'FLAT',
      discountValue: 5000,
      maxUses: 50,
      usedCount: 8,
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      isActive: true,
    }
  ];

  for (const couponData of dummyCoupons) {
    let c = await Coupon.findOne({ where: { code: couponData.code } });
    if (c) {
      await c.update(couponData as any);
    } else {
      await Coupon.create(couponData as any);
    }
  }
  console.log('✅ Coupons seeded.');

  // ==========================================
  // 6. MEMBERSHIPS & PURCHASES (ORDERS / PAYMENTS)
  // ==========================================
  for (let idx = 0; idx < allStudents.length; idx++) {
    const student = allStudents[idx];
    const pkg = packageInstances[idx % packageInstances.length];
    
    let mem = await Membership.findOne({ where: { studentId: student.id } });
    if (!mem) {
      mem = await Membership.create({
        studentId: student.id,
        startDate: new Date(Date.now() - (idx * 15 + 5) * 24 * 60 * 60 * 1000),
        validUntil: new Date(Date.now() + (365 - idx * 10) * 24 * 60 * 60 * 1000),
        status: 'ACTIVE',
        maxClasses: 12,
        usedClasses: idx + 2,
      } as any);
    }

    let ord = await Order.findOne({ where: { studentId: student.id, status: 'PAID' } });
    if (!ord) {
      ord = await Order.create({
        studentId: student.id,
        membershipId: pkg.id,
        amount: pkg.price,
        currency: 'INR',
        status: 'PAID',
      } as any);

      await Payment.create({
        orderId: ord.id,
        studentId: student.id,
        amount: pkg.price,
        currency: 'INR',
        status: 'SUCCESS',
        merchantTransactionId: `MT_TEST_${student.id.slice(0, 5)}_${Date.now()}`,
        phonepeTransactionId: `T260910${Math.floor(100000 + Math.random() * 900000)}`,
      } as any);
    }
  }
  console.log('✅ Active Memberships, Orders & Payments seeded for all students.');

  // ==========================================
  // 7. COURSES, CHAPTERS & LESSONS
  // ==========================================
  const dummyCourses = [
    {
      title: 'Mastering Clinical Embryology & Laboratory IVF',
      description: 'A comprehensive curriculum covering oocyte handling, denudation, ICSI mechanics, blastocyst culture, and vitrification.',
      coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
      isPublished: true,
      chapters: [
        {
          title: 'Module 1: Gamete Biology & Lab Setup',
          order: 1,
          lessons: [
            {
              title: 'Introduction to ART Laboratory Air Quality & Equipment',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              content: 'Understanding cleanroom standards, laminar airflow workstations, tri-gas incubators, and temperature monitoring systems.',
              duration: 25,
              order: 1,
              isPublished: true
            },
            {
              title: 'Oocyte Identification, Grading & Denudation Technique',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              content: 'Step-by-step microscopic examination of cumulus-oocyte complexes (COCs) and enzymatic/mechanical denudation.',
              duration: 35,
              order: 2,
              isPublished: true
            }
          ]
        },
        {
          title: 'Module 2: ICSI & Micromanipulation Mastery',
          order: 2,
          lessons: [
            {
              title: 'ICSI Dish Preparation & PVP Sperm Immobilization',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              content: 'Setting up injection dishes with mineral oil overlay, tail breaking technique, and morphologic sperm selection.',
              duration: 40,
              order: 1,
              isPublished: true
            },
            {
              title: 'Oocyte Holding, Polar Body Orientation & Injection Mechanics',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              content: 'Holding pipette suction control, 6-o-clock polar body alignment, oolemma aspiration, and cytoplasmic injection.',
              duration: 45,
              order: 2,
              isPublished: true
            }
          ]
        },
        {
          title: 'Module 3: Embryo Culture & Vitrification',
          order: 3,
          lessons: [
            {
              title: 'Sequential vs Single-Step Embryo Culture Media',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              content: 'Metabolic requirements of cleavage stage embryos and blastocysts, protein supplements, and pH buffering.',
              duration: 30,
              order: 1,
              isPublished: true
            },
            {
              title: 'High-Survival Blastocyst Vitrification & Warming Protocol',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              content: 'Equilibration solutions, DMSO/EG ratios, rapid plunging in liquid nitrogen, and thaw dilution steps.',
              duration: 50,
              order: 2,
              isPublished: true
            }
          ]
        }
      ]
    },
    {
      title: 'Advanced Andrology & Surgical Sperm Retrieval Masterclass',
      description: 'In-depth surgical diagnostics, semen analysis according to WHO 6th edition, and Micro-TESE protocols.',
      coverImage: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&auto=format&fit=crop&q=80',
      isPublished: true,
      chapters: [
        {
          title: 'Module 1: Male Factor Evaluation & Diagnostics',
          order: 1,
          lessons: [
            {
              title: 'WHO 6th Edition Semen Analysis Standards',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              content: 'Standardized counting chambers, vitality staining, and Kruger strict morphology scoring.',
              duration: 30,
              order: 1,
              isPublished: true
            },
            {
              title: 'DNA Fragmentation Index (DFI) Assessment Methods',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              content: 'TUNEL, SCD, and SCSA assays interpretation and clinical management strategies.',
              duration: 35,
              order: 2,
              isPublished: true
            }
          ]
        },
        {
          title: 'Module 2: Surgical Sperm Retrieval Techniques',
          order: 2,
          lessons: [
            {
              title: 'Micro-TESE: Step-by-Step Surgical Dissection',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              content: 'Identification of dilated seminiferous tubules under high surgical magnification.',
              duration: 60,
              order: 1,
              isPublished: true
            }
          ]
        }
      ]
    }
  ];

  for (const courseData of dummyCourses) {
    let course = await Course.findOne({ where: { title: courseData.title } });
    if (!course) {
      course = await Course.create({
        title: courseData.title,
        description: courseData.description,
        coverImage: courseData.coverImage,
        isPublished: courseData.isPublished,
      } as any);
    }

    for (const chapterData of courseData.chapters) {
      let chapter = await Chapter.findOne({ where: { courseId: course.id, title: chapterData.title } });
      if (!chapter) {
        chapter = await Chapter.create({
          courseId: course.id,
          title: chapterData.title,
          order: chapterData.order,
        } as any);
      }

      for (const lessonData of chapterData.lessons) {
        let lesson = await Lesson.findOne({ where: { chapterId: chapter.id, title: lessonData.title } });
        if (!lesson) {
          lesson = await Lesson.create({
            chapterId: chapter.id,
            title: lessonData.title,
            videoUrl: lessonData.videoUrl,
            content: lessonData.content,
            duration: lessonData.duration,
            order: lessonData.order,
            isPublished: lessonData.isPublished,
          } as any);
        }

        // Add progress for students
        for (const stu of allStudents) {
          if (lessonData.order === 1) {
            await LessonProgress.findOrCreate({
              where: { studentId: stu.id, lessonId: lesson.id },
              defaults: {
                studentId: stu.id,
                lessonId: lesson.id,
                isCompleted: true,
              } as any,
            });
          }
        }
      }
    }
  }
  console.log('✅ Courses, Chapters, Lessons & Student Progress seeded.');

  // ==========================================
  // 8. LIVE SESSIONS & STUDENT BOOKINGS / ENROLLMENTS
  // ==========================================
  const tutorPriya = tutorInstances['priya.sharma@shreefertility.com'];
  const tutorRajesh = tutorInstances['rajesh.varma@shreefertility.com'];
  const tutorAnanya = tutorInstances['ananya.sen@shreefertility.com'];
  const tutorVikram = tutorInstances['vikram.malhotra@shreefertility.com'];

  const dummyLiveClasses = [
    // --- Dr. Priya Sharma Classes ---
    {
      tutorId: tutorPriya?.id || admin.id,
      title: 'Interactive Case Conference: Optimizing Day 5 Blastocyst Culture',
      description: 'Hands-on review of slow developing Day 3 embryos, media formulations, and troubleshooting high fragmentation rates.',
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // +2 days at 10 AM
      meetingUrl: 'https://meet.google.com/shree-ivf-priya',
      status: 'SCHEDULED',
      studentsToEnroll: [student1, student2, student3, student4],
    },
    {
      tutorId: tutorPriya?.id || admin.id,
      title: 'Live Lab Practicum: ICSI Injection Needle Alignment & PVP Dynamics',
      description: 'Micromanipulator joystick sensitivity calibration, hydraulic pressure adjustments, and avoiding zona cracking.',
      scheduledAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000), // +8 days
      meetingUrl: 'https://meet.google.com/shree-icsi-practicum',
      status: 'SCHEDULED',
      studentsToEnroll: [student1, student2, student5],
    },
    {
      tutorId: tutorPriya?.id || admin.id,
      title: 'Past Workshop: Gamete Handling Under Cleanroom Laminar Airflow',
      description: 'Temperature and pH monitoring during extended micromanipulation procedures.',
      scheduledAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // -4 days (History)
      meetingUrl: 'https://meet.google.com/shree-gamete-archive',
      recordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: 'COMPLETED',
      studentsToEnroll: [student1, student2, student3, student4, student5],
    },

    // --- Dr. Rajesh Varma Classes ---
    {
      tutorId: tutorRajesh?.id || admin.id,
      title: 'Live Surgical Review: Micro-TESE in Non-Obstructive Azoospermia (NOA)',
      description: 'High-definition video review of seminiferous tubule dissection with live audio commentary and Q&A.',
      scheduledAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000), // +4 days
      meetingUrl: 'https://meet.google.com/shree-ivf-rajesh',
      status: 'SCHEDULED',
      studentsToEnroll: [student1, student3, student4, student5],
    },
    {
      tutorId: tutorRajesh?.id || admin.id,
      title: 'Past Masterclass: Interpreting Advanced Semen DNA Fragmentation (DFI)',
      description: 'Clinical correlations between elevated DFI and recurrent implantation failure, with antioxidant therapies review.',
      scheduledAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // -6 days (History)
      meetingUrl: 'https://meet.google.com/shree-dfi-archive',
      recordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: 'COMPLETED',
      studentsToEnroll: [student2, student3, student4],
    },

    // --- Dr. Ananya Sen Classes ---
    {
      tutorId: tutorAnanya?.id || admin.id,
      title: 'Live Interactive: Tailored Stimulation for Poor Ovarian Responders (POR)',
      description: 'Microdose flare protocols, dual ovarian stimulation (DuoStim), and adjuvant growth hormone therapies.',
      scheduledAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // +6 days
      meetingUrl: 'https://meet.google.com/shree-ivf-ananya',
      status: 'SCHEDULED',
      studentsToEnroll: [student1, student2, student4, student5],
    },
    {
      tutorId: tutorAnanya?.id || admin.id,
      title: 'Ovarian Stimulation Protocols for High Responders & OHSS Prevention',
      description: 'GnRH antagonist protocols, dual trigger strategies, and total freeze rationale.',
      scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // -3 days (History)
      meetingUrl: 'https://meet.google.com/shree-ohss-archive',
      recordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: 'COMPLETED',
      studentsToEnroll: [student1, student2, student3, student4, student5],
    },

    // --- Dr. Vikram Malhotra Classes ---
    {
      tutorId: tutorVikram?.id || admin.id,
      title: 'Laser-Assisted Hatching & Trophectoderm Biopsy for PGT-A',
      description: 'Multipulse diode laser firing techniques, mechanical tearing vs laser cutting, and sample tubing preparation.',
      scheduledAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000), // +10 days
      meetingUrl: 'https://meet.google.com/shree-pgta-biopsy',
      status: 'SCHEDULED',
      studentsToEnroll: [student1, student2, student3],
    },
  ];

  let totalEnrollmentsCount = 0;
  for (const classData of dummyLiveClasses) {
    const { studentsToEnroll, ...classFields } = classData;
    let lc = await LiveClass.findOne({ where: { title: classFields.title } });
    if (!lc) {
      lc = await LiveClass.create(classFields as any);
    } else {
      await lc.update(classFields as any);
    }

    // Enroll students in this live class
    for (const stu of studentsToEnroll) {
      if (stu) {
        await ClassEnrollment.findOrCreate({
          where: { sessionId: lc.id, studentId: stu.id },
          defaults: {
            sessionId: lc.id,
            studentId: stu.id,
            status: classFields.status === 'COMPLETED' ? 'ATTENDED' : 'CONFIRMED',
          } as any,
        });
        totalEnrollmentsCount++;
      }
    }
  }
  console.log(`✅ ${dummyLiveClasses.length} Live Classes & ${totalEnrollmentsCount} Student Bookings/Enrollments seeded.`);

  // ==========================================
  // 9. REVIEWS
  // ==========================================
  const dummyReviews = [
    {
      studentId: student1.id,
      tutorId: tutorPriya?.id,
      rating: 5,
      content: 'Dr. Priya Sharma’s ICSI breakdown is phenomenal. The practical tips on handling sticky cumulus masses saved me countless hours in the lab.',
      isActive: true,
    },
    {
      studentId: student2.id,
      tutorId: tutorRajesh?.id,
      rating: 5,
      content: 'The Micro-TESE surgical video modules gave me clear visual cues on tubule selection that textbooks could never convey.',
      isActive: true,
    },
    {
      studentId: student1.id,
      tutorId: tutorAnanya?.id,
      rating: 5,
      content: 'Very clear guidance on tailored ovarian stimulation protocols for poor responders. Highly recommended for every IVF fellow!',
      isActive: true,
    }
  ];

  for (const rev of dummyReviews) {
    if (rev.tutorId) {
      let r = await Review.findOne({ where: { studentId: rev.studentId, tutorId: rev.tutorId } });
      if (!r) {
        await Review.create(rev as any);
      }
    }
  }
  console.log('✅ Reviews seeded.');

  // ==========================================
  // 10. BLOG POSTS
  // ==========================================
  const dummyBlogs = [
    {
      title: 'Current Guidelines in Blastocyst Vitrification & Warming',
      slug: 'current-guidelines-in-blastocyst-vitrification-warming',
      excerpt: 'A clinical review of cryoprotectant equilibration dynamics and optimal timing for maximum survival rates.',
      content: '<p>Vitrification has transformed human assisted reproductive technology by achieving post-thaw survival rates exceeding 95% when executed with strict protocol discipline. This article examines the biophysics of ice crystal prevention and media temperature management.</p><h2>Key Protocol Factors</h2><p>Maintaining accurate warming bath temperatures at 37°C is paramount to prevent osmotic shock.</p>',
      coverImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
      published: true,
      authorId: admin.id,
      tags: 'Embryology, Vitrification, Cryopreservation, IVF Lab',
    },
    {
      title: 'Evaluating Sperm DNA Fragmentation in Recurrent Pregnancy Loss',
      slug: 'evaluating-sperm-dna-fragmentation-in-recurrent-pregnancy-loss',
      excerpt: 'Why standard sperm count and motility parameters alone are insufficient when evaluating unexplained recurrent miscarriage.',
      content: '<p>Advanced andrological diagnostics have highlighted the crucial role of paternal chromatin integrity in early embryonic development and blastulation.</p><h2>Diagnostic Indications</h2><p>Patients experiencing recurrent biochemical pregnancies or failed blastulation should routinely undergo DFI testing.</p>',
      coverImage: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=800&auto=format&fit=crop&q=80',
      published: true,
      authorId: admin.id,
      tags: 'Andrology, Male Infertility, DFI, Recurrent Loss',
    }
  ];

  for (const blogData of dummyBlogs) {
    let b = await BlogPost.findOne({ where: { slug: blogData.slug } });
    if (!b) {
      await BlogPost.create(blogData as any);
    } else {
      await b.update(blogData as any);
    }
  }
  console.log('✅ Blog posts seeded.');

  // ==========================================
  // 11. CONTACT INQUIRIES
  // ==========================================
  const dummyContacts = [
    {
      name: 'Dr. Arjun Kapoor',
      email: 'arjun.kapoor@hospital.org',
      studyPreference: 'Clinical Embryology Fellowship (Online + Hands-on)',
      message: 'I am an OB-GYN resident looking to transition into full-time reproductive medicine. Could you provide details regarding the upcoming batch start dates and mentor schedule?',
      status: 'NEW',
    },
    {
      name: 'Meera Nambiar',
      email: 'meera.nambiar@biotech.ac.in',
      studyPreference: 'Andrology & ICSI Masterclass',
      message: 'Interested in the micromanipulation hands-on modules and eligibility criteria for international students.',
      status: 'RESPONDED',
    }
  ];

  for (const contactData of dummyContacts) {
    let c = await ContactMessage.findOne({ where: { email: contactData.email } });
    if (!c) {
      await ContactMessage.create(contactData as any);
    }
  }
  console.log('✅ Contact submissions seeded.');

  console.log('\n🎉 FULL PROJECT DUMMY DATA SEEDED SUCCESSFULLY!\n');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});
