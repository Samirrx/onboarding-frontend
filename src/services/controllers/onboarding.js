import makeHttpCall from '../../utils/axios';

export const fetchTenantList = async (env) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/api/v1/onboarding/getAllTenant?environment=${env}`,
  });
  return response;
};


export const addTenant = async (data) => {
  const response = await makeHttpCall({
    method: 'POST',
    url: `/api/v1/onboarding/addTenant`,
    data
  });
  return response;
};

export const updateTenant = async (tenantId, isActive, environment) => {
  const response = await makeHttpCall({
    method: 'PUT',
    url: `/api/v1/onboarding/updateTenant/${tenantId}`,
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
    url: `/api/v1/onboarding/deleteTenant/${tenantId}`,
  });
  return response;
};

export const fetchModuleNames = async (environment, tenantId) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/api/v1/onboarding/${environment}/module/${tenantId}`,
  });
  return response;
}


export const updateTenantLogo = async (tenantId, environment, companyLogo) => {
  const formData = new FormData();
  formData.append('companyLogo', companyLogo);
  formData.append('environment', environment);

  const response = await makeHttpCall({
    method: 'PUT',
    url: `/api/v1/onboarding/updateLogo/${tenantId}`,
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
    url: `/api/v1/onboarding/deleteLogo/${tenantId}?environment=${environment}`,
  });
  return response;
};

export const updateModules = async (tenantId, environment, modules) => {
  const response = await makeHttpCall({
    method: 'PUT',
    url: `/api/v1/onboarding/updateModules/${tenantId}`,
    data: {
      environment: environment,
      modules: modules
    }
  });
  return response;
};
