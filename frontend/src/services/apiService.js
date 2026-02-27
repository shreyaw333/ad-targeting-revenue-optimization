import axios from 'axios';

// Backend URL - uses environment variable or defaults to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for auth tokens
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
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Get dashboard overview data
  async getOverviewData() {
    try {
      console.log('Attempting to fetch overview data from backend...');
      const response = await api.get('/dashboard/overview');
      console.log('Successfully fetched overview data from backend');
      return response.data;
    } catch (error) {
      console.log('Backend not available, using mock data for overview');
      console.error('Error:', error.message);
      return getMockOverviewData();
    }
  },

  // Get campaigns data
  async getCampaignsData() {
    try {
      console.log('Attempting to fetch campaigns from backend...');
      const response = await api.get('/campaigns');
      console.log('Successfully fetched campaigns from backend');
      return { activeCampaigns: response.data };
    } catch (error) {
      console.log('Backend not available, using mock data for campaigns');
      console.error('Error:', error.message);
      return getMockCampaignsData();
    }
  },

  // Get A/B tests data
  async getABTests() {
    try {
      console.log('Attempting to fetch A/B tests from backend...');
      const response = await api.get('/ab-tests');
      console.log('Successfully fetched A/B tests from backend');
      return response.data;
    } catch (error) {
      console.log('Backend not available, using mock data for A/B tests');
      console.error('Error:', error.message);
      return getMockABTestsData();
    }
  },

  // Get ML models data
  async getModelsData() {
    try {
      console.log('Attempting to fetch models data from backend...');
      const response = await api.get('/models');
      console.log('Successfully fetched models data from backend');
      return response.data;
    } catch (error) {
      console.log('Backend not available, using mock data for models');
      console.error('Error:', error.message);
      return getMockModelsData();
    }
  },

  // Get user recommendations (collaborative filtering)
  async getUserRecommendations(userId) {
    try {
      const response = await api.get(`/recommendations/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return { recommendations: [], error: error.message };
    }
  },

  // Predict CTR for an ad
  async predictCTR(adData) {
    try {
      const response = await api.post('/predict/ctr', adData);
      return response.data;
    } catch (error) {
      console.error('Error predicting CTR:', error);
      return { predicted_ctr: 0.03, error: error.message };
    }
  }
};

// Mock data generator functions
const getMockOverviewData = () => ({
  kpis: {
    totalRevenue: { value: 847000 + Math.floor(Math.random() * 50000), change: 28.5 + (Math.random() * 5) },
    activeUsers: { value: 124000 + Math.floor(Math.random() * 10000), change: 12.3 + (Math.random() * 3) },
    averageCTR: { value: +(3.8 + Math.random()).toFixed(1), change: 35.2 + (Math.random() * 5) },
    impressions: { value: 2400000 + Math.floor(Math.random() * 200000), change: 18.7 + (Math.random() * 4) }
  },
  revenueData: [
    { name: 'Jan', revenue: 4000 + Math.floor(Math.random() * 1000), ctr: +(2.4 + Math.random() * 0.5).toFixed(1), rpu: +(12.5 + Math.random() * 2).toFixed(1) },
    { name: 'Feb', revenue: 3000 + Math.floor(Math.random() * 1000), ctr: +(2.1 + Math.random() * 0.5).toFixed(1), rpu: +(11.8 + Math.random() * 2).toFixed(1) },
    { name: 'Mar', revenue: 5000 + Math.floor(Math.random() * 1000), ctr: +(2.8 + Math.random() * 0.5).toFixed(1), rpu: +(15.2 + Math.random() * 2).toFixed(1) },
    { name: 'Apr', revenue: 4500 + Math.floor(Math.random() * 1000), ctr: +(3.1 + Math.random() * 0.5).toFixed(1), rpu: +(16.8 + Math.random() * 2).toFixed(1) },
    { name: 'May', revenue: 6000 + Math.floor(Math.random() * 1000), ctr: +(3.5 + Math.random() * 0.5).toFixed(1), rpu: +(18.9 + Math.random() * 2).toFixed(1) },
    { name: 'Jun', revenue: 7200 + Math.floor(Math.random() * 1000), ctr: +(3.8 + Math.random() * 0.5).toFixed(1), rpu: +(21.3 + Math.random() * 2).toFixed(1) }
  ],
  audienceData: [
    { name: 'Tech Enthusiasts', value: 35 + Math.floor(Math.random() * 6) - 3, color: '#3b82f6' },
    { name: 'Fashion Lovers', value: 25 + Math.floor(Math.random() * 6) - 3, color: '#10b981' },
    { name: 'Sports Fans', value: 20 + Math.floor(Math.random() * 6) - 3, color: '#f59e0b' },
    { name: 'Gamers', value: 12 + Math.floor(Math.random() * 4) - 2, color: '#ef4444' },
    { name: 'Others', value: 8 + Math.floor(Math.random() * 4) - 2, color: '#8b5cf6' }
  ],
  performanceData: [
    { metric: 'CTR Improvement', value: `+${(35 + Math.random() * 10).toFixed(0)}%`, trend: 'up' },
    { metric: 'Revenue per User', value: `+${(28 + Math.random() * 8).toFixed(0)}%`, trend: 'up' },
    { metric: 'Conversion Rate', value: `+${(42 + Math.random() * 10).toFixed(0)}%`, trend: 'up' },
    { metric: 'Cost per Acquisition', value: `-${(18 + Math.random() * 6).toFixed(0)}%`, trend: 'down' }
  ]
});

const getMockCampaignsData = () => ({
  activeCampaigns: [
    generateRandomCampaign(),
    generateRandomCampaign(),
    generateRandomCampaign(),
    generateRandomCampaign(),
    generateRandomCampaign()
  ]
});

const getMockABTestsData = () => [
  generateRandomABTest(),
  generateRandomABTest(),
  generateRandomABTest()
];

const getMockModelsData = () => ({
  collaborativeFiltering: {
    status: 'active',
    accuracy: 94.2,
    lastTrained: new Date().toISOString(),
    features: 128,
    trainingTime: '2.3 hours'
  },
  ctrPrediction: {
    status: 'active',
    auc: 0.87,
    lastTrained: new Date().toISOString(),
    features: 256,
    trainingTime: '4.1 hours'
  },
  revenueOptimization: {
    status: 'active',
    progress: 100,
    features: 512,
    trainingTime: '6.2 hours'
  }
});

// Generate random campaign data
const generateRandomCampaign = () => {
  const names = [
    'Summer Tech Sale', 'Back to School Campaign', 'Holiday Shopping', 'Spring Fashion',
    'Black Friday Deals', 'Cyber Monday', 'New Year Promotions', 'Valentine\'s Day',
    'Mother\'s Day Special', 'Father\'s Day Sale', 'Gaming Hardware Push', 'Fitness Goals'
  ];
  
  const statuses = ['active', 'paused', 'completed'];
  const budget = Math.floor(Math.random() * 80000) + 20000;
  const spent = Math.floor(budget * (0.3 + Math.random() * 0.6));
  
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    name: names[Math.floor(Math.random() * names.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    budget,
    spent,
    impressions: Math.floor(Math.random() * 1000000) + 100000,
    clicks: Math.floor(Math.random() * 50000) + 5000,
    conversions: Math.floor(Math.random() * 2000) + 200,
    ctr: +(Math.random() * 5 + 1).toFixed(2),
    conversionRate: +(Math.random() * 8 + 2).toFixed(1),
    startDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };
};

// Generate random A/B test data
const generateRandomABTest = () => {
  const testNames = [
    'Collaborative Filtering vs Manual Targeting',
    'Dynamic vs Static Pricing',
    'Personalized vs Generic Ads',
    'Video vs Image Creatives',
    'Mobile vs Desktop Optimization',
    'Morning vs Evening Timing',
    'Lookalike vs Interest Targeting',
    'Single vs Multi-Product Ads'
  ];
  
  const statuses = ['running', 'completed', 'paused', 'draft'];
  
  return {
    id: `A${String(Date.now()).slice(-3)}`,
    name: testNames[Math.floor(Math.random() * testNames.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    confidence: Math.floor(Math.random() * 30) + 70,
    winner: Math.random() > 0.5 ? 'Variant A' : 'Variant B',
    startDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    variants: [
      { 
        name: 'Control', 
        traffic: 50, 
        conversions: Math.floor(Math.random() * 800) + 200, 
        conversionRate: +(Math.random() * 6 + 3).toFixed(2) 
      },
      { 
        name: 'Variant', 
        traffic: 50, 
        conversions: Math.floor(Math.random() * 1000) + 250, 
        conversionRate: +(Math.random() * 8 + 4).toFixed(2) 
      }
    ]
  };
};

// Log initial status
console.log('API Service initialized');
console.log('Backend URL:', API_BASE_URL);
console.log('Will fall back to mock data if backend is unavailable');