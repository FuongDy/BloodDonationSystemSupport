// src/data/mockDetailData.js
export const mockAppointmentDetail = {
  id: 'APT001',
  status: 'CONFIRMED',
  createdAt: '2025-01-10T08:00:00Z',
  appointmentDate: '2025-01-15T00:00:00Z',
  appointmentTime: '2025-01-15T10:30:00Z',
  location: 'Bệnh viện Huyết học - FPT, Phòng hiến máu số 1',
  appointmentType: 'Hiến máu toàn phần',
  donor: {
    fullName: 'Nguyễn Văn An',
    email: 'nguyen.van.an@gmail.com',
    phoneNumber: '+84 987 654 321',
    bloodType: 'O+',
    age: 28,
    gender: 'Male'
  },
  notes: 'Người hiến có tiền sử hiến máu tốt, không có triệu chứng bất thường.',
  history: [
    {
      action: 'Tạo lịch hẹn',
      timestamp: '2025-01-10T08:00:00Z'
    },
    {
      action: 'Xác nhận lịch hẹn',
      timestamp: '2025-01-10T14:30:00Z'
    }
  ]
};

export const mockHealthCheckDetail = {
  id: 'HC001',
  status: 'PASSED',
  checkDate: '2025-01-15T10:45:00Z',
  doctorName: 'BS. Lê Thị Minh',
  doctorSpecialty: 'Nội tổng quát',
  donor: {
    fullName: 'Nguyễn Văn An',
    bloodType: 'O+',
    age: 28,
    gender: 'Male'
  },
  // Vital signs
  bloodPressure: '120/80',
  bloodPressureResult: 'NORMAL',
  heartRate: 75,
  heartRateResult: 'NORMAL',
  temperature: 36.5,
  temperatureResult: 'NORMAL',
  // Physical measurements
  height: 170,
  heightResult: 'NORMAL',
  weight: 68,
  weightResult: 'NORMAL',
  // Blood tests
  hemoglobin: 14.5,
  hemoglobinResult: 'NORMAL',
  hemoglobinNote: 'Trong giới hạn bình thường',
  hematocrit: 42,
  hematocritResult: 'NORMAL',
  conclusion: 'Đủ điều kiện hiến máu, sức khỏe tốt',
  notes: 'Người hiến có sức khỏe tổng quát tốt, các chỉ số đều trong giới hạn bình thường.',
  recommendations: 'Tiếp tục duy trì chế độ ăn uống lành mạnh và tập thể dục đều đặn.'
};

export const mockTestResultDetail = {
  id: 'TR001',
  overallStatus: 'PASSED',
  testDate: '2025-01-15T14:00:00Z',
  resultDate: '2025-01-16T16:30:00Z',
  laboratoryName: 'Phòng XN Trung tâm hiến máu',
  technicianName: 'KTV. Phạm Văn Bình',
  collectedVolumeMl: 450,
  donor: {
    fullName: 'Nguyễn Văn An',
    bloodType: 'O+',
    age: 28
  },
  tests: {
    // Infectious disease tests
    hiv: {
      result: 'NEGATIVE',
      value: null,
      note: 'Không phát hiện kháng thể HIV'
    },
    hepatitisB: {
      result: 'NEGATIVE',
      value: null,
      note: 'Không phát hiện HBsAg'
    },
    hepatitisC: {
      result: 'NEGATIVE',
      value: null,
      note: 'Không phát hiện kháng thể HCV'
    },
    syphilis: {
      result: 'NEGATIVE',
      value: null,
      note: 'VDRL âm tính'
    },
    malaria: {
      result: 'NEGATIVE',
      value: null,
      note: 'Không phát hiện ký sinh trùng sốt rét'
    },
    // Hematology tests
    completeBloodCount: {
      result: 'NORMAL',
      value: 'Bình thường',
      note: 'Công thức máu trong giới hạn bình thường'
    },
    hemoglobin: {
      result: 'NORMAL',
      value: '14.5',
      unit: 'g/dL',
      referenceRange: '12.0-16.0',
      note: 'Nồng độ hemoglobin tốt'
    },
    hematocrit: {
      result: 'NORMAL',
      value: '42',
      unit: '%',
      referenceRange: '36-48',
      note: 'Tỉ lệ hematocrit bình thường'
    },
    plateletCount: {
      result: 'NORMAL',
      value: '280',
      unit: '×10³/μL',
      referenceRange: '150-400',
      note: 'Số lượng tiểu cầu đủ'
    },
    whiteBloodCells: {
      result: 'NORMAL',
      value: '6.8',
      unit: '×10³/μL',
      referenceRange: '4.0-10.0',
      note: 'Số lượng bạch cầu bình thường'
    },
    // Biochemistry tests
    alt: {
      result: 'NORMAL',
      value: '25',
      unit: 'U/L',
      referenceRange: '7-40',
      note: 'Chức năng gan tốt'
    },
    ast: {
      result: 'NORMAL',
      value: '22',
      unit: 'U/L',
      referenceRange: '10-40',
      note: 'Chức năng gan tốt'
    },
    totalProtein: {
      result: 'NORMAL',
      value: '7.2',
      unit: 'g/dL',
      referenceRange: '6.0-8.3',
      note: 'Protein tổng bình thường'
    },
    albumin: {
      result: 'NORMAL',
      value: '4.1',
      unit: 'g/dL',
      referenceRange: '3.5-5.0',
      note: 'Albumin trong giới hạn bình thường'
    }
  },
  overallNotes: 'Tất cả các xét nghiệm đều cho kết quả âm tính với các bệnh truyền nhiễm và các chỉ số huyết học, sinh hóa đều trong giới hạn bình thường.',
  qualityAssurance: 'Mẫu được xử lý theo quy trình chuẩn ISO 15189. Kết quả đã được kiểm soát chất lượng nội bộ và ngoại bộ.'
};
