'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react';

export default function AdminDashboardPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState<Record<string, { notes: string, saving: boolean, error: string }>>({});

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await api.get('/submissions/admin/pending');
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, status: 'accepted' | 'rejected') => {
    const notes = reviewForm[id]?.notes || '';
    
    setReviewForm((prev) => ({ ...prev, [id]: { ...prev[id], saving: true, error: '' } }));
    
    try {
      await api.patch(`/submissions/${id}/status`, {
        status,
        reviewerNotes: notes
      });
      // Remove from pending list
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      setReviewForm((prev) => ({ 
        ...prev, 
        [id]: { ...prev[id], saving: false, error: err.response?.data?.message || 'Failed to update' } 
      }));
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
    <div className="max-w-4xl space-y-10 fade-in">
      <div className="space-y-2">
        <h1 className="font-syne text-3xl font-bold text-foreground">Review Submissions</h1>
        <p className="text-muted-foreground">Approve or reject user task submissions to help them build their portfolios.</p>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl text-muted-foreground">
          <CheckCircle2 size={32} className="mx-auto mb-4 opacity-40 text-emerald-500" />
          <p>All caught up! No pending submissions.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {submissions.map((sub) => (
            <div key={sub.id} className="bg-card border border-border rounded-2xl overflow-hidden p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    {sub.task?.title}
                    <span className="text-xs font-normal px-2 py-1 bg-primary/10 text-primary rounded-md uppercase tracking-wider">
                      Stage {sub.task?.stageNumber}
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Submitted by {sub.user?.firstName || 'User'} ({sub.user?.email})</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background px-3 py-1.5 rounded-full border border-border">
                  <Clock size={14} />
                  {new Date(sub.submittedAt).toLocaleDateString()}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {sub.textResponse && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Student Response</h4>
                    <p className="text-sm text-foreground bg-background p-4 rounded-lg border border-border whitespace-pre-wrap">
                      {sub.textResponse}
                    </p>
                  </div>
                )}
                
                {sub.evidenceLinks?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Evidence Links</h4>
                    <ul className="space-y-2">
                      {sub.evidenceLinks.map((link: string, i: number) => (
                        <li key={i}>
                          <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline bg-primary/5 px-3 py-2 rounded-lg border border-primary/20 w-full sm:w-auto">
                            <ExternalLink size={14} />
                            <span className="truncate max-w-[200px] sm:max-w-md">{link}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4 mt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Reviewer Decision</h4>
                
                {reviewForm[sub.id]?.error && (
                  <div className="bg-[#F85149]/10 text-[#F85149] text-sm px-4 py-2 rounded-lg mb-3">
                    {reviewForm[sub.id].error}
                  </div>
                )}

                <textarea
                  value={reviewForm[sub.id]?.notes || ''}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, [sub.id]: { ...prev[sub.id], notes: e.target.value } }))}
                  placeholder="Provide constructive feedback (required for rejection, optional for approval)..."
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary resize-y mb-4"
                  rows={3}
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReview(sub.id, 'accepted')}
                    disabled={reviewForm[sub.id]?.saving}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20 font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} /> Approve
                  </button>
                  <button
                    onClick={() => handleReview(sub.id, 'rejected')}
                    disabled={reviewForm[sub.id]?.saving || !reviewForm[sub.id]?.notes?.trim()}
                    title={!reviewForm[sub.id]?.notes?.trim() ? 'Feedback required to reject' : ''}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20 font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <XCircle size={16} /> Request Changes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
