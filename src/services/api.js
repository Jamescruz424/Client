import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    console.log('Request Sent:', {
      url: config.url,
      method: config.method,
      data: config.data instanceof FormData ? 'FormData' : config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Response Received:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Response Error:', {
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Chat
export const chat = (message) => api.post('/chat', { message });

// Authentication
export const registerUser = (userData) => api.post('/register', userData);
export const loginUser = (loginData) => api.post('/login', loginData);

// Inventory Management
export const getInventory = () => api.get('/inventory');
export const addInventory = (itemData) => api.post('/inventory', itemData);
export const updateInventory = (itemId, itemData) =>
  api.put(`/inventory/${itemId}`, itemData);
export const deleteInventory = (itemId) => api.delete(`/inventory/${itemId}`);

// Requests
export const createRequest = (requestData) => api.post('/requests', requestData);
export const getRequests = () => api.get('/requests');
export const updateRequest = (requestId, requestData) =>
  api.put(`/requests/${requestId}`, requestData);
export const deleteRequest = (requestId, userId) =>
  api.delete(`/requests/${requestId}`, { data: { userId } });
export const getUserHistory = (userId) =>
  api.get('/history', { params: { userId } });

// Asset History (Admin)
export const getAssetHistory = (assetId) => {
  if (!assetId) {
    console.error('getAssetHistory: No assetId provided');
    return Promise.reject(new Error('Asset ID is required'));
  }
  return api.get(`/asset-history/${assetId}`);
};

// Dashboard
export const getDashboardData = () => api.get('/dashboard-data'); // Admin
export const getUserDashboardData = (userId) =>
  api.get('/user-dashboard-data', { params: { userId } }); // User

// Issue and Return
export const issueRequest = (requestId, adminId) =>
  api.post(`/issue/${requestId}`, { adminId });
export const returnRequest = (requestId, userId) =>
  api.post(`/return/${requestId}`, { userId });

// QR Code
export const scanQR = (data) => api.post('/scan-qr', data);

export default api;