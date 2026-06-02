import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase, Service } from '@/lib/supabase';

async function getServices(): Promise<Service[]> {
  const { data } = await supabase.from('services').select('*').order('price', { ascending: true });
  return data ?? [];
}

const SERVICE_ICONS = ['◈', '◉', '◎', '◐', '◑', '◒'];

export default async function HomePage() {
  const services = await getServices();

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex flex-col justify-center"
        style={{ background: 'var(--bg)', paddingTop: '4rem', overflow: 'hidden' }}
      >
        {/* Subtle radial */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 90% 60% at 50% 30%, rgba(127,255,196,0.04) 0%, transparent 65%)',
        }} />

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        <div className="relative max-w-6xl mx-auto px-6 w-full py-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">

            {/* Left — copy */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2 mb-8 anim">
                <div className="dot-pulse" />
                <span className="tag tag-accent">Now Accepting New Clients</span>
              </div>

              <h1
                className="font-display anim d1"
                style={{
                  fontSize: 'clamp(3.2rem, 7vw, 7rem)',
                  lineHeight: 1.0,
                  color: 'var(--text)',
                  letterSpacing: '-0.02em',
                }}
              >
                Creating Athletic
                <br />
                <span style={{ color: 'var(--accent)' }}>Masterpieces</span>
              </h1>

              <p className="mt-6 anim d2 max-w-lg" style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                Alex Carter builds bodies, elevates performance, and delivers intelligent training solutions that drive real results.
              </p>

              <div className="flex flex-wrap gap-3 mt-10 anim d3">
                <Link href="/book" className="btn-primary">Book a Session →</Link>
                <Link href="/#services" className="btn-ghost">View Services</Link>
              </div>

              <div
                className="mt-16 anim d4 grid grid-cols-3 max-w-lg gap-0"
                style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}
              >
                {[
                  { val: '8+',   label: 'Years Training' },
                  { val: '300+', label: 'Clients Trained' },
                  { val: '95%',  label: 'Goal Achievement' },
                ].map((s, i) => (
                  <div key={s.label} style={{ borderRight: i < 2 ? '1px solid var(--border)' : 'none', paddingRight: '1.5rem', paddingLeft: i > 0 ? '1.5rem' : 0 }}>
                    <p className="font-display" style={{ fontSize: '1.8rem', color: 'var(--text)', lineHeight: 1 }}>{s.val}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — real photo */}
            <div className="hidden lg:block relative lg:col-span-2">
              <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '4/5' }}>
                <img
                  src="https://cxmhvxubhkkvqxilrtxo.supabase.co/storage/v1/object/public/Images/alex-hero.png?v=2"
                  alt="Alex Carter — Personal Trainer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                />
                {/* Subtle overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.6), transparent)' }} />
                {/* Name badge */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl" style={{ background: 'rgba(8,8,8,0.75)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)' }}>
                  <p className="font-display text-lg" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>Alex Carter</p>
                  <p className="tag tag-accent mt-0.5">Head Coach · NASM-CPT · CSCS</p>
                </div>
              </div>
              {/* Decorative accent line */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl pointer-events-none" style={{ border: '1px solid rgba(127,255,196,0.15)' }} />
            </div>

          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, var(--bg))' }} />
      </section>

      {/* ── SERVICES ── */}
      <section id="services" style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <p className="tag mb-3">Our Services</p>
              <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                What We Offer
              </h2>
            </div>
            <p className="text-sm max-w-xs" style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
              We craft training experiences from assessment to achievement, blending strategy, science, and dedication.
            </p>
          </div>

          {/* Cards grid — Arkitek style */}
          {services.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="font-display text-2xl" style={{ color: 'var(--muted)', letterSpacing: '-0.01em' }}>Services Coming Soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((s, i) => (
                <Link href="/book" key={s.id}>
                  <div
                    className="card group flex flex-col gap-5 p-6 h-full"
                    style={{ minHeight: '220px', cursor: 'pointer' }}
                  >
                    {/* Visual area */}
                    <div
                      className="flex items-center justify-center rounded-lg"
                      style={{
                        height: '90px',
                        background: 'var(--bg-4)',
                        border: '1px solid var(--border)',
                        fontSize: '2rem',
                        color: 'var(--accent)',
                        transition: 'background 0.25s',
                      }}
                    >
                      {SERVICE_ICONS[i % SERVICE_ICONS.length]}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-1 flex-1">
                      <p className="tag" style={{ color: 'var(--muted)' }}>{s.duration_minutes} min</p>
                      <h3
                        className="font-display text-lg"
                        style={{ color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1.2 }}
                      >
                        {s.name}
                      </h3>
                      <p className="text-xs leading-relaxed mt-1" style={{ color: 'var(--muted)' }}>
                        {s.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                      <span className="font-display text-lg" style={{ color: 'var(--text)' }}>${s.price}</span>
                      <span
                        className="text-xs transition-all duration-200 group-hover:gap-2"
                        style={{ color: 'var(--muted)' }}
                      >
                        Book →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="tag mb-4">About Us</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left */}
            <div>
              <h2
                className="font-display mb-6"
                style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.05 }}
              >
                Arkitek helps driven brands — Alex helps driven athletes.
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>
                With over 8 years of experience in personal training and sports science, Alex Carter has helped hundreds of clients achieve real, lasting results — not quick fixes.
              </p>
              <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--muted)' }}>
                Holding certifications from NASM, NSCA, and Precision Nutrition, Alex brings an evidence-based approach to every programme. Sessions available in-person and online.
              </p>

              <ul className="space-y-3 mb-8">
                {['Personalised programming', 'Nutrition coaching included', 'Monthly progress reviews', 'Direct messaging support'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text)' }}>
                    <span style={{ color: 'var(--accent)', fontSize: '0.6rem' }}>◆</span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Cert pills */}
              <div className="flex flex-wrap gap-2">
                {['NASM-CPT', 'CSCS', 'PN Level 1'].map(c => (
                  <span key={c} className="text-xs px-3 py-1.5 rounded-full" style={{ background: 'var(--bg-3)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — photo + stats */}
            <div className="flex flex-col gap-4">
              {/* Real photo */}
              <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
                <img
                  src="https://cxmhvxubhkkvqxilrtxo.supabase.co/storage/v1/object/public/Images/alex-about.png"
                  alt="Alex Carter"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { val: '8+',  label: 'Years' },
                  { val: '300+', label: 'Clients' },
                  { val: '95%', label: 'Goals Met' },
                ].map(s => (
                  <div key={s.label} className="card p-4 text-center">
                    <p className="font-display text-2xl" style={{ color: 'var(--text)' }}>{s.val}</p>
                    <p className="tag mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Quote card */}
              <div className="card p-5" style={{ borderColor: 'rgba(127,255,196,0.15)', background: 'rgba(127,255,196,0.04)' }}>
                <p className="font-display text-lg" style={{ color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1.35 }}>
                  "Results don't lie. Neither do I."
                </p>
                <p className="tag tag-accent mt-2">— Alex Carter</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <p className="tag mb-4">Get Started</p>
          <h2
            className="font-display mx-auto mb-4"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.05, maxWidth: '700px' }}
          >
            Ready to start your journey?
          </h2>
          <p className="text-sm mb-10 mx-auto" style={{ color: 'var(--muted)', maxWidth: '400px' }}>
            Slots are limited. Book your first session today and start building towards your goals.
          </p>
          <Link href="/book" className="btn-primary text-sm mx-auto">
            Book a Session →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
