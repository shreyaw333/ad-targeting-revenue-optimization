

export const apiService = {

  async login(credentials) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: { id: 1, name: 'Admin User', email: 'admin@company.com' },
          token: 'mock-jwt-token'
        });
      }, 500);
    });
  },

  async logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 200);
    });
  },

  // Dashboard Data (Mock)
  async getOverviewData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockOverviewData());
      }, 300);
    });
  },

  async getKPIs(timeRange = '30d') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalRevenue: { value: 847000, change: 28.5 },
          activeUsers: { value: 124000, change: 12.3 },
          averageCTR: { value: 3.8, change: 35.2 },
          impressions: { value: 2400000, change: 18.7 }
        });
      }, 200);
    });
  },

  async getRevenueData(timeRange = '6m') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { name: 'Jan', revenue: 4000, ctr: 2.4, rpu: 12.5 },
          { name: 'Feb', revenue: 3000, ctr: 2.1, rpu: 11.8 },
          { name: 'Mar', revenue: 5000, ctr: 2.8, rpu: 15.2 },
          { name: 'Apr', revenue: 4500, ctr: 3.1, rpu: 16.8 },
          { name: 'May', revenue: 6000, ctr: 3.5, rpu: 18.9 },
          { name: 'Jun', revenue: 7200, ctr: 3.8, rpu: 21.3 }
        ]);
      }, 200);
    });
  },

  async getAudienceSegmentation() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { name: 'Tech Enthusiasts', value: 35, color: '#3b82f6' },
          { name: 'Fashion Lovers', value: 25, color: '#10b981' },
          { name: 'Sports Fans', value: 20, color: '#f59e0b' },
          { name: 'Gamers', value: 12, color: '#ef4444' },
          { name: 'Others', value: 8, color: '#8b5cf6' }
        ]);
      }, 200);
    });
  },

  // Campaign Management (Mock)
  async getCampaignsData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          activeCampaigns: [
            {
              id: 1,
              name: 'Summer Tech Sale',
              status: 'active',
              budget: 50000,
              spent: 32000,
              impressions: 890000,
              clicks: 24500,
              conversions: 1250,
              ctr: 2.75,
              conversionRate: 5.1,
              startDate: '2024-06-01',
              endDate: '2024-08-31'
            },
            {
              id: 2,
              name: 'Back to School Campaign',
              status: 'paused',
              budget: 30000,
              spent: 18500,
              impressions: 520000,
              clicks: 15600,
              conversions: 780,
              ctr: 3.0,
              conversionRate: 5.0,
              startDate: '2024-08-01',
              endDate: '2024-09-15'
            }
          ]
        });
      }, 300);
    });
  },

  async getCampaign(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          name: `Campaign ${id}`,
          status: 'active',
          budget: 50000,
          spent: 32000,
          impressions: 890000,
          clicks: 24500,
          conversions: 1250
        });
      }, 200);
    });
  },

  async createCampaign(campaignData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now(),
          ...campaignData,
          status: 'active',
          impressions: 0,
          clicks: 0,
          conversions: 0,
          ctr: 0,
          conversionRate: 0
        });
      }, 500);
    });
  },

  async updateCampaign(id, updateData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id, ...updateData });
      }, 300);
    });
  },

  async deleteCampaign(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 200);
    });
  },

  // A/B Testing (Mock)
  async getABTests() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'A001',
            name: 'Collaborative Filtering vs Manual Targeting',
            status: 'running',
            confidence: 95,
            winner: 'ML Model',
            startDate: '2024-06-15',
            variants: [
              { name: 'Control (Manual)', traffic: 50, conversions: 245, conversionRate: 4.9 },
              { name: 'ML Model', traffic: 50, conversions: 312, conversionRate: 6.24 }
            ]
          },
          {
            id: 'A002',
            name: 'Dynamic vs Static Pricing',
            status: 'completed',
            confidence: 98,
            winner: 'Dynamic Pricing',
            startDate: '2024-05-01',
            endDate: '2024-05-31',
            variants: [
              { name: 'Static Pricing', traffic: 50, conversions: 890, conversionRate: 4.45 },
              { name: 'Dynamic Pricing', traffic: 50, conversions: 1124, conversionRate: 5.62 }
            ]
          }
        ]);
      }, 300);
    });
  },

  async createABTest(testData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `A${String(Date.now()).slice(-3)}`,
          ...testData,
          status: 'draft',
          confidence: 0,
          variants: []
        });
      }, 400);
    });
  },

  // ML Models (Mock)
  async getModelsData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          collaborativeFiltering: {
            status: 'active',
            accuracy: 94.2,
            lastTrained: '2024-06-10T14:30:00Z',
            features: 128,
            trainingTime: '2.3 hours'
          },
          ctrPrediction: {
            status: 'active',
            auc: 0.87,
            lastTrained: '2024-06-12T09:15:00Z',
            features: 256,
            trainingTime: '4.1 hours'
          },
          revenueOptimization: {
            status: 'training',
            progress: 78,
            estimatedCompletion: '2024-06-15T16:00:00Z',
            features: 512,
            estimatedTime: '6.2 hours'
          }
        });
      }, 250);
    });
  },

  async trainModel(modelName, parameters = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Training started for ${modelName}`,
          estimatedTime: '4.5 hours'
        });
      }, 300);
    });
  },

  // Settings (Mock)
  async getSettings() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          realTimeData: true,
          notifications: true,
          autoOptimization: false,
          theme: 'light',
          refreshInterval: 30
        });
      }, 200);
    });
  },

  async updateSettings(settings) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, settings });
      }, 300);
    });
  },

  // System Health (Mock)
  async getSystemHealth() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'healthy',
          services: {
            database: 'healthy',
            redis: 'healthy',
            kafka: 'healthy',
            mlPipeline: 'healthy'
          },
          uptime: '99.8%',
          lastUpdate: new Date().toISOString()
        });
      }, 200);
    });
  },

  // Utility functions
  formatError(error) {
    return error.message || 'An unexpected error occurred';
  },

  isNetworkError(error) {
    return false; // No network errors in mock mode
  },

  isServerError(error) {
    return false; // No server errors in mock mode
  },

  isClientError(error) {
    return false; // No client errors in mock mode
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

// Console log to indicate mock mode
console.log('🔧 API Service running in MOCK MODE - No backend required!');
console.log('📊 Generating random data for demonstration...');