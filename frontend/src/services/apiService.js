import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Authentication
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  async logout() {
    localStorage.removeItem('authToken');
    return api.post('/auth/logout');
  },

  // Overview/Dashboard Data
  async getOverviewData() {
    const response = await api.get('/dashboard/overview');
    return response.data;
  },

  async getKPIs(timeRange = '30d') {
    const response = await api.get(`/dashboard/kpis?timeRange=${timeRange}`);
    return response.data;
  },

  async getRevenueData(timeRange = '6m') {
    const response = await api.get(`/dashboard/revenue?timeRange=${timeRange}`);
    return response.data;
  },

  async getAudienceSegmentation() {
    const response = await api.get('/dashboard/audience-segmentation');
    return response.data;
  },

  // Campaign Management
  async getCampaignsData() {
    const response = await api.get('/campaigns');
    return response.data;
  },

  async getCampaign(id) {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },

  async createCampaign(campaignData) {
    const response = await api.post('/campaigns', campaignData);
    return response.data;
  },

  async updateCampaign(id, updateData) {
    const response = await api.put(`/campaigns/${id}`, updateData);
    return response.data;
  },

  async deleteCampaign(id) {
    const response = await api.delete(`/campaigns/${id}`);
    return response.data;
  },

  async pauseCampaign(id) {
    const response = await api.post(`/campaigns/${id}/pause`);
    return response.data;
  },

  async resumeCampaign(id) {
    const response = await api.post(`/campaigns/${id}/resume`);
    return response.data;
  },

  async getCampaignMetrics(id, timeRange = '7d') {
    const response = await api.get(`/campaigns/${id}/metrics?timeRange=${timeRange}`);
    return response.data;
  },

  // A/B Testing
  async getABTests() {
    const response = await api.get('/ab-tests');
    return response.data;
  },

  async getABTest(id) {
    const response = await api.get(`/ab-tests/${id}`);
    return response.data;
  },

  async createABTest(testData) {
    const response = await api.post('/ab-tests', testData);
    return response.data;
  },

  async updateABTest(id, updateData) {
    const response = await api.put(`/ab-tests/${id}`, updateData);
    return response.data;
  },

  async startABTest(id) {
    const response = await api.post(`/ab-tests/${id}/start`);
    return response.data;
  },

  async stopABTest(id) {
    const response = await api.post(`/ab-tests/${id}/stop`);
    return response.data;
  },

  async getABTestResults(id) {
    const response = await api.get(`/ab-tests/${id}/results`);
    return response.data;
  },

  // ML Models
  async getModelsData() {
    const response = await api.get('/models');
    return response.data;
  },

  async getModelStatus(modelName) {
    const response = await api.get(`/models/${modelName}/status`);
    return response.data;
  },

  async trainModel(modelName, parameters = {}) {
    const response = await api.post(`/models/${modelName}/train`, parameters);
    return response.data;
  },

  async deployModel(modelName, version) {
    const response = await api.post(`/models/${modelName}/deploy`, { version });
    return response.data;
  },

  async getModelMetrics(modelName, timeRange = '7d') {
    const response = await api.get(`/models/${modelName}/metrics?timeRange=${timeRange}`);
    return response.data;
  },

  async getModelPredictions(modelName, inputData) {
    const response = await api.post(`/models/${modelName}/predict`, inputData);
    return response.data;
  },

  // Analytics
  async getAnalyticsData(timeRange = '30d', metrics = []) {
    const params = new URLSearchParams();
    params.append('timeRange', timeRange);
    metrics.forEach(metric => params.append('metrics', metric));
    
    const response = await api.get(`/analytics?${params.toString()}`);
    return response.data;
  },

  async getPerformanceMetrics(timeRange = '30d') {
    const response = await api.get(`/analytics/performance?timeRange=${timeRange}`);
    return response.data;
  },

  async getUserBehaviorAnalytics(timeRange = '30d') {
    const response = await api.get(`/analytics/user-behavior?timeRange=${timeRange}`);
    return response.data;
  },

  async getRevenueAnalytics(timeRange = '30d') {
    const response = await api.get(`/analytics/revenue?timeRange=${timeRange}`);
    return response.data;
  },

  // Real-time data streaming
  async getRealtimeMetrics() {
    const response = await api.get('/realtime/metrics');
    return response.data;
  },

  async getRealtimeEvents(limit = 100) {
    const response = await api.get(`/realtime/events?limit=${limit}`);
    return response.data;
  },

  // Settings & Configuration
  async getSettings() {
    const response = await api.get('/settings');
    return response.data;
  },

  async updateSettings(settings) {
    const response = await api.put('/settings', settings);
    return response.data;
  },

  async getFeatureFlags() {
    const response = await api.get('/settings/feature-flags');
    return response.data;
  },

  async updateFeatureFlag(flagName, enabled) {
    const response = await api.put(`/settings/feature-flags/${flagName}`, { enabled });
    return response.data;
  },

  // User Management
  async getUsers() {
    const response = await api.get('/users');
    return response.data;
  },

  async getUser(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async updateUser(id, userData) {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // System Health & Monitoring
  async getSystemHealth() {
    const response = await api.get('/system/health');
    return response.data;
  },

  async getSystemMetrics() {
    const response = await api.get('/system/metrics');
    return response.data;
  },

  async getLogs(level = 'info', limit = 100) {
    const response = await api.get(`/system/logs?level=${level}&limit=${limit}`);
    return response.data;
  },

  // Data Export
  async exportData(type, timeRange, format = 'csv') {
    const response = await api.get(`/export/${type}?timeRange=${timeRange}&format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  async exportCampaignData(campaignId, format = 'csv') {
    const response = await api.get(`/export/campaigns/${campaignId}?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Notifications
  async getNotifications() {
    const response = await api.get('/notifications');
    return response.data;
  },

  async markNotificationRead(id) {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  async getAlerts() {
    const response = await api.get('/alerts');
    return response.data;
  },

  async createAlert(alertData) {
    const response = await api.post('/alerts', alertData);
    return response.data;
  },

  // Utility functions
  formatError(error) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },

  isNetworkError(error) {
    return !error.response && error.request;
  },

  isServerError(error) {
    return error.response?.status >= 500;
  },

  isClientError(error) {
    return error.response?.status >= 400 && error.response?.status < 500;
  }
};