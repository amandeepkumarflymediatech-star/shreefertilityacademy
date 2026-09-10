"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Video, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  ExternalLink, 
  PlayCircle, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  CalendarDays, 
  GraduationCap, 
  History, 
  Copy, 
  Check, 
  Sparkles,
  BookOpen,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";
import { formatClassTime, formatClassDate, formatClassDateTime } from "@/lib/date-utils";
import { recordClassAttendance } from "@/actions/class-actions";

export type TutorUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  phone?: string | null;
  teachingHeadline?: string | null;
  experience?: string | null;
  qualifications?: string | null;
  languages?: string | null;
  teachingStyle?: string | null;
  bio?: string | null;
};

export type StudentLiveClassItem = {
  id: string;
  tutorId: string;
  title: string;
  description?: string | null;
  scheduledAt: string | Date;
  meetingUrl?: string | null;
  recordingUrl?: string | null;
  status?: string;
  tutor?: TutorUser;
  isEnrolled?: boolean;
  enrollmentStatus?: string;
};

export default function StudentClassesClient({
  classes,
  tutors,
  hasActiveMembership,
  maxClasses = 0,
  usedClasses = 0,
  remainingClasses = 0,
  hasClassCredits = false,
}: {
  classes: StudentLiveClassItem[];
  tutors: TutorUser[];
  hasActiveMembership: boolean;
  maxClasses?: number;
  usedClasses?: number;
  remainingClasses?: number;
  hasClassCredits?: boolean;
}) {
  const [viewMode, setViewMode] = useState<"CARDS" | "CALENDAR">("CARDS");
  const [activeTab, setActiveTab] = useState<"UPCOMING" | "HISTORY" | "TUTORS">("UPCOMING");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(new Date());

  const now = new Date();

  // Helper: check if two dates are on the same day
  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const handleCopyMeetingLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Meeting URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleJoinClass = async (cls: StudentLiveClassItem) => {
    if (!cls.meetingUrl) return;
    try {
      recordClassAttendance(cls.id);
    } catch (e) {
      console.error("Attendance recording failed:", e);
    }
    window.open(cls.meetingUrl, "_blank", "noopener,noreferrer");
  };

  // Group classes
  const upcomingClasses = useMemo(() => {
    return classes
      .filter((c) => new Date(c.scheduledAt) >= now && c.status !== "COMPLETED" && c.status !== "CANCELLED")
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  }, [classes, now]);

  const historyClasses = useMemo(() => {
    return classes
      .filter((c) => new Date(c.scheduledAt) < now || c.status === "COMPLETED")
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
  }, [classes, now]);

  // Calendar calculations
  const currentYear = currentCalendarDate.getFullYear();
  const currentMonth = currentCalendarDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = useMemo(() => {
    const days: { date: Date; isCurrentMonth: boolean }[] = [];
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentYear, currentMonth - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(currentYear, currentMonth, day),
        isCurrentMonth: true,
      });
    }
    const remaining = (7 - (days.length % 7)) % 7;
    for (let day = 1; day <= remaining; day++) {
      days.push({
        date: new Date(currentYear, currentMonth + 1, day),
        isCurrentMonth: false,
      });
    }
    return days;
  }, [currentYear, currentMonth, daysInMonth, firstDayOfWeek]);

  // Map classes to dates for calendar
  const classesByDate = useMemo(() => {
    const map = new Map<string, StudentLiveClassItem[]>();
    classes.forEach((c) => {
      if (c.status !== "CANCELLED") {
        const d = new Date(c.scheduledAt);
        const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        const existing = map.get(dateKey) || [];
        existing.push(c);
        map.set(dateKey, existing);
      }
    });
    return map;
  }, [classes]);

  const usagePercent = maxClasses > 0 ? Math.min(100, Math.round((usedClasses / maxClasses) * 100)) : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/30 pb-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div>
          <h4 className="text-accent font-bold tracking-widest uppercase mb-2 text-xs font-sans bg-accent/10 px-3 py-1 rounded-full w-fit flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            Interactive Live Webinars
          </h4>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">
            Live Classes & Mentors
          </h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">
            Join live interactive sessions, meet your clinical faculty, and review class recordings.
          </p>
        </div>

        {/* View Switcher */}
        <div className="bg-secondary/10 p-1 rounded-xl border border-secondary/30 flex items-center">
          <button
            onClick={() => setViewMode("CARDS")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "CARDS"
                ? "bg-white text-primary shadow-sm"
                : "text-primary/60 hover:text-primary"
            }`}
          >
            <LayoutGrid size={15} />
            Cards
          </button>
          <button
            onClick={() => setViewMode("CALENDAR")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "CALENDAR"
                ? "bg-white text-primary shadow-sm"
                : "text-primary/60 hover:text-primary"
            }`}
          >
            <CalendarDays size={15} />
            Calendar
          </button>
        </div>
      </div>

      {/* Package Class Credits Status Card */}
      {hasActiveMembership && (
        <div className="p-6 bg-white rounded-3xl border border-secondary/30 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-playfair font-black text-lg ${
              hasClassCredits ? "bg-accent/10 text-accent" : "bg-red-50 text-red-600"
            }`}>
              {remainingClasses}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-primary text-base font-playfair">
                  Live Class Package Allowance
                </h3>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  hasClassCredits
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {hasClassCredits ? "Active Credits" : "Limit Reached"}
                </span>
              </div>
              <p className="text-xs text-primary/60 mt-0.5">
                {hasClassCredits
                  ? `You have used ${usedClasses} of ${maxClasses} package classes. (${remainingClasses} live classes remaining to join)`
                  : `You have consumed all ${maxClasses} classes included in your current package.`}
              </p>
            </div>
          </div>

          <div className="w-full md:w-64 space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-primary/70">
              <span>Usage</span>
              <span>{usedClasses} / {maxClasses} Classes</span>
            </div>
            <div className="w-full h-2.5 bg-secondary/20 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  hasClassCredits ? "bg-accent" : "bg-red-500"
                }`}
                style={{ width: `${usagePercent}%` }}
              ></div>
            </div>
            {!hasClassCredits && (
              <Link
                href="/pricing"
                className="text-[11px] font-bold text-accent hover:underline inline-block mt-1"
              >
                + Renew / Purchase to add more classes &rarr;
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Membership Banner if Inactive or Limit Reached */}
      {!hasActiveMembership ? (
        <div className="p-6 bg-gradient-to-r from-accent/15 via-accent/10 to-primary/5 rounded-3xl border border-accent/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent text-white rounded-2xl shrink-0 shadow-md">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-bold text-primary text-base font-playfair">Unlock Live Mentorship Access</h3>
              <p className="text-xs text-primary/70 mt-0.5 max-w-xl leading-relaxed">
                Enroll in a fellowship package to unlock live micromanipulation webinars, 1-on-1 surgical reviews, and interactive faculty sessions.
              </p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="px-6 py-3 bg-accent hover:bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm hover:shadow-lg shrink-0"
          >
            View Programs &rarr;
          </Link>
        </div>
      ) : !hasClassCredits ? (
        <div className="p-6 bg-gradient-to-r from-red-50 via-orange-50 to-white rounded-3xl border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 text-red-700 rounded-2xl shrink-0 shadow-sm">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-red-900 text-base font-playfair">Package Class Limit Reached</h3>
              <p className="text-xs text-red-800/80 mt-0.5 max-w-xl leading-relaxed">
                You have attended all <strong>{maxClasses} classes</strong> in your current package. When you purchase or renew a package, all newly purchased classes plus any remaining classes are automatically combined!
              </p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm shrink-0"
          >
            Renew / Add Classes &rarr;
          </Link>
        </div>
      ) : null}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-secondary/20 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("UPCOMING")}
          className={`px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "UPCOMING"
              ? "bg-primary text-white shadow-sm"
              : "bg-white text-primary/70 hover:bg-secondary/20 hover:text-primary border border-secondary/30"
          }`}
        >
          <Video size={14} />
          Upcoming Live Classes ({upcomingClasses.length})
        </button>

        <button
          onClick={() => setActiveTab("HISTORY")}
          className={`px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "HISTORY"
              ? "bg-primary text-white shadow-sm"
              : "bg-white text-primary/70 hover:bg-secondary/20 hover:text-primary border border-secondary/30"
          }`}
        >
          <History size={14} />
          Class History & Past Sessions ({historyClasses.length})
        </button>

        <button
          onClick={() => setActiveTab("TUTORS")}
          className={`px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "TUTORS"
              ? "bg-primary text-white shadow-sm"
              : "bg-white text-primary/70 hover:bg-secondary/20 hover:text-primary border border-secondary/30"
          }`}
        >
          <GraduationCap size={14} />
          Faculty & Tutors ({tutors.length})
        </button>
      </div>

      {/* TAB 1: UPCOMING LIVE CLASSES */}
      {activeTab === "UPCOMING" && viewMode === "CARDS" && (
        <div className="space-y-6">
          {upcomingClasses.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-secondary/20 shadow-sm p-8 space-y-3">
              <Video className="w-16 h-16 text-secondary/30 mx-auto" />
              <h3 className="text-xl font-bold text-primary font-playfair">No Upcoming Live Classes</h3>
              <p className="text-primary/60 text-xs max-w-md mx-auto leading-relaxed">
                Your mentors have not scheduled any sessions for the next few days. Please check back soon or review past session recordings in the History tab.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingClasses.map((cls) => {
                const classDate = new Date(cls.scheduledAt);
                const tutor = cls.tutor;

                return (
                  <div
                    key={cls.id}
                    className="bg-white rounded-3xl p-6 border border-secondary/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Tutor Profile Header */}
                      <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-secondary/20">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-base shrink-0 overflow-hidden relative shadow-inner">
                            {tutor?.image ? (
                              <Image
                                src={tutor.image}
                                alt={tutor.name || "Tutor"}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              tutor?.name?.charAt(0).toUpperCase() || "T"
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-primary text-sm font-playfair truncate flex items-center gap-1">
                              {tutor?.name || "Clinical Mentor"}
                              <CheckCircle2 size={13} className="text-accent shrink-0" />
                            </h4>
                            <p className="text-[11px] text-primary/60 font-semibold truncate">
                              {tutor?.teachingHeadline || "Reproductive Specialist"}
                            </p>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Live Session
                        </span>
                      </div>

                      {/* Class Title & Agenda */}
                      <h3 className="font-bold text-primary text-base font-playfair line-clamp-2 mb-2 leading-snug">
                        {cls.title}
                      </h3>

                      <p className="text-xs text-primary/60 line-clamp-3 mb-5 leading-relaxed">
                        {cls.description || "Interactive live session covering case studies, technique review, and live Q&A with clinical fellows."}
                      </p>

                      {/* Date & Time Highlights */}
                      <div className="space-y-2 py-3 px-4 bg-secondary/10 rounded-2xl border border-secondary/20 text-xs font-medium text-primary/80 mb-5">
                        <div className="flex items-center gap-2">
                          <CalendarIcon size={14} className="text-accent shrink-0" />
                          <span className="font-bold">
                            {formatClassDate(cls.scheduledAt, true)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-accent shrink-0" />
                          <span>
                            {formatClassTime(cls.scheduledAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Join / Link Actions */}
                    <div className="space-y-2 pt-2 border-t border-secondary/20">
                      {hasClassCredits || cls.isEnrolled ? (
                        cls.meetingUrl ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleJoinClass(cls)}
                              className="flex-1 py-3 bg-primary hover:bg-accent text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
                            >
                              <Video size={16} />
                              Join Live Class
                              <ExternalLink size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyMeetingLink(cls.meetingUrl!, cls.id)}
                              className="p-3 bg-secondary/10 hover:bg-secondary/20 text-primary border border-secondary/40 rounded-xl transition-colors cursor-pointer shrink-0"
                              title="Copy Meeting Link"
                            >
                              {copiedId === cls.id ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                            </button>
                          </div>
                        ) : (
                          <div className="w-full py-3 bg-secondary/10 text-primary/60 font-semibold text-xs rounded-xl text-center border border-dashed border-secondary/40">
                            Meeting Link will be active 15 mins prior
                          </div>
                        )
                      ) : (
                        <Link
                          href="/pricing"
                          className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold uppercase tracking-wider text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <AlertCircle size={14} />
                          Renew Package to Join (0 Credits Left)
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CLASS HISTORY & PAST SESSIONS */}
      {activeTab === "HISTORY" && (
        <div className="space-y-6">
          {historyClasses.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-secondary/20 shadow-sm p-8 space-y-3">
              <History className="w-16 h-16 text-secondary/30 mx-auto" />
              <h3 className="text-xl font-bold text-primary font-playfair">No Past Classes Recorded</h3>
              <p className="text-primary/60 text-xs max-w-md mx-auto">
                Completed live webinars and clinical case conferences will appear here once conducted.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {historyClasses.map((cls) => {
                const classDate = new Date(cls.scheduledAt);
                const tutor = cls.tutor;

                return (
                  <div
                    key={cls.id}
                    className="bg-white rounded-3xl p-6 border border-secondary/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Tutor Profile Header */}
                      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-secondary/20">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0 overflow-hidden relative">
                            {tutor?.image ? (
                              <Image
                                src={tutor.image}
                                alt={tutor.name || "Tutor"}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              tutor?.name?.charAt(0).toUpperCase() || "T"
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-primary text-xs font-playfair truncate">
                              {tutor?.name || "Clinical Mentor"}
                            </h4>
                            <p className="text-[10px] text-primary/50 truncate">
                              {tutor?.teachingHeadline || "Reproductive Specialist"}
                            </p>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 shrink-0">
                          <CheckCircle2 size={11} />
                          Conducted
                        </span>
                      </div>

                      <h3 className="font-bold text-primary text-base font-playfair line-clamp-2 mb-2">
                        {cls.title}
                      </h3>

                      <p className="text-xs text-primary/60 line-clamp-3 mb-4 leading-relaxed">
                        {cls.description || "Completed clinical case study review and interactive procedure discussion."}
                      </p>

                      <div className="p-3 bg-secondary/5 rounded-xl text-xs text-primary/70 space-y-1 mb-4">
                        <p className="flex items-center gap-1.5 font-medium">
                          <CalendarIcon size={13} className="text-accent" />
                          {formatClassDate(cls.scheduledAt, true)}
                        </p>
                        <p className="flex items-center gap-1.5 text-primary/50 text-[11px]">
                          <Clock size={12} />
                          {formatClassTime(cls.scheduledAt)}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-secondary/20">
                      {cls.recordingUrl ? (
                        <a
                          href={cls.recordingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-2.5 bg-accent hover:bg-primary text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          <PlayCircle size={15} />
                          Watch Recording Replay
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <div className="text-center py-2.5 text-primary/40 text-xs font-semibold bg-secondary/5 rounded-xl">
                          Session Concluded
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FACULTY & TUTORS WITH SCHEDULES */}
      {activeTab === "TUTORS" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => {
              const tutorUpcoming = upcomingClasses.filter((c) => c.tutorId === tutor.id);
              const tutorHistory = historyClasses.filter((c) => c.tutorId === tutor.id);

              return (
                <div
                  key={tutor.id}
                  className="bg-white rounded-3xl p-6 border border-secondary/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-lg shrink-0 overflow-hidden relative shadow-inner">
                        {tutor.image ? (
                          <Image
                            src={tutor.image}
                            alt={tutor.name || "Mentor"}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          tutor.name?.charAt(0).toUpperCase() || "T"
                        )}
                      </div>
                      <div className="min-w-0 pt-1">
                        <h3 className="font-bold text-primary text-lg font-playfair truncate flex items-center gap-1">
                          {tutor.name}
                          <CheckCircle2 size={16} className="text-accent shrink-0" />
                        </h3>
                        <p className="text-xs text-primary/60 font-bold uppercase tracking-wider mt-0.5 truncate">
                          {tutor.teachingHeadline || "Reproductive Specialist"}
                        </p>
                        {tutor.experience && (
                          <p className="text-[11px] text-accent font-semibold mt-0.5">
                            {tutor.experience}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-primary/70 line-clamp-3 mb-5 leading-relaxed">
                      {tutor.bio || "Fellowship mentor and clinical supervisor in Reproductive Medicine & Embryology."}
                    </p>

                    {/* Tutor Scheduled Classes */}
                    <div className="space-y-2 pt-3 border-t border-secondary/20">
                      <p className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                        <Video size={13} className="text-accent" />
                        Upcoming Live Sessions ({tutorUpcoming.length})
                      </p>

                      {tutorUpcoming.length === 0 ? (
                        <p className="text-[11px] text-primary/50 italic py-2 bg-secondary/5 rounded-xl px-3 text-center">
                          No upcoming sessions scheduled right now.
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                          {tutorUpcoming.map((item) => (
                            <div
                              key={item.id}
                              className="p-3 bg-secondary/10 hover:bg-secondary/20 rounded-xl border border-secondary/20 text-xs transition-colors space-y-1.5"
                            >
                              <p className="font-bold text-primary truncate">{item.title}</p>
                              <div className="flex items-center justify-between text-[11px] text-primary/60">
                                <span>
                                  {formatClassDate(item.scheduledAt)} • {formatClassTime(item.scheduledAt)}
                                </span>
                                {item.meetingUrl && (
                                  hasClassCredits || item.isEnrolled ? (
                                    <button
                                      type="button"
                                      onClick={() => handleJoinClass(item)}
                                      className="text-accent hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                                    >
                                      Join <ExternalLink size={10} />
                                    </button>
                                  ) : (
                                    <Link
                                      href="/pricing"
                                      className="text-red-600 hover:underline font-bold flex items-center gap-0.5"
                                    >
                                      Renew <ExternalLink size={10} />
                                    </Link>
                                  )
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-secondary/20 flex justify-between items-center text-[11px] text-primary/60">
                    <span>{tutorHistory.length} Past Classes Conducted</span>
                    <span className="font-bold text-accent">Active Faculty</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CALENDAR VIEW */}
      {viewMode === "CALENDAR" && (
        <div className="bg-white rounded-3xl border border-secondary/30 shadow-sm overflow-hidden">
          {/* Calendar Header */}
          <div className="p-6 border-b border-secondary/20 bg-secondary/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black text-primary font-playfair tracking-tight">
                {currentCalendarDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h2>
              <button
                onClick={() => setCurrentCalendarDate(new Date())}
                className="px-3 py-1 bg-white hover:bg-secondary/20 text-primary border border-secondary/40 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Today
              </button>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-1 bg-white border border-secondary/40 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setCurrentCalendarDate(new Date(currentYear, currentMonth - 1, 1))}
                className="p-2 hover:bg-secondary/20 rounded-lg text-primary transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCurrentCalendarDate(new Date(currentYear, currentMonth + 1, 1))}
                className="p-2 hover:bg-secondary/20 rounded-lg text-primary transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Days Grid Header */}
          <div className="grid grid-cols-7 border-b border-secondary/20 bg-secondary/10 text-center text-xs font-bold uppercase tracking-widest text-primary/60 py-3">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Grid Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-secondary/20 min-h-[600px]">
            {calendarDays.map((item, idx) => {
              const dayDate = item.date;
              const dateKey = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, "0")}-${String(dayDate.getDate()).padStart(2, "0")}`;
              const dayClasses = classesByDate.get(dateKey) || [];
              const isToday = isSameDay(dayDate, now);
              const isPast = dayDate < new Date(now.getFullYear(), now.getMonth(), now.getDate());

              return (
                <div
                  key={idx}
                  className={`min-h-[120px] sm:min-h-[140px] p-2 sm:p-3 flex flex-col justify-between transition-colors relative ${
                    !item.isCurrentMonth
                      ? "bg-secondary/5 opacity-40"
                      : isPast
                      ? "bg-gray-50/50"
                      : "bg-white hover:bg-secondary/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold rounded-lg w-7 h-7 flex items-center justify-center ${
                        isToday
                          ? "bg-accent text-white font-black shadow-sm"
                          : !item.isCurrentMonth
                          ? "text-primary/40"
                          : "text-primary/80"
                      }`}
                    >
                      {dayDate.getDate()}
                    </span>

                    {dayClasses.length > 0 && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        {dayClasses.length} {dayClasses.length === 1 ? "Class" : "Classes"}
                      </span>
                    )}
                  </div>

                  <div className="my-1 flex-1 flex flex-col gap-1 justify-center">
                    {dayClasses.map((cls) => {
                      const isUpcoming = new Date(cls.scheduledAt) >= now;
                      return (
                        <div
                          key={cls.id}
                          className={`p-2 rounded-xl text-xs border transition-all ${
                            isUpcoming
                              ? "bg-emerald-50 border-emerald-200 text-emerald-900 shadow-sm"
                              : "bg-secondary/10 border-secondary/30 text-primary/80"
                          }`}
                        >
                          <p className="font-bold truncate">{cls.title}</p>
                          <div className="flex items-center justify-between mt-1 text-[10px]">
                            <span className="text-primary/60 font-semibold">
                              {formatClassTime(cls.scheduledAt)}
                            </span>
                            {cls.meetingUrl && isUpcoming && (
                              hasClassCredits || cls.isEnrolled ? (
                                <button
                                  type="button"
                                  onClick={() => handleJoinClass(cls)}
                                  className="text-accent hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                                >
                                  Join <ExternalLink size={9} />
                                </button>
                              ) : (
                                <Link
                                  href="/pricing"
                                  className="text-red-600 hover:underline font-bold flex items-center gap-0.5"
                                >
                                  Renew <ExternalLink size={9} />
                                </Link>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-[10px] text-primary/40 font-medium">
                    {isToday ? "Today" : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
