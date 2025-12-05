import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/password', data)
};

// Courrier API
export const courrierAPI = {
  getAll: (params) => api.get('/courriers', { params }),
  getOne: (id) => api.get(`/courriers/${id}`),
  create: (data) => api.post('/courriers', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  affecter: (id, data) => api.put(`/courriers/${id}/affecter`, data),
  traiter: (id, data) => api.put(`/courriers/${id}/traiter`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
  }),
  rappel: (id, data) => api.put(`/courriers/${id}/rappel`, data),
  track: (reference) => api.get(`/courriers/suivi/${reference}`)
};

// User API
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getOne: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
};

// Service API
export const serviceAPI = {
  getAll: () => api.get('/services'),
  getOne: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`)
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecent: (limit) => api.get('/dashboard/recent', { params: { limit } }),
  getByService: () => api.get('/dashboard/by-service')
};

// Notification API
export const notificationAPI = {
  getAll: (unreadOnly) => api.get('/notifications', { params: { unreadOnly } }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  sendTest: () => api.post('/notifications/test')
};

// AI API
export const aiAPI = {
  analyze: (data) => api.post('/ai/analyze', data),
  suggestService: (data) => api.post('/ai/suggest-service', data),
  checkReminders: () => api.post('/ai/check-reminders')
};

// Video Assistance API
export const assistanceAPI = {
  getAll: () => api.get('/assistance'),
  create: (data) => api.post('/assistance', data),
  startCall: (id) => api.put(`/assistance/${id}/start`),
  endCall: (id) => api.put(`/assistance/${id}/end`),
  rate: (id, rating) => api.put(`/assistance/${id}/rate`, { rating }),
  cancel: (id) => api.delete(`/assistance/${id}`)
};
