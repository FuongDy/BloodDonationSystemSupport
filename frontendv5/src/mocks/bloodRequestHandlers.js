// src/mocks/bloodRequestHandlers.js
import { http, HttpResponse } from 'msw';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Mock data for blood requests
const mockBloodRequests = [
  {
    id: 1,
    patientName: 'Nguyễn Văn A',
    bloodType: 'O+',
    urgency: 'CRITICAL',
    unitsNeeded: 2,
    hospital: 'Bệnh viện Chợ Rẫy',
    location: 'TP.HCM',
    contactPhone: '0901234567',
    description: 'Cần máu gấp cho ca phẫu thuật tim',
    status: 'PENDING',
    createdAt: new Date('2024-01-15').toISOString(),    deadline: new Date('2024-01-20').toISOString(),
    pledges: [
      {
        id: 1,
        donor: {
          id: 3,
          fullName: 'User Mock',
          email: 'user@example.com',
          phone: '0987654321'
        },
        pledgedAt: new Date('2024-01-16').toISOString(),
        status: 'PLEDGED'
      }
    ],
  },
  {
    id: 2,
    patientName: 'Trần Thị B',
    bloodType: 'A+',
    urgency: 'URGENCY',
    unitsNeeded: 1,
    hospital: 'Bệnh viện Bình Dân',
    location: 'TP.HCM',
    contactPhone: '0912345678',
    description: 'Bệnh nhân thiếu máu sau tai nạn',
    status: 'PENDING',
    createdAt: new Date('2024-01-16').toISOString(),
    deadline: new Date('2024-01-22').toISOString(),    pledges: [
      {
        id: 2,
        donor: {
          id: 3,
          fullName: 'Lê Văn C', 
          email: 'user@example.com',
          phone: '0923456789'
        },
        pledgedAt: new Date('2024-01-17').toISOString(),
        status: 'PLEDGED'
      },
    ],
  },
  {
    id: 3,
    patientName: 'Phạm Văn D',
    bloodType: 'B-',
    urgency: 'NORMAL',
    unitsNeeded: 3,
    hospital: 'Bệnh viện Đại học Y Dược',
    location: 'TP.HCM',
    contactPhone: '0934567890',
    description: 'Chuẩn bị cho ca phẫu thuật định kỳ',
    status: 'PENDING',
    createdAt: new Date('2024-01-18').toISOString(),
    deadline: new Date('2024-01-25').toISOString(),
    pledges: [],
  },
];

