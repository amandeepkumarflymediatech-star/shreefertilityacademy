import { User } from "@/models";
import { Op } from "sequelize";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserManagementClient from "@/components/admin/UserManagementClient";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const userInstances = await User.findAll({
    where: {
      id: {
        [Op.ne]: session.user.id
      }
    },
    order: [['createdAt', 'DESC']]
  });
  
  const users = userInstances.map(u => u.get({ plain: true }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <UserManagementClient users={users} />
    </div>
  );
}
