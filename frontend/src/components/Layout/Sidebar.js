import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Target,
  TrendingUp,
  FlaskConical,
  Brain,
  Settings,
  Users,
  DollarSign,
  Activity
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/overview',
      name: 'Overview',
      icon: BarChart3,
      description: 'Dashboard & KPIs'
    },
    {
      path: '/campaigns',
      name: 'Campaigns',
      icon: Target,
      description: 'Ad Campaign Management'
    },
    {
      path: '/analytics',
      name: 'Analytics',
      icon: TrendingUp,
      description: 'Performance Insights'
    },
    {
      path: '/ab-testing',
      name: 'A/B Testing',
      icon: FlaskConical,
      description: 'Experiment Management'
    },
    {
      path: '/models',
      name: 'ML Models',
      icon: Brain,
      description: 'Model Performance'
    },
    {
      path: '/settings',
      name: 'Settings',
      icon: Settings,
      description: 'System Configuration'
    }
  ];

  const quickStats = [
    {
      label: 'Active Campaigns',
      value: '12',
      icon: Target,
      color: 'blue'
    },
    {
      label: 'Running Tests',
      value: '3',
      icon: FlaskConical,
      color: 'green'
    },
    {
      label: 'Daily Revenue',
      value: '$45.2K',
      icon: DollarSign,
      color: 'yellow'
    },
    {
      label: 'System Health',
      value: '99.8%',
      icon: Activity,
      color: 'green'
    }
  ];

  const isActivePath = (path) => {
    return location.pathname === path || (path === '/overview' && location.pathname === '/');
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">Main Navigation</h3>
          <ul className="nav-list">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <li key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <div className="nav-link-content">
                      <Icon size={20} className="nav-icon" />
                      <div className="nav-text">
                        <span className="nav-name">{item.name}</span>
                        <span className="nav-description">{item.description}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">Quick Stats</h3>
          <div className="quick-stats">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="quick-stat-item">
                  <div className={`quick-stat-icon ${stat.color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="quick-stat-content">
                    <span className="quick-stat-value">{stat.value}</span>
                    <span className="quick-stat-label">{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">System Status</h3>
          <div className="system-status">
            <div className="status-item">
              <div className="status-indicator active"></div>
              <span className="status-text">ML Pipeline</span>
            </div>
            <div className="status-item">
              <div className="status-indicator active"></div>
              <span className="status-text">Data Stream</span>
            </div>
            <div className="status-item">
              <div className="status-indicator warning"></div>
              <span className="status-text">Model Training</span>
            </div>
            <div className="status-item">
              <div className="status-indicator active"></div>
              <span className="status-text">API Services</span>
            </div>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .sidebar {
          position: fixed;
          top: 64px;
          left: 0;
          width: 250px;
          height: calc(100vh - 64px);
          background: white;
          border-right: 1px solid #e2e8f0;
          overflow-y: auto;
          z-index: 900;
        }

        .sidebar-nav {
          padding: 1.5rem 0;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .nav-section {
          margin-bottom: 2rem;
          padding: 0 1rem;
        }

        .nav-section:last-child {
          margin-top: auto;
          margin-bottom: 1rem;
        }

        .nav-section-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: #a0aec0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 1rem 1rem;
        }

        .nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-item {
          margin-bottom: 0.25rem;
        }

        .nav-link {
          display: block;
          text-decoration: none;
          color: #4a5568;
          border-radius: 6px;
          transition: all 0.2s;
          position: relative;
        }

        .nav-link:hover {
          background: #f7fafc;
          color: #2d3748;
        }

        .nav-link.active {
          background: #ebf8ff;
          color: #3182ce;
        }

        .nav-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: #3182ce;
          border-radius: 0 2px 2px 0;
        }

        .nav-link-content {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
        }

        .nav-icon {
          flex-shrink: 0;
          margin-right: 0.75rem;
        }

        .nav-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .nav-name {
          font-weight: 500;
          font-size: 0.875rem;
          line-height: 1.25;
        }

        .nav-description {
          font-size: 0.75rem;
          color: #718096;
          line-height: 1.25;
        }

        .nav-link.active .nav-description {
          color: #4299e1;
        }

        .quick-stats {
          space-y: 0.75rem;
        }

        .quick-stat-item {
          display: flex;
          align-items: center;
          padding: 0.75rem;
          background: #f7fafc;
          border-radius: 6px;
          margin-bottom: 0.5rem;
        }

        .quick-stat-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.75rem;
          flex-shrink: 0;
        }

        .quick-stat-icon.blue {
          background: #dbeafe;
          color: #3b82f6;
        }

        .quick-stat-icon.green {
          background: #d1fae5;
          color: #10b981;
        }

        .quick-stat-icon.yellow {
          background: #fef3c7;
          color: #f59e0b;
        }

        .quick-stat-content {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .quick-stat-value {
          font-weight: 600;
          font-size: 0.875rem;
          color: #2d3748;
          line-height: 1.25;
        }

        .quick-stat-label {
          font-size: 0.75rem;
          color: #718096;
          line-height: 1.25;
        }

        .system-status {
          space-y: 0.5rem;
        }

        .status-item {
          display: flex;
          align-items: center;
          padding: 0.5rem 0.75rem;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 0.75rem;
          flex-shrink: 0;
        }

        .status-indicator.active {
          background: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }

        .status-indicator.warning {
          background: #f59e0b;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
        }

        .status-indicator.error {
          background: #ef4444;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
        }

        .status-text {
          font-size: 0.75rem;
          color: #4a5568;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .sidebar.open {
            transform: translateX(0);
          }
        }

        /* Custom scrollbar */
        .sidebar::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;