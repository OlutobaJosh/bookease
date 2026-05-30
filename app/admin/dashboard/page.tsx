'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Booking } from '@/lib/supabase';

type B = Booking & { services: { name: string } | null };
type Status = 'pending' | 'confirmed' | 'cancelled' | 'completed';

const STATUS_CFG: Record<Status, { bg: string; color: string; dot: string }> = {
  pending:   { bg: 'rgba(250,204,21,0.08)',  color: '#facc15', dot: '#facc15' },
  confirmed: { bg: 'rgba(127,255,196,0.08)', color: '#7fffc4', dot: '#7fffc4' },
  cancelled: { bg: 'rgba(248,113,113,0.08)', color: '#f87171', dot: '#f87171' },
  completed: { bg: 'rgba(165,180,252,0.08)', color: '#a5b4fc', dot: '#a5b4fc' },
};

function Badge({ status }: { status: Status }) {
  const c = STATUS_CFG[status] ?? STATUS_CFG.pending;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      {status}
    </span>
  );
}

function weekRange() {
  const now = new Date(), dow = now.getDay();
  const mon = new Date(now); mon.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1));
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
  const f = (d: Date) => d.toISOString().split('T')[0];
  return { s: f(mon), e: f(sun) };
}

export default function Dashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<B[]>([]);
  const [loading, setLoading] = useState(true);
  const [updId, setUpdId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | Status>('all');

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/bookings');
    if (res.status === 401) { router.push('/admin/login'); return; }
    const d = await res.json();
    setBookings(d.bookings ?? []);
    setLoading(false);
  }, [router]);

  useEffect(() => { load(); }, [load]);

  async function upd(id: string, status: Status) {
    setUpdId(id);
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setUpdId(null); load();
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  const { s: ws, e: we } = weekRange();
  const stats = [
    { label: 'Total Bookings',       val: bookings.length,                                                            color: 'var(--text)' },
    { label: 'Pending Review',        val: bookings.filter(b => b.status === 'pending').length,                       color: '#facc15' },
    { label: 'Confirmed This Week',   val: bookings.filter(b => b.status === 'confirmed' && b.booking_date >= ws && b.booking_date <= we).length, color: 'var(--accent)' },
    { label: 'Completed Sessions',    val: bookings.filter(b => b.status === 'completed').length,                     color: '#a5b4fc' },
  ];

  const rows = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Topbar */}
      <header style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-base tracking-wider" style={{ color: 'var(--text)' }}>BOOKEASE</span>
            <span className="tag">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs transition-colors hover:text-white" style={{ color: 'var(--muted)' }}>← View site</Link>
            <button onClick={logout} className="btn-ghost text-xs px-3 py-1.5">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="card p-5">
              <p className="font-display text-4xl" style={{ color: s.color, lineHeight: 1 }}>{loading ? '—' : s.val}</p>
              <p className="text-sm mt-2 font-medium" style={{ color: 'var(--text)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card overflow-hidden" style={{ borderRadius: '12px' }}>
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="font-display text-xl" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>All Bookings</h2>
            <div className="flex flex-wrap gap-2">
              {(['all', 'pending', 'confirmed', 'cancelled', 'completed'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="capitalize text-xs px-3 py-1.5 rounded-lg transition-all font-medium"
                  style={{
                    background: filter === f ? 'var(--text)' : 'var(--bg-4)',
                    color: filter === f ? 'var(--bg)' : 'var(--muted)',
                    border: '1px solid var(--border)',
                  }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
            </div>
          ) : rows.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-display text-3xl mb-2" style={{ color: 'var(--bg-5)', letterSpacing: '-0.01em' }}>No bookings found</p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{filter !== 'all' ? `No ${filter} bookings.` : 'No bookings yet.'}</p>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Client', 'Service', 'Date', 'Time', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left tag">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((b, i) => (
                      <tr key={b.id} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{b.client_name}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{b.client_email}</p>
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: 'var(--text)' }}>{b.services?.name ?? '—'}</td>
                        <td className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--text)' }}>{b.booking_date}</td>
                        <td className="px-6 py-4 text-sm" style={{ color: 'var(--muted)' }}>{b.booking_time}</td>
                        <td className="px-6 py-4"><Badge status={b.status as Status} /></td>
                        <td className="px-6 py-4"><Actions b={b} upd={updId === b.id} onUpd={upd} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="lg:hidden divide-y" style={{ borderColor: 'var(--border)' }}>
                {rows.map(b => (
                  <div key={b.id} className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{b.client_name}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{b.client_email}</p>
                      </div>
                      <Badge status={b.status as Status} />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[['Service', b.services?.name ?? '—'], ['Date', b.booking_date], ['Time', b.booking_time]].map(([l, v]) => (
                        <div key={l}>
                          <p className="tag mb-0.5">{l}</p>
                          <p className="text-xs" style={{ color: 'var(--text)' }}>{v}</p>
                        </div>
                      ))}
                    </div>
                    <Actions b={b} upd={updId === b.id} onUpd={upd} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function Actions({ b, upd, onUpd }: { b: B; upd: boolean; onUpd: (id: string, s: Status) => void }) {
  const s = b.status as Status;
  const btns = [
    { label: 'Confirm',  to: 'confirmed' as Status, show: s === 'pending',                      c: 'var(--accent)',  tc: 'var(--bg)' },
    { label: 'Complete', to: 'completed' as Status, show: s === 'confirmed',                    c: '#a5b4fc',        tc: 'var(--bg)' },
    { label: 'Cancel',   to: 'cancelled' as Status, show: s === 'pending' || s === 'confirmed', c: 'transparent',   tc: '#f87171'   },
    { label: 'Restore',  to: 'pending'   as Status, show: s === 'cancelled',                    c: 'transparent',   tc: '#facc15'   },
  ].filter(a => a.show);

  if (!btns.length) return <span className="tag" style={{ color: 'var(--bg-5)' }}>—</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {btns.map(a => (
        <button key={a.to} onClick={() => onUpd(b.id, a.to)} disabled={upd}
          className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-80 disabled:opacity-30"
          style={{ background: a.c, color: a.tc, border: a.c === 'transparent' ? `1px solid ${a.tc}44` : 'none' }}>
          {upd ? '…' : a.label}
        </button>
      ))}
    </div>
  );
}
