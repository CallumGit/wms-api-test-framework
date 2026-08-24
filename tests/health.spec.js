const { test, expect } = require('@playwright/test');

test('health check - API is alive', async ({ request }) => {
    const response = await request.get('/api/health');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body.database).toBe('up');
});