import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function CtaSection() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-navy px-8 py-16 text-center text-white sm:px-16">
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Ready to see it running end to end?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Create a demo account, add a product, and place a test order — the whole flow runs against a
            real Postgres database.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/register" variant="accent" size="lg">
              Create a free account
            </Button>
            <Button href="/store/demo-store" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              Browse the demo store
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
