import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About',
  description: 'Why Anchora Commerce exists and how it was built.',
};

export default function AboutPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About Anchora Commerce</h1>

        <p className="mt-6 text-lg text-foreground/70">
          Anchora Commerce is a full-stack portfolio project built by Samiul, a developer whose background
          is in port and maritime operations — vessel management, cargo billing, wharfage — before moving
          into full-stack and DevOps work.
        </p>

        <p className="mt-4 text-foreground/70">
          The goal here was to build one system end to end: a marketing site, a real Postgres-backed
          storefront and cart, an admin dashboard with authenticated, role-gated access, and the REST API
          underneath all of it — then ship it with Docker and CI, the way a small production service
          actually gets shipped.
        </p>

        <p className="mt-4 text-foreground/70">
          It&apos;s a demo, not a live business — the &ldquo;stores&rdquo; and testimonials on this site are
          fictional. Every account, product, and order you create while trying it out is real data in a
          real database, though; nothing here is faked at the data layer.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/store/demo-store" variant="outline">
            Browse the demo store
          </Button>
          <Button href="/contact" variant="ghost">
            Get in touch
          </Button>
        </div>
      </Container>
    </section>
  );
}
