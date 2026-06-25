'use client';

import Link from 'next/link';
import { useState } from 'react';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 fade-in">
      <div className="mb-8">
        <span className="font-syne text-3xl font-bold text-primary">NetK</span>
      </div>

      <div className="w-full max-w-[420px] bg-card border border-border rounded-xl p-8">
        <h1 className="font-syne text-2xl font-bold text-foreground mb-1">
          Forgot password?
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm rounded-lg px-4 py-4 leading-relaxed">
            If that email exists, you will receive a reset link shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-foreground text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)_/_0.1)] transition-all placeholder-muted-foreground"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black font-medium rounded-lg py-2.5 hover:scale-[1.02] active:scale-100 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="text-center text-muted-foreground text-sm mt-6">
          <Link href="/sign-in" className="text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
