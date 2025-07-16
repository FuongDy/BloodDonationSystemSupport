// src/utils/healthCheckFormTest.js
import { donationService } from '../services/donationService';
import { healthCheckSchema } from './validationSchemas';
import { showToast, showApiErrorToast, FORM_SUCCESS_MESSAGES } from './toastHelpers';

/**
 * Test Health Check Form Submit Function
 * Simulate the exact submit logic from HealthCheckForm component
 */

export const testHealthCheckSubmit = async (processId, formValues) => {
  console.log('🧪 Testing Health Check Form Submit Function...');
  console.log('Process ID:', processId);
  console.log('Form Values:', formValues);

  try {
    // Step 1: Validate form data using schema
    console.log('📋 Step 1: Validating form data...');
    await healthCheckSchema.validate(formValues, { abortEarly: false });
    console.log('✅ Validation passed');

    // Step 2: Convert form data to match backend expectations (same as form)
    console.log('🔄 Step 2: Converting data for backend...');
    const healthCheckData = {
      bloodPressureSystolic: formValues.bloodPressureSystolic ? parseInt(formValues.bloodPressureSystolic) : null,
      bloodPressureDiastolic: formValues.bloodPressureDiastolic ? parseInt(formValues.bloodPressureDiastolic) : null,
      heartRate: formValues.heartRate ? parseInt(formValues.heartRate) : null,
      temperature: formValues.temperature ? parseFloat(formValues.temperature) : null,
      weight: formValues.weight ? parseFloat(formValues.weight) : null,
      hemoglobinLevel: formValues.hemoglobinLevel ? parseFloat(formValues.hemoglobinLevel) : null,
      notes: formValues.notes || null,
      isEligible: formValues.isEligible,
    };

    console.log('📦 Converted data:', healthCheckData);

    // Step 3: Test auto-eligibility evaluation
    console.log('🤖 Step 3: Testing auto-eligibility evaluation...');
    const evaluatedEligibility = evaluateEligibilityForTest(healthCheckData);
    console.log('🎯 Auto-evaluated eligibility:', evaluatedEligibility);
    console.log('📝 Form eligibility:', healthCheckData.isEligible);
    
    if (evaluatedEligibility !== null && evaluatedEligibility !== healthCheckData.isEligible) {
      console.log('⚠️ WARNING: Auto-evaluation mismatch with form value');
    }

    // Step 4: Simulate API call structure
    console.log('🌐 Step 4: Simulating API call structure...');
    const apiCallData = {
      processId: processId,
      healthCheckData: healthCheckData,
      timestamp: new Date().toISOString(),
    };

    console.log('📡 API call would be made with:', apiCallData);

    // Step 5: Simulate success scenario
    console.log('✅ Step 5: Simulating successful submission...');
    console.log('Toast would show:', FORM_SUCCESS_MESSAGES.HEALTH_CHECK);

    return {
      success: true,
      data: healthCheckData,
      message: 'Health check form validation and preparation successful',
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('❌ Test failed:', error);
    
    if (error.name === 'ValidationError') {
      console.log('📋 Validation errors:', error.errors);
      return {
        success: false,
        type: 'validation',
        errors: error.errors,
        message: 'Form validation failed',
      };
    }
    
    return {
      success: false,
      type: 'unknown',
      error: error.message,
      message: 'Unexpected error occurred',
    };
  }
};

/**
 * Auto-eligibility evaluation function (copy from form)
 */
const evaluateEligibilityForTest = (values) => {
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
    return null; // Incomplete data
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

/**
 * Test scenarios
 */
export const runHealthCheckFormTests = async () => {
  console.log('🚀 Running comprehensive Health Check Form tests...');

  const testScenarios = [
    {
      name: 'Valid health check - Eligible donor',
      processId: 'test-process-123',
      formData: {
        bloodPressureSystolic: '120',
        bloodPressureDiastolic: '80',
        heartRate: '70',
        temperature: '36.5',
        weight: '65',
        hemoglobinLevel: '13.5',
        notes: 'Khỏe mạnh, đủ điều kiện hiến máu',
        isEligible: true,
      },
    },
    {
      name: 'Valid health check - Ineligible donor',
      processId: 'test-process-456',
      formData: {
        bloodPressureSystolic: '190',
        bloodPressureDiastolic: '110',
        heartRate: '45',
        temperature: '38.0',
        weight: '40',
        hemoglobinLevel: '10.5',
        notes: 'Huyết áp cao, sốt, thiếu máu',
        isEligible: false,
      },
    },
    {
      name: 'Invalid data - Missing required fields',
      processId: 'test-process-789',
      formData: {
        bloodPressureSystolic: '120',
        // Missing other required fields
        notes: 'Dữ liệu không đầy đủ',
        isEligible: true,
      },
    },
    {
      name: 'Edge case - Minimum valid values',
      processId: 'test-process-min',
      formData: {
        bloodPressureSystolic: '90',
        bloodPressureDiastolic: '50',
        heartRate: '50',
        temperature: '36.0',
        weight: '45',
        hemoglobinLevel: '12.0',
        notes: 'Giá trị tối thiểu có thể chấp nhận',
        isEligible: true,
      },
    },
  ];

  const results = [];

  for (const scenario of testScenarios) {
    console.log(`\n🧪 Testing: ${scenario.name}`);
    console.log('=' + '='.repeat(50));
    
    const result = await testHealthCheckSubmit(scenario.processId, scenario.formData);
    results.push({
      scenario: scenario.name,
      result: result,
    });
    
    console.log(`📊 Result: ${result.success ? 'PASSED ✅' : 'FAILED ❌'}`);
    if (!result.success) {
      console.log(`❌ Error: ${result.message}`);
      if (result.errors) {
        console.log('📋 Validation errors:', result.errors);
      }
    }
  }

  console.log('\n📈 TEST SUMMARY');
  console.log('=' + '='.repeat(50));
  
  const passed = results.filter(r => r.result.success).length;
  const failed = results.filter(r => !r.result.success).length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${results.length}`);
  
  results.forEach(({ scenario, result }) => {
    console.log(`${result.success ? '✅' : '❌'} ${scenario}`);
  });

  return results;
};

/**
 * Quick test function for specific values
 */
export const quickHealthCheckTest = async (values) => {
  console.log('⚡ Quick Health Check Test');
  return await testHealthCheckSubmit('quick-test-' + Date.now(), values);
};

export default {
  testHealthCheckSubmit,
  runHealthCheckFormTests,
  quickHealthCheckTest,
  evaluateEligibilityForTest,
};
