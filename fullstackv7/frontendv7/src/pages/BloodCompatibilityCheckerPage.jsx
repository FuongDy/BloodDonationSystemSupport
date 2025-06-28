// src/pages/BloodCompatibilityCheckerPage.jsx
import React from 'react';
import { useBloodCompatibilityChecker } from '../hooks/useBloodCompatibilityChecker';
import {
  BloodCompatibilityHero,
  BloodCompatibilityTabs,
  BloodTypesTabContent,
  CompatibilityTabContent,
  DonationProcessTabContent,
} from '../components/blood/compatibility';

const BloodCompatibilityCheckerPage = () => {
  const {
    activeTab,
    setActiveTab,
    activeSubTab,
    setActiveSubTab,
    isLoading,
    wholeBloodTypes,
    bloodGroups,
    componentTypes,
    selectedWholeBloodId,
    setSelectedWholeBloodId,
    selectedBloodGroup,
    setSelectedBloodGroup,
    selectedComponent,
    setSelectedComponent,
    compatibleDonors,
    compatibleRecipients,
  } = useBloodCompatibilityChecker();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-red-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-pink-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <BloodCompatibilityHero />

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <BloodCompatibilityTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Tab Content */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100">
            {activeTab === 'types' && <BloodTypesTabContent />}
            
            {activeTab === 'compatibility' && (
              <CompatibilityTabContent
                activeSubTab={activeSubTab}
                setActiveSubTab={setActiveSubTab}
                isLoading={isLoading}
                wholeBloodTypes={wholeBloodTypes}
                bloodGroups={bloodGroups}
                componentTypes={componentTypes}
                selectedWholeBloodId={selectedWholeBloodId}
                setSelectedWholeBloodId={setSelectedWholeBloodId}
                selectedBloodGroup={selectedBloodGroup}
                setSelectedBloodGroup={setSelectedBloodGroup}
                selectedComponent={selectedComponent}
                setSelectedComponent={setSelectedComponent}
                compatibleDonors={compatibleDonors}
                compatibleRecipients={compatibleRecipients}
              />
            )}
            
            {activeTab === 'process' && <DonationProcessTabContent />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodCompatibilityCheckerPage;
