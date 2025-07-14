// src/hooks/useBloodCompatibilityChecker.js
import { useState, useEffect, useCallback } from 'react';

// Static data for blood compatibility
const STATIC_BLOOD_TYPES = [
  // Whole Blood
  { id: 1, bloodGroup: 'A+', componentType: 'Whole Blood', description: 'A+ Whole Blood' },
  { id: 2, bloodGroup: 'A-', componentType: 'Whole Blood', description: 'A- Whole Blood' },
  { id: 3, bloodGroup: 'B+', componentType: 'Whole Blood', description: 'B+ Whole Blood' },
  { id: 4, bloodGroup: 'B-', componentType: 'Whole Blood', description: 'B- Whole Blood' },
  { id: 5, bloodGroup: 'AB+', componentType: 'Whole Blood', description: 'AB+ Whole Blood' },
  { id: 6, bloodGroup: 'AB-', componentType: 'Whole Blood', description: 'AB- Whole Blood' },
  { id: 7, bloodGroup: 'O+', componentType: 'Whole Blood', description: 'O+ Whole Blood' },
  { id: 8, bloodGroup: 'O-', componentType: 'Whole Blood', description: 'O- Whole Blood' },
  
  // Red Blood Cells
  { id: 9, bloodGroup: 'A+', componentType: 'Red Blood Cells', description: 'A+ Red Blood Cells' },
  { id: 10, bloodGroup: 'A-', componentType: 'Red Blood Cells', description: 'A- Red Blood Cells' },
  { id: 11, bloodGroup: 'B+', componentType: 'Red Blood Cells', description: 'B+ Red Blood Cells' },
  { id: 12, bloodGroup: 'B-', componentType: 'Red Blood Cells', description: 'B- Red Blood Cells' },
  { id: 13, bloodGroup: 'AB+', componentType: 'Red Blood Cells', description: 'AB+ Red Blood Cells' },
  { id: 14, bloodGroup: 'AB-', componentType: 'Red Blood Cells', description: 'AB- Red Blood Cells' },
  { id: 15, bloodGroup: 'O+', componentType: 'Red Blood Cells', description: 'O+ Red Blood Cells' },
  { id: 16, bloodGroup: 'O-', componentType: 'Red Blood Cells', description: 'O- Red Blood Cells' },
  
  // Platelets
  { id: 17, bloodGroup: 'A+', componentType: 'Platelets', description: 'A+ Platelets' },
  { id: 18, bloodGroup: 'A-', componentType: 'Platelets', description: 'A- Platelets' },
  { id: 19, bloodGroup: 'B+', componentType: 'Platelets', description: 'B+ Platelets' },
  { id: 20, bloodGroup: 'B-', componentType: 'Platelets', description: 'B- Platelets' },
  { id: 21, bloodGroup: 'AB+', componentType: 'Platelets', description: 'AB+ Platelets' },
  { id: 22, bloodGroup: 'AB-', componentType: 'Platelets', description: 'AB- Platelets' },
  { id: 23, bloodGroup: 'O+', componentType: 'Platelets', description: 'O+ Platelets' },
  { id: 24, bloodGroup: 'O-', componentType: 'Platelets', description: 'O- Platelets' },
  
  // Plasma
  { id: 25, bloodGroup: 'A+', componentType: 'Plasma', description: 'A+ Plasma' },
  { id: 26, bloodGroup: 'A-', componentType: 'Plasma', description: 'A- Plasma' },
  { id: 27, bloodGroup: 'B+', componentType: 'Plasma', description: 'B+ Plasma' },
  { id: 28, bloodGroup: 'B-', componentType: 'Plasma', description: 'B- Plasma' },
  { id: 29, bloodGroup: 'AB+', componentType: 'Plasma', description: 'AB+ Plasma' },
  { id: 30, bloodGroup: 'AB-', componentType: 'Plasma', description: 'AB- Plasma' },
  { id: 31, bloodGroup: 'O+', componentType: 'Plasma', description: 'O+ Plasma' },
  { id: 32, bloodGroup: 'O-', componentType: 'Plasma', description: 'O- Plasma' },
];

