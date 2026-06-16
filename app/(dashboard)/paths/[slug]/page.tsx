'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, Briefcase, CheckCircle2, ChevronRight } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function PathDetailsPage() {
  const { slug } = useParams();
  const [path, setPath] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      api.get(`/paths/${slug}`),
      api.get('/paths/me/active').catch(() => ({ data: null })),
    ]).then(([pathRes, activeRes]) => {
      setPath(pathRes.data);
      if (activeRes.data?.progress?.pathSlug === slug) {
        setIsActive(true);
        setCompletedStages(activeRes.data.progress.completedStages ?? []);
      }
    }).finally(() => setLoading(false));
  }, [slug]);

  const selectPath = async () => {
    setSelecting(true);
    try {
      await api.post('/paths/select', { pathSlug: slug });
      setIsActive(true);
      setCompletedStages([]);
    } catch {
      window.location.href = '/sign-in';
    } finally {
      setSelecting(false);
    }
  };

  if (loading) return <div className="text-center py-32 text-muted-foreground">Loading Path…</div>;
  if (!path) return <div className="text-center py-32 text-[#F85149]">Path not found.</div>;

  return (
    <div className="max-w-3xl space-y-12 fade-in">
      <Link
        href="/paths"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft size={16} /> Back to Paths
      </Link>

      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
          <Briefcase size={16} />
          Career Path
        </div>
        <h1 className="font-syne text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
          {path.path.name}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {path.path.description}
        </p>

        {isActive ? (
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/30 font-semibold px-8 py-3.5 rounded-xl">
              <CheckCircle2 size={18} />
              Active Path
            </div>
            <span className="text-sm text-muted-foreground">
              {completedStages.length} / {path.stages?.length ?? 0} stages completed
            </span>
          </div>
        ) : (
          <button
            onClick={selectPath}
            disabled={selecting}
            className="bg-primary text-black font-semibold px-8 py-3.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {selecting ? 'Enrolling…' : 'Start This Path'}
          </button>
        )}
      </div>

      <div className="pt-10 border-t border-border">
        <h2 className="font-syne text-2xl font-bold mb-8">Path Roadmap</h2>
        <div className="space-y-4">
          {path.stages?.map((stage: any) => {
            const done = completedStages.includes(stage.stageNumber);
            return (
              <Link
                key={stage.stageNumber}
                href={`/paths/${slug}/stage/${stage.stageNumber}`}
                className={`flex items-center gap-5 p-6 rounded-2xl border transition-all group ${
                  done
                    ? 'bg-primary/5 border-primary/30'
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-syne font-bold text-sm transition-all ${
                  done
                    ? 'bg-primary text-black'
                    : 'bg-background border-2 border-border group-hover:border-primary group-hover:text-primary text-foreground'
                }`}>
                  {done ? <CheckCircle2 size={20} /> : stage.stageNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-lg mb-1 ${done ? 'text-primary' : 'text-foreground group-hover:text-primary'} transition-colors`}>
                    {stage.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed truncate">
                    {stage.outcomes?.[0] || 'Learn key skills for this stage.'}
                  </p>
                </div>
                <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
