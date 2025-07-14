// src/contexts/DonationProcessContext.jsx
import React, { createContext, useContext, useState } from 'react';

const DonationProcessContext = createContext();

export const useDonationProcess = () => {
  const context = useContext(DonationProcessContext);
  if (!context) {
    // Return default functions when context is not available
    return {
      activeTab: 'donation-history',
      setActiveTab: () => {},
      selectedProcessId: null,
      setSelectedProcessId: () => {},
      navigateToTab: () => {},
      navigateToAppointments: () => {},
      navigateToHealthCheck: () => {},
      navigateToBloodCollection: () => {},
      navigateToTestResults: () => {},
    };
  }
  return context;
};

export const DonationProcessProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('donation-history');
  const [selectedProcessId, setSelectedProcessId] = useState(null);

  // Navigation functions for the donation process workflow
  const navigateToTab = (tabKey, processId = null) => {
    setActiveTab(tabKey);
    if (processId) {
      setSelectedProcessId(processId);
    }
  };

  // Specific navigation functions for the workflow
  const navigateToAppointments = (processId) => {
    navigateToTab('appointments', processId);
  };

  const navigateToHealthCheck = (processId) => {
    navigateToTab('health-checks', processId);
  };

  const navigateToBloodCollection = (processId) => {
    navigateToTab('blood-collection', processId);
  };

  const navigateToTestResults = (processId) => {
    navigateToTab('test-results', processId);
  };

  const value = {
    activeTab,
    setActiveTab,
    selectedProcessId,
    setSelectedProcessId,
    navigateToTab,
    navigateToAppointments,
    navigateToHealthCheck,
    navigateToBloodCollection,
    navigateToTestResults,
  };

  return (
    <DonationProcessContext.Provider value={value}>
      {children}
    </DonationProcessContext.Provider>
  );
};

export default DonationProcessContext;
