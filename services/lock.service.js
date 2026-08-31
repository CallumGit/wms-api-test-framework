async function acquireLock(request, orderId) {
    return request.post(`/api/orders/${orderId}/lock`);
}

async function heartbeatLock(request, orderId) {
    return request.patch(`/api/orders/${orderId}/lock`);
}

async function releaseLock(request, orderId) {
    return request.delete(`/api/orders/${orderId}/lock`);
} 

async function getLock(request, orderId) {
    return request.get(`/api/orders/${orderId}/lock`);
}

module.exports = { acquireLock, heartbeatLock, releaseLock, getLock };