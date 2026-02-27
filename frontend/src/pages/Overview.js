import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';
import KPICard from '../components/Dashboard/KPICard';
import RevenueChart from '../components/Charts/RevenueChart';
import AudienceChart from '../components/Charts/AudienceChart';
import PerformanceMetrics from '../components/Dashboard/PerformanceMetrics';
import RecentActivity from '../components/Dashboard/RecentActivity';
import { DollarSign, Users, MousePointer, Eye, TrendingUp, AlertTriangle } from 'lucide-react';

const Overview = () => {
  const { overview, loadOverviewData, loading, error } = useData();

  useEffect(() => { loadOverviewData() }, [loadOverviewData]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <AlertTriangle className="error-icon" />
        <h3>Error Loading Dashboard</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadOverviewData}>
          Retry
        </button>
      </div>
    );
  }

  const { kpis, revenueData, audienceData, performanceData } = overview;

  return (
    <div style={{ padding: 0 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1a202c', margin: '0 0 0.5rem 0' }}>
            Dashboard Overview
          </h1>
          <p style={{ color: '#718096', margin: 0 }}>
            Monitor your ML-powered ad targeting performance
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary">Export Report</button>
          <button className="btn btn-primary">Create Campaign</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        <KPICard
          title="Total Revenue"
          value={`$${(kpis.totalRevenue?.value || 0).toLocaleString()}`}
          change={`+${kpis.totalRevenue?.change || 0}%`}
          icon={DollarSign}
          trend="up"
          description="Monthly revenue from ad campaigns"
        />
        <KPICard
          title="Active Users"
          value={`${(kpis.activeUsers?.value || 0).toLocaleString()}`}
          change={`+${kpis.activeUsers?.change || 0}%`}
          icon={Users}
          trend="up"
          description="Users engaging with ads"
        />
        <KPICard
          title="Average CTR"
          value={`${kpis.averageCTR?.value || 0}%`}
          change={`+${kpis.averageCTR?.change || 0}%`}
          icon={MousePointer}
          trend="up"
          description="Click-through rate across campaigns"
        />
        <KPICard
          title="Impressions"
          value={`${((kpis.impressions?.value || 0) / 1000000).toFixed(1)}M`}
          change={`+${kpis.impressions?.change || 0}%`}
          icon={Eye}
          trend="up"
          description="Total ad impressions served"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Revenue & Performance Trends</h3>
            <select className="form-select" style={{ width: 'auto' }}>
              <option value="6m">Last 6 Months</option>
              <option value="3m">Last 3 Months</option>
              <option value="1m">Last Month</option>
            </select>
          </div>
          <RevenueChart data={revenueData} />
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Audience Segmentation</h3>
            <span className="text-sm text-gray-600">ML-based user clustering</span>
          </div>
          <AudienceChart data={audienceData} />
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">ML Model Performance</h3>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="status-badge status-active" style={{ fontSize: '0.75rem' }}>
              All models active
            </div>
          </div>
        </div>
        <PerformanceMetrics data={performanceData} />
      </div>

      {/* Recent Activity & Insights */}
      <div className="grid grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
              View All
            </button>
          </div>
          <RecentActivity />
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">AI Insights</h3>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUp size={16} className="text-green-600" style={{ marginRight: '0.25rem' }} />
              <span className="text-sm text-green-600">3 optimization opportunities</span>
            </div>
          </div>
          
          <div>
            {/* Insight 1 */}
            <div style={{ display: 'flex', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', background: '#ebf8ff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3182ce', marginRight: '1rem' }}>
                <TrendingUp size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 600, color: '#2d3748', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
                  CTR Optimization
                </h4>
                <p style={{ color: '#4a5568', margin: '0 0 0.5rem 0', fontSize: '0.875rem', lineHeight: 1.4 }}>
                  Tech Enthusiasts segment shows 23% higher engagement. Consider increasing budget allocation.
                </p>
                <span style={{ display: 'inline-block', background: '#c6f6d5', color: '#22543d', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                  Potential +$12K revenue
                </span>
              </div>
            </div>

            {/* Insight 2 */}
            <div style={{ display: 'flex', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', background: '#ebf8ff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3182ce', marginRight: '1rem' }}>
                <Users size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 600, color: '#2d3748', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
                  Audience Expansion
                </h4>
                <p style={{ color: '#4a5568', margin: '0 0 0.5rem 0', fontSize: '0.875rem', lineHeight: 1.4 }}>
                  Similar audience to Fashion Lovers identified. Recommended for new campaign targeting.
                </p>
                <span style={{ display: 'inline-block', background: '#c6f6d5', color: '#22543d', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                  Potential +15% reach
                </span>
              </div>
            </div>

            {/* Insight 3 */}
            <div style={{ display: 'flex', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
              <div style={{ width: '40px', height: '40px', background: '#ebf8ff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3182ce', marginRight: '1rem' }}>
                <DollarSign size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 600, color: '#2d3748', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
                  Budget Reallocation
                </h4>
                <p style={{ color: '#4a5568', margin: '0 0 0.5rem 0', fontSize: '0.875rem', lineHeight: 1.4 }}>
                  Campaign A is underperforming. Consider shifting 20% budget to Campaign C.
                </p>
                <span style={{ display: 'inline-block', background: '#c6f6d5', color: '#22543d', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                  Potential +8% ROI
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;