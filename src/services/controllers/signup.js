import makeHttpCall from '../../utils/axios';

/** Fetch country information based on IP address  */

export const fetchCountryByIP = async (ip) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/get-country?ip=${ip}`,
  });
  return response;
};

/** Create a new tenant account with signup details  */

export const createTenantAccount = async (formData) => {
  const response = await makeHttpCall({
    method: 'POST',
    url: `/signup`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  return response;
};

/** Verify authentication token  */

export const verifyAuthToken = async (token, tenantId) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/auth`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-TenantID': tenantId,
    }
  });
  return response;
};

/** Helper function to get IP address from external service */

export const fetchIPAddress = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    throw error;
  }
};