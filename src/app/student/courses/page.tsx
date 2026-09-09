import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, PlayCircle } from "lucide-react";

export default async function StudentCoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "STUDENT") redirect("/login");

  // Check if they have an active membership
  const activeMemberships = await prisma.membership.findMany({
    where: { studentId: session.user.id, status: 'ACTIVE' },
  });

  if (activeMemberships.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center text-primary/30 mb-6">
          <BookOpen size={48} />
        </div>
        <h2 className="text-3xl font-black text-primary font-playfair mb-4">No Active Courses</h2>
        <p className="text-primary/60 font-medium max-w-md">You need an active fellowship membership to access the video library. Please enroll in a program to unlock courses.</p>
        <Link href="/pricing" className="mt-8 bg-accent text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
          View Programs
        </Link>
      </div>
    );
  }

  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: {
      _count: { select: { chapters: true } }
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-black text-primary font-playfair tracking-tight">My Courses</h1>
        <p className="text-primary/60 mt-2 text-lg">Access your pre-recorded video library and study materials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.length > 0 ? courses.map((course) => (
          <div key={course.id} className="bg-white rounded-[2rem] border border-secondary/20 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
            <div className="aspect-video bg-secondary/10 relative overflow-hidden flex items-center justify-center">
              {course.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
                  <BookOpen size={48} className="text-primary/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-accent shadow-lg transform scale-50 group-hover:scale-100 transition-all duration-300">
                  <PlayCircle size={32} />
                </div>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3">{course._count.chapters} Chapters</span>
              <h3 className="text-xl font-bold text-primary mb-3 leading-tight">{course.title}</h3>
              <p className="text-sm text-primary/60 mb-6 flex-1 line-clamp-2">{course.description || "Core fellowship modules."}</p>
              
              <Link 
                href={`/student/courses/${course.id}`}
                className="w-full bg-secondary/10 hover:bg-accent hover:text-white text-primary font-bold text-sm py-3.5 rounded-xl transition-colors text-center"
              >
                Start Learning
              </Link>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-12 text-center text-primary/50 text-sm bg-white rounded-[2rem] border border-secondary/20">
            No courses are available at the moment. Your mentor will publish content soon!
          </div>
        )}
      </div>
    </div>
  );
}
