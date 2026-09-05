import { test, expect } from '@playwright/test';

test('an owner can create and then delete a product', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('owner@anchora.dev');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page).toHaveURL('/');

  const name = `E2E Product ${Date.now()}`;

  await page.goto('/admin/products/new');
  await page.getByLabel('Name').fill(name);
  await page.getByLabel('Description').fill('Created by the Playwright suite.');
  await page.getByLabel('Price (USD)').fill('12.34');
  await page.getByLabel('Inventory').fill('3');
  await page.getByRole('button', { name: 'Create product' }).click();

  await expect(page).toHaveURL('/admin/products');
  const row = page.getByTestId('product-row').filter({ hasText: name });
  await expect(row).toBeVisible();

  await row.getByRole('button', { name: 'Delete' }).click();
  await row.getByRole('button', { name: 'Confirm delete?' }).click();
  await expect(page.getByTestId('product-row').filter({ hasText: name })).toHaveCount(0);
});
