'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Target, Users, ArrowRight, Building2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function CompanyDashboardPage() {
  const [company, setCompany] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [shortlist, setShortlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', website: '', industry: '', size: '' });

  useEffect(() => {
    api.get('/companies/me')
      .then(({ data }) => {
        setCompany(data);
        return Promise.all([
          api.get('/hiring/roles').catch(() => ({ data: [] })),
          api.get('/hiring/shortlist').catch(() => ({ data: [] })),
        ]);
      })
      .then(([rolesRes, shortRes]) => {
        setRoles(rolesRes.data);
        setShortlist(shortRes.data);
      })
      .catch(() => setCompany(null))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data } = await api.post('/companies', form);
      setCompany(data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating company profile');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!company) return (
    <div className="max-w-2xl space-y-8 fade-in">
      <div>
        <h1 className="font-syne text-3xl font-bold text-foreground">Welcome to the Employer Portal</h1>
        <p className="text-muted-foreground mt-2">Set up your company profile to start posting roles and discovering talent.</p>
      </div>
      <form onSubmit={handleCreate} className="bg-card border border-border rounded-xl p-8 space-y-5">
        <h2 className="font-syne text-xl font-bold">Create Company Profile</h2>
        {[
          { key: 'name', label: 'Company Name', placeholder: 'Acme Corp', required: true },
          { key: 'website', label: 'Website', placeholder: 'https://acme.com' },
          { key: 'industry', label: 'Industry', placeholder: 'Technology, Finance…' },
          { key: 'size', label: 'Company Size', placeholder: '1–10, 11–50, 51–200…' },
        ].map(({ key, label, placeholder, required }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-muted-foreground mb-2">{label}</label>
            <input
              required={required}
              value={(form as any)[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground placeholder-[#8B949E] focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
          <textarea
            required rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="What does your company do?"
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-[#8B949E] focus:border-primary focus:outline-none transition-colors resize-none"
          />
        </div>
        <button type="submit" disabled={creating} className="w-full bg-primary text-black font-medium py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors">
          {creating ? 'Creating…' : 'Create Profile'}
        </button>
      </form>
    </div>
  );

  const openRoles = roles.filter((r) => r.status === 'open').length;

  return (
    <div className="space-y-8 fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-syne text-3xl font-bold text-foreground">{company.name}</h1>
          <p className="text-muted-foreground mt-1">{company.industry} · {company.size}</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
          <Building2 size={14} /> Employer
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <Target className="text-primary" />
            <h3 className="font-medium">Open Roles</h3>
          </div>
          <div className="text-4xl font-syne font-bold text-foreground">{openRoles}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <Users className="text-primary" />
            <h3 className="font-medium">Candidates Shortlisted</h3>
          </div>
          <div className="text-4xl font-syne font-bold text-foreground">{shortlist.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-8 flex flex-col gap-4">
          <h2 className="text-xl font-syne font-bold">Post a Role</h2>
          <p className="text-muted-foreground flex-1">Attract verified candidates by posting an open position.</p>
          <Link href="/company/roles" className="inline-flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors w-fit">
            <Plus size={18} /> Manage Roles
          </Link>
        </div>
        <div className="bg-card border border-border rounded-xl p-8 flex flex-col gap-4">
          <h2 className="text-xl font-syne font-bold">Find Your Next Hire</h2>
          <p className="text-muted-foreground flex-1">Search candidates who have completed verified stages matching your requirements.</p>
          <Link href="/company/talent" className="inline-flex items-center gap-2 bg-[#21262D] text-foreground hover:border-primary border border-border px-6 py-3 rounded-lg font-medium transition-colors w-fit">
            Search Talent <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
