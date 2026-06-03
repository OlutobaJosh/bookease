'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type FormData = {
  goal: string;
  fitnessLevel: string;
  daysPerWeek: string;
  age: string;
  injuries: string;
};

function formatPlan(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={i} style={{ height: '8px' }} />;

    // Main headers (##, or ALL CAPS lines, or numbered sections)
    if (trimmed.startsWith('##') || /^\d+\.\s+[A-Z]/.test(trimmed) || /^[A-Z][A-Z\s\-–]+$/.test(trimmed)) {
      const text = trimmed.replace(/^#+\s*/, '').replace(/^\d+\.\s*/, '');
      return (
        <div key={i} className="mt-6 mb-2 pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="font-display text-lg" style={{ color: 'var(--accent)', letterSpacing: '-0.01em' }}>
            {text}
          </p>
        </div>
      );
    }

    // Sub headers (Day X:, bold **)
    if (/^(Day\s+\d+|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i.test(trimmed) ||
        (trimmed.startsWith('**') && trimmed.endsWith('**'))) {
      const text = trimmed.replace(/\*\*/g, '');
      return (
        <p key={i} className="font-semibold mt-4 mb-1 text-sm" style={{ color: 'var(--text)' }}>
          {text}
        </p>
      );
    }

    // Bullet points
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
      const text = trimmed.replace(/^[-•*]\s+/, '');
      return (
        <div key={i} className="flex items-start gap-2 my-1">
          <span className="mt-1.5 flex-shrink-0" style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)', display: 'block', marginTop: '7px' }} />
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{text}</p>
        </div>
      );
    }

    // Numbered list items
    if (/^\d+\.\s/.test(trimmed) && trimmed.length < 100) {
      return (
        <div key={i} className="flex items-start gap-2 my-1">
          <span className="text-xs font-mono flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)', minWidth: '16px' }}>
            {trimmed.match(/^\d+/)?.[0]}.
          </span>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
            {trimmed.replace(/^\d+\.\s/, '')}
          </p>
        </div>
      );
    }

    // Regular paragraph
    return (
      <p key={i} className="text-sm leading-relaxed my-1" style={{ color: 'var(--text-2)' }}>
        {trimmed}
      </p>
    );
  });
}

