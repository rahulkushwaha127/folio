// API Service for fetching contacts
// Update the BASE_URL to your live server URL

const BASE_URL = 'https://rahulkushwaha.net'; // Change this to your domain

export const fetchContacts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/contacts.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};

export const fetchVisits = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/visits.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.visits) {
      return data.visits;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching visits:', error);
    throw error;
  }
};

