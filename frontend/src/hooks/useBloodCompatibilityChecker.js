// src/hooks/useBloodCompatibilityChecker.js
import { useCallback, useEffect, useState } from 'react';

// Static data for blood compatibility
const STATIC_BLOOD_TYPES = [
  // Máu toàn phần
  { id: 1, bloodGroup: 'A+', componentType: 'Máu toàn phần', description: 'Máu toàn phần A+' },
  { id: 2, bloodGroup: 'A-', componentType: 'Máu toàn phần', description: 'Máu toàn phần A-' },
  { id: 3, bloodGroup: 'B+', componentType: 'Máu toàn phần', description: 'Máu toàn phần B+' },
  { id: 4, bloodGroup: 'B-', componentType: 'Máu toàn phần', description: 'Máu toàn phần B-' },
  { id: 5, bloodGroup: 'AB+', componentType: 'Máu toàn phần', description: 'Máu toàn phần AB+' },
  { id: 6, bloodGroup: 'AB-', componentType: 'Máu toàn phần', description: 'Máu toàn phần AB-' },
  { id: 7, bloodGroup: 'O+', componentType: 'Máu toàn phần', description: 'Máu toàn phần O+' },
  { id: 8, bloodGroup: 'O-', componentType: 'Máu toàn phần', description: 'Máu toàn phần O-' },
  
  // Hồng cầu
  { id: 9, bloodGroup: 'A+', componentType: 'Hồng cầu', description: 'Hồng cầu A+' },
  { id: 10, bloodGroup: 'A-', componentType: 'Hồng cầu', description: 'Hồng cầu A-' },
  { id: 11, bloodGroup: 'B+', componentType: 'Hồng cầu', description: 'Hồng cầu B+' },
  { id: 12, bloodGroup: 'B-', componentType: 'Hồng cầu', description: 'Hồng cầu B-' },
  { id: 13, bloodGroup: 'AB+', componentType: 'Hồng cầu', description: 'Hồng cầu AB+' },
  { id: 14, bloodGroup: 'AB-', componentType: 'Hồng cầu', description: 'Hồng cầu AB-' },
  { id: 15, bloodGroup: 'O+', componentType: 'Hồng cầu', description: 'Hồng cầu O+' },
  { id: 16, bloodGroup: 'O-', componentType: 'Hồng cầu', description: 'Hồng cầu O-' },
  
  // Tiểu cầu
  { id: 17, bloodGroup: 'A+', componentType: 'Tiểu cầu', description: 'Tiểu cầu A+' },
  { id: 18, bloodGroup: 'A-', componentType: 'Tiểu cầu', description: 'Tiểu cầu A-' },
  { id: 19, bloodGroup: 'B+', componentType: 'Tiểu cầu', description: 'Tiểu cầu B+' },
  { id: 20, bloodGroup: 'B-', componentType: 'Tiểu cầu', description: 'Tiểu cầu B-' },
  { id: 21, bloodGroup: 'AB+', componentType: 'Tiểu cầu', description: 'Tiểu cầu AB+' },
  { id: 22, bloodGroup: 'AB-', componentType: 'Tiểu cầu', description: 'Tiểu cầu AB-' },
  { id: 23, bloodGroup: 'O+', componentType: 'Tiểu cầu', description: 'Tiểu cầu O+' },
  { id: 24, bloodGroup: 'O-', componentType: 'Tiểu cầu', description: 'Tiểu cầu O-' },
  
  // Huyết tương
  { id: 25, bloodGroup: 'A+', componentType: 'Huyết tương', description: 'Huyết tương A+' },
  { id: 26, bloodGroup: 'A-', componentType: 'Huyết tương', description: 'Huyết tương A-' },
  { id: 27, bloodGroup: 'B+', componentType: 'Huyết tương', description: 'Huyết tương B+' },
  { id: 28, bloodGroup: 'B-', componentType: 'Huyết tương', description: 'Huyết tương B-' },
  { id: 29, bloodGroup: 'AB+', componentType: 'Huyết tương', description: 'Huyết tương AB+' },
  { id: 30, bloodGroup: 'AB-', componentType: 'Huyết tương', description: 'Huyết tương AB-' },
  { id: 31, bloodGroup: 'O+', componentType: 'Huyết tương', description: 'Huyết tương O+' },
  { id: 32, bloodGroup: 'O-', componentType: 'Huyết tương', description: 'Huyết tương O-' },
];

