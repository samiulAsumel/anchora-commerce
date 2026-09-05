import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-xl font-bold tracking-tight', className)}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2 3 6.5V12c0 5.2 3.6 9.4 9 10 5.4-.6 9-4.8 9-10V6.5L12 2Z"
          className="fill-navy dark:fill-navy-light"
        />
        <path d="M8.5 12.5 11 15l4.5-5.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Anchora
    </span>
  );
}
