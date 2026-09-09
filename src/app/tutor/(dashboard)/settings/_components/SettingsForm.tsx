"use client";

import { useState } from "react";
import { UserAttributes as User } from "@/models";
import { Save, Bell, Globe, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SettingsFormProps {
  user: User;
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    timezone: user.timezone || "Asia/Kolkata",
    phone: user.phone || "",
    emailNotifications: true,
    smsNotifications: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, this would hit an API endpoint to update the user
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* General Settings */}
      <div className="bg-white border border-secondary/30 p-8 rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-secondary/30 pb-4">
          <div className="p-2 bg-primary/5 text-primary rounded-xl">
            <Globe size={20} />
          </div>
          <h3 className="text-xl font-bold text-primary tracking-tight font-playfair">General</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-primary/70 uppercase tracking-widest">Timezone</label>
            <select 
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="Europe/London">London (GMT)</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-primary/70 uppercase tracking-widest">Phone Number</label>
            <input 
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-xl border border-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white border border-secondary/30 p-8 rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-secondary/30 pb-4">
          <div className="p-2 bg-primary/5 text-primary rounded-xl">
            <Bell size={20} />
          </div>
          <h3 className="text-xl font-bold text-primary tracking-tight font-playfair">Notifications</h3>
        </div>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 rounded-xl border border-secondary/30 hover:bg-secondary/5 transition-colors cursor-pointer">
            <div>
              <div className="font-bold text-primary">Email Notifications</div>
              <div className="text-sm text-primary/60 mt-1">Receive updates about new enrollments and messages.</div>
            </div>
            <input 
              type="checkbox" 
              name="emailNotifications"
              checked={formData.emailNotifications}
              onChange={handleChange}
              className="w-5 h-5 accent-accent"
            />
          </label>
          
          <label className="flex items-center justify-between p-4 rounded-xl border border-secondary/30 hover:bg-secondary/5 transition-colors cursor-pointer">
            <div>
              <div className="font-bold text-primary">SMS Alerts</div>
              <div className="text-sm text-primary/60 mt-1">Get text messages for upcoming class reminders.</div>
            </div>
            <input 
              type="checkbox" 
              name="smsNotifications"
              checked={formData.smsNotifications}
              onChange={handleChange}
              className="w-5 h-5 accent-accent"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          type="submit"
          disabled={isLoading}
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isLoading ? "Saving..." : "Save Settings"}
        </button>
      </div>

    </form>
  );
}