export default function TrainingPlanPage() {
  const [form, setForm] = useState<FormData>({
    goal: '', fitnessLevel: '', daysPerWeek: '', age: '', injuries: '',
  });
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generated, setGenerated] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true); setPlan(''); setGenerated(false);

    const res = await fetch('/api/training-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (data.error) {
      setError(data.error);
    } else {
      setPlan(data.plan);
      setGenerated(true);
      setTimeout(() => {
        document.getElementById('plan-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  const fieldStyle = {
    width: '100%',
    padding: '11px 14px',
    background: 'var(--bg-3)',
    border: '1px solid var(--border-2)',
    borderRadius: '8px',
    color: 'var(--text)',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    outline: 'none',
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '4rem', background: 'var(--bg)', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-4xl mx-auto px-6 py-14">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
              <span className="tag tag-accent">AI-Powered · Free</span>
            </div>
            <h1
              className="font-display"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}
            >
              Your Personal
              <br />
              <span style={{ color: 'var(--accent)' }}>Training Plan</span>
            </h1>
            <p className="mt-4 text-sm max-w-lg" style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
              Tell Alex about your goals and get a fully personalised weekly training plan generated by AI in seconds. No sign-up required.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Form */}
            <div>
              <div className="p-6 rounded-2xl" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                <h2 className="font-display text-xl mb-5" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>
                  Tell us about yourself
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Goal */}
                  <div>
                    <label className="block tag mb-1.5">
                      Primary Goal <span style={{ color: 'var(--accent)' }}>*</span>
                    </label>
                    <select name="goal" value={form.goal} onChange={handleChange} required style={fieldStyle}>
                      <option value="">Select your goal…</option>
                      <option value="Build muscle and increase strength">Build Muscle & Strength</option>
                      <option value="Lose weight and burn fat">Lose Weight & Burn Fat</option>
                      <option value="Improve cardiovascular fitness and endurance">Improve Cardio & Endurance</option>
                      <option value="Tone and define my body">Tone & Define</option>
                      <option value="Train for a sport or athletic performance">Athletic Performance</option>
                      <option value="Improve flexibility and mobility">Flexibility & Mobility</option>
                      <option value="General health and fitness maintenance">General Health & Fitness</option>
                    </select>
                  </div>

                  {/* Fitness Level */}
                  <div>
                    <label className="block tag mb-1.5">
                      Current Fitness Level <span style={{ color: 'var(--accent)' }}>*</span>
                    </label>
                    <select name="fitnessLevel" value={form.fitnessLevel} onChange={handleChange} required style={fieldStyle}>
                      <option value="">Select level…</option>
                      <option value="Complete beginner — never trained before">Beginner — Never trained</option>
                      <option value="Some experience — trained occasionally">Some Experience — Trains occasionally</option>
                      <option value="Intermediate — trains consistently 1-2 years">Intermediate — 1-2 years</option>
                      <option value="Advanced — trains consistently 3+ years">Advanced — 3+ years</option>
                      <option value="Athlete — competitive sports background">Athlete — Competitive background</option>
                    </select>
                  </div>

                  {/* Days per week */}
                  <div>
                    <label className="block tag mb-1.5">
                      Days Available Per Week <span style={{ color: 'var(--accent)' }}>*</span>
                    </label>
                    <select name="daysPerWeek" value={form.daysPerWeek} onChange={handleChange} required style={fieldStyle}>
                      <option value="">Select days…</option>
                      {['2', '3', '4', '5', '6'].map(d => (
                        <option key={d} value={d}>{d} days per week</option>
                      ))}
                    </select>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block tag mb-1.5">Age (optional)</label>
                    <input
                      type="number" name="age" value={form.age}
                      onChange={handleChange} placeholder="e.g. 28"
                      min="16" max="80" style={fieldStyle}
                    />
                  </div>

                  {/* Injuries */}
                  <div>
                    <label className="block tag mb-1.5">Injuries or Limitations (optional)</label>
                    <textarea
                      name="injuries" value={form.injuries}
                      onChange={handleChange} rows={2}
                      placeholder="e.g. Bad knees, lower back pain…"
                      style={{ ...fieldStyle, resize: 'none' }}
                    />
                  </div>

                  {error && (
                    <p className="text-xs p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.15)' }}>
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'inherit' }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--bg)', borderTopColor: 'transparent' }} />
                        Generating your plan…
                      </span>
                    ) : '✦ Generate My Training Plan'}
                  </button>

                  <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
                    Powered by Google Gemini AI · Takes 5-10 seconds
                  </p>
                </form>
              </div>

              {/* Book CTA */}
              <div className="mt-4 p-5 rounded-2xl" style={{ background: 'rgba(127,255,196,0.04)', border: '1px solid rgba(127,255,196,0.15)' }}>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Want a truly personalised plan?</p>
                <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>Book a 1-on-1 session with Alex for a plan tailored to your exact body and goals.</p>
                <Link href="/book" className="btn-primary text-xs" style={{ display: 'inline-flex' }}>
                  Book a Session →
                </Link>
              </div>
            </div>

            {/* Result */}
            <div id="plan-result">
              {!generated && !loading && (
                <div
                  className="h-full flex flex-col items-center justify-center gap-4 rounded-2xl p-8 text-center"
                  style={{ background: 'var(--bg-2)', border: '1px dashed var(--border-2)', minHeight: '400px' }}
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-3)', fontSize: '1.8rem' }}>
                    ✦
                  </div>
                  <div>
                    <p className="font-display text-xl mb-2" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>
                      Your plan will appear here
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      Fill in the form and click generate
                    </p>
                  </div>
                </div>
              )}

              {loading && (
                <div
                  className="h-full flex flex-col items-center justify-center gap-5 rounded-2xl p-8 text-center"
                  style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', minHeight: '400px' }}
                >
                  <div className="relative">
                    <div className="w-14 h-14 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
                    <div className="absolute inset-0 flex items-center justify-center text-xl">✦</div>
                  </div>
                  <div>
                    <p className="font-display text-xl mb-1" style={{ color: 'var(--text)' }}>Building your plan…</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>Alex is reviewing your profile</p>
                  </div>
                </div>
              )}

              {generated && plan && (
                <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                  {/* Plan header */}
                  <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(127,255,196,0.05)', borderBottom: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <span style={{ color: 'var(--accent)', fontSize: '1rem' }}>✦</span>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Your Personalised Plan</p>
                    </div>
                    <span className="tag tag-accent">AI Generated</span>
                  </div>

                  {/* Plan content */}
                  <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: '600px' }}>
                    {formatPlan(plan)}
                  </div>

                  {/* Bottom CTA */}
                  <div className="px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
                    <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
                      Ready to train with Alex in person or online?
                    </p>
                    <Link href="/book" className="btn-primary text-xs w-full" style={{ display: 'flex', justifyContent: 'center' }}>
                      Book a Session with Alex →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
