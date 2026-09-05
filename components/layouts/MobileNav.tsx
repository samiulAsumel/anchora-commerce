'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

const navLinks = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function MobileNav({ loggedIn }: { loggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <div id="mobile-nav" className="border-t border-border md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2.5 text-base font-medium text-foreground/80 hover:bg-surface hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 px-3">
              {loggedIn ? (
                <Button href="/admin" variant="accent" onClick={() => setOpen(false)}>
                  Go to dashboard
                </Button>
              ) : (
                <>
                  <Button href="/login" variant="outline" onClick={() => setOpen(false)}>
                    Log in
                  </Button>
                  <Button href="/register" variant="accent" onClick={() => setOpen(false)}>
                    Start free trial
                  </Button>
                </>
              )}
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
