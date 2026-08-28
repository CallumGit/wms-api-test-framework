const { test, expect } = require('../fixtures/auth.fixture');

test('operator cannot list users', async ({ operatorRequest }) => {
    const response = await operatorRequest.get('/api/users');
    expect(response.status()).toBe(403);
});

test('operator cannot create an order', async ({ operatorRequest }) => {
    const response = await operatorRequest.post('/api/orders', {
        data: {
        customerId: 'some-customer-id',
        },
    });
    expect(response.status()).toBe(403);
});

test('operator cannot create a customer', async ({ operatorRequest }) => {
    const response = await operatorRequest.post('/api/customers', {
        data: {
            code: 'some-customer-code',
            name: 'some-customer-name'
        }
    });
    expect(response.status()).toBe(403);
});

test('admin can list users', async ({ adminRequest }) => {
    const response = await adminRequest.get('/api/users');
    expect(response.status()).toBe(200);
});

test('operator gets 404 for a nonexistent note', async ({ operatorRequest }) => {
    const response = await operatorRequest.patch('/api/notes/fake-id', {
        data: {
            content: 'x',
        }
    });
    expect(response.status()).toBe(404);
});
