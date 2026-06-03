'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(8,8,8,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className="font-display text-sm px-2 py-1 rounded"
            style={{ border: '1px solid var(--border-h)', color: 'var(--text)', letterSpacing: '0.12em' }}
          >
            BOOKEASE
          </span>
        </Link>

        {/* Center links — desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: '/#services',    label: 'Services'      },
            { href: '/#about',       label: 'About'         },
            { href: '/training-plan', label: 'Training Plan' },
          ].map(l => (
            <Link
              key={l.href} href={l.href}
              className="text-sm transition-colors hover:text-white"
              style={{ color: 'var(--muted)' }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA — desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/book" className="btn-primary text-xs">
            Book Now →
          </Link>
        </div>

        {/* Hamburger — mobile */}
        <button onClick={() => setOpen(!open)} className="md:hidden flex flex-col gap-1.5 w-7 h-7 justify-center" aria-label="Menu">
          <span className={`block h-px transition-all ${open ? 'rotate-45 translate-y-[5px]' : ''}`} style={{ background: 'var(--text)' }} />
          <span className={`block h-px transition-all ${open ? 'opacity-0' : ''}`} style={{ background: 'var(--text)', width: '70%' }} />
          <span className={`block h-px transition-all ${open ? '-rotate-45 -translate-y-[5px]' : ''}`} style={{ background: 'var(--text)' }} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-5"
          style={{ background: 'rgba(8,8,8,0.98)', borderBottom: '1px solid var(--border)' }}
        >
          {[
            { href: '/#services',    label: 'Services'      },
            { href: '/#about',       label: 'About'         },
            { href: '/training-plan', label: 'Training Plan' },
            { href: '/book',          label: 'Book Now'      },
          ].map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="text-sm transition-colors hover:text-white"
              style={{ color: 'var(--muted)' }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
