'use server';

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateMeetingLink(classId: string, url: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'TUTOR') {
    throw new Error('Unauthorized');
  }

  // Verify the class belongs to this tutor
  const liveClass = await prisma.liveClass.findUnique({
    where: { id: classId }
  });

  if (!liveClass || liveClass.tutorId !== session.user.id) {
    throw new Error('Unauthorized or class not found');
  }

  await prisma.liveClass.update({
    where: { id: classId },
    data: { meetingUrl: url }
  });

  revalidatePath('/tutor');
  return { success: true };
}
