// API Service for portfolio app
// Update the BASE_URL to your live server URL

const BASE_URL = 'https://rahulkushwaha.net'; // Change this to your domain

export const fetchReport = async (params = {}) => {
  try {
    const query = new URLSearchParams({ limit: 1, ...params }).toString();
    const response = await fetch(`${BASE_URL}/api/visitors.php?${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data.success) {
      return {
        statistics: data.statistics,
        top_countries: data.top_countries || [],
        top_pages: data.top_pages || [],
      };
    }
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
};

export const fetchFilterOptions = async (country = null) => {
  try {
    const query = country ? `?country=${encodeURIComponent(country)}` : '';
    const response = await fetch(`${BASE_URL}/api/filter-options.php${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data.success) return { countries: data.countries || [], regions: data.regions || [] };
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
};

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

export const fetchVisits = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.country) params.append('country', filters.country);
    if (filters.region) params.append('region', filters.region);
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);
    const query = params.toString();
    const url = query ? `${BASE_URL}/api/visits.php?${query}` : `${BASE_URL}/api/visits.php`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data.success && data.visits) return data.visits;
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error fetching visits:', error);
    throw error;
  }
};

