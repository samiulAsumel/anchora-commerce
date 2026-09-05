import { test, expect } from '@playwright/test';

test.describe.serial('register -> purchase -> admin sees the order', () => {
  const email = `e2e-${Date.now()}@example.com`;
  let orderId = '';

  test('a new customer can register, add a product to cart, and check out', async ({ page }) => {
    await page.goto('/register');
    await page.getByLabel('Name').fill('E2E Customer');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page).toHaveURL('/');

    await page.goto('/store/demo-store');
    await page.getByRole('link', { name: /Canvas Sneakers/i }).click();
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await expect(page.getByRole('button', { name: 'Added to cart' })).toBeVisible();

    await page.goto('/cart');
    await expect(page.getByText('Canvas Sneakers')).toBeVisible();
    await page.getByRole('link', { name: 'Checkout' }).click();

    await expect(page).toHaveURL('/checkout');
    await page.getByRole('button', { name: /Place order/ }).click();
    await expect(page).toHaveURL(/\/order\//);

    orderId = page.url().split('/order/')[1];
    expect(orderId).toMatch(/^[0-9a-f-]{36}$/);
    await expect(page.getByRole('heading', { name: 'Order placed' })).toBeVisible();
  });

  test('the order shows up in the admin dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('owner@anchora.dev');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL('/');

    await page.goto('/admin/orders');
    const row = page.locator('tr', { hasText: orderId.slice(0, 8) });
    await expect(row).toBeVisible();
  });
});