// Static compatibility rules - Đúng theo y khoa thực tế
const STATIC_COMPATIBILITY_RULES = [
  // ===== TƯƠNG THÍCH MÁU TOÀN PHẦN =====
  // O- (Người hiến máu vạn năng cho Hồng cầu) - Có thể hiến cho tất cả
  { id: 1, donorBloodType: { id: 8, description: 'Máu toàn phần O-' }, recipientBloodType: { id: 1, description: 'Máu toàn phần A+' }, isCompatible: true },
  { id: 2, donorBloodType: { id: 8, description: 'Máu toàn phần O-' }, recipientBloodType: { id: 2, description: 'Máu toàn phần A-' }, isCompatible: true },
  { id: 3, donorBloodType: { id: 8, description: 'Máu toàn phần O-' }, recipientBloodType: { id: 3, description: 'Máu toàn phần B+' }, isCompatible: true },
  { id: 4, donorBloodType: { id: 8, description: 'Máu toàn phần O-' }, recipientBloodType: { id: 4, description: 'Máu toàn phần B-' }, isCompatible: true },
  { id: 5, donorBloodType: { id: 8, description: 'Máu toàn phần O-' }, recipientBloodType: { id: 5, description: 'Máu toàn phần AB+' }, isCompatible: true },
  { id: 6, donorBloodType: { id: 8, description: 'Máu toàn phần O-' }, recipientBloodType: { id: 6, description: 'Máu toàn phần AB-' }, isCompatible: true },
  { id: 7, donorBloodType: { id: 8, description: 'Máu toàn phần O-' }, recipientBloodType: { id: 7, description: 'Máu toàn phần O+' }, isCompatible: true },
  { id: 8, donorBloodType: { id: 8, description: 'Máu toàn phần O-' }, recipientBloodType: { id: 8, description: 'Máu toàn phần O-' }, isCompatible: true },
  
  // O+ - Có thể hiến cho các nhóm máu Rh+ (A+, B+, AB+, O+)
  { id: 9, donorBloodType: { id: 7, description: 'Máu toàn phần O+' }, recipientBloodType: { id: 1, description: 'Máu toàn phần A+' }, isCompatible: true },
  { id: 10, donorBloodType: { id: 7, description: 'Máu toàn phần O+' }, recipientBloodType: { id: 3, description: 'Máu toàn phần B+' }, isCompatible: true },
  { id: 11, donorBloodType: { id: 7, description: 'Máu toàn phần O+' }, recipientBloodType: { id: 5, description: 'Máu toàn phần AB+' }, isCompatible: true },
  { id: 12, donorBloodType: { id: 7, description: 'Máu toàn phần O+' }, recipientBloodType: { id: 7, description: 'Máu toàn phần O+' }, isCompatible: true },
  
  // A- - Có thể hiến cho A+, A-, AB+, AB-
  { id: 13, donorBloodType: { id: 2, description: 'Máu toàn phần A-' }, recipientBloodType: { id: 1, description: 'Máu toàn phần A+' }, isCompatible: true },
  { id: 14, donorBloodType: { id: 2, description: 'Máu toàn phần A-' }, recipientBloodType: { id: 2, description: 'Máu toàn phần A-' }, isCompatible: true },
  { id: 15, donorBloodType: { id: 2, description: 'Máu toàn phần A-' }, recipientBloodType: { id: 5, description: 'Máu toàn phần AB+' }, isCompatible: true },
  { id: 16, donorBloodType: { id: 2, description: 'Máu toàn phần A-' }, recipientBloodType: { id: 6, description: 'Máu toàn phần AB-' }, isCompatible: true },
  
  // A+ - Có thể hiến cho A+, AB+
  { id: 17, donorBloodType: { id: 1, description: 'Máu toàn phần A+' }, recipientBloodType: { id: 1, description: 'Máu toàn phần A+' }, isCompatible: true },
  { id: 18, donorBloodType: { id: 1, description: 'Máu toàn phần A+' }, recipientBloodType: { id: 5, description: 'Máu toàn phần AB+' }, isCompatible: true },
  
  // B- - Có thể hiến cho B+, B-, AB+, AB-
  { id: 19, donorBloodType: { id: 4, description: 'Máu toàn phần B-' }, recipientBloodType: { id: 3, description: 'Máu toàn phần B+' }, isCompatible: true },
  { id: 20, donorBloodType: { id: 4, description: 'Máu toàn phần B-' }, recipientBloodType: { id: 4, description: 'Máu toàn phần B-' }, isCompatible: true },
  { id: 21, donorBloodType: { id: 4, description: 'Máu toàn phần B-' }, recipientBloodType: { id: 5, description: 'Máu toàn phần AB+' }, isCompatible: true },
  { id: 22, donorBloodType: { id: 4, description: 'Máu toàn phần B-' }, recipientBloodType: { id: 6, description: 'Máu toàn phần AB-' }, isCompatible: true },
  
  // B+ - Có thể hiến cho B+, AB+
  { id: 23, donorBloodType: { id: 3, description: 'Máu toàn phần B+' }, recipientBloodType: { id: 3, description: 'Máu toàn phần B+' }, isCompatible: true },
  { id: 24, donorBloodType: { id: 3, description: 'Máu toàn phần B+' }, recipientBloodType: { id: 5, description: 'Máu toàn phần AB+' }, isCompatible: true },
  
  // AB- - Có thể hiến cho AB+, AB-
  { id: 25, donorBloodType: { id: 6, description: 'Máu toàn phần AB-' }, recipientBloodType: { id: 5, description: 'Máu toàn phần AB+' }, isCompatible: true },
  { id: 26, donorBloodType: { id: 6, description: 'Máu toàn phần AB-' }, recipientBloodType: { id: 6, description: 'Máu toàn phần AB-' }, isCompatible: true },
  
  // AB+ - Chỉ có thể hiến cho AB+ (Người nhận máu vạn năng)
  { id: 27, donorBloodType: { id: 5, description: 'Máu toàn phần AB+' }, recipientBloodType: { id: 5, description: 'Máu toàn phần AB+' }, isCompatible: true },

  // ===== TƯƠNG THÍCH HỒNG CẦU (Giống Máu toàn phần) =====
  // O- Hồng cầu (Người hiến máu vạn năng)
  { id: 28, donorBloodType: { id: 16, description: 'Hồng cầu O-' }, recipientBloodType: { id: 9, description: 'Hồng cầu A+' }, isCompatible: true },
  { id: 29, donorBloodType: { id: 16, description: 'Hồng cầu O-' }, recipientBloodType: { id: 10, description: 'Hồng cầu A-' }, isCompatible: true },
  { id: 30, donorBloodType: { id: 16, description: 'Hồng cầu O-' }, recipientBloodType: { id: 11, description: 'Hồng cầu B+' }, isCompatible: true },
  { id: 31, donorBloodType: { id: 16, description: 'Hồng cầu O-' }, recipientBloodType: { id: 12, description: 'Hồng cầu B-' }, isCompatible: true },
  { id: 32, donorBloodType: { id: 16, description: 'Hồng cầu O-' }, recipientBloodType: { id: 13, description: 'Hồng cầu AB+' }, isCompatible: true },
  { id: 33, donorBloodType: { id: 16, description: 'Hồng cầu O-' }, recipientBloodType: { id: 14, description: 'Hồng cầu AB-' }, isCompatible: true },
  { id: 34, donorBloodType: { id: 16, description: 'Hồng cầu O-' }, recipientBloodType: { id: 15, description: 'Hồng cầu O+' }, isCompatible: true },
  { id: 35, donorBloodType: { id: 16, description: 'Hồng cầu O-' }, recipientBloodType: { id: 16, description: 'Hồng cầu O-' }, isCompatible: true },
  
  // O+ Hồng cầu
  { id: 36, donorBloodType: { id: 15, description: 'Hồng cầu O+' }, recipientBloodType: { id: 9, description: 'Hồng cầu A+' }, isCompatible: true },
  { id: 37, donorBloodType: { id: 15, description: 'Hồng cầu O+' }, recipientBloodType: { id: 11, description: 'Hồng cầu B+' }, isCompatible: true },
  { id: 38, donorBloodType: { id: 15, description: 'Hồng cầu O+' }, recipientBloodType: { id: 13, description: 'Hồng cầu AB+' }, isCompatible: true },
  { id: 39, donorBloodType: { id: 15, description: 'Hồng cầu O+' }, recipientBloodType: { id: 15, description: 'Hồng cầu O+' }, isCompatible: true },
  
  // A- Hồng cầu
  { id: 40, donorBloodType: { id: 10, description: 'Hồng cầu A-' }, recipientBloodType: { id: 9, description: 'Hồng cầu A+' }, isCompatible: true },
  { id: 41, donorBloodType: { id: 10, description: 'Hồng cầu A-' }, recipientBloodType: { id: 10, description: 'Hồng cầu A-' }, isCompatible: true },
  { id: 42, donorBloodType: { id: 10, description: 'Hồng cầu A-' }, recipientBloodType: { id: 13, description: 'Hồng cầu AB+' }, isCompatible: true },
  { id: 43, donorBloodType: { id: 10, description: 'Hồng cầu A-' }, recipientBloodType: { id: 14, description: 'Hồng cầu AB-' }, isCompatible: true },
  
  // A+ Hồng cầu
  { id: 44, donorBloodType: { id: 9, description: 'Hồng cầu A+' }, recipientBloodType: { id: 9, description: 'Hồng cầu A+' }, isCompatible: true },
  { id: 45, donorBloodType: { id: 9, description: 'Hồng cầu A+' }, recipientBloodType: { id: 13, description: 'Hồng cầu AB+' }, isCompatible: true },
  
  // B- Hồng cầu
  { id: 46, donorBloodType: { id: 12, description: 'Hồng cầu B-' }, recipientBloodType: { id: 11, description: 'Hồng cầu B+' }, isCompatible: true },
  { id: 47, donorBloodType: { id: 12, description: 'Hồng cầu B-' }, recipientBloodType: { id: 12, description: 'Hồng cầu B-' }, isCompatible: true },
  { id: 48, donorBloodType: { id: 12, description: 'Hồng cầu B-' }, recipientBloodType: { id: 13, description: 'Hồng cầu AB+' }, isCompatible: true },
  { id: 49, donorBloodType: { id: 12, description: 'Hồng cầu B-' }, recipientBloodType: { id: 14, description: 'Hồng cầu AB-' }, isCompatible: true },
  
  // B+ Hồng cầu
  { id: 50, donorBloodType: { id: 11, description: 'Hồng cầu B+' }, recipientBloodType: { id: 11, description: 'Hồng cầu B+' }, isCompatible: true },
  { id: 51, donorBloodType: { id: 11, description: 'Hồng cầu B+' }, recipientBloodType: { id: 13, description: 'Hồng cầu AB+' }, isCompatible: true },
  
  // AB- Hồng cầu
  { id: 52, donorBloodType: { id: 14, description: 'Hồng cầu AB-' }, recipientBloodType: { id: 13, description: 'Hồng cầu AB+' }, isCompatible: true },
  { id: 53, donorBloodType: { id: 14, description: 'Hồng cầu AB-' }, recipientBloodType: { id: 14, description: 'Hồng cầu AB-' }, isCompatible: true },
  
  // AB+ Hồng cầu (Người nhận máu vạn năng)
  { id: 54, donorBloodType: { id: 13, description: 'Hồng cầu AB+' }, recipientBloodType: { id: 13, description: 'Hồng cầu AB+' }, isCompatible: true },

  // ===== TƯƠNG THÍCH TIỂU CẦU (Giống như Hồng cầu - dựa trên ABO và Rh) =====
  // O- Tiểu cầu (Người hiến máu vạn năng cho Tiểu cầu)
  { id: 55, donorBloodType: { id: 24, description: 'Tiểu cầu O-' }, recipientBloodType: { id: 17, description: 'Tiểu cầu A+' }, isCompatible: true },
  { id: 56, donorBloodType: { id: 24, description: 'Tiểu cầu O-' }, recipientBloodType: { id: 18, description: 'Tiểu cầu A-' }, isCompatible: true },
  { id: 57, donorBloodType: { id: 24, description: 'Tiểu cầu O-' }, recipientBloodType: { id: 19, description: 'Tiểu cầu B+' }, isCompatible: true },
  { id: 58, donorBloodType: { id: 24, description: 'Tiểu cầu O-' }, recipientBloodType: { id: 20, description: 'Tiểu cầu B-' }, isCompatible: true },
  { id: 59, donorBloodType: { id: 24, description: 'Tiểu cầu O-' }, recipientBloodType: { id: 21, description: 'Tiểu cầu AB+' }, isCompatible: true },
  { id: 60, donorBloodType: { id: 24, description: 'Tiểu cầu O-' }, recipientBloodType: { id: 22, description: 'Tiểu cầu AB-' }, isCompatible: true },
  { id: 61, donorBloodType: { id: 24, description: 'Tiểu cầu O-' }, recipientBloodType: { id: 23, description: 'Tiểu cầu O+' }, isCompatible: true },
  { id: 62, donorBloodType: { id: 24, description: 'Tiểu cầu O-' }, recipientBloodType: { id: 24, description: 'Tiểu cầu O-' }, isCompatible: true },
  
  // O+ Tiểu cầu
  { id: 63, donorBloodType: { id: 23, description: 'Tiểu cầu O+' }, recipientBloodType: { id: 17, description: 'Tiểu cầu A+' }, isCompatible: true },
  { id: 64, donorBloodType: { id: 23, description: 'Tiểu cầu O+' }, recipientBloodType: { id: 19, description: 'Tiểu cầu B+' }, isCompatible: true },
  { id: 65, donorBloodType: { id: 23, description: 'Tiểu cầu O+' }, recipientBloodType: { id: 21, description: 'Tiểu cầu AB+' }, isCompatible: true },
  { id: 66, donorBloodType: { id: 23, description: 'Tiểu cầu O+' }, recipientBloodType: { id: 23, description: 'Tiểu cầu O+' }, isCompatible: true },
  
  // A- Tiểu cầu
  { id: 67, donorBloodType: { id: 18, description: 'Tiểu cầu A-' }, recipientBloodType: { id: 17, description: 'Tiểu cầu A+' }, isCompatible: true },
  { id: 68, donorBloodType: { id: 18, description: 'Tiểu cầu A-' }, recipientBloodType: { id: 18, description: 'Tiểu cầu A-' }, isCompatible: true },
  { id: 69, donorBloodType: { id: 18, description: 'Tiểu cầu A-' }, recipientBloodType: { id: 21, description: 'Tiểu cầu AB+' }, isCompatible: true },
  { id: 70, donorBloodType: { id: 18, description: 'Tiểu cầu A-' }, recipientBloodType: { id: 22, description: 'Tiểu cầu AB-' }, isCompatible: true },
  
  // A+ Tiểu cầu
  { id: 71, donorBloodType: { id: 17, description: 'Tiểu cầu A+' }, recipientBloodType: { id: 17, description: 'Tiểu cầu A+' }, isCompatible: true },
  { id: 72, donorBloodType: { id: 17, description: 'Tiểu cầu A+' }, recipientBloodType: { id: 21, description: 'Tiểu cầu AB+' }, isCompatible: true },
  
  // B- Tiểu cầu
  { id: 73, donorBloodType: { id: 20, description: 'Tiểu cầu B-' }, recipientBloodType: { id: 19, description: 'Tiểu cầu B+' }, isCompatible: true },
  { id: 74, donorBloodType: { id: 20, description: 'Tiểu cầu B-' }, recipientBloodType: { id: 20, description: 'Tiểu cầu B-' }, isCompatible: true },
  { id: 75, donorBloodType: { id: 20, description: 'Tiểu cầu B-' }, recipientBloodType: { id: 21, description: 'Tiểu cầu AB+' }, isCompatible: true },
  { id: 76, donorBloodType: { id: 20, description: 'Tiểu cầu B-' }, recipientBloodType: { id: 22, description: 'Tiểu cầu AB-' }, isCompatible: true },
  
  // B+ Tiểu cầu
  { id: 77, donorBloodType: { id: 19, description: 'Tiểu cầu B+' }, recipientBloodType: { id: 19, description: 'Tiểu cầu B+' }, isCompatible: true },
  { id: 78, donorBloodType: { id: 19, description: 'Tiểu cầu B+' }, recipientBloodType: { id: 21, description: 'Tiểu cầu AB+' }, isCompatible: true },
  
  // AB- Tiểu cầu
  { id: 79, donorBloodType: { id: 22, description: 'Tiểu cầu AB-' }, recipientBloodType: { id: 21, description: 'Tiểu cầu AB+' }, isCompatible: true },
  { id: 80, donorBloodType: { id: 22, description: 'Tiểu cầu AB-' }, recipientBloodType: { id: 22, description: 'Tiểu cầu AB-' }, isCompatible: true },
  
  // AB+ Tiểu cầu (Người nhận máu vạn năng cho Tiểu cầu)
  { id: 81, donorBloodType: { id: 21, description: 'Tiểu cầu AB+' }, recipientBloodType: { id: 21, description: 'Tiểu cầu AB+' }, isCompatible: true },

  // ===== TƯƠNG THÍCH HUYẾT TƯƠNG (Ngược với Hồng cầu - O có thể nhận từ tất cả, AB chỉ cho AB) =====
  // AB+ Huyết tương (Người hiến máu vạn năng cho Huyết tương)
  { id: 82, donorBloodType: { id: 29, description: 'Huyết tương AB+' }, recipientBloodType: { id: 25, description: 'Huyết tương A+' }, isCompatible: true },
  { id: 83, donorBloodType: { id: 29, description: 'Huyết tương AB+' }, recipientBloodType: { id: 26, description: 'Huyết tương A-' }, isCompatible: true },
  { id: 84, donorBloodType: { id: 29, description: 'Huyết tương AB+' }, recipientBloodType: { id: 27, description: 'Huyết tương B+' }, isCompatible: true },
  { id: 85, donorBloodType: { id: 29, description: 'Huyết tương AB+' }, recipientBloodType: { id: 28, description: 'Huyết tương B-' }, isCompatible: true },
  { id: 86, donorBloodType: { id: 29, description: 'Huyết tương AB+' }, recipientBloodType: { id: 29, description: 'Huyết tương AB+' }, isCompatible: true },
  { id: 87, donorBloodType: { id: 29, description: 'Huyết tương AB+' }, recipientBloodType: { id: 30, description: 'Huyết tương AB-' }, isCompatible: true },
  { id: 88, donorBloodType: { id: 29, description: 'Huyết tương AB+' }, recipientBloodType: { id: 31, description: 'Huyết tương O+' }, isCompatible: true },
  { id: 89, donorBloodType: { id: 29, description: 'Huyết tương AB+' }, recipientBloodType: { id: 32, description: 'Huyết tương O-' }, isCompatible: true },
  
  // AB- Huyết tương
  { id: 90, donorBloodType: { id: 30, description: 'Huyết tương AB-' }, recipientBloodType: { id: 26, description: 'Huyết tương A-' }, isCompatible: true },
  { id: 91, donorBloodType: { id: 30, description: 'Huyết tương AB-' }, recipientBloodType: { id: 28, description: 'Huyết tương B-' }, isCompatible: true },
  { id: 92, donorBloodType: { id: 30, description: 'Huyết tương AB-' }, recipientBloodType: { id: 30, description: 'Huyết tương AB-' }, isCompatible: true },
  { id: 93, donorBloodType: { id: 30, description: 'Huyết tương AB-' }, recipientBloodType: { id: 32, description: 'Huyết tương O-' }, isCompatible: true },
  
  // A+ Huyết tương
  { id: 94, donorBloodType: { id: 25, description: 'Huyết tương A+' }, recipientBloodType: { id: 25, description: 'Huyết tương A+' }, isCompatible: true },
  { id: 95, donorBloodType: { id: 25, description: 'Huyết tương A+' }, recipientBloodType: { id: 31, description: 'Huyết tương O+' }, isCompatible: true },
  
  // A- Huyết tương
  { id: 96, donorBloodType: { id: 26, description: 'Huyết tương A-' }, recipientBloodType: { id: 25, description: 'Huyết tương A+' }, isCompatible: true },
  { id: 97, donorBloodType: { id: 26, description: 'Huyết tương A-' }, recipientBloodType: { id: 26, description: 'Huyết tương A-' }, isCompatible: true },
  { id: 98, donorBloodType: { id: 26, description: 'Huyết tương A-' }, recipientBloodType: { id: 31, description: 'Huyết tương O+' }, isCompatible: true },
  { id: 99, donorBloodType: { id: 26, description: 'Huyết tương A-' }, recipientBloodType: { id: 32, description: 'Huyết tương O-' }, isCompatible: true },
  
  // B+ Huyết tương
  { id: 100, donorBloodType: { id: 27, description: 'Huyết tương B+' }, recipientBloodType: { id: 27, description: 'Huyết tương B+' }, isCompatible: true },
  { id: 101, donorBloodType: { id: 27, description: 'Huyết tương B+' }, recipientBloodType: { id: 31, description: 'Huyết tương O+' }, isCompatible: true },
  
  // B- Huyết tương
  { id: 102, donorBloodType: { id: 28, description: 'Huyết tương B-' }, recipientBloodType: { id: 27, description: 'Huyết tương B+' }, isCompatible: true },
  { id: 103, donorBloodType: { id: 28, description: 'Huyết tương B-' }, recipientBloodType: { id: 28, description: 'Huyết tương B-' }, isCompatible: true },
  { id: 104, donorBloodType: { id: 28, description: 'Huyết tương B-' }, recipientBloodType: { id: 31, description: 'Huyết tương O+' }, isCompatible: true },
  { id: 105, donorBloodType: { id: 28, description: 'Huyết tương B-' }, recipientBloodType: { id: 32, description: 'Huyết tương O-' }, isCompatible: true },
  
  // O+ Huyết tương (Người nhận máu vạn năng cho Huyết tương)
  { id: 106, donorBloodType: { id: 31, description: 'Huyết tương O+' }, recipientBloodType: { id: 31, description: 'Huyết tương O+' }, isCompatible: true },
  
  // O- Huyết tương (Người nhận máu vạn năng cho Huyết tương)
  { id: 107, donorBloodType: { id: 32, description: 'Huyết tương O-' }, recipientBloodType: { id: 32, description: 'Huyết tương O-' }, isCompatible: true },
];

