const { test, expect } = require('@playwright/test');
const { login } = require('../services/auth.service');

test('Admin can log in and receives a token', async ({ request }) => {
    const response = await login(request, 'admin', 'admin123');

    expect(response.status()).toBe(200);

    const body = await response.json();

    // Check that the response contains a token and response shape (based on API-REFERENCE.md)
    expect(body.accessToken).toBeTruthy();
    expect(body.refreshToken).toBeTruthy();
    expect(body.user.username).toBe('admin');
    expect(body.user.role).toBe('ADMIN');
});

test('User login fails with incorrect password provided', async ({ request }) => {
    const response = await login(request, 'admin', 'wrongpassword');

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Nieprawidłowa nazwa użytkownika lub hasło.');
});