import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch about Anchora Commerce.',
};

export default function ContactPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="mx-auto max-w-lg">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact</h1>
        <p className="mt-4 text-lg text-foreground/70">
          Questions about the project or the code? Send a message.
        </p>
        <div className="mt-10">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
