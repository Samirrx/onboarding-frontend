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

export const updateModules = async (tenantId, environment, modules) => {
  const response = await makeHttpCall({
    method: 'PUT',
    url: `/updateModules/${tenantId}`,
    data: {
      environment: environment,
      modules: modules
    }
  });
  return response;
};
/**
 * AI credit administration. Every call carries an environment because there is one master registry
 * per environment (dev / demo / preprod / app) - the same reason fetchTenantList takes one. A wrong
 * value operates on the wrong estate's tenants without failing.
 *
 * All of these require the AI_CREDIT_GRANT authority and come back 403 otherwise; granting credits
 * is a commercial act, deliberately not something a tenant's own administrator can reach.
 */
export const fetchAiCreditBalances = async (env) => {
  const response = await makeHttpCall({
    method: 'GET',
    url: `/credits?environment=${env}`,
  });
  return response;
};

/**
 * Grants credits to a tenant, or revokes them with a negative amount. Recorded as its own ledger
 * row either way, so what was given and taken back stays reconstructable - never edit a past grant.
 * Zero is rejected by the backend rather than treated as a no-op.
 */
export const grantAiCredits = async (tenantId, env, data) => {
  const response = await makeHttpCall({
    method: 'POST',
    url: `/credits/${tenantId}?environment=${env}`,
    data,
  });
  return response;
};

/** Turns a tenant's AI features on or off without changing the credits they hold. */
export const setTenantAiEnabled = async (tenantId, env, aiEnabled) => {
  const response = await makeHttpCall({
    method: 'POST',
    url: `/credits/${tenantId}/enabled?environment=${env}&aiEnabled=${aiEnabled}`,
  });
  return response;
};
