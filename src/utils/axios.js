import axios from "axios";
import { getTimezone, getTimezoneOffset } from "../utils/helpers";
import { notify } from "../hooks/toastUtils";

const getApiEndpoint = () => {
  return "https://onboarding-api.dglide.com";
};

// Global variables to manage token refresh state
let isRefreshing = false;
let refreshPromise = null;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

const getStoredToken = () => {
  try {
    const stored = localStorage.getItem("auth-token");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error parsing stored token:", error);
    localStorage.removeItem("auth-token");
    return null;
  }
};

const isTokenExpired = (tokenDetail) => {
  if (!tokenDetail || !tokenDetail.expirationTime) {
    return true;
  }
  
  const now = Date.now();
  const expirationTime = typeof tokenDetail.expirationTime === 'string' 
    ? new Date(tokenDetail.expirationTime).getTime() 
    : tokenDetail.expirationTime;
    
  // Add 30 second buffer
  return expirationTime < (now + 30000);
};

const refreshAuthToken = async () => {
  const API_ENDPOINT = getApiEndpoint();
  const tokenDetail = getStoredToken();

  if (!tokenDetail?.refreshToken) {
    console.error("No refresh token available");
    throw new Error("No refresh token available");
  }

  try {
    const refreshTokenURL = `${API_ENDPOINT}/user/refresh-token`;
    const refreshResponse = await axios.create()({
      method: "POST",
      url: refreshTokenURL,
      data: { refreshToken: tokenDetail.refreshToken },
      headers: {
        "Content-Type": "application/json",
        "timezone": getTimezone(),
        "timezone-offset": getTimezoneOffset(),
      },
    });

    console.log("Refresh response status:", refreshResponse.status);

    if (refreshResponse.status === 200 && refreshResponse.data?.result?.tokenDetail) {
      const newTokenDetail = refreshResponse.data.result.tokenDetail;
      
      // Ensure we have a valid token
      if (!newTokenDetail.token) {
        throw new Error("No token received in refresh response");
      }
      
      // Preserve the refresh token if it's not provided in the response
      if (!newTokenDetail.refreshToken && tokenDetail.refreshToken) {
        console.log("Preserving existing refresh token");
        newTokenDetail.refreshToken = tokenDetail.refreshToken;
      }
      
      // Ensure expiration time is properly set
      if (newTokenDetail.expirationTime) {
        // Convert to timestamp if it's a string
        if (typeof newTokenDetail.expirationTime === 'string') {
          newTokenDetail.expirationTime = new Date(newTokenDetail.expirationTime).getTime();
        }
      }
      
      console.log("Saving new token details:", {
        hasToken: !!newTokenDetail.token,
        hasRefreshToken: !!newTokenDetail.refreshToken,
        expirationTime: newTokenDetail.expirationTime ? new Date(newTokenDetail.expirationTime) : 'N/A'
      });
      
      localStorage.setItem("auth-token", JSON.stringify(newTokenDetail));
      console.log("Token refreshed successfully");
      
      return newTokenDetail;
    } else {
      console.error("Invalid refresh response:", refreshResponse.data);
      throw new Error("Invalid refresh response");
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    
    // Clear tokens on auth failure
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log("Clearing tokens due to auth failure");
      localStorage.removeItem("auth-token");
    }
    
    throw error;
  }
};

// Create a function to add auth header
const addAuthHeader = (config, token) => {
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
};

