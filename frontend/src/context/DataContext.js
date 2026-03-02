import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
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

  // FIX: wrap in useCallback so function reference is stable
  const loadOverviewData = useCallback(async () => {
    try {
      const data = await apiService.getOverviewData();
      dispatch({ type: 'SET_OVERVIEW_DATA', payload: data });
    } catch (error) {
      console.error('Error loading overview data:', error);
    }
  }, []);

  const loadCampaignsData = useCallback(async () => {
    try {
      const data = await apiService.getCampaignsData();
      dispatch({ type: 'SET_CAMPAIGNS_DATA', payload: data });
    } catch (error) {
      console.error('Error loading campaigns data:', error);
    }
  }, []);

  const loadABTestsData = useCallback(async () => {
    try {
      const data = await apiService.getABTests();
      dispatch({ type: 'SET_AB_TESTS', payload: data });
    } catch (error) {
      console.error('Error loading AB tests data:', error);
    }
  }, []);

  const loadModelsData = useCallback(async () => {
    try {
      const data = await apiService.getModelsData();
      dispatch({ type: 'SET_MODELS_DATA', payload: data });
    } catch (error) {
      console.error('Error loading models data:', error);
    }
  }, []);

  // Load all data once on mount
  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
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
    loadData();
  }, []);

  // FIX: removed the 30-second polling interval that caused constant re-renders

  const createCampaign = (campaignData) => {
    const newCampaign = {
      ...campaignData,
      id: Date.now(),
      status: 'active',
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      conversionRate: 0,
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
      confidence: 0,
      startDate: new Date().toISOString(),
      variants: [
        { name: 'Control', traffic: 50, conversions: 0, conversionRate: 0 },
        { name: 'Variant', traffic: 50, conversions: 0, conversionRate: 0 }
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