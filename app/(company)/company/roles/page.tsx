'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, X, Globe, CheckCircle2, XCircle } from 'lucide-react';

const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const REGIONS = ['West Africa', 'East Africa', 'Europe', 'North America', 'South Asia', 'Southeast Asia', 'Latin America', 'Middle East'];
const PATH_SLUGS = ['product-design', 'frontend-engineering', 'data-analysis', 'product-management', 'content-strategy'];

const STATUS_STYLE: Record<string, string> = {
  draft: 'bg-secondary text-muted-foreground border border-border',
  open: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  closed: 'bg-red-500/10 text-red-400 border-red-500/30',
};

export default function CompanyRolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    pathSlugs: [] as string[],
    experienceLevel: '',
    region: '',
  });

  useEffect(() => {
    api.get('/hiring/roles')
      .then(({ data }) => setRoles(data))
      .finally(() => setLoading(false));
  }, []);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagInput('');
  };

  const togglePath = (slug: string) => {
    setForm((f) => ({
      ...f,
      pathSlugs: f.pathSlugs.includes(slug) ? f.pathSlugs.filter((s) => s !== slug) : [...f.pathSlugs, slug],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const { data } = await api.post('/hiring/roles', form);
      setRoles((prev) => [data, ...prev]);
      setShowForm(false);
      setForm({ title: '', description: '', tags: [], pathSlugs: [], experienceLevel: '', region: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create role.');
    } finally {
      setSaving(false);
    }
  };

  const publish = async (id: string) => {
    try {
      const { data } = await api.patch(`/hiring/roles/${id}/publish`);
      setRoles((prev) => prev.map((r) => (r.id === id ? data : r)));
    } catch {
      alert('Failed to publish role');
    }
  };

  const close = async (id: string) => {
    try {
      const { data } = await api.patch(`/hiring/roles/${id}/close`);
      setRoles((prev) => prev.map((r) => (r.id === id ? data : r)));
    } catch {
      alert('Failed to close role');
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne text-3xl font-bold text-foreground">My Roles</h1>
          <p className="text-muted-foreground mt-1">Create and manage your job openings.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 bg-primary text-black font-medium px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} /> New Role
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 space-y-6">
          <h2 className="font-syne text-xl font-bold">Create Role Opening</h2>
          {error && (
            <div className="bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] text-sm rounded-lg px-4 py-3">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Job Title</label>
            <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Junior Frontend Engineer"
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
            <textarea required rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Describe the role, responsibilities, and what you're looking for…"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Experience Level</label>
              <select value={form.experienceLevel} onChange={(e) => setForm((f) => ({ ...f, experienceLevel: e.target.value }))}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:border-primary focus:outline-none transition-colors appearance-none">
                <option value="">Any level</option>
                {EXPERIENCE_LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Region</label>
              <select value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:border-primary focus:outline-none transition-colors appearance-none">
                <option value="">Any region</option>
                {REGIONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="e.g. React, TypeScript"
                className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors" />
              <button type="button" onClick={addTag} className="bg-secondary px-4 py-2.5 rounded-lg border border-border hover:bg-secondary/80 transition-colors"><Plus size={16}/></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 bg-secondary text-foreground text-xs rounded-md px-2.5 py-1 border border-border">
                  {tag}
                  <button type="button" onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))} className="text-muted-foreground hover:text-[#F85149]"><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-3">Relevant Career Paths</label>
            <div className="flex flex-wrap gap-2">
              {PATH_SLUGS.map((slug) => {
                const selected = form.pathSlugs.includes(slug);
                return (
                  <button type="button" key={slug} onClick={() => togglePath(slug)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${selected ? 'bg-primary/10 text-primary border-primary/30' : 'bg-secondary text-muted-foreground border-border hover:border-muted-foreground'}`}>
                    {slug.replace(/-/g, ' ')}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="bg-primary text-black font-medium px-8 py-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {saving ? 'Creating…' : 'Create Role'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-8 py-2.5 border border-border text-muted-foreground rounded-lg hover:border-[#8B949E] transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : roles.length === 0 ? (
        <div className="text-center py-20 bg-card border border-dashed border-border rounded-xl text-muted-foreground">
          No roles yet. Create your first role opening.
        </div>
      ) : (
        <div className="space-y-4">
          {roles.map((role) => (
            <div key={role.id} className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg text-foreground">{role.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${STATUS_STYLE[role.status] ?? STATUS_STYLE.draft}`}>
                    {role.status}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{role.description}</p>
                <div className="flex flex-wrap gap-2">
                  {role.region && <span className="text-xs bg-secondary text-muted-foreground border border-border px-2.5 py-1 rounded-md flex items-center gap-1"><Globe size={10} />{role.region}</span>}
                  {role.experienceLevel && <span className="text-xs bg-secondary text-muted-foreground border border-border px-2.5 py-1 rounded-md">{role.experienceLevel}</span>}
                  {role.tags?.slice(0, 3).map((t: string) => <span key={t} className="text-xs bg-secondary text-muted-foreground border border-border px-2.5 py-1 rounded-md">{t}</span>)}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {role.status === 'draft' && (
                  <button onClick={() => publish(role.id)} className="flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 transition-colors">
                    <CheckCircle2 size={14} /> Publish
                  </button>
                )}
                {role.status === 'open' && (
                  <button onClick={() => close(role.id)} className="flex items-center gap-1.5 text-xs bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors">
                    <XCircle size={14} /> Close
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
