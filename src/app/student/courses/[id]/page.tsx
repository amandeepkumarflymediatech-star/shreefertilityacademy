import { Course, Chapter, Lesson, LessonProgress, Membership } from "@/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import CoursePlayerClient from "./CoursePlayerClient";

export default async function StudentCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const { id } = await params;

  // Check active membership
  const activeMemberships = await Membership.findAll({
    where: { studentId: session.user.id, status: "ACTIVE" },
  });

  if (activeMemberships.length === 0) {
    redirect("/pricing");
  }

  // Fetch course with chapters and lessons
  const rawCourse = await Course.findByPk(id, {
    include: [
      {
        model: Chapter,
        as: "chapters",
        include: [
          {
            model: Lesson,
            as: "lessons",
            where: { isPublished: true },
            required: false,
          },
        ],
      },
    ],
    order: [
      [{ model: Chapter, as: "chapters" }, "order", "ASC"],
      [{ model: Chapter, as: "chapters" }, { model: Lesson, as: "lessons" }, "order", "ASC"],
    ],
  });

  if (!rawCourse) {
    notFound();
  }

  const course = JSON.parse(JSON.stringify(rawCourse));

  // Collect all lesson IDs from this course to fetch student's completion progress
  const allLessonIds: string[] = [];
  course.chapters?.forEach((ch: any) => {
    ch.lessons?.forEach((l: any) => {
      allLessonIds.push(l.id);
    });
  });

  const progressRecords = await LessonProgress.findAll({
    where: {
      studentId: session.user.id,
      lessonId: allLessonIds,
      isCompleted: true,
    },
    attributes: ["lessonId"],
  });

  const completedLessonIds = progressRecords.map((p) => p.lessonId);

  return (
    <CoursePlayerClient
      course={course}
      initialCompletedLessonIds={completedLessonIds}
    />
  );
}
