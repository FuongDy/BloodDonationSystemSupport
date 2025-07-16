// src/components/test/HealthCheckTestConsole.jsx
import React, { useState } from 'react';
import { runHealthCheckFormTests, quickHealthCheckTest } from '../../utils/healthCheckFormTest';
import { runAllHealthCheckTests } from '../../utils/healthCheckValidation';

const HealthCheckTestConsole = () => {
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTest, setSelectedTest] = useState('all');

  const handleRunTests = async () => {
    setIsRunning(true);
    setTestResults(null);
    
    try {
      console.log('🚀 Starting Health Check Form Tests...');
      
      let results = [];
      
      if (selectedTest === 'all' || selectedTest === 'form') {
        console.log('\n📋 Running Form Submit Tests...');
        const formResults = await runHealthCheckFormTests();
        results.push({ type: 'Form Submit Tests', results: formResults });
      }
      
      if (selectedTest === 'all' || selectedTest === 'validation') {
        console.log('\n🔍 Running Validation Tests...');
        runAllHealthCheckTests();
        results.push({ type: 'Validation Tests', results: 'Check console for details' });
      }
      
      if (selectedTest === 'quick') {
        console.log('\n⚡ Running Quick Test...');
        const quickResult = await quickHealthCheckTest({
          bloodPressureSystolic: '120',
          bloodPressureDiastolic: '80',
          heartRate: '72',
          temperature: '36.7',
          weight: '70',
          hemoglobinLevel: '14.0',
          notes: 'Quick test sample',
          isEligible: true,
        });
        results.push({ type: 'Quick Test', results: [quickResult] });
      }
      
      setTestResults(results);
      console.log('✅ All tests completed! Check results above.');
      
    } catch (error) {
      console.error('❌ Test execution failed:', error);
      setTestResults([{ type: 'Error', results: error.message }]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClearConsole = () => {
    console.clear();
    setTestResults(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h1 className="text-2xl font-bold text-gray-800">
              🧪 Health Check Form Test Console
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Test Type:
              </label>
              <select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isRunning}
              >
                <option value="all">🎯 All Tests</option>
                <option value="form">📋 Form Submit Tests</option>
                <option value="validation">🔍 Validation Tests</option>
                <option value="quick">⚡ Quick Test</option>
              </select>

              <div className="flex gap-3">
                <button
                  onClick={handleRunTests}
                  disabled={isRunning}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    isRunning
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isRunning ? '🔄 Running...' : '🚀 Run Tests'}
                </button>

                <button
                  onClick={handleClearConsole}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 transition-colors"
                >
                  🧹 Clear Console
                </button>
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">📊 Test Information</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Form Submit Tests: Validate submission logic</p>
                <p>• Validation Tests: Check medical ranges</p>
                <p>• Quick Test: Single scenario validation</p>
                <p>• All Tests: Complete test suite</p>
              </div>
            </div>
          </div>

          {testResults && (
            <div className="bg-gray-50 border rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">📈 Test Results</h3>
              <div className="space-y-4">
                {testResults.map((testGroup, index) => (
                  <div key={index} className="bg-white border rounded p-3">
                    <h4 className="font-medium text-gray-700 mb-2">
                      {testGroup.type}
                    </h4>
                    {Array.isArray(testGroup.results) ? (
                      <div className="space-y-2">
                        {testGroup.results.map((result, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded text-sm ${
                              result.result?.success || result.success
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            <div className="font-medium">
                              {result.scenario || `Test ${idx + 1}`}
                            </div>
                            <div className="text-xs mt-1">
                              {result.result?.message || result.message || 'No message'}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        {testGroup.results}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">
              💡 Instructions
            </h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>1. Open browser DevTools (F12) và switch to Console tab</p>
              <p>2. Select test type and click "Run Tests"</p>
              <p>3. Watch detailed logs in the Console</p>
              <p>4. Review results in this panel</p>
              <p>5. All tests verify form submission and validation logic</p>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500 border-t pt-4">
            <p>🔧 Health Check Form Test Console v1.0</p>
            <p>Tests form validation, auto-eligibility, and submission logic</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCheckTestConsole;
