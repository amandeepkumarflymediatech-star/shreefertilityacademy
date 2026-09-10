import BlogPostForm from "@/components/admin/BlogPostForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { BlogPost } from "@/models";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const resolvedParams = await params;
  const post = await BlogPost.findByPk(resolvedParams.id);

  if (!post) {
    notFound();
  }

  return <BlogPostForm initialData={post.toJSON() as any} />;
}


