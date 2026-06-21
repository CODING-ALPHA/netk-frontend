'use client';

import { useRouter } from 'next/navigation';
import { KeyboardEvent, useEffect, useState } from 'react';
import api from '@/lib/api';

const REGIONS = [
  'West Africa',
  'East Africa',
  'Europe',
  'North America',
  'South Asia',
  'Southeast Asia',
  'Latin America',
  'Middle East',
];

const EXPERIENCE_LEVELS = [
  { value: 'Beginner', desc: 'Just starting out' },
  { value: 'Intermediate', desc: 'Some experience' },
  { value: 'Advanced', desc: 'Been doing this a while' },
];

const STEPS = [
  { n: 1, label: 'Profile Setup' },
  { n: 2, label: 'Ikigai Assessment' },
  { n: 3, label: 'Your Roadmap' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [form, setForm] = useState({
    region: '',
    experienceLevel: '',
    careerInterests: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get('/users/me')
      .then(({ data }) => {
        if (data.region) {
          router.push('/dashboard');
        } else {
          setChecking(false);
        }
      })
      .catch(() => {
        router.push('/sign-in');
      });
  }, [router]);

  const addTag = (raw: string) => {
    const trimmed = raw.trim().replace(/,+$/, '').trim();
    if (trimmed && !form.careerInterests.includes(trimmed)) {
      setForm((f) => ({ ...f, careerInterests: [...f.careerInterests, trimmed] }));
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setForm((f) => ({
      ...f,
      careerInterests: f.careerInterests.filter((t) => t !== tag),
    }));
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === 'Backspace' && !tagInput && form.careerInterests.length > 0) {
      removeTag(form.careerInterests[form.careerInterests.length - 1]);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.region) errs.region = 'Please select your region.';
    if (!form.experienceLevel)
      errs.experienceLevel = 'Please select your experience level.';
    if (form.careerInterests.length === 0)
      errs.careerInterests = 'Please add at least one career interest.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tagInput.trim()) addTag(tagInput);

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      await api.patch('/users/me', form);
      router.push('/assessment');
    } catch {
      setErrors({ form: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex fade-in">
      {/* ── Left panel ── */}
      <div className="hidden md:flex w-[40%] bg-card border-r border-border flex-col p-10 shrink-0">
        <div className="mb-12">
          <span className="font-syne text-2xl font-bold text-primary">NetK</span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h2 className="font-syne text-4xl font-bold text-foreground leading-tight mb-4">
            Let&apos;s build your path
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed mb-12">
            Tell us a bit about yourself so we can find the right career
            direction for you.
          </p>

          <div className="space-y-5">
            {STEPS.map((step) => {
              const active = step.n === 1;
              return (
                <div key={step.n} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      active
                        ? 'bg-primary text-black'
                        : 'bg-[#21262D] text-muted-foreground'
                    }`}
                  >
                    {step.n}
                  </div>
                  <div>
                    <p
                      className={`text-[11px] uppercase tracking-wider font-medium ${
                        active ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      Step {step.n} of 3
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        active ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 bg-background flex flex-col justify-center px-6 md:px-12 py-10 overflow-y-auto">
        <div className="max-w-lg w-full mx-auto">
          {/* Mobile logo */}
          <div className="md:hidden mb-8">
            <span className="font-syne text-2xl font-bold text-primary">
              NetK
            </span>
          </div>

          <h3 className="font-syne text-2xl font-bold text-foreground mb-1">
            Profile Setup
          </h3>
          <p className="text-muted-foreground text-sm mb-8">
            Help us personalise your experience.
          </p>

          {errors.form && (
            <div className="bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] text-sm rounded-lg px-4 py-3 mb-6">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Region
              </label>
              <select
                value={form.region}
                onChange={(e) =>
                  setForm((f) => ({ ...f, region: e.target.value }))
                }
                className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-foreground text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)_/_0.1)] transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Select your region
                </option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {errors.region && (
                <p className="text-[#F85149] text-[13px] mt-1">{errors.region}</p>
              )}
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Experience Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {EXPERIENCE_LEVELS.map(({ value, desc }) => {
                  const selected = form.experienceLevel === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({ ...f, experienceLevel: value }))
                      }
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                        selected
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-card hover:border-[#8B949E]'
                      }`}
                    >
                      <span
                        className={`font-medium text-sm ${
                          selected ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {value}
                      </span>
                      <span
                        className={`text-xs mt-1 ${
                          selected ? 'text-primary/70' : 'text-muted-foreground'
                        }`}
                      >
                        {desc}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.experienceLevel && (
                <p className="text-[#F85149] text-[13px] mt-2">
                  {errors.experienceLevel}
                </p>
              )}
            </div>

            {/* Career Interests */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Career Interests
              </label>
              <div className="min-h-[50px] bg-background border border-border rounded-lg px-3 py-2.5 flex flex-wrap gap-2 focus-within:border-primary focus-within:shadow-[0_0_0_3px_hsl(var(--primary)_/_0.1)] transition-all">
                {form.careerInterests.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 bg-[#21262D] text-foreground text-xs rounded-md px-2.5 py-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-muted-foreground hover:text-[#F85149] transition-colors leading-none"
                      aria-label={`Remove ${tag}`}
                    >
                      ✕
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => {
                    if (tagInput.trim()) addTag(tagInput);
                  }}
                  className="flex-1 min-w-[160px] bg-transparent text-foreground text-sm outline-none placeholder-[#8B949E]"
                  placeholder={
                    form.careerInterests.length === 0
                      ? 'e.g. Design, Technology, Writing'
                      : 'Add more…'
                  }
                />
              </div>
              <p className="text-muted-foreground text-xs mt-1">
                Press Enter or comma to add a tag.
              </p>
              {errors.careerInterests && (
                <p className="text-[#F85149] text-[13px] mt-1">
                  {errors.careerInterests}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black font-medium rounded-lg py-3 hover:scale-[1.02] active:scale-100 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Saving…' : 'Continue to Assessment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
