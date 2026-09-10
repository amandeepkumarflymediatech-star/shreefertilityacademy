"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { 
  Users, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Mail, 
  Phone, 
  Video, 
  Calendar as CalendarIcon, 
  ExternalLink, 
  X, 
  ChevronRight, 
  GraduationCap,
  Award,
  BookOpen
} from "lucide-react";
import { formatClassDate, formatClassTime, formatClassDateTime } from "@/lib/date-utils";

export type TutorStudentClassItem = {
  id: string;
  title: string;
  scheduledAt: string | Date;
  status?: string;
  meetingUrl?: string | null;
  recordingUrl?: string | null;
  enrollmentStatus?: string;
  isPast: boolean;
};

export type TutorStudentItem = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  phone?: string | null;
  totalCredits: number;
  usedCredits: number;
  pendingCredits: number;
  membershipStatus: string;
  validUntil?: string | Date | null;
  totalClassesWithTutor: number;
  attendedClassesWithTutor: number;
  upcomingClassesWithTutor: number;
  tutorClassHistory: TutorStudentClassItem[];
};

export default function TutorStudentsClient({ students }: { students: TutorStudentItem[] }) {
  const [search, setSearch] = useState("");
  const [creditFilter, setCreditFilter] = useState<"ALL" | "PENDING" | "EXHAUSTED">("ALL");
  const [selectedStudent, setSelectedStudent] = useState<TutorStudentItem | null>(null);

  // Overall KPIs
  const totalStudentsCount = students.length;
  const totalPendingCredits = useMemo(() => {
    return students.reduce((sum, s) => sum + s.pendingCredits, 0);
  }, [students]);
  const totalUsedCredits = useMemo(() => {
    return students.reduce((sum, s) => sum + s.usedCredits, 0);
  }, [students]);
  const totalClassesConducted = useMemo(() => {
    return students.reduce((sum, s) => sum + s.attendedClassesWithTutor, 0);
  }, [students]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        (s.name && s.name.toLowerCase().includes(searchLower)) ||
        (s.email && s.email.toLowerCase().includes(searchLower)) ||
        (s.phone && s.phone.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;

      // Credit filter
      if (creditFilter === "PENDING") {
        return s.pendingCredits > 0;
      }
      if (creditFilter === "EXHAUSTED") {
        return s.pendingCredits <= 0;
      }

      return true;
    });
  }, [students, search, creditFilter]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/30 pb-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div>
          <h4 className="text-accent font-bold tracking-widest uppercase mb-2 text-xs font-sans bg-accent/10 px-3 py-1 rounded-full w-fit flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            Faculty Roster & Quota
          </h4>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">
            My Students & Credits
          </h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">
            Track student membership credits, pending class balances, and individual attendance history with you.
          </p>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-secondary/30 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-primary/50 uppercase tracking-wider">Total Students</p>
              <h3 className="text-3xl font-black text-primary mt-2 font-playfair tracking-tight">
                {totalStudentsCount}
              </h3>
            </div>
            <div className="p-3.5 bg-secondary/10 text-primary rounded-2xl">
              <Users size={22} />
            </div>
          </div>
          <p className="text-xs text-primary/60 mt-3 flex items-center gap-1">
            <span className="text-accent font-bold">●</span> Enrolled in your live sessions
          </p>
        </div>

        <div className="bg-white border border-secondary/30 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Pending Credits</p>
              <h3 className="text-3xl font-black text-emerald-600 mt-2 font-playfair tracking-tight">
                {totalPendingCredits}
              </h3>
            </div>
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
              <Sparkles size={22} />
            </div>
          </div>
          <p className="text-xs text-emerald-800/70 mt-3 font-medium">
            Available class credits ready to book
          </p>
        </div>

        <div className="bg-white border border-secondary/30 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-primary/50 uppercase tracking-wider">Used Credits</p>
              <h3 className="text-3xl font-black text-primary mt-2 font-playfair tracking-tight">
                {totalUsedCredits}
              </h3>
            </div>
            <div className="p-3.5 bg-secondary/10 text-primary rounded-2xl">
              <BookOpen size={22} />
            </div>
          </div>
          <p className="text-xs text-primary/60 mt-3 font-medium">
            Total mentorship classes utilized
          </p>
        </div>

        <div className="bg-white border border-secondary/30 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-accent uppercase tracking-wider">Classes with You</p>
              <h3 className="text-3xl font-black text-accent mt-2 font-playfair tracking-tight">
                {totalClassesConducted}
              </h3>
            </div>
            <div className="p-3.5 bg-accent/10 text-accent rounded-2xl">
              <GraduationCap size={22} />
            </div>
          </div>
          <p className="text-xs text-primary/60 mt-3 font-medium">
            Past interactive sessions conducted
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-secondary/30 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
          <input
            type="text"
            placeholder="Search by student name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-secondary/5 border border-secondary/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent text-primary transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary p-1"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-secondary/10 p-1 rounded-xl border border-secondary/30 shrink-0 overflow-x-auto">
          <button
            onClick={() => setCreditFilter("ALL")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              creditFilter === "ALL"
                ? "bg-primary text-white shadow-sm"
                : "text-primary/70 hover:text-primary hover:bg-secondary/20"
            }`}
          >
            All Students ({students.length})
          </button>
          <button
            onClick={() => setCreditFilter("PENDING")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              creditFilter === "PENDING"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-emerald-800 hover:bg-emerald-50"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Active Credits ({students.filter((s) => s.pendingCredits > 0).length})
          </button>
          <button
            onClick={() => setCreditFilter("EXHAUSTED")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              creditFilter === "EXHAUSTED"
                ? "bg-primary text-white shadow-sm"
                : "text-primary/70 hover:text-primary hover:bg-secondary/20"
            }`}
          >
            Exhausted ({students.filter((s) => s.pendingCredits <= 0).length})
          </button>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-3xl border border-secondary/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/10 border-b border-secondary/30 text-xs font-bold uppercase tracking-wider text-primary/70">
                <th className="p-6 font-black text-primary font-playfair tracking-tight text-sm">Student Profile</th>
                <th className="p-6 font-black text-primary font-playfair tracking-tight text-sm">Membership Credits Status</th>
                <th className="p-6 font-black text-primary font-playfair tracking-tight text-sm">Classes with You</th>
                <th className="p-6 font-black text-primary font-playfair tracking-tight text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-primary/50 font-bold">
                    <Users size={36} className="mx-auto mb-3 opacity-40 text-primary" />
                    No students match the current search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const percentUsed = student.totalCredits > 0 
                    ? Math.min(100, Math.round((student.usedCredits / student.totalCredits) * 100))
                    : 0;

                  return (
                    <tr 
                      key={student.id} 
                      className="hover:bg-secondary/5 transition-colors group cursor-pointer"
                      onClick={() => setSelectedStudent(student)}
                    >
                      {/* Student Info */}
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 overflow-hidden relative shadow-sm border border-secondary/30 shrink-0">
                            {student.image ? (
                              <Image 
                                src={student.image} 
                                alt={student.name || "Student"} 
                                fill 
                                unoptimized
                                className="object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary text-white font-black font-playfair text-lg">
                                {student.name?.charAt(0).toUpperCase() || "S"}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-primary group-hover:text-accent transition-colors text-base truncate">
                              {student.name || "Unknown Student"}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-primary/60">
                              {student.email && (
                                <span className="flex items-center gap-1 truncate">
                                  <Mail size={12} className="text-accent shrink-0" />
                                  {student.email}
                                </span>
                              )}
                              {student.phone && (
                                <span className="flex items-center gap-1 shrink-0">
                                  <Phone size={12} className="text-accent shrink-0" />
                                  {student.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Credits Status */}
                      <td className="p-6">
                        <div className="space-y-2 max-w-xs">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-primary flex items-center gap-1.5">
                              {student.pendingCredits > 0 ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                  {student.pendingCredits} Pending
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-secondary/20 text-primary/60 border border-secondary/30">
                                  0 Pending
                                </span>
                              )}
                            </span>
                            <span className="text-[11px] font-semibold text-primary/60">
                              {student.usedCredits} of {student.totalCredits} Used
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-secondary/20 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                student.pendingCredits > 0 ? "bg-emerald-500" : "bg-primary/40"
                              }`}
                              style={{ width: `${percentUsed}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Classes with Current Tutor */}
                      <td className="p-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 bg-primary/5 text-primary rounded-xl border border-secondary/30">
                              <Video size={13} className="text-accent" />
                              {student.totalClassesWithTutor} Total
                            </span>
                          </div>
                          <div className="text-[11px] text-primary/60 flex items-center gap-2 mt-1">
                            <span className="text-emerald-700 font-semibold">{student.attendedClassesWithTutor} Attended</span>
                            <span>•</span>
                            <span className="text-blue-700 font-semibold">{student.upcomingClassesWithTutor} Upcoming</span>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(student);
                          }}
                          className="px-4 py-2 bg-secondary/10 hover:bg-primary hover:text-white text-primary rounded-xl text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5 border border-secondary/30 shadow-sm cursor-pointer"
                        >
                          View Details <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STUDENT FULL DETAILS MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-secondary/30 w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 sm:p-8 border-b border-secondary/20 bg-secondary/5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 overflow-hidden relative shadow-md border border-secondary/30 shrink-0">
                  {selectedStudent.image ? (
                    <Image 
                      src={selectedStudent.image} 
                      alt={selectedStudent.name || "Student"} 
                      fill 
                      unoptimized
                      className="object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-white font-black font-playfair text-2xl">
                      {selectedStudent.name?.charAt(0).toUpperCase() || "S"}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-primary font-playfair tracking-tight">
                    {selectedStudent.name || "Student Details"}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-primary/60">
                    {selectedStudent.email && (
                      <span className="flex items-center gap-1">
                        <Mail size={12} className="text-accent" />
                        {selectedStudent.email}
                      </span>
                    )}
                    {selectedStudent.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={12} className="text-accent" />
                        {selectedStudent.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 text-primary/40 hover:text-primary hover:bg-secondary/20 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Credit Breakdown Cards */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                  <Award size={14} className="text-accent" />
                  Membership Credit Breakdown
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                    <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Pending Credits</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1 font-playfair">
                      {selectedStudent.pendingCredits}
                    </p>
                    <p className="text-[10px] text-emerald-700 mt-0.5">Ready to Attend</p>
                  </div>

                  <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-2xl text-center">
                    <p className="text-[11px] font-bold text-primary/60 uppercase tracking-wider">Used Credits</p>
                    <p className="text-2xl font-black text-primary mt-1 font-playfair">
                      {selectedStudent.usedCredits}
                    </p>
                    <p className="text-[10px] text-primary/50 mt-0.5">Classes Utilized</p>
                  </div>

                  <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-2xl text-center">
                    <p className="text-[11px] font-bold text-primary/60 uppercase tracking-wider">Total Quota</p>
                    <p className="text-2xl font-black text-primary mt-1 font-playfair">
                      {selectedStudent.totalCredits}
                    </p>
                    <p className="text-[10px] text-primary/50 mt-0.5">Allocated Plan</p>
                  </div>
                </div>
              </div>

              {/* Classes Attended with THIS Tutor */}
              <div className="space-y-3 pt-4 border-t border-secondary/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                    <Video size={14} className="text-accent" />
                    Classes with You ({selectedStudent.tutorClassHistory.length})
                  </h3>
                  <span className="text-xs font-bold text-accent">
                    {selectedStudent.attendedClassesWithTutor} Attended • {selectedStudent.upcomingClassesWithTutor} Upcoming
                  </span>
                </div>

                {selectedStudent.tutorClassHistory.length === 0 ? (
                  <div className="p-8 text-center bg-secondary/5 rounded-2xl border border-secondary/20 text-xs text-primary/50">
                    This student has not yet enrolled in any of your live classes.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {selectedStudent.tutorClassHistory.map((cls) => (
                      <div
                        key={cls.id}
                        className="p-3.5 bg-secondary/5 hover:bg-secondary/10 rounded-2xl border border-secondary/20 transition-all flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-primary text-sm truncate">{cls.title}</p>
                          <p className="text-xs text-primary/60 mt-1 flex items-center gap-1.5">
                            <CalendarIcon size={12} className="text-accent" />
                            {formatClassDate(cls.scheduledAt, true)} at {formatClassTime(cls.scheduledAt)}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                              cls.isPast || cls.status === "COMPLETED"
                                ? "bg-blue-50 border-blue-200 text-blue-700"
                                : "bg-emerald-50 border-emerald-200 text-emerald-700"
                            }`}
                          >
                            {cls.isPast || cls.status === "COMPLETED" ? (
                              <>
                                <CheckCircle2 size={10} /> Attended
                              </>
                            ) : (
                              <>
                                <Clock size={10} /> Upcoming
                              </>
                            )}
                          </span>
                          {cls.meetingUrl && !cls.isPast && (
                            <a
                              href={cls.meetingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-accent hover:underline font-bold flex items-center gap-0.5 mt-1 justify-end"
                            >
                              Join <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-secondary/20 bg-secondary/5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-6 py-2.5 bg-primary hover:bg-accent text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
