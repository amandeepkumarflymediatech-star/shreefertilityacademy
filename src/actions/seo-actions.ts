"use server";

import { SeoMetadata } from "@/models";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createSeo(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const pagePath = formData.get("pagePath") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const keywords = formData.get("keywords") as string;
  const ogImage = formData.get("ogImage") as string;
  const canonicalUrl = formData.get("canonicalUrl") as string;
  const ogTitle = formData.get("ogTitle") as string;
  const ogDescription = formData.get("ogDescription") as string;
  const headerScripts = formData.get("headerScripts") as string;
  const footerScripts = formData.get("footerScripts") as string;

  await SeoMetadata.create({
    pagePath,
    title,
    description: description || undefined,
    keywords: keywords || undefined,
    ogImage: ogImage || undefined,
    canonicalUrl: canonicalUrl || undefined,
    ogTitle: ogTitle || undefined,
    ogDescription: ogDescription || undefined,
    headerScripts: headerScripts || undefined,
    footerScripts: footerScripts || undefined,
  });

  revalidatePath("/admin/seo");
}

export async function updateSeo(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const pagePath = formData.get("pagePath") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const keywords = formData.get("keywords") as string;
  const ogImage = formData.get("ogImage") as string;
  const canonicalUrl = formData.get("canonicalUrl") as string;
  const ogTitle = formData.get("ogTitle") as string;
  const ogDescription = formData.get("ogDescription") as string;
  const headerScripts = formData.get("headerScripts") as string;
  const footerScripts = formData.get("footerScripts") as string;

  await SeoMetadata.update(
    {
      pagePath,
      title,
      description: description || undefined,
      keywords: keywords || undefined,
      ogImage: ogImage || undefined,
      canonicalUrl: canonicalUrl || undefined,
      ogTitle: ogTitle || undefined,
      ogDescription: ogDescription || undefined,
      headerScripts: headerScripts || undefined,
      footerScripts: footerScripts || undefined,
    },
    { where: { id } }
  );

  revalidatePath("/admin/seo");
}

export async function deleteSeo(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await SeoMetadata.destroy({
    where: { id }
  });

  revalidatePath("/admin/seo");
}
