import { Membership, ClassEnrollment, LiveClass, User } from "@/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import EnrollmentsManagementClient from "@/components/admin/EnrollmentsManagementClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Enrollments | Admin Portal",
};

export default async function AdminEnrollmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [membershipInstances, classEnrollmentInstances, studentInstances] = await Promise.all([
    Membership.findAll({
      include: [
        {
          model: User,
          as: "student",
          attributes: ["id", "name", "email", "image", "phone"],
        },
      ],
      order: [["createdAt", "DESC"]],
    }),
    ClassEnrollment.findAll({
      include: [
        {
          model: User,
          as: "student",
          attributes: ["id", "name", "email", "image"],
        },
        {
          model: LiveClass,
          as: "session",
          include: [
            {
              model: User,
              as: "tutor",
              attributes: ["id", "name", "email"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    }),
    User.findAll({
      where: { role: "STUDENT" },
      attributes: ["id", "name", "email"],
      order: [["name", "ASC"]],
    }),
  ]);

  const memberships = membershipInstances.map((m) => {
    const plain = m.get({ plain: true }) as any;
    return {
      ...plain,
      validUntil: plain.validUntil ? new Date(plain.validUntil).toISOString() : "",
      createdAt: plain.createdAt ? new Date(plain.createdAt).toISOString() : "",
      startDate: plain.startDate ? new Date(plain.startDate).toISOString() : null,
    };
  });

  const classEnrollments = classEnrollmentInstances.map((c) => {
    const plain = c.get({ plain: true }) as any;
    return {
      ...plain,
      createdAt: plain.createdAt ? new Date(plain.createdAt).toISOString() : "",
      session: plain.session
        ? {
            ...plain.session,
            scheduledAt: plain.session.scheduledAt
              ? new Date(plain.session.scheduledAt).toISOString()
              : "",
          }
        : null,
    };
  });

  const students = studentInstances.map((s) => s.get({ plain: true })) as any;

  return (
    <EnrollmentsManagementClient
      memberships={memberships}
      classEnrollments={classEnrollments}
      students={students}
    />
  );
}
