// src/mocks/db.js

import { factory, primaryKey } from '@mswjs/data';

// --- Dữ liệu giả ---
export const mockRoles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Staff' },
    { id: 3, name: 'Member' },
];

export const mockBloodTypes = [
    { id: 1, bloodGroup: 'A', componentType: 'Hồng cầu', description: 'A+ Hồng cầu', quantity: 20 },
    { id: 2, bloodGroup: 'A', componentType: 'Huyết tương', description: 'A- Huyết tương', quantity: 15 },
    { id: 3, bloodGroup: 'B', componentType: 'Toàn phần', description: 'B+ Toàn phần', quantity: 25 },
    { id: 4, bloodGroup: 'O', componentType: 'Tiểu cầu', description: 'O- Tiểu cầu', quantity: 30 },
    { id: 5, bloodGroup: 'AB', componentType: 'Toàn phần', description: 'AB+ Toàn phần', quantity: 10 },
    { id: 6, bloodGroup: 'O', componentType: 'Toàn phần', description: 'O+ Toàn phần', quantity: 40 },
    { id: 7, bloodGroup: 'A+', componentType: 'Hồng cầu', description: 'A+ Hồng cầu', quantity: 22 },
    { id: 8, bloodGroup: 'B+', componentType: 'Huyết tương', description: 'B+ Huyết tương', quantity: 18 },
];

export const mockUsers = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        fullName: 'Quản Trị Viên',
        phone: '0123456789',
        address: '123 Admin Street, Hanoi',
        dateOfBirth: '1990-01-01',
        bloodTypeDescription: 'O+ Toàn phần',
        role: 'Admin',
        status: 'Active',
        emailVerified: true,
    },
    {
        id: 2,
        username: 'staff',
        email: 'staff@example.com',
        fullName: 'Nhân Viên Kho',
        phone: '0987654321',
        address: '456 Staff Avenue, HCMC',
        dateOfBirth: '1995-05-15',
        bloodTypeDescription: 'A+ Hồng cầu',
        role: 'Staff',
        status: 'Active',
        emailVerified: true,
    },
    {
        id: 3,
        username: 'member',
        email: 'member@example.com',
        fullName: 'Thành Viên',
        phone: '0112233445',
        address: '789 Member Road, Danang',
        dateOfBirth: '2000-10-20',
        bloodTypeDescription: 'B+ Toàn phần',
        role: 'Member',
        status: 'Inactive',
        emailVerified: false,
    },
];

export const mockBloodCompatibilities = [
    // Dữ liệu này có thể được tạo tự động hoặc giữ nguyên
];

// --- Định nghĩa DB Factory ---
export const db = factory({
    user: {
        id: primaryKey(Number),
        username: String,
        email: String,
        fullName: String,
        phone: String,
        address: String,
        dateOfBirth: String,
        bloodTypeDescription: String,
        role: String,
        status: String,
        emailVerified: Boolean,
        createdAt: () => new Date().toISOString(),
    },
    bloodType: {
        id: primaryKey(Number),
        bloodGroup: String,
        componentType: String,
        description: String,
        quantity: Number,
        lastUpdated: () => new Date().toISOString(),
    },
    bloodCompatibility: {
        id: primaryKey(Number),
        donorBloodType: Object,
        recipientBloodType: Object,
        isCompatible: Boolean,
        isEmergencyCompatible: Boolean,
        compatibilityScore: Number,
        notes: String,
    }
});

// THÊM: Hàm để nạp dữ liệu ban đầu vào DB
export function initializeDb() {
    // Chỉ nạp dữ liệu nếu DB trống để tránh trùng lặp khi hot-reload
    if (db.bloodType.count() === 0) {
        mockBloodTypes.forEach(bt => db.bloodType.create(bt));
        console.log('Mock DB: Seeded blood types.');
    }
    if (db.user.count() === 0) {
        mockUsers.forEach(u => db.user.create(u));
        console.log('Mock DB: Seeded users.');
    }
    if (db.bloodCompatibility.count() === 0) {
        mockBloodCompatibilities.forEach(bc => db.bloodCompatibility.create(bc));
        console.log('Mock DB: Seeded blood compatibilities.');
    }
}