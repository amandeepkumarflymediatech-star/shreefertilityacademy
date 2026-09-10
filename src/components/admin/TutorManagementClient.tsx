"use client";

import { useState, useMemo, useTransition, useRef } from "react";
import { 
  GraduationCap, 
  Search, 
  CheckCircle, 
  XCircle, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  X, 
  Mail, 
  Phone, 
  Clock, 
  Globe, 
  BookOpen, 
  Award, 
  UserCheck, 
  UserX,
  FileText,
  Upload,
  Camera,
  Loader2,
  Key,
  EyeOff
} from "lucide-react";
import { approveTutor, createTutor, updateTutor, deleteTutor } from "@/actions/admin-actions";
import { toast } from "sonner";
import Swal from "sweetalert2";

export type Tutor = {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  phone?: string | null;
  timezone?: string | null;
  role?: string;
  isActive?: boolean;
  isApproved: boolean;
  onboardingStatus?: string | null;
  bio?: string | null;
  experience?: string | null;
  qualifications?: string | null;
  languages?: string | null;
  teachingHeadline?: string | null;
  teachingLevels?: string | null;
  teachingAges?: string | null;
  teachingStyle?: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date;
};

export default function TutorManagementClient({ tutors }: { tutors: Tutor[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Tutor; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [editingTutor, setEditingTutor] = useState<Tutor | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const itemsPerPage = 10;

  const generateRandomPassword = () => {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
    let pwd = "";
    for (let i = 0; i < 10; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPasswordValue(pwd);
    setShowPassword(true);
    toast.info(`Generated password: ${pwd}`);
  };

  const processedTutors = useMemo(() => {
    let result = [...tutors];

    if (statusFilter !== "ALL") {
      const approved = statusFilter === "APPROVED";
      result = result.filter(t => t.isApproved === approved);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(t => 
        (t.name?.toLowerCase() || "").includes(lowerSearch) || 
        t.email.toLowerCase().includes(lowerSearch) ||
        (t.teachingHeadline?.toLowerCase() || "").includes(lowerSearch) ||
        (t.languages?.toLowerCase() || "").includes(lowerSearch)
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (aValue === null || aValue === undefined) aValue = "";
        if (bValue === null || bValue === undefined) bValue = "";
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [tutors, search, statusFilter, sortConfig]);

  const totalPages = Math.ceil(processedTutors.length / itemsPerPage);
  const paginatedTutors = processedTutors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key: keyof Tutor) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleApproval = async (id: string, isApproved: boolean) => {
    startTransition(async () => {
      try {
        await approveTutor(id, isApproved);
        toast.success(isApproved ? "Tutor approved successfully!" : "Tutor approval revoked.");
      } catch (error: any) {
        toast.error(error.message || "Failed to update tutor status.");
      }
    });
  };

  const openCreateModal = () => {
    setEditingTutor(null);
    setImageUrl("");
    setPasswordValue("");
    setShowPassword(false);
    setIsFormModalOpen(true);
  };

  const openEditModal = (tutor: Tutor) => {
    setEditingTutor(tutor);
    setImageUrl(tutor.image || "");
    setPasswordValue("");
    setShowPassword(false);
    setIsFormModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
        toast.success("Profile image uploaded successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Error uploading image");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (tutor: Tutor) => {
    const result = await Swal.fire({
      title: 'Delete Tutor?',
      text: `Are you sure you want to permanently delete "${tutor.name || tutor.email}"? This will also remove their scheduled classes and reviews.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete tutor'
    });

    if (result.isConfirmed) {
      startTransition(async () => {
        try {
          await deleteTutor(tutor.id);
          toast.success("Tutor deleted successfully!");
        } catch (error: any) {
          toast.error(error.message || "Failed to delete tutor.");
        }
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("image", imageUrl);

    startTransition(async () => {
      try {
        if (editingTutor) {
          await updateTutor(editingTutor.id, formData);
          toast.success("Tutor profile updated successfully!");
        } else {
          await createTutor(formData);
          toast.success("New tutor added successfully!");
        }
        setIsFormModalOpen(false);
        setEditingTutor(null);
        setImageUrl("");
        setPasswordValue("");
        setShowPassword(false);
      } catch (error: any) {
        toast.error(error.message || "Failed to save tutor details.");
      }
    });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-secondary/50 pb-6 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-playfair">Tutor Management</h1>
          <p className="text-primary/70 mt-2 font-sans text-base sm:text-lg">Create, edit, approve, and manage mentors & tutors.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="px-8 py-3.5 bg-accent hover:bg-primary text-white font-bold uppercase tracking-wider text-sm transition-all rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
        >
          <Plus size={18} />
          Add Tutor
        </button>
      </div>

      <div className="bg-white border border-secondary/30 rounded-3xl flex flex-col shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-secondary/30 bg-secondary/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, headline, language..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white border border-secondary/40 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-accent focus:border-accent text-primary outline-none transition-all placeholder-primary/40 shadow-sm"
            />
          </div>
          <div className="flex gap-4 w-full sm:w-auto items-center">
            <span className="text-sm font-bold text-primary/60 uppercase tracking-widest hidden sm:block">Filter:</span>
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full sm:w-auto px-4 py-3 bg-white border border-secondary/40 rounded-xl text-xs font-bold text-primary outline-none uppercase tracking-widest focus:border-accent focus:ring-1 focus:ring-accent transition-colors shadow-sm cursor-pointer"
            >
              <option value="ALL">All Tutors ({tutors.length})</option>
              <option value="APPROVED">Approved ({tutors.filter(t => t.isApproved).length})</option>
              <option value="PENDING">Pending Review ({tutors.filter(t => !t.isApproved).length})</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-secondary/30 bg-secondary/10">
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">Tutor Profile {sortConfig?.key === 'name' && <ArrowUpDown size={14} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />}</div>
                </th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest">
                  Specialization & Experience
                </th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => handleSort('createdAt')}>
                  <div className="flex items-center gap-2">Joined {sortConfig?.key === 'createdAt' && <ArrowUpDown size={14} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />}</div>
                </th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => handleSort('isApproved')}>
                  <div className="flex items-center gap-2">Status {sortConfig?.key === 'isApproved' && <ArrowUpDown size={14} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />}</div>
                </th>
                <th className="p-6 text-xs font-bold text-primary/60 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTutors.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-primary/60 font-medium">No tutors found matching your search.</td>
                </tr>
              )}
              {paginatedTutors.map((tutor) => (
                <tr key={tutor.id} className="border-b border-secondary/20 last:border-0 hover:bg-gray-50/80 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shrink-0 overflow-hidden border border-secondary/40">
                        {tutor.image ? (
                          <img src={tutor.image} alt={tutor.name || "Tutor"} className="w-full h-full object-cover" />
                        ) : (
                          (tutor.name?.[0] || tutor.email[0]).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-primary text-sm sm:text-base">{tutor.name || 'Unknown User'}</p>
                        <p className="text-xs text-primary/60 flex items-center gap-1.5 mt-0.5">
                          <Mail size={12} /> {tutor.email}
                        </p>
                        {tutor.phone && (
                          <p className="text-xs text-primary/50 flex items-center gap-1.5 mt-0.5">
                            <Phone size={12} /> {tutor.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-semibold text-primary line-clamp-1">{tutor.teachingHeadline || 'Tutor'}</p>
                    <p className="text-xs text-primary/60 mt-0.5">
                      {tutor.experience ? `${tutor.experience}` : 'Experience not listed'}
                      {tutor.languages ? ` • ${tutor.languages}` : ''}
                    </p>
                  </td>
                  <td className="p-6 text-sm text-primary/80 font-medium">
                    {new Date(tutor.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-6">
                    {tutor.isApproved ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-green-700 bg-green-100/80 border border-green-200 rounded-lg px-3 py-1.5">
                        <CheckCircle size={14} /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 border border-amber-200 rounded-lg px-3 py-1.5">
                        <GraduationCap size={14} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="p-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Details */}
                      <button 
                        onClick={() => setSelectedTutor(tutor)}
                        className="p-2 text-primary/60 hover:text-primary hover:bg-secondary/20 rounded-lg transition-colors cursor-pointer"
                        title="View Full Profile"
                      >
                        <Eye size={17} />
                      </button>

                      {/* Toggle Approve / Revoke */}
                      {!tutor.isApproved ? (
                        <button 
                          onClick={() => {
                            toast("Approve this tutor for public teaching?", {
                              action: { label: 'Approve', onClick: () => handleApproval(tutor.id, true) }
                            });
                          }}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                          title="Approve Tutor"
                        >
                          <UserCheck size={17} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            toast("Revoke tutor approval?", {
                              action: { label: 'Revoke', onClick: () => handleApproval(tutor.id, false) }
                            });
                          }}
                          className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Revoke Approval"
                        >
                          <UserX size={17} />
                        </button>
                      )}

                      {/* Edit Tutor */}
                      <button 
                        onClick={() => openEditModal(tutor)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Tutor Profile"
                      >
                        <Edit size={17} />
                      </button>

                      {/* Delete Tutor */}
                      <button 
                        onClick={() => handleDelete(tutor)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Tutor"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-secondary/30 bg-secondary/5 flex items-center justify-between">
            <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, processedTutors.length)} of {processedTutors.length}
            </span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-secondary/40 bg-white text-primary hover:bg-secondary/10 disabled:opacity-50 transition-colors cursor-pointer"><ChevronLeft size={18} /></button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-secondary/40 bg-white text-primary hover:bg-secondary/10 disabled:opacity-50 transition-colors cursor-pointer"><ChevronRight size={18} /></button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT TUTOR MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-secondary/30 w-full max-w-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden my-8">
            <div className="flex justify-between items-center p-6 sm:p-8 border-b border-secondary/30 bg-secondary/5">
              <div>
                <h2 className="text-2xl font-black text-primary font-playfair tracking-tight">
                  {editingTutor ? "Edit Tutor Profile" : "Add New Tutor"}
                </h2>
                <p className="text-xs text-primary/60 mt-1 font-sans">
                  {editingTutor ? "Update tutor credentials, profile picture, teaching details, and permissions." : "Create a new tutor account with teaching details and profile photo."}
                </p>
              </div>
              <button onClick={() => { setIsFormModalOpen(false); setEditingTutor(null); }} className="p-2 text-primary/50 hover:text-accent hover:bg-accent/10 rounded-full transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* HIDDEN IMAGE INPUT */}
              <input type="hidden" name="image" value={imageUrl} />

              {/* PROFILE PHOTO UPLOADER SECTION */}
              <div className="p-5 bg-secondary/10 rounded-2xl border border-secondary/30 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-white border-2 border-accent shadow-md flex items-center justify-center">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <GraduationCap className="text-primary/30" size={40} />
                    )}
                  </div>
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white">
                      <Loader2 className="animate-spin" size={24} />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <h4 className="text-sm font-bold text-primary">Tutor Profile Picture</h4>
                  <p className="text-xs text-primary/60">
                    Upload a high-quality portrait photo for the tutor profile and public mentor listings (PNG, JPG, WebP).
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageFileChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <button
                      type="button"
                      disabled={isUploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-primary hover:bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingImage ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                      {imageUrl ? "Change Photo" : "Upload Photo"}
                    </button>

                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer border border-red-200"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 1: ACCOUNT DETAILS */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-accent border-b border-secondary/30 pb-2">
                  1. Account & Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1.5 ml-1">Full Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      defaultValue={editingTutor?.name || ""}
                      required
                      placeholder="Dr. Jane Doe"
                      className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1.5 ml-1">Email Address *</label>
                    <input 
                      type="email" 
                      name="email"
                      defaultValue={editingTutor?.email || ""}
                      required
                      placeholder="tutor@shreefertility.com"
                      className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5 ml-1">
                      <label className="block text-xs font-bold text-primary uppercase tracking-widest">
                        {editingTutor ? "New Password (Optional)" : "Password *"}
                      </label>
                      <button
                        type="button"
                        onClick={generateRandomPassword}
                        className="text-[11px] font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                        title="Generate a random secure password"
                      >
                        <Key size={12} /> Auto-Generate
                      </button>
                    </div>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        name="password"
                        value={passwordValue}
                        onChange={(e) => setPasswordValue(e.target.value)}
                        required={!editingTutor}
                        placeholder={editingTutor ? "Leave blank to keep current password" : "Enter password"}
                        className="w-full bg-secondary/5 border border-secondary/50 rounded-xl pl-4 pr-11 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary transition-colors cursor-pointer"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {editingTutor && (
                      <p className="text-[11px] text-primary/50 mt-1 ml-1">
                        Leave blank to keep the tutor&apos;s current password unchanged.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                    <input 
                      type="text" 
                      name="phone"
                      defaultValue={editingTutor?.phone || ""}
                      placeholder="+91 98765 43210"
                      className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1.5 ml-1">Timezone</label>
                    <input 
                      type="text" 
                      name="timezone"
                      defaultValue={editingTutor?.timezone || "Asia/Kolkata"}
                      placeholder="Asia/Kolkata"
                      className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: TEACHING & SPECIALTIES */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-accent border-b border-secondary/30 pb-2">
                  2. Professional & Teaching Profile
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1.5 ml-1">Teaching Headline / Title</label>
                    <input 
                      type="text" 
                      name="teachingHeadline"
                      defaultValue={editingTutor?.teachingHeadline || ""}
                      placeholder="e.g. Senior Embryologist & Clinical IVF Specialist"
                      className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1.5 ml-1">Experience</label>
                    <input 
                      type="text" 
                      name="experience"
                      defaultValue={editingTutor?.experience || ""}
                      placeholder="e.g. 10+ Years in Clinical IVF"
                      className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1.5 ml-1">Degrees & Qualifications</label>
                    <input 
                      type="text" 
                      name="qualifications"
                      defaultValue={editingTutor?.qualifications || ""}
                      placeholder="e.g. MBBS, MS (OBG), DRM"
                      className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1.5 ml-1">Languages Spoken</label>
                    <input 
                      type="text" 
                      name="languages"
                      defaultValue={editingTutor?.languages || ""}
                      placeholder="e.g. English, Hindi"
                      className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1.5 ml-1">Teaching Levels</label>
                    <input 
                      type="text" 
                      name="teachingLevels"
                      defaultValue={editingTutor?.teachingLevels || ""}
                      placeholder="e.g. Beginner, Intermediate, Advanced"
                      className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1.5 ml-1">Target Learners</label>
                    <input 
                      type="text" 
                      name="teachingAges"
                      defaultValue={editingTutor?.teachingAges || ""}
                      placeholder="e.g. Medical Graduates, IVF Trainees"
                      className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1.5 ml-1">Teaching Style</label>
                    <input 
                      type="text" 
                      name="teachingStyle"
                      defaultValue={editingTutor?.teachingStyle || ""}
                      placeholder="e.g. Case Studies, Live Demos"
                      className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-1.5 ml-1">Bio / Overview</label>
                    <textarea 
                      name="bio"
                      rows={3}
                      defaultValue={editingTutor?.bio || ""}
                      placeholder="Brief overview of experience, expertise, and teaching approach..."
                      className="w-full bg-secondary/5 border border-secondary/50 rounded-xl px-4 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent text-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: APPROVAL STATUS */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-accent border-b border-secondary/30 pb-2">
                  3. Approval Status
                </h3>
                <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-2xl border border-secondary/30">
                  <input 
                    type="checkbox" 
                    id="isApproved" 
                    name="isApproved" 
                    value="true"
                    defaultChecked={editingTutor ? editingTutor.isApproved : true}
                    className="w-5 h-5 rounded text-accent focus:ring-accent cursor-pointer accent-accent"
                  />
                  <label htmlFor="isApproved" className="text-sm font-bold text-primary cursor-pointer select-none">
                    Approve tutor for public mentors page & live classes
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-secondary/20">
                <button 
                  type="button" 
                  onClick={() => { setIsFormModalOpen(false); setEditingTutor(null); setImageUrl(""); }}
                  className="px-6 py-3 border border-secondary/40 text-primary rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-secondary/20 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isPending || isUploadingImage}
                  className="px-6 py-3 bg-accent hover:bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isPending ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : (editingTutor ? "Update Tutor" : "Create Tutor")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {selectedTutor && (
        <div className="fixed inset-0 z-50 bg-primary/20 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-secondary/30 max-w-2xl w-full p-6 sm:p-8 relative animate-in fade-in zoom-in duration-300 my-8">
            <button 
              onClick={() => setSelectedTutor(null)}
              className="absolute top-6 right-6 p-2 bg-secondary/20 hover:bg-secondary/40 text-primary rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary text-xl shrink-0 overflow-hidden border border-secondary/40">
                {selectedTutor.image ? (
                  <img src={selectedTutor.image} alt={selectedTutor.name || "Tutor"} className="w-full h-full object-cover" />
                ) : (
                  (selectedTutor.name?.[0] || selectedTutor.email[0]).toUpperCase()
                )}
              </div>
              <div>
                <h2 className="text-2xl font-black text-primary font-playfair">{selectedTutor.name || 'Unknown Tutor'}</h2>
                <p className="text-sm font-semibold text-accent">{selectedTutor.teachingHeadline || 'Mentor / Tutor'}</p>
                <div className="flex items-center gap-2 mt-1">
                  {selectedTutor.isApproved ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-green-700 bg-green-100 rounded-md px-2 py-0.5">
                      <CheckCircle size={12} /> Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 rounded-md px-2 py-0.5">
                      <GraduationCap size={12} /> Pending Review
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary/5 p-4 rounded-2xl border border-secondary/20">
                <div>
                  <p className="text-xs font-bold text-primary/50 uppercase tracking-widest">Email</p>
                  <p className="text-primary font-medium text-sm flex items-center gap-1.5 mt-0.5"><Mail size={14} /> {selectedTutor.email}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-primary/50 uppercase tracking-widest">Phone</p>
                  <p className="text-primary font-medium text-sm flex items-center gap-1.5 mt-0.5"><Phone size={14} /> {selectedTutor.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-primary/50 uppercase tracking-widest">Timezone</p>
                  <p className="text-primary font-medium text-sm flex items-center gap-1.5 mt-0.5"><Clock size={14} /> {selectedTutor.timezone || 'Asia/Kolkata'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-primary/50 uppercase tracking-widest">Languages</p>
                  <p className="text-primary font-medium text-sm flex items-center gap-1.5 mt-0.5"><Globe size={14} /> {selectedTutor.languages || 'English'}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-primary/50 uppercase tracking-widest">Experience</p>
                <p className="text-primary font-medium text-sm mt-0.5">{selectedTutor.experience || 'Not provided'}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-primary/50 uppercase tracking-widest">Qualifications</p>
                <p className="text-primary font-medium text-sm mt-0.5">{selectedTutor.qualifications || 'Not provided'}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-primary/50 uppercase tracking-widest">Teaching Levels & Audience</p>
                <p className="text-primary font-medium text-sm mt-0.5">
                  {selectedTutor.teachingLevels ? `Levels: ${selectedTutor.teachingLevels}` : ''}
                  {selectedTutor.teachingAges ? ` | Audience: ${selectedTutor.teachingAges}` : ''}
                  {!selectedTutor.teachingLevels && !selectedTutor.teachingAges && 'Not specified'}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-primary/50 uppercase tracking-widest">Teaching Style</p>
                <p className="text-primary font-medium text-sm mt-0.5">{selectedTutor.teachingStyle || 'Not specified'}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-primary/50 uppercase tracking-widest">Bio & Overview</p>
                <p className="text-primary font-medium text-sm whitespace-pre-wrap mt-0.5">{selectedTutor.bio || 'Not provided'}</p>
              </div>

              {selectedTutor.qualifications && selectedTutor.qualifications.startsWith('CV: ') && (
                <div className="pt-2">
                  <p className="text-xs font-bold text-primary/50 uppercase tracking-widest">Resume / CV Document</p>
                  <a 
                    href={selectedTutor.qualifications.replace('CV: ', '')} 
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 mt-1.5 px-4 py-2 bg-accent text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-primary transition-colors"
                  >
                    <FileText size={14} /> Download CV
                  </a>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-secondary/20">
              <button 
                onClick={() => {
                  const t = selectedTutor;
                  setSelectedTutor(null);
                  openEditModal(t);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Edit size={14} /> Edit Tutor
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
