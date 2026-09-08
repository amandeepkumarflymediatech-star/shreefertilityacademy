"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";

export async function createLiveClass(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== "TUTOR" && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const scheduledAt = new Date(formData.get("scheduledAt") as string);
  const meetingUrl = formData.get("meetingUrl") as string;
  const description = formData.get("description") as string;

  if (!title || !scheduledAt) {
    throw new Error("Missing required fields");
  }

  // 1. Create LiveClass
  const liveClass = await prisma.liveClass.create({
    data: {
      tutorId: session.user.id,
      title,
      description,
      scheduledAt,
      meetingUrl,
      status: "SCHEDULED"
    }
  });

  // 2. Fetch all ACTIVE Memberships that still have classes left
  const activeMemberships = await prisma.membership.findMany({
    where: { 
      status: "ACTIVE",
      usedClasses: { lt: prisma.membership.fields.maxClasses }
    },
    include: {
      student: true
    }
  });

  // 3. Enroll students and update their membership
  if (activeMemberships.length > 0) {
    const enrollments = activeMemberships.map(m => ({
      sessionId: liveClass.id,
      studentId: m.studentId,
      status: "REGISTERED"
    }));

    await prisma.classEnrollment.createMany({
      data: enrollments
    });

    // Update usedClasses
    for (const membership of activeMemberships) {
      const updatedUsedClasses = membership.usedClasses + 1;
      await prisma.membership.update({
        where: { id: membership.id },
        data: {
          usedClasses: updatedUsedClasses,
          status: updatedUsedClasses >= membership.maxClasses ? "EXPIRED" : "ACTIVE"
        }
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

    const emails = activeMemberships.map(m => m.student.email).filter(e => e);

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
  revalidatePath("/student");
}
