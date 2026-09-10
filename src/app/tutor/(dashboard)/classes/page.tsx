import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LiveClass, ClassEnrollment, User } from "@/models";
import TutorClassesClient from "@/components/tutor/TutorClassesClient";

export default async function TutorClassesPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "TUTOR" && session.user.role !== "ADMIN")) {
    redirect("/tutor/login");
  }

  const tutorId = session.user.id;

  const rawClasses = await LiveClass.findAll({
    where: { tutorId },
    include: [
      {
        model: ClassEnrollment,
        as: "enrollments",
        include: [
          {
            model: User,
            as: "student",
            attributes: ["id", "name", "email", "image", "phone"],
          },
        ],
      },
    ],
    order: [["scheduledAt", "DESC"]],
  });

  const classes = JSON.parse(JSON.stringify(rawClasses));

  return <TutorClassesClient classes={classes} />;
}
