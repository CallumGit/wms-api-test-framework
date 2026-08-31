const { test, expect } = require('../fixtures/auth.fixture');
const { listOrders } = require('../services/orders.service');
const { acquireLock, heartbeatLock, releaseLock, getLock } = require('../services/lock.service');

async function getUnlockedOrderId(request) {
    const response = await listOrders(request);
    const orders = await response.json();
    const unlocked = orders.find(o => o.lockedById === null);
    return unlocked ? unlocked.id : orders[0].id;
}

test('lock lifecycle: acquire, verify, heartbeat, release', async ({ adminRequest }) => {
    const orderId = await getUnlockedOrderId(adminRequest);

    const lockRes = await acquireLock(adminRequest, orderId);
    expect(lockRes.status()).toBe(200);

    const stateRes = await getLock(adminRequest, orderId);
    const state = await stateRes.json();
    expect(state.locked).toBe(true);
    expect(state.lockedBy.username).toBe('admin');

    const beatRes = await heartbeatLock(adminRequest, orderId);
    expect(beatRes.status()).toBe(200);

    const releaseRes = await releaseLock(adminRequest, orderId);
    expect(releaseRes.status()).toBe(200);

    const finalState = await getLock(adminRequest, orderId);
    const final = await finalState.json();
    expect(final.locked).toBe(false);
});