// Static compatibility rules - Đúng theo y khoa thực tế
const STATIC_COMPATIBILITY_RULES = [
  // ===== WHOLE BLOOD COMPATIBILITY =====
  // O- (Universal Donor for RBC) - Có thể hiến cho tất cả
  { id: 1, donorBloodType: { id: 8, description: 'O- Whole Blood' }, recipientBloodType: { id: 1, description: 'A+ Whole Blood' }, isCompatible: true },
  { id: 2, donorBloodType: { id: 8, description: 'O- Whole Blood' }, recipientBloodType: { id: 2, description: 'A- Whole Blood' }, isCompatible: true },
  { id: 3, donorBloodType: { id: 8, description: 'O- Whole Blood' }, recipientBloodType: { id: 3, description: 'B+ Whole Blood' }, isCompatible: true },
  { id: 4, donorBloodType: { id: 8, description: 'O- Whole Blood' }, recipientBloodType: { id: 4, description: 'B- Whole Blood' }, isCompatible: true },
  { id: 5, donorBloodType: { id: 8, description: 'O- Whole Blood' }, recipientBloodType: { id: 5, description: 'AB+ Whole Blood' }, isCompatible: true },
  { id: 6, donorBloodType: { id: 8, description: 'O- Whole Blood' }, recipientBloodType: { id: 6, description: 'AB- Whole Blood' }, isCompatible: true },
  { id: 7, donorBloodType: { id: 8, description: 'O- Whole Blood' }, recipientBloodType: { id: 7, description: 'O+ Whole Blood' }, isCompatible: true },
  { id: 8, donorBloodType: { id: 8, description: 'O- Whole Blood' }, recipientBloodType: { id: 8, description: 'O- Whole Blood' }, isCompatible: true },
  
  // O+ - Có thể hiến cho các nhóm máu Rh+ (A+, B+, AB+, O+)
  { id: 9, donorBloodType: { id: 7, description: 'O+ Whole Blood' }, recipientBloodType: { id: 1, description: 'A+ Whole Blood' }, isCompatible: true },
  { id: 10, donorBloodType: { id: 7, description: 'O+ Whole Blood' }, recipientBloodType: { id: 3, description: 'B+ Whole Blood' }, isCompatible: true },
  { id: 11, donorBloodType: { id: 7, description: 'O+ Whole Blood' }, recipientBloodType: { id: 5, description: 'AB+ Whole Blood' }, isCompatible: true },
  { id: 12, donorBloodType: { id: 7, description: 'O+ Whole Blood' }, recipientBloodType: { id: 7, description: 'O+ Whole Blood' }, isCompatible: true },
  
  // A- - Có thể hiến cho A+, A-, AB+, AB-
  { id: 13, donorBloodType: { id: 2, description: 'A- Whole Blood' }, recipientBloodType: { id: 1, description: 'A+ Whole Blood' }, isCompatible: true },
  { id: 14, donorBloodType: { id: 2, description: 'A- Whole Blood' }, recipientBloodType: { id: 2, description: 'A- Whole Blood' }, isCompatible: true },
  { id: 15, donorBloodType: { id: 2, description: 'A- Whole Blood' }, recipientBloodType: { id: 5, description: 'AB+ Whole Blood' }, isCompatible: true },
  { id: 16, donorBloodType: { id: 2, description: 'A- Whole Blood' }, recipientBloodType: { id: 6, description: 'AB- Whole Blood' }, isCompatible: true },
  
  // A+ - Có thể hiến cho A+, AB+
  { id: 17, donorBloodType: { id: 1, description: 'A+ Whole Blood' }, recipientBloodType: { id: 1, description: 'A+ Whole Blood' }, isCompatible: true },
  { id: 18, donorBloodType: { id: 1, description: 'A+ Whole Blood' }, recipientBloodType: { id: 5, description: 'AB+ Whole Blood' }, isCompatible: true },
  
  // B- - Có thể hiến cho B+, B-, AB+, AB-
  { id: 19, donorBloodType: { id: 4, description: 'B- Whole Blood' }, recipientBloodType: { id: 3, description: 'B+ Whole Blood' }, isCompatible: true },
  { id: 20, donorBloodType: { id: 4, description: 'B- Whole Blood' }, recipientBloodType: { id: 4, description: 'B- Whole Blood' }, isCompatible: true },
  { id: 21, donorBloodType: { id: 4, description: 'B- Whole Blood' }, recipientBloodType: { id: 5, description: 'AB+ Whole Blood' }, isCompatible: true },
  { id: 22, donorBloodType: { id: 4, description: 'B- Whole Blood' }, recipientBloodType: { id: 6, description: 'AB- Whole Blood' }, isCompatible: true },
  
  // B+ - Có thể hiến cho B+, AB+
  { id: 23, donorBloodType: { id: 3, description: 'B+ Whole Blood' }, recipientBloodType: { id: 3, description: 'B+ Whole Blood' }, isCompatible: true },
  { id: 24, donorBloodType: { id: 3, description: 'B+ Whole Blood' }, recipientBloodType: { id: 5, description: 'AB+ Whole Blood' }, isCompatible: true },
  
  // AB- - Có thể hiến cho AB+, AB-
  { id: 25, donorBloodType: { id: 6, description: 'AB- Whole Blood' }, recipientBloodType: { id: 5, description: 'AB+ Whole Blood' }, isCompatible: true },
  { id: 26, donorBloodType: { id: 6, description: 'AB- Whole Blood' }, recipientBloodType: { id: 6, description: 'AB- Whole Blood' }, isCompatible: true },
  
  // AB+ - Chỉ có thể hiến cho AB+ (Universal Recipient)
  { id: 27, donorBloodType: { id: 5, description: 'AB+ Whole Blood' }, recipientBloodType: { id: 5, description: 'AB+ Whole Blood' }, isCompatible: true },

  // ===== RED BLOOD CELLS COMPATIBILITY (Giống Whole Blood) =====
  // O- RBC (Universal Donor)
  { id: 28, donorBloodType: { id: 16, description: 'O- Red Blood Cells' }, recipientBloodType: { id: 9, description: 'A+ Red Blood Cells' }, isCompatible: true },
  { id: 29, donorBloodType: { id: 16, description: 'O- Red Blood Cells' }, recipientBloodType: { id: 10, description: 'A- Red Blood Cells' }, isCompatible: true },
  { id: 30, donorBloodType: { id: 16, description: 'O- Red Blood Cells' }, recipientBloodType: { id: 11, description: 'B+ Red Blood Cells' }, isCompatible: true },
  { id: 31, donorBloodType: { id: 16, description: 'O- Red Blood Cells' }, recipientBloodType: { id: 12, description: 'B- Red Blood Cells' }, isCompatible: true },
  { id: 32, donorBloodType: { id: 16, description: 'O- Red Blood Cells' }, recipientBloodType: { id: 13, description: 'AB+ Red Blood Cells' }, isCompatible: true },
  { id: 33, donorBloodType: { id: 16, description: 'O- Red Blood Cells' }, recipientBloodType: { id: 14, description: 'AB- Red Blood Cells' }, isCompatible: true },
  { id: 34, donorBloodType: { id: 16, description: 'O- Red Blood Cells' }, recipientBloodType: { id: 15, description: 'O+ Red Blood Cells' }, isCompatible: true },
  { id: 35, donorBloodType: { id: 16, description: 'O- Red Blood Cells' }, recipientBloodType: { id: 16, description: 'O- Red Blood Cells' }, isCompatible: true },
  
  // O+ RBC
  { id: 36, donorBloodType: { id: 15, description: 'O+ Red Blood Cells' }, recipientBloodType: { id: 9, description: 'A+ Red Blood Cells' }, isCompatible: true },
  { id: 37, donorBloodType: { id: 15, description: 'O+ Red Blood Cells' }, recipientBloodType: { id: 11, description: 'B+ Red Blood Cells' }, isCompatible: true },
  { id: 38, donorBloodType: { id: 15, description: 'O+ Red Blood Cells' }, recipientBloodType: { id: 13, description: 'AB+ Red Blood Cells' }, isCompatible: true },
  { id: 39, donorBloodType: { id: 15, description: 'O+ Red Blood Cells' }, recipientBloodType: { id: 15, description: 'O+ Red Blood Cells' }, isCompatible: true },
  
  // A- RBC
  { id: 40, donorBloodType: { id: 10, description: 'A- Red Blood Cells' }, recipientBloodType: { id: 9, description: 'A+ Red Blood Cells' }, isCompatible: true },
  { id: 41, donorBloodType: { id: 10, description: 'A- Red Blood Cells' }, recipientBloodType: { id: 10, description: 'A- Red Blood Cells' }, isCompatible: true },
  { id: 42, donorBloodType: { id: 10, description: 'A- Red Blood Cells' }, recipientBloodType: { id: 13, description: 'AB+ Red Blood Cells' }, isCompatible: true },
  { id: 43, donorBloodType: { id: 10, description: 'A- Red Blood Cells' }, recipientBloodType: { id: 14, description: 'AB- Red Blood Cells' }, isCompatible: true },
  
  // A+ RBC
  { id: 44, donorBloodType: { id: 9, description: 'A+ Red Blood Cells' }, recipientBloodType: { id: 9, description: 'A+ Red Blood Cells' }, isCompatible: true },
  { id: 45, donorBloodType: { id: 9, description: 'A+ Red Blood Cells' }, recipientBloodType: { id: 13, description: 'AB+ Red Blood Cells' }, isCompatible: true },
  
  // B- RBC
  { id: 46, donorBloodType: { id: 12, description: 'B- Red Blood Cells' }, recipientBloodType: { id: 11, description: 'B+ Red Blood Cells' }, isCompatible: true },
  { id: 47, donorBloodType: { id: 12, description: 'B- Red Blood Cells' }, recipientBloodType: { id: 12, description: 'B- Red Blood Cells' }, isCompatible: true },
  { id: 48, donorBloodType: { id: 12, description: 'B- Red Blood Cells' }, recipientBloodType: { id: 13, description: 'AB+ Red Blood Cells' }, isCompatible: true },
  { id: 49, donorBloodType: { id: 12, description: 'B- Red Blood Cells' }, recipientBloodType: { id: 14, description: 'AB- Red Blood Cells' }, isCompatible: true },
  
  // B+ RBC
  { id: 50, donorBloodType: { id: 11, description: 'B+ Red Blood Cells' }, recipientBloodType: { id: 11, description: 'B+ Red Blood Cells' }, isCompatible: true },
  { id: 51, donorBloodType: { id: 11, description: 'B+ Red Blood Cells' }, recipientBloodType: { id: 13, description: 'AB+ Red Blood Cells' }, isCompatible: true },
  
  // AB- RBC
  { id: 52, donorBloodType: { id: 14, description: 'AB- Red Blood Cells' }, recipientBloodType: { id: 13, description: 'AB+ Red Blood Cells' }, isCompatible: true },
  { id: 53, donorBloodType: { id: 14, description: 'AB- Red Blood Cells' }, recipientBloodType: { id: 14, description: 'AB- Red Blood Cells' }, isCompatible: true },
  
  // AB+ RBC (Universal Recipient)
  { id: 54, donorBloodType: { id: 13, description: 'AB+ Red Blood Cells' }, recipientBloodType: { id: 13, description: 'AB+ Red Blood Cells' }, isCompatible: true },

  // ===== PLATELETS COMPATIBILITY (Giống như RBC - dựa trên ABO và Rh) =====
  // O- Platelets (Universal Donor cho Platelets)
  { id: 55, donorBloodType: { id: 24, description: 'O- Platelets' }, recipientBloodType: { id: 17, description: 'A+ Platelets' }, isCompatible: true },
  { id: 56, donorBloodType: { id: 24, description: 'O- Platelets' }, recipientBloodType: { id: 18, description: 'A- Platelets' }, isCompatible: true },
  { id: 57, donorBloodType: { id: 24, description: 'O- Platelets' }, recipientBloodType: { id: 19, description: 'B+ Platelets' }, isCompatible: true },
  { id: 58, donorBloodType: { id: 24, description: 'O- Platelets' }, recipientBloodType: { id: 20, description: 'B- Platelets' }, isCompatible: true },
  { id: 59, donorBloodType: { id: 24, description: 'O- Platelets' }, recipientBloodType: { id: 21, description: 'AB+ Platelets' }, isCompatible: true },
  { id: 60, donorBloodType: { id: 24, description: 'O- Platelets' }, recipientBloodType: { id: 22, description: 'AB- Platelets' }, isCompatible: true },
  { id: 61, donorBloodType: { id: 24, description: 'O- Platelets' }, recipientBloodType: { id: 23, description: 'O+ Platelets' }, isCompatible: true },
  { id: 62, donorBloodType: { id: 24, description: 'O- Platelets' }, recipientBloodType: { id: 24, description: 'O- Platelets' }, isCompatible: true },
  
  // O+ Platelets
  { id: 63, donorBloodType: { id: 23, description: 'O+ Platelets' }, recipientBloodType: { id: 17, description: 'A+ Platelets' }, isCompatible: true },
  { id: 64, donorBloodType: { id: 23, description: 'O+ Platelets' }, recipientBloodType: { id: 19, description: 'B+ Platelets' }, isCompatible: true },
  { id: 65, donorBloodType: { id: 23, description: 'O+ Platelets' }, recipientBloodType: { id: 21, description: 'AB+ Platelets' }, isCompatible: true },
  { id: 66, donorBloodType: { id: 23, description: 'O+ Platelets' }, recipientBloodType: { id: 23, description: 'O+ Platelets' }, isCompatible: true },
  
  // A- Platelets
  { id: 67, donorBloodType: { id: 18, description: 'A- Platelets' }, recipientBloodType: { id: 17, description: 'A+ Platelets' }, isCompatible: true },
  { id: 68, donorBloodType: { id: 18, description: 'A- Platelets' }, recipientBloodType: { id: 18, description: 'A- Platelets' }, isCompatible: true },
  { id: 69, donorBloodType: { id: 18, description: 'A- Platelets' }, recipientBloodType: { id: 21, description: 'AB+ Platelets' }, isCompatible: true },
  { id: 70, donorBloodType: { id: 18, description: 'A- Platelets' }, recipientBloodType: { id: 22, description: 'AB- Platelets' }, isCompatible: true },
  
  // A+ Platelets
  { id: 71, donorBloodType: { id: 17, description: 'A+ Platelets' }, recipientBloodType: { id: 17, description: 'A+ Platelets' }, isCompatible: true },
  { id: 72, donorBloodType: { id: 17, description: 'A+ Platelets' }, recipientBloodType: { id: 21, description: 'AB+ Platelets' }, isCompatible: true },
  
  // B- Platelets
  { id: 73, donorBloodType: { id: 20, description: 'B- Platelets' }, recipientBloodType: { id: 19, description: 'B+ Platelets' }, isCompatible: true },
  { id: 74, donorBloodType: { id: 20, description: 'B- Platelets' }, recipientBloodType: { id: 20, description: 'B- Platelets' }, isCompatible: true },
  { id: 75, donorBloodType: { id: 20, description: 'B- Platelets' }, recipientBloodType: { id: 21, description: 'AB+ Platelets' }, isCompatible: true },
  { id: 76, donorBloodType: { id: 20, description: 'B- Platelets' }, recipientBloodType: { id: 22, description: 'AB- Platelets' }, isCompatible: true },
  
  // B+ Platelets
  { id: 77, donorBloodType: { id: 19, description: 'B+ Platelets' }, recipientBloodType: { id: 19, description: 'B+ Platelets' }, isCompatible: true },
  { id: 78, donorBloodType: { id: 19, description: 'B+ Platelets' }, recipientBloodType: { id: 21, description: 'AB+ Platelets' }, isCompatible: true },
  
  // AB- Platelets
  { id: 79, donorBloodType: { id: 22, description: 'AB- Platelets' }, recipientBloodType: { id: 21, description: 'AB+ Platelets' }, isCompatible: true },
  { id: 80, donorBloodType: { id: 22, description: 'AB- Platelets' }, recipientBloodType: { id: 22, description: 'AB- Platelets' }, isCompatible: true },
  
  // AB+ Platelets (Universal Recipient cho Platelets)
  { id: 81, donorBloodType: { id: 21, description: 'AB+ Platelets' }, recipientBloodType: { id: 21, description: 'AB+ Platelets' }, isCompatible: true },

  // ===== PLASMA COMPATIBILITY (Ngược với RBC - O có thể nhận từ tất cả, AB chỉ cho AB) =====
  // AB+ Plasma (Universal Donor cho Plasma)
  { id: 82, donorBloodType: { id: 29, description: 'AB+ Plasma' }, recipientBloodType: { id: 25, description: 'A+ Plasma' }, isCompatible: true },
  { id: 83, donorBloodType: { id: 29, description: 'AB+ Plasma' }, recipientBloodType: { id: 26, description: 'A- Plasma' }, isCompatible: true },
  { id: 84, donorBloodType: { id: 29, description: 'AB+ Plasma' }, recipientBloodType: { id: 27, description: 'B+ Plasma' }, isCompatible: true },
  { id: 85, donorBloodType: { id: 29, description: 'AB+ Plasma' }, recipientBloodType: { id: 28, description: 'B- Plasma' }, isCompatible: true },
  { id: 86, donorBloodType: { id: 29, description: 'AB+ Plasma' }, recipientBloodType: { id: 29, description: 'AB+ Plasma' }, isCompatible: true },
  { id: 87, donorBloodType: { id: 29, description: 'AB+ Plasma' }, recipientBloodType: { id: 30, description: 'AB- Plasma' }, isCompatible: true },
  { id: 88, donorBloodType: { id: 29, description: 'AB+ Plasma' }, recipientBloodType: { id: 31, description: 'O+ Plasma' }, isCompatible: true },
  { id: 89, donorBloodType: { id: 29, description: 'AB+ Plasma' }, recipientBloodType: { id: 32, description: 'O- Plasma' }, isCompatible: true },
  
  // AB- Plasma
  { id: 90, donorBloodType: { id: 30, description: 'AB- Plasma' }, recipientBloodType: { id: 26, description: 'A- Plasma' }, isCompatible: true },
  { id: 91, donorBloodType: { id: 30, description: 'AB- Plasma' }, recipientBloodType: { id: 28, description: 'B- Plasma' }, isCompatible: true },
  { id: 92, donorBloodType: { id: 30, description: 'AB- Plasma' }, recipientBloodType: { id: 30, description: 'AB- Plasma' }, isCompatible: true },
  { id: 93, donorBloodType: { id: 30, description: 'AB- Plasma' }, recipientBloodType: { id: 32, description: 'O- Plasma' }, isCompatible: true },
  
  // A+ Plasma
  { id: 94, donorBloodType: { id: 25, description: 'A+ Plasma' }, recipientBloodType: { id: 25, description: 'A+ Plasma' }, isCompatible: true },
  { id: 95, donorBloodType: { id: 25, description: 'A+ Plasma' }, recipientBloodType: { id: 31, description: 'O+ Plasma' }, isCompatible: true },
  
  // A- Plasma
  { id: 96, donorBloodType: { id: 26, description: 'A- Plasma' }, recipientBloodType: { id: 25, description: 'A+ Plasma' }, isCompatible: true },
  { id: 97, donorBloodType: { id: 26, description: 'A- Plasma' }, recipientBloodType: { id: 26, description: 'A- Plasma' }, isCompatible: true },
  { id: 98, donorBloodType: { id: 26, description: 'A- Plasma' }, recipientBloodType: { id: 31, description: 'O+ Plasma' }, isCompatible: true },
  { id: 99, donorBloodType: { id: 26, description: 'A- Plasma' }, recipientBloodType: { id: 32, description: 'O- Plasma' }, isCompatible: true },
  
  // B+ Plasma
  { id: 100, donorBloodType: { id: 27, description: 'B+ Plasma' }, recipientBloodType: { id: 27, description: 'B+ Plasma' }, isCompatible: true },
  { id: 101, donorBloodType: { id: 27, description: 'B+ Plasma' }, recipientBloodType: { id: 31, description: 'O+ Plasma' }, isCompatible: true },
  
  // B- Plasma
  { id: 102, donorBloodType: { id: 28, description: 'B- Plasma' }, recipientBloodType: { id: 27, description: 'B+ Plasma' }, isCompatible: true },
  { id: 103, donorBloodType: { id: 28, description: 'B- Plasma' }, recipientBloodType: { id: 28, description: 'B- Plasma' }, isCompatible: true },
  { id: 104, donorBloodType: { id: 28, description: 'B- Plasma' }, recipientBloodType: { id: 31, description: 'O+ Plasma' }, isCompatible: true },
  { id: 105, donorBloodType: { id: 28, description: 'B- Plasma' }, recipientBloodType: { id: 32, description: 'O- Plasma' }, isCompatible: true },
  
  // O+ Plasma (Universal Recipient cho Plasma)
  { id: 106, donorBloodType: { id: 31, description: 'O+ Plasma' }, recipientBloodType: { id: 31, description: 'O+ Plasma' }, isCompatible: true },
  
  // O- Plasma (Universal Recipient cho Plasma)
  { id: 107, donorBloodType: { id: 32, description: 'O- Plasma' }, recipientBloodType: { id: 32, description: 'O- Plasma' }, isCompatible: true },
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
      bt => bt.componentType === 'Whole Blood'
    );
    setWholeBloodTypes(wholeTypes);

    const uniqueGroups = [...new Set(allTypes.map(t => t.bloodGroup))];
    const uniqueComponents = [
      ...new Set(allTypes.map(t => t.componentType)),
    ].filter(c => c !== 'Whole Blood');

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
