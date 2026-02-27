import React from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar
} from 'recharts';

const RevenueChart = ({ data = [] }) => {
  const formatTooltipValue = (value, name) => {
    if (name === 'revenue') {
      return [`$${value.toLocaleString()}`, 'Revenue'];
    }
    if (name === 'ctr') {
      return [`${value}%`, 'CTR'];
    }
    if (name === 'rpu') {
      return [`$${value}`, 'Revenue per User'];
    }
    return [value, name];
  };

  const formatYAxisTick = (value, index, type) => {
    if (type === 'revenue') {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    if (type === 'percentage') {
      return `${value}%`;
    }
    return value;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`Month: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              {formatTooltipValue(entry.value, entry.dataKey)[1]}: {formatTooltipValue(entry.value, entry.dataKey)[0]}
            </p>
          ))}
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
            <span className="legend-text">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="revenue-chart-container">
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          
          <XAxis 
            dataKey="name" 
            stroke="#718096"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          
          <YAxis 
            yAxisId="left"
            stroke="#718096"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatYAxisTick(value, null, 'revenue')}
          />
          
          <YAxis 
            yAxisId="right" 
            orientation="right"
            stroke="#718096"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatYAxisTick(value, null, 'percentage')}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          
          <Bar 
            yAxisId="left"
            dataKey="revenue" 
            fill="url(#revenueGradient)"
            radius={[4, 4, 0, 0]}
            name="Revenue"
          />
          
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="ctr" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
            name="CTR (%)"
          />
          
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="rpu" 
            stroke="#f59e0b" 
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#f59e0b", strokeWidth: 2 }}
            name="Revenue per User ($)"
          />
        </ComposedChart>
      </ResponsiveContainer>

      <style jsx>{`
        .revenue-chart-container {
          width: 100%;
          height: 350px;
          position: relative;
        }

        .custom-tooltip {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          min-width: 150px;
        }

        .tooltip-label {
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 8px 0;
          font-size: 0.875rem;
        }

        .tooltip-item {
          margin: 4px 0;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .custom-legend {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        .legend-text {
          font-size: 0.875rem;
          color: #4a5568;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .custom-legend {
            gap: 1rem;
          }
          
          .legend-text {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default RevenueChart;