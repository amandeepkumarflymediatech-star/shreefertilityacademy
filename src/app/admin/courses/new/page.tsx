import { Course } from "@/models";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

async function createCourse(formData: FormData) {
  "use server";
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  
  if (!title) return;

  const course = await Course.create({
    title,
    description: description || undefined,
    isPublished: false,
  });

  redirect(`/admin/courses/${course.id}`);
}


export default function NewCoursePage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/courses" className="w-10 h-10 bg-white border border-secondary/20 rounded-full flex items-center justify-center text-primary/50 hover:text-primary hover:border-primary/20 transition-all">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-primary font-playfair tracking-tight">Create New Course</h1>
          <p className="text-primary/60 text-sm mt-1">Start building your pre-recorded curriculum.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-secondary/20 p-8">
        <form action={createCourse} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-bold text-primary uppercase tracking-widest">Course Title <span className="text-accent">*</span></label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              required
              placeholder="e.g., Reproductive Medicine Fellowship Core"
              className="w-full bg-secondary/5 border border-secondary/10 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium text-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-bold text-primary uppercase tracking-widest">Description</label>
            <textarea 
              id="description" 
              name="description" 
              rows={4}
              placeholder="Brief overview of the course content..."
              className="w-full bg-secondary/5 border border-secondary/10 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium text-primary resize-none"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-secondary/10 flex justify-end">
            <button type="submit" className="flex items-center gap-2 bg-accent hover:bg-primary text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg">
              <Save size={18} /> Create & Add Chapters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
