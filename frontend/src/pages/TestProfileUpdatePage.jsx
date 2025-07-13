// src/pages/TestProfileUpdatePage.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import bloodTypeService from '../services/bloodTypeService';

const TestProfileUpdatePage = () => {
  const { user: authUser, setUser: setAuthUser } = useAuth();
  const [user, setUser] = useState(null);
  const [bloodTypes, setBloodTypes] = useState([]);
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    const logEntry = `${new Date().toLocaleTimeString()}: ${message}`;
    console.log(logEntry);
    setLogs(prev => [...prev, logEntry]);
  };

  const fetchData = async () => {
    setIsLoading(true);
    addLog('🔄 Starting to fetch user profile and blood types...');
    
    try {
      addLog('📋 Fetching blood types...');
      const bloodTypesData = await bloodTypeService.getAll();
      addLog(`✅ Successfully fetched ${bloodTypesData.length} blood types`);
      setBloodTypes(bloodTypesData || []);
      
      addLog('👤 Fetching user profile...');
      const userData = await userService.getProfile(true);
      addLog(`✅ Successfully fetched user data for: ${userData.fullName || 'Unknown'}`);
      
      setUser(userData);
      setSelectedBloodType(userData.bloodTypeId || '');
      
      addLog('🎯 Data initialization complete');
    } catch (error) {
      addLog(`❌ Error fetching data: ${error.message}`);
      toast.error('Failed to fetch data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!user) {
      addLog('❌ No user data available');
      return;
    }

    setIsLoading(true);
    addLog('🚀 Starting profile update...');

    const updateData = {
      fullName: user.fullName,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      address: user.address,
      emergencyContact: user.emergencyContact,
      bloodTypeId: selectedBloodType ? parseInt(selectedBloodType, 10) : null,
      medicalConditions: user.medicalConditions,
      lastDonationDate: user.lastDonationDate,
      isReadyToDonate: user.isReadyToDonate,
    };

    addLog(`📤 Sending update request with bloodTypeId: ${updateData.bloodTypeId}`);

    try {
      const result = await userService.updateProfile(updateData);
      addLog('✅ Update successful!');
      
      // Update auth context
      if (result && setAuthUser) {
        setAuthUser(result);
        addLog('🔄 Updated auth context');
      }
      
      toast.success('Profile updated successfully!');
      
      // Refresh data to see changes
      setTimeout(() => {
        addLog('🔄 Refreshing data to verify changes...');
        fetchData();
      }, 1000);
    } catch (error) {
      addLog(`❌ Update failed: ${error.message}`);
      toast.error('Update failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    addLog('🚀 Component mounted, initializing...');
    fetchData();
  }, []);

  const selectedBloodTypeInfo = bloodTypes.find(bt => bt.id === parseInt(selectedBloodType));

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">
          🩸 Test Profile Update - Blood Type Change
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            <div className="space-y-4">
              <button
                onClick={fetchData}
                disabled={isLoading}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors w-full"
              >
                {isLoading ? '🔄 Loading...' : '🔄 Refresh Data'}
              </button>

              {authUser && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">🔐 Auth Context User:</h3>
                  <p className="text-sm text-blue-700">
                    {authUser.fullName} ({authUser.email}) - {authUser.role}
                  </p>
                  {authUser.bloodType && (
                    <p className="text-sm text-blue-700">
                      Blood Type: {authUser.bloodType.bloodGroup}
                    </p>
                  )}
                </div>
              )}

              {user && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">👤 Profile User Data:</h3>
                  <p className="text-sm text-green-700">
                    {user.fullName} ({user.email})
                  </p>
                  <p className="text-sm text-green-700">
                    Current Blood Type ID: {user.bloodTypeId || 'None'}
                  </p>
                  {user.bloodType && (
                    <p className="text-sm text-green-700">
                      Blood Type Object: {user.bloodType.bloodGroup}
                    </p>
                  )}
                </div>
              )}

              {bloodTypes.length > 0 && (
                <div className="space-y-3">
                  <label className="block font-semibold text-gray-700">🩸 Select Blood Type:</label>
                  <select
                    value={selectedBloodType}
                    onChange={(e) => setSelectedBloodType(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Select Blood Type --</option>
                    {bloodTypes.map(bt => (
                      <option key={bt.id} value={bt.id}>
                        {bt.bloodGroup} ({bt.id})
                      </option>
                    ))}
                  </select>
                  
                  {selectedBloodTypeInfo && (
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Selected: {selectedBloodTypeInfo.bloodGroup} (ID: {selectedBloodTypeInfo.id})
                      </p>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={updateProfile}
                disabled={isLoading || !selectedBloodType}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors w-full"
              >
                {isLoading ? '⏳ Updating...' : '💾 Update Blood Type'}
              </button>
            </div>
          </div>

          {/* Right Panel - Data Display */}
          <div className="space-y-4">
            {user && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">📊 Current User Data:</h3>
                <pre className="bg-white p-3 rounded text-xs overflow-auto max-h-40 border">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            )}

            {bloodTypes.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">🩸 Available Blood Types:</h3>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-auto">
                  {bloodTypes.map(bt => (
                    <div key={bt.id} className="bg-white p-2 rounded text-sm border">
                      <strong>{bt.bloodGroup}</strong> (ID: {bt.id})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">📝 Debug Logs</h3>
          <button
            onClick={() => setLogs([])}
            className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 transition-colors"
          >
            🗑️ Clear Logs
          </button>
        </div>
        <div className="bg-black text-green-400 p-4 rounded text-sm h-64 overflow-auto font-mono">
          {logs.length === 0 ? (
            <div className="text-gray-500">No logs yet...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TestProfileUpdatePage;
