'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Package, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

const STATUS_STYLES: Record<string, string> = {
  submitted: 'bg-secondary text-muted-foreground border-border',
  under_review: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  accepted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  accepted: <CheckCircle2 size={14} />,
  rejected: <XCircle size={14} />,
  under_review: <Loader2 size={14} className="animate-spin" />,
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [taskMap, setTaskMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/submissions/me').then(async ({ data }) => {
      setSubmissions(data);

      const uniqueTaskIds: string[] = data
        .map((s: any) => s.taskId)
        .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index);
      const tasks = await Promise.all(
        uniqueTaskIds.map((id) =>
          api.get(`/tasks/${id}`).then((r) => ({ id, title: r.data.title })).catch(() => ({ id, title: id }))
        )
      );
      setTaskMap(Object.fromEntries(tasks.map((t) => [t.id, t.title])));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="font-syne text-3xl font-bold text-foreground">My Submissions</h1>
        <p className="text-muted-foreground mt-2">Track the status of your task responses.</p>
      </div>

      <div className="flex flex-col gap-4">
        {submissions.length === 0 ? (
          <div className="text-center p-12 bg-card border border-border rounded-xl text-muted-foreground">
            <Package size={32} className="mx-auto mb-4 opacity-50" />
            <p>You haven't submitted any tasks yet.</p>
            <Link href="/paths" className="text-primary hover:underline mt-2 inline-block">
              Browse paths to start
            </Link>
          </div>
        ) : (
          submissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-card border border-border p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/50 transition-colors"
            >
              <div>
                <h3 className="font-semibold text-lg mb-1">{taskMap[sub.taskId] || 'Task'}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock size={14} />
                  Submitted {new Date(sub.submittedAt).toLocaleDateString()}
                </p>
                {sub.reviewerNotes && (
                  <p className="text-sm text-muted-foreground mt-2 italic">"{sub.reviewerNotes}"</p>
                )}
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium capitalize border ${STATUS_STYLES[sub.status] ?? STATUS_STYLES.submitted}`}>
                {STATUS_ICONS[sub.status]}
                {sub.status.replace('_', ' ')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
