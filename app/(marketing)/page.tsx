import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { LogoStrip } from '@/components/layouts/LogoStrip';
import { FeatureSection } from '@/components/layouts/FeatureSection';
import { StatBand } from '@/components/layouts/StatBand';
import { Testimonials } from '@/components/layouts/Testimonials';
import { CtaSection } from '@/components/layouts/CtaSection';
import { DashboardPreview } from '@/components/layouts/visuals/DashboardPreview';
import { StorefrontPreview } from '@/components/layouts/visuals/StorefrontPreview';
import { ApiPreview } from '@/components/layouts/visuals/ApiPreview';

export default function HomePage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <Container className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-wide text-orange uppercase">Anchora Commerce</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            Everything you need to sell online
          </h1>
          <p className="mt-6 text-lg text-foreground/70 sm:text-xl">
            Build a storefront, manage products and orders, and run the whole thing from one dashboard —
            an open-source commerce platform built to be read, run, and extended.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/register" variant="accent" size="lg">
              Start free trial
            </Button>
            <Button href="/pricing" variant="outline" size="lg">
              See pricing
            </Button>
          </div>
        </Container>
      </section>

      <LogoStrip />

      <FeatureSection
        eyebrow="Storefront"
        title="A storefront that converts, out of the box"
        description="Product grids with filtering and sort, fast product pages, and a cart that persists across sessions."
        bullets={[
          'Server-rendered product catalog with pagination',
          'Cart backed by Postgres, not just a cookie',
          'Checkout that writes a real, auditable order',
        ]}
        visual={<StorefrontPreview />}
      />

      <FeatureSection
        eyebrow="Admin dashboard"
        title="Run the business from one place"
        description="Track revenue and orders at a glance, manage inventory, and move orders through their lifecycle."
        bullets={[
          'KPI dashboard with real-time-feeling charts',
          'Product CRUD with validated forms',
          'Order status transitions with a clear audit trail',
        ]}
        visual={<DashboardPreview />}
        reverse
      />

      <FeatureSection
        eyebrow="Built for developers"
        title="A clean REST API underneath"
        description="Every feature in the dashboard is backed by a documented, versioned API you can call directly."
        bullets={[
          'Consistent success/error envelope on every response',
          'Zod validation at every boundary',
          'JWT auth with rotating refresh tokens',
        ]}
        visual={<ApiPreview />}
      />

      <StatBand />
      <Testimonials />
      <CtaSection />
    </>
  );
}
