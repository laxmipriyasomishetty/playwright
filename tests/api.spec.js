const { test, expect } = require('@playwright/test');

test.describe('API', () => {
  test('lists products', async ({ request }) => {
    const res = await request.get('/api/products');
    expect(res.ok()).toBeTruthy();

    const products = await res.json();
    expect(products).toHaveLength(3);
    expect(products[0]).toMatchObject({ id: 1, name: 'Notebook' });
  });

  test('returns a single product', async ({ request }) => {
    const res = await request.get('/api/products/2');
    expect(res.status()).toBe(200);
    expect((await res.json()).name).toBe('Desk Lamp');
  });

  test('unknown product gives 404', async ({ request }) => {
    const res = await request.get('/api/products/999');
    expect(res.status()).toBe(404);
  });

  test('feedback can be created', async ({ request }) => {
    const res = await request.post('/api/feedback', {
      data: { email: 'qa@example.com', message: 'Looks good' },
    });
    expect(res.status()).toBe(201);
    expect(await res.json()).toMatchObject({ email: 'qa@example.com' });
  });

  test('feedback without a message is rejected', async ({ request }) => {
    const res = await request.post('/api/feedback', { data: { email: 'qa@example.com' } });
    expect(res.status()).toBe(400);
  });
});
