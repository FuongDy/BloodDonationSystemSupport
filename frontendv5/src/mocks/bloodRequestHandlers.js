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
  }),
  // Get user's pledges
  http.get(`${API_URL}/users/me/pledges`, () => {
    try {
      // Filter requests that have pledges from current user (mock user id: 3)
      const userPledges = [];
      
      mockBloodRequests.forEach(request => {
        if (request.pledges && Array.isArray(request.pledges) && request.pledges.length > 0) {
          const userPledge = request.pledges.find(pledge => pledge.donor && pledge.donor.id === 3);
          if (userPledge) {
            userPledges.push({
              ...userPledge,
              bloodRequest: request
            });
          }
        }
      });
      
      return HttpResponse.json({
        data: userPledges,
        message: 'User pledges retrieved successfully (MSW)',
      });
    } catch (error) {
      console.error('MSW Error in getUserPledges:', error);
      return HttpResponse.json(
        { message: 'Error retrieving user pledges (MSW)', error: error.message },
        { status: 500 }
      );
    }
  }),
];
