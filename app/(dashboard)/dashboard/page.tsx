'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Target, CheckCircle2, Navigation2, FileText } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [activePath, setActivePath] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, pathRes, assessmentRes] = await Promise.all([
          api.get('/portfolio/me/stats'),
          api.get('/paths/me/active').catch(() => ({ data: null })),
          api.get('/assessment/latest').catch(() => ({ data: null }))
        ]);
        setStats(statsRes.data);
        setActivePath(pathRes.data);
        setAssessment(assessmentRes.data);
      } catch (err) {
        console.error("Dashboard data load failed");
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="font-syne text-3xl font-bold text-foreground">Welcome back.</h1>
        <p className="text-muted-foreground mt-2">Here is your progress towards your career objectives.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <Target className="text-primary" />
            <h3 className="font-medium">Active Path</h3>
          </div>
          <div className="text-2xl font-syne font-bold">
            {activePath?.path?.name || 'None Selected'}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <CheckCircle2 className="text-primary" />
            <h3 className="font-medium">Tasks Completed</h3>
          </div>
          <div className="text-4xl font-syne font-bold text-foreground">
            {stats?.totalArtifacts || 0}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <FileText className="text-primary" />
            <h3 className="font-medium">Submissions</h3>
          </div>
          <div className="text-4xl font-syne font-bold text-foreground">
            {stats?.submissionsCount || 0}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-start gap-4">
          <h2 className="text-xl font-syne font-bold">Find a Path</h2>
          <p className="text-muted-foreground">Discover career paths tailored to your Ikigai profile. Advance your skills logically step by step.</p>
          <Link href="/paths" className="inline-flex items-center gap-2 mt-auto bg-primary/10 text-primary hover:bg-primary/20 px-6 py-3 rounded-lg font-medium transition-colors border border-primary/30">
            Explore Paths <Navigation2 size={16} />
          </Link>
        </div>
        <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-start gap-4">
           <h2 className="text-xl font-syne font-bold">Your Portfolio</h2>
           <p className="text-muted-foreground">Turn your submissions into a professional showcase. Make your profile public for recruiters.</p>
           <Link href="/dashboard/portfolio" className="inline-flex items-center gap-2 mt-auto bg-transparent text-foreground border border-border hover:border-primary hover:text-primary px-6 py-3 rounded-lg font-medium transition-colors">
              Manage Portfolio
           </Link>
        </div>
      </div>

      {assessment?.recommendations && (
        <div className="pt-8 border-t border-border">
          <h2 className="text-2xl font-syne font-bold mb-2">AI Career Recommendations</h2>
          <p className="text-muted-foreground mb-6">Based on your Ikigai assessment, here are your top paths.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {assessment.recommendations.map((rec: any, i: number) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 flex flex-col group hover:border-primary/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {rec.confidence}% Match
                  </div>
                </div>
                <h3 className="font-syne font-bold text-lg mb-3 group-hover:text-primary transition-colors">
                  {rec.pathName}
                </h3>
                <p className="text-sm text-muted-foreground flex-1 mb-6 leading-relaxed">
                  {rec.reasoning}
                </p>
                <Link href={`/paths/${rec.pathId}`} className="text-primary text-sm font-semibold flex items-center gap-2 hover:underline mt-auto">
                  View Roadmap <Navigation2 size={14} className="rotate-90" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