export const useBloodCompatibilityChecker = () => {
  // State quản lý tab chính và tab phụ
  const [activeTab, setActiveTab] = useState('compatibility');
  const [activeSubTab, setActiveSubTab] = useState('whole');

  // State cho dữ liệu tĩnh
  const [allBloodTypes, setAllBloodTypes] = useState(STATIC_BLOOD_TYPES);
  const [compatibilityRules, setCompatibilityRules] = useState(STATIC_COMPATIBILITY_RULES);
  const [isLoading, setIsLoading] = useState(false); // Không cần loading với data tĩnh

  // State cho dropdowns
  const [wholeBloodTypes, setWholeBloodTypes] = useState([]);
  const [bloodGroups, setBloodGroups] = useState([]);
  const [componentTypes, setComponentTypes] = useState([]);

  // State cho việc lựa chọn và tính toán
  const [selectedWholeBloodId, setSelectedWholeBloodId] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [selectedComponent, setSelectedComponent] = useState('');
  const [compatibleDonors, setCompatibleDonors] = useState([]);
  const [compatibleRecipients, setCompatibleRecipients] = useState([]);

  // --- Data Preparation từ static data ---
  const prepareBloodData = useCallback(() => {
    const allTypes = STATIC_BLOOD_TYPES;
    const allRules = STATIC_COMPATIBILITY_RULES;

    setAllBloodTypes(allTypes);
    setCompatibilityRules(allRules);

    const wholeTypes = allTypes.filter(
      bt => bt.componentType === 'Máu toàn phần'
    );
    setWholeBloodTypes(wholeTypes);

    const uniqueGroups = [...new Set(allTypes.map(t => t.bloodGroup))];
    const uniqueComponents = [
      ...new Set(allTypes.map(t => t.componentType)),
    ].filter(c => c !== 'Máu toàn phần');

    setBloodGroups(uniqueGroups);
    setComponentTypes(uniqueComponents);

    if (wholeTypes.length > 0) {
      setSelectedWholeBloodId(String(wholeTypes[0].id));
    }
    if (uniqueGroups.length > 0) {
      setSelectedBloodGroup(uniqueGroups[0]);
    }
    if (uniqueComponents.length > 0) {
      setSelectedComponent(uniqueComponents[0]);
    }
  }, []);

  // --- Logic tính toán tương thích ---
  useEffect(() => {
    let targetTypeId = null;
    if (activeSubTab === 'whole') {
      targetTypeId = parseInt(selectedWholeBloodId, 10);
    } else {
      const foundType = allBloodTypes.find(
        bt =>
          bt.bloodGroup === selectedBloodGroup &&
          bt.componentType === selectedComponent
      );
      if (foundType) {
        targetTypeId = foundType.id;
      }
    }

    if (targetTypeId && compatibilityRules.length > 0) {
      const donors = new Set();
      compatibilityRules.forEach(rule => {
        if (rule.recipientBloodType?.id === targetTypeId && rule.isCompatible) {
          donors.add(rule.donorBloodType.description);
        }
      });
      setCompatibleDonors(Array.from(donors));

      const recipients = new Set();
      compatibilityRules.forEach(rule => {
        if (rule.donorBloodType?.id === targetTypeId && rule.isCompatible) {
          recipients.add(rule.recipientBloodType.description);
        }
      });
      setCompatibleRecipients(Array.from(recipients));
    } else {
      setCompatibleDonors([]);
      setCompatibleRecipients([]);
    }
  }, [
    selectedWholeBloodId,
    selectedBloodGroup,
    selectedComponent,
    activeSubTab,
    allBloodTypes,
    compatibilityRules,
  ]);

  useEffect(() => {
    prepareBloodData();
  }, [prepareBloodData]);

  return {
    // Tab management
    activeTab,
    setActiveTab,
    activeSubTab,
    setActiveSubTab,
    
    // Data states
    allBloodTypes,
    compatibilityRules,
    isLoading,
    
    // Dropdown options
    wholeBloodTypes,
    bloodGroups,
    componentTypes,
    
    // Selection states
    selectedWholeBloodId,
    setSelectedWholeBloodId,
    selectedBloodGroup,
    setSelectedBloodGroup,
    selectedComponent,
    setSelectedComponent,
    
    // Results
    compatibleDonors,
    compatibleRecipients,
    
    // Functions
    refetchData: prepareBloodData,
  };
};
