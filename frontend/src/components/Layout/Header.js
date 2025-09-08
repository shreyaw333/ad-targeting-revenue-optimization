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
    <header style={{
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      height: '64px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        padding: '0 2rem',
        maxWidth: '100%'
      }}>
        {/* Left Section - Logo */}
        <div style={{ flex: '0 0 auto', minWidth: '200px' }}>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#2d3748',
            margin: 0
          }}>
            ML Ad Targeting Engine
          </h1>
          <p style={{
            fontSize: '0.75rem',
            color: '#718096',
            margin: 0
          }}>
            Real-time Revenue Optimization
          </p>
        </div>

        {/* Center Section - Search */}
        <div style={{
          flex: 1,
          maxWidth: '400px',
          margin: '0 2rem',
          position: 'relative'
        }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#a0aec0',
              zIndex: 1
            }} size={16} />
            <input
              type="text"
              placeholder="Search campaigns, tests, or metrics..."
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.5rem',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '0.875rem',
                background: '#f7fafc',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3182ce';
                e.target.style.background = 'white';
                e.target.style.boxShadow = '0 0 0 3px rgba(49, 130, 206, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.background = '#f7fafc';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Right Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          flex: '0 0 auto'
        }}>
          {/* Status Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: '#f7fafc',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            whiteSpace: 'nowrap'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              flexShrink: 0,
              background: settings.realTimeData ? '#38a169' : '#e53e3e',
              boxShadow: settings.realTimeData 
                ? '0 0 0 2px rgba(56, 161, 105, 0.2)' 
                : '0 0 0 2px rgba(229, 62, 62, 0.2)'
            }}></div>
            <span style={{
              fontSize: '0.875rem',
              color: '#4a5568',
              fontWeight: 500
            }}>
              {settings.realTimeData ? 'Live Data' : 'Offline'}
            </span>
            <button
              onClick={toggleRealTimeData}
              style={{
                padding: '0.25rem 0.75rem',
                fontSize: '0.75rem',
                background: '#e2e8f0',
                color: '#4a5568',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#cbd5e0'}
              onMouseOut={(e) => e.target.style.background = '#e2e8f0'}
            >
              {settings.realTimeData ? 'Pause' : 'Resume'}
            </button>
          </div>

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                padding: '0.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#4a5568',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f7fafc';
                e.target.style.color = '#2d3748';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'none';
                e.target.style.color = '#4a5568';
              }}
            >
              <Bell size={20} />
              <span style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: '#e53e3e',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'translate(25%, -25%)'
              }}>
                3
              </span>
            </button>
            
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                minWidth: '320px'
              }}>
                <div style={{
                  padding: '1rem',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <h4 style={{
                    margin: 0,
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#2d3748'
                  }}>
                    Notifications
                  </h4>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <div style={{
                    padding: '1rem',
                    borderBottom: '1px solid #f7fafc'
                  }}>
                    <p style={{
                      fontWeight: 600,
                      color: '#2d3748',
                      margin: '0 0 0.25rem 0'
                    }}>
                      CTR Model Updated
                    </p>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#718096',
                      margin: '0 0 0.25rem 0'
                    }}>
                      New model deployed with 2.3% improvement
                    </p>
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#a0aec0'
                    }}>
                      5 min ago
                    </span>
                  </div>
                  <div style={{
                    padding: '1rem',
                    borderBottom: '1px solid #f7fafc'
                  }}>
                    <p style={{
                      fontWeight: 600,
                      color: '#2d3748',
                      margin: '0 0 0.25rem 0'
                    }}>
                      A/B Test Completed
                    </p>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#718096',
                      margin: '0 0 0.25rem 0'
                    }}>
                      Collaborative Filtering test shows significant results
                    </p>
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#a0aec0'
                    }}>
                      1 hour ago
                    </span>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <p style={{
                      fontWeight: 600,
                      color: '#2d3748',
                      margin: '0 0 0.25rem 0'
                    }}>
                      Revenue Alert
                    </p>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#718096',
                      margin: '0 0 0.25rem 0'
                    }}>
                      Daily revenue target exceeded by 15%
                    </p>
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#a0aec0'
                    }}>
                      3 hours ago
                    </span>
                  </div>
                </div>
                <div style={{
                  padding: '1rem',
                  borderTop: '1px solid #e2e8f0',
                  textAlign: 'center'
                }}>
                  <button style={{
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    background: '#e2e8f0',
                    color: '#4a5568',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}>
                    View All
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'none',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#4a5568',
                transition: 'all 0.2s',
                fontWeight: 500,
                whiteSpace: 'nowrap'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f7fafc';
                e.target.style.color = '#2d3748';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'none';
                e.target.style.color = '#4a5568';
              }}
            >
              <User size={20} />
              <span>Admin</span>
            </button>
            
            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                minWidth: '240px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: '#e2e8f0',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4a5568'
                  }}>
                    <User size={24} />
                  </div>
                  <div>
                    <p style={{
                      fontWeight: 600,
                      color: '#2d3748',
                      margin: 0
                    }}>
                      Admin User
                    </p>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#718096',
                      margin: 0
                    }}>
                      admin@company.com
                    </p>
                  </div>
                </div>
                <div style={{ padding: '0.5rem' }}>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.75rem',
                    background: 'none',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    color: '#4a5568',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#f7fafc';
                    e.target.style.color = '#2d3748';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'none';
                    e.target.style.color = '#4a5568';
                  }}>
                    <Settings size={16} />
                    Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      width: '100%',
                      padding: '0.75rem',
                      background: 'none',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      color: '#4a5568',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#f7fafc';
                      e.target.style.color = '#2d3748';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'none';
                      e.target.style.color = '#4a5568';
                    }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;