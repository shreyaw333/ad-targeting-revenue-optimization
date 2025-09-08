import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const PerformanceMetrics = ({ data = [] }) => {
  return (
    <div className="performance-metrics">
      <div className="metrics-grid">
        {data.map((item, index) => {
          const isPositive = item.trend === 'up' || (item.trend === 'down' && item.metric.includes('Cost'));
          
          return (
            <div key={index} className="metric-card">
              <div className="metric-header">
                <span className="metric-name">{item.metric}</span>
                <div className={`trend-indicator ${isPositive ? 'positive' : 'negative'}`}>
                  {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </div>
              </div>
              <div className="metric-value">{item.value}</div>
              <div className="metric-description">
                {item.metric === 'CTR Improvement' && 'ML-powered targeting optimization'}
                {item.metric === 'Revenue per User' && 'Personalized ad delivery'}
                {item.metric === 'Conversion Rate' && 'Enhanced user experience'}
                {item.metric === 'Cost per Acquisition' && 'Efficient budget allocation'}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .performance-metrics {
          width: 100%;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .metric-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.2s;
        }

        .metric-card:hover {
          border-color: #cbd5e0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .metric-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #4a5568;
        }

        .trend-indicator {
          padding: 0.25rem;
          border-radius: 4px;
        }

        .trend-indicator.positive {
          background: #c6f6d5;
          color: #22543d;
        }

        .trend-indicator.negative {
          background: #fed7d7;
          color: #742a2a;
        }

        .metric-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .metric-description {
          font-size: 0.75rem;
          color: #718096;
          line-height: 1.3;
        }

        @media (max-width: 768px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .metric-card {
            padding: 1rem;
          }
          
          .metric-value {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PerformanceMetrics;