export const bloodRequestHandlers = [
  // Get all active blood requests
  http.get(`${API_URL}/blood-requests/search/active`, () => {
    const activeRequests = mockBloodRequests.filter(
      request => request.status === 'PENDING'
    );
    
    return HttpResponse.json({
      data: activeRequests,
      message: 'Active blood requests retrieved successfully (MSW)',
    });
  }),

  // Get all blood requests (admin/staff)
  http.get(`${API_URL}/blood-requests`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');
    const status = url.searchParams.get('status');
    
    let filteredRequests = mockBloodRequests;
    
    if (status) {
      filteredRequests = mockBloodRequests.filter(req => req.status === status);
    }
    
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex);
    
    return HttpResponse.json({
      content: paginatedRequests,
      totalElements: filteredRequests.length,
      totalPages: Math.ceil(filteredRequests.length / size),
      size,
      number: page,
      first: page === 0,
      last: page >= Math.ceil(filteredRequests.length / size) - 1,
    });
  }),

  // Get blood request by ID
  http.get(`${API_URL}/blood-requests/:id`, ({ params }) => {
    const { id } = params;
    const request = mockBloodRequests.find(req => req.id === parseInt(id));
    
    if (!request) {
      return HttpResponse.json(
        { message: 'Blood request not found (MSW)' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({
      data: request,
      message: 'Blood request retrieved successfully (MSW)',
    });
  }),

  // Create new blood request
  http.post(`${API_URL}/blood-requests`, async ({ request }) => {
    const newRequest = await request.json();
    
    const bloodRequest = {
      id: mockBloodRequests.length + 1,
      ...newRequest,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      pledges: [],
    };
    
    mockBloodRequests.push(bloodRequest);
    
    return HttpResponse.json(
      {
        data: bloodRequest,
        message: 'Blood request created successfully (MSW)',
      },
      { status: 201 }
    );
  }),

  // Pledge for a blood request
  http.post(`${API_URL}/blood-requests/:id/pledge`, async ({ params, request }) => {
    const { id } = params;
    const pledgeData = await request.json();
    
    const bloodRequest = mockBloodRequests.find(req => req.id === parseInt(id));
    
    if (!bloodRequest) {
      return HttpResponse.json(
        { message: 'Blood request not found (MSW)' },
        { status: 404 }
      );
    }
    
    const newPledge = {
      id: Date.now(),
      donorName: pledgeData.donorName || 'Anonymous Donor',
      donorPhone: pledgeData.donorPhone,
      pledgedAt: new Date().toISOString(),
    };
    
    bloodRequest.pledges.push(newPledge);
    
    return HttpResponse.json({
      data: newPledge,
      message: 'Pledge created successfully (MSW)',
    });
  }),

  // Update blood request status (admin/staff)
  http.put(`${API_URL}/blood-requests/:id/status`, async ({ params, request }) => {
    const { id } = params;
    const { status } = await request.json();
    
    const bloodRequest = mockBloodRequests.find(req => req.id === parseInt(id));
    
    if (!bloodRequest) {
      return HttpResponse.json(
        { message: 'Blood request not found (MSW)' },
        { status: 404 }
      );
    }
    
    bloodRequest.status = status;
    bloodRequest.updatedAt = new Date().toISOString();
    
    return HttpResponse.json({
      data: bloodRequest,
      message: 'Blood request status updated successfully (MSW)',
    });
  }),

  // Delete blood request (admin)
  http.delete(`${API_URL}/blood-requests/:id`, ({ params }) => {
    const { id } = params;
    const index = mockBloodRequests.findIndex(req => req.id === parseInt(id));
    
    if (index === -1) {
      return HttpResponse.json(
        { message: 'Blood request not found (MSW)' },
        { status: 404 }
      );
    }
    
    mockBloodRequests.splice(index, 1);
      return HttpResponse.json({
      message: 'Blood request deleted successfully (MSW)',
    });
  }),  // Get user's pledges
  http.get(`${API_URL}/users/me/pledges`, () => {
    console.log('🩸 Mock: Fetching user pledges...');
    
    const mockPledges = [
      {
        id: 1,
        status: 'PENDING',
        createdAt: '2024-12-15T10:30:00',
        bloodRequest: {
          id: 101,
          description: 'Cần máu khẩn cấp cho bệnh nhân tai nạn giao thông. Tình trạng rất nguy kịch.',
          quantityNeeded: 3,
          location: 'Bệnh viện Chợ Rẫy, TP.HCM',
          neededBy: '2024-12-20T18:00:00',
          priority: 'EMERGENCY',
          contactPhone: '0909123456',
          contactEmail: 'emergency@choray.vn',
          bloodType: {
            id: 1,
            bloodGroup: 'A',
            componentType: '+',
            description: 'A+'
          }
        }
      },
      {
        id: 2,
        status: 'CONFIRMED',
        createdAt: '2024-12-10T14:20:00',
        bloodRequest: {
          id: 102,
          description: 'Bệnh nhân chuẩn bị phẫu thuật tim mạch cần dự trữ máu.',
          quantityNeeded: 2,
          location: 'Viện Tim mạch Việt Nam, Hà Nội',
          neededBy: '2024-12-25T08:00:00',
          priority: 'URGENT',
          contactPhone: '0912345678',
          contactEmail: 'cardio@timvietnam.vn',
          bloodType: {
            id: 2,
            bloodGroup: 'O',
            componentType: '-',
            description: 'O-'
          }
        }
      },
      {
        id: 3,
        status: 'COMPLETED',
        createdAt: '2024-12-05T09:15:00',
        bloodRequest: {
          id: 103,
          description: 'Bệnh nhân ung thư máu cần truyền máu thường xuyên trong quá trình điều trị.',
          quantityNeeded: 1,
          location: 'Bệnh viện K, Hà Nội',
          neededBy: '2024-12-15T16:00:00',
          priority: 'NORMAL',
          contactPhone: '0987654321',
          contactEmail: 'oncology@benhvienk.vn',
          bloodType: {
            id: 3,
            bloodGroup: 'B',
            componentType: '+',
            description: 'B+'
          }
        }
      },
      {
        id: 4,
        status: 'PENDING',
        createdAt: '2024-12-12T16:45:00',
        bloodRequest: {
          id: 104,
          description: 'Thai phụ sinh non cần máu khẩn cấp.',
          quantityNeeded: 4,
          location: 'Bệnh viện Phụ sản Trung ương, Hà Nội',
          neededBy: '2024-12-18T12:00:00',
          priority: 'URGENT',
          contactPhone: '0934567890',
          contactEmail: 'maternity@phusan.vn',
          bloodType: {
            id: 4,
            bloodGroup: 'AB',
            componentType: '+',
            description: 'AB+'
          }
        }
      },
      {
        id: 5,
        status: 'CANCELLED',
        createdAt: '2024-12-08T11:30:00',
        bloodRequest: {
          id: 105,
          description: 'Bệnh nhân bỏng nặng cần máu để phẫu thuật ghép da.',
          quantityNeeded: 2,
          location: 'Viện Bỏng Quốc gia, TP.HCM',
          neededBy: '2024-12-14T10:00:00',
          priority: 'NORMAL',
          contactPhone: '0945678901',
          contactEmail: 'burns@vienbong.vn',
          bloodType: {
            id: 5,
            bloodGroup: 'O',
            componentType: '+',
            description: 'O+'
          }
        }
      }
    ];
    
    return HttpResponse.json(mockPledges);
  }),
];
