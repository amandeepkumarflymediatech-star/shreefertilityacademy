'use server';

import { LiveClass } from "@/models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateMeetingLink(classId: string, url: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'TUTOR') {
    throw new Error('Unauthorized');
  }

  // Verify the class belongs to this tutor
  const liveClass = await LiveClass.findOne({
    where: { id: classId }
  });

  if (!liveClass || liveClass.tutorId !== session.user.id) {
    throw new Error('Unauthorized or class not found');
  }

  await LiveClass.update(
    { meetingUrl: url },
    { where: { id: classId } }
  );

  revalidatePath('/tutor');
  return { success: true };
}
