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

  // Load data from API on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Simulate real-time data updates
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

  const loadData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Load all data in parallel
      const [overviewData, campaignsData, abTestsData, modelsData] = await Promise.all([
        apiService.getOverviewData(),
        apiService.getCampaignsData(),
        apiService.getABTests(),
        apiService.getModelsData()
      ]);

      dispatch({ type: 'SET_OVERVIEW_DATA', payload: overviewData });
      dispatch({ type: 'SET_CAMPAIGNS_DATA', payload: campaignsData });
      dispatch({ type: 'SET_AB_TESTS', payload: abTestsData });
      dispatch({ type: 'SET_MODELS_DATA', payload: modelsData });
    } catch (error) {
      console.error('Error loading data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data from backend' });
    }
  };

  const loadOverviewData = async () => {
    try {
      const data = await apiService.getOverviewData();
      dispatch({ type: 'SET_OVERVIEW_DATA', payload: data });
    } catch (error) {
      console.error('Error loading overview data:', error);
    }
  };

  const loadCampaignsData = async () => {
    try {
      const data = await apiService.getCampaignsData();
      dispatch({ type: 'SET_CAMPAIGNS_DATA', payload: data });
    } catch (error) {
      console.error('Error loading campaigns data:', error);
    }
  };

  const loadABTestsData = async () => {
    try {
      const data = await apiService.getABTests();
      dispatch({ type: 'SET_AB_TESTS', payload: data });
    } catch (error) {
      console.error('Error loading AB tests data:', error);
    }
  };

  const loadModelsData = async () => {
    try {
      const data = await apiService.getModelsData();
      dispatch({ type: 'SET_MODELS_DATA', payload: data });
    } catch (error) {
      console.error('Error loading models data:', error);
    }
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