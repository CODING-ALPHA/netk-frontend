'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Plus, Briefcase, MapPin, ExternalLink, Settings } from 'lucide-react';

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await api.get('/hiring/admin/roles');
      setRoles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
    <div className="max-w-5xl space-y-8 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-syne text-3xl font-bold text-foreground">Manage Roles</h1>
          <p className="text-muted-foreground mt-1">View and manage all job openings across companies.</p>
        </div>
        <Link
          href="/admin/roles/create"
          className="inline-flex items-center gap-2 bg-primary text-black font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/10"
        >
          <Plus size={18} /> Upload New Role
        </Link>
      </div>

      {roles.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl text-muted-foreground">
          <Briefcase size={32} className="mx-auto mb-4 opacity-40" />
          <p>No roles have been created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div key={role.id} className="bg-card border border-border rounded-2xl p-6 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground font-syne truncate pr-2" title={role.title}>
                    {role.title}
                  </h3>
                  <p className="text-primary text-sm font-medium mt-1">{role.companyName}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border shrink-0 ${
                  role.status === 'open' 
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                }`}>
                  {role.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-6">
                {role.region && (
                  <span className="flex items-center gap-1 bg-background px-2 py-1 rounded-md border border-border">
                    <MapPin size={12} /> {role.region}
                  </span>
                )}
                {role.experienceLevel && (
                  <span className="flex items-center gap-1 bg-background px-2 py-1 rounded-md border border-border">
                    <Briefcase size={12} /> {role.experienceLevel}
                  </span>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Created {new Date(role.createdAt).toLocaleDateString()}
                </span>
                <Link
                  href={`/roles/${role.id}`}
                  target="_blank"
                  className="text-primary hover:text-primary/80 flex items-center gap-1.5 text-sm font-medium transition-colors"
                >
                  View Public <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
