# \# Hệ Thống Quản Lý Hiến Máu (Blood Donation Management System)

# 

# \## 📋 Tổng Quan Dự Án

# 

# Đây là hệ thống quản lý hiến máu toàn diện được phát triển bằng \*\*React\*\* (Frontend) và \*\*Spring Boot\*\* (Backend), nhằm hỗ trợ quản lý quy trình hiến máu từ đăng ký, lập lịch, đến quản lý kho máu.

# 

# \## 🏗️ Kiến Trúc Hệ Thống

# 

# ```

# fullstack04/

# ├── frontendv3.03/          # React Frontend Application

# ├── backendv3.02/           # Spring Boot Backend API

# └── docs/                   # Tài liệu dự án

# ```

# 

# \## 🚀 Công Nghệ Sử Dụng

# 

# \### Frontend (frontendv3.03/)

# \- \*\*Framework\*\*: React 19.1.0 với Vite

# \- \*\*UI Library\*\*: Material-UI (MUI) 7.1.1

# \- \*\*Styling\*\*: TailwindCSS 3.4.17

# \- \*\*State Management\*\*: Zustand 5.0.5

# \- \*\*Data Fetching\*\*: TanStack React Query 5.79.0

# \- \*\*Routing\*\*: React Router DOM 7.6.1

# \- \*\*Form Handling\*\*: React Hook Form 7.57.0 + Formik 2.4.6

# \- \*\*Maps\*\*: Mapbox GL + React Map GL

# \- \*\*Charts\*\*: Recharts 3.0.2

# \- \*\*Notifications\*\*: React Hot Toast 2.5.2

# \- \*\*Real-time\*\*: Socket.IO Client 4.8.1

# 

# \### Backend (backendv3.02/)

# \- \*\*Framework\*\*: Spring Boot 3.5.0

# \- \*\*Database\*\*: SQL Server với Spring Data JPA

# \- \*\*Security\*\*: Spring Security + JWT

# \- \*\*Documentation\*\*: Spring Boot Validation

# \- \*\*Email\*\*: Spring Boot Mail

# \- \*\*File Storage\*\*: Cloudinary

# \- \*\*PDF Generation\*\*: iText HTML2PDF

# \- \*\*Build Tool\*\*: Maven

# 

# \## 🎯 Chức Năng Chính

# 

# \### 👤 Người Dùng

# 1\. \*\*Đăng ký/Đăng nhập\*\* với xác thực OTP

# 2\. \*\*Đặt lịch hiến máu\*\* với lựa chọn thời gian và địa điểm

# 3\. \*\*Theo dõi lịch sử hiến máu\*\* cá nhân

# 4\. \*\*Tìm kiếm người hiến máu\*\* gần đó

# 5\. \*\*Yêu cầu máu khẩn cấp\*\*

# 6\. \*\*Kiểm tra tương thích nhóm máu\*\*

# 7\. \*\*Xem blog y tế\*\* và thông tin sức khỏe

# 

# \### 👨‍💼 Quản Trị Viên

# 1\. \*\*Dashboard tổng quan\*\* với thống kê real-time

# 2\. \*\*Quản lý người dùng\*\* (CRUD operations)

# 3\. \*\*Quản lý lịch hẹn\*\* hiến máu

# 4\. \*\*Quản lý kho máu\*\* và tồn kho

# 5\. \*\*Quản lý yêu cầu khẩn cấp\*\*

# 6\. \*\*Quản lý blog\*\* và nội dung

# 7\. \*\*Báo cáo và phân tích\*\* dữ liệu

# 8\. \*\*Quản lý phòng\*\* và giường bệnh

# 

# \## 📊 Mô Hình Dữ Liệu Chính

# 

# \### Core Entities

# \- \*\*User\*\*: Thông tin người dùng và quyền hạn

# \- \*\*BloodType\*\*: Nhóm máu (A, B, AB, O) và Rh factor

# \- \*\*DonationAppointment\*\*: Lịch hẹn hiến máu

# \- \*\*BloodRequest\*\*: Yêu cầu máu khẩn cấp

# \- \*\*BloodUnit\*\*: Đơn vị máu trong kho

# \- \*\*HealthCheck\*\*: Kết quả kiểm tra sức khỏe

# \- \*\*BlogPost\*\*: Bài viết y tế

# 

# \## 🔐 Bảo Mật

# 

# \### Authentication \& Authorization

# \- \*\*JWT Token\*\* với refresh mechanism

# \- \*\*Role-based Access Control\*\* (USER, ADMIN)

# \- \*\*OTP Verification\*\* qua email

# \- \*\*Password Reset\*\* với token expiration

# \- \*\*CORS Configuration\*\* cho cross-origin requests

# 

# \### Data Protection

# \- \*\*Input Validation\*\* với Bean Validation

# \- \*\*SQL Injection Prevention\*\* với JPA

# \- \*\*XSS Protection\*\* với Content Security Policy

# \- \*\*File Upload Security\*\* với Cloudinary

# 

# \## 🌐 API Architecture

# 

# \### RESTful Endpoints

# ```

# /api/auth/\*          # Authentication endpoints

# /api/users/\*         # User management

# /api/appointments/\*  # Appointment management

# /api/blood-requests/\* # Blood request management

# /api/admin/\*         # Admin-only endpoints

# /api/analytics/\*     # Analytics and reports

# ```

# 

# \### Real-time Features

# \- \*\*Socket.IO\*\* cho notifications real-time

# \- \*\*Server-Sent Events\*\* cho live updates

# \- \*\*WebSocket\*\* cho chat support

# 

# \## 📱 Responsive Design

# 

# \- \*\*Mobile-First Approach\*\* với TailwindCSS

# \- \*\*Progressive Web App\*\* capabilities

# \- \*\*Offline Support\*\* với Service Workers

# \- \*\*Cross-browser Compatibility\*\*

# 

# \## 🧪 Testing Strategy

# 

# \### Frontend Testing

# \- \*\*Component Testing\*\* với React Testing Library

# \- \*\*E2E Testing\*\* với Cypress

# \- \*\*Unit Testing\*\* cho utilities và hooks

# 

# \### Backend Testing

# \- \*\*Unit Tests\*\* với JUnit 5

# \- \*\*Integration Tests\*\* với Spring Boot Test

# \- \*\*API Testing\*\* 

# 

# \## 📈 Performance Optimization

# 

# \### Frontend

# \- \*\*Code Splitting\*\* với React.lazy

# \- \*\*Image Optimization\*\* với Cloudinary

# \- \*\*Caching Strategy\*\* với React Query

# \- \*\*Bundle Optimization\*\* với Vite

# 

# \### Backend

# \- \*\*Database Indexing\*\* cho queries thường dùng

# \- \*\*Connection Pooling\*\* với HikariCP

# \- \*\*Caching\*\* với Spring Cache

# \- \*\*Pagination\*\* cho large datasets

# 

# \# Frontend

# cd frontendv3.03

# npm install

# npm run dev

# 

# \# Backend

# cd backendv3.02

# mvn spring-boot:run

# ```

# 

# \## 🤝 Đóng Góp

# 

# 1\. Fork repository

# 2\. Tạo feature branch

# 3\. Commit changes

# 4\. Push to branch

# 5\. Tạo Pull Request

# 

# \## 📄 License

# 

# Dự án này được phát triển cho mục đích giáo dục và nghiên cứu.

# 

# ---

# 

# \*\*Phát triển bởi\*\*: Nhóm HiCode  

# \*\*Phiên bản\*\*: 3.0  

# \*\*Cập nhật lần cuối\*\*: 2025

