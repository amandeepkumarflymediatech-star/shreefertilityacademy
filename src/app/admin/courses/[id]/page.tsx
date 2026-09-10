import { Course, Chapter, Lesson } from "@/models";
import { notFound } from "next/navigation";
import CourseEditorClient from "./CourseEditorClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function CourseEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rawCourse = await Course.findByPk(id, {
    include: [{
      model: Chapter,
      as: 'chapters',
      include: [{
        model: Lesson,
        as: 'lessons',
      }]
    }],
    order: [
      [{ model: Chapter, as: 'chapters' }, 'order', 'ASC'],
      [{ model: Chapter, as: 'chapters' }, { model: Lesson, as: 'lessons' }, 'order', 'ASC']
    ]
  });

  if (!rawCourse) {
    notFound();
  }

  const course = JSON.parse(JSON.stringify(rawCourse));


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
