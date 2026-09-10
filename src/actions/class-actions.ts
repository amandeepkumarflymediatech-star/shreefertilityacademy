"use server";

import { LiveClass, Membership, ClassEnrollment, User } from "@/models";
import { Op, Sequelize } from "sequelize";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";

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
    const conflictTime = new Date(existingConflict.scheduledAt).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const conflictDate = new Date(existingConflict.scheduledAt).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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

    // Update usedClasses
    for (const membership of activeMemberships as any[]) {
      const updatedUsedClasses = (membership.usedClasses || 0) + 1;
      await membership.update({
        usedClasses: updatedUsedClasses,
        status: updatedUsedClasses >= membership.maxClasses ? "EXPIRED" : "ACTIVE"
      });
    }

    // 4. Send Email Notifications via Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const emails = activeMemberships.map((m: any) => m.student?.email).filter(Boolean);

    if (emails.length > 0) {
      const mailOptions = {
        from: `"Shree Fertility Academy" <${process.env.EMAIL_SERVER_USER}>`,
        bcc: emails, // Use BCC to hide other students' emails
        subject: `New Class Scheduled: ${title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #30323d;">Shree Fertility Academy - New Class Scheduled</h2>
            <p>Hello,</p>
            <p>A new live class has been scheduled as part of your IVF Mentorship.</p>
            <div style="background-color: #f2f5fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #30323d;">${title}</h3>
              <p><strong>Time:</strong> ${scheduledAt.toLocaleString()}</p>
              <p><strong>Description:</strong> ${description || 'No description provided.'}</p>
              ${meetingUrl ? `<p><strong>Meeting Link:</strong> <a href="${meetingUrl}">${meetingUrl}</a></p>` : ''}
            </div>
            <p>You have been automatically enrolled in this class. Please join on time.</p>
            <p>Best Regards,<br>Shree Fertility Academy Team</p>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Emails sent successfully");
      } catch (error) {
        console.error("Failed to send emails:", error);
      }
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
      const conflictTime = new Date(existingConflict.scheduledAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const conflictDate = new Date(existingConflict.scheduledAt).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
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

