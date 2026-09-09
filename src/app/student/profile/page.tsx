import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileForm from "./_components/ProfileForm";

export default async function StudentProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans max-w-5xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/10 pb-6 relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl -z-10 pointer-events-none translate-x-1/4 -translate-y-1/2"></div>
        <div>
          <h4 className="text-accent font-bold tracking-widest uppercase mb-2 text-xs flex items-center gap-2">
            Account
          </h4>
          <h1 className="text-4xl sm:text-5xl font-black text-primary tracking-tight font-playfair">My Profile</h1>
          <p className="text-primary/70 mt-3 font-sans text-lg max-w-xl">Manage your personal information, display picture, and contact details.</p>
        </div>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
