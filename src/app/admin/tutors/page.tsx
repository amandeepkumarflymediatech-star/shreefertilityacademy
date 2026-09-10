import { User } from "@/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import TutorManagementClient from "@/components/admin/TutorManagementClient";

export default async function AdminTutorsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const rawTutors = await User.findAll({
    where: { role: 'TUTOR' },
    attributes: [
      'id', 'name', 'email', 'image', 'phone', 'timezone', 
      'role', 'isActive', 'isApproved', 'onboardingStatus', 
      'bio', 'experience', 'qualifications', 'languages', 
      'teachingHeadline', 'teachingLevels', 'teachingAges', 
      'teachingStyle', 'createdAt', 'updatedAt'
    ],
    order: [['createdAt', 'DESC']]
  });

  const tutors = JSON.parse(JSON.stringify(rawTutors));


  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <TutorManagementClient tutors={tutors} />
    </div>
  );
}
