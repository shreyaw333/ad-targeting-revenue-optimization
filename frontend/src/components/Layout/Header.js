import React from 'react';
import { useData } from '../../context/DataContext';
import { Search } from 'lucide-react';

const Header = () => {
  const { settings, updateSettings } = useData();

  const toggleRealTimeData = () => {
    updateSettings({ realTimeData: !settings.realTimeData });
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

        {/* Right Section - Status Indicator */}
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
      </div>
    </header>
  );
};

export default Header;