"use server";

import { Course, Chapter, Lesson } from "@/models";
import { revalidatePath } from "next/cache";

export async function updateCourseDetails(
  courseId: string, 
  data: { title: string; description: string; isPublished: boolean; coverImage?: string }
) {
  await Course.update(data, {
    where: { id: courseId }
  });
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath('/admin/courses');
}

export async function createChapter(courseId: string, title: string, order: number) {
  await Chapter.create({
    courseId,
    title,
    order
  });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function updateChapter(chapterId: string, title: string, courseId: string) {
  await Chapter.update(
    { title },
    { where: { id: chapterId } }
  );
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteChapter(chapterId: string, courseId: string) {
  const lessons = await Lesson.findAll({ where: { chapterId }, attributes: ['id'] });
  const lessonIds = lessons.map((l: any) => l.id);
  if (lessonIds.length > 0) {
    const { LessonProgress } = await import("@/models");
    const { Op } = await import("sequelize");
    await LessonProgress.destroy({ where: { lessonId: { [Op.in]: lessonIds } } });
    await Lesson.destroy({ where: { id: { [Op.in]: lessonIds } } });
  }
  await Chapter.destroy({
    where: { id: chapterId }
  });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function createLesson(
  chapterId: string, 
  courseId: string, 
  data: { title: string; videoUrl?: string; order: number; duration: number }
) {
  await Lesson.create({
    chapterId,
    ...data,
    isPublished: true // Default to published when created from Admin panel
  });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function updateLesson(
  lessonId: string,
  courseId: string,
  data: { title: string; videoUrl?: string; duration: number; isPublished: boolean }
) {
  await Lesson.update(data, {
    where: { id: lessonId }
  });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteLesson(lessonId: string, courseId: string) {
  const { LessonProgress } = await import("@/models");
  await LessonProgress.destroy({ where: { lessonId } });
  await Lesson.destroy({
    where: { id: lessonId }
  });
  revalidatePath(`/admin/courses/${courseId}`);
}


