import makeHttpCall from '../../utils/axios';

export const fetchAllMaintenance = async () => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/api/v1/onboarding/maintenance`,
  });
  return response;
};

export const createMaintenance = async (data) => {
  const response = await makeHttpCall({
    method: 'POST',
    url: `/api/v1/onboarding/maintenance`,
    data
  });
  return response;
};

export const updateMaintenance = async (id, data) => {
  const response = await makeHttpCall({
    method: 'PUT',
    url: `/api/v1/onboarding/maintenance/${id}`,
    data
  });
  return response;
};

export const deleteMaintenance = async (id) => {
  const response = await makeHttpCall({
    method: 'DELETE',
    url: `/api/v1/onboarding/maintenance/${id}`,
  });
  return response;
};

export const fetchActiveMaintenanceForTenant = async (tenantId) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/api/v1/onboarding/maintenance/active/${tenantId}`,
  });
  return response;
};
