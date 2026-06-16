'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Search, MapPin, ExternalLink, BookOpen, Star, Plus } from 'lucide-react';
import Link from 'next/link';

const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const REGIONS = ['West Africa', 'East Africa', 'Europe', 'North America', 'South Asia', 'Southeast Asia', 'Latin America', 'Middle East'];
const PATH_SLUGS = ['product-design', 'frontend-engineering', 'data-analysis', 'product-management', 'content-strategy'];

export default function TalentSearchPage() {
  const [filters, setFilters] = useState({ experienceLevel: '', region: '', minArtifacts: '', minStagesCompleted: '', pathSlug: '' });
  const [talent, setTalent] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [shortlisting, setShortlisting] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    try {
      const params = new URLSearchParams();
      if (filters.experienceLevel) params.set('experienceLevel', filters.experienceLevel);
      if (filters.region) params.set('region', filters.region);
      if (filters.minArtifacts) params.set('minArtifacts', filters.minArtifacts);
      if (filters.minStagesCompleted) params.set('minStagesCompleted', filters.minStagesCompleted);
      if (filters.pathSlug) params.set('pathSlugs', filters.pathSlug);
      const { data } = await api.get(`/hiring/talent/search?${params}`);
      setTalent(data);
      setSearched(true);
    } catch {
      alert('Error searching talent');
    } finally {
      setSearching(false);
    }
  };

  const shortlist = async (userId: string) => {
    setShortlisting(userId);
    try {
      await api.post('/hiring/shortlist', { userId });
      alert('Candidate shortlisted!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to shortlist');
    } finally {
      setShortlisting(null);
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="font-syne text-3xl font-bold text-foreground">Talent Search</h1>
        <p className="text-muted-foreground mt-1">Find candidates based on verified skills and completed paths.</p>
      </div>

      <form onSubmit={handleSearch} className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Experience Level</label>
            <select value={filters.experienceLevel} onChange={(e) => setFilters((f) => ({ ...f, experienceLevel: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground text-sm focus:border-primary focus:outline-none transition-colors appearance-none">
              <option value="">Any</option>
              {EXPERIENCE_LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Region</label>
            <select value={filters.region} onChange={(e) => setFilters((f) => ({ ...f, region: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground text-sm focus:border-primary focus:outline-none transition-colors appearance-none">
              <option value="">Any</option>
              {REGIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Career Path</label>
            <select value={filters.pathSlug} onChange={(e) => setFilters((f) => ({ ...f, pathSlug: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground text-sm focus:border-primary focus:outline-none transition-colors appearance-none">
              <option value="">Any path</option>
              {PATH_SLUGS.map((s) => <option key={s} value={s}>{s.replace(/-/g, ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Min. Portfolio Items</label>
            <input type="number" min="0" value={filters.minArtifacts} onChange={(e) => setFilters((f) => ({ ...f, minArtifacts: e.target.value }))}
              placeholder="0"
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground text-sm placeholder-[#8B949E] focus:border-primary focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Min. Stages Completed</label>
            <input type="number" min="0" value={filters.minStagesCompleted} onChange={(e) => setFilters((f) => ({ ...f, minStagesCompleted: e.target.value }))}
              placeholder="0"
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground text-sm placeholder-[#8B949E] focus:border-primary focus:outline-none transition-colors" />
          </div>
        </div>
        <button type="submit" disabled={searching}
          className="flex items-center gap-2 bg-primary text-black font-medium px-8 py-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors">
          <Search size={16} /> {searching ? 'Searching…' : 'Search Talent'}
        </button>
      </form>

      {searched && (
        talent.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-xl bg-card">
            No candidates match your filters. Try broadening your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {talent.map((candidate) => (
              <div key={candidate.userId} className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <MapPin size={14} /> {candidate.region || 'Location not set'}
                    </div>
                    <p className="text-xs text-muted-foreground">{candidate.experienceLevel || 'Experience not set'}</p>
                  </div>
                  {candidate.portfolioSlug && (
                    <Link href={`/portfolio/${candidate.portfolioSlug}`} target="_blank" className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors">
                      <ExternalLink size={18} />
                    </Link>
                  )}
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <span className="flex items-center gap-1.5 text-foreground font-medium">
                    <Star size={14} className="text-primary" /> {candidate.artifactCount} portfolio items
                  </span>
                  <span className="flex items-center gap-1.5 text-foreground font-medium">
                    <BookOpen size={14} className="text-primary" /> {candidate.completedStages} stages done
                  </span>
                </div>

                {candidate.careerInterests?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.careerInterests.slice(0, 4).map((i: string) => (
                      <span key={i} className="text-[10px] bg-[#21262D] text-muted-foreground px-2 py-0.5 rounded font-medium uppercase tracking-wider">{i}</span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => shortlist(candidate.userId)}
                  disabled={shortlisting === candidate.userId}
                  className="flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 mt-auto"
                >
                  <Plus size={16} /> {shortlisting === candidate.userId ? 'Shortlisting…' : 'Add to Shortlist'}
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {!searched && (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-xl bg-card">
          Set your filters above and click Search to find candidates.
        </div>
      )}
    </div>
  );
}
