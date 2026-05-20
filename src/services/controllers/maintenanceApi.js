import makeHttpCall from '../../utils/axios';

export const fetchAllMaintenance = async () => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/maintenance`,
  });
  return response;
};

export const createMaintenance = async (data) => {
  const response = await makeHttpCall({
    method: 'POST',
    url: `/maintenance`,
    data
  });
  return response;
};

export const updateMaintenance = async (id, data) => {
  const response = await makeHttpCall({
    method: 'PUT',
    url: `/maintenance/${id}`,
    data
  });
  return response;
};

export const deleteMaintenance = async (id) => {
  const response = await makeHttpCall({
    method: 'DELETE',
    url: `/maintenance/${id}`,
  });
  return response;
};

export const fetchActiveMaintenanceForTenant = async (tenantId) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/maintenance/active/${tenantId}`,
  });
  return response;
};