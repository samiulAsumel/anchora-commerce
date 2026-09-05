import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema, productSchema, cartItemSchema } from '@/lib/validations';

describe('registerSchema', () => {
  it('accepts valid input and lowercases email', () => {
    const result = registerSchema.parse({
      name: 'Ada Lovelace',
      email: 'ADA@Example.com',
      password: 'password123',
    });
    expect(result.email).toBe('ada@example.com');
  });

  it('rejects a short password', () => {
    const result = registerSchema.safeParse({
      name: 'Ada',
      email: 'ada@example.com',
      password: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = registerSchema.safeParse({
      name: 'Ada',
      email: 'not-an-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({ email: 'ada@example.com', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('productSchema', () => {
  it('rejects a slug with uppercase or spaces', () => {
    const result = productSchema.safeParse({
      name: 'Field Jacket',
      slug: 'Field Jacket',
      description: 'A jacket.',
      priceCents: 1000,
      inventory: 5,
    });
    expect(result.success).toBe(false);
  });

  it('accepts a well-formed product', () => {
    const result = productSchema.safeParse({
      name: 'Field Jacket',
      slug: 'field-jacket',
      description: 'A jacket.',
      priceCents: 1000,
      inventory: 5,
    });
    expect(result.success).toBe(true);
  });

  it('rejects a negative price', () => {
    const result = productSchema.safeParse({
      name: 'Field Jacket',
      slug: 'field-jacket',
      description: 'A jacket.',
      priceCents: -1,
      inventory: 5,
    });
    expect(result.success).toBe(false);
  });
});

describe('cartItemSchema', () => {
  it('rejects a quantity over 99', () => {
    const result = cartItemSchema.safeParse({
      productId: '11111111-1111-1111-1111-111111111111',
      quantity: 100,
    });
    expect(result.success).toBe(false);
  });

  it('rejects a non-uuid productId', () => {
    const result = cartItemSchema.safeParse({ productId: 'not-a-uuid', quantity: 1 });
    expect(result.success).toBe(false);
  });
});
