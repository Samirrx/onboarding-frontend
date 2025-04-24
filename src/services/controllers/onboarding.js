import makeHttpCall from '../../utils/axios';

export const fetchTenantList = async () => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/getAllTenant`
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
