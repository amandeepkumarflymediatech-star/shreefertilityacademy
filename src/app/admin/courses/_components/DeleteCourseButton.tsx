"use client";

import { Trash2 } from "lucide-react";

export default function DeleteCourseButton() {
  return (
    <button 
      type="submit"
      className="p-2 text-primary/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      title="Delete Course"
      onClick={(e) => !confirm("Are you sure you want to delete this course? All chapters and lessons will be lost.") && e.preventDefault()}
    >
      <Trash2 size={18} />
    </button>
  );
}
