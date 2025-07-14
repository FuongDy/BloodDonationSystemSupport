// Test file to verify blood compatibility logic
// Run this in browser console to test the compatibility rules

// Test cases for blood compatibility
const testCases = [
  // Whole Blood Tests
  {
    name: "O- Whole Blood should be compatible with all recipients",
    donor: "O- Whole Blood",
    expectedRecipients: ["A+ Whole Blood", "A- Whole Blood", "B+ Whole Blood", "B- Whole Blood", "AB+ Whole Blood", "AB- Whole Blood", "O+ Whole Blood", "O- Whole Blood"],
    type: "universal_donor_whole"
  },
  {
    name: "AB+ Whole Blood should be compatible with AB+ only",
    donor: "AB+ Whole Blood", 
    expectedRecipients: ["AB+ Whole Blood"],
    type: "single_recipient_whole"
  },
  {
    name: "AB+ should be able to receive from all donors",
    recipient: "AB+ Whole Blood",
    expectedDonors: ["A+ Whole Blood", "A- Whole Blood", "B+ Whole Blood", "B- Whole Blood", "AB+ Whole Blood", "AB- Whole Blood", "O+ Whole Blood", "O- Whole Blood"],
    type: "universal_recipient_whole"
  },
  
  // Red Blood Cells Tests
  {
    name: "O- Red Blood Cells should be compatible with all recipients",
    donor: "O- Red Blood Cells",
    expectedRecipients: ["A+ Red Blood Cells", "A- Red Blood Cells", "B+ Red Blood Cells", "B- Red Blood Cells", "AB+ Red Blood Cells", "AB- Red Blood Cells", "O+ Red Blood Cells", "O- Red Blood Cells"],
    type: "universal_donor_rbc"
  },
  
  // Platelets Tests
  {
    name: "O- Platelets should be compatible with all recipients",
    donor: "O- Platelets",
    expectedRecipients: ["A+ Platelets", "A- Platelets", "B+ Platelets", "B- Platelets", "AB+ Platelets", "AB- Platelets", "O+ Platelets", "O- Platelets"],
    type: "universal_donor_platelets"
  },
  
  // Plasma Tests
  {
    name: "AB+ Plasma should be compatible with all recipients",
    donor: "AB+ Plasma",
    expectedRecipients: ["A+ Plasma", "A- Plasma", "B+ Plasma", "B- Plasma", "AB+ Plasma", "AB- Plasma", "O+ Plasma", "O- Plasma"],
    type: "universal_donor_plasma"
  },
  {
    name: "O- Plasma should only be compatible with O- recipients",
    donor: "O- Plasma",
    expectedRecipients: ["O- Plasma"],
    type: "single_recipient_plasma"
  },
  
  // Rh Factor Tests
  {
    name: "A- should be compatible with A+ and A- recipients",
    donor: "A- Whole Blood",
    expectedRecipients: ["A+ Whole Blood", "A- Whole Blood", "AB+ Whole Blood", "AB- Whole Blood"],
    type: "rh_negative_compatibility"
  },
  {
    name: "A+ should not be compatible with A- recipients",
    donor: "A+ Whole Blood",
    expectedRecipients: ["A+ Whole Blood", "AB+ Whole Blood"],
    type: "rh_positive_limitation"
  }
];

// Function to run tests (would need actual compatibility rules to work)
function runCompatibilityTests(compatibilityRules) {
  console.log("=== Blood Compatibility Logic Tests ===");
  
  testCases.forEach((testCase, index) => {
    console.log(`\nTest ${index + 1}: ${testCase.name}`);
    
    if (testCase.donor) {
      // Test donor compatibility
      const donorRule = compatibilityRules.find(rule => 
        rule.donorBloodType.description === testCase.donor
      );
      
      if (donorRule) {
        const actualRecipients = compatibilityRules
          .filter(rule => rule.donorBloodType.description === testCase.donor && rule.isCompatible)
          .map(rule => rule.recipientBloodType.description);
        
        const missingRecipients = testCase.expectedRecipients.filter(r => !actualRecipients.includes(r));
        const extraRecipients = actualRecipients.filter(r => !testCase.expectedRecipients.includes(r));
        
        if (missingRecipients.length === 0 && extraRecipients.length === 0) {
          console.log("✅ PASS");
        } else {
          console.log("❌ FAIL");
          if (missingRecipients.length > 0) {
            console.log("Missing recipients:", missingRecipients);
          }
          if (extraRecipients.length > 0) {
            console.log("Extra recipients:", extraRecipients);
          }
        }
      } else {
        console.log("❌ FAIL - Donor not found");
      }
    }
    
    if (testCase.recipient) {
      // Test recipient compatibility
      const actualDonors = compatibilityRules
        .filter(rule => rule.recipientBloodType.description === testCase.recipient && rule.isCompatible)
        .map(rule => rule.donorBloodType.description);
      
      const missingDonors = testCase.expectedDonors.filter(d => !actualDonors.includes(d));
      const extraDonors = actualDonors.filter(d => !testCase.expectedDonors.includes(d));
      
      if (missingDonors.length === 0 && extraDonors.length === 0) {
        console.log("✅ PASS");
      } else {
        console.log("❌ FAIL");
        if (missingDonors.length > 0) {
          console.log("Missing donors:", missingDonors);
        }
        if (extraDonors.length > 0) {
          console.log("Extra donors:", extraDonors);
        }
      }
    }
  });
}

// Export for use in development
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testCases, runCompatibilityTests };
}

console.log("Blood compatibility test suite loaded. Use runCompatibilityTests(compatibilityRules) to run tests.");
