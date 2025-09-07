import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const KPICard = ({ title, value, change, icon: Icon, trend, description }) => {
  const isPositive = trend === 'up' || (trend === 'down' && title.includes('Cost'));
  const changeValue = parseFloat(change?.replace(/[+\-%]/g, '') || 0);

  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <div className="kpi-title-section">
          <h3 className="kpi-title">{title}</h3>
          {description && <p className="kpi-description">{description}</p>}
        </div>
        <div className="kpi-icon">
          <Icon size={24} />
        </div>
      </div>
      
      <div className="kpi-content">
        <div className="kpi-value">{value}</div>
        <div className={`kpi-change ${isPositive ? 'positive' : 'negative'}`}>
          <div className="change-indicator">
            {isPositive ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span className="change-text">{change}</span>
          </div>
          <span className="change-period">vs last month</span>
        </div>
      </div>

      <div className="kpi-progress">
        <div 
          className={`progress-bar ${isPositive ? 'positive' : 'negative'}`}
          style={{ width: `${Math.min(Math.abs(changeValue), 100)}%` }}
        ></div>
      </div>

      <style jsx>{`
        .kpi-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .kpi-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .kpi-title-section {
          flex: 1;
        }

        .kpi-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #4a5568;
          margin: 0 0 0.25rem 0;
          line-height: 1.2;
        }

        .kpi-description {
          font-size: 0.75rem;
          color: #718096;
          margin: 0;
          line-height: 1.3;
        }

        .kpi-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .kpi-content {
          margin-bottom: 1rem;
        }

        .kpi-value {
          font-size: 2rem;
          font-weight: 700;
          color: #1a202c;
          line-height: 1.1;
          margin-bottom: 0.5rem;
        }

        .kpi-change {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .change-indicator {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .kpi-change.positive {
          color: #38a169;
        }

        .kpi-change.negative {
          color: #e53e3e;
        }

        .change-text {
          font-weight: 600;
          font-size: 0.875rem;
        }

        .change-period {
          font-size: 0.75rem;
          color: #a0aec0;
        }

        .kpi-progress {
          height: 4px;
          background: #f7fafc;
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }

        .progress-bar {
          height: 100%;
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        .progress-bar.positive {
          background: linear-gradient(90deg, #68d391, #38a169);
        }

        .progress-bar.negative {
          background: linear-gradient(90deg, #fc8181, #e53e3e);
        }

        /* Animated background for special effects */
        .kpi-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s ease;
        }

        .kpi-card:hover::before {
          left: 100%;
        }

        @media (max-width: 768px) {
          .kpi-card {
            padding: 1rem;
          }

          .kpi-value {
            font-size: 1.5rem;
          }

          .kpi-icon {
            width: 40px;
            height: 40px;
          }

          .kpi-header {
            margin-bottom: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default KPICard;