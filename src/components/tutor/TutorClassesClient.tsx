"use client";

import { useState, useTransition, useMemo } from "react";
import Image from "next/image";
import { 
  Video, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  PlayCircle, 
  ExternalLink, 
  Edit, 
  Trash2, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  CalendarDays,
  CalendarCheck2,
  Mail,
  Phone,
  Copy,
  Check,
  Search,
  BookOpen,
  GraduationCap,
  History,
  Sparkles
} from "lucide-react";
import { createLiveClass, updateLiveClass, deleteLiveClass } from "@/actions/class-actions";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { formatClassTime, formatClassDate, formatClassDateFull, formatClassDateTime } from "@/lib/date-utils";

export type StudentMembershipItem = {
  id: string;
  maxClasses: number;
  usedClasses: number;
  status: string;
};

export type StudentUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  phone?: string | null;
  memberships?: StudentMembershipItem[];
};

export type EnrollmentItem = {
  id: string;
  sessionId: string;
  studentId: string;
  status?: string;
  createdAt: string | Date;
  student?: StudentUser;
};

export type LiveClassItem = {
  id: string;
  tutorId: string;
  title: string;
  description?: string | null;
  scheduledAt: string | Date;
  meetingUrl?: string | null;
  recordingUrl?: string | null;
  status?: string;
  enrollments?: EnrollmentItem[];
  createdAt?: string | Date;
};

