'use client';

import { useState } from 'react';
import { updateMeetingLink } from '../_actions';
import { toast } from 'sonner';
import { Link2, Check, X, Loader2 } from 'lucide-react';

export default function MeetingLinkEditor({ classId, initialUrl }: { classId: string, initialUrl: string | null }) {
  const [isEditing, setIsEditing] = useState(false);
  const [url, setUrl] = useState(initialUrl || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!url) return;
    
    setIsLoading(true);
    try {
      await updateMeetingLink(classId, url);
      toast.success('Meeting link updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update meeting link');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-sm mt-3 sm:mt-0">
        <input 
          type="url" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          placeholder="https://meet.google.com/..." 
          className="flex-1 bg-white border border-secondary/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent"
        />
        <div className="flex gap-2">
          <button 
            onClick={handleSave} 
            disabled={isLoading}
            className="p-2 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
          </button>
          <button 
            onClick={() => { setIsEditing(false); setUrl(initialUrl || ''); }} 
            disabled={isLoading}
            className="p-2 bg-secondary/20 text-primary/60 hover:bg-secondary/40 rounded-xl transition-colors disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 mt-3 sm:mt-0">
      {initialUrl ? (
        <a href={initialUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary bg-secondary/10 px-4 py-2 rounded-xl hover:bg-secondary/20 transition-colors truncate max-w-[200px]">
          {initialUrl}
        </a>
      ) : (
        <span className="text-xs font-bold text-accent bg-accent/10 px-4 py-2 rounded-xl uppercase tracking-widest">
          No Link Set
        </span>
      )}
      <button 
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-2 text-xs font-bold text-primary/60 hover:text-accent transition-colors bg-white border border-secondary/20 shadow-sm px-3 py-2 rounded-xl"
      >
        <Link2 size={14} /> {initialUrl ? 'Edit' : 'Add Link'}
      </button>
    </div>
  );
}
