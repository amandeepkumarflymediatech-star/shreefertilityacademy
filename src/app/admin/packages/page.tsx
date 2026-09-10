'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    regularPrice: '',
    classCount: '12',
    tagline: '',
    validTill: '',
    features: '',
    isActive: true
  });

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/packages');
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch (error) {
      toast.error('Failed to load packages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      price: '',
      regularPrice: '',
      classCount: '12',
      tagline: '',
      validTill: '',
      features: '',
      isActive: true
    });
    setEditingId(null);
  };

  const openModal = (pkg?: any) => {
    if (pkg) {
      setEditingId(pkg.id);
      let featuresStr = '';
      try {
        if (pkg.features) {
          const parsed = JSON.parse(pkg.features);
          featuresStr = Array.isArray(parsed) ? parsed.join('\n') : pkg.features;
        }
      } catch (e) {
        featuresStr = pkg.features || '';
      }

      setFormData({
        title: pkg.title,
        price: pkg.price.toString(),
        regularPrice: pkg.regularPrice ? pkg.regularPrice.toString() : '',
        classCount: pkg.classCount !== undefined && pkg.classCount !== null ? pkg.classCount.toString() : '12',
        tagline: pkg.tagline || '',
        validTill: pkg.validTill ? new Date(pkg.validTill).toISOString().split('T')[0] : '',
        features: featuresStr,
        isActive: pkg.isActive
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const featureArray = formData.features.split('\n').filter(f => f.trim() !== '');

    const payload = {
      ...formData,
      classCount: parseInt(formData.classCount || '12', 10),
      validTill: formData.validTill ? formData.validTill : null,
      features: featureArray
    };

    try {
      const url = editingId ? `/api/admin/packages/${editingId}` : '/api/admin/packages';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(`Package ${editingId ? 'updated' : 'created'} successfully`);
        setIsModalOpen(false);
        fetchPackages();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to save package');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    try {
      const res = await fetch(`/api/admin/packages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Package deleted');
        fetchPackages();
      } else {
        toast.error('Failed to delete package');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black font-playfair text-primary mb-2 flex items-center gap-2">
            <ShieldCheck className="text-accent" /> Pricing Packages
          </h1>
          <p className="text-secondary-text">Manage packages, live class quotas, and pricing displayed on the public website</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-accent text-white rounded-2xl font-bold text-sm transition-all shadow-sm cursor-pointer"
        >
          <Plus size={18} /> New Package
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-secondary/20 overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-secondary-text">Loading packages...</div>
        ) : packages.length === 0 ? (
          <div className="p-10 text-center text-secondary-text">No packages found. Create one to get started.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-secondary/5 border-b border-secondary/10">
              <tr>
                <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-primary/70">Title</th>
                <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-primary/70">Price</th>
                <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-primary/70">Live Classes</th>
                <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-primary/70">Tagline / Validity</th>
                <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-primary/70">Status</th>
                <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-primary/70 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {packages.map(pkg => (
                <tr key={pkg.id} className="hover:bg-secondary/5 transition-colors">
                  <td className="p-4 font-bold text-primary text-sm">{pkg.title}</td>
                  <td className="p-4 text-primary text-sm font-semibold">
                    ₹{pkg.price.toLocaleString('en-IN')}{' '}
                    {pkg.regularPrice ? (
                      <span className="text-xs text-secondary-text line-through ml-1">
                        ₹{pkg.regularPrice.toLocaleString('en-IN')}
                      </span>
                    ) : null}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-xs font-bold">
                      {pkg.classCount || 12} Classes
                    </span>
                  </td>
                  <td className="p-4 text-secondary-text text-xs">
                    <p className="text-primary/80 font-medium">{pkg.tagline || '-'}</p>
                    {pkg.validTill && (
                      <p className="text-[10px] text-primary/50 mt-0.5">
                        Valid till: {new Date(pkg.validTill).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </td>
                  <td className="p-4">
                    {pkg.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                        <Check size={12} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                        <X size={12} /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openModal(pkg)} 
                        className="p-2 text-primary/60 hover:text-accent hover:bg-accent/10 rounded-xl transition-colors cursor-pointer"
                        title="Edit Package"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(pkg.id)} 
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Package"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden mt-10 mb-10 border border-secondary/20">
            <div className="p-6 border-b border-secondary/10 flex items-center justify-between bg-secondary/5">
              <div>
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full inline-block mb-1">
                  Package Editor
                </span>
                <h2 className="text-2xl font-black font-playfair text-primary">
                  {editingId ? 'Edit Pricing Package' : 'Create New Pricing Package'}
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-primary/50 hover:text-primary rounded-full hover:bg-secondary/10 transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-widest">Title *</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-2xl border border-secondary/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm" placeholder="e.g. Advanced Clinical Fellowship" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-widest">Tagline</label>
                  <input type="text" value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} className="w-full px-4 py-3 rounded-2xl border border-secondary/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm" placeholder="e.g. Early-bird Special" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-widest">Price (₹) *</label>
                  <input type="number" required min="0" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 rounded-2xl border border-secondary/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm font-semibold" placeholder="49999" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-widest">Regular Price (₹)</label>
                  <input type="number" min="0" step="0.01" value={formData.regularPrice} onChange={e => setFormData({...formData, regularPrice: e.target.value})} className="w-full px-4 py-3 rounded-2xl border border-secondary/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm" placeholder="75000" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-widest">Live Classes Quota *</label>
                  <input 
                    type="number" 
                    required 
                    min="1" 
                    value={formData.classCount} 
                    onChange={e => setFormData({...formData, classCount: e.target.value})} 
                    className="w-full px-4 py-3 rounded-2xl border border-secondary/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm font-semibold" 
                    placeholder="12" 
                  />
                  <p className="text-[10px] text-primary/50">Number of live classes credited upon student purchase.</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-primary uppercase tracking-widest">Valid Till (Optional)</label>
                    {formData.validTill && (
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, validTill: ''})}
                        className="text-[10px] text-accent font-bold hover:underline cursor-pointer"
                      >
                        Clear Date
                      </button>
                    )}
                  </div>
                  <input 
                    type="date" 
                    value={formData.validTill} 
                    onChange={e => setFormData({...formData, validTill: e.target.value})} 
                    className="w-full px-4 py-3 rounded-2xl border border-secondary/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm" 
                  />
                  <p className="text-[10px] text-primary/50">Leave empty for open/perpetual enrollment.</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-widest">Features (One per line)</label>
                  <textarea rows={5} value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full px-4 py-3 rounded-2xl border border-secondary/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all resize-none text-sm" placeholder="12 Live Interactive 1-on-1 Mentorship Sessions&#10;Direct ICSI & Micromanipulation surgical video analysis&#10;Verified certificate of completion" />
                </div>

                <div className="flex items-center gap-3 md:col-span-2 pt-2">
                  <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 rounded text-accent focus:ring-accent border-secondary/30 cursor-pointer" />
                  <label htmlFor="isActive" className="text-sm font-bold text-primary cursor-pointer">Active (Visible on pricing page)</label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-secondary/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-sm text-primary hover:bg-secondary/10 rounded-2xl transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-3 bg-primary hover:bg-accent text-white font-bold text-sm rounded-2xl transition-colors shadow-sm cursor-pointer">
                  {editingId ? 'Save Changes' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
