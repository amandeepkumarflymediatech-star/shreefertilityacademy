import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LiveClass, ClassEnrollment, User, Membership } from "@/models";
import StudentClassesClient from "@/components/student/StudentClassesClient";

export default async function StudentClassesPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const studentId = session.user.id;

  // 1. Fetch active memberships and calculate remaining class credits
  const activeMemberships = await Membership.findAll({
    where: { studentId, status: "ACTIVE" },
  });
  const hasActiveMembership = activeMemberships.length > 0;
  
  const activeMembership = activeMemberships[0];
  const maxClasses = activeMembership?.maxClasses || 0;
  const usedClasses = activeMembership?.usedClasses || 0;
  const remainingClasses = Math.max(0, maxClasses - usedClasses);
  const hasClassCredits = hasActiveMembership && remainingClasses > 0;

  // 2. Fetch all live classes with tutor details and student enrollment check
  const rawClasses = await LiveClass.findAll({
    include: [
      {
        model: User,
        as: "tutor",
        attributes: [
          "id",
          "name",
          "email",
          "image",
          "phone",
          "teachingHeadline",
          "experience",
          "qualifications",
          "languages",
          "teachingStyle",
          "bio",
        ],
      },
      {
        model: ClassEnrollment,
        as: "enrollments",
        where: { studentId },
        required: false,
      },
    ],
    order: [["scheduledAt", "ASC"]],
  });

  const classes = rawClasses.map((c: any) => {
    const json = c.toJSON();
    const enrollment = json.enrollments && json.enrollments.length > 0 ? json.enrollments[0] : null;
    return {
      id: json.id,
      tutorId: json.tutorId,
      title: json.title,
      description: json.description,
      scheduledAt: json.scheduledAt,
      meetingUrl: json.meetingUrl,
      recordingUrl: json.recordingUrl,
      status: json.status,
      tutor: json.tutor,
      isEnrolled: !!enrollment,
      enrollmentStatus: enrollment?.status,
    };
  });

  // 3. Fetch all approved faculty tutors
  const rawTutors = await User.findAll({
    where: {
      role: "TUTOR",
      isApproved: true,
    },
    attributes: [
      "id",
      "name",
      "email",
      "image",
      "phone",
      "teachingHeadline",
      "experience",
      "qualifications",
      "languages",
      "teachingStyle",
      "bio",
    ],
    order: [["createdAt", "ASC"]],
  });

  const tutors = JSON.parse(JSON.stringify(rawTutors));

  return (
    <StudentClassesClient
      classes={classes}
      tutors={tutors}
      hasActiveMembership={hasActiveMembership}
      maxClasses={maxClasses}
      usedClasses={usedClasses}
      remainingClasses={remainingClasses}
      hasClassCredits={hasClassCredits}
    />
  );
}
