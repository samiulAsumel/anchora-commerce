import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

interface FeatureSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  visual: ReactNode;
  reverse?: boolean;
}

export function FeatureSection({ eyebrow, title, description, bullets, visual, reverse }: FeatureSectionProps) {
  return (
    <section className="py-16 sm:py-24">
      <Container
        className={cn('grid items-center gap-12 lg:grid-cols-2', reverse && 'lg:[&>*:first-child]:order-2')}
      >
        <div>
          <p className="text-sm font-semibold tracking-wide text-orange uppercase">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-foreground/70">{description}</p>
          <ul className="mt-6 space-y-3">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3 text-foreground/80">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="mt-0.5 shrink-0 text-navy dark:text-navy-light"
                  aria-hidden="true"
                >
                  <circle cx="10" cy="10" r="10" className="fill-current opacity-10" />
                  <path
                    d="M6 10.5 8.5 13 14 7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {bullet}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-2 shadow-sm">{visual}</div>
      </Container>
    </section>
  );
}
