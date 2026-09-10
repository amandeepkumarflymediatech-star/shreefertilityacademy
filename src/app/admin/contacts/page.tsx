import { ContactMessage } from "@/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ContactManagementClient from "@/components/admin/ContactManagementClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminContactsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const rawContacts = await ContactMessage.findAll({
    order: [['createdAt', 'DESC']]
  });
  const contacts = JSON.parse(JSON.stringify(rawContacts));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <ContactManagementClient contacts={contacts} />
    </div>
  );
}
