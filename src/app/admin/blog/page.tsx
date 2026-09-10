import { BlogPost, User } from "@/models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import BlogManagementClient from "@/components/admin/BlogManagementClient";

export default async function AdminBlogPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const rawPosts = await BlogPost.findAll({
    include: [{
      model: User,
      as: 'author',
      attributes: ['name', 'email']
    }],
    order: [['createdAt', 'DESC']]
  });

  const posts = JSON.parse(JSON.stringify(rawPosts));


  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <BlogManagementClient posts={posts} />
    </div>
  );
}
