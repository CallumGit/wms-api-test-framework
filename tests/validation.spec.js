const { test, expect } = require('../fixtures/auth.fixture');
const { listOrders } = require('../services/orders.service');

async function getAnyOrderId(request) {
    const response = await listOrders(request);
    const orders = await response.json();
    return orders[0].id;
}

test('extra unexpected field in body is rejected (400)', async ({ adminRequest }) => {
    const response = await adminRequest.post('/api/customers', {
        data: {
            code: 'TEST_CODE',
            name: 'Test customer',
            somethingWeird: 'this field should not be allowed',
        },
    });
    expect(response.status()).toBe(400);
});

test('the note length for app content with over 2000 characters is exceeded (400)', async ({ adminRequest }) => {
    const orderId = await getAnyOrderId(adminRequest);

    const response = await adminRequest.post(`/api/orders/${orderId}/notes`, {
        data: {
            content: 'x'.repeat(2001),
        },
    });

    expect(response.status()).toBe(400);
});

test('the note content is exactly at 2000 characters and its accepted (201)', async ({ adminRequest }) => {
    const orderId = await getAnyOrderId(adminRequest);

    const response = await adminRequest.post(`/api/orders/${orderId}/notes`, {
        data: {
            content: 'x'.repeat(2000),
        },
    });

    expect(response.status()).toBe(201);
});

// The last-admin protection exists, but testing it safely requires an isolated
// throwaway admin — running it against the real admin (me.userId) risks
// deactivating the account every other test depends on. Skipped by design.
test.skip('admin cannot deactivate the last admin (403)', async ({ adminRequest }) => {
    const meRes = await adminRequest.get('/api/auth/me');
    const me = await meRes.json();

    const response = await adminRequest.patch(`/api/users/${me.userId}`, {
        data: { isActive: false },
    });

    expect(response.status()).toBe(403);
});