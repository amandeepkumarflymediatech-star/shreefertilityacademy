import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Video } from "lucide-react";
import { revalidatePath } from "next/cache";
import DeleteCourseButton from "./_components/DeleteCourseButton";

async function deleteCourse(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.course.delete({ where: { id } });
  revalidatePath("/admin/courses");
}

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      _count: {
        select: { chapters: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-secondary/20">
        <div>
          <h1 className="text-2xl font-black text-primary font-playfair tracking-tight">Courses (LMS)</h1>
          <p className="text-primary/60 text-sm mt-1">Manage your pre-recorded video courses and modules.</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="flex items-center gap-2 bg-accent hover:bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={18} /> New Course
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-secondary/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/5 border-b border-secondary/10">
                <th className="py-4 px-6 text-[10px] font-bold text-primary/50 uppercase tracking-widest">Course Title</th>
                <th className="py-4 px-6 text-[10px] font-bold text-primary/50 uppercase tracking-widest">Chapters</th>
                <th className="py-4 px-6 text-[10px] font-bold text-primary/50 uppercase tracking-widest">Status</th>
                <th className="py-4 px-6 text-[10px] font-bold text-primary/50 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? courses.map((course: any) => (
                <tr key={course.id} className="border-b border-secondary/5 hover:bg-secondary/5 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center">
                        <Video size={18} />
                      </div>
                      <div className="font-bold text-primary">{course.title}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-primary/70 font-medium">
                    {course._count.chapters} Chapters
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                      course.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/courses/${course.id}`}
                        className="p-2 text-primary/40 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                        title="Manage Chapters & Lessons"
                      >
                        <Edit size={18} />
                      </Link>
                      <form action={deleteCourse}>
                        <input type="hidden" name="id" value={course.id} />
                        <DeleteCourseButton />
                      </form>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-primary/50 text-sm">
                    No courses found. Create your first course to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
