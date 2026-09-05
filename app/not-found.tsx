import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center py-24">
      <Container className="mx-auto max-w-md text-center">
        <p className="text-sm font-semibold text-orange">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-3 text-foreground/70">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Button href="/" variant="accent" className="mt-6">
          Back to home
        </Button>
      </Container>
    </main>
  );
}
