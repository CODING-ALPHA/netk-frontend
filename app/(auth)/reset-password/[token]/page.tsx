'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/api';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (form.newPassword.length < 8)
      errs.newPassword = 'Password must be at least 8 characters.';
    if (form.newPassword !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match.';
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
      await api.post('/auth/reset-password', {
        token,
        newPassword: form.newPassword,
      });
      router.push('/sign-in?reset=true');
    } catch {
      setServerError('This reset link is invalid or has expired.');
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
          Reset your password
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          Enter a new password for your account.
        </p>

        {serverError && (
          <div className="bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] text-sm rounded-lg px-4 py-3 mb-5">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={form.newPassword}
              onChange={(e) =>
                setForm((f) => ({ ...f, newPassword: e.target.value }))
              }
              className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-foreground text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)_/_0.1)] transition-all placeholder-muted-foreground"
              placeholder="Minimum 8 characters"
            />
            {errors.newPassword && (
              <p className="text-[#F85149] text-[13px] mt-1">
                {errors.newPassword}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((f) => ({ ...f, confirmPassword: e.target.value }))
              }
              className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-foreground text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)_/_0.1)] transition-all placeholder-muted-foreground"
              placeholder="Repeat your new password"
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
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-6">
          <Link href="/sign-in" className="text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
