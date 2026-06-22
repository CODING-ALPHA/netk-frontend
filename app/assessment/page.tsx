'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

const ANSWER_OPTIONS = [
  { value: 1, label: 'Strongly disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly agree' },
];

const STEPS = [
  { n: 1, label: 'Profile Setup' },
  { n: 2, label: 'Ikigai Assessment' },
  { n: 3, label: 'Your Roadmap' },
];

interface Question {
  id: string;
  text: string;
}

interface QuestionSection {
  id: string;
  label: string;
  description: string;
  questions: Question[];
}

export default function AssessmentPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [sections, setSections] = useState<QuestionSection[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get('/users/me')
      .then(({ data }) => {
        if (!data.region) {
          router.push('/onboarding');
          return null;
        }
        if (data.ikigaiProfile) {
          router.push('/dashboard');
          return null;
        }
        return api.get('/assessment/questions');
      })
      .then((res) => {
        if (res) {
          setSections(res.data.sections);
          setChecking(false);
        }
      })
      .catch(() => {
        router.push('/sign-in');
      });
  }, [router]);

  if (checking || sections.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const section = sections[currentSection];
  const isLastSection = currentSection === sections.length - 1;
  const allAnswered = section.questions.every((q) => answers[q.id] !== undefined);

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setError('');
  };

  const handleNext = () => {
    if (!allAnswered) {
      setError('Please answer all questions before continuing.');
      return;
    }
    setError('');
    setCurrentSection((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setError('');
    setCurrentSection((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!allAnswered) {
      setError('Please answer all questions before submitting.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const sectionIds = ['love', 'strengths', 'worldNeeds', 'paidSkills'];
      const payload = {
        answers: Object.fromEntries(
          sectionIds.map((sectionId) => {
            const sec = sections.find((s) => s.id === sectionId)!;
            return [
              sectionId,
              sec.questions.map((q) => ({
                questionId: q.id,
                answer: answers[q.id],
              })),
            ];
          }),
        ),
      };

      await api.post('/assessment/submit', payload);
      router.push('/assessment/results');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex fade-in">
      {/* Left panel */}
      <div className="hidden md:flex w-[40%] bg-card border-r border-border flex-col p-10 shrink-0">
        <div className="mb-12">
          <span className="font-syne text-2xl font-bold text-primary">NetK</span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h2 className="font-syne text-4xl font-bold text-foreground leading-tight mb-4">
            Discover your Ikigai
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed mb-12">
            Answer 20 questions across four dimensions to uncover your ideal
            career direction.
          </p>

          <div className="space-y-5">
            {STEPS.map((step) => {
              const active = step.n === 2;
              const done = step.n < 2;
              return (
                <div key={step.n} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      active
                        ? 'bg-primary text-black'
                        : done
                        ? 'bg-primary/20 text-primary'
                        : 'bg-[#21262D] text-muted-foreground'
                    }`}
                  >
                    {done ? '✓' : step.n}
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

      {/* Right panel */}
      <div className="flex-1 bg-background flex flex-col justify-center px-6 md:px-12 py-10 overflow-y-auto">
        <div className="max-w-lg w-full mx-auto">
          {/* Mobile logo */}
          <div className="md:hidden mb-8">
            <span className="font-syne text-2xl font-bold text-primary">NetK</span>
          </div>

          {/* Section progress bar */}
          <div className="flex items-center gap-2 mb-6">
            {sections.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full flex-1 transition-all ${
                  i <= currentSection ? 'bg-primary' : 'bg-[#21262D]'
                }`}
              />
            ))}
          </div>

          <p className="text-primary text-[11px] uppercase tracking-wider font-medium mb-1">
            Section {currentSection + 1} of {sections.length}
          </p>

          <div key={currentSection} className="animate-slide-in">
            <h3 className="font-syne text-2xl font-bold text-foreground mb-1">
              {section.label}
            </h3>
            <p className="text-muted-foreground text-sm mb-8">
              {section.description}
            </p>

            {error && (
              <div className="bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] text-sm rounded-lg px-4 py-3 mb-6">
                {error}
              </div>
            )}

            <div className="space-y-8">
              {section.questions.map((q, qi) => (
                <div key={q.id}>
                  <p className="text-foreground text-sm font-medium mb-3">
                    {qi + 1}. {q.text}
                  </p>
                  <div className="flex gap-2">
                    {ANSWER_OPTIONS.map((opt) => {
                      const selected = answers[q.id] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleAnswer(q.id, opt.value)}
                          title={opt.label}
                          className={`flex-1 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                            selected
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border bg-card text-muted-foreground hover:border-[#8B949E]'
                          }`}
                        >
                          {opt.value}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-muted-foreground text-[11px]">
                      Strongly disagree
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      Strongly agree
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-10">
            {currentSection > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 border border-border text-foreground font-medium rounded-lg py-3 hover:border-[#8B949E] transition-colors"
              >
                Back
              </button>
            )}
            {isLastSection ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-primary text-black font-medium rounded-lg py-3 hover:scale-[1.02] active:scale-100 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? 'Submitting…' : 'Submit Assessment'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-primary text-black font-medium rounded-lg py-3 hover:scale-[1.02] active:scale-100 transition-transform"
              >
                Next Section
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
