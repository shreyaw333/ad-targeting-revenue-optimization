import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiService } from '../services/apiService';

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

  // Load initial data
  useEffect(() => {
    loadOverviewData();
    loadCampaignsData();
    loadABTestsData();
    loadModelsData();
  }, []);

  // Real-time data updates
  useEffect(() => {
    let interval;
    if (state.settings.realTimeData) {
      interval = setInterval(() => {
        loadOverviewData();
      }, 30000); // Update every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.settings.realTimeData]);

  const loadOverviewData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const data = await apiService.getOverviewData();
      dispatch({ type: 'SET_OVERVIEW_DATA', payload: data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      // Use mock data as fallback
      dispatch({ type: 'SET_OVERVIEW_DATA', payload: getMockOverviewData() });
    }
  };

  const loadCampaignsData = async () => {
    try {
      const data = await apiService.getCampaignsData();
      dispatch({ type: 'SET_CAMPAIGNS_DATA', payload: data });
    } catch (error) {
      dispatch({ type: 'SET_CAMPAIGNS_DATA', payload: getMockCampaignsData() });
    }
  };

  const loadABTestsData = async () => {
    try {
      const data = await apiService.getABTests();
      dispatch({ type: 'SET_AB_TESTS', payload: data });
    } catch (error) {
      dispatch({ type: 'SET_AB_TESTS', payload: getMockABTestsData() });
    }
  };

  const loadModelsData = async () => {
    try {
      const data = await apiService.getModelsData();
      dispatch({ type: 'SET_MODELS_DATA', payload: data });
    } catch (error) {
      dispatch({ type: 'SET_MODELS_DATA', payload: getMockModelsData() });
    }
  };

  const createCampaign = async (campaignData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newCampaign = await apiService.createCampaign(campaignData);
      dispatch({ type: 'ADD_CAMPAIGN', payload: newCampaign });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const updateCampaign = async (id, updateData) => {
    try {
      const updatedCampaign = await apiService.updateCampaign(id, updateData);
      dispatch({ type: 'UPDATE_CAMPAIGN', payload: updatedCampaign });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const deleteCampaign = async (id) => {
    try {
      await apiService.deleteCampaign(id);
      dispatch({ type: 'DELETE_CAMPAIGN', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createABTest = async (testData) => {
    try {
      const newTest = await apiService.createABTest(testData);
      dispatch({ type: 'ADD_AB_TEST', payload: newTest });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
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

// Mock data functions for fallback
const getMockOverviewData = () => ({
  kpis: {
    totalRevenue: { value: 847000, change: 28.5 },
    activeUsers: { value: 124000, change: 12.3 },
    averageCTR: { value: 3.8, change: 35.2 },
    impressions: { value: 2400000, change: 18.7 }
  },
  revenueData: [
    { name: 'Jan', revenue: 4000, ctr: 2.4, rpu: 12.5 },
    { name: 'Feb', revenue: 3000, ctr: 2.1, rpu: 11.8 },
    { name: 'Mar', revenue: 5000, ctr: 2.8, rpu: 15.2 },
    { name: 'Apr', revenue: 4500, ctr: 3.1, rpu: 16.8 },
    { name: 'May', revenue: 6000, ctr: 3.5, rpu: 18.9 },
    { name: 'Jun', revenue: 7200, ctr: 3.8, rpu: 21.3 }
  ],
  audienceData: [
    { name: 'Tech Enthusiasts', value: 35, color: '#3b82f6' },
    { name: 'Fashion Lovers', value: 25, color: '#10b981' },
    { name: 'Sports Fans', value: 20, color: '#f59e0b' },
    { name: 'Gamers', value: 12, color: '#ef4444' },
    { name: 'Others', value: 8, color: '#8b5cf6' }
  ],
  performanceData: [
    { metric: 'CTR Improvement', value: '+35%', trend: 'up' },
    { metric: 'Revenue per User', value: '+28%', trend: 'up' },
    { metric: 'Conversion Rate', value: '+42%', trend: 'up' },
    { metric: 'Cost per Acquisition', value: '-18%', trend: 'down' }
  ]
});

const getMockCampaignsData = () => ({
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

const getMockABTestsData = () => [
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
];

const getMockModelsData = () => ({
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