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

export const updateTenant = async (tenantId, isActive, environment) => {
  const response = await makeHttpCall({
    method: 'PUT',
    url: `/updateTenant/${tenantId}`,
    data: {
      isActive: isActive.toString(),
      environment: environment
    }
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


export const updateTenantLogo = async (tenantId, environment, companyLogo) => {
  const formData = new FormData();
  formData.append('companyLogo', companyLogo);
  formData.append('environment', environment);

  const response = await makeHttpCall({
    method: 'PUT',
    url: `/updateLogo/${tenantId}`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  return response;
};

export const deleteTenantLogo = async (tenantId, environment) => {
  const response = await makeHttpCall({
    method: 'DELETE',
    url: `/deleteLogo/${tenantId}?environment=${environment}`,
  });
  return response;
};