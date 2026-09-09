"use client";

import { useState } from "react";
import { Plus, GripVertical, Video, Trash2, Edit2, Check, X, ChevronDown, ChevronRight, Save } from "lucide-react";
import { toast } from "sonner";
import { 
  updateCourseDetails, 
  createChapter, 
  updateChapter, 
  deleteChapter, 
  createLesson, 
  updateLesson, 
  deleteLesson 
} from "./_actions";
import { useRouter } from "next/navigation";

type Lesson = {
  id: string;
  title: string;
  videoUrl: string | null;
  duration: number;
  isPublished: boolean;
  order: number;
};

type Chapter = {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
};

type Course = {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  isPublished: boolean;
  chapters: Chapter[];
};

export default function CourseEditorClient({ initialCourse }: { initialCourse: Course }) {
  const router = useRouter();
  const [course, setCourse] = useState(initialCourse);
  const [isSaving, setIsSaving] = useState(false);
  
  // UI State
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>(
    Object.fromEntries(initialCourse.chapters.map(c => [c.id, true]))
  );
  
  // Edit States
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editChapterTitle, setEditChapterTitle] = useState("");
  
  const [addingLessonToChapter, setAddingLessonToChapter] = useState<string | null>(null);
  const [newLessonData, setNewLessonData] = useState({ title: "", videoUrl: "", duration: 0 });

  const toggleChapter = (id: string) => {
    setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- Course Level Handlers ---
  const handleSaveCourseDetails = async () => {
    setIsSaving(true);
    try {
      await updateCourseDetails(course.id, {
        title: course.title,
        description: course.description || "",
        isPublished: course.isPublished,
        coverImage: course.coverImage || ""
      });
      toast.success("Course details saved!");
    } catch (e) {
      toast.error("Failed to save course details");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Chapter Handlers ---
  const handleAddChapter = async () => {
    const newOrder = course.chapters.length;
    try {
      await createChapter(course.id, `Module ${newOrder + 1}: New Chapter`, newOrder);
      toast.success("Chapter added!");
      // We rely on Next.js revalidatePath to refresh data, but we can also hard refresh
      router.refresh();
    } catch (e) {
      toast.error("Failed to add chapter");
    }
  };

  const handleSaveChapterEdit = async (chapterId: string) => {
    try {
      await updateChapter(chapterId, editChapterTitle, course.id);
      setEditingChapterId(null);
      toast.success("Chapter updated!");
      router.refresh();
    } catch (e) {
      toast.error("Failed to update chapter");
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm("Are you sure? All lessons in this chapter will be deleted.")) return;
    try {
      await deleteChapter(chapterId, course.id);
      toast.success("Chapter deleted");
      router.refresh();
    } catch (e) {
      toast.error("Failed to delete chapter");
    }
  };

  // --- Lesson Handlers ---
  const handleAddLessonSubmit = async (chapterId: string, currentLessonsCount: number) => {
    if (!newLessonData.title) return toast.error("Lesson title is required");
    
    try {
      await createLesson(chapterId, course.id, {
        title: newLessonData.title,
        videoUrl: newLessonData.videoUrl,
        duration: Number(newLessonData.duration),
        order: currentLessonsCount
      });
      setAddingLessonToChapter(null);
      setNewLessonData({ title: "", videoUrl: "", duration: 0 });
      toast.success("Lesson added!");
      router.refresh();
    } catch (e) {
      toast.error("Failed to add lesson");
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Delete this lesson?")) return;
    try {
      await deleteLesson(lessonId, course.id);
      toast.success("Lesson deleted");
      router.refresh();
    } catch (e) {
      toast.error("Failed to delete lesson");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/20 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight font-playfair">
            Edit Course: {initialCourse.title}
          </h1>
          <p className="text-primary/60 mt-1 text-sm">Manage curriculum and publish settings.</p>
        </div>
        <button 
          onClick={handleSaveCourseDetails}
          disabled={isSaving}
          className="flex items-center gap-2 bg-accent hover:bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50"
        >
          <Save size={18} /> {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-secondary/20 p-6 rounded-2xl shadow-sm space-y-5">
            <h2 className="text-lg font-black text-primary font-playfair tracking-tight border-b border-secondary/10 pb-3">
              Course Details
            </h2>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary/60 uppercase tracking-widest">Title</label>
              <input 
                type="text" 
                value={course.title}
                onChange={(e) => setCourse({...course, title: e.target.value})}
                className="w-full bg-secondary/5 border border-secondary/20 rounded-xl px-4 py-2.5 text-sm font-bold text-primary outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary/60 uppercase tracking-widest">Description</label>
              <textarea 
                rows={4}
                value={course.description || ""}
                onChange={(e) => setCourse({...course, description: e.target.value})}
                className="w-full bg-secondary/5 border border-secondary/20 rounded-xl px-4 py-3 text-sm text-primary outline-none focus:border-accent transition-colors resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary/60 uppercase tracking-widest">Status</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    checked={course.isPublished} 
                    onChange={() => setCourse({...course, isPublished: true})}
                    className="accent-accent w-4 h-4"
                  />
                  <span className="text-sm font-bold text-primary">Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    checked={!course.isPublished} 
                    onChange={() => setCourse({...course, isPublished: false})}
                    className="accent-accent w-4 h-4"
                  />
                  <span className="text-sm font-bold text-primary">Draft</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Curriculum Builder */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-secondary/20 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b border-secondary/10 pb-4">
              <h2 className="text-xl font-black text-primary font-playfair tracking-tight">
                Curriculum
              </h2>
              <button 
                onClick={handleAddChapter}
                className="text-xs font-bold text-accent bg-accent/10 hover:bg-accent hover:text-white px-4 py-2 rounded-full uppercase tracking-widest transition-colors flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Chapter
              </button>
            </div>

            <div className="space-y-4">
              {initialCourse.chapters.map((chapter) => (
                <div key={chapter.id} className="border border-secondary/20 rounded-xl overflow-hidden bg-white shadow-sm">
                  {/* Chapter Header */}
                  <div className="bg-secondary/5 px-4 py-3 flex items-center justify-between border-b border-secondary/10 group">
                    <div className="flex items-center gap-3 flex-1">
                      <GripVertical size={16} className="text-primary/30 cursor-grab" />
                      
                      {editingChapterId === chapter.id ? (
                        <div className="flex items-center gap-2 flex-1 mr-4">
                          <input 
                            type="text" 
                            autoFocus
                            value={editChapterTitle}
                            onChange={(e) => setEditChapterTitle(e.target.value)}
                            className="flex-1 bg-white border border-accent/50 rounded-md px-3 py-1.5 text-sm font-bold text-primary outline-none focus:ring-1 focus:ring-accent"
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveChapterEdit(chapter.id)}
                          />
                          <button onClick={() => handleSaveChapterEdit(chapter.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-md"><Check size={16}/></button>
                          <button onClick={() => setEditingChapterId(null)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md"><X size={16}/></button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => toggleChapter(chapter.id)}
                          className="flex items-center gap-2 font-bold text-primary hover:text-accent transition-colors flex-1 text-left"
                        >
                          {expandedChapters[chapter.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                          {chapter.title}
                        </button>
                      )}
                    </div>
                    
                    {!editingChapterId && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditChapterTitle(chapter.title);
                            setEditingChapterId(chapter.id);
                          }}
                          className="p-1.5 text-primary/40 hover:text-accent rounded-md transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteChapter(chapter.id)}
                          className="p-1.5 text-primary/40 hover:text-red-500 rounded-md transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Chapter Lessons */}
                  {expandedChapters[chapter.id] && (
                    <div className="p-4 space-y-3">
                      {chapter.lessons.length === 0 ? (
                        <p className="text-xs text-primary/40 text-center py-2 italic">No lessons in this chapter.</p>
                      ) : (
                        chapter.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg border border-secondary/10 hover:border-secondary/30 hover:shadow-sm bg-white transition-all group">
                            <div className="flex items-center gap-3">
                              <GripVertical size={14} className="text-primary/20 cursor-grab" />
                              <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                                <Video size={14} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-primary">{lesson.title}</p>
                                <p className="text-[10px] text-primary/50 uppercase tracking-widest mt-0.5">
                                  {lesson.duration} mins • {lesson.isPublished ? "Published" : "Draft"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleDeleteLesson(lesson.id)}
                                className="p-1.5 text-primary/40 hover:text-red-500 rounded-md transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}

                      {/* Add Lesson Form */}
                      {addingLessonToChapter === chapter.id ? (
                        <div className="mt-3 p-4 border border-accent/30 rounded-lg bg-accent/5 space-y-3">
                          <div>
                            <label className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Lesson Title</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Introduction to Protocol"
                              value={newLessonData.title}
                              onChange={e => setNewLessonData({...newLessonData, title: e.target.value})}
                              className="w-full mt-1 bg-white border border-secondary/20 rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Video URL (optional)</label>
                              <input 
                                type="text" 
                                placeholder="https://youtube.com/..."
                                value={newLessonData.videoUrl}
                                onChange={e => setNewLessonData({...newLessonData, videoUrl: e.target.value})}
                                className="w-full mt-1 bg-white border border-secondary/20 rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Duration (mins)</label>
                              <input 
                                type="number" 
                                value={newLessonData.duration}
                                onChange={e => setNewLessonData({...newLessonData, duration: Number(e.target.value)})}
                                className="w-full mt-1 bg-white border border-secondary/20 rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end pt-2">
                            <button 
                              onClick={() => setAddingLessonToChapter(null)}
                              className="px-3 py-1.5 text-xs font-bold text-primary/60 hover:text-primary transition-colors"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => handleAddLessonSubmit(chapter.id, chapter.lessons.length)}
                              className="px-4 py-1.5 text-xs font-bold text-white bg-accent rounded-md hover:bg-primary transition-colors shadow-sm"
                            >
                              Save Lesson
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setAddingLessonToChapter(chapter.id)}
                          className="mt-2 w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-primary/50 hover:text-accent hover:bg-accent/5 rounded-lg border border-dashed border-secondary/30 transition-all"
                        >
                          <Plus size={14} /> Add Lesson
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
