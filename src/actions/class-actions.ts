"use server";

import { LiveClass, Membership, ClassEnrollment, User } from "@/models";
import { Op, Sequelize } from "sequelize";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";
import { formatClassDateFull, formatClassTime, formatClassDateTime } from "@/lib/date-utils";

export async function createLiveClass(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== "TUTOR" && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  const title = (formData.get("title") as string)?.trim();
  const scheduledAtStr = formData.get("scheduledAt") as string;
  const meetingUrl = (formData.get("meetingUrl") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;

  if (!title || !scheduledAtStr) {
    throw new Error("Title and scheduled date/time are required.");
  }

  const scheduledAt = new Date(scheduledAtStr);
  if (isNaN(scheduledAt.getTime())) {
    throw new Error("Invalid scheduled date and time.");
  }

  // 1. Prevent scheduling in the past (with 2-minute leeway)
  const pastThreshold = new Date(Date.now() - 2 * 60 * 1000);
  if (scheduledAt < pastThreshold) {
    throw new Error("Cannot schedule a class in the past. Please select a future date and time.");
  }

  // 2. Strict Same-Day Validation: Tutor cannot schedule more than 1 class on the same calendar day
  const startOfDay = new Date(scheduledAt);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(scheduledAt);
  endOfDay.setHours(23, 59, 59, 999);

  const existingConflict = await LiveClass.findOne({
    where: {
      tutorId: session.user.id,
      status: { [Op.notIn]: ["CANCELLED"] },
      scheduledAt: {
        [Op.between]: [startOfDay, endOfDay],
      },
    },
  });

  if (existingConflict) {
    const conflictTime = formatClassTime(existingConflict.scheduledAt);
    const conflictDate = formatClassDateFull(existingConflict.scheduledAt);
    throw new Error(
      `A class ("${existingConflict.title}") is already scheduled on ${conflictDate} at ${conflictTime}. You cannot schedule multiple classes on the same day.`
    );
  }

  // 3. Create LiveClass
  const liveClass = await LiveClass.create({
    tutorId: session.user.id,
    title,
    description: description || undefined,
    scheduledAt,
    meetingUrl: meetingUrl || undefined,
    status: "SCHEDULED"
  });

  // 2. Fetch all ACTIVE Memberships that still have classes left
  const activeMemberships = await Membership.findAll({
    where: { 
      status: "ACTIVE",
      usedClasses: { [Op.lt]: Sequelize.col('maxClasses') }
    },
    include: [{
      model: User,
      as: 'student'
    }]
  });

  // 3. Enroll students and update their membership
  if (activeMemberships.length > 0) {
    const enrollments = activeMemberships.map((m: any) => ({
      sessionId: liveClass.id,
      studentId: m.studentId,
      status: "REGISTERED"
    }));

    await ClassEnrollment.bulkCreate(enrollments);

    for (const m of activeMemberships) {
      await m.increment('usedClasses');
      if (m.usedClasses + 1 >= m.maxClasses) {
        await m.update({ status: 'COMPLETED' });
      }
    }

    // Send email notification to students (Background/Async)
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const formattedDate = formatClassDateTime(scheduledAt);

      for (const m of activeMemberships as any[]) {
        if (m.student?.email) {
          await transporter.sendMail({
            from: `"Shree Fertility Academy" <${process.env.SMTP_USER || "noreply@shreefertility.com"}>`,
            to: m.student.email,
            subject: `New Live Class Scheduled: ${title}`,
            html: `
              <h2>A new live class has been scheduled!</h2>
              <p><strong>Title:</strong> ${title}</p>
              <p><strong>Time:</strong> ${formattedDate}</p>
              <p><strong>Description:</strong> ${description || 'No description provided.'}</p>
              ${meetingUrl ? `<p><a href="${meetingUrl}" style="background-color: #0d9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Join Live Class</a></p>` : ''}
              <p>Best regards,<br/>Shree Fertility Academy</p>
            `,
          });
        }
      }
    } catch (emailError) {
      console.error("Failed to send class announcement emails:", emailError);
    }
  }

  revalidatePath("/tutor/classes");
  revalidatePath("/tutor");
  revalidatePath("/student");
}

export async function updateLiveClass(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "TUTOR" && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  const title = (formData.get("title") as string)?.trim();
  const scheduledAtStr = formData.get("scheduledAt") as string;
  const meetingUrl = (formData.get("meetingUrl") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const recordingUrl = (formData.get("recordingUrl") as string)?.trim() || null;
  const status = (formData.get("status") as string)?.trim() || "SCHEDULED";

  if (!title) {
    throw new Error("Title is required");
  }

  const data: any = {
    title,
    meetingUrl,
    description,
    recordingUrl,
    status,
  };

  if (scheduledAtStr) {
    const scheduledAt = new Date(scheduledAtStr);
    if (isNaN(scheduledAt.getTime())) {
      throw new Error("Invalid scheduled date and time.");
    }

    // Same-Day conflict check with other classes
    const startOfDay = new Date(scheduledAt);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(scheduledAt);
    endOfDay.setHours(23, 59, 59, 999);

    const existingConflict = await LiveClass.findOne({
      where: {
        id: { [Op.ne]: id },
        tutorId: session.user.id,
        status: { [Op.notIn]: ["CANCELLED"] },
        scheduledAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    if (existingConflict) {
      const conflictTime = formatClassTime(existingConflict.scheduledAt);
      const conflictDate = formatClassDateFull(existingConflict.scheduledAt);
      throw new Error(
        `A class ("${existingConflict.title}") is already scheduled on ${conflictDate} at ${conflictTime}. You cannot schedule multiple classes on the same day.`
      );
    }

    data.scheduledAt = scheduledAt;
  }

  await LiveClass.update(data, {
    where: { id }
  });

  revalidatePath("/tutor/classes");
  revalidatePath("/tutor");
  revalidatePath("/student");
}

export async function deleteLiveClass(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "TUTOR" && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  await ClassEnrollment.destroy({
    where: { sessionId: id }
  });

  await LiveClass.destroy({
    where: { id }
  });

  revalidatePath("/tutor/classes");
  revalidatePath("/tutor");
  revalidatePath("/student");
}

export async function recordClassAttendance(sessionId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  const studentId = session.user.id;

  const enrollment = await ClassEnrollment.findOne({
    where: { sessionId, studentId },
  });

  if (enrollment) {
    if (enrollment.status !== "ATTENDED") {
      await enrollment.update({ status: "ATTENDED" });
    }
  } else {
    await ClassEnrollment.create({
      sessionId,
      studentId,
      status: "ATTENDED",
    });
  }

  revalidatePath("/student/classes");
  revalidatePath("/student");
  revalidatePath("/tutor/classes");
  revalidatePath("/tutor/students");
  revalidatePath("/tutor");

  return { success: true };
}


