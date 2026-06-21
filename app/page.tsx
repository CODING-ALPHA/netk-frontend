import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded flex items-center justify-center font-bold text-black text-xl">
              N
            </div>
            <span className="text-xl font-black uppercase tracking-tighter">NetK</span>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            <Link href="#ikigai" className="hover:text-primary transition-colors">Ikigai</Link>
            <Link href="#roadmap" className="hover:text-primary transition-colors">Roadmap</Link>
            <Link href="#tasks" className="hover:text-primary transition-colors">Proofs</Link>
            <Link href="#hiring" className="hover:text-primary transition-colors">Hiring</Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-border px-3 py-1.5 rounded-full">
              <span className="opacity-50">Lang</span> EN
            </div>
            <Link
              href="/onboarding"
              className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-primary transition-all active:scale-95 shadow-2xl flex items-center gap-2"
            >
              Get Started
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      <main className="">
        {/* Hero Wrapper */}
        <div className="relative min-h-screen flex flex-col justify-center overflow-hidden">
          {/* Hero Content */}
          <section className="relative px-8 md:px-[8%] pt-32 pb-24 z-10 w-full">
            <h1 className="text-[clamp(2.5rem,5vw,5.5rem)] font-black uppercase tracking-tighter mb-8 leading-[0.9]">
              Moving Careers <br/>
              <span className="text-white">Forward</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-lg font-medium leading-relaxed mb-12">
              NetK builds evidence-driven career systems, unifying discovery, roadmapping, and proof-of-work into a single evolving execution.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/onboarding"
                className="px-8 py-4 bg-primary text-black text-xs font-black uppercase tracking-widest rounded-sm hover:opacity-90 transition-all flex items-center gap-3"
              >
                View Roadmaps
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="#ikigai"
                className="px-8 py-4 bg-[#111] border border-border/40 text-white text-xs font-black uppercase tracking-widest rounded-sm hover:bg-white hover:text-black transition-all flex items-center gap-3"
              >
                Get a Quote
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </section>

          {/* Hero Footer Meta */}
          <div className="absolute bottom-10 left-8 md:left-[8%] right-8 md:right-[8%] flex justify-between items-end z-10 w-auto">
             <div className="flex flex-col gap-4">
               <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground w-max cursor-pointer group">
                  <span className="group-hover:text-primary transition-colors">Scroll for more</span>
                  <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
               </div>
             </div>
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">
               Est. in 2026
             </div>
          </div>
        </div>


        {/* The Problem Section */}

        {/* The Problem Section */}
        <section className="py-24 bg-secondary/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold tracking-tight mb-6">
                  Random learning is the <span className="text-destructive">enemy</span> of employability.
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Most people aren't stuck because they lack motivation — they're stuck because they lack a system. 
                  Courses without proofs are just entertainment.
                </p>
                <div className="space-y-4">
                  {[
                    'No credible proof of ability',
                    'Directionless portfolio building',
                    'Uncertainty in career choice',
                    'Weak visibility to hiring companies'
                  ].map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="font-medium">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border p-2 rounded-[2rem] shadow-2xl overflow-hidden group">
                <div className="aspect-[4/3] bg-background rounded-[1.5rem] relative flex items-center justify-center p-8 overflow-hidden">
                   <div className="absolute inset-0 bg-primary opacity-5" />
                   {/* Graphic suggesting a messy flowchart */}
                   <svg className="w-full h-full text-muted-foreground opacity-20" viewBox="0 0 200 150">
                     <path d="M20,20 Q100,20 180,20" stroke="currentColor" strokeWidth="2" fill="none" />
                     <path d="M20,75 L180,20" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                     <circle cx="20" cy="20" r="4" fill="currentColor" />
                     <circle cx="180" cy="20" r="4" fill="currentColor" />
                     <rect x="50" y="50" width="40" height="20" stroke="currentColor" strokeWidth="2" fill="none" />
                     <path d="M100,100 L150,130" stroke="currentColor" strokeWidth="2" fill="none" />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                      <div className="mb-4 p-4 rounded-2xl bg-destructive/10 text-destructive text-4xl">⚠️</div>
                      <div className="text-xl font-bold mb-2 uppercase tracking-tighter">The Chaos Cycle</div>
                      <div className="text-sm text-muted-foreground max-w-[200px]">Random courses, zero results.</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Ikigai Section */}
        <section id="ikigai" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Built on Ikigai</h2>
              <p className="text-xl text-muted-foreground">
                We use the Japanese framework for "reason for being" to find your career sweet spot. Right at the intersection of passion and production.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-square flex items-center justify-center">
                {/* Circle Diagram CSS visualization */}
                <div className="absolute top-1/2 left-1/2 -translate-x-[70%] -translate-y-[70%] w-[60%] h-[60%] rounded-full border border-primary/40 bg-primary/5 flex items-center justify-center text-center p-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Love</span>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-[30%] -translate-y-[70%] w-[60%] h-[60%] rounded-full border border-blue-400/40 bg-blue-400/5 flex items-center justify-center text-center p-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Skills</span>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-[70%] -translate-y-[30%] w-[60%] h-[60%] rounded-full border border-emerald-400/40 bg-emerald-400/5 flex items-center justify-center text-center p-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Needs</span>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-[30%] -translate-y-[30%] w-[60%] h-[60%] rounded-full border border-amber-400/40 bg-amber-400/5 flex items-center justify-center text-center p-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Paid</span>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/50 text-black font-black text-xs uppercase z-10">
                  IKIGAI
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {[
                  { title: 'What You Love', desc: 'Your passions and intrinsic motivations.', color: 'text-primary' },
                  { title: "What You're Good At", desc: 'Your natural and developed technical strengths.', color: 'text-blue-400' },
                  { title: 'What the World Needs', desc: 'Valuable, in-demand capabilities for industry.', color: 'text-emerald-400' },
                  { title: 'What You Can Be Paid For', desc: 'Viable, high-market career paths.', color: 'text-amber-400' },
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-card border border-border rounded-3xl hover:border-primary/50 transition-all group">
                    <h3 className={`text-xl font-bold mb-2 ${item.color}`}>{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* User Journey Section */}
        <section id="roadmap" className="py-24 bg-secondary/10 border-y border-border/40">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold tracking-tight mb-16 underline decoration-primary decoration-4 underline-offset-8">The Execution Pipeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-border/40 rounded-[2.5rem] overflow-hidden">
              {[
                { step: '01', title: 'Ikigai Assessment', desc: 'Discover your career fit across four dimensions.' },
                { step: '02', title: 'Path Discovery', desc: 'Receive top 3 recommendations with confidence scores.' },
                { step: '03', title: 'Structured Roadmap', desc: 'Follow a 5-stage roadmap designed for action.' },
                { step: '04', title: 'Proof-of-Work Tasks', desc: 'Complete real tasks with defined deliverables.' },
                { step: '05', title: 'Verified Portfolio', desc: 'Auto-generate artifacts from accepted submissions.' },
                { step: '06', title: 'Hiring Visibility', desc: 'Get surfaced to companies searching for verified talent.' },
              ].map((item, i) => (
                <div key={i} className="p-10 border border-border/40 hover:bg-primary/5 transition-all group">
                  <div className="text-4xl font-black text-muted-foreground/20 group-hover:text-primary/40 transition-colors mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="tasks" className="py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-12 gap-6 h-full">
              {/* Feature 1 */}
              <div className="col-span-12 md:col-span-8 bg-card border border-border rounded-[2.5rem] p-10 relative overflow-hidden group min-h-[300px]">
                <div className="relative z-10 max-w-lg">
                  <h3 className="text-3xl font-bold mb-4 italic leading-tight">Proof of Work <br/> is the new resume.</h3>
                  <p className="text-muted-foreground mb-6">
                    Our tasks aren't multiple-choice. They're real-world deliverables reviewed by industry standards. 
                    Every submission is a brick in your wall of credibility.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black uppercase rounded-full">No Fluff</span>
                    <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black uppercase rounded-full">Real Deliverables</span>
                    <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black uppercase rounded-full">Industry Review</span>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
              </div>

              {/* Feature 2 */}
              <div className="col-span-12 md:col-span-4 bg-primary text-black rounded-[2.5rem] p-10 flex flex-col justify-between group">
                <div>
                  <h3 className="text-2xl font-black uppercase leading-[1.1] mb-4">Auto-Built <br/> Portfolio</h3>
                  <p className="font-medium opacity-80 text-sm">
                    Stop worrying about your site layout. Your accepted tasks automatically populate a verified portfolio.
                  </p>
                </div>
                <div className="flex justify-end">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM11 17l-4-4 1.414-1.414L11 14.172l7.586-7.586L20 8l-9 9z" />
                  </svg>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="col-span-12 md:col-span-4 bg-card border border-border rounded-[2.5rem] p-10 min-h-[400px]">
                 <div className="h-full flex flex-col">
                   <div className="mb-6 w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-2xl">🏛️</div>
                   <h3 className="text-2xl font-bold mb-4 tracking-tighter uppercase">Structured Roadmaps</h3>
                   <p className="text-muted-foreground text-sm flex-grow">
                     A 5-stage progression system for every career path. From curious beginner to employment-ready.
                   </p>
                   <div className="mt-8 pt-8 border-t border-border space-y-2">
                     <div className="h-1 w-full bg-secondary rounded-full">
                       <div className="h-full w-3/5 bg-primary rounded-full transition-all duration-1000" />
                     </div>
                     <div className="text-[10px] font-bold text-muted-foreground uppercase">Stage 3: Systems Design</div>
                   </div>
                 </div>
              </div>

              {/* Feature 4 */}
              <div id="hiring" className="col-span-12 md:col-span-8 bg-secondary/40 border border-border rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10 items-center overflow-hidden">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-4 tracking-tighter">Hiring Visibility</h3>
                  <p className="text-muted-foreground mb-6">
                    Companies search by verified artifacts, not just job titles. Your proof-of-work surfaces you directly to recruitment teams.
                  </p>
                  <button className="px-6 py-3 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all text-sm uppercase">
                    Register as Company
                  </button>
                </div>
                <div className="flex-1 w-full relative">
                  <div className="p-4 bg-background border border-border rounded-2xl shadow-xl transform rotate-3 translate-x-4">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20" />
                        <div className="h-3 w-24 bg-border rounded-full" />
                     </div>
                     <div className="space-y-2">
                        <div className="h-2 w-full bg-border/40 rounded-full" />
                        <div className="h-2 w-full bg-border/40 rounded-full" />
                        <div className="h-2 w-3/4 bg-border/40 rounded-full" />
                     </div>
                  </div>
                  <div className="absolute top-0 left-0 p-4 bg-card border border-primary rounded-2xl shadow-2xl transform -rotate-3 z-10 w-full">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-primary"></div>
                           <div className="text-xs font-bold">Candidate #1402</div>
                        </div>
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-bold">9 artifacts</span>
                     </div>
                     <div className="flex gap-1 mb-2">
                       <span className="w-1/4 h-1 bg-primary rounded" />
                       <span className="w-1/4 h-1 bg-primary rounded" />
                       <span className="w-1/4 h-1 bg-primary rounded" />
                       <span className="w-1/4 h-1 bg-secondary rounded" />
                     </div>
                     <div className="text-[9px] text-muted-foreground">Status: Ready for Interview</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 text-center relative">
            <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter">
              Stop guessing. <br/> Start building.
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Ready to find your Ikigai and build a portfolio that actually means something?
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-4 px-10 py-5 bg-primary text-black text-xl font-black rounded-full hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30"
            >
              Start Your Assessment
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <p className="mt-8 text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">
              Takes ~5 minutes • Free for seekers
            </p>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border/40 bg-background">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center font-bold text-black text-sm">
              N
            </div>
            <span className="font-bold">NetK</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-primary transition-colors">LinkedIn</Link>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2026 NetK System. Built for Proof.
          </div>
        </div>
      </footer>
    </div>
  );
}
