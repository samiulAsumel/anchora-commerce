import { describe, it, expect } from 'vitest';
import { formatPrice, slugify, cn } from '@/lib/utils';

describe('formatPrice', () => {
  it('formats cents as USD currency', () => {
    expect(formatPrice(8550)).toBe('$85.50');
  });

  it('formats zero correctly', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('supports other currencies', () => {
    expect(formatPrice(1000, 'EUR')).toBe('€10.00');
  });
});

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Canvas Sneakers')).toBe('canvas-sneakers');
  });

  it('strips punctuation', () => {
    expect(slugify("Men's Wool Coat!")).toBe('men-s-wool-coat');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  --Field Jacket--  ')).toBe('field-jacket');
  });
});

describe('cn', () => {
  it('merges class names and resolves Tailwind conflicts', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('drops falsy values', () => {
    expect(cn('a', false, undefined, 'b')).toBe('a b');
  });
});
