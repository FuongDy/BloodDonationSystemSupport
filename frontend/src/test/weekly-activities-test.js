// Test API endpoint
// GET /api/staff/weekly-activities

// Response example:
{
  "donations": {
    "T2": 12,
    "T3": 18,
    "T4": 15,
    "T5": 17,
    "T6": 25,
    "T7": 22,
    "CN": 8
  },
  "appointments": {
    "T2": 14,
    "T3": 22,
    "T4": 18,
    "T5": 20,
    "T6": 28,
    "T7": 25,
    "CN": 10
  },
  "weekRange": "02/07 - 08/07"
}

// Usage in frontend:
import staffService from '../services/staffService';

const getWeeklyData = async () => {
  try {
    const response = await staffService.getWeeklyActivities();
    console.log('Weekly data:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
