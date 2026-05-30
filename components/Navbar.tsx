'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isBook = pathname === '/book';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(12,12,12,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-8 h-8 flex items-center justify-center font-display text-sm"
            style={{ background: 'var(--lime)', color: 'var(--dark)', borderRadius: '4px' }}
          >
            BE
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="font-display text-lg tracking-widest" style={{ color: 'var(--text-dk)' }}>BOOKEASE</span>
            <span style={{ color: 'var(--muted)', fontSize: '0.65rem' }}>×</span>
            <span className="label" style={{ color: 'var(--muted)' }}>Alex Carter</span>
          </div>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: '/#services', label: 'Services' },
            { href: '/#about', label: 'About' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="label transition-colors hover:text-white"
              style={{ color: 'var(--muted)' }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="font-display text-sm px-5 py-2 rounded transition-all duration-200 hover:opacity-90"
            style={{
              background: isBook ? 'var(--lime)' : 'transparent',
              color: isBook ? 'var(--dark)' : 'var(--lime)',
              border: '1px solid var(--lime)',
              letterSpacing: '0.08em',
            }}
          >
            BOOK NOW
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8"
          aria-label="Menu"
        >
          <span className={`block h-px transition-all duration-200 ${open ? 'rotate-45 translate-y-[7px]' : ''}`} style={{ background: 'var(--lime)', width: '100%' }} />
          <span className={`block h-px transition-all duration-200 ${open ? 'opacity-0' : ''}`} style={{ background: 'var(--lime)', width: '70%' }} />
          <span className={`block h-px transition-all duration-200 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} style={{ background: 'var(--lime)', width: '100%' }} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden px-6 pb-6 space-y-4" style={{ background: 'rgba(12,12,12,0.98)', borderBottom: '1px solid var(--border-dk)' }}>
          {[
            { href: '/#services', label: 'Services' },
            { href: '/#about', label: 'About' },
            { href: '/book', label: 'Book Now' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block label py-2 transition-colors hover:text-white"
              style={{ color: 'var(--muted)' }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
