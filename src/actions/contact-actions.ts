"use server";

import { ContactMessage } from "@/models";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function updateContactStatus(id: string, status: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await ContactMessage.update(
    { status },
    { where: { id } }
  );

  revalidatePath("/admin/contacts");
}

export async function deleteContact(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await ContactMessage.destroy({
    where: { id }
  });

  revalidatePath("/admin/contacts");
}

