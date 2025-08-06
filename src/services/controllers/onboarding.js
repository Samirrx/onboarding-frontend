import makeHttpCall from '../../utils/axios';

export const fetchTenantList = async (env) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/getAllTenant?environment=${env}`,
  });
  return response;
};


export const addTenant = async (data) => {
  const response = await makeHttpCall({
    method: 'POST',
    url: `/addTenant`,
    data
  });
  return response;
};

export const updateTenant = async (tenantId, isActive) => {
  const response = await makeHttpCall({
    method: 'PUT',
    url: `/updateTenant/${tenantId}`,
    data: {isActive}
  })
  return response;
}

export const deleteTenant = async (tenantId) => {
  const response = await makeHttpCall({
    method: 'DELETE',
    url: `/deleteTenant/${tenantId}`,
  });
  return response;
};

export const fetchModuleNames = async (environment, tenantId) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/${environment}/module/${tenantId}`,
  });
  return response;
}