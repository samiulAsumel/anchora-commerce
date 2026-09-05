import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for stores of every size.',
};

const tiers = [
  {
    name: 'Starter',
    price: '$0',
    cadence: '/month',
    description: 'For trying Anchora out with a single demo store.',
    cta: 'Start free',
    features: ['1 store', 'Up to 50 products', 'Community support', 'Anchora branding on checkout'],
  },
  {
    name: 'Growth',
    price: '$39',
    cadence: '/month',
    description: 'For a store that is actively taking orders.',
    cta: 'Start free trial',
    highlighted: true,
    features: [
      '1 store',
      'Unlimited products',
      'Order + inventory management',
      'Remove Anchora branding',
      'Email support',
    ],
  },
  {
    name: 'Scale',
    price: '$129',
    cadence: '/month',
    description: 'For teams running multiple storefronts.',
    cta: 'Talk to us',
    features: ['Up to 5 stores', 'Role-based admin access', 'API access', 'Priority support'],
  },
];

const comparisonRows = [
  { label: 'Storefront + cart + checkout', starter: true, growth: true, scale: true },
  { label: 'Admin product & order management', starter: true, growth: true, scale: true },
  { label: 'Unlimited products', starter: false, growth: true, scale: true },
  { label: 'Remove Anchora branding', starter: false, growth: true, scale: true },
  { label: 'Multiple stores', starter: false, growth: false, scale: true },
  { label: 'Role-based admin access', starter: false, growth: false, scale: true },
];

function Check({ included }: { included: boolean }) {
  return (
    <span className={cn('mx-auto flex h-5 w-5 items-center justify-center', !included && 'opacity-20')}>
      {included ? (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M4 9.5 7 12.5 14 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M5 5l8 8M13 5l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

export default function PricingPage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Simple, transparent pricing</h1>
            <p className="mt-4 text-lg text-foreground/70">
              Start free, upgrade when you outgrow it. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-8 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  'flex flex-col rounded-2xl border p-8',
                  tier.highlighted ? 'border-navy shadow-lg shadow-navy/10 lg:-translate-y-2' : 'border-border',
                )}
              >
                {tier.highlighted && (
                  <span className="mb-4 inline-flex w-fit items-center rounded-full bg-orange/10 px-3 py-1 text-xs font-semibold text-orange">
                    Most popular
                  </span>
                )}
                <h2 className="text-lg font-semibold">{tier.name}</h2>
                <p className="mt-1 text-sm text-foreground/60">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-sm text-foreground/60">{tier.cadence}</span>
                </p>
                <Button
                  href="/register"
                  variant={tier.highlighted ? 'accent' : 'outline'}
                  className="mt-6 w-full"
                >
                  {tier.cta}
                </Button>
                <ul className="mt-8 space-y-3 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check included />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-16 sm:py-24">
        <Container>
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Compare plans</h2>
          <div className="mx-auto mt-10 max-w-4xl overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 text-left font-medium text-foreground/60">Feature</th>
                  <th className="py-3 text-center font-medium">Starter</th>
                  <th className="py-3 text-center font-medium">Growth</th>
                  <th className="py-3 text-center font-medium">Scale</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label} className="border-b border-border">
                    <td className="py-3.5">{row.label}</td>
                    <td className="py-3.5 text-center">
                      <Check included={row.starter} />
                    </td>
                    <td className="py-3.5 text-center">
                      <Check included={row.growth} />
                    </td>
                    <td className="py-3.5 text-center">
                      <Check included={row.scale} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>
    </>
  );
}
