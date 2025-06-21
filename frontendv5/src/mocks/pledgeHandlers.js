import { http, HttpResponse } from 'msw';
import { API_URL } from '../config';

// Mock data cho pledges
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

export const pledgeHandlers = [
  // GET /api/users/me/pledges - Lấy danh sách pledges của user hiện tại
  http.get(`${API_URL}/users/me/pledges`, () => {
    console.log('🩸 Mock: Fetching user pledges...');
    
    return HttpResponse.json(mockPledges, { 
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }),

  // POST /api/blood-requests/:id/pledge - Tạo pledge mới (nếu cần)
  http.post(`${API_URL}/blood-requests/:requestId/pledge`, ({ params }) => {
    const { requestId } = params;
    console.log(`🩸 Mock: Creating pledge for blood request ${requestId}...`);
    
    const newPledge = {
      id: Date.now(),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      bloodRequest: {
        id: parseInt(requestId),
        description: 'Yêu cầu hiến máu mới',
        quantityNeeded: 1,
        location: 'Bệnh viện ABC',
        neededBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'NORMAL',
        contactPhone: '0900000000',
        contactEmail: 'contact@hospital.vn',
        bloodType: {
          id: 1,
          bloodGroup: 'A',
          componentType: '+',
          description: 'A+'
        }
      }
    };
    
    // Add to mock data
    mockPledges.unshift(newPledge);
    
    return HttpResponse.json(newPledge, { status: 201 });
  }),
  // PUT /api/pledges/:id - Cập nhật trạng thái pledge (nếu cần)
  http.put(`${API_URL}/pledges/:pledgeId`, async ({ params, request }) => {
    const { pledgeId } = params;
    const body = await request.json();
    console.log(`🩸 Mock: Updating pledge ${pledgeId}...`);
    
    const pledgeIndex = mockPledges.findIndex(p => p.id === parseInt(pledgeId));
    if (pledgeIndex === -1) {
      return HttpResponse.json(
        { message: 'Pledge not found' },
        { status: 404 }
      );
    }
    
    // Update the pledge status
    mockPledges[pledgeIndex] = {
      ...mockPledges[pledgeIndex],
      ...body
    };
    
    return HttpResponse.json(mockPledges[pledgeIndex]);
  })
];

// Export đã được định nghĩa ở trên với export const
