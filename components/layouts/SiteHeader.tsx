import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { MobileNav } from '@/components/layouts/MobileNav';
import { LogoutButton } from '@/components/layouts/LogoutButton';
import { getSession } from '@/lib/session';

const navLinks = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export async function SiteHeader() {
  const session = await getSession();
  const canAccessAdmin = session?.role === 'ADMIN' || session?.role === 'OWNER';

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden md:flex md:items-center md:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <>
              {canAccessAdmin && (
                <Button href="/admin" variant="ghost" size="sm">
                  Dashboard
                </Button>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm">
                Log in
              </Button>
              <Button href="/register" variant="accent" size="sm">
                Start free trial
              </Button>
            </>
          )}
        </div>

        <MobileNav loggedIn={Boolean(session)} />
      </Container>
    </header>
  );
}
