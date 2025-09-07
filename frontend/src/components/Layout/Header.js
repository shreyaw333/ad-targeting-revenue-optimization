import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Settings, Bell, User, LogOut, Search } from 'lucide-react';

const Header = () => {
  const { settings, updateSettings } = useData();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleRealTimeData = () => {
    updateSettings({ realTimeData: !settings.realTimeData });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <h1>ML Ad Targeting Engine</h1>
            <p>Real-time Revenue Optimization</p>
          </div>
        </div>

        <div className="header-center">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search campaigns, tests, or metrics..."
              className="search-input"
            />
          </div>
        </div>

        <div className="header-right">
          <div className="status-indicator">
            <div className={`status-dot ${settings.realTimeData ? 'active' : 'inactive'}`}></div>
            <span className="status-text">
              {settings.realTimeData ? 'Live Data' : 'Offline'}
            </span>
            <button
              onClick={toggleRealTimeData}
              className="btn btn-secondary btn-sm"
            >
              {settings.realTimeData ? 'Pause' : 'Resume'}
            </button>
          </div>

          <div className="header-actions">
            <div className="notification-container">
              <button
                className="icon-button"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />
                <span className="notification-badge">3</span>
              </button>
              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h4>Notifications</h4>
                  </div>
                  <div className="notification-list">
                    <div className="notification-item">
                      <div className="notification-content">
                        <p className="notification-title">CTR Model Updated</p>
                        <p className="notification-desc">New model deployed with 2.3% improvement</p>
                        <span className="notification-time">5 min ago</span>
                      </div>
                    </div>
                    <div className="notification-item">
                      <div className="notification-content">
                        <p className="notification-title">A/B Test Completed</p>
                        <p className="notification-desc">Collaborative Filtering test shows significant results</p>
                        <span className="notification-time">1 hour ago</span>
                      </div>
                    </div>
                    <div className="notification-item">
                      <div className="notification-content">
                        <p className="notification-title">Revenue Alert</p>
                        <p className="notification-desc">Daily revenue target exceeded by 15%</p>
                        <span className="notification-time">3 hours ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="notification-footer">
                    <button className="btn btn-secondary btn-sm">View All</button>
                  </div>
                </div>
              )}
            </div>

            <div className="user-menu-container">
              <button
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <User size={20} />
                <span>Admin</span>
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <div className="user-avatar">
                      <User size={24} />
                    </div>
                    <div className="user-details">
                      <p className="user-name">Admin User</p>
                      <p className="user-email">admin@company.com</p>
                    </div>
                  </div>
                  <div className="user-menu-items">
                    <button className="user-menu-item">
                      <Settings size={16} />
                      Settings
                    </button>
                    <button className="user-menu-item" onClick={handleLogout}>
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 64px;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          padding: 0 2rem;
          max-width: 100%;
        }

        .header-left {
          flex: 0 0 auto;
        }

        .logo h1 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2d3748;
          margin: 0;
        }

        .logo p {
          font-size: 0.75rem;
          color: #718096;
          margin: 0;
        }

        .header-center {
          flex: 1;
          max-width: 400px;
          margin: 0 2rem;
        }

        .search-container {
          position: relative;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          padding: 0.5rem 0.75rem 0.5rem 2.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.875rem;
          background: #f7fafc;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #3182ce;
          background: white;
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f7fafc;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .status-dot.active {
          background: #38a169;
          box-shadow: 0 0 0 2px rgba(56, 161, 105, 0.2);
        }

        .status-dot.inactive {
          background: #e53e3e;
          box-shadow: 0 0 0 2px rgba(229, 62, 62, 0.2);
        }

        .status-text {
          font-size: 0.875rem;
          color: #4a5568;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .notification-container,
        .user-menu-container {
          position: relative;
        }

        .icon-button {
          position: relative;
          background: none;
          border: none;
          padding: 0.5rem;
          border-radius: 6px;
          cursor: pointer;
          color: #4a5568;
          transition: all 0.2s;
        }

        .icon-button:hover {
          background: #f7fafc;
          color: #2d3748;
        }

        .notification-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: #e53e3e;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translate(25%, -25%);
        }

        .user-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          color: #4a5568;
          transition: all 0.2s;
          font-weight: 500;
        }

        .user-button:hover {
          background: #f7fafc;
          color: #2d3748;
        }

        .notification-dropdown,
        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          min-width: 320px;
        }

        .user-dropdown {
          min-width: 240px;
        }

        .notification-header {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .notification-header h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #2d3748;
        }

        .notification-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .notification-item {
          padding: 1rem;
          border-bottom: 1px solid #f7fafc;
          transition: background 0.2s;
        }

        .notification-item:hover {
          background: #f7fafc;
        }

        .notification-item:last-child {
          border-bottom: none;
        }

        .notification-title {
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 0.25rem 0;
        }

        .notification-desc {
          font-size: 0.875rem;
          color: #718096;
          margin: 0 0 0.25rem 0;
        }

        .notification-time {
          font-size: 0.75rem;
          color: #a0aec0;
        }

        .notification-footer {
          padding: 1rem;
          border-top: 1px solid #e2e8f0;
          text-align: center;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: #e2e8f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4a5568;
        }

        .user-name {
          font-weight: 600;
          color: #2d3748;
          margin: 0;
        }

        .user-email {
          font-size: 0.875rem;
          color: #718096;
          margin: 0;
        }

        .user-menu-items {
          padding: 0.5rem;
        }

        .user-menu-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem;
          background: none;
          border: none;
          border-radius: 4px;
          font-size: 0.875rem;
          color: #4a5568;
          cursor: pointer;
          transition: all 0.2s;
        }

        .user-menu-item:hover {
          background: #f7fafc;
          color: #2d3748;
        }

        .btn-sm {
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
        }

        @media (max-width: 768px) {
          .header-content {
            padding: 0 1rem;
          }

          .header-center {
            display: none;
          }

          .status-indicator {
            display: none;
          }

          .logo h1 {
            font-size: 1rem;
          }

          .logo p {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;