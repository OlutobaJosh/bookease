'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase, Service } from '@/lib/supabase';

const TIME_SLOTS = [
  { value: '08:00', label: '8:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '18:00', label: '6:00 PM' },
];

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export default function BookPage() {
  const [services, setServices]   = useState<Service[]>([]);
  const [booked, setBooked]       = useState<string[]>([]);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState('');
  const [dateErr, setDateErr]     = useState('');

  const [form, setForm] = useState({
    service_id: '', booking_date: '', booking_time: '',
    client_name: '', client_email: '', client_phone: '', message: '',
  });

  useEffect(() => {
    supabase.from('services').select('*').order('price').then(({ data }) => {
      setServices(data ?? []);
      if (data?.[0]) setForm(f => ({ ...f, service_id: data[0].id }));
      setLoading(false);
    });
  }, []);

  const fetchBooked = useCallback(async (date: string) => {
    if (!date) { setBooked([]); return; }
    const { data } = await supabase.from('bookings').select('booking_time')
      .eq('booking_date', date).in('status', ['pending', 'confirmed']);
    setBooked(data?.map(b => b.booking_time) ?? []);
  }, []);

  useEffect(() => { if (form.booking_date) fetchBooked(form.booking_date); }, [form.booking_date, fetchBooked]);

  function handleDate(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    const day = new Date(v + 'T00:00:00').getDay();
    setDateErr(day === 0 ? 'Sundays unavailable — please choose another day.' : '');
    setForm(f => ({ ...f, booking_date: v, booking_time: '' }));
  }

  function set(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.booking_date || !form.booking_time || dateErr) { setError('Please complete all required steps.'); return; }
    setError(''); setSubmitting(true);
    const { error: err } = await supabase.from('bookings').insert({ ...form, status: 'pending' });
    setSubmitting(false);
    if (err) setError('Something went wrong. Please try again.');
    else setSuccess(true);
  }

  const sel = services.find(s => s.id === form.service_id);

  if (success) return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-6" style={{ paddingTop: '4rem', background: 'var(--bg)' }}>
        <div className="card p-12 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'var(--accent-d)', border: '1px solid var(--accent-b)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--accent)' }}>
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="font-display text-3xl mb-3" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>Booking Received</h2>
          <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>
            Thank you, <strong style={{ color: 'var(--text)' }}>{form.client_name}</strong>.
          </p>
          <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
            Your <strong style={{ color: 'var(--text)' }}>{sel?.name}</strong> request for{' '}
            <strong style={{ color: 'var(--text)' }}>{form.booking_date}</strong> at{' '}
            <strong style={{ color: 'var(--text)' }}>{TIME_SLOTS.find(t => t.value === form.booking_time)?.label}</strong> is pending. Alex will confirm by email.
          </p>
          <Link href="/" className="btn-primary w-full justify-center">Back to Home →</Link>
        </div>
      </main>
      <Footer />
    </>
  );

  const stepNum = (n: number, done: boolean) => (
    <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-semibold flex-shrink-0"
      style={{
        background: done ? 'var(--accent-d)' : 'var(--bg-4)',
        color: done ? 'var(--accent)' : 'var(--muted)',
        border: done ? '1px solid var(--accent-b)' : '1px solid var(--border)',
      }}>
      {done ? '✓' : n}
    </span>
  );

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '4rem', background: 'var(--bg)', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-5xl mx-auto px-6 py-14">
            <p className="tag mb-3">Schedule</p>
            <h1 className="font-display" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>
              Book a Session
            </h1>
            <p className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>
              Pick a service, choose a date and time, then fill in your details. Alex confirms within 24 hours.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left 2 cols */}
              <div className="lg:col-span-2 space-y-5">

                {/* Step 1 */}
                <div className="card p-6">
                  <div className="flex items-center gap-3 mb-5">
                    {stepNum(1, !!form.service_id)}
                    <h2 className="font-display text-lg" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>Choose a Service</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.map(s => {
                      const active = form.service_id === s.id;
                      return (
                        <label key={s.id} className="flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all"
                          style={{
                            background: active ? 'var(--accent-d)' : 'var(--bg-4)',
                            border: active ? '1px solid var(--accent-b)' : '1px solid var(--border)',
                          }}>
                          <input type="radio" name="service_id" value={s.id} checked={active} onChange={set} className="sr-only" />
                          <div>
                            <p className="text-sm font-medium" style={{ color: active ? 'var(--accent)' : 'var(--text)' }}>{s.name}</p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{s.duration_minutes} min</p>
                          </div>
                          <span className="font-display text-base" style={{ color: active ? 'var(--accent)' : 'var(--muted)' }}>${s.price}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2 */}
                <div className="card p-6">
                  <div className="flex items-center gap-3 mb-5">
                    {stepNum(2, !!form.booking_date && !dateErr)}
                    <h2 className="font-display text-lg" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>Pick a Date</h2>
                  </div>
                  <input type="date" name="booking_date" value={form.booking_date}
                    onChange={handleDate} min={today()} required
                    className="field" style={{ borderColor: dateErr ? '#ef4444' : undefined }} />
                  {dateErr
                    ? <p className="mt-2 text-xs" style={{ color: '#f87171' }}>⚠ {dateErr}</p>
                    : <p className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>Mon – Sat only · Sundays unavailable</p>
                  }
                </div>

                {/* Step 3 */}
                <div className="card p-6">
                  <div className="flex items-center gap-3 mb-5">
                    {stepNum(3, !!form.booking_time)}
                    <h2 className="font-display text-lg" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>Select a Time</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {TIME_SLOTS.map(slot => {
                      const taken = booked.includes(slot.value);
                      const active = form.booking_time === slot.value;
                      return (
                        <button key={slot.value} type="button"
                          disabled={taken || !!dateErr || !form.booking_date}
                          onClick={() => !taken && setForm(f => ({ ...f, booking_time: slot.value }))}
                          className="py-3 rounded-lg text-sm font-medium transition-all"
                          style={{
                            background: active ? 'var(--text)' : taken ? 'var(--bg-4)' : 'var(--bg-4)',
                            color: active ? 'var(--bg)' : taken ? 'var(--muted-2)' : 'var(--text)',
                            border: active ? '1px solid var(--text)' : '1px solid var(--border)',
                            textDecoration: taken ? 'line-through' : 'none',
                            opacity: (!form.booking_date || taken) ? 0.4 : 1,
                            cursor: taken || !form.booking_date ? 'not-allowed' : 'pointer',
                          }}>
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                  {!form.booking_date && <p className="mt-3 text-xs" style={{ color: 'var(--muted)' }}>Select a date first</p>}
                </div>
              </div>

              {/* Right col */}
              <div className="space-y-5">
                <div className="card p-6">
                  <div className="flex items-center gap-3 mb-5">
                    {stepNum(4, !!(form.client_name && form.client_email))}
                    <h2 className="font-display text-lg" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>Your Details</h2>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'client_name',  label: 'Full Name',  type: 'text',  ph: 'Jane Smith',        req: true },
                      { name: 'client_email', label: 'Email',      type: 'email', ph: 'jane@email.com',    req: true },
                      { name: 'client_phone', label: 'Phone',      type: 'tel',   ph: '+1 (555) 000-0000', req: false },
                    ].map(f => (
                      <div key={f.name}>
                        <label className="block tag mb-1.5">
                          {f.label}{f.req && <span style={{ color: 'var(--accent)' }}> *</span>}
                        </label>
                        <input type={f.type} name={f.name}
                          value={(form as Record<string,string>)[f.name]}
                          onChange={set} placeholder={f.ph} required={f.req}
                          className="field" />
                      </div>
                    ))}
                    <div>
                      <label className="block tag mb-1.5">Message / Goals</label>
                      <textarea name="message" value={form.message} onChange={set}
                        placeholder="Tell Alex about your goals or any injuries…"
                        rows={3} className="field" style={{ resize: 'none' }} />
                    </div>
                  </div>
                </div>

                {/* Summary */}
                {(sel || form.booking_date || form.booking_time) && (
                  <div className="card p-4" style={{ borderColor: 'rgba(127,255,196,0.15)', background: 'rgba(127,255,196,0.03)' }}>
                    <p className="tag tag-accent mb-2">Booking Summary</p>
                    {sel && <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{sel.name}</p>}
                    {form.booking_date && <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{form.booking_date}</p>}
                    {form.booking_time && <p className="text-xs" style={{ color: 'var(--muted)' }}>{TIME_SLOTS.find(t => t.value === form.booking_time)?.label}</p>}
                    {sel && <p className="font-display text-xl mt-2" style={{ color: 'var(--text)' }}>${sel.price}</p>}
                  </div>
                )}

                {error && (
                  <p className="text-xs p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.15)' }}>
                    {error}
                  </p>
                )}

                <button type="submit" className="btn-primary w-full justify-center"
                  disabled={submitting || !form.booking_time || !!dateErr}>
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--bg)', borderTopColor: 'transparent' }} />
                      Submitting…
                    </span>
                  ) : 'Request Booking →'}
                </button>
                <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>No payment taken now. Alex confirms by email.</p>
              </div>
            </div>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}
