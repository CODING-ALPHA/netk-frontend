'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Briefcase, Users, LayoutDashboard, Settings, LogOut, FileSearch } from 'lucide-react';
import React from 'react';

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/sign-in');
  };

  const navItems = [
    { name: 'Overview', href: '/company', icon: LayoutDashboard },
    { name: 'My Roles', href: '/company/roles', icon: Briefcase },
    { name: 'Talent Search', href: '/company/talent', icon: FileSearch },
    { name: 'Shortlisted', href: '/company/shortlist', icon: Users },
    { name: 'Settings', href: '/company/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <aside className="w-64 border-r border-border hidden md:flex flex-col bg-card/50">
        <div className="p-6 border-b border-border">
          <Link href="/company" className="font-syne text-primary text-2xl font-bold flex items-center gap-2">
            NetK <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-primary/20 relative top-[-4px]">Employer</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-[#21262D]'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <button onClick={handleSignOut} className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors">
            <LogOut size={20} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-border flex items-center px-8 md:px-12 bg-background/80 backdrop-blur z-10 sticky top-0 justify-between">
          <h2 className="font-syne font-semibold text-lg text-foreground capitalize">
             Employer Portal
          </h2>
        </header>
        <div className="flex-1 overflow-y-auto p-8 md:p-12">
          <div className="max-w-5xl mx-auto pb-20">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
