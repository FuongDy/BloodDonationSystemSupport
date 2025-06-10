import { factory, primaryKey } from '@mswjs/data';
import { faker } from '@faker-js/faker';

// Định nghĩa các "bảng" trong DB giả lập
export const db = factory({
    role: {
        id: primaryKey(Number),
        name: String,
    },
    bloodType: {
        id: primaryKey(Number),
        bloodGroup: String,
        componentType: String,
        description: String,
    },
    user: {
        id: primaryKey(Number),
        fullName: String,
        username: String,
        email: String,
        status: String,
        role: () => 'Member', 
        bloodTypeDescription: String,
    },
});

db.role.create({ id: 1, name: 'Admin' });
db.role.create({ id: 2, name: 'Staff' });
db.role.create({ id: 3, name: 'Member' });

// Blood Types
db.bloodType.create({ id: 1, bloodGroup: 'A+', componentType: 'Toàn phần', description: 'Máu toàn phần nhóm A+' });
db.bloodType.create({ id: 2, bloodGroup: 'B+', componentType: 'Toàn phần', description: 'Máu toàn phần nhóm B+' });
db.bloodType.create({ id: 3, bloodGroup: 'O+', componentType: 'Toàn phần', description: 'Máu toàn phần nhóm O+' });
db.bloodType.create({ id: 4, bloodGroup: 'AB+', componentType: 'Toàn phần', description: 'Máu toàn phần nhóm AB+' });
db.bloodType.create({ id: 5, bloodGroup: 'A-', componentType: 'Hồng cầu', description: 'Hồng cầu nhóm A-' });
db.bloodType.create({ id: 6, bloodGroup: 'O-', componentType: 'Huyết tương', description: 'Huyết tương nhóm O-' });


// Users
db.user.create({
    id: 1,
    fullName: 'Admin User',
    username: 'admin',
    email: 'admin@blood.com',
    status: 'Active',
    role: 'Admin',
    bloodTypeDescription: 'O+',
});

db.user.create({
    id: 2,
    fullName: 'Staff User',
    username: 'staff',
    email: 'staff@blood.com',
    status: 'Active',
    role: 'Staff',
    bloodTypeDescription: 'A+',
});

// Tạo thêm 20 Member giả
for (let i = 3; i <= 22; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const bloodType = db.bloodType.findFirst({ where: { id: { equals: (i % 4) + 1 } } });

    db.user.create({
        id: i,
        fullName: `${lastName} ${firstName}`,
        username: faker.internet.userName().toLowerCase(),
        email: faker.internet.email({ firstName, lastName }),
        status: i % 5 === 0 ? 'Suspended' : 'Active',
        role: 'Member',
        bloodTypeDescription: bloodType?.description || 'Chưa cập nhật'
    });
}