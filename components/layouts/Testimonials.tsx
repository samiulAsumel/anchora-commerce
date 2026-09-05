import { Container } from '@/components/ui/Container';

const testimonials = [
  {
    quote:
      'We moved our catalog over in an afternoon. The admin dashboard makes day-to-day inventory changes painless.',
    name: 'R. Alam',
    role: 'Owner, Driftwood Supply (demo store)',
  },
  {
    quote:
      'The order pipeline just makes sense — pending to fulfilled, with a clear audit trail on every change.',
    name: 'M. Tran',
    role: 'Operations, Fernbridge Goods (demo store)',
  },
  {
    quote: 'Clean REST API, sensible error codes, and the docs matched the code on the first try.',
    name: 'J. Okafor',
    role: 'Engineer, Cobalt & Co (demo store)',
  },
];

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.replace('.', '')[0])
    .join('');
}

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What demo merchants are saying</h2>
          <p className="mt-3 text-foreground/70">
            Illustrative feedback from the fictional storefronts used to demo Anchora.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-2xl border border-border bg-surface p-6">
              <blockquote className="text-sm text-foreground/80">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">
                  {initials(t.name)}
                </span>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-foreground/60">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
