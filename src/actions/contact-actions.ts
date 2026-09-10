"use server";

import { ContactMessage } from "@/models";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { sendContactUserConfirmation, sendContactAdminNotification } from "@/lib/email";

export async function submitContactMessage(data: {
  name: string;
  email: string;
  subject?: string;
  studyPreference?: string;
  message: string;
}) {
  try {
    const name = data.name?.trim();
    const email = data.email?.trim();
    const studyPreference = (data.subject || data.studyPreference || "General Inquiry").trim();
    const message = data.message?.trim();

    if (!name || !email || !message) {
      return { success: false, error: "Name, email, and message are required." };
    }

    const created = await ContactMessage.create({
      name,
      email,
      studyPreference,
      message,
      status: "UNREAD",
      createdAt: new Date(),
    } as any);

    // Non-blocking notification emails
    Promise.all([
      sendContactUserConfirmation(email),
      sendContactAdminNotification({ name, email, studyPreference, message })
    ]).catch(err => {
      console.error("Non-blocking contact email failed to send:", err);
    });

    revalidatePath("/admin/contacts");
    return { success: true, id: created.id };
  } catch (error: any) {
    console.error("Error submitting contact message:", error);
    return { success: false, error: error.message || "Failed to submit message." };
  }
}

export async function updateContactStatus(id: string, status: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await ContactMessage.update(
    { status },
    { where: { id } }
  );

  revalidatePath("/admin/contacts");
  return { success: true };
}

export async function deleteContact(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await ContactMessage.destroy({
    where: { id }
  });

  revalidatePath("/admin/contacts");
  return { success: true };
}
