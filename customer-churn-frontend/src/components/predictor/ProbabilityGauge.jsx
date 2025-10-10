// src/components/predictor/ProbabilityGauge.jsx
import React from 'react';
import './ProbabilityGauge.css';

const ProbabilityGauge = ({ probability }) => {
  const percentage = Math.round(probability * 100);
  let riskColor;

  if (percentage <= 35) {
    riskColor = 'var(--green)';
  } else if (percentage <= 70) {
    riskColor = 'var(--yellow)';
  } else {
    riskColor = 'var(--red)';
  }

  const circumference = 2 * Math.PI * 45; // a circle with radius 45
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="gauge-container">
      <svg className="gauge" viewBox="0 0 100 100">
        <circle
          className="gauge-background"
          cx="50" cy="50" r="45"
        />
        <circle
          className="gauge-progress"
          cx="50" cy="50" r="45"
          stroke={riskColor}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="gauge-text">
        <span className="gauge-percentage">{percentage}%</span>
        <span className="gauge-label">Churn Risk</span>
      </div>
    </div>
  );
};

export default ProbabilityGauge;