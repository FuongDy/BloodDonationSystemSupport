import { http, HttpResponse } from 'msw';
import { db } from './db';

/**
 * =================================================================
 * HANDLERS CHO LOẠI MÁU (BLOOD TYPES) - CRUD
 * =================================================================
 */

// 1. GET ALL BLOOD TYPES (với phân trang và sắp xếp)
const getAllBloodTypesHandler = http.get('*/api/blood-types', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '10', 10);
    const sortParam = url.searchParams.get('sort')?.split(',') || ['id', 'asc'];
    const [sortField, sortDirection] = sortParam;

    const allBloodTypes = db.bloodType.getAll();

    // Logic sắp xếp
    const sortedData = [...allBloodTypes].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const totalElements = sortedData.length;
    const totalPages = Math.ceil(totalElements / size);
    const content = sortedData.slice(page * size, (page + 1) * size);

    // Thêm số lượng máu giả lập vào response
    const contentWithQuantity = content.map(item => ({
        ...item,
        quantity: Math.floor(Math.random() * 50) + 1, // Số lượng ngẫu nhiên từ 1 đến 50
        lastUpdated: new Date(Date.now() - Math.random() * 1000 * 3600 * 24 * 30).toISOString(), // Cập nhật trong vòng 30 ngày qua
    }));


    return HttpResponse.json({
        content: contentWithQuantity,
        pageable: { pageNumber: page, pageSize: size },
        totalPages,
        totalElements,
        last: page === totalPages - 1,
        first: page === 0,
        size,
        number: page,
        numberOfElements: content.length,
        empty: content.length === 0,
    });
});

// 2. CREATE BLOOD TYPE
const createBloodTypeHandler = http.post('*/api/blood-types', async ({ request }) => {
    const newTypeData = await request.json();

    if (!newTypeData.description || !newTypeData.bloodGroup || !newTypeData.componentType) {
        return HttpResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const created = db.bloodType.create({
        ...newTypeData,
        // Giả lập id tự tăng
        id: Math.max(...db.bloodType.getAll().map(bt => bt.id), 0) + 1
    });

    return HttpResponse.json(created, { status: 201 });
});

// 3. UPDATE BLOOD TYPE
const updateBloodTypeHandler = http.put('*/api/blood-types/:id', async ({ request, params }) => {
    const { id } = params;
    const updatedData = await request.json();

    const updated = db.bloodType.update({
        where: { id: { equals: Number(id) } },
        data: updatedData,
    });

    if (!updated) {
        return HttpResponse.json({ message: 'Blood Type not found' }, { status: 404 });
    }

    return HttpResponse.json(updated);
});


// 4. DELETE BLOOD TYPE
const deleteBloodTypeHandler = http.delete('*/api/blood-types/:id', ({ params }) => {
    const { id } = params;

    const deleted = db.bloodType.delete({
        where: { id: { equals: Number(id) } },
    });

    if (!deleted) {
        return HttpResponse.json({ message: 'Blood Type not found' }, { status: 404 });
    }
    // API thường trả về status 204 No Content sau khi xóa thành công
    return new HttpResponse(null, { status: 204 });
});


/**
 * =================================================================
 * HANDLERS CHO TƯƠNG THÍCH MÁU (BLOOD COMPATIBILITIES) - CRUD
 * =================================================================
 */

// 1. GET ALL COMPATIBILITIES (kèm thông tin chi tiết của loại máu)
const getAllCompatibilitiesHandler = http.get('*/api/blood-compatibilities', () => {
    const compatibilities = db.bloodCompatibility.getAll().map((comp) => {
      // Join dữ liệu từ bảng bloodType
      const donorType = db.bloodType.findFirst({ where: { id: { equals: comp.donorBloodTypeId } } });
      const recipientType = db.bloodType.findFirst({ where: { id: { equals: comp.recipientBloodTypeId } } });
      return {
        ...comp,
        donorBloodTypeDescription: donorType?.description || 'Không rõ',
        recipientBloodTypeDescription: recipientType?.description || 'Không rõ',
      };
    });
    return HttpResponse.json(compatibilities);
  });

// 2. CREATE COMPATIBILITY
const createCompatibilityHandler = http.post('*/api/blood-compatibilities', async ({ request }) => {
    const newData = await request.json();

    if (!newData.donorBloodTypeId || !newData.recipientBloodTypeId || !newData.transfusionType) {
        return HttpResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const created = db.bloodCompatibility.create({
        ...newData,
        id: Math.max(...db.bloodCompatibility.getAll().map(c => c.id), 0) + 1
    });

    return HttpResponse.json(created, { status: 201 });
});

// 3. UPDATE COMPATIBILITY
const updateCompatibilityHandler = http.put('*/api/blood-compatibilities/:id', async ({ request, params }) => {
    const { id } = params;
    const updatedData = await request.json();

    const updated = db.bloodCompatibility.update({
        where: { id: { equals: Number(id) } },
        data: updatedData,
    });

    if (!updated) {
        return HttpResponse.json({ message: 'Compatibility rule not found' }, { status: 404 });
    }
    return HttpResponse.json(updated);
});

// 4. DELETE COMPATIBILITY
const deleteCompatibilityHandler = http.delete('*/api/blood-compatibilities/:id', ({ params }) => {
    const { id } = params;
    
    const deleted = db.bloodCompatibility.delete({
        where: { id: { equals: Number(id) } },
    });

    if (!deleted) {
        return HttpResponse.json({ message: 'Compatibility rule not found' }, { status: 404 });
    }

    return new HttpResponse(null, { status: 204 });
});


// Export tất cả các handlers
export const bloodHandlers = [
    // Blood Type handlers
    getAllBloodTypesHandler,
    createBloodTypeHandler,
    updateBloodTypeHandler,
    deleteBloodTypeHandler,

    // Blood Compatibility handlers
    getAllCompatibilitiesHandler,
    createCompatibilityHandler,
    updateCompatibilityHandler,
    deleteCompatibilityHandler
];