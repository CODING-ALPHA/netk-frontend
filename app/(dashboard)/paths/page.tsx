'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';

export default function PathsPage() {
  const [paths, setPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/paths')
      .then(({ data }) => setPaths(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12">
      <div className="max-w-3xl">
        <h1 className="font-syne text-4xl font-bold mb-4 tracking-tight">
          Explore the <span className="text-primary">Right Path</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Find career roadmaps tailored to market demands and your individual Ikigai. Advance step-by-step through practical tasks.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading Paths…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((path) => (
            <Link
              href={`/paths/${path.slug}`}
              key={path.slug}
              className="group bg-card border border-border hover:border-primary/50 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 flex flex-col"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Layers size={24} />
                </div>
                <ArrowRight
                  size={20}
                  className="text-primary opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300"
                />
              </div>
              
              <h3 className="text-xl font-bold font-syne mb-3 group-hover:text-primary transition-colors">
                {path.name}
              </h3>
              
              <p className="text-muted-foreground text-sm flex-1 mb-6 leading-relaxed line-clamp-3">
                {path.description}
              </p>
              
              {path.tags && path.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {path.tags.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="px-2.5 py-1 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider rounded-md">
                      {tag}
                    </span>
                  ))}
                  {path.tags.length > 3 && (
                    <span className="px-2.5 py-1 bg-secondary/50 text-muted-foreground text-[10px] font-bold uppercase tracking-wider rounded-md">
                      +{path.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs font-semibold pt-4 border-t border-border mt-auto">
                <span className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest">
                  <BookOpen size={14} className="text-primary" /> Roadmap Available
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
