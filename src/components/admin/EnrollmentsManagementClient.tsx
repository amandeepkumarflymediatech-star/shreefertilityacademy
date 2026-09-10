"use client";

import { useState, useMemo } from "react";
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Layers, 
  AlertCircle,
  X,
  UserCheck,
  ShieldCheck,
  Award,
  Sparkles
} from "lucide-react";
import { createMembership, updateMembership, deleteMembership } from "@/actions/admin-actions";
import { toast } from "sonner";
import Swal from "sweetalert2";

type MembershipItem = {
  id: string;
  studentId: string;
  startDate?: string | null;
  validUntil: string;
  status: string;
  maxClasses: number;
  usedClasses: number;
  createdAt: string;
  student?: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
    phone?: string | null;
  } | null;
};

type ClassEnrollmentItem = {
  id: string;
  sessionId: string;
  studentId: string;
  status: string;
  createdAt: string;
  student?: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  } | null;
  session?: {
    id: string;
    title: string;
    scheduledAt: string;
    status: string;
    tutor?: {
      id: string;
      name: string | null;
      email: string;
    } | null;
  } | null;
};

type StudentOption = {
  id: string;
  name: string | null;
  email: string;
};

interface Props {
  memberships: MembershipItem[];
  classEnrollments: ClassEnrollmentItem[];
  students: StudentOption[];
}

