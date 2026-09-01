const base = require('@playwright/test');
const { login } = require('../services/auth.service');

const BASE_URL = 'http://localhost:3000';

async function authedContext(playwright, username, password) {
    const tempContext = await playwright.request.newContext({ baseURL: BASE_URL });
    const response = await login(tempContext, username, password);
    const body = await response.json();
    await tempContext.dispose();

    return playwright.request.newContext({
        baseURL: BASE_URL,
        extraHTTPHeaders: {
            Authorization: `Bearer ${body.accessToken}`,
        },
    });
}

exports.test = base.test.extend({
    adminRequest: async ({ playwright }, use) => {
        const context = await authedContext(playwright, 'admin', 'admin123');
        await use(context);
        await context.dispose();
    },

    operatorRequest: async ({ playwright }, use) => {
        const context = await authedContext(playwright, 'oper1', 'oper1123');
        await use(context);
        await context.dispose();
    },

    supervisorRequest: async ({ playwright }, use) => {
        const context = await authedContext(playwright, 'supervisor', 'supervisor123');
        await use(context);
        await context.dispose();
    },

    teamLeaderRequest: async ({ playwright }, use) => {
        const context = await authedContext(playwright, 'lider1', 'lider1123');
        await use(context);
        await context.dispose();
    },

    operator2Request: async ({ playwright }, use) => {
        const context = await authedContext(playwright, 'oper2', 'oper2123');
        await use(context);
        await context.dispose();
    }      
});

exports.expect = base.expect;