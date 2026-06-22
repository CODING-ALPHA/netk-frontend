'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Mail, CheckCircle2, XCircle, Clock, Building2 } from 'lucide-react';

export default function InboxPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/hiring/contact/inbox');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (id: string, status: 'accepted' | 'declined') => {
    try {
      await api.patch(`/hiring/contact/${id}/respond`, { status });
      // Update local state
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (err) {
      console.error('Failed to respond', err);
      alert('Failed to respond. Please try again.');
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
    <div className="max-w-3xl space-y-10 fade-in">
      <div className="space-y-2">
        <h1 className="font-syne text-3xl font-bold text-foreground tracking-tight">Inbox</h1>
        <p className="text-muted-foreground">Manage your incoming interview requests and messages from companies.</p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl text-muted-foreground">
          <Mail size={32} className="mx-auto mb-4 opacity-40" />
          <p>Your inbox is empty.</p>
          <p className="text-sm mt-2">Keep building your public portfolio to attract companies!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <div key={req.id} className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">Message from Company</h3>
                    <p className="text-sm text-muted-foreground">
                      Regarding a role opportunity
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border ${
                    req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                    req.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                    'bg-red-500/10 text-red-500 border-red-500/30'
                  }`}>
                    {req.status}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock size={12} /> {new Date(req.sentAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="bg-background border border-border p-5 rounded-xl mb-6">
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {req.message}
                </p>
              </div>

              {req.status === 'pending' && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleRespond(req.id, 'accepted')}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-black font-semibold px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-all"
                  >
                    <CheckCircle2 size={16} /> Accept & Reply
                  </button>
                  <button
                    onClick={() => handleRespond(req.id, 'declined')}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#21262D] text-muted-foreground hover:text-foreground hover:bg-[#30363D] border border-border px-6 py-2.5 rounded-lg transition-all"
                  >
                    <XCircle size={16} /> Decline
                  </button>
                </div>
              )}
              
              {req.status === 'accepted' && (
                <p className="text-sm text-emerald-500">
                  You accepted this request. The company will be in touch via email.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
