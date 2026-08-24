const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL: 'http://localhost:3000',
        extraHTTPHeaders: {
            'Content-Type': 'application/json',
        },
    },
    projects: [
        { name: 'api', testDir: './tests' },
    ],
});