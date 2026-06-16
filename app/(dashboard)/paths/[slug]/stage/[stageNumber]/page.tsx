'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, Plus, X, Send, Star } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  acceptanceCriteria: string[];
  difficulty: number;
  status: string;
}

interface SubmitForm {
  textResponse: string;
  evidenceLinks: string[];
}

export default function StagePage() {
  const { slug, stageNumber } = useParams();
  const stageNum = Number(stageNumber);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [form, setForm] = useState<SubmitForm>({ textResponse: '', evidenceLinks: [] });
  const [linkInput, setLinkInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [stageCompleted, setStageCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (!slug || !stageNum) return;
    Promise.all([
      api.get(`/tasks/stage/${slug}/${stageNum}`),
      api.get('/submissions/me').catch(() => ({ data: [] })),
      api.get('/paths/me/active').catch(() => ({ data: null })),
    ]).then(([tasksRes, subsRes, activeRes]) => {
      setTasks(tasksRes.data);
      const subMap: Record<string, any> = {};
      for (const s of subsRes.data) subMap[s.taskId] = s;
      setSubmissions(subMap);
      if (activeRes.data?.progress?.pathSlug === slug) {
        setStageCompleted(activeRes.data.progress.completedStages?.includes(stageNum));
      }
    }).finally(() => setLoading(false));
  }, [slug, stageNum]);

  const openSubmit = (taskId: string) => {
    setActiveTaskId(taskId);
    setForm({ textResponse: '', evidenceLinks: [] });
    setLinkInput('');
    setError('');
  };

  const addLink = () => {
    const trimmed = linkInput.trim();
    if (trimmed && !form.evidenceLinks.includes(trimmed)) {
      setForm((f) => ({ ...f, evidenceLinks: [...f.evidenceLinks, trimmed] }));
    }
    setLinkInput('');
  };

  const handleSubmit = async () => {
    if (!form.textResponse.trim() && form.evidenceLinks.length === 0) {
      setError('Please provide a text response or at least one evidence link.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/submissions', {
        taskId: activeTaskId,
        textResponse: form.textResponse || undefined,
        evidenceLinks: form.evidenceLinks,
      });
      setSubmissions((prev) => ({ ...prev, [activeTaskId!]: res.data }));
      setActiveTaskId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteStage = async () => {
    setCompleting(true);
    try {
      await api.patch(`/paths/${slug}/stage/${stageNum}/complete`);
      setStageCompleted(true);
    } catch {
      // already completed or not active
    } finally {
      setCompleting(false);
    }
  };

  const allTasksSubmitted = tasks.length > 0 && tasks.every((t) => submissions[t.id]);

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl space-y-10 fade-in">
      <Link
        href={`/paths/${slug}`}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft size={16} /> Back to Path
      </Link>

      <div className="space-y-2">
        <p className="text-primary text-[11px] uppercase tracking-wider font-medium">Stage {stageNum}</p>
        <h1 className="font-syne text-3xl font-bold text-foreground">Tasks</h1>
        <p className="text-muted-foreground">Complete the tasks below to finish this stage.</p>
      </div>

      {stageCompleted && (
        <div className="flex items-center gap-3 bg-primary/10 border border-primary/30 text-primary px-5 py-4 rounded-xl font-medium">
          <CheckCircle2 size={20} />
          Stage {stageNum} completed!
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl text-muted-foreground">
          <AlertCircle size={32} className="mx-auto mb-4 opacity-40" />
          <p>No tasks available for this stage yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {tasks.map((task) => {
            const sub = submissions[task.id];
            const STATUS_STYLE: Record<string, string> = {
              submitted: 'bg-[#21262D] text-muted-foreground border-transparent',
              under_review: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
              accepted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
              rejected: 'bg-red-500/10 text-red-400 border-red-500/30',
            };

            return (
              <div key={task.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-foreground">{task.title}</h3>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={12} className={i < task.difficulty ? 'text-primary fill-primary' : 'text-muted-foreground'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{task.description}</p>
                    </div>
                    {sub && (
                      <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium capitalize border ${STATUS_STYLE[sub.status] ?? STATUS_STYLE.submitted}`}>
                        {sub.status.replace('_', ' ')}
                      </span>
                    )}
                  </div>

                  {task.deliverables.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Deliverables</p>
                      <ul className="space-y-1">
                        {task.deliverables.map((d, i) => (
                          <li key={i} className="text-sm text-foreground flex items-start gap-2">
                            <span className="text-primary mt-0.5 shrink-0">•</span> {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {task.acceptanceCriteria.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Acceptance Criteria</p>
                      <ul className="space-y-1">
                        {task.acceptanceCriteria.map((c, i) => (
                          <li key={i} className="text-sm text-foreground flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" /> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!sub || sub.status === 'rejected' ? (
                    activeTaskId === task.id ? (
                      <div className="mt-4 pt-4 border-t border-border space-y-4">
                        {error && (
                          <div className="bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] text-sm rounded-lg px-4 py-3">
                            {error}
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-2">Your Response</label>
                          <textarea
                            rows={4}
                            value={form.textResponse}
                            onChange={(e) => setForm((f) => ({ ...f, textResponse: e.target.value }))}
                            placeholder="Describe what you built, what you learned, and how you met the criteria…"
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground text-sm placeholder-[#8B949E] focus:outline-none focus:border-primary transition-colors resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-2">Evidence Links</label>
                          <div className="flex gap-2 mb-2">
                            <input
                              type="url"
                              value={linkInput}
                              onChange={(e) => setLinkInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
                              placeholder="https://github.com/your/project"
                              className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5 text-foreground text-sm placeholder-[#8B949E] focus:outline-none focus:border-primary transition-colors"
                            />
                            <button type="button" onClick={addLink} className="bg-[#21262D] hover:bg-[#30363D] text-foreground px-4 py-2.5 rounded-lg transition-colors">
                              <Plus size={16} />
                            </button>
                          </div>
                          {form.evidenceLinks.map((link, i) => (
                            <div key={i} className="flex items-center gap-2 bg-[#21262D] rounded-lg px-3 py-2 mb-1.5">
                              <span className="text-sm text-foreground flex-1 truncate">{link}</span>
                              <button onClick={() => setForm((f) => ({ ...f, evidenceLinks: f.evidenceLinks.filter((_, j) => j !== i) }))} className="text-muted-foreground hover:text-[#F85149] transition-colors">
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex items-center gap-2 bg-primary text-black font-semibold px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                          >
                            <Send size={16} /> {submitting ? 'Submitting…' : 'Submit'}
                          </button>
                          <button onClick={() => setActiveTaskId(null)} className="px-6 py-2.5 border border-border text-muted-foreground rounded-lg hover:border-[#8B949E] transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => openSubmit(task.id)}
                        className="mt-4 flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                      >
                        <Send size={14} /> {sub?.status === 'rejected' ? 'Resubmit' : 'Submit Task'}
                      </button>
                    )
                  ) : (
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={14} />
                      Submitted {new Date(sub.submittedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {allTasksSubmitted && !stageCompleted && (
        <div className="pt-6 border-t border-border">
          <button
            onClick={handleCompleteStage}
            disabled={completing}
            className="flex items-center gap-2 bg-primary text-black font-semibold px-8 py-3.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <CheckCircle2 size={18} />
            {completing ? 'Marking Complete…' : 'Mark Stage Complete'}
          </button>
          <p className="text-xs text-muted-foreground mt-2">You've submitted all tasks. Mark the stage complete to track your progress.</p>
        </div>
      )}
    </div>
  );
}
