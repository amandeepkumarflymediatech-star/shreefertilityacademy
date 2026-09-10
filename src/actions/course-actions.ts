"use server";

import { LessonProgress, Course, Chapter, Lesson } from "@/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleLessonProgress(lessonId: string, isCompleted: boolean) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  const studentId = session.user.id;

  const [progress, created] = await LessonProgress.findOrCreate({
    where: { studentId, lessonId },
    defaults: {
      studentId,
      lessonId,
      isCompleted,
    } as any,
  });

  if (!created) {
    await progress.update({
      isCompleted,
    });
  }

  revalidatePath("/student/courses");
  revalidatePath("/student");
  return { success: true, isCompleted };
}
