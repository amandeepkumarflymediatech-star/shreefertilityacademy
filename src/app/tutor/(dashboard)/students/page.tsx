import { ClassEnrollment, LiveClass, User, Membership } from "@/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import TutorStudentsClient, { TutorStudentItem } from "@/components/tutor/TutorStudentsClient";

export const metadata = {
  title: "My Students & Credits | Shree Fertility Academy",
};

export default async function TutorStudentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "TUTOR" && session.user.role !== "ADMIN")) {
    redirect("/tutor/login");
  }

  const tutorId = session.user.id;
  const now = new Date();

  // 1. Fetch all students who have enrolled in this tutor's classes or have active memberships
  const rawEnrollments = await ClassEnrollment.findAll({
    include: [
      {
        model: User,
        as: "student",
        attributes: ["id", "name", "email", "image", "phone"],
        include: [
          {
            model: Membership,
            as: "memberships",
            attributes: ["id", "maxClasses", "usedClasses", "status", "validUntil", "createdAt"],
          },
        ],
      },
      {
        model: LiveClass,
        as: "session",
        where: { tutorId },
        attributes: ["id", "title", "scheduledAt", "status", "meetingUrl", "recordingUrl"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  // Group enrollments and calculate credit balances per student
  const studentMap = new Map<string, any>();

  for (const enrollment of rawEnrollments) {
    const rawStudent = (enrollment as any).student;
    if (!rawStudent) continue;

    const studentJson = rawStudent.toJSON ? rawStudent.toJSON() : rawStudent;
    const sessionJson = (enrollment as any).session?.toJSON
      ? (enrollment as any).session.toJSON()
      : (enrollment as any).session;

    if (!studentMap.has(studentJson.id)) {
      // Calculate membership credits
      const memberships = studentJson.memberships || [];
      const totalCredits = memberships.reduce((sum: number, m: any) => sum + (m.maxClasses || 0), 0);
      const usedCredits = memberships.reduce((sum: number, m: any) => sum + (m.usedClasses || 0), 0);
      const pendingCredits = Math.max(0, totalCredits - usedCredits);
      
      const activeMembership = memberships.find((m: any) => m.status === "ACTIVE") || memberships[0];
      const membershipStatus = activeMembership ? activeMembership.status : "INACTIVE";
      const validUntil = activeMembership ? activeMembership.validUntil : null;

      studentMap.set(studentJson.id, {
        id: studentJson.id,
        name: studentJson.name,
        email: studentJson.email,
        image: studentJson.image,
        phone: studentJson.phone,
        totalCredits,
        usedCredits,
        pendingCredits,
        membershipStatus,
        validUntil,
        classesWithTutor: [],
      });
    }

    if (sessionJson) {
      const scheduledDate = new Date(sessionJson.scheduledAt);
      const isPast = scheduledDate < now || sessionJson.status === "COMPLETED";

      studentMap.get(studentJson.id).classesWithTutor.push({
        id: sessionJson.id,
        title: sessionJson.title,
        scheduledAt: sessionJson.scheduledAt,
        status: sessionJson.status,
        meetingUrl: sessionJson.meetingUrl,
        recordingUrl: sessionJson.recordingUrl,
        enrollmentStatus: (enrollment as any).status,
        isPast,
      });
    }
  }

  // 2. Also include all other active students with memberships if any
  const allActiveStudents = await User.findAll({
    where: { role: "STUDENT" },
    attributes: ["id", "name", "email", "image", "phone"],
    include: [
      {
        model: Membership,
        as: "memberships",
        attributes: ["id", "maxClasses", "usedClasses", "status", "validUntil", "createdAt"],
      },
    ],
  });

  for (const stu of allActiveStudents) {
    const studentJson = stu.toJSON() as any;
    if (studentJson?.id && !studentMap.has(studentJson.id)) {
      const memberships = studentJson.memberships || [];
      if (memberships.length === 0) continue; // Skip students without any membership

      const totalCredits = memberships.reduce((sum: number, m: any) => sum + (m.maxClasses || 0), 0);
      const usedCredits = memberships.reduce((sum: number, m: any) => sum + (m.usedClasses || 0), 0);
      const pendingCredits = Math.max(0, totalCredits - usedCredits);
      const activeMembership = memberships.find((m: any) => m.status === "ACTIVE") || memberships[0];

      studentMap.set(studentJson.id, {
        id: studentJson.id,
        name: studentJson.name,
        email: studentJson.email,
        image: studentJson.image,
        phone: studentJson.phone,
        totalCredits,
        usedCredits,
        pendingCredits,
        membershipStatus: activeMembership ? activeMembership.status : "INACTIVE",
        validUntil: activeMembership ? activeMembership.validUntil : null,
        classesWithTutor: [],
      });
    }
  }

  // Convert map to TutorStudentItem array
  const students: TutorStudentItem[] = Array.from(studentMap.values()).map((s: any) => {
    const classes = s.classesWithTutor || [];
    const attendedCount = classes.filter((c: any) => c.isPast || c.status === "COMPLETED").length;
    const upcomingCount = classes.filter((c: any) => !c.isPast && c.status !== "COMPLETED" && c.status !== "CANCELLED").length;

    return {
      id: s.id,
      name: s.name,
      email: s.email,
      image: s.image,
      phone: s.phone,
      totalCredits: s.totalCredits,
      usedCredits: s.usedCredits,
      pendingCredits: s.pendingCredits,
      membershipStatus: s.membershipStatus,
      validUntil: s.validUntil,
      totalClassesWithTutor: classes.length,
      attendedClassesWithTutor: attendedCount,
      upcomingClassesWithTutor: upcomingCount,
      tutorClassHistory: classes,
    };
  });

  return <TutorStudentsClient students={students} />;
}
