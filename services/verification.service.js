async function verifyPallet(request, payload) {
    return request.post(`/api/verification/pallet`, { data: payload });
}

async function getPalletHistory(request, palletId) {
    return request.get(`/api/verification/pallet/${palletId}/history`);
}

module.exports = { verifyPallet, getPalletHistory };