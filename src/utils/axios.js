import axios from 'axios';
import { getTimezone, getTimezoneOffset } from '../utils/helpers';

const getApiEndpoint = () => {
  return 'https://onboarding-api.dglide.com';
};

// Add request interceptor
axios.interceptors.request.use(
  (config) => {
    const timezone = getTimezone();
    const timezoneOffset = getTimezoneOffset();
    const tokenDetail = JSON.parse(localStorage.getItem('auth-token'));

    config.headers['timezone'] = timezone;
    config.headers['timezone-offset'] = timezoneOffset;
    if (tokenDetail?.token) {
      config.headers['Authorization'] = `Bearer ${tokenDetail.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
axios.interceptors.response.use(
  (res) => {
    if (res) {
      return {
        data: res.data,
        headers: res.headers,
        status: true
      };
    }
  },
  (error) => {
    if (!error.response) {
      return Promise.reject({
        ...error,
        message: 'Network error: Unable to reach API server',
        status: false
      });
    }
    return Promise.reject({
      ...error,
      message: error?.response?.data?.message || 'API failed',
      status: false
    });
  }
);

const errorHandler = (error) => {
  const { response } = error;

  if (response?.status === 502) {
    window.location.href = '/maintenance';
  }

  if (!response || [403, 401, 302].includes(response.status)) {
    localStorage.removeItem('auth-token');
    window.location.href = '/login';
    return {
      open: true,
      message: 'Authentication required, redirecting to login.',
      severity: 'error'
    };
  }

  return {
    ...response?.data,
    message: response?.data?.message || 'Something went wrong'
  };
};

const makeHttpCall = async ({ headers = {}, ...options }) => {
  const API_ENDPOINT = getApiEndpoint();
  const tokenDetail = JSON.parse(localStorage.getItem('auth-token'));

  try {
    if (tokenDetail && tokenDetail?.expirationTime < Date.now()) {
      console.log('Token expired ---- generating new');
      const refreshTokenURL = `${API_ENDPOINT}/user/refresh/token`;

      const response = await axios({
        method: 'POST',
        url: refreshTokenURL,
        data: { token: tokenDetail?.token },
      });

      if (response.data.statusCode === 200) {
        localStorage.setItem('auth-token', JSON.stringify(response.data.result));
      } else {
        localStorage.clear();
        window.location.href = '/login';
        return;
      }
    }

    if (!options.url.startsWith('http')) {
      options.url = `${API_ENDPOINT.replace(/\/$/, '')}/${options.url.replace(/^\//, '')}`;
    }

    console.log('📡 Final Request URL:', options.url);

    const result = await axios({
      ...options,
      headers: {
        ...headers
      }
    });

    return result.data ? result.data : null;
  } catch (err) {
    console.error('Axios call failed:', err);
    return errorHandler(err);
  }
};

// ✅ Named export for specific API usage
export const userLogin = async (data) => {
  return await makeHttpCall({
    method: 'POST',
    url: '/user/login',
    data,
    headers: { username: data?.username }
  });
};

export default makeHttpCall;
