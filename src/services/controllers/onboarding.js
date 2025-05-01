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
    url: `/gghghhjaddTenant`,
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