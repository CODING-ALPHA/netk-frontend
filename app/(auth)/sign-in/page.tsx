'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import api from '@/lib/api';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('reset') === 'true') {
      setSuccessMsg('Password reset successfully. Please sign in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      });

      await fetch('/api/auth/set-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const profileRes = await api.get('/users/me');
      const profile = profileRes.data;
      console.log('Profile fetched:', profile);

      if (profile.role === 'admin') {
        console.log('Pushing to /admin');
        window.location.href = '/admin';
      } else if (profile.role === 'employer') {
        console.log('Pushing to /company');
        window.location.href = '/company';
      } else if (!profile.region) {
        console.log('Pushing to /onboarding');
        window.location.href = '/onboarding';
      } else if (!profile.ikigaiProfile) {
        console.log('Pushing to /assessment');
        window.location.href = '/assessment';
      } else {
        console.log('Pushing to /dashboard');
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 fade-in">
      <div className="mb-8">
        <span className="font-syne text-3xl font-bold text-primary">NetK</span>
      </div>

      {successMsg && (
        <div className="w-full max-w-[420px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm rounded-lg px-4 py-3 mb-4">
          {successMsg}
        </div>
      )}

      <div className="w-full max-w-[420px] bg-card border border-border rounded-xl p-8">
        <h1 className="font-syne text-2xl font-bold text-foreground mb-1">
          Welcome back
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          Sign in to continue your journey.
        </p>

        {error && (
          <div className="bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] text-sm rounded-lg px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-foreground text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)_/_0.1)] transition-all placeholder-muted-foreground"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm text-muted-foreground">Password</label>
              <Link
                href="/forgot-password"
                className="text-primary text-xs hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-foreground text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)_/_0.1)] transition-all placeholder-muted-foreground"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-medium rounded-lg py-2.5 mt-2 hover:scale-[1.02] active:scale-100 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

// useSearchParams requires a Suspense boundary in Next.js App Router
export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
