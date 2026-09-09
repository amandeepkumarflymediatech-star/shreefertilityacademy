import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import CourseEditorClient from "./CourseEditorClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function CourseEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      chapters: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' }
          }
        }
      }
    }
  });

  if (!course) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link 
        href="/admin/courses"
        className="inline-flex items-center gap-2 text-xs font-bold text-primary/50 hover:text-accent uppercase tracking-widest transition-colors"
      >
        <ArrowLeft size={14} /> Back to Courses
      </Link>
      
      <CourseEditorClient initialCourse={course} />
    </div>
  );
}
