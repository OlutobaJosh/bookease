import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: 'var(--dark)', borderTop: '1px solid var(--border-dk)' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand — takes 5 cols */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 flex items-center justify-center font-display text-sm" style={{ background: 'var(--lime)', color: 'var(--dark)', borderRadius: '4px' }}>BE</div>
              <span className="font-display text-xl tracking-widest">BOOKEASE</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--muted)' }}>
              Elite personal training with Alex Carter. Science-backed programming, real accountability, measurable results.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <p className="label mb-4" style={{ color: 'var(--muted)' }}>Navigation</p>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Home' },
                { href: '/#services', label: 'Services' },
                { href: '/#about', label: 'About' },
                { href: '/book', label: 'Book a Session' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm transition-colors hover:text-white" style={{ color: 'var(--muted)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <p className="label mb-4" style={{ color: 'var(--muted)' }}>Contact</p>
            <ul className="space-y-2.5 text-sm" style={{ color: 'var(--muted)' }}>
              <li>alex@bookease.fit</li>
              <li>Mon – Sat · 8 AM – 6 PM</li>
              <li>Downtown Fitness Studio</li>
            </ul>
            <Link
              href="/book"
              className="inline-block mt-6 font-display text-sm px-5 py-2 rounded transition-all hover:opacity-90"
              style={{ background: 'var(--lime)', color: 'var(--dark)', letterSpacing: '0.08em' }}
            >
              BOOK A SESSION →
            </Link>
          </div>
        </div>

        <div className="divider mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            © {year} BookEase · Alex Carter Fitness. All rights reserved.
          </p>
          <Link href="/admin/login" className="text-xs transition-colors hover:text-white" style={{ color: 'var(--dark-4)' }}>
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
