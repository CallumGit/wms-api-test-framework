const { test, expect } = require('@playwright/test');
const { login } = require('../services/auth.service');

const roles = [
    { username: 'admin',      password: 'admin123',      expectedRole: 'ADMIN' },
    { username: 'oper1',      password: 'oper1123',      expectedRole: 'OPERATOR' },
    { username: 'supervisor', password: 'supervisor123', expectedRole: 'SUPERVISOR' },
    { username: 'lider1',     password: 'lider1123',     expectedRole: 'TEAM_LEADER' },
];

for (const { username, password, expectedRole } of roles) {
    test(`${username} authenticates as ${expectedRole}`, async ({ request }) => {
        const loginRes = await login(request, username, password);
        const { accessToken } = await loginRes.json();

        const meRes = await request.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        expect(meRes.status()).toBe(200);
        const body = await meRes.json();
        expect(body.role).toBe(expectedRole);
    });
}