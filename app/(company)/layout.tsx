'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Briefcase, Users, LayoutDashboard, Settings, LogOut, FileSearch, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = React.useState(false);

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
    <div className="flex min-h-screen bg-background text-foreground font-sans relative">
      {/* Sidebar for Desktop */}
      <aside className={`border-r border-border hidden md:flex flex-col bg-card/50 shrink-0 transition-all duration-300 ${isDesktopCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`p-4 border-b border-border flex items-center ${isDesktopCollapsed ? 'justify-center flex-col py-3' : 'justify-between'}`}>
          {!isDesktopCollapsed && (
            <Link href="/company" className="font-syne text-primary text-2xl font-bold flex items-center gap-2">
              NetK <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-primary/20 relative top-[-4px]">Employer</span>
            </Link>
          )}
          <button
            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            title={isDesktopCollapsed ? "Expand Menu" : "Collapse Menu"}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {isDesktopCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isDesktopCollapsed ? item.name : undefined}
                className={`flex items-center ${isDesktopCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Icon size={20} className="shrink-0" />
                {!isDesktopCollapsed && <span className="font-medium text-sm whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border flex flex-col gap-2">
          <button onClick={handleSignOut} title={isDesktopCollapsed ? "Sign Out" : undefined} className={`flex w-full items-center ${isDesktopCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors`}>
            <LogOut size={20} className="shrink-0" />
            {!isDesktopCollapsed && <span className="font-medium text-sm whitespace-nowrap">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-background/85 backdrop-blur-sm">
          <div className="w-64 bg-card border-r border-border flex flex-col h-full shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <Link href="/company" className="font-syne text-primary text-2xl font-bold flex items-center gap-2" onClick={() => setIsSidebarOpen(false)}>
                NetK <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-primary/20 relative top-[-4px]">Employer</span>
              </Link>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-border">
              <button onClick={() => { setIsSidebarOpen(false); handleSignOut(); }} className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors">
                <LogOut size={20} />
                <span className="font-medium text-sm">Sign Out</span>
              </button>
            </div>
          </div>
          {/* Backdrop area to close drawer */}
          <div className="flex-1" onClick={() => setIsSidebarOpen(false)} />
        </div>
      )}

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-border flex items-center px-6 md:px-12 bg-background/80 backdrop-blur z-10 sticky top-0 justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-1.5 text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg bg-card"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <h2 className="font-syne font-semibold text-lg text-foreground capitalize">
               Employer Portal
            </h2>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-5xl mx-auto pb-20">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
