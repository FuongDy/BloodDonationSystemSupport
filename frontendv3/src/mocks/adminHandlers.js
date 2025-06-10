import { http, HttpResponse, delay } from 'msw';
import { db, mockRoles } from './db'; // THÊM: import mockRoles

const API_URL = '/api/admin/users';

export const adminHandlers = [
    // Get All Users (với phân trang và sắp xếp)
    http.get(API_URL, async ({ request }) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '0', 10);
        const size = parseInt(url.searchParams.get('size') || '10', 10);
        const sort = url.searchParams.get('sort');
        const search = url.searchParams.get('search') || '';

        const where = search ? {
            fullName: {
                contains: search,
                mode: 'insensitive'
            }
        } : undefined;

        const totalElements = db.user.count({ where });
        const totalPages = Math.ceil(totalElements / size);

        let orderBy = undefined;
        if (sort) {
            const [field, direction] = sort.split(',');
            orderBy = { [field]: direction };
        }

        const users = db.user.findMany({
            take: size,
            skip: page * size,
            orderBy,
            where,
        });
        
        await delay(300);
        return HttpResponse.json({
            content: users,
            pageable: {
                pageNumber: page,
                pageSize: size,
            },
            totalPages,
            totalElements,
            last: page >= totalPages - 1,
            first: page === 0,
            numberOfElements: users.length,
        });
    }),

    // Get User By ID
    http.get(`${API_URL}/:id`, async ({ params }) => {
        const user = db.user.findFirst({
            where: {
                id: {
                    equals: Number(params.id),
                },
            },
        });

        if (!user) {
            await delay(150);
            return new HttpResponse(null, { status: 404, statusText: 'User not found' });
        }
        
        await delay(150);
        return HttpResponse.json(user);
    }),

    // Create User
    http.post(API_URL, async ({ request }) => {
        const newUserReq = await request.json();
        
        const newUser = db.user.create({
            id: db.user.count() + 1,
            ...newUserReq,
            status: 'Active',
            emailVerified: true,
            createdAt: new Date().toISOString(),
        });
        
        await delay(500);
        return HttpResponse.json(newUser, { status: 201 });
    }),

    // Update User
    http.put(`${API_URL}/:id`, async ({ params, request }) => {
        const updatedData = await request.json();
        const updatedUser = db.user.update({
            where: {
                id: {
                    equals: Number(params.id),
                },
            },
            data: updatedData,
        });

        if (!updatedUser) {
            await delay(150);
            return new HttpResponse(null, { status: 404, statusText: 'User not found' });
        }
        
        await delay(500);
        return HttpResponse.json(updatedUser);
    }),

    // Delete User
    http.delete(`${API_URL}/:id`, async ({ params }) => {
        const deletedUser = db.user.delete({
            where: {
                id: {
                    equals: Number(params.id),
                },
            },
        });

        if (!deletedUser) {
            await delay(150);
            return new HttpResponse(null, { status: 404, statusText: 'User not found' });
        }
        
        await delay(500);
        return new HttpResponse(null, { status: 204 });
    }),

    // THÊM: Handler để lấy danh sách vai trò
    http.get('/api/roles', async () => {
        await delay(100);
        return HttpResponse.json(mockRoles);
    }),
];