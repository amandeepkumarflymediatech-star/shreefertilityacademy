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
    { 
      isApproved,
      onboardingStatus: isApproved ? "APPROVED" : "UNDER_REVIEW"
    },
    { where: { id } }
  );

  revalidatePath("/admin/tutors");
  revalidatePath("/admin/users");
  revalidatePath("/mentors");
}

export async function createTutor(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const timezone = (formData.get("timezone") as string)?.trim() || "Asia/Kolkata";
  const bio = (formData.get("bio") as string)?.trim() || null;
  const experience = (formData.get("experience") as string)?.trim() || null;
  const qualifications = (formData.get("qualifications") as string)?.trim() || null;
  const languages = (formData.get("languages") as string)?.trim() || null;
  const teachingHeadline = (formData.get("teachingHeadline") as string)?.trim() || null;
  const teachingLevels = (formData.get("teachingLevels") as string)?.trim() || null;
  const teachingAges = (formData.get("teachingAges") as string)?.trim() || null;
  const teachingStyle = (formData.get("teachingStyle") as string)?.trim() || null;
  const isApproved = formData.get("isApproved") === "true" || formData.get("isApproved") === "on";
  const image = (formData.get("image") as string)?.trim() || null;

  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required");
  }

  // Check if email already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("A user with this email address already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
    role: "TUTOR",
    phone,
    timezone,
    bio,
    experience,
    qualifications,
    languages,
    teachingHeadline,
    teachingLevels,
    teachingAges,
    teachingStyle,
    isApproved,
    onboardingStatus: isApproved ? "APPROVED" : "UNDER_REVIEW",
    image,
    isActive: true,
  } as any);

  revalidatePath("/admin/tutors");
  revalidatePath("/admin/users");
  revalidatePath("/mentors");
}

export async function updateTutor(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const timezone = (formData.get("timezone") as string)?.trim() || "Asia/Kolkata";
  const bio = (formData.get("bio") as string)?.trim() || null;
  const experience = (formData.get("experience") as string)?.trim() || null;
  const qualifications = (formData.get("qualifications") as string)?.trim() || null;
  const languages = (formData.get("languages") as string)?.trim() || null;
  const teachingHeadline = (formData.get("teachingHeadline") as string)?.trim() || null;
  const teachingLevels = (formData.get("teachingLevels") as string)?.trim() || null;
  const teachingAges = (formData.get("teachingAges") as string)?.trim() || null;
  const teachingStyle = (formData.get("teachingStyle") as string)?.trim() || null;
  const isApproved = formData.get("isApproved") === "true" || formData.get("isApproved") === "on";
  const image = (formData.get("image") as string)?.trim();

  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  const data: any = {
    name,
    email,
    phone,
    timezone,
    bio,
    experience,
    qualifications,
    languages,
    teachingHeadline,
    teachingLevels,
    teachingAges,
    teachingStyle,
    isApproved,
    onboardingStatus: isApproved ? "APPROVED" : "UNDER_REVIEW",
  };

  if (image !== undefined) {
    data.image = image && image.length > 0 ? image : null;
  }

  if (password && password.trim().length > 0) {
    data.password = await bcrypt.hash(password.trim(), 10);
  }

  await User.update(data, {
    where: { id }
  });

  revalidatePath("/admin/tutors");
  revalidatePath("/admin/users");
  revalidatePath("/mentors");
}

export async function deleteTutor(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const { Account, NextAuthSession, ClassEnrollment, LiveClass, Review, Order } = await import("@/models");
  const { Op } = await import("sequelize");

  // Clean up classes taught by this tutor and their enrollments
  const classes = await LiveClass.findAll({ where: { tutorId: id }, attributes: ['id'] });
  const classIds = classes.map((c: any) => c.id);
  if (classIds.length > 0) {
    await ClassEnrollment.destroy({ where: { sessionId: { [Op.in]: classIds } } });
    await LiveClass.destroy({ where: { tutorId: id } });
  }

  await Account.destroy({ where: { userId: id } });
  await NextAuthSession.destroy({ where: { userId: id } });
  await Review.destroy({ where: { [Op.or]: [{ tutorId: id }, { studentId: id }] } });
  await Order.destroy({ where: { studentId: id } });

  await User.destroy({
    where: { id }
  });

  revalidatePath("/admin/tutors");
  revalidatePath("/admin/users");
  revalidatePath("/mentors");
}

