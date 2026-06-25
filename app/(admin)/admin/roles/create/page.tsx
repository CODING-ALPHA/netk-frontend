'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, Save, Building2 } from 'lucide-react';

export default function CreateRolePage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    companyId: '',
    title: '',
    description: '',
    experienceLevel: '',
    region: '',
    tags: '',
  });

  useEffect(() => {
    api.get('/companies/admin/all')
      .then(({ data }) => {
        setCompanies(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, companyId: data[0].id }));
        }
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load companies. Make sure companies exist.');
      })
      .finally(() => setLoadingCompanies(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyId || !formData.title || !formData.description) {
      setError('Company, Title, and Description are required.');
      return;
    }
    
    setSaving(true);
    setError('');

    const payload = {
      companyId: formData.companyId,
      title: formData.title,
      description: formData.description,
      experienceLevel: formData.experienceLevel || undefined,
      region: formData.region || undefined,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      pathSlugs: [], // Optional: can be added to UI if needed
    };

    try {
      await api.post('/hiring/admin/roles', payload);
      router.push('/admin/roles');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create role.');
      setSaving(false);
    }
  };

  if (loadingCompanies) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8 fade-in pb-12">
      <Link
        href="/admin/roles"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft size={16} /> Back to Roles
      </Link>

      <div>
        <h1 className="font-syne text-3xl font-bold text-foreground">Upload Role</h1>
        <p className="text-muted-foreground mt-1">Create a new job opening on behalf of a company.</p>
      </div>

      {error && (
        <div className="bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Company</label>
          {companies.length === 0 ? (
            <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 p-3 rounded-lg text-sm border border-yellow-500/20">
              <Building2 size={16} /> No companies found. Please create a company first.
            </div>
          ) : (
            <select
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary appearance-none cursor-pointer"
            >
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Job Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Senior Frontend Engineer"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Experience Level</label>
            <input
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              placeholder="e.g. Mid-Level, Senior"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Region / Location</label>
            <input
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="e.g. Remote, US, EMEA"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Tags (Comma Separated)</label>
          <input
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. React, Next.js, Typescript"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Job Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description of the role, responsibilities, and requirements..."
            rows={8}
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary resize-y"
          />
        </div>

        <div className="pt-4 border-t border-border">
          <button
            type="submit"
            disabled={saving || companies.length === 0}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-black font-semibold px-8 py-3.5 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            <Save size={18} /> {saving ? 'Uploading...' : 'Upload Role'}
          </button>
        </div>
      </form>
    </div>
  );
}
