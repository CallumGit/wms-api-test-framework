const { test, expect } = require('../fixtures/auth.fixture');
const { listOrders, getOrder } = require('../services/orders.service');

test('admin can list orders', async ({ adminRequest }) => {
    const response = await listOrders(adminRequest);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
});

test('operator can list their own orders', async ({ operatorRequest }) => {
    const response = await listOrders(operatorRequest);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
});

test('operator gets 404 for an non-existent order', async ({ operatorRequest }) => {
    const response = await getOrder(operatorRequest, 'fake-order-id');
    expect(response.status()).toBe(404);
});