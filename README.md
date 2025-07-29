
---

## 🚀 Công Nghệ Sử Dụng

### Frontend (frontendv3.03/)
- **Framework**: React 19.1.0 + Vite
- **UI Library**: Material-UI (MUI) 7.1.1
- **Styling**: TailwindCSS 3.4.17
- **State Management**: Zustand 5.0.5
- **Data Fetching**: TanStack React Query 5.79.0
- **Routing**: React Router DOM 7.6.1
- **Form Handling**: React Hook Form 7.57.0 + Formik 2.4.6
- **Maps**: Mapbox GL + React Map GL
- **Charts**: Recharts 3.0.2
- **Notifications**: React Hot Toast 2.5.2
- **Real-time**: Socket.IO Client 4.8.1

### Backend (backendv3.02/)
- **Framework**: Spring Boot 3.5.0
- **Database**: SQL Server + Spring Data JPA
- **Security**: Spring Security + JWT
- **Validation**: Spring Boot Validation
- **Email**: Spring Boot Mail
- **File Storage**: Cloudinary
- **PDF Generation**: iText HTML2PDF
- **Build Tool**: Maven

---

## 🎯 Chức Năng Chính

### 👤 Người Dùng
1. **Đăng ký/Đăng nhập** với xác thực OTP
2. **Đặt lịch hiến máu** theo thời gian & địa điểm
3. **Theo dõi lịch sử hiến máu**
4. **Tìm người hiến máu gần đây**
5. **Yêu cầu máu khẩn cấp**
6. **Kiểm tra tương thích nhóm máu**
7. **Xem blog y tế & thông tin sức khỏe**

### 👨‍💼 Quản Trị Viên
1. **Dashboard tổng quan** với thống kê real-time
2. **Quản lý người dùng** (CRUD)
3. **Quản lý lịch hẹn**
4. **Quản lý kho máu**
5. **Quản lý yêu cầu khẩn cấp**
6. **Quản lý nội dung blog**
7. **Báo cáo & phân tích dữ liệu**
8. **Quản lý phòng và giường bệnh**

---

## 📊 Mô Hình Dữ Liệu Chính

### Core Entities
- **User**: Thông tin & vai trò người dùng
- **BloodType**: Nhóm máu & Rh factor
- **DonationAppointment**: Lịch hẹn hiến máu
- **BloodRequest**: Yêu cầu máu khẩn cấp
- **BloodUnit**: Đơn vị máu
- **HealthCheck**: Kết quả khám sức khỏe
- **BlogPost**: Bài viết y tế

---

## 🔐 Bảo Mật

### Authentication & Authorization
- **JWT Token** có cơ chế refresh
- **Phân quyền Role-based**: USER / ADMIN
- **Xác minh OTP** qua email
- **Khôi phục mật khẩu** với token hết hạn
- **CORS Configuration** cho cross-origin requests

### Data Protection
- **Input Validation** với Bean Validation
- **Chống SQL Injection** với JPA
- **Chống XSS** với Content Security Policy
- **Bảo mật upload file** với Cloudinary

---

## 🌐 Kiến Trúc API

### RESTful Endpoints
