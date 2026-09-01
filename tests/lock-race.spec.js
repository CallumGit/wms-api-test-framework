const { test, expect } = require('../fixtures/auth.fixture');
const { listOrders } = require('../services/orders.service');
const { acquireLock, releaseLock, getLock } = require('../services/lock.service');

async function getUnlockedOrderId(request) {
    const response = await listOrders(request);
    const orders = await response.json();   
    const unlocked = orders.find( o => o.lockedById === null);
    return unlocked ? unlocked.id : orders[0].id;
}

test('two operators race for the same lock: one wins (200), second loses (409)', async ({ operatorRequest, operator2Request }) => {
    const orderId = await getUnlockedOrderId(operatorRequest);
    await releaseLock(operatorRequest, orderId);

    const [ resultA, resultB ] = await Promise.all([
        acquireLock(operatorRequest, orderId),
        acquireLock(operator2Request, orderId),
    ]);

    //it shows that the winner of the lock-race does hold the lock
    const state = await (await getLock(operatorRequest, orderId)).json();
    expect(state.locked).toBe(true);
    expect(['oper1', 'oper2']).toContain(state.lockedBy.username);

    const statuses = [resultA.status(), resultB.status()].sort();
    expect(statuses).toEqual([200, 409]);
    await releaseLock(operatorRequest, orderId);
    await releaseLock(operator2Request, orderId);
});