import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // For FormData (file uploads), let browser set Content-Type with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getWallet: () => api.get('/user/wallet'),
  getInvestments: () => api.get('/user/investments'),
  getTransactions: () => api.get('/user/transactions'),
  getSettings: () => api.get('/user/settings'),
};

// Coin API
export const coinAPI = {
  getCoins: () => api.get('/coins'),
  getCoinById: (id) => api.get(`/coins/${id}`),
  refreshPrices: () => api.get('/coins/refresh-prices'),
};

// Transaction API
export const transactionAPI = {
  createDeposit: (formData) => {
    return api.post('/transactions/deposit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  createInvestment: (data) => api.post('/transactions/invest', data),
  createWithdrawal: (data) => api.post('/transactions/withdraw', data),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserWallet: (id, data) => api.put(`/admin/users/${id}/wallet`, data),
  updateUserStatus: (id, data) => api.put(`/admin/users/${id}/status`, data),
  getTransactions: (params) => api.get('/admin/transactions', { params }),
  updateTransaction: (id, data) => api.put(`/admin/transactions/${id}`, data),
  getCoins: () => api.get('/admin/coins'),
  addCoin: (data) => api.post('/admin/coins', data),
  updateCoin: (id, data) => api.put(`/admin/coins/${id}`, data),
  deleteCoin: (id) => api.delete(`/admin/coins/${id}`),
  getAnalytics: () => api.get('/admin/analytics'),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
};

// Support API
export const supportAPI = {
  createMessage: (data) => api.post('/support', data),
  getUserMessages: () => api.get('/support'),
  getAllMessages: (params) => api.get('/support/admin', { params }),
  updateMessage: (id, data) => api.put(`/support/admin/${id}`, data),
  deleteMessage: (id) => api.delete(`/support/admin/${id}`),
  generateResetCode: (data) => api.post('/support/admin/generate-code', data),
};

// Referral API
export const referralAPI = {
  getReferralUsers: () => api.get('/admin/referrals'),
  getReferralStats: () => api.get('/admin/referrals/stats'),
  approveReferralBonus: (id) => api.put(`/admin/referrals/${id}/approve`),
};

export default api;
