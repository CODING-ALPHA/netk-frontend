'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Settings, Globe, Lock, Save, ArrowLeft, ExternalLink } from 'lucide-react';

export default function PortfolioSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [visibility, setVisibility] = useState<'public' | 'private'>('private');
  const [slug, setSlug] = useState('');

  useEffect(() => {
    api.get('/users/me')
      .then(({ data }) => {
        setVisibility(data.portfolioVisibility || 'private');
        setSlug(data.portfolioSlug || '');
      })
      .catch(() => router.push('/sign-in'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.patch('/users/me', {
        portfolioVisibility: visibility,
        portfolioSlug: slug.trim() || undefined,
      });
      setSuccess('Portfolio settings saved successfully.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save settings. That slug might be taken.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-10 fade-in">
      <Link
        href="/dashboard/portfolio"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft size={16} /> Back to Portfolio
      </Link>

      <div className="space-y-2">
        <h1 className="font-syne text-3xl font-bold text-foreground flex items-center gap-3">
          <Settings className="text-primary" /> Portfolio Settings
        </h1>
        <p className="text-muted-foreground">Manage your public profile visibility and custom URL.</p>
      </div>

      {error && (
        <div className="bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm rounded-lg px-4 py-3">
          {success}
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-8 space-y-8">
        
        {/* Visibility Toggle */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">Profile Visibility</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setVisibility('public')}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all ${
                visibility === 'public'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-[#8B949E]'
              }`}
            >
              <Globe size={32} />
              <div className="text-center">
                <p className="font-bold">Public</p>
                <p className="text-xs mt-1">Companies can find you</p>
              </div>
            </button>
            <button
              onClick={() => setVisibility('private')}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all ${
                visibility === 'private'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-[#8B949E]'
              }`}
            >
              <Lock size={32} />
              <div className="text-center">
                <p className="font-bold">Private</p>
                <p className="text-xs mt-1">Only you can see this</p>
              </div>
            </button>
          </div>
        </div>

        {/* Custom URL Slug */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4">Custom URL</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Claim a unique URL to share your portfolio with recruiters. Use letters, numbers, and hyphens only.
          </p>
          <div className="flex items-center">
            <span className="bg-secondary text-muted-foreground px-4 py-3 rounded-l-lg border border-r-0 border-border font-mono text-sm h-12 flex items-center">
              net-k.com/portfolio/
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="your-name"
              className="flex-1 bg-background border border-border rounded-r-lg px-4 py-3 text-foreground font-mono text-sm placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors h-12"
            />
          </div>
          {slug && visibility === 'public' && (
            <div className="mt-4 flex items-center gap-2">
              <a href={`/portfolio/${slug}`} target="_blank" rel="noopener noreferrer" className="text-primary text-sm flex items-center gap-1.5 hover:underline">
                <ExternalLink size={14} /> View public profile
              </a>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-border">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-primary text-black font-semibold px-8 py-3.5 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
