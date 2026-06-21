'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Save, Building2, Globe, Briefcase, Users } from 'lucide-react';

const SIZES = ['1–10', '11–50', '51–200', '201–500', '500+'];
const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Design', 'Legal', 'Other'];

export default function CompanySettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    website: '',
    industry: '',
    size: '',
  });

  useEffect(() => {
    api.get('/companies/me')
      .then(({ data }) => {
        setForm({
          name: data.name || '',
          description: data.description || '',
          website: data.website || '',
          industry: data.industry || '',
          size: data.size || '',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await api.patch('/companies/me', form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 fade-in max-w-2xl">
      <div>
        <h1 className="font-syne text-3xl font-bold text-foreground">Company Settings</h1>
        <p className="text-muted-foreground mt-1">Update your company profile information.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 space-y-6">
        {error && (
          <div className="bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] text-sm rounded-lg px-4 py-3">{error}</div>
        )}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg px-4 py-3">Settings saved successfully.</div>
        )}

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <Building2 size={16} /> Company Name
          </label>
          <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Acme Corp"
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground placeholder-[#8B949E] focus:border-primary focus:outline-none transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <Globe size={16} /> Website
          </label>
          <input value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
            placeholder="https://yourcompany.com"
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground placeholder-[#8B949E] focus:border-primary focus:outline-none transition-colors" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Briefcase size={16} /> Industry
            </label>
            <select value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:border-primary focus:outline-none transition-colors appearance-none">
              <option value="">Select industry</option>
              {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Users size={16} /> Company Size
            </label>
            <select value={form.size} onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:border-primary focus:outline-none transition-colors appearance-none">
              <option value="">Select size</option>
              {SIZES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
          <textarea required rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="What does your company do? What are you building?"
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-[#8B949E] focus:border-primary focus:outline-none transition-colors resize-none" />
        </div>

        <div className="pt-2 flex justify-end">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-primary text-black font-medium px-8 py-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors">
            <Save size={18} /> {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
