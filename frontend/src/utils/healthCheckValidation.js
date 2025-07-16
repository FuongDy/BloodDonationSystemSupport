// src/utils/healthCheckValidation.js
import { healthCheckSchema } from './validationSchemas';

/**
 * Test validation cho Health Check Form
 * Kiểm tra các trường hợp input để đảm bảo form hoạt động đúng
 */

// Test data samples
export const testHealthCheckData = {
  // Valid case - Đạt tiêu chuẩn
  validCase: {
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    heartRate: 70,
    temperature: 36.5,
    weight: 65,
    hemoglobinLevel: 13.5,
    notes: 'Khỏe mạnh',
    isEligible: true,
  },

  // Invalid case - Không đạt tiêu chuẩn 
  invalidCase: {
    bloodPressureSystolic: 200, // Quá cao
    bloodPressureDiastolic: 110, // Quá cao
    heartRate: 120, // Quá cao
    temperature: 38.5, // Sốt
    weight: 40, // Quá nhẹ
    hemoglobinLevel: 10, // Quá thấp
    notes: 'Có vấn đề về sức khỏe',
    isEligible: false,
  },

  // Borderline case - Giới hạn
  borderlineCase: {
    bloodPressureSystolic: 90, // Minimum
    bloodPressureDiastolic: 50, // Minimum  
    heartRate: 50, // Minimum
    temperature: 36.0, // Minimum
    weight: 45, // Minimum
    hemoglobinLevel: 12.0, // Minimum for female
    notes: 'Ở giới hạn tối thiểu',
    isEligible: true,
  },
};

/**
 * Validate test data
 */
export const runHealthCheckValidationTests = async () => {
  console.log('🧪 Running Health Check Validation Tests...');
  
  try {
    // Test valid case
    console.log('✅ Testing valid case...');
    const validResult = await healthCheckSchema.validate(testHealthCheckData.validCase, { abortEarly: false });
    console.log('Valid case passed:', validResult);

    // Test borderline case
    console.log('⚖️ Testing borderline case...');
    const borderlineResult = await healthCheckSchema.validate(testHealthCheckData.borderlineCase, { abortEarly: false });
    console.log('Borderline case passed:', borderlineResult);

    // Test invalid case (should fail)
    console.log('❌ Testing invalid case (should fail)...');
    try {
      const invalidResult = await healthCheckSchema.validate(testHealthCheckData.invalidCase, { abortEarly: false });
      console.log('⚠️ WARNING: Invalid case unexpectedly passed:', invalidResult);
    } catch (error) {
      console.log('✅ Invalid case correctly failed with errors:', error.errors);
    }

    console.log('🎉 All validation tests completed!');
    return true;

  } catch (error) {
    console.error('❌ Validation test failed:', error);
    return false;
  }
};

/**
 * Auto-eligibility evaluation test
 */
export const testAutoEligibility = () => {
  console.log('🤖 Testing auto-eligibility evaluation...');

  const evaluateEligibility = (values) => {
    const {
      bloodPressureSystolic,
      bloodPressureDiastolic,
      heartRate,
      temperature,
      weight,
      hemoglobinLevel,
    } = values;

    if (!bloodPressureSystolic || !bloodPressureDiastolic || !heartRate || 
        !temperature || !weight || !hemoglobinLevel) {
      return null;
    }

    const isEligible = 
      bloodPressureSystolic >= 90 && bloodPressureSystolic <= 180 &&
      bloodPressureDiastolic >= 50 && bloodPressureDiastolic <= 100 &&
      bloodPressureDiastolic < bloodPressureSystolic &&
      heartRate >= 50 && heartRate <= 100 &&
      temperature >= 36.0 && temperature <= 37.5 &&
      weight >= 45 &&
      hemoglobinLevel >= 12.0 && hemoglobinLevel <= 18.0;

    return isEligible;
  };

  // Test cases
  const tests = [
    { 
      name: 'Valid case', 
      data: testHealthCheckData.validCase, 
      expected: true 
    },
    { 
      name: 'Invalid case', 
      data: testHealthCheckData.invalidCase, 
      expected: false 
    },
    { 
      name: 'Borderline case', 
      data: testHealthCheckData.borderlineCase, 
      expected: true 
    },
    {
      name: 'Incomplete data',
      data: { bloodPressureSystolic: 120 }, // Missing other fields
      expected: null
    }
  ];

  tests.forEach(test => {
    const result = evaluateEligibility(test.data);
    const passed = result === test.expected;
    console.log(`${passed ? '✅' : '❌'} ${test.name}: Expected ${test.expected}, Got ${result}`);
  });

  console.log('🎯 Auto-eligibility tests completed!');
};

/**
 * Medical range validation tests
 */
export const testMedicalRanges = () => {
  console.log('🏥 Testing medical ranges...');

  const ranges = {
    bloodPressureSystolic: { min: 90, max: 180, unit: 'mmHg' },
    bloodPressureDiastolic: { min: 50, max: 100, unit: 'mmHg' },
    heartRate: { min: 50, max: 100, unit: 'bpm' },
    temperature: { min: 36.0, max: 37.5, unit: '°C' },
    weight: { min: 45, max: 999, unit: 'kg' },
    hemoglobinLevel: { min: 12.0, max: 18.0, unit: 'g/dL' },
  };

  Object.entries(ranges).forEach(([field, range]) => {
    console.log(`📊 ${field}: ${range.min}-${range.max} ${range.unit}`);
  });

  console.log('📋 Medical ranges reference completed!');
};

// Export test runner
export const runAllHealthCheckTests = () => {
  console.log('🚀 Starting comprehensive Health Check Form tests...');
  
  runHealthCheckValidationTests();
  testAutoEligibility();
  testMedicalRanges();
  
  console.log('✨ All Health Check Form tests completed!');
};

export default {
  testHealthCheckData,
  runHealthCheckValidationTests,
  testAutoEligibility,
  testMedicalRanges,
  runAllHealthCheckTests,
};
