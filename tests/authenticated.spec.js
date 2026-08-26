
const { test, expect } = require('../fixtures/auth.fixture');



test('adminRequest is already authenticated', async ({ adminRequest }) => {
const response = await adminRequest.get('api/auth/me');
expect(response.status()).toBe(200);
const body = await response.json();
expect(body.role).toBe('ADMIN');
});


test('operatorRequest is already authenticated', async ({ operatorRequest }) => {
const response = await operatorRequest.get('api/auth/me');
expect(response.status()).toBe(200);
const body = await response.json();
expect(body.role).toBe('OPERATOR');
});


test('supervisorRequest is already authenticated', async ({ supervisorRequest }) => {
const response = await supervisorRequest.get('api/auth/me');
expect(response.status()).toBe(200);
const body = await response.json();
expect(body.role).toBe('SUPERVISOR');
});

test('teamLeaderRequest is already authenticated', async ({ teamLeaderRequest }) => {
const response = await teamLeaderRequest.get('api/auth/me');
expect(response.status()).toBe(200);
const body = await response.json();
expect(body.role).toBe('TEAM_LEADER');
});