import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Memory store for access token
let currentAccessToken = null;

export const setAccessToken = (token) => {
  currentAccessToken = token;
};

// Fetch CSRF token once
let csrfPromise = null;
export const ensureCsrfToken = async () => {
  if (!csrfPromise) {
    csrfPromise = api.get('/csrf-token').then(res => {
      // Set to generic api instance
      api.defaults.headers.common["x-csrf-token"] = res.data.csrfToken;
      // Set to generic axios as a fallback for components importing vanilla axios
      axios.defaults.headers.common["x-csrf-token"] = res.data.csrfToken;
      axios.defaults.withCredentials = true;
    }).catch(err => {
      console.error("Failed to fetch CSRF Token:", err)
      csrfPromise = null; // allow retry
    });
  }
  return csrfPromise;
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Attempt CSRF token setup before non-GET
    if (config.method && config.method.toLowerCase() !== 'get') {
      await ensureCsrfToken();
    }
    if (currentAccessToken) {
      config.headers.Authorization = `Bearer ${currentAccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Expired token recovery flow
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh' && originalRequest.url !== '/auth/login') {
      originalRequest._retry = true;
      try {
        const res = await api.post('/auth/refresh');
        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Force logout if refresh is also expired
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(refreshError);
      }
    }
    
    if (!error.response) {
      console.error("Network error:", error);
    } else {
      console.error("API error:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api

