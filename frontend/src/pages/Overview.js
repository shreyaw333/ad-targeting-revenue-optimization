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

  useEffect(() => {
    loadOverviewData();
  }, []);

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
    <div className="overview-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Monitor your ML-powered ad targeting performance</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary">
            Export Report
          </button>
          <button className="btn btn-primary">
            Create Campaign
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-section">
        <div className="grid grid-cols-4">
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
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="grid grid-cols-2">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Revenue & Performance Trends</h3>
              <div className="chart-controls">
                <select className="form-select">
                  <option value="6m">Last 6 Months</option>
                  <option value="3m">Last 3 Months</option>
                  <option value="1m">Last Month</option>
                </select>
              </div>
            </div>
            <RevenueChart data={revenueData} />
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Audience Segmentation</h3>
              <div className="chart-info">
                <span className="text-sm text-gray-600">ML-based user clustering</span>
              </div>
            </div>
            <AudienceChart data={audienceData} />
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="performance-section">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">ML Model Performance</h3>
            <div className="flex items-center">
              <div className="status-indicator active"></div>
              <span className="text-sm text-gray-600 ml-2">All models active</span>
            </div>
          </div>
          <PerformanceMetrics data={performanceData} />
        </div>
      </div>

      {/* Recent Activity & Insights */}
      <div className="activity-section">
        <div className="grid grid-cols-2">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
              <button className="btn btn-secondary btn-sm">View All</button>
            </div>
            <RecentActivity />
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">AI Insights</h3>
              <div className="flex items-center">
                <TrendingUp size={16} className="text-green-600 mr-1" />
                <span className="text-sm text-green-600">3 optimization opportunities</span>
              </div>
            </div>
            <div className="insights-list">
              <div className="insight-item">
                <div className="insight-icon">
                  <TrendingUp size={16} />
                </div>
                <div className="insight-content">
                  <h4 className="insight-title">CTR Optimization</h4>
                  <p className="insight-description">
                    Tech Enthusiasts segment shows 23% higher engagement. Consider increasing budget allocation.
                  </p>
                  <span className="insight-impact">Potential +$12K revenue</span>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-icon">
                  <Users size={16} />
                </div>
                <div className="insight-content">
                  <h4 className="insight-title">Audience Expansion</h4>
                  <p className="insight-description">
                    Similar audience to Fashion Lovers identified. Recommended for new campaign targeting.
                  </p>
                  <span className="insight-impact">Potential +15% reach</span>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-icon">
                  <DollarSign size={16} />
                </div>
                <div className="insight-content">
                  <h4 className="insight-title">Budget Reallocation</h4>
                  <p className="insight-description">
                    Campaign A is underperforming. Consider shifting 20% budget to Campaign C.
                  </p>
                  <span className="insight-impact">Potential +8% ROI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .overview-page {
          padding: 0;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 0.5rem 0;
        }

        .page-subtitle {
          color: #718096;
          margin: 0;
        }

        .page-actions {
          display: flex;
          gap: 1rem;
        }

        .kpi-section,
        .charts-section,
        .performance-section,
        .activity-section {
          margin-bottom: 2rem;
        }

        .chart-controls {
          display: flex;
          gap: 0.5rem;
        }

        .chart-info {
          display: flex;
          align-items: center;
        }

        .insights-list {
          space-y: 1rem;
        }

        .insight-item {
          display: flex;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          margin-bottom: 1rem;
          transition: all 0.2s;
        }

        .insight-item:hover {
          border-color: #cbd5e0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .insight-icon {
          width: 40px;
          height: 40px;
          background: #ebf8ff;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3182ce;
          margin-right: 1rem;
          flex-shrink: 0;
        }

        .insight-content {
          flex: 1;
        }

        .insight-title {
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
        }

        .insight-description {
          color: #4a5568;
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .insight-impact {
          display: inline-block;
          background: #c6f6d5;
          color: #22543d;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          text-align: center;
        }

        .loading-container p {
          margin-top: 1rem;
          color: #718096;
        }

        .error-container h3 {
          margin: 1rem 0 0.5rem 0;
          color: #2d3748;
        }

        .error-container p {
          color: #718096;
          margin-bottom: 1.5rem;
        }

        .error-icon {
          color: #f56565;
          width: 48px;
          height: 48px;
        }

        @media (max-width: 1024px) {
          .page-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .page-actions {
            justify-content: flex-start;
          }
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 1.5rem;
          }

          .page-actions {
            flex-direction: column;
          }

          .insight-item {
            flex-direction: column;
            text-align: center;
          }

          .insight-icon {
            margin: 0 auto 1rem auto;
          }
        }
      `}</style>
    </div>
  );
};

export default Overview;