export default function TutorClassesClient({ classes }: { classes: LiveClassItem[] }) {
  const [viewMode, setViewMode] = useState<"CALENDAR" | "CARDS">("CALENDAR");
  const [tab, setTab] = useState<"UPCOMING" | "PAST" | "ALL">("UPCOMING");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<LiveClassItem | null>(null);
  const [selectedClassForDetails, setSelectedClassForDetails] = useState<LiveClassItem | null>(null);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmails, setCopiedEmails] = useState(false);
  const [selectedFormDate, setSelectedFormDate] = useState<string>("");
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(new Date());
  const [modalCalendarMonth, setModalCalendarMonth] = useState<Date>(new Date());
  const [isPending, startTransition] = useTransition();

  const now = new Date();

  // Helper: check if two dates are the same calendar day
  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Map of booked dates for quick lookup
  const bookedClassesByDate = useMemo(() => {
    const map = new Map<string, LiveClassItem>();
    classes.forEach((c) => {
      if (c.status !== "CANCELLED") {
        const d = new Date(c.scheduledAt);
        const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        map.set(dateKey, c);
      }
    });
    return map;
  }, [classes]);

  // All upcoming booked classes sorted by date
  const upcomingBookedClasses = useMemo(() => {
    return classes
      .filter((c) => c.status !== "CANCELLED" && new Date(c.scheduledAt) >= now)
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  }, [classes, now]);

  // Overall KPIs
  const totalClassesCount = classes.length;
  const upcomingCount = classes.filter((c) => new Date(c.scheduledAt) >= now && c.status !== "COMPLETED" && c.status !== "CANCELLED").length;
  const completedHistoryCount = classes.filter((c) => new Date(c.scheduledAt) < now || c.status === "COMPLETED").length;
  const totalStudentsJoinedCount = useMemo(() => {
    return classes.reduce((sum, c) => sum + (c.enrollments?.length || 0), 0);
  }, [classes]);

  // Check if chosen modal date conflicts with another class
  const modalDateConflict = useMemo(() => {
    if (!selectedFormDate) return null;
    const chosen = new Date(selectedFormDate);
    if (isNaN(chosen.getTime())) return null;

    const dateKey = `${chosen.getFullYear()}-${String(chosen.getMonth() + 1).padStart(2, "0")}-${String(chosen.getDate()).padStart(2, "0")}`;
    const existing = bookedClassesByDate.get(dateKey);

    if (existing && existing.id !== editingClass?.id) {
      return existing;
    }
    return null;
  }, [selectedFormDate, bookedClassesByDate, editingClass]);

  const filteredClasses = classes.filter((c) => {
    const classDate = new Date(c.scheduledAt);
    if (tab === "UPCOMING") {
      return classDate >= now && c.status !== "COMPLETED" && c.status !== "CANCELLED";
    }
    if (tab === "PAST") {
      return classDate < now || c.status === "COMPLETED";
    }
    return true;
  });

  const openCreateModal = (prefillDate?: Date) => {
    setEditingClass(null);
    if (prefillDate) {
      const target = new Date(prefillDate);
      target.setHours(10, 0, 0, 0); // Default to 10:00 AM
      const tzOffset = target.getTimezoneOffset() * 60000;
      const localISOTime = new Date(target.getTime() - tzOffset).toISOString().slice(0, 16);
      setSelectedFormDate(localISOTime);
      setModalCalendarMonth(new Date(prefillDate.getFullYear(), prefillDate.getMonth(), 1));
    } else {
      setSelectedFormDate("");
      setModalCalendarMonth(new Date());
    }
    setIsModalOpen(true);
  };

  const openEditModal = (cls: LiveClassItem) => {
    setEditingClass(cls);
    const d = new Date(cls.scheduledAt);
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
    setSelectedFormDate(localISOTime);
    setModalCalendarMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    setIsModalOpen(true);
  };

  const openDetailsModal = (cls: LiveClassItem) => {
    setSelectedClassForDetails(cls);
    setStudentSearchTerm("");
    setCopiedLink(false);
    setCopiedEmails(false);
  };

  const handleDelete = async (cls: LiveClassItem) => {
    const result = await Swal.fire({
      title: "Cancel & Delete Class?",
      text: `Are you sure you want to remove "${cls.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      startTransition(async () => {
        try {
          await deleteLiveClass(cls.id);
          toast.success("Class cancelled and deleted successfully.");
          if (selectedClassForDetails?.id === cls.id) {
            setSelectedClassForDetails(null);
          }
        } catch (error: any) {
          toast.error(error.message || "Failed to delete class.");
        }
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (modalDateConflict) {
      toast.error("Please choose a date that does not already have a booked class.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    if (selectedFormDate) {
      const parsed = new Date(selectedFormDate);
      if (!isNaN(parsed.getTime())) {
        formData.set("scheduledAt", parsed.toISOString());
      }
    }

    startTransition(async () => {
      try {
        if (editingClass) {
          await updateLiveClass(editingClass.id, formData);
          toast.success("Live class updated successfully!");
        } else {
          await createLiveClass(formData);
          toast.success("Live class scheduled! Enrolled students have been notified.");
        }
        setIsModalOpen(false);
        setEditingClass(null);
        setSelectedFormDate("");
      } catch (error: any) {
        toast.error(error.message || "Failed to save class details.");
      }
    });
  };

  const handleCopyMeetingLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success("Meeting link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyAllEmails = (enrollments?: EnrollmentItem[]) => {
    if (!enrollments || enrollments.length === 0) return;
    const emails = enrollments
      .map((e) => e.student?.email)
      .filter(Boolean)
      .join(", ");
    if (emails) {
      navigator.clipboard.writeText(emails);
      setCopiedEmails(true);
      toast.success("All student emails copied to clipboard!");
      setTimeout(() => setCopiedEmails(false), 2500);
    }
  };

  // Calendar calculations for Main Page
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

  // Modal Mini-Calendar calculations
  const modalYear = modalCalendarMonth.getFullYear();
  const modalMonth = modalCalendarMonth.getMonth();
  const modalDaysInMonth = new Date(modalYear, modalMonth + 1, 0).getDate();
  const modalFirstDayOfWeek = new Date(modalYear, modalMonth, 1).getDay();

  const modalCalendarDays = useMemo(() => {
    const days: { date: Date; isCurrentMonth: boolean }[] = [];
    const prevMonthDays = new Date(modalYear, modalMonth, 0).getDate();
    for (let i = modalFirstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(modalYear, modalMonth - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }
    for (let day = 1; day <= modalDaysInMonth; day++) {
      days.push({
        date: new Date(modalYear, modalMonth, day),
        isCurrentMonth: true,
      });
    }
    const remaining = (7 - (days.length % 7)) % 7;
    for (let day = 1; day <= remaining; day++) {
      days.push({
        date: new Date(modalYear, modalMonth + 1, day),
        isCurrentMonth: false,
      });
    }
    return days;
  }, [modalYear, modalMonth, modalDaysInMonth, modalFirstDayOfWeek]);

  // Filtered roster for the details modal
  const filteredEnrollments = useMemo(() => {
    if (!selectedClassForDetails?.enrollments) return [];
    if (!studentSearchTerm.trim()) return selectedClassForDetails.enrollments;
    const term = studentSearchTerm.toLowerCase();
    return selectedClassForDetails.enrollments.filter((e) => {
      const name = e.student?.name?.toLowerCase() || "";
      const email = e.student?.email?.toLowerCase() || "";
      const phone = e.student?.phone?.toLowerCase() || "";
      return name.includes(term) || email.includes(term) || phone.includes(term);
    });
  }, [selectedClassForDetails, studentSearchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/30 pb-6">
        <div>
          <h4 className="text-accent font-bold tracking-widest uppercase mb-2 text-xs font-sans bg-accent/10 px-3 py-1 rounded-full w-fit">
            Interactive Sessions & Attendance
          </h4>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">
            Live Classes & History
          </h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">
            Schedule live sessions, inspect class history, and track student attendance and enrollments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* View Toggle */}
          <div className="bg-secondary/10 p-1 rounded-xl border border-secondary/30 flex items-center">
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
          </div>

          <button
            onClick={() => openCreateModal()}
            className="px-6 py-3.5 bg-accent hover:bg-primary text-white font-bold uppercase tracking-wider text-xs transition-all rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus size={18} />
            Schedule Class
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 bg-white rounded-2xl border border-secondary/30 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Video size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-primary/60 uppercase tracking-wider">Total Classes</p>
            <p className="text-2xl font-black text-primary font-playfair">{totalClassesCount}</p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-secondary/30 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CalendarCheck2 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-primary/60 uppercase tracking-wider">Upcoming</p>
            <p className="text-2xl font-black text-emerald-700 font-playfair">{upcomingCount}</p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-secondary/30 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <History size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-primary/60 uppercase tracking-wider">Class History</p>
            <p className="text-2xl font-black text-blue-800 font-playfair">{completedHistoryCount}</p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-secondary/30 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-primary/60 uppercase tracking-wider">Total Enrolled</p>
            <p className="text-2xl font-black text-purple-900 font-playfair">{totalStudentsJoinedCount}</p>
          </div>
        </div>
      </div>

      {/* CALENDAR VIEW */}
      {viewMode === "CALENDAR" && (
        <div className="bg-white rounded-3xl border border-secondary/30 shadow-sm overflow-hidden">
          {/* Calendar Header & Month Navigation */}
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

            {/* Legend & Navigation */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-4 text-xs font-bold text-primary/70">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></span>
                  Booked Class
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-secondary/40"></span>
                  Open Date
                </span>
              </div>

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
          </div>

          {/* Calendar Grid Header (Days of week) */}
          <div className="grid grid-cols-7 border-b border-secondary/20 bg-secondary/10 text-center text-xs font-bold uppercase tracking-widest text-primary/60 py-3">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-secondary/20 min-h-[600px]">
            {calendarDays.map((item, idx) => {
              const dayDate = item.date;
              const dateKey = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, "0")}-${String(dayDate.getDate()).padStart(2, "0")}`;
              const bookedClass = bookedClassesByDate.get(dateKey);
              const isToday = isSameDay(dayDate, now);
              const isPast = dayDate < new Date(now.getFullYear(), now.getMonth(), now.getDate());
              const enrolledCount = bookedClass?.enrollments?.length || 0;

              return (
                <div
                  key={idx}
                  className={`min-h-[120px] sm:min-h-[140px] p-2 sm:p-3 flex flex-col justify-between transition-colors relative group ${
                    !item.isCurrentMonth
                      ? "bg-secondary/5 opacity-40"
                      : isPast
                      ? "bg-gray-50/50"
                      : "bg-white hover:bg-secondary/5"
                  }`}
                >
                  {/* Day Number Header */}
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

                    {bookedClass && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Users size={10} />
                        {enrolledCount} Joined
                      </span>
                    )}
                  </div>

                  {/* Cell Content */}
                  <div className="my-1 flex-1 flex flex-col justify-center">
                    {bookedClass ? (
                      <div
                        onClick={() => openDetailsModal(bookedClass)}
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 transition-all cursor-pointer shadow-sm group/cell"
                      >
                        <p className="font-bold text-xs truncate leading-tight flex items-center gap-1">
                          <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                          {bookedClass.title}
                        </p>
                        <div className="flex items-center justify-between mt-1 text-[10px] text-emerald-700 font-semibold">
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {formatClassTime(bookedClass.scheduledAt)}
                          </span>
                          <span className="text-[9px] bg-emerald-200/80 px-1 py-0.5 rounded font-bold">
                            View Roster
                          </span>
                        </div>
                      </div>
                    ) : !isPast && item.isCurrentMonth ? (
                      <button
                        onClick={() => openCreateModal(dayDate)}
                        className="w-full py-2 opacity-0 group-hover:opacity-100 hover:bg-accent hover:text-white text-accent border border-dashed border-accent/40 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                        title="Click to schedule class on this date"
                      >
                        <Plus size={12} /> Schedule
                      </button>
                    ) : null}
                  </div>

                  {/* Day Footer */}
                  <div className="text-[10px] text-primary/40 font-medium flex justify-between items-center">
                    <span>{isToday ? "Today" : ""}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CARDS GRID VIEW */}
      {viewMode === "CARDS" && (
        <>
          <div className="flex gap-2 border-b border-secondary/20 pb-4 overflow-x-auto">
            <button
              onClick={() => setTab("UPCOMING")}
              className={`px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer flex items-center gap-2 ${
                tab === "UPCOMING"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-primary/70 hover:bg-secondary/20 hover:text-primary border border-secondary/30"
              }`}
            >
              <CalendarCheck2 size={14} />
              Upcoming Sessions ({classes.filter((c) => new Date(c.scheduledAt) >= now && c.status !== "COMPLETED" && c.status !== "CANCELLED").length})
            </button>
            <button
              onClick={() => setTab("PAST")}
              className={`px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer flex items-center gap-2 ${
                tab === "PAST"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-primary/70 hover:bg-secondary/20 hover:text-primary border border-secondary/30"
              }`}
            >
              <History size={14} />
              Class History / Past ({classes.filter((c) => new Date(c.scheduledAt) < now || c.status === "COMPLETED").length})
            </button>
            <button
              onClick={() => setTab("ALL")}
              className={`px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer flex items-center gap-2 ${
                tab === "ALL"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-primary/70 hover:bg-secondary/20 hover:text-primary border border-secondary/30"
              }`}
            >
              <Video size={14} />
              All Classes ({classes.length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-secondary/20 shadow-sm p-8">
                <Video className="w-16 h-16 text-secondary/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2 font-playfair">No Classes Found</h3>
                <p className="text-primary/60 text-sm max-w-md mx-auto mb-6">
                  {tab === "UPCOMING"
                    ? "You have no upcoming sessions scheduled. Click the button below to schedule your next live interactive class."
                    : "No past classes recorded yet in history."}
                </p>
                {tab === "UPCOMING" && (
                  <button
                    onClick={() => openCreateModal()}
                    className="px-6 py-3 bg-accent hover:bg-primary text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Schedule First Class
                  </button>
                )}
              </div>
            )}

            {filteredClasses.map((cls) => {
              const classDate = new Date(cls.scheduledAt);
              const isUpcoming = classDate >= now && cls.status !== "COMPLETED";
              const enrolledCount = cls.enrollments?.length || 0;

              return (
                <div
                  key={cls.id}
                  className="bg-white rounded-3xl p-6 border border-secondary/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                          cls.status === "COMPLETED"
                            ? "bg-blue-50 border-blue-200 text-blue-700 font-bold"
                            : cls.status === "CANCELLED"
                            ? "bg-red-50 border-red-200 text-red-700 font-bold"
                            : isUpcoming
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold"
                            : "bg-secondary/20 border-secondary/40 text-primary/70"
                        }`}
                      >
                        {cls.status === "COMPLETED" ? (
                          <CheckCircle2 size={12} />
                        ) : cls.status === "CANCELLED" ? (
                          <AlertCircle size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                        {cls.status || (isUpcoming ? "SCHEDULED" : "COMPLETED")}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(cls)}
                          className="p-1.5 text-primary/40 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Class"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cls)}
                          className="p-1.5 text-primary/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Cancel Class"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-bold text-primary text-lg font-playfair line-clamp-2 mb-2">
                      {cls.title}
                    </h3>

                    <p className="text-xs text-primary/60 line-clamp-3 mb-4 leading-relaxed">
                      {cls.description || "No agenda details provided."}
                    </p>

                    <div className="space-y-2 py-3 border-y border-secondary/20 text-xs font-medium text-primary/80">
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={14} className="text-accent shrink-0" />
                        <span>
                          {formatClassDate(cls.scheduledAt, true)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-accent shrink-0" />
                        <span>
                          {formatClassTime(cls.scheduledAt)}
                        </span>
                      </div>
                      
                      {/* Enrolled Students Row with View Roster Trigger */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-accent shrink-0" />
                          <span className="font-bold text-accent">
                            {enrolledCount} {enrolledCount === 1 ? "Student" : "Students"} Joined
                          </span>
                        </div>
                        <button
                          onClick={() => openDetailsModal(cls)}
                          className="text-[11px] text-primary hover:text-accent font-bold underline transition-colors cursor-pointer"
                        >
                          View Roster &rarr;
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    <button
                      onClick={() => openDetailsModal(cls)}
                      className="w-full py-2.5 bg-secondary/10 hover:bg-secondary/20 text-primary font-bold uppercase tracking-wider text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-secondary/40 cursor-pointer"
                    >
                      <Users size={14} className="text-accent" />
                      View Enrolled Students ({enrolledCount})
                    </button>

                    {cls.meetingUrl ? (
                      <a
                        href={cls.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 bg-primary hover:bg-accent text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Video size={16} />
                        Join Live Session
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      <button
                        onClick={() => openEditModal(cls)}
                        className="w-full py-3 bg-white hover:bg-secondary/10 text-primary/70 font-bold uppercase tracking-wider text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-dashed border-secondary/50 cursor-pointer"
                      >
                        <Plus size={14} /> Add Meeting Link
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* DEDICATED "CLASS DETAILS & JOINED STUDENTS ROSTER" MODAL */}
      {selectedClassForDetails && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-secondary/30 w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 sm:p-8 border-b border-secondary/30 bg-secondary/5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      selectedClassForDetails.status === "COMPLETED"
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : selectedClassForDetails.status === "CANCELLED"
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-emerald-50 border-emerald-200 text-emerald-700"
                    }`}
                  >
                    {selectedClassForDetails.status || "SCHEDULED"}
                  </span>
                  <span className="text-xs text-primary/60 font-semibold flex items-center gap-1">
                    <CalendarIcon size={12} />
                    {formatClassDate(selectedClassForDetails.scheduledAt, true)}
                    {" • "}
                    {formatClassTime(selectedClassForDetails.scheduledAt)}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-primary font-playfair tracking-tight">
                  {selectedClassForDetails.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedClassForDetails(null)}
                className="p-2 text-primary/50 hover:text-accent hover:bg-accent/10 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Meeting Details & Quick Actions Bar */}
              <div className="p-4 bg-secondary/10 rounded-2xl border border-secondary/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Video size={18} className="text-accent" />
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Meeting Link
                    </span>
                  </div>

                  {selectedClassForDetails.meetingUrl ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyMeetingLink(selectedClassForDetails.meetingUrl!)}
                        className="px-3 py-1.5 bg-white hover:bg-secondary/20 text-primary border border-secondary/40 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        {copiedLink ? "Copied Link" : "Copy Link"}
                      </button>
                      <a
                        href={selectedClassForDetails.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-1.5 bg-primary hover:bg-accent text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        Join Class
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  ) : (
                    <span className="text-xs text-primary/50 italic">No meeting link provided</span>
                  )}
                </div>

                {selectedClassForDetails.description && (
                  <div className="pt-2 border-t border-secondary/20">
                    <p className="text-xs text-primary/70 leading-relaxed">
                      {selectedClassForDetails.description}
                    </p>
                  </div>
                )}
              </div>

              {/* ENROLLED / JOINED STUDENTS SECTION */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <h3 className="text-base font-bold text-primary flex items-center gap-2 font-playfair">
                      <Users size={18} className="text-accent" />
                      Joined Students Roster
                      <span className="text-xs font-sans font-bold bg-accent/10 text-accent px-2.5 py-0.5 rounded-full">
                        {selectedClassForDetails.enrollments?.length || 0} Total
                      </span>
                    </h3>
                    <p className="text-xs text-primary/60 mt-0.5">
                      List of all students enrolled in this interactive session.
                    </p>
                  </div>

                  {selectedClassForDetails.enrollments && selectedClassForDetails.enrollments.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleCopyAllEmails(selectedClassForDetails.enrollments)}
                      className="px-3 py-1.5 bg-secondary/10 hover:bg-secondary/20 text-primary border border-secondary/40 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {copiedEmails ? <Check size={14} className="text-emerald-600" /> : <Mail size={14} />}
                      {copiedEmails ? "Copied All Emails" : "Copy Student Emails"}
                    </button>
                  )}
                </div>

                {/* Search in student roster */}
                {selectedClassForDetails.enrollments && selectedClassForDetails.enrollments.length > 0 && (
                  <div className="relative">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40" />
                    <input
                      type="text"
                      placeholder="Search enrolled students by name or email..."
                      value={studentSearchTerm}
                      onChange={(e) => setStudentSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-secondary/5 border border-secondary/40 rounded-xl text-xs text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    />
                  </div>
                )}

                {/* Students List */}
                {!selectedClassForDetails.enrollments || selectedClassForDetails.enrollments.length === 0 ? (
                  <div className="p-8 text-center bg-secondary/5 rounded-2xl border border-secondary/20 space-y-2">
                    <Users className="w-10 h-10 text-secondary/40 mx-auto" />
                    <p className="text-xs font-bold text-primary">No Students Joined Yet</p>
                    <p className="text-[11px] text-primary/60 max-w-sm mx-auto">
                      Fellowship students with active memberships will appear here automatically when they claim their live session seats.
                    </p>
                  </div>
                ) : filteredEnrollments.length === 0 ? (
                  <div className="p-6 text-center bg-secondary/5 rounded-2xl border border-secondary/20 text-xs text-primary/60">
                    No students match &quot;{studentSearchTerm}&quot;.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {filteredEnrollments.map((enr, idx) => {
                      const student = enr.student;
                      const enrolledDate = enr.createdAt ? new Date(enr.createdAt) : null;

                      return (
                        <div
                          key={enr.id || idx}
                          className="p-3.5 bg-white hover:bg-secondary/5 border border-secondary/30 rounded-2xl flex items-center justify-between gap-4 transition-colors shadow-sm"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-sm shrink-0 overflow-hidden relative">
                              {student?.image ? (
                                <Image
                                  src={student.image}
                                  alt={student.name || "Student"}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                              ) : (
                                student?.name?.charAt(0).toUpperCase() || "S"
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="font-bold text-primary text-xs truncate">
                                {student?.name || "Student Member"}
                              </p>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5 text-[11px] text-primary/60">
                                {student?.email && (
                                  <a
                                    href={`mailto:${student.email}`}
                                    className="hover:text-accent flex items-center gap-1 truncate"
                                  >
                                    <Mail size={11} />
                                    {student.email}
                                  </a>
                                )}
                                {student?.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone size={11} />
                                    {student.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {(() => {
                            const totalCreds = student?.memberships?.reduce((sum, m) => sum + (m.maxClasses || 0), 0) || 0;
                            const usedCreds = student?.memberships?.reduce((sum, m) => sum + (m.usedClasses || 0), 0) || 0;
                            const pendingCreds = Math.max(0, totalCreds - usedCreds);

                            return (
                              <div className="text-right shrink-0 space-y-1">
                                <div className="flex items-center gap-1.5 justify-end">
                                  {totalCreds > 0 && (
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                      pendingCreds > 0
                                        ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-bold"
                                        : "bg-secondary/20 border-secondary/30 text-primary/60"
                                    }`}>
                                      {pendingCreds} Credits Left
                                    </span>
                                  )}
                                  {enr.status === "ATTENDED" ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full shadow-xs">
                                      <CheckCircle2 size={11} className="text-emerald-600" />
                                      Attended Live
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                                      <Clock size={11} className="text-blue-600" />
                                      Registered
                                    </span>
                                  )}
                                </div>
                                {enrolledDate && (
                                  <p className="text-[10px] text-primary/40">
                                    {formatClassDate(enrolledDate)}
                                  </p>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-secondary/20 bg-secondary/5 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  const target = selectedClassForDetails;
                  setSelectedClassForDetails(null);
                  openEditModal(target);
                }}
                className="px-4 py-2 bg-white hover:bg-secondary/20 text-primary border border-secondary/40 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Edit size={14} />
                Edit Class
              </button>

              <button
                type="button"
                onClick={() => setSelectedClassForDetails(null)}
                className="px-6 py-2 bg-primary hover:bg-accent text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE / EDIT MODAL WITH EMBEDDED INTERACTIVE DATE PICKER */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-secondary/30 w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden my-8">
            <div className="flex justify-between items-center p-6 sm:p-8 border-b border-secondary/30 bg-secondary/5">
              <div>
                <h2 className="text-2xl font-black text-primary font-playfair tracking-tight">
                  {editingClass ? "Edit Live Class" : "Schedule Live Class"}
                </h2>
                <p className="text-xs text-primary/60 mt-1">
                  {editingClass
                    ? "Update session timing, meeting links, and status."
                    : "Select an open calendar date below and set your session time."}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingClass(null);
                  setSelectedFormDate("");
                }}
                className="p-2 text-primary/50 hover:text-accent hover:bg-accent/10 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* CLASS TITLE */}
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1.5 ml-1">
                  Class Title *
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingClass?.title || ""}
                  required
                  placeholder="e.g. Mastering Oocyte Denudation & ICSI Technique"
                  className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all"
                />
              </div>

              {/* INTERACTIVE DATE & TIME SELECTOR SECTION */}
              <div className="p-5 bg-secondary/10 rounded-2xl border border-secondary/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarCheck2 size={18} className="text-accent" />
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">
                      Select Class Date
                    </span>
                  </div>

                  {/* Month navigation inside modal */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">
                      {modalCalendarMonth.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setModalCalendarMonth(new Date(modalYear, modalMonth - 1, 1))}
                        className="p-1 hover:bg-secondary/30 rounded text-primary transition-colors cursor-pointer"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalCalendarMonth(new Date(modalYear, modalMonth + 1, 1))}
                        className="p-1 hover:bg-secondary/30 rounded text-primary transition-colors cursor-pointer"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mini Calendar Grid */}
                <div className="bg-white rounded-xl p-3 border border-secondary/30 shadow-inner">
                  <div className="grid grid-cols-7 text-center text-[10px] font-bold text-primary/50 uppercase tracking-wider mb-2">
                    <span>Su</span>
                    <span>Mo</span>
                    <span>Tu</span>
                    <span>We</span>
                    <span>Th</span>
                    <span>Fr</span>
                    <span>Sa</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {modalCalendarDays.map((item, i) => {
                      const dayDate = item.date;
                      const dateKey = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, "0")}-${String(dayDate.getDate()).padStart(2, "0")}`;
                      const bookedClass = bookedClassesByDate.get(dateKey);
                      const isPast = dayDate < new Date(now.getFullYear(), now.getMonth(), now.getDate());
                      const isSelected = selectedFormDate.startsWith(dateKey);
                      const isConflict = bookedClass && bookedClass.id !== editingClass?.id;

                      let cellClass = "bg-secondary/10 text-primary/80 hover:bg-secondary/30 border-secondary/30";

                      if (!item.isCurrentMonth) {
                        cellClass = "opacity-30 text-primary/30 border-transparent";
                      } else if (isPast) {
                        cellClass = "opacity-40 text-primary/40 bg-gray-100 border-transparent cursor-not-allowed";
                      } else if (isConflict) {
                        cellClass = "bg-red-50 text-red-700 border-red-200 font-bold hover:bg-red-100";
                      } else if (isSelected) {
                        cellClass = "bg-accent text-white font-bold border-accent shadow-sm";
                      } else {
                        cellClass = "bg-white text-primary hover:bg-emerald-50 hover:border-emerald-300 border-secondary/30";
                      }

                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={isPast || !item.isCurrentMonth}
                          onClick={() => {
                            if (isPast || !item.isCurrentMonth) return;
                            // Keep current time or default to 10:00 AM
                            let timePart = "10:00";
                            if (selectedFormDate && selectedFormDate.includes("T")) {
                              timePart = selectedFormDate.split("T")[1];
                            }
                            setSelectedFormDate(`${dateKey}T${timePart}`);
                          }}
                          className={`h-10 rounded-lg text-xs flex flex-col items-center justify-center transition-all border relative cursor-pointer ${cellClass}`}
                          title={
                            isConflict
                              ? `🔴 Booked: ${bookedClass.title}`
                              : isPast
                              ? "Past date"
                              : "Click to select this date"
                          }
                        >
                          <span className="leading-none">{dayDate.getDate()}</span>
                          {isConflict && (
                            <span className="text-[8px] font-bold text-red-600 leading-none mt-0.5">
                              Booked
                            </span>
                          )}
                          {!isConflict && !isPast && item.isCurrentMonth && (
                            <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Exact Date & Time Picker */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest ml-1">
                      Selected Date & Time *
                    </label>
                    {selectedFormDate && (
                      <span className="text-[11px] text-primary/60 font-semibold">
                        {new Date(selectedFormDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <input
                    type="datetime-local"
                    name="scheduledAt"
                    min={new Date().toISOString().slice(0, 16)}
                    value={selectedFormDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedFormDate(val);
                      if (val) {
                        const parsed = new Date(val);
                        if (!isNaN(parsed.getTime())) {
                          setModalCalendarMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
                        }
                      }
                    }}
                    required
                    className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm focus:ring-2 outline-none transition-all shadow-sm ${
                      modalDateConflict
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200 text-red-900 bg-red-50/30"
                        : selectedFormDate
                        ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-200 text-primary"
                        : "border-secondary/50 focus:border-accent focus:ring-accent/20 text-primary"
                    }`}
                  />
                </div>

                {/* Real-time Conflict / Availability Banner */}
                {modalDateConflict ? (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 animate-in fade-in duration-200">
                    <div className="p-1 bg-red-100 rounded-lg text-red-600 shrink-0 mt-0.5">
                      <AlertCircle size={18} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                        Date Already Booked: &quot;{modalDateConflict.title}&quot;
                      </p>
                      <p className="text-[11px] text-red-700 leading-relaxed">
                        You already have a class scheduled on{" "}
                        <span className="font-bold">
                          {formatClassDateFull(modalDateConflict.scheduledAt)}
                        </span>{" "}
                        at{" "}
                        <span className="font-bold">
                          {formatClassTime(modalDateConflict.scheduledAt)}
                        </span>
                        . Only 1 live class is permitted per calendar day. Please select a different date from the calendar.
                      </p>
                    </div>
                  </div>
                ) : selectedFormDate ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-2 text-emerald-800 text-xs font-semibold animate-in fade-in duration-200">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-emerald-100 rounded-lg text-emerald-600 shrink-0">
                        <CheckCircle2 size={16} />
                      </div>
                      <span>
                        <strong className="text-emerald-900">Available Date:</strong> No existing classes scheduled on this day.
                      </span>
                    </div>
                    <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                      Open Slot
                    </span>
                  </div>
                ) : null}

                {/* Scheduled Classes Overview inside Modal */}
                {upcomingBookedClasses.length > 0 && (
                  <div className="pt-2 border-t border-secondary/20">
                    <p className="text-[11px] font-bold text-primary/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CalendarIcon size={13} className="text-accent" />
                      Your Already Scheduled Classes ({upcomingBookedClasses.length})
                    </p>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                      {upcomingBookedClasses.map((item) => {
                        const itemDate = new Date(item.scheduledAt);
                        const isCurrentSelection = selectedFormDate.startsWith(
                          `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, "0")}-${String(itemDate.getDate()).padStart(2, "0")}`
                        );
                        return (
                          <div
                            key={item.id}
                            className={`p-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
                              isCurrentSelection
                                ? "bg-red-50 border-red-300 text-red-900 font-bold"
                                : "bg-white/80 border-secondary/30 text-primary/80"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                              <span className="truncate">{item.title}</span>
                            </div>
                            <div className="text-[10px] text-primary/60 shrink-0 font-medium ml-2">
                              {formatClassDate(item.scheduledAt)} • {formatClassTime(item.scheduledAt)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* MEETING LINK */}
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1.5 ml-1">
                  Meeting Link (Google Meet / Zoom URL)
                </label>
                <input
                  type="url"
                  name="meetingUrl"
                  defaultValue={editingClass?.meetingUrl || ""}
                  placeholder="https://meet.google.com/xyz-abcd-efg"
                  className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all"
                />
              </div>

              {editingClass && (
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1.5 ml-1">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={editingClass?.status || "SCHEDULED"}
                    className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all cursor-pointer"
                  >
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              )}

              {/* AGENDA & DESCRIPTION */}
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1.5 ml-1">
                  Agenda & Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingClass?.description || ""}
                  placeholder="Key concepts covered, preparation materials, case reviews..."
                  className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all"
                />
              </div>

              {!editingClass && (
                <div className="p-4 bg-accent/5 rounded-2xl border border-accent/20 flex items-start gap-3">
                  <AlertCircle size={18} className="text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-primary/70 leading-relaxed">
                    Active students with available class credits will be automatically enrolled and receive email invitations with the session time and meeting link.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-secondary/20">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingClass(null);
                    setSelectedFormDate("");
                  }}
                  className="px-6 py-2.5 border border-secondary/40 text-primary rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-secondary/20 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || !!modalDateConflict || !selectedFormDate}
                  className="px-6 py-2.5 bg-accent hover:bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-2"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Scheduling...
                    </>
                  ) : editingClass ? (
                    "Save Changes"
                  ) : (
                    "Schedule Class"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
