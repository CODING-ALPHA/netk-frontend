'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Briefcase, ArrowRight, MapPin, Tag } from 'lucide-react';

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/hiring/roles/open')
      .then(({ data }) => setRoles(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12">
      <div className="max-w-3xl">
        <h1 className="font-syne text-4xl font-bold mb-4 tracking-tight">
          Discover <span className="text-primary">Opportunities</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Get matched with top companies looking for verified skills directly from your NetK portfolio.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : roles.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground bg-card border border-border rounded-2xl">
          <Briefcase size={32} className="mx-auto mb-4 opacity-40" />
          <p>No open roles right now. Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <Link href={`/roles/${role.id}`} key={role.id}>
              <div
                className="bg-card border border-border hover:border-primary/50 rounded-2xl p-8 transition-all flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Briefcase size={20} />
                  </div>
                  <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                    {role.experienceLevel || 'Open Level'}
                  </span>
                </div>

                <h3 className="text-2xl font-bold font-syne mb-2 text-foreground">{role.title}</h3>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  {role.region && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} /> {role.region}
                    </span>
                  )}
                </div>

                <p className="text-muted-foreground text-sm flex-1 mb-6 leading-relaxed line-clamp-3">
                  {role.description}
                </p>

                {role.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {role.tags.slice(0, 4).map((tag: string) => (
                      <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-secondary text-muted-foreground text-[10px] font-bold uppercase tracking-wider rounded-md border border-border">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between bg-background border border-border px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground mt-auto">
                  Posted {new Date(role.createdAt).toLocaleDateString()}
                  <ArrowRight size={16} className="text-primary" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
