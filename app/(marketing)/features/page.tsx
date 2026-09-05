import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { FeatureSection } from '@/components/layouts/FeatureSection';
import { CtaSection } from '@/components/layouts/CtaSection';
import { DashboardPreview } from '@/components/layouts/visuals/DashboardPreview';
import { StorefrontPreview } from '@/components/layouts/visuals/StorefrontPreview';
import { ApiPreview } from '@/components/layouts/visuals/ApiPreview';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Storefront, admin dashboard, and API — everything a small commerce team needs.',
};

export default function FeaturesPage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <Container className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Built for the whole workflow</h1>
          <p className="mt-4 text-lg text-foreground/70">
            From the storefront a customer sees to the API your team can build on — one consistent system.
          </p>
        </Container>
      </section>

      <FeatureSection
        eyebrow="Storefront"
        title="Fast pages, sensible defaults"
        description="Product listing with filter, sort, and pagination; a product page built for conversion; a cart that survives a refresh."
        bullets={[
          'Server Components by default — fast first paint',
          'Cart persisted server-side, keyed by a signed cookie',
          'Mobile-first, accessible markup throughout',
        ]}
        visual={<StorefrontPreview />}
      />

      <FeatureSection
        eyebrow="Admin dashboard"
        title="Everything an owner checks daily"
        description="Revenue and order KPIs on load, product management with validated forms, and an order pipeline with clear status transitions."
        bullets={[
          'Product CRUD backed by the same API partners can call',
          'Order lifecycle: pending → paid → fulfilled → cancelled',
          'Role-gated: only owners and admins can reach it',
        ]}
        visual={<DashboardPreview />}
        reverse
      />

      <FeatureSection
        eyebrow="API & security"
        title="A backend you can actually read"
        description="Controller → service → repository, zod validation at every boundary, and auth that rotates refresh tokens on use."
        bullets={[
          'bcrypt-hashed passwords, JWT access + rotating refresh tokens',
          'Rate limiting on auth endpoints',
          'Consistent { success, data, message } / { success, error } envelope',
        ]}
        visual={<ApiPreview />}
      />

      <CtaSection />
    </>
  );
}
