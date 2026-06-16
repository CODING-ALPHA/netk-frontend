'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Users, ExternalLink, Trash2, MapPin, Star } from 'lucide-react';
import Link from 'next/link';

export default function ShortlistPage() {
  const [shortlist, setShortlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    api.get('/hiring/shortlist')
      .then(({ data }) => setShortlist(data))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (id: string) => {
    setRemoving(id);
    try {
      await api.delete(`/hiring/shortlist/${id}`);
      setShortlist((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert('Failed to remove from shortlist');
    } finally {
      setRemoving(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="font-syne text-3xl font-bold text-foreground">Shortlisted Candidates</h1>
        <p className="text-muted-foreground mt-1">Candidates you've saved for future consideration.</p>
      </div>

      {shortlist.length === 0 ? (
        <div className="text-center py-20 bg-card border border-dashed border-border rounded-xl text-muted-foreground">
          <Users size={32} className="mx-auto mb-4 opacity-40" />
          <p>No candidates shortlisted yet.</p>
          <Link href="/company/talent" className="text-primary hover:underline mt-2 inline-block text-sm">
            Search for talent
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shortlist.map((entry) => (
            <div key={entry.id} className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={14} />
                  <span>Shortlisted {new Date(entry.createdAt).toLocaleDateString()}</span>
                </div>
                <button
                  onClick={() => remove(entry.id)}
                  disabled={removing === entry.id}
                  className="text-muted-foreground hover:text-[#F85149] transition-colors p-1 rounded disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {entry.note && (
                <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                  "{entry.note}"
                </p>
              )}

              <div className="text-xs text-muted-foreground">
                Candidate ID: <span className="font-mono text-foreground">{entry.userId}</span>
              </div>

              <Link
                href={`/company/talent`}
                className="flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 py-2.5 rounded-lg text-sm font-semibold transition-colors mt-auto"
              >
                <ExternalLink size={14} /> View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
