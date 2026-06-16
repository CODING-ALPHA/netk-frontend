'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Eye, EyeOff, Save, Link as LinkIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function PortfolioSettingsPage() {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [slugForm, setSlugForm] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('private');
  
  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = () => {
    api.get('/portfolio/me')
      .then(({data}) => {
        setPortfolio(data);
        setVisibility(data.user.portfolioVisibility ?? 'private');
        setSlugForm(data.user.portfolioSlug || '');
      })
      .finally(() => setLoading(false));
  };

  const updateVisibility = async (vis: 'public' | 'private') => {
    try {
      await api.patch('/portfolio/visibility', { visibility: vis });
      setVisibility(vis);
    } catch {
      alert("Failed to update visibility");
    }
  };

  const updateSlug = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch('/portfolio/slug', { slug: slugForm });
      alert("Slug updated");
      loadPortfolio();
    } catch {
      alert("Error updating slug");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8 fade-in max-w-2xl">
      <div>
        <h1 className="font-syne text-3xl font-bold text-foreground">Portfolio Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your public presence and custom link.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 space-y-8">
        <div>
           <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">Visibility</h3>
                <p className="text-sm text-muted-foreground">Control who can see your portfolio</p>
              </div>
           </div>
           
           <div className="flex bg-background p-1 rounded-lg border border-border w-full mt-4">
              <button 
                 onClick={() => updateVisibility('public')}
                 className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors ${visibility === 'public' ? 'bg-[#21262D] text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                 <Eye size={16} /> Public
              </button>
              <button 
                 onClick={() => updateVisibility('private')}
                 className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors ${visibility === 'private' ? 'bg-[#21262D] text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                 <EyeOff size={16} /> Private
              </button>
           </div>
        </div>

        <div className="pt-6 border-t border-border">
           <div>
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-1"><LinkIcon size={18}/> Custom Shortlink</h3>
              <p className="text-sm text-muted-foreground mb-4">Claim a unique URL for your profile</p>
           </div>
           
           <form onSubmit={updateSlug} className="space-y-4">
              <div>
                 <label className="text-sm font-medium text-muted-foreground mb-2 block">NetK Slug</label>
                 <div className="flex border border-border rounded-lg overflow-hidden focus-within:border-primary transition-colors shadow-sm">
                    <div className="bg-background px-4 py-2.5 text-muted-foreground text-sm border-r border-border flex items-center">
                       netk.app/portfolio/
                    </div>
                    <input 
                       type="text" 
                       value={slugForm}
                       onChange={e => setSlugForm(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                       placeholder="yourname"
                       className="flex-1 bg-card px-4 py-2.5 outline-none text-foreground placeholder-[#8B949E]"
                    />
                 </div>
              </div>
              <button
                 type="submit"
                 className="bg-primary text-black hover:bg-primary/90 px-5 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                  Update URL
              </button>
           </form>
        </div>

        {portfolio?.user?.portfolioSlug && visibility === 'public' && (
           <div className="pt-6 border-t border-border">
              <a href={`/portfolio/${portfolio.user.portfolioSlug}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline bg-primary/10 px-4 py-3 rounded-lg border border-primary/30 w-fit">
                 <ExternalLink size={16} /> View Live Portfolio
              </a>
           </div>
        )}
      </div>
    </div>
  );
}
