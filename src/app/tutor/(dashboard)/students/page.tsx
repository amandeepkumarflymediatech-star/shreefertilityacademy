import { ClassEnrollment, LiveClass, User } from "@/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export const metadata = {
  title: 'My Students | Shree Fertility Academy',
};

export default async function TutorStudentsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "TUTOR") {
    redirect("/login");
  }

  // Fetch unique students enrolled in the tutor's classes
  const enrollments = await ClassEnrollment.findAll({
    include: [
      {
        model: User,
        as: 'student'
      },
      {
        model: LiveClass,
        as: 'session',
        where: {
          tutorId: session.user.id
        }
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  // Group by student
  const studentMap = new Map();
  for (const enrollment of enrollments) {
    const student = (enrollment as any).student;
    if (!studentMap.has(student.id)) {
      studentMap.set(student.id, {
        id: student.id,
        name: student.name,
        email: student.email,
        image: student.image,
        enrollments: []
      });
    }
    studentMap.get(student.id).enrollments.push(enrollment);
  }

  const students = Array.from(studentMap.values());

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/30 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">My Students</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">View and manage students enrolled in your live classes.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-secondary/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/10 border-b border-secondary/30">
                <th className="p-6 font-black text-primary font-playfair tracking-tight">Student</th>
                <th className="p-6 font-black text-primary font-playfair tracking-tight">Classes Enrolled</th>
                <th className="p-6 font-black text-primary font-playfair tracking-tight">Contact</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-12 text-center text-primary/50 font-bold">
                    No students found. Schedule a class to get started!
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="border-b border-secondary/10 hover:bg-secondary/5 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary/50 overflow-hidden relative shadow-sm">
                          {student.image ? (
                            <Image src={student.image} alt={student.name || 'Student'} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary text-white font-black font-playfair">
                              {student.name?.charAt(0) || 'S'}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-primary group-hover:text-accent transition-colors">
                            {student.name || 'Unknown Student'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="inline-flex items-center justify-center bg-primary/5 text-primary font-bold text-sm h-8 px-4 rounded-full">
                        {student.enrollments.length} {student.enrollments.length === 1 ? 'Class' : 'Classes'}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="text-sm text-primary/70 font-medium">
                        {student.email}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
