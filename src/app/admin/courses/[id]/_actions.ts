"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateCourseDetails(
  courseId: string, 
  data: { title: string; description: string; isPublished: boolean; coverImage?: string }
) {
  await prisma.course.update({
    where: { id: courseId },
    data
  });
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath('/admin/courses');
}

export async function createChapter(courseId: string, title: string, order: number) {
  await prisma.chapter.create({
    data: {
      courseId,
      title,
      order
    }
  });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function updateChapter(chapterId: string, title: string, courseId: string) {
  await prisma.chapter.update({
    where: { id: chapterId },
    data: { title }
  });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteChapter(chapterId: string, courseId: string) {
  await prisma.chapter.delete({
    where: { id: chapterId }
  });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function createLesson(
  chapterId: string, 
  courseId: string, 
  data: { title: string; videoUrl?: string; order: number; duration: number }
) {
  await prisma.lesson.create({
    data: {
      chapterId,
      ...data,
      isPublished: true // Default to published when created from Admin panel
    }
  });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function updateLesson(
  lessonId: string,
  courseId: string,
  data: { title: string; videoUrl?: string; duration: number; isPublished: boolean }
) {
  await prisma.lesson.update({
    where: { id: lessonId },
    data
  });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteLesson(lessonId: string, courseId: string) {
  await prisma.lesson.delete({
    where: { id: lessonId }
  });
  revalidatePath(`/admin/courses/${courseId}`);
}
