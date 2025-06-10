import { http, HttpResponse } from 'msw';
import { db } from './db';

const API_PREFIX = '/api';

export const handlers = [
    // Handler cho Đăng nhập
    http.post(`${API_PREFIX}/auth/login`, async ({ request }) => {
        const { email, password } = await request.json();

        // Giả lập logic đăng nhập
        if (password === 'password') { // Mật khẩu đúng cho mọi user mock
            const user = db.user.findFirst({ where: { email: { equals: email } } });
            if (user) {
                return HttpResponse.json({
                    accessToken: `mock-jwt-token-for-${user.username}`,
                    userId: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                });
            }
        }

        return new HttpResponse('The email or password is invalid', { status: 401 });
    }),

    // Handler để lấy danh sách Users (Admin)
    http.get(`${API_PREFIX}/admin/users`, ({ request }) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '0');
        const size = parseInt(url.searchParams.get('size') || '10');
        const search = url.searchParams.get('search') || '';

        const allUsers = db.user.getAll();

        const filteredUsers = search
            ? allUsers.filter(user =>
                user.fullName.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase())
            )
            : allUsers;

        const totalElements = filteredUsers.length;
        const totalPages = Math.ceil(totalElements / size);
        const content = filteredUsers.slice(page * size, (page + 1) * size);

        return HttpResponse.json({
            content,
            pageable: {
                pageNumber: page,
                pageSize: size,
            },
            totalPages,
            totalElements,
            last: page >= totalPages - 1,
            first: page === 0,
            size,
            number: page,
            numberOfElements: content.length,
            empty: content.length === 0,
        });
    }),

    // Handler để lấy Blood Types
    http.get(`${API_PREFIX}/blood-types`, () => {
        const bloodTypes = db.bloodType.getAll();
        return HttpResponse.json({
            content: bloodTypes,
            totalPages: 1,
            totalElements: bloodTypes.length,
            number: 0,
        });
    }),

    // Handler để lấy Roles
    http.get(`${API_PREFIX}/admin/roles`, () => {
        return HttpResponse.json(db.role.getAll());
    }),

    // Handler để xóa User
    http.delete(`${API_PREFIX}/admin/users/:userId`, ({ params }) => {
        const { userId } = params;
        const deletedUser = db.user.delete({ where: { id: { equals: Number(userId) } } });
        if (deletedUser) {
            return HttpResponse.json(deletedUser, { status: 200 });
        }
        return new HttpResponse(null, { status: 404 });
    }),
];