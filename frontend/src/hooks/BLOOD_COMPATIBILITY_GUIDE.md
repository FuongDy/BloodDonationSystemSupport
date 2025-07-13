# Hướng Dẫn Tương Thích Máu - Blood Compatibility Guide

## Tổng Quan
File này giải thích logic tương thích máu đã được implement trong `useBloodCompatibilityChecker.js` theo chuẩn y khoa quốc tế.

## Quy Tắc Tương Thích Máu

### 1. Whole Blood (Máu Toàn Phần) & Red Blood Cells (Hồng Cầu)
- **Giống nhau**: Cả hai đều tuân theo quy tắc ABO và Rh
- **Universal Donor**: O- (có thể cho tất cả)
- **Universal Recipient**: AB+ (có thể nhận từ tất cả)

**Quy tắc cụ thể:**
- O- → A+, A-, B+, B-, AB+, AB-, O+, O-
- O+ → A+, B+, AB+, O+
- A- → A+, A-, AB+, AB-
- A+ → A+, AB+
- B- → B+, B-, AB+, AB-
- B+ → B+, AB+
- AB- → AB+, AB-
- AB+ → AB+

### 2. Platelets (Tiểu Cầu)
- **Tuân theo quy tắc ABO/Rh giống RBC**
- **Universal Donor**: O- (có thể cho tất cả)
- **Universal Recipient**: AB+ (có thể nhận từ tất cả)

**Quy tắc cụ thể:**
- O- → A+, A-, B+, B-, AB+, AB-, O+, O-
- O+ → A+, B+, AB+, O+
- A- → A+, A-, AB+, AB-
- A+ → A+, AB+
- B- → B+, B-, AB+, AB-
- B+ → B+, AB+
- AB- → AB+, AB-
- AB+ → AB+

### 3. Plasma (Huyết Tương)
- **Ngược với RBC**: Tương thích dựa trên kháng thể
- **Universal Donor**: AB+ (có thể cho tất cả)
- **Universal Recipient**: O- (có thể nhận từ tất cả)

**Quy tắc cụ thể:**
- AB+ → A+, A-, B+, B-, AB+, AB-, O+, O-
- AB- → A-, B-, AB-, O-
- A+ → A+, O+
- A- → A+, A-, O+, O-
- B+ → B+, O+
- B- → B+, B-, O+, O-
- O+ → O+
- O- → O-

## Lý Do Y Khoa

### Red Blood Cells (RBC)
- Chứa kháng nguyên A, B trên bề mặt
- Người nhận không được có kháng thể chống lại kháng nguyên donor
- Rh- có thể cho Rh+, nhưng Rh+ không thể cho Rh-

### Plasma
- Chứa kháng thể anti-A, anti-B trong huyết tương
- Kháng thể của donor không được phản ứng với kháng nguyên người nhận
- Ngược với quy tắc RBC

### Platelets
- Tuân theo quy tắc ABO/Rh giống RBC
- Tuy nhiên trong thực tế lâm sàng, tiểu cầu có thể linh hoạt hơn

## Ghi Chú Implementation
- Tất cả data đã được chuyển sang static (không gọi API)
- Logic tương thích được hard-code theo chuẩn y khoa
- Hỗ trợ 4 loại thành phần máu: Whole Blood, Red Blood Cells, Platelets, Plasma
- Mỗi nhóm máu có đầy đủ 8 biến thể (A+, A-, B+, B-, AB+, AB-, O+, O-)

## Kiểm Tra Chất Lượng
✅ Whole Blood: Đúng quy tắc ABO/Rh
✅ Red Blood Cells: Đúng quy tắc ABO/Rh
✅ Platelets: Đúng quy tắc ABO/Rh
✅ Plasma: Đúng quy tắc ngược với RBC
✅ Universal Donors/Recipients: Đúng theo y khoa
✅ Rh compatibility: Đúng (Rh- có thể cho Rh+)

## Tài Liệu Tham Khảo
- American Red Cross Blood Compatibility Guidelines
- WHO Blood Transfusion Safety Guidelines
- AABB Technical Manual
