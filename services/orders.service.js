async function createOrder(request, orderData) {
    return request.post('/api/orders', { data: orderData });
}

async function getOrder(request, orderId) {
    return request.get(`/api/orders/${orderId}`);
}

async function listOrders(request) {
    return request.get('/api/orders');
}

module.exports = { createOrder, getOrder, listOrders };