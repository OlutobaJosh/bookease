'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true);
    const res = await fetch('/api/admin/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) router.push('/admin/dashboard');
    else { const d = await res.json(); setError(d.error ?? 'Invalid credentials.'); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 50% 40% at 50% 40%, rgba(127,255,196,0.04), transparent)',
      }} />
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-display text-xl tracking-wider" style={{ color: 'var(--text)' }}>BOOKEASE</span>
          <p className="tag mt-1">Admin Portal</p>
        </div>
        <div className="card p-8">
          <h1 className="font-display text-2xl mb-1" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>Sign In</h1>
          <p className="text-xs mb-6" style={{ color: 'var(--muted)' }}>Access the bookings dashboard</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block tag mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@bookease.com" required className="field" />
            </div>
            <div>
              <label className="block tag mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required className="field" />
            </div>
            {error && (
              <p className="text-xs p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.15)' }}>
                {error}
              </p>
            )}
            <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--bg)', borderTopColor: 'transparent' }} />
                  Signing in…
                </span>
              ) : 'Sign In →'}
            </button>
          </form>
        </div>
        <p className="text-center text-xs mt-5" style={{ color: 'var(--bg-5)' }}>Authorised personnel only</p>
      </div>
    </div>
  );
}
