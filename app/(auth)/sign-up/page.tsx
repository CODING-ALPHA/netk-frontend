'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/api';

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) errs.email = 'Please enter a valid email address.';
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setServerError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/signup', {
        email: form.email,
        password: form.password,
      });
      await fetch('/api/auth/set-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      window.location.href = '/onboarding';
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setServerError(
        Array.isArray(msg) ? msg[0] : msg || 'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 fade-in">
      <div className="mb-8">
        <span className="font-syne text-3xl font-bold text-primary">NetK</span>
      </div>

      <div className="w-full max-w-[420px] bg-card border border-border rounded-xl p-8">
        <h1 className="font-syne text-2xl font-bold text-foreground mb-1">
          Create your account
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          Start building your career path today.
        </p>

        {serverError && (
          <div className="bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] text-sm rounded-lg px-4 py-3 mb-5">
            {serverError}
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
            {errors.email && (
              <p className="text-[#F85149] text-[13px] mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-foreground text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)_/_0.1)] transition-all placeholder-muted-foreground"
              placeholder="Minimum 8 characters"
            />
            {errors.password && (
              <p className="text-[#F85149] text-[13px] mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((f) => ({ ...f, confirmPassword: e.target.value }))
              }
              className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-foreground text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)_/_0.1)] transition-all placeholder-muted-foreground"
              placeholder="Repeat your password"
            />
            {errors.confirmPassword && (
              <p className="text-[#F85149] text-[13px] mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-medium rounded-lg py-2.5 mt-2 hover:scale-[1.02] active:scale-100 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-6">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
