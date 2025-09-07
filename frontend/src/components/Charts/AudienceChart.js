import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const AudienceChart = ({ data = [] }) => {
  const RADIAN = Math.PI / 180;
  
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show labels for segments < 5%

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{data.name}</p>
          <p className="tooltip-value">
            <span className="tooltip-color" style={{ backgroundColor: data.color }}></span>
            {data.value}% of total audience
          </p>
          <p className="tooltip-count">
            ~{Math.round((data.value / 100) * 124000).toLocaleString()} users
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="custom-legend">
        {payload.map((entry, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <div className="legend-content">
              <span className="legend-name">{entry.payload.name}</span>
              <span className="legend-value">{entry.payload.value}%</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const COLORS = data.map(item => item.color || '#8884d8');

  return (
    <div className="audience-chart-container">
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Audience Insights */}
      <div className="audience-insights">
        <div className="insights-grid">
          {data.slice(0, 3).map((segment, index) => (
            <div key={index} className="insight-card">
              <div className="insight-header">
                <div 
                  className="insight-color-indicator"
                  style={{ backgroundColor: segment.color }}
                ></div>
                <span className="insight-name">{segment.name}</span>
              </div>
              <div className="insight-stats">
                <span className="insight-percentage">{segment.value}%</span>
                <span className="insight-users">
                  {Math.round((segment.value / 100) * 124000).toLocaleString()} users
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .audience-chart-container {
          width: 100%;
          position: relative;
        }

        .custom-tooltip {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          min-width: 180px;
        }

        .tooltip-label {
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 8px 0;
          font-size: 0.875rem;
        }

        .tooltip-value {
          margin: 4px 0;
          font-size: 0.875rem;
          font-weight: 500;
          color: #4a5568;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tooltip-color {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .tooltip-count {
          margin: 4px 0 0 0;
          font-size: 0.75rem;
          color: #718096;
          font-style: italic;
        }

        .custom-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-top: 1.5rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: white;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          min-width: 120px;
        }

        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .legend-content {
          display: flex;
          flex-direction: column;
        }

        .legend-name {
          font-size: 0.875rem;
          color: #2d3748;
          font-weight: 500;
          line-height: 1.2;
        }

        .legend-value {
          font-size: 0.75rem;
          color: #718096;
          font-weight: 600;
        }

        .audience-insights {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .insight-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          transition: all 0.2s;
        }

        .insight-card:hover {
          border-color: #cbd5e0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .insight-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .insight-color-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .insight-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #2d3748;
        }

        .insight-stats {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .insight-percentage {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          line-height: 1;
        }

        .insight-users {
          font-size: 0.75rem;
          color: #718096;
          font-weight: 500;
        }

        /* Animation for pie chart segments */
        .recharts-pie-sector {
          transition: all 0.3s ease;
        }

        .recharts-pie-sector:hover {
          filter: brightness(1.1);
          transform: scale(1.02);
          transform-origin: center;
        }

        @media (max-width: 768px) {
          .custom-legend {
            flex-direction: column;
            align-items: stretch;
          }

          .legend-item {
            justify-content: space-between;
            min-width: auto;
          }

          .insights-grid {
            grid-template-columns: 1fr;
          }

          .audience-chart-container {
            font-size: 0.875rem;
          }
        }

        @media (max-width: 480px) {
          .custom-tooltip {
            min-width: 150px;
            padding: 8px;
          }

          .insight-card {
            padding: 0.75rem;
          }

          .insight-percentage {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AudienceChart;