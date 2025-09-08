import React, { createContext, useContext, useReducer, useEffect } from 'react';

const DataContext = createContext();

const initialState = {
  overview: {
    kpis: {
      totalRevenue: { value: 0, change: 0 },
      activeUsers: { value: 0, change: 0 },
      averageCTR: { value: 0, change: 0 },
      impressions: { value: 0, change: 0 }
    },
    revenueData: [],
    audienceData: [],
    performanceData: []
  },
  campaigns: {
    activeCampaigns: [],
    campaignMetrics: {}
  },
  abTests: [],
  models: {
    collaborativeFiltering: { status: 'active', accuracy: 0, lastTrained: null },
    ctrPrediction: { status: 'active', auc: 0, lastTrained: null },
    revenueOptimization: { status: 'training', progress: 0, lastTrained: null }
  },
  settings: {
    realTimeData: true,
    notifications: true,
    autoOptimization: false
  },
  loading: false,
  error: null
};

const dataReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_OVERVIEW_DATA':
      return { ...state, overview: { ...state.overview, ...action.payload }, loading: false };
    case 'SET_CAMPAIGNS_DATA':
      return { ...state, campaigns: { ...state.campaigns, ...action.payload }, loading: false };
    case 'SET_AB_TESTS':
      return { ...state, abTests: action.payload, loading: false };
    case 'SET_MODELS_DATA':
      return { ...state, models: { ...state.models, ...action.payload }, loading: false };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'ADD_CAMPAIGN':
      return {
        ...state,
        campaigns: {
          ...state.campaigns,
          activeCampaigns: [...state.campaigns.activeCampaigns, action.payload]
        }
      };
    case 'UPDATE_CAMPAIGN':
      return {
        ...state,
        campaigns: {
          ...state.campaigns,
          activeCampaigns: state.campaigns.activeCampaigns.map(campaign =>
            campaign.id === action.payload.id ? { ...campaign, ...action.payload } : campaign
          )
        }
      };
    case 'DELETE_CAMPAIGN':
      return {
        ...state,
        campaigns: {
          ...state.campaigns,
          activeCampaigns: state.campaigns.activeCampaigns.filter(
            campaign => campaign.id !== action.payload
          )
        }
      };
    case 'ADD_AB_TEST':
      return { ...state, abTests: [...state.abTests, action.payload] };
    case 'UPDATE_AB_TEST':
      return {
        ...state,
        abTests: state.abTests.map(test =>
          test.id === action.payload.id ? { ...test, ...action.payload } : test
        )
      };
    default:
      return state;
  }
};

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Load mock data on component mount
  useEffect(() => {
    loadMockData();
  }, []);

  // Simulate real-time data updates with mock data
  useEffect(() => {
    let interval;
    if (state.settings.realTimeData) {
      interval = setInterval(() => {
        updateMockDataRealtime();
      }, 30000); // Update every 30 seconds with slight variations
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.settings.realTimeData]);

  const loadMockData = () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate loading delay
    setTimeout(() => {
      dispatch({ type: 'SET_OVERVIEW_DATA', payload: getMockOverviewData() });
      dispatch({ type: 'SET_CAMPAIGNS_DATA', payload: getMockCampaignsData() });
      dispatch({ type: 'SET_AB_TESTS', payload: getMockABTestsData() });
      dispatch({ type: 'SET_MODELS_DATA', payload: getMockModelsData() });
    }, 1000);
  };

  const updateMockDataRealtime = () => {
    // Generate slight variations in the data to simulate real-time updates
    const currentData = getMockOverviewData();
    
    // Add small random variations
    currentData.kpis.totalRevenue.value += Math.floor(Math.random() * 1000) - 500;
    currentData.kpis.activeUsers.value += Math.floor(Math.random() * 100) - 50;
    currentData.kpis.averageCTR.value += (Math.random() * 0.2) - 0.1;
    currentData.kpis.impressions.value += Math.floor(Math.random() * 10000) - 5000;
    
    dispatch({ type: 'SET_OVERVIEW_DATA', payload: currentData });
  };

  const loadOverviewData = () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    setTimeout(() => {
      dispatch({ type: 'SET_OVERVIEW_DATA', payload: getMockOverviewData() });
    }, 500);
  };

  const loadCampaignsData = () => {
    dispatch({ type: 'SET_CAMPAIGNS_DATA', payload: getMockCampaignsData() });
  };

  const loadABTestsData = () => {
    dispatch({ type: 'SET_AB_TESTS', payload: getMockABTestsData() });
  };

  const loadModelsData = () => {
    dispatch({ type: 'SET_MODELS_DATA', payload: getMockModelsData() });
  };

  const createCampaign = (campaignData) => {
    const newCampaign = {
      ...campaignData,
      id: Date.now(),
      status: 'active',
      impressions: Math.floor(Math.random() * 100000),
      clicks: Math.floor(Math.random() * 5000),
      conversions: Math.floor(Math.random() * 500),
      ctr: (Math.random() * 5).toFixed(2),
      conversionRate: (Math.random() * 10).toFixed(1),
      startDate: new Date().toISOString().split('T')[0]
    };
    dispatch({ type: 'ADD_CAMPAIGN', payload: newCampaign });
  };

  const updateCampaign = (id, updateData) => {
    dispatch({ type: 'UPDATE_CAMPAIGN', payload: { id, ...updateData } });
  };

  const deleteCampaign = (id) => {
    dispatch({ type: 'DELETE_CAMPAIGN', payload: id });
  };

  const createABTest = (testData) => {
    const newTest = {
      ...testData,
      id: `A${String(Date.now()).slice(-3)}`,
      status: 'running',
      confidence: Math.floor(Math.random() * 30) + 70,
      startDate: new Date().toISOString(),
      variants: [
        { name: 'Control', traffic: 50, conversions: Math.floor(Math.random() * 500), conversionRate: (Math.random() * 8).toFixed(2) },
        { name: 'Variant', traffic: 50, conversions: Math.floor(Math.random() * 600), conversionRate: (Math.random() * 10).toFixed(2) }
      ]
    };
    dispatch({ type: 'ADD_AB_TEST', payload: newTest });
  };

  const updateSettings = (newSettings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
  };

  const value = {
    ...state,
    loadOverviewData,
    loadCampaignsData,
    loadABTestsData,
    loadModelsData,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    createABTest,
    updateSettings
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Enhanced mock data with more realistic random variations
const getMockOverviewData = () => {
  // Generate random but realistic data
  const baseRevenue = 847000;
  const baseUsers = 124000;
  const baseCTR = 3.8;
  const baseImpressions = 2400000;

  return {
    kpis: {
      totalRevenue: { 
        value: baseRevenue + Math.floor(Math.random() * 50000) - 25000, 
        change: 28.5 + (Math.random() * 10) - 5 
      },
      activeUsers: { 
        value: baseUsers + Math.floor(Math.random() * 10000) - 5000, 
        change: 12.3 + (Math.random() * 8) - 4 
      },
      averageCTR: { 
        value: +(baseCTR + (Math.random() * 1) - 0.5).toFixed(1), 
        change: 35.2 + (Math.random() * 10) - 5 
      },
      impressions: { 
        value: baseImpressions + Math.floor(Math.random() * 200000) - 100000, 
        change: 18.7 + (Math.random() * 8) - 4 
      }
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
  };
};

const getMockCampaignsData = () => ({
  activeCampaigns: [
    {
      id: 1,
      name: 'Summer Tech Sale',
      status: 'active',
      budget: 50000,
      spent: 32000 + Math.floor(Math.random() * 5000),
      impressions: 890000 + Math.floor(Math.random() * 50000),
      clicks: 24500 + Math.floor(Math.random() * 2000),
      conversions: 1250 + Math.floor(Math.random() * 200),
      ctr: +(2.75 + Math.random() * 0.5).toFixed(2),
      conversionRate: +(5.1 + Math.random() * 1).toFixed(1),
      startDate: '2024-06-01',
      endDate: '2024-08-31'
    },
    {
      id: 2,
      name: 'Back to School Campaign',
      status: Math.random() > 0.5 ? 'active' : 'paused',
      budget: 30000,
      spent: 18500 + Math.floor(Math.random() * 3000),
      impressions: 520000 + Math.floor(Math.random() * 30000),
      clicks: 15600 + Math.floor(Math.random() * 1500),
      conversions: 780 + Math.floor(Math.random() * 100),
      ctr: +(3.0 + Math.random() * 0.4).toFixed(2),
      conversionRate: +(5.0 + Math.random() * 1).toFixed(1),
      startDate: '2024-08-01',
      endDate: '2024-09-15'
    },
    {
      id: 3,
      name: 'Holiday Shopping',
      status: 'active',
      budget: 75000,
      spent: 25000 + Math.floor(Math.random() * 8000),
      impressions: 1200000 + Math.floor(Math.random() * 100000),
      clicks: 36000 + Math.floor(Math.random() * 3000),
      conversions: 1800 + Math.floor(Math.random() * 300),
      ctr: +(3.2 + Math.random() * 0.6).toFixed(2),
      conversionRate: +(4.8 + Math.random() * 1.2).toFixed(1),
      startDate: '2024-11-01',
      endDate: '2024-12-31'
    }
  ]
});

const getMockABTestsData = () => [
  {
    id: 'A001',
    name: 'Collaborative Filtering vs Manual Targeting',
    status: Math.random() > 0.3 ? 'running' : 'completed',
    confidence: 95 + Math.floor(Math.random() * 5),
    winner: Math.random() > 0.4 ? 'ML Model' : 'Control',
    startDate: '2024-06-15',
    variants: [
      { name: 'Control (Manual)', traffic: 50, conversions: 245 + Math.floor(Math.random() * 50), conversionRate: +(4.9 + Math.random()).toFixed(2) },
      { name: 'ML Model', traffic: 50, conversions: 312 + Math.floor(Math.random() * 60), conversionRate: +(6.24 + Math.random()).toFixed(2) }
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
      { name: 'Static Pricing', traffic: 50, conversions: 890 + Math.floor(Math.random() * 100), conversionRate: +(4.45 + Math.random() * 0.5).toFixed(2) },
      { name: 'Dynamic Pricing', traffic: 50, conversions: 1124 + Math.floor(Math.random() * 120), conversionRate: +(5.62 + Math.random() * 0.6).toFixed(2) }
    ]
  },
  {
    id: 'A003',
    name: 'Personalized vs Generic Ads',
    status: 'running',
    confidence: 87 + Math.floor(Math.random() * 10),
    winner: 'Personalized',
    startDate: '2024-09-01',
    variants: [
      { name: 'Generic Ads', traffic: 50, conversions: 567 + Math.floor(Math.random() * 80), conversionRate: +(3.8 + Math.random() * 0.8).toFixed(2) },
      { name: 'Personalized Ads', traffic: 50, conversions: 723 + Math.floor(Math.random() * 90), conversionRate: +(5.2 + Math.random() * 1).toFixed(2) }
    ]
  }
];

const getMockModelsData = () => ({
  collaborativeFiltering: {
    status: 'active',
    accuracy: +(94.2 + Math.random() * 2).toFixed(1),
    lastTrained: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    features: 128,
    trainingTime: '2.3 hours'
  },
  ctrPrediction: {
    status: 'active',
    auc: +(0.87 + Math.random() * 0.05).toFixed(3),
    lastTrained: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
    features: 256,
    trainingTime: '4.1 hours'
  },
  revenueOptimization: {
    status: Math.random() > 0.7 ? 'training' : 'active',
    progress: Math.random() > 0.7 ? Math.floor(Math.random() * 40) + 60 : 100,
    estimatedCompletion: new Date(Date.now() + Math.random() * 6 * 60 * 60 * 1000).toISOString(),
    features: 512,
    estimatedTime: '6.2 hours'
  }
});