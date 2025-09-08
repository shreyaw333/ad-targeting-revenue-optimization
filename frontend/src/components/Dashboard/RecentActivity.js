import React from 'react';
import { Clock, TrendingUp, Target, AlertCircle, CheckCircle } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'model_update',
      title: 'CTR Model Retrained',
      description: 'Collaborative filtering model updated with new data',
      timestamp: '5 minutes ago',
      icon: TrendingUp,
      status: 'success'
    },
    {
      id: 2,
      type: 'campaign',
      title: 'Summer Campaign Launched',
      description: 'New campaign targeting tech enthusiasts segment',
      timestamp: '12 minutes ago',
      icon: Target,
      status: 'active'
    },
    {
      id: 3,
      type: 'alert',
      title: 'High CTR Detected',
      description: 'Fashion segment showing 45% above average CTR',
      timestamp: '1 hour ago',
      icon: AlertCircle,
      status: 'warning'
    },
    {
      id: 4,
      type: 'optimization',
      title: 'Budget Optimization Complete',
      description: 'AI recommended budget reallocation applied',
      timestamp: '2 hours ago',
      icon: CheckCircle,
      status: 'success'
    },
    {
      id: 5,
      type: 'model_update',
      title: 'Revenue Model Training',
      description: 'Multi-objective optimization model in progress',
      timestamp: '3 hours ago',
      icon: TrendingUp,
      status: 'in_progress'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'green';
      case 'active': return 'blue';
      case 'warning': return 'yellow';
      case 'in_progress': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <div className="recent-activity">
      <div className="activity-list">
        {activities.map((activity) => {
          const Icon = activity.icon;
          const statusColor = getStatusColor(activity.status);
          
          return (
            <div key={activity.id} className="activity-item">
              <div className={`activity-icon ${statusColor}`}>
                <Icon size={16} />
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <h4 className="activity-title">{activity.title}</h4>
                  <span className="activity-time">
                    <Clock size={12} />
                    {activity.timestamp}
                  </span>
                </div>
                <p className="activity-description">{activity.description}</p>
                <div className={`activity-status ${statusColor}`}>
                  {activity.status === 'success' && 'Completed'}
                  {activity.status === 'active' && 'Active'}
                  {activity.status === 'warning' && 'Attention Required'}
                  {activity.status === 'in_progress' && 'In Progress'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .recent-activity {
          width: 100%;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .activity-item {
          display: flex;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          transition: all 0.2s;
          background: white;
        }

        .activity-item:hover {
          border-color: #cbd5e0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          flex-shrink: 0;
        }

        .activity-icon.green {
          background: #c6f6d5;
          color: #22543d;
        }

        .activity-icon.blue {
          background: #bee3f8;
          color: #2a4365;
        }

        .activity-icon.yellow {
          background: #faf089;
          color: #744210;
        }

        .activity-icon.purple {
          background: #e9d8fd;
          color: #553c9a;
        }

        .activity-icon.gray {
          background: #edf2f7;
          color: #4a5568;
        }

        .activity-content {
          flex: 1;
          min-width: 0;
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .activity-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #2d3748;
          margin: 0;
          line-height: 1.2;
        }

        .activity-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #a0aec0;
          flex-shrink: 0;
          margin-left: 1rem;
        }

        .activity-description {
          font-size: 0.875rem;
          color: #4a5568;
          margin: 0 0 0.75rem 0;
          line-height: 1.4;
        }

        .activity-status {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .activity-status.green {
          background: #c6f6d5;
          color: #22543d;
        }

        .activity-status.blue {
          background: #bee3f8;
          color: #2a4365;
        }

        .activity-status.yellow {
          background: #faf089;
          color: #744210;
        }

        .activity-status.purple {
          background: #e9d8fd;
          color: #553c9a;
        }

        .activity-status.gray {
          background: #edf2f7;
          color: #4a5568;
        }

        /* Custom scrollbar */
        .activity-list::-webkit-scrollbar {
          width: 4px;
        }

        .activity-list::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .activity-list::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }

        .activity-list::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        @media (max-width: 768px) {
          .activity-item {
            padding: 0.75rem;
          }

          .activity-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }

          .activity-time {
            margin-left: 0;
          }

          .activity-icon {
            width: 32px;
            height: 32px;
            margin-right: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default RecentActivity;