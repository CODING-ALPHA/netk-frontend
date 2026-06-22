'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Compass, Sparkles, CheckCircle2, Heart, Briefcase, Zap, Globe } from 'lucide-react';

export default function AssessmentResultsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/me')
      .then(({ data }) => {
        if (!data.ikigaiProfile) {
          router.push('/assessment');
        } else {
          setProfile(data.ikigaiProfile);
        }
      })
      .catch(() => router.push('/sign-in'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { scores, recommendations } = profile;

  // Assuming scores looks like { love: 80, strengths: 70, worldNeeds: 90, paidSkills: 60 }
  // or a float 0.0 - 1.0. Let's safely format them to percentages.
  const formatScore = (val: any) => {
    const num = Number(val);
    if (isNaN(num)) return 0;
    return num <= 1 ? Math.round(num * 100) : Math.round(num);
  };

  const getPathColor = (index: number) => {
    const colors = ['border-blue-500/30 text-blue-400 bg-blue-500/10', 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10', 'border-purple-500/30 text-purple-400 bg-purple-500/10'];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-12 px-6 fade-in">
      <div className="max-w-3xl w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
            <Sparkles size={32} />
          </div>
          <h1 className="font-syne text-4xl font-bold tracking-tight">Your Ikigai Profile</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Based on your answers, we've mapped out your dimensions and found the career paths that align with your true purpose.
          </p>
        </div>

        {/* Scores Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-2xl p-6 text-center">
            <Heart size={24} className="text-[#F85149] mx-auto mb-3" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">What you love</h3>
            <p className="text-3xl font-bold font-syne">{formatScore(scores?.love || 0)}%</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 text-center">
            <Zap size={24} className="text-yellow-500 mx-auto mb-3" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">What you're good at</h3>
            <p className="text-3xl font-bold font-syne">{formatScore(scores?.strengths || 0)}%</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 text-center">
            <Globe size={24} className="text-blue-500 mx-auto mb-3" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">What the world needs</h3>
            <p className="text-3xl font-bold font-syne">{formatScore(scores?.worldNeeds || 0)}%</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 text-center">
            <Briefcase size={24} className="text-emerald-500 mx-auto mb-3" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">What you can be paid for</h3>
            <p className="text-3xl font-bold font-syne">{formatScore(scores?.paidSkills || 0)}%</p>
          </div>
        </div>

        {/* Recommended Paths */}
        <div>
          <h2 className="font-syne text-2xl font-bold mb-6 flex items-center gap-2">
            <Compass className="text-primary" /> Recommended Career Paths
          </h2>
          <div className="space-y-4">
            {recommendations?.map((pathSlug: string, i: number) => {
              const formattedName = pathSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
              return (
                <div key={pathSlug} className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getPathColor(i)}`}>
                        Match #{i + 1}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{formattedName}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                      This path perfectly aligns with your combination of skills and passions. You'll build real-world projects to prove your expertise.
                    </p>
                  </div>
                  <Link
                    href={`/paths/${pathSlug}`}
                    className="shrink-0 flex items-center justify-center gap-2 bg-[#21262D] text-foreground border border-border px-6 py-3 rounded-xl font-semibold hover:bg-[#30363D] transition-colors"
                  >
                    View Roadmap
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-primary text-black px-8 py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-100 transition-all text-lg shadow-xl shadow-primary/20"
          >
            Go to Dashboard <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ArrowRightIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
