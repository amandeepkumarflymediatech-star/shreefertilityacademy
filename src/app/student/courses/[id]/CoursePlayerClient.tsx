"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  PlayCircle, 
  Clock, 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  Video, 
  Check, 
  FileText, 
  Sparkles,
  Award,
  Layers
} from "lucide-react";
import { toggleLessonProgress } from "@/actions/course-actions";
import { toast } from "sonner";

export type LessonType = {
  id: string;
  chapterId: string;
  title: string;
  content?: string | null;
  videoUrl?: string | null;
  duration?: number | null;
  order: number;
  isPublished?: boolean;
};

export type ChapterType = {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: LessonType[];
};

export type CourseType = {
  id: string;
  title: string;
  description?: string | null;
  coverImage?: string | null;
  chapters: ChapterType[];
};

export default function CoursePlayerClient({
  course,
  initialCompletedLessonIds,
}: {
  course: CourseType;
  initialCompletedLessonIds: string[];
}) {
  // Flatten all lessons in sequential order
  const allLessons = useMemo(() => {
    const list: { lesson: LessonType; chapterTitle: string; chapterIndex: number }[] = [];
    course.chapters.forEach((ch, chIdx) => {
      ch.lessons.forEach((les) => {
        list.push({
          lesson: les,
          chapterTitle: ch.title,
          chapterIndex: chIdx + 1,
        });
      });
    });
    return list;
  }, [course]);

  const [activeLessonId, setActiveLessonId] = useState<string>(
    allLessons[0]?.lesson.id || ""
  );
  const [completedIds, setCompletedIds] = useState<string[]>(initialCompletedLessonIds);
  const [isPending, startTransition] = useTransition();

  const activeLessonInfo = useMemo(() => {
    return allLessons.find((item) => item.lesson.id === activeLessonId) || allLessons[0];
  }, [allLessons, activeLessonId]);

  const activeLessonIndex = useMemo(() => {
    return allLessons.findIndex((item) => item.lesson.id === activeLessonId);
  }, [allLessons, activeLessonId]);

  const hasPrev = activeLessonIndex > 0;
  const hasNext = activeLessonIndex < allLessons.length - 1;

  const isCurrentCompleted = activeLessonInfo
    ? completedIds.includes(activeLessonInfo.lesson.id)
    : false;

  const progressPercentage = useMemo(() => {
    if (allLessons.length === 0) return 0;
    return Math.round((completedIds.length / allLessons.length) * 100);
  }, [allLessons.length, completedIds.length]);

  const handleToggleComplete = () => {
    if (!activeLessonInfo) return;
    const lessonId = activeLessonInfo.lesson.id;
    const nextState = !isCurrentCompleted;

    // Optimistic UI update
    setCompletedIds((prev) =>
      nextState ? [...prev, lessonId] : prev.filter((id) => id !== lessonId)
    );

    startTransition(async () => {
      try {
        await toggleLessonProgress(lessonId, nextState);
        if (nextState) {
          toast.success("Lesson marked as completed! Great progress! 🎉");
        } else {
          toast.info("Lesson marked as uncompleted.");
        }
      } catch (error: any) {
        // Rollback
        setCompletedIds((prev) =>
          !nextState ? [...prev, lessonId] : prev.filter((id) => id !== lessonId)
        );
        toast.error("Failed to update progress.");
      }
    });
  };

  // Helper to construct embeddable video URL (e.g. YouTube)
  const getEmbedVideoUrl = (url?: string | null) => {
    if (!url) return null;
    try {
      if (url.includes("youtube.com/watch")) {
        const urlObj = new URL(url);
        const v = urlObj.searchParams.get("v");
        return `https://www.youtube.com/embed/${v}?autoplay=0&rel=0`;
      }
      if (url.includes("youtu.be/")) {
        const id = url.split("youtu.be/")[1]?.split("?")[0];
        return `https://www.youtube.com/embed/${id}?autoplay=0&rel=0`;
      }
      if (url.includes("youtube.com/embed/")) {
        return url;
      }
      return url;
    } catch {
      return url;
    }
  };

  const embedUrl = getEmbedVideoUrl(activeLessonInfo?.lesson.videoUrl);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-secondary/30 pb-4">
        <div>
          <Link
            href="/student/courses"
            className="inline-flex items-center gap-2 text-xs font-bold text-primary/60 hover:text-accent uppercase tracking-widest transition-colors mb-1"
          >
            <ArrowLeft size={14} /> Back to My Courses
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-primary font-playfair tracking-tight">
            {course.title}
          </h1>
        </div>

        {/* Course Progress Indicator */}
        <div className="bg-white px-5 py-3 rounded-2xl border border-secondary/30 shadow-sm flex items-center gap-4 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-black text-xs shrink-0">
            {progressPercentage}%
          </div>
          <div className="flex-1 sm:w-44">
            <div className="flex justify-between text-[11px] font-bold text-primary/70 mb-1">
              <span>Progress</span>
              <span>{completedIds.length} / {allLessons.length} Completed</span>
            </div>
            <div className="w-full h-2 bg-secondary/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Video Player on Left, Syllabus on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* VIDEO PLAYER & LESSON DETAILS (7 or 8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Video Container */}
          <div className="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video border border-secondary/30 relative flex items-center justify-center">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={activeLessonInfo?.lesson.title || "Lesson Video"}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="text-center p-8 text-white/70 space-y-3">
                <Video className="w-16 h-16 mx-auto text-white/30" />
                <h3 className="text-lg font-bold font-playfair">Video Not Uploaded Yet</h3>
                <p className="text-xs text-white/50 max-w-sm mx-auto">
                  This lesson module contains clinical study notes and worksheets below. The lecture video will be updated shortly.
                </p>
              </div>
            )}
          </div>

          {/* Lesson Action Controls & Title */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-secondary/30 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-secondary/20">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-2.5 py-0.5 rounded-full">
                    {activeLessonInfo?.chapterTitle}
                  </span>
                  {activeLessonInfo?.lesson.duration ? (
                    <span className="text-xs text-primary/60 font-semibold flex items-center gap-1">
                      <Clock size={12} /> {activeLessonInfo.lesson.duration} mins
                    </span>
                  ) : null}
                </div>
                <h2 className="text-2xl font-black text-primary font-playfair tracking-tight">
                  {activeLessonInfo?.lesson.title}
                </h2>
              </div>

              {/* Complete Toggle Button */}
              <button
                type="button"
                disabled={isPending}
                onClick={handleToggleComplete}
                className={`px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm shrink-0 ${
                  isCurrentCompleted
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                    : "bg-secondary/10 hover:bg-accent hover:text-white text-primary border border-secondary/40"
                }`}
              >
                {isCurrentCompleted ? (
                  <>
                    <CheckCircle2 size={16} /> Completed
                  </>
                ) : (
                  <>
                    <Circle size={16} /> Mark as Complete
                  </>
                )}
              </button>
            </div>

            {/* Lesson Content & Study Notes */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                <FileText size={16} className="text-accent" />
                <span>Clinical Notes & Lecture Summary</span>
              </div>
              <div className="p-6 bg-secondary/5 rounded-2xl border border-secondary/20 text-sm text-primary/80 leading-relaxed font-sans prose max-w-none">
                {activeLessonInfo?.lesson.content ? (
                  <p className="whitespace-pre-line">{activeLessonInfo.lesson.content}</p>
                ) : (
                  <p className="text-primary/50 italic text-xs">
                    No supplementary study text provided for this lesson. Please follow along with the video lecture above.
                  </p>
                )}
              </div>
            </div>

            {/* Navigation Footer (Prev / Next) */}
            <div className="flex justify-between items-center pt-4 border-t border-secondary/20">
              <button
                type="button"
                disabled={!hasPrev}
                onClick={() => {
                  if (hasPrev) {
                    setActiveLessonId(allLessons[activeLessonIndex - 1].lesson.id);
                  }
                }}
                className="px-4 py-2.5 bg-white hover:bg-secondary/20 disabled:opacity-40 disabled:hover:bg-white text-primary border border-secondary/40 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} /> Previous Lesson
              </button>

              <span className="text-xs font-bold text-primary/50 hidden sm:inline-block">
                Lesson {activeLessonIndex + 1} of {allLessons.length}
              </span>

              <button
                type="button"
                disabled={!hasNext}
                onClick={() => {
                  if (hasNext) {
                    setActiveLessonId(allLessons[activeLessonIndex + 1].lesson.id);
                  }
                }}
                className="px-5 py-2.5 bg-primary hover:bg-accent disabled:opacity-40 disabled:hover:bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-sm"
              >
                Next Lesson <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* SYLLABUS / CHAPTERS SIDEBAR (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-secondary/30 shadow-sm space-y-6 sticky top-24">
          <div className="flex items-center justify-between border-b border-secondary/20 pb-4">
            <h3 className="font-black text-primary text-lg font-playfair flex items-center gap-2">
              <Layers size={18} className="text-accent" /> Course Curriculum
            </h3>
            <span className="text-xs font-bold text-primary/60 bg-secondary/10 px-2.5 py-0.5 rounded-full">
              {course.chapters.length} Chapters
            </span>
          </div>

          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
            {course.chapters.map((chapter, chIdx) => (
              <div key={chapter.id} className="space-y-2">
                <p className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-secondary/20 text-primary flex items-center justify-center text-[10px]">
                    {chIdx + 1}
                  </span>
                  {chapter.title}
                </p>

                <div className="space-y-1.5 pl-2">
                  {chapter.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId;
                    const isCompleted = completedIds.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => setActiveLessonId(lesson.id)}
                        className={`w-full p-3 rounded-2xl text-left text-xs transition-all flex items-center justify-between gap-3 cursor-pointer border ${
                          isActive
                            ? "bg-accent/10 border-accent/40 text-primary font-bold shadow-sm"
                            : isCompleted
                            ? "bg-emerald-50/60 hover:bg-emerald-50 border-emerald-200/60 text-emerald-900"
                            : "bg-white hover:bg-secondary/10 border-secondary/20 text-primary/80"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {isCompleted ? (
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                          ) : isActive ? (
                            <PlayCircle size={16} className="text-accent shrink-0 animate-pulse" />
                          ) : (
                            <Circle size={16} className="text-primary/30 shrink-0" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>

                        {lesson.duration ? (
                          <span className="text-[10px] text-primary/50 font-medium shrink-0">
                            {lesson.duration}m
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
