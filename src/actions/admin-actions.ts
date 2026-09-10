"use server";

import bcrypt from "bcryptjs";

import { User } from "@/models";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as any;
  const password = formData.get("password") as string;

  if (!email || !password || !role) {
    throw new Error("Missing required fields");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    role,
    password: hashedPassword,
  });

  revalidatePath("/admin/users");
}

export async function updateUser(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as any;
  const password = formData.get("password") as string;

  if (!email || !role) {
    throw new Error("Missing required fields");
  }

  const data: any = { name, email, role };

  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  await User.update(data, {
    where: { id }
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(id: string) {
  const { Account, NextAuthSession, ClassEnrollment, LiveClass, Membership, LessonProgress, Review, Order } = await import("@/models");
  const { Op } = await import("sequelize");

  await Account.destroy({ where: { userId: id } });
  await NextAuthSession.destroy({ where: { userId: id } });
  await ClassEnrollment.destroy({ where: { studentId: id } });
  await LiveClass.destroy({ where: { tutorId: id } });
  await Membership.destroy({ where: { studentId: id } });
  await LessonProgress.destroy({ where: { studentId: id } });
  await Review.destroy({ where: { [Op.or]: [{ tutorId: id }, { studentId: id }] } });
  await Order.destroy({ where: { studentId: id } });

  await User.destroy({
    where: { id }
  });

  revalidatePath("/admin/users");
}


export async function approveTutor(id: string, isApproved: boolean) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await User.update(
    { isApproved },
    { where: { id } }
  );

  revalidatePath("/admin/tutors");
}

