Phần A: Cài đặt ban đầu trên Postman
Tạo Environment:
Trong Postman, chọn tab Environments > Nhấn dấu +.
Đặt tên là "Blood Donation API Final".
Thêm 2 biến:
VARIABLE: baseURL -> INITIAL VALUE: http://localhost:8080
VARIABLE: authToken -> INITIAL VALUE: (để trống)
Nhấn Save.
Chọn Environment: Ở góc trên bên phải, đảm bảo bạn đã chọn "Blood Donation API Final" để sử dụng.

Phần B: Luồng của Khách vãng lai (Guest)
Đây là các hành động mà người dùng không cần đăng nhập có thể thực hiện.
1. Xem danh sách các loại máu
Ý nghĩa: Cho phép người dùng công khai tìm hiểu về các loại máu mà hệ thống quản lý.
API: GET {{baseURL}}/api/blood-types
Quyền: Public
2. Xem danh sách các quy tắc tương thích máu
Ý nghĩa: Cho phép người dùng công khai tra cứu khả năng cho/nhận máu.
API: GET {{baseURL}}/api/blood-compatibility
Quyền: Public
3. Đăng ký tài khoản mới
Ý nghĩa: Một người dùng mới tạo tài khoản để trở thành thành viên.
API: POST {{baseURL}}/api/auth/register
Quyền: Public
Dữ liệu mẫu (Body - raw/JSON):
 JSON
{
    "fullName": "Trần Văn Member",
    "email": "member@example.com",
    "password": "password123",
    "phone": "0905111222",
    "address": "123 Đường ABC, Quận 1, TP. HCM",
    "dateOfBirth": "1998-01-15",
    "bloodTypeId": 1
}



Phần C: Luồng của Thành viên (Member)
1. Đăng nhập và lấy Token
Ý nghĩa: Thành viên đăng nhập để truy cập các chức năng riêng tư.
API: POST {{baseURL}}/api/auth/login
Dữ liệu mẫu (Body - raw/JSON):
 JSON
{
    "email": "member@example.com",
    "password": "password123"
}


Tab Tests: Dán đoạn code sau để tự động lưu token vào biến authToken.
 JavaScript
var jsonData = pm.response.json();
if (jsonData.accessToken) {
    pm.environment.set("authToken", jsonData.accessToken);
}


Ghi chú: Từ bây giờ, các request cần quyền Member, bạn hãy vào tab Authorization, chọn Type = Bearer Token và điền {{authToken}}.
2. Quản lý hồ sơ cá nhân
Ý nghĩa: Thành viên xem và cập nhật thông tin của chính mình.
API để xem: GET {{baseURL}}/api/users/me/profile
API để cập nhật: PUT {{baseURL}}/api/users/me/profile
Dữ liệu mẫu để cập nhật (Body - raw/JSON):
 JSON
{
    "gender": "Male",
    "emergencyContact": "Mẹ - 0905111222"
}


3. Đăng ký tham gia hiến máu
Ý nghĩa: Bắt đầu một quy trình hiến máu mới.
API: POST {{baseURL}}/api/donations/request
Ghi chú: Không cần Body. API sẽ lấy thông tin user đang đăng nhập. Hãy ghi nhớ id của quy trình được trả về (ví dụ: id: 1).
4. Theo dõi trạng thái hiến máu
Ý nghĩa: Thành viên kiểm tra xem đơn đăng ký của mình đã được xử lý hay chưa và xem lịch hẹn (nếu có).
API: GET {{baseURL}}/api/donations/my-history
5. Đăng bài Blog và chờ duyệt
Ý nghĩa: Thành viên chia sẻ kinh nghiệm, câu chuyện của mình. Bài viết sẽ ở trạng thái chờ duyệt.
API: POST {{baseURL}}/api/blog-posts
Dữ liệu mẫu (Body - raw/JSON):
 JSON
{
    "title": "Kinh nghiệm hiến máu lần đầu của tôi",
    "content": "Đây là nội dung chi tiết của bài viết..."
}



Phần D: Luồng của Nhân viên (Staff)
Yêu cầu: Bạn cần tạo một tài khoản có vai trò Staff và đăng nhập để có authToken của Staff.
1. Duyệt đơn đăng ký hiến máu
Ý nghĩa: Staff chấp thuận một đơn đăng ký hợp lệ từ Member.
API: PUT {{baseURL}}/api/donations/requests/1/status (thay 1 bằng ID bạn đã ghi nhớ ở bước C3)
Body (raw/JSON):
 JSON
{
    "newStatus": "APPOINTMENT_PENDING",
    "note": "Hồ sơ hợp lệ, chờ xếp lịch hẹn."
}


2. Tạo lịch hẹn khám sàng lọc
Ý nghĩa: Staff xếp lịch hẹn cụ thể cho người hiến máu.
API: POST {{baseURL}}/api/appointments
Body (raw/JSON):
 JSON
{
    "processId": 1,
    "appointmentDateTime": "2025-07-25T09:00:00",
    "location": "Trung tâm hiến máu nhân đạo TP.HCM",
    "notes": "Vui lòng đến đúng giờ."
}


