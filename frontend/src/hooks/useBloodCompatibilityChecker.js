// src/hooks/useBloodCompatibilityChecker.js
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import bloodTypeService from '../services/bloodTypeService';
import bloodCompatibilityService from '../services/bloodCompatibilityService';

export const useBloodCompatibilityChecker = () => {
  // State quản lý tab chính và tab phụ
  const [activeTab, setActiveTab] = useState('compatibility');
  const [activeSubTab, setActiveSubTab] = useState('whole');

  // State cho dữ liệu API
  const [allBloodTypes, setAllBloodTypes] = useState([]);
  const [compatibilityRules, setCompatibilityRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // --- Data Fetching & Preparation ---
  const fetchBloodData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [typesResponse, rulesResponse] = await Promise.all([
        bloodTypeService.getAll(),
        bloodCompatibilityService.getAll(0, 1000),
      ]);

      const allTypes = typesResponse || [];
      const allRules = rulesResponse.content || [];

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
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Đã có lỗi xảy ra.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
    fetchBloodData();
  }, [fetchBloodData]);

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
    refetchData: fetchBloodData,
  };
};
