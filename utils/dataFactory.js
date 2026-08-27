function uniqueSuffix() {
    return Date.now() + '-' + Math.round(Math.random() * 1000);
}

function generateCustomer() {
    const suffix = uniqueSuffix();
    return {
        code: `CUST_${suffix}`,
        name: `Test Customer ${suffix}`
    };
}

function generateMaterial() {
    const suffix = uniqueSuffix();
    return {
        code: `MAT_${suffix}`,
        name: `Test Material ${suffix}`
    };
}

module.exports = { uniqueSuffix, generateCustomer, generateMaterial };