3. Ghi nhận kết quả khám sàng lọc và các bước sau
Ý nghĩa: Cập nhật toàn bộ quy trình tại điểm hiến máu.
API khám sàng lọc: POST {{baseURL}}/api/donations/1/health-check
API xác nhận lấy máu: POST {{baseURL}}/api/donations/1/collect (Body: {"collectedVolumeMl": 350})
API nhập kết quả xét nghiệm: POST {{baseURL}}/api/donations/1/test-result (Body: {"bloodUnitId": "VN2025-001", "isSafe": true})
4. Duyệt bài Blog
Ý nghĩa: Staff xem và duyệt các bài viết từ Member.
API xem bài chờ duyệt: GET {{baseURL}}/api/blog-posts/pending
API duyệt bài: PUT {{baseURL}}/api/blog-posts/1/approve (thay 1 bằng ID bài viết)
5. Quản lý kho máu
Ý nghĩa: Staff xem các đơn vị máu trong kho và các báo cáo.
API xem toàn bộ kho: GET {{baseURL}}/api/inventory
API xem thống kê: GET {{baseURL}}/api/inventory/summary
API xem máu mới nhập: GET {{baseURL}}/api/inventory/recent

Phần E: Luồng của Quản trị viên (Admin)
Yêu cầu: Cần token của tài khoản Admin.
1. Quản lý người dùng
Tạo User mới: POST {{baseURL}}/api/admin/users
Body:
 JSON
{
    "username": "newstaff01",
    "email": "staff01@example.com",
    "password": "password123",
    "roleName": "Staff",
    "fullName": "Nhân Viên Mới",
    "phone": "0987654321",
    "address": "Khu vực nhân viên",
    "dateOfBirth": "1995-01-01"
}


Xem danh sách User: GET {{baseURL}}/api/admin/users
Cập nhật User: PUT {{baseURL}}/api/admin/users/3 (Body: {"status": "SUSPENDED"})
Xóa (mềm) User: DELETE {{baseURL}}/api/admin/users/3
2. Quản lý dữ liệu hệ thống
Tạo Nhóm máu: POST {{baseURL}}/api/blood-types
Tạo Quy tắc tương thích: POST {{baseURL}}/api/blood-compatibility
...và các API PUT, DELETE tương ứng cho 2 mục trên.
Phần F: Luồng Yêu cầu Máu khẩn cấp & Tương tác của Member
Luồng này mô tả cách Staff tạo ra một yêu cầu cần máu, và cách Member tìm kiếm, xem chi tiết và đăng ký hiến máu cho yêu cầu đó.
1. (Staff) Tạo Yêu cầu cần máu khẩn cấp
Ý nghĩa: Khi một bệnh viện cần máu, Staff sẽ tạo một yêu cầu trên hệ thống để kêu gọi cộng đồng.
API: POST {{baseURL}}/api/blood-requests
Quyền: Staff / Admin (Cần authToken của Staff/Admin)
Dữ liệu mẫu (Body - raw/JSON):
 JSON
{
    "patientName": "Nguyễn Văn Cần Máu",
    "hospital": "Bệnh viện Chợ Rẫy",
    "bloodTypeId": 8,
    "quantityInUnits": 3,
    "urgency": "CRITICAL"
}


Kết quả mong đợi: Response 201 Created và trả về thông tin chi tiết của yêu cầu vừa tạo.
Ghi chú: Hãy ghi nhớ id của yêu cầu này (ví dụ: id: 1) để dùng cho các bước sau.
2. (Member) Tìm kiếm các Yêu cầu cần máu
Ý nghĩa: Member sau khi đăng nhập có thể tìm kiếm tất cả các yêu cầu đang ở trạng thái PENDING (đang cần người hiến).
API: GET {{baseURL}}/api/blood-requests/search/active
Quyền: Member (Cần authToken của Member)
Kết quả mong đợi: Một danh sách các yêu cầu máu đang hoạt động. Bạn sẽ thấy yêu cầu có id: 1 trong danh sách này.
3. (Member) Xem chi tiết Yêu cầu và số người đã đăng ký
Ý nghĩa: Trước khi quyết định, Member có thể xem thông tin chi tiết của một yêu cầu, bao gồm cả việc đã có bao nhiêu người khác đăng ký hiến.
API: GET {{baseURL}}/api/blood-requests/1 (thay 1 bằng ID của yêu cầu)
Quyền: Member
Kết quả mong đợi: Toàn bộ thông tin của BloodRequest. Hãy chú ý đến mảng pledges. Số lượng phần tử trong mảng này chính là "số người đăng kí hiến máu". Ban đầu, nó sẽ là một mảng rỗng [].
4. (Member) Đăng ký hiến máu cho Yêu cầu
Ý nghĩa: Member quyết định và cam kết sẽ hiến máu cho trường hợp khẩn cấp này.
API: POST {{baseURL}}/api/blood-requests/1/pledge (thay 1 bằng ID của yêu cầu)
Quyền: Member
Kết quả mong đợi: Response 201 Created và trả về thông tin của DonationPledge vừa được tạo, liên kết tài khoản của bạn và yêu cầu máu.
Logic tự động:
Nếu bạn gọi lại API ở bước 3 (GET /api/blood-requests/1), mảng pledges bây giờ sẽ có 1 phần tử.
Nếu yêu cầu này cần 3 đơn vị máu và đã có 3 người đăng ký, trạng thái của nó sẽ tự động chuyển thành FULFILLED và nó sẽ không còn xuất hiện trong kết quả tìm kiếm ở bước 2 nữa.


