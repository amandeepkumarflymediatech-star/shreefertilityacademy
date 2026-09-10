import SeoMetadataForm from "@/components/admin/SeoMetadataForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { SeoMetadata } from "@/models";

export default async function EditSeoPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const resolvedParams = await params;
  const seo = await SeoMetadata.findByPk(resolvedParams.id);

  if (!seo) {
    notFound();
  }

  return <SeoMetadataForm initialData={seo.toJSON() as any} />;
}


