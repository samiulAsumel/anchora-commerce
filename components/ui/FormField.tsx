import type { ComponentPropsWithoutRef } from 'react';

interface FormFieldProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
}

export function FormField({ label, id, ...props }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
        {...props}
      />
    </div>
  );
}
