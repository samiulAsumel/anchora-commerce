import type { ReactNode } from 'react';

export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-8">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-1.5 text-sm text-foreground/60">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}
