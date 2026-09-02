const { test, expect } = require('../fixtures/auth.fixture');
const { verifyPallet } = require('../services/verification.service');
const { listOrders } = require('../services/orders.service');

async function getPalletId(request) {
    const ordersRes = await listOrders(request) 
        const orders = await ordersRes.json();
        const order = orders.find(o => o._count?.pallets > 0);

    for (const order of orders) {
        const palletsRes = await request.get(`/api/orders/${order.id}/unverified-pallets`);
        const pallets = await palletsRes.json();
        if (pallets.length > 0) {
            return pallets[0].id;
        }
    }
    throw new Error('No unverified pallets found in any order');
}

test('verification is indempotent: same clientGeneratedId twice', async ({ operatorRequest, adminRequest }) => {
    const palletId = await getPalletId(adminRequest);
    const clientGeneratedId = `scan-${Date.now()}`;
    const payload = {
        palletId,
        clientGeneratedId,
    };

    const first = await verifyPallet(operatorRequest, payload);
    const firstBody = await first.json();
    expect(first.status()).toBe(200);
    expect(firstBody.idempotent).toBe(false);
    

    const second = await verifyPallet(operatorRequest, payload);
    const secondBody = await second.json();
    expect(second.status()).toBe(200);
    expect(secondBody.idempotent).toBe(true);

    expect(secondBody.verification.id).toBe(firstBody.verification.id);
    
    
});