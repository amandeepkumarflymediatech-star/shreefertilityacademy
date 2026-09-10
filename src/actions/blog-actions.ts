"use server";

import { BlogPost } from "@/models";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createBlogPost(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const tags = formData.get("tags") as string;
  const coverImage = formData.get("coverImage") as string | null;
  const published = formData.get("published") === "true";

  await BlogPost.create({
    title,
    slug,
    content,
    excerpt: excerpt || undefined,
    tags: tags || undefined,
    coverImage: coverImage || undefined,
    published,
    authorId: session.user.id
  });

  revalidatePath("/admin/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const tags = formData.get("tags") as string;
  const coverImage = formData.get("coverImage") as string | null;
  const published = formData.get("published") === "true";

  await BlogPost.update(
    { title, slug, content, excerpt: excerpt || undefined, tags: tags || undefined, coverImage: coverImage || undefined, published },
    { where: { id } }
  );

  revalidatePath("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await BlogPost.destroy({
    where: { id }
  });

  revalidatePath("/admin/blog");
}
