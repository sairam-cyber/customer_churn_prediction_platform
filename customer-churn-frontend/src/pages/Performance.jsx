// src/pages/Performance.jsx
import React, { useState, useEffect } from 'react';
import { getPerformanceData } from '../services/api';
import Loader from '../components/common/Loader';
import ErrorDisplay from '../components/common/ErrorDisplay';
import ConfusionMatrix from '../components/performance/ConfusionMatrix';
import './Performance.css';

const Performance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPerformanceData();
        
        // The actual data is in response.data
        if (response && response.data) {
          setData(response.data);
        } else {
          throw new Error("Invalid data format received from server.");
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch model performance data.');
        console.error("Performance fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorDisplay message={error} />;
  
  // Add a check for data existence before rendering
  if (!data || !data.metrics || !data.confusionMatrix) {
    return <ErrorDisplay message="Performance data is missing or incomplete." />;
  }

  return (
    <div>
      <h1>Model Performance</h1>
      <div className="performance-grid">
        <div className="metrics-card">
          <h4>Key Metrics</h4>
          <ul>
            {Object.entries(data.metrics).map(([key, value]) => (
              <li key={key}>
                <span>{key.replace(/_/g, ' ').toUpperCase()}</span>
                <strong>{Number(value).toFixed(4)}</strong>
              </li>
            ))}
          </ul>
        </div>
        <div className="matrix-area">
          <ConfusionMatrix data={data.confusionMatrix} />
        </div>
      </div>
    </div>
  );
};

export default Performance;