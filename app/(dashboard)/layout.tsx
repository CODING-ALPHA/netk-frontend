'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Briefcase, User, FolderOpen, LogOut, Compass, Building2 } from 'lucide-react';
import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Submissions', href: '/dashboard/submissions', icon: FolderOpen },
    { name: 'Portfolio', href: '/dashboard/portfolio', icon: Briefcase },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Career Paths', href: '/paths', icon: Compass },
    { name: 'Browse Roles', href: '/roles', icon: Building2 },
  ];

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/sign-in');
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/dashboard" className="font-syne text-primary text-2xl font-bold">
            NetK
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
                    ? 'bg-card text-primary border border-border' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-card'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-border flex items-center px-8 md:px-12 bg-background/80 backdrop-blur z-10 sticky top-0 justify-between">
          <h2 className="font-syne font-semibold text-lg text-foreground capitalize">
            {pathname.split('/').pop() || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
                <User size={16} className="text-muted-foreground" />
             </div>
          </div>
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
