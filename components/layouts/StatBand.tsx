import { Container } from '@/components/ui/Container';

const stats = [
  { value: 'Next.js 15', label: 'App Router, Server Components' },
  { value: 'Postgres', label: 'Prisma ORM, migrations & seeds' },
  { value: '< 2.5s', label: 'Target LCP on the marketing site' },
  { value: '80%+', label: 'Test coverage on business logic' },
];

export function StatBand() {
  return (
    <div className="bg-navy py-14 text-white">
      <Container className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-bold sm:text-3xl">{stat.value}</p>
            <p className="mt-1 text-sm text-white/70">{stat.label}</p>
          </div>
        ))}
      </Container>
    </div>
  );
}
