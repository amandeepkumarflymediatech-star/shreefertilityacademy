import { SeoMetadata } from "@/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SeoManagementClient from "@/components/admin/SeoManagementClient";

export default async function AdminSeoPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const seoList = await SeoMetadata.findAll({
    order: [['updatedAt', 'DESC']]
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <SeoManagementClient seoList={seoList} />
    </div>
  );
}
