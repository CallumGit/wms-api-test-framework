// services/auth.service.js

async function login(request, username, password) {
    return request.post('/api/auth/login', {
        data: { username, password },
    });
}


module.exports = { login };