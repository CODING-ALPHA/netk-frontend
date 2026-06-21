'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import { FolderOpen, MapPin, Link as LinkIcon, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function PublicPortfolioPage() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      api.get(`/portfolio/${slug}`)
        .then(({data}) => setPortfolio(data))
        .catch(() => setPortfolio(null))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-background text-center pt-32 text-muted-foreground">Loading Portfolio...</div>;
  if (!portfolio) return <div className="min-h-screen bg-background flex justify-center pt-32 text-red-400">Portfolio not found or set to private.</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="h-16 border-b border-border flex items-center px-8 bg-card/50">
         <Link href="/" className="font-syne text-primary font-bold">NetK</Link>
         <span className="ml-4 pl-4 border-l border-border text-muted-foreground text-sm hidden sm:inline-block">Public Portfolio</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-12">
         <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-24 h-24 rounded-full bg-card border-2 border-primary flex items-center justify-center font-syne font-bold text-3xl text-primary shrink-0">
               {portfolio.user.firstName?.[0] || ''}{portfolio.user.lastName?.[0] || ''}
            </div>
            <div>
               <h1 className="font-syne text-4xl md:text-5xl font-bold mb-3">
                  {portfolio.user.firstName} {portfolio.user.lastName}
               </h1>
               <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                  {portfolio.user.region && (
                    <span className="flex items-center gap-1.5"><MapPin size={16}/> {portfolio.user.region}</span>
                  )}
                  {portfolio.activePath?.title && (
                    <span className="flex items-center gap-1.5 text-primary"><Briefcase size={16}/> {portfolio.activePath.title} Path</span>
                  )}
               </div>
               <p className="mt-6 text-lg leading-relaxed max-w-2xl">
                  {portfolio.user.bio || 'An aspiring professional building their career through verified skills and real-world task submissions on NetK.'}
               </p>
            </div>
         </div>

         <div className="pt-12 border-t border-border">
            <h2 className="font-syne text-2xl font-bold mb-8 flex items-center gap-3">
               <FolderOpen className="text-primary" /> Verified Submissions
            </h2>
            
            <div className="space-y-6">
               {portfolio.artifacts.length === 0 ? (
                  <div className="text-center py-12 bg-card/50 rounded-xl border border-border/50 text-muted-foreground">
                     No approved submissions yet.
                  </div>
               ) : (
                  portfolio.artifacts.map((art: any) => (
                     <div key={art.id} className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-colors">
                        <h3 className="text-xl font-bold text-foreground mb-4">Task: {art.title}</h3>
                        {art.textResponse && (
                          <p className="text-muted-foreground leading-relaxed break-words whitespace-pre-wrap">
                             {art.textResponse}
                          </p>
                        )}
                        {art.evidenceLinks?.[0] && (
                           <a href={art.evidenceLinks[0]} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-6 text-primary hover:underline">
                              <LinkIcon size={16} /> View External Repository
                           </a>
                        )}
                        <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                           <span className="w-2 h-2 rounded-full bg-primary"></span> Verified by NetK Mentors
                        </div>
                     </div>
                  ))
               )}
            </div>
         </div>
      </main>
    </div>
  );
}