// Add request interceptor
axios.interceptors.request.use(
  async (config) => {
    // Add timezone headers
    config.headers["timezone"] = getTimezone();
    config.headers["timezone-offset"] = getTimezoneOffset();

    // Skip token handling for refresh token requests
    if (config.url?.includes('/user/refresh-token')) {
      return config;
    }

    let tokenDetail = getStoredToken();
    
    // Log current token state
    console.log("Token check:", {
      hasToken: !!tokenDetail?.token,
      hasRefreshToken: !!tokenDetail?.refreshToken,
      expirationTime: tokenDetail?.expirationTime ? new Date(tokenDetail.expirationTime) : 'N/A',
      currentTime: new Date(),
      isExpired: tokenDetail ? isTokenExpired(tokenDetail) : true
    });

    // If no token at all, let the request proceed (might be a public endpoint)
    if (!tokenDetail) {
      return config;
    }

    // Check if token needs refreshing
    if (isTokenExpired(tokenDetail)) {
      if (isRefreshing) {
        // If refresh is in progress, queue this request
        // console.log("Queueing request while refresh in progress");
        return new Promise((resolve, reject) => {
          failedQueue.push({ 
            resolve: (token) => {
              // console.log("Processing queued request with new token");
              resolve(addAuthHeader(config, token));
            }, 
            reject 
          });
        });
      }

      // Start refresh process
      // console.log("Starting token refresh process");
      isRefreshing = true;
      refreshPromise = refreshAuthToken();

      try {
        const newTokenDetail = await refreshPromise;
        // console.log("Token refresh completed, processing queue");
        processQueue(null, newTokenDetail.token);
        return addAuthHeader(config, newTokenDetail.token);
      } catch (error) {
        console.error("Token refresh failed, processing queue with error");
        processQueue(error, null);
        
        // Redirect to login on auth failure
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.clear();
          window.location.href = "/login";
        }
        
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    } else if (tokenDetail?.token) {
      // Token is valid, use it
      return addAuthHeader(config, tokenDetail.token);
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor
axios.interceptors.response.use(
  (res) => {
    if (res) {
      return {
        data: res.data,
        headers: res.headers,
        status: true,
      };
    }
  },
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject({
        ...error,
        message: "Network error: Unable to reach API server",
        status: false,
      });
    }

    // Handle 401/403 errors - token might be invalid
    if ((error.response.status === 401 || error.response.status === 403) && 
        !originalRequest._retry && 
        !originalRequest.url?.includes('/user/refresh-token')) {
      
      console.log("Received 401/403, attempting token refresh");
      originalRequest._retry = true;

      if (isRefreshing) {
        // Wait for the current refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(axios(originalRequest));
            },
            reject: (err) => {
              reject(err);
            }
          });
        });
      } else {
        // Start new refresh
        isRefreshing = true;
        refreshPromise = refreshAuthToken();

        try {
          const newTokenDetail = await refreshPromise;
          console.log("Token refreshed in response interceptor");
          processQueue(null, newTokenDetail.token);
          
          // Retry the original request with new token
          originalRequest.headers["Authorization"] = `Bearer ${newTokenDetail.token}`;
          return axios(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed in response interceptor:", refreshError);
          processQueue(refreshError, null);
          
          // Only redirect on auth errors
          if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
            localStorage.clear();
            window.location.href = "/login";
          }
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      }
    }

    return Promise.reject({
      ...error,
      message: error?.response?.data?.message || "API failed",
      status: false,
    });
  }
);

const errorHandler = (error) => {
  const { response } = error;

  if (response?.status === 502) {
    window.location.href = "/maintenance";
  }

  if (!response || [403, 401, 302].includes(response.status)) {
    localStorage.removeItem("auth-token");
    window.location.href = "/login";
    return {
      open: true,
      message: "Authentication required, redirecting to login.",
      severity: "error",
    };
  }

  return {
    ...response?.data,
    message: response?.data?.message || "Something went wrong",
  };
};

const makeHttpCall = async ({ headers = {}, ...options }) => {
  const API_ENDPOINT = getApiEndpoint();

  try {
    // Set full URL
    if (!options.url.startsWith("http")) {
      options.url = `${API_ENDPOINT.replace(/\/$/, "")}/${options.url.replace(
        /^\//,
        ""
      )}`;
    }

    console.log("Final Request URL:", options.url);

    const isFormData = options.data instanceof FormData;
    const result = await axios({
      ...options,
      headers: {
        ...headers,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
    });

    return result.data || null;
  } catch (err) {
    console.error("Axios call failed:", err);
    return errorHandler(err);
  }
};

// ✅ Named export for specific API usage
export const userLogin = async (credentials) => {
  try {
    const response = await makeHttpCall({
      method: "POST",
      url: "/user/login",
      data: credentials,
      headers: { username: credentials?.username },
    });

    if (response.status) {
      // Ensure expiration time is properly stored
      const tokenDetail = response.result.tokenDetail;
      if (tokenDetail.expirationTime && typeof tokenDetail.expirationTime === 'string') {
        tokenDetail.expirationTime = new Date(tokenDetail.expirationTime).getTime();
      }
      
      localStorage.setItem("auth-token", JSON.stringify(tokenDetail));
      console.log("Login successful, token stored");
    } else {
      notify.error(response?.message || "Oops! Something went wrong");
    }

    return response;
  } catch (error) {
    notify.error("Login failed. Please try again.");
    console.error("Login error:", error);
    return null;
  }
};

// export const userLogin = async (data) => {

//   if (data.status) {
//     localStorage.setItem(
//       "auth-token",
//       JSON.stringify(data.result.tokenDetail)
//     );
//     navigate("/");
//     window.location.reload();
//   } else {
//     notify.error(data?.message || "Oops! Something went wrong");
//   }

//   return await makeHttpCall({
//     method: 'POST',
//     url: '/user/login',
//     data,
//     headers: { username: data?.username }
//   });
// };


export default makeHttpCall;
