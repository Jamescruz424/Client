import axios from 'axios';

// Base URL of your Flask API
const API_URL = process.env.REACT_APP_API_URL || 'https://server-ywxs.onrender.com'; // Use environment variable for deployment

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication Endpoints
export const registerUser = (userData) => api.post('/register', userData);
export const loginUser = (loginData) => api.post('/login', loginData);

// Inventory Endpoints
export const getInventory = () => api.get('/inventory');
export const addInventory = (itemData) => api.post('/inventory', itemData);
export const updateInventory = (itemId, itemData) => api.put(`/inventory/${itemId}`, itemData);
export const deleteInventory = (itemId) => api.delete(`/inventory/${itemId}`);

// Request Endpoints
export const createRequest = (requestData) => api.post('/requests', requestData);
export const getRequests = () => api.get('/requests');
export const updateRequest = (requestId, requestData) => api.put(`/requests/${requestId}`, requestData);
export const deleteRequest = (requestId, userId) => api.delete(`/requests/${requestId}`, { data: { userId } });

// Dashboard Endpoint
export const getDashboardData = () => api.get('/dashboard');

export default api;