export default function EnrollmentsManagementClient({
  memberships,
  classEnrollments,
  students,
}: Props) {
  const [activeTab, setActiveTab] = useState<"memberships" | "roster">("memberships");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState<MembershipItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Summary Metrics
  const totalMemberships = memberships.length;
  const activeMemberships = memberships.filter((m) => m.status === "ACTIVE").length;
  const totalAllocatedClasses = memberships.reduce((sum, m) => sum + (m.maxClasses || 0), 0);
  const totalUsedClasses = memberships.reduce((sum, m) => sum + (m.usedClasses || 0), 0);

  // Filtered & Paginated Memberships
  const filteredMemberships = useMemo(() => {
    return memberships.filter((m) => {
      const matchesStatus = statusFilter === "ALL" || m.status === statusFilter;
      const lowerSearch = search.toLowerCase().trim();
      const matchesSearch =
        !lowerSearch ||
        m.student?.name?.toLowerCase().includes(lowerSearch) ||
        m.student?.email.toLowerCase().includes(lowerSearch) ||
        m.id.toLowerCase().includes(lowerSearch);
      return matchesStatus && matchesSearch;
    });
  }, [memberships, statusFilter, search]);

  const totalPages = Math.ceil(filteredMemberships.length / itemsPerPage) || 1;
  const paginatedMemberships = filteredMemberships.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Class Session Rosters Grouping
  const classRosters = useMemo(() => {
    const map = new Map<
      string,
      {
        session: NonNullable<ClassEnrollmentItem["session"]>;
        students: { id: string; name: string | null; email: string; status: string }[];
      }
    >();

    for (const enr of classEnrollments) {
      if (!enr.session) continue;
      if (!map.has(enr.sessionId)) {
        map.set(enr.sessionId, {
          session: enr.session,
          students: [],
        });
      }
      if (enr.student) {
        map.get(enr.sessionId)!.students.push({
          id: enr.student.id,
          name: enr.student.name,
          email: enr.student.email,
          status: enr.status,
        });
      }
    }

    let list = Array.from(map.values());
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.session.title.toLowerCase().includes(q) ||
          r.session.tutor?.name?.toLowerCase().includes(q) ||
          r.students.some((s) => s.name?.toLowerCase().includes(q) || s.email.toLowerCase().includes(q))
      );
    }
    return list;
  }, [classEnrollments, search]);

  const handleOpenEdit = (m: MembershipItem) => {
    setSelectedMembership(m);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMembership) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData(e.currentTarget);
      await updateMembership(selectedMembership.id, formData);
      toast.success("Student membership updated successfully");
      setIsEditModalOpen(false);
      setSelectedMembership(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update membership");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const formData = new FormData(e.currentTarget);
      await createMembership(formData);
      toast.success("Membership successfully granted to student");
      setIsCreateModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to grant membership");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, studentName: string) => {
    const result = await Swal.fire({
      title: "Remove Membership?",
      text: `Are you sure you want to remove the membership for ${studentName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        await deleteMembership(id);
        toast.success("Membership removed");
      } catch (err: any) {
        toast.error(err.message || "Failed to delete membership");
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-accent/10 text-accent font-bold px-3 py-1 rounded-full text-xs uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={13} /> Admin Portal
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">
            Enrollments & Memberships
          </h1>
          <p className="text-primary/70 mt-1 font-sans text-base">
            Track student subscriptions, live class quota allocations, and attendance rosters.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-accent text-white font-bold px-5 py-3 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 text-sm cursor-pointer"
        >
          <Plus size={18} /> Grant Student Membership
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-secondary/20 rounded-3xl p-6 shadow-sm hover:border-accent/40 transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">
                Total Memberships
              </p>
              <h3 className="text-3xl font-black text-primary mt-2 font-playfair">
                {totalMemberships}
              </h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-secondary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <GraduationCap size={22} />
            </div>
          </div>
          <p className="text-xs text-primary/50 mt-4 flex items-center gap-1.5 font-medium">
            <Users size={14} className="text-accent" /> Cumulative Student Enrollments
          </p>
        </div>

        <div className="bg-white border border-secondary/20 rounded-3xl p-6 shadow-sm hover:border-accent/40 transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">
                Active Students
              </p>
              <h3 className="text-3xl font-black text-emerald-600 mt-2 font-playfair">
                {activeMemberships}
              </h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
              <UserCheck size={22} />
            </div>
          </div>
          <p className="text-xs text-primary/50 mt-4 flex items-center gap-1.5 font-medium">
            <CheckCircle2 size={14} className="text-emerald-500" /> Active learning access
          </p>
        </div>

        <div className="bg-white border border-secondary/20 rounded-3xl p-6 shadow-sm hover:border-accent/40 transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">
                Classes Allocated
              </p>
              <h3 className="text-3xl font-black text-primary mt-2 font-playfair">
                {totalAllocatedClasses}
              </h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300">
              <BookOpen size={22} />
            </div>
          </div>
          <p className="text-xs text-primary/50 mt-4 flex items-center gap-1.5 font-medium">
            <Award size={14} className="text-accent" /> Total live session credits
          </p>
        </div>

        <div className="bg-white border border-secondary/20 rounded-3xl p-6 shadow-sm hover:border-accent/40 transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">
                Classes Attended
              </p>
              <h3 className="text-3xl font-black text-accent mt-2 font-playfair">
                {totalUsedClasses}
              </h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-secondary/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300">
              <CheckCircle2 size={22} />
            </div>
          </div>
          <p className="text-xs text-primary/50 mt-4 flex items-center gap-1.5 font-medium">
            <Clock size={14} className="text-primary/60" />{" "}
            {totalAllocatedClasses > 0
              ? `${Math.round((totalUsedClasses / totalAllocatedClasses) * 100)}% utilization rate`
              : "0% utilization rate"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-secondary/20 gap-2">
        <button
          onClick={() => {
            setActiveTab("memberships");
            setCurrentPage(1);
          }}
          className={`px-6 py-3 font-bold text-sm rounded-t-2xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "memberships"
              ? "bg-white text-primary border-t-2 border-x-2 border-secondary/20 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]"
              : "text-primary/60 hover:text-primary hover:bg-secondary/5"
          }`}
        >
          <GraduationCap size={16} /> Student Memberships & Quotas ({memberships.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("roster");
            setCurrentPage(1);
          }}
          className={`px-6 py-3 font-bold text-sm rounded-t-2xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "roster"
              ? "bg-white text-primary border-t-2 border-x-2 border-secondary/20 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]"
              : "text-primary/60 hover:text-primary hover:bg-secondary/5"
          }`}
        >
          <Layers size={16} /> Class Session Rosters ({classRosters.length})
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border border-secondary/20 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
          <input
            type="text"
            placeholder={
              activeTab === "memberships"
                ? "Search by student name, email, or membership ID..."
                : "Search classes, tutors, or enrolled students..."
            }
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-11 pr-4 py-3 bg-secondary/5 border border-secondary/20 rounded-2xl text-sm text-primary placeholder:text-primary/40 focus:outline-none focus:border-accent focus:bg-white transition-all"
          />
        </div>

        {activeTab === "memberships" && (
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-primary/40 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-secondary/5 border border-secondary/20 rounded-2xl px-4 py-3 text-xs font-bold text-primary uppercase tracking-widest outline-none focus:border-accent cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="RENEWED">Renewed</option>
              <option value="EXPIRED">Expired</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === "memberships" ? (
        <div className="bg-white border border-secondary/20 rounded-3xl shadow-sm overflow-hidden">
          {paginatedMemberships.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/5 border-b border-secondary/10">
                    <th className="py-4 px-6 text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                      Student
                    </th>
                    <th className="py-4 px-6 text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                      Plan / Membership
                    </th>
                    <th className="py-4 px-6 text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                      Class Quota & Usage
                    </th>
                    <th className="py-4 px-6 text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                      Validity Period
                    </th>
                    <th className="py-4 px-6 text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="py-4 px-6 text-[10px] font-bold text-primary/60 uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary/10">
                  {paginatedMemberships.map((m) => {
                    const max = m.maxClasses || 0;
                    const used = m.usedClasses || 0;
                    const remaining = Math.max(0, max - used);
                    const percent = max > 0 ? Math.min(100, Math.round((used / max) * 100)) : 0;
                    const isExpired = new Date(m.validUntil) < new Date();

                    return (
                      <tr key={m.id} className="hover:bg-secondary/5 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm border border-primary/20 shrink-0">
                              {m.student?.name ? m.student.name[0].toUpperCase() : "S"}
                            </div>
                            <div>
                              <p className="font-bold text-primary text-sm">
                                {m.student?.name || "Student"}
                              </p>
                              <p className="text-xs text-primary/60">{m.student?.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="font-semibold text-primary text-xs bg-secondary/10 px-2.5 py-1 rounded-lg">
                            IVF Fellowship Mentorship
                          </span>
                          <p className="text-[10px] text-primary/40 mt-1">ID: #{m.id.slice(0, 8)}</p>
                        </td>

                        <td className="py-4 px-6 min-w-[200px]">
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-primary">
                                {used} / {max} Classes
                              </span>
                              <span className="text-[10px] font-bold text-accent">
                                {remaining} remaining
                              </span>
                            </div>
                            <div className="w-full bg-secondary/20 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  percent >= 100
                                    ? "bg-rose-500"
                                    : percent >= 75
                                    ? "bg-amber-500"
                                    : "bg-accent"
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="text-xs text-primary/80">
                            <p className="flex items-center gap-1.5 font-medium">
                              <Calendar size={13} className="text-primary/40" />
                              Valid till:{" "}
                              <span className="font-bold text-primary">
                                {new Date(m.validUntil).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </p>
                            <p className="text-[10px] text-primary/40 mt-0.5">
                              Enrolled: {new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                              m.status === "ACTIVE" && !isExpired
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : m.status === "RENEWED"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : isExpired || m.status === "EXPIRED"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-gray-100 text-gray-700 border border-gray-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                m.status === "ACTIVE" && !isExpired
                                  ? "bg-emerald-500"
                                  : m.status === "RENEWED"
                                  ? "bg-blue-500"
                                  : "bg-rose-500"
                              }`}
                            />
                            {isExpired && m.status === "ACTIVE" ? "EXPIRED" : m.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(m)}
                              title="Edit Class Quota & Validity"
                              className="p-2 bg-secondary/10 hover:bg-accent hover:text-white text-primary rounded-xl transition-colors cursor-pointer"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(m.id, m.student?.name || m.student?.email || "Student")}
                              title="Remove Membership"
                              className="p-2 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 rounded-xl transition-colors cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-primary/30">
                <GraduationCap size={32} />
              </div>
              <p className="text-primary/70 font-medium">No memberships found matching your filters.</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="text-accent font-bold text-sm hover:underline cursor-pointer"
              >
                + Grant membership to a student
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 border-t border-secondary/10 bg-secondary/5">
              <p className="text-xs text-primary/60">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredMemberships.length)} of{" "}
                {filteredMemberships.length} memberships
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-xl bg-white border border-secondary/20 text-primary disabled:opacity-40 hover:bg-secondary/10 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold text-primary px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-xl bg-white border border-secondary/20 text-primary disabled:opacity-40 hover:bg-secondary/10 transition-colors cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Class Session Rosters View */
        <div className="space-y-6">
          {classRosters.length > 0 ? (
            classRosters.map((roster) => (
              <div
                key={roster.session.id}
                className="bg-white border border-secondary/20 rounded-3xl p-6 shadow-sm hover:border-accent/40 transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-secondary/10">
                  <div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full inline-block mb-2 ${
                        roster.session.status === "SCHEDULED"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : roster.session.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200"
                      }`}
                    >
                      {roster.session.status}
                    </span>
                    <h3 className="text-lg font-bold text-primary">{roster.session.title}</h3>
                    <p className="text-xs text-primary/60 mt-1 flex items-center gap-3">
                      <span>
                        Mentor: <strong>{roster.session.tutor?.name || "Tutor"}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Scheduled:{" "}
                        <strong>
                          {new Date(roster.session.scheduledAt).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </strong>
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-secondary/10 px-4 py-2 rounded-2xl">
                    <Users size={18} className="text-accent" />
                    <div>
                      <p className="text-xs font-bold text-primary">
                        {roster.students.length} Enrolled Students
                      </p>
                      <p className="text-[10px] text-primary/50">Class Attendance List</p>
                    </div>
                  </div>
                </div>

                {/* Enrolled Students Chips */}
                <div className="pt-6">
                  <h4 className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-3">
                    Enrolled Students:
                  </h4>
                  {roster.students.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {roster.students.map((st) => (
                        <div
                          key={st.id}
                          className="flex items-center justify-between p-3 bg-secondary/5 rounded-2xl border border-secondary/10"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-accent/10 text-accent font-bold text-xs flex items-center justify-center">
                              {st.name ? st.name[0].toUpperCase() : "S"}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-primary">{st.name || "Student"}</p>
                              <p className="text-[10px] text-primary/60">{st.email}</p>
                            </div>
                          </div>
                          <span className="text-[9px] font-bold uppercase bg-white px-2 py-0.5 rounded-full border border-secondary/20 text-emerald-600">
                            {st.status || "CONFIRMED"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-primary/50 italic">
                      No students enrolled in this session yet.
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-secondary/20 rounded-3xl p-16 text-center shadow-sm">
              <BookOpen size={36} className="mx-auto text-primary/30 mb-3" />
              <p className="text-primary/70 font-medium">No live class rosters found.</p>
            </div>
          )}
        </div>
      )}

      {/* Edit Membership Modal */}
      {isEditModalOpen && selectedMembership && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-secondary/20 relative">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedMembership(null);
              }}
              className="absolute top-6 right-6 p-2 text-primary/50 hover:text-primary rounded-full hover:bg-secondary/10 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full inline-block mb-2">
                Membership Adjustments
              </span>
              <h3 className="text-2xl font-black text-primary font-playfair">
                Edit Student Quota
              </h3>
              <p className="text-xs text-primary/60 mt-1">
                Student: <strong>{selectedMembership.student?.name}</strong> ({selectedMembership.student?.email})
              </p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1">
                    Max Allowed Classes
                  </label>
                  <input
                    type="number"
                    name="maxClasses"
                    min="1"
                    defaultValue={selectedMembership.maxClasses}
                    required
                    className="w-full px-4 py-3 bg-secondary/5 border border-secondary/20 rounded-2xl text-sm font-bold text-primary focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1">
                    Used / Attended Classes
                  </label>
                  <input
                    type="number"
                    name="usedClasses"
                    min="0"
                    defaultValue={selectedMembership.usedClasses}
                    required
                    className="w-full px-4 py-3 bg-secondary/5 border border-secondary/20 rounded-2xl text-sm font-bold text-primary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1">
                  Membership Expiration Date
                </label>
                <input
                  type="date"
                  name="validUntil"
                  defaultValue={
                    selectedMembership.validUntil
                      ? new Date(selectedMembership.validUntil).toISOString().split("T")[0]
                      : ""
                  }
                  required
                  className="w-full px-4 py-3 bg-secondary/5 border border-secondary/20 rounded-2xl text-sm text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={selectedMembership.status}
                  className="w-full px-4 py-3 bg-secondary/5 border border-secondary/20 rounded-2xl text-sm font-bold text-primary focus:outline-none focus:border-accent"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="RENEWED">RENEWED</option>
                  <option value="EXPIRED">EXPIRED</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-secondary/10">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-secondary/20 font-bold text-xs text-primary hover:bg-secondary/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-accent font-bold text-xs text-white shadow-sm transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grant Student Membership Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-secondary/20 relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-primary/50 hover:text-primary rounded-full hover:bg-secondary/10 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full inline-block mb-2">
                Manual Enrollment
              </span>
              <h3 className="text-2xl font-black text-primary font-playfair">
                Grant Student Membership
              </h3>
              <p className="text-xs text-primary/60 mt-1">
                Allocate live class package and duration to a student account.
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1">
                  Select Student
                </label>
                <select
                  name="studentId"
                  required
                  className="w-full px-4 py-3 bg-secondary/5 border border-secondary/20 rounded-2xl text-sm font-bold text-primary focus:outline-none focus:border-accent"
                >
                  <option value="">-- Choose a Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name || "Student"} ({s.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1">
                    Class Quota
                  </label>
                  <input
                    type="number"
                    name="maxClasses"
                    min="1"
                    defaultValue={12}
                    required
                    className="w-full px-4 py-3 bg-secondary/5 border border-secondary/20 rounded-2xl text-sm font-bold text-primary focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1">
                    Initial Used Classes
                  </label>
                  <input
                    type="number"
                    name="usedClasses"
                    min="0"
                    defaultValue={0}
                    required
                    className="w-full px-4 py-3 bg-secondary/5 border border-secondary/20 rounded-2xl text-sm font-bold text-primary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1">
                  Valid Until
                </label>
                <input
                  type="date"
                  name="validUntil"
                  defaultValue={
                    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  }
                  required
                  className="w-full px-4 py-3 bg-secondary/5 border border-secondary/20 rounded-2xl text-sm text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-secondary/10">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-secondary/20 font-bold text-xs text-primary hover:bg-secondary/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-accent font-bold text-xs text-white shadow-sm transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Granting..." : "Grant Membership"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
