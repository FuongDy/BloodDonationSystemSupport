// src/mocks/authHandlers.js
import { http, HttpResponse } from 'msw';
import { mockUsers } from './db';

export const authHandlers = [
    // Mô phỏng API đăng nhập
    http.post('/api/auth/login', async ({ request }) => {
        const { email, password } = await request.json();
        const user = mockUsers.find(u => u.email === email);

        if (user && password === 'password') { // Giả lập mật khẩu đúng là "password"
            return HttpResponse.json({
                accessToken: `fake-jwt-token-for-${user.username}`,
                userId: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            });
        }

        return HttpResponse.json({ message: 'Email hoặc mật khẩu không chính xác' }, { status: 401 });
    }),

    // Mô phỏng API đăng ký
    http.post('/api/auth/register', async ({ request }) => {
        const newUser = await request.json();
        console.log('MSW: Registered new user:', newUser);
        return HttpResponse.json({ message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực.' }, { status: 201 });
    }),
];