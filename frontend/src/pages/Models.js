import React from 'react';

const Models = () => {
  return (
    <div className="models-page">
      <div className="page-header">
        <h1 className="page-title">ML Models</h1>
        <p className="page-subtitle">Monitor and manage machine learning models</p>
      </div>
      
      <div className="coming-soon">
        <h2>ML Models Dashboard</h2>
        <p>Model management features coming soon...</p>
      </div>

      <style jsx>{`
        .models-page {
          padding: 0;
        }

        .page-header {
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

        .coming-soon {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .coming-soon h2 {
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .coming-soon p {
          color: #718096;
        }
      `}</style>
    </div>
  );
};

export default Models;