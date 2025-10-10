// src/components/performance/ConfusionMatrix.jsx
import React from 'react';
import './ConfusionMatrix.css';

const ConfusionMatrix = ({ data }) => {
  return (
    <div className="matrix-container">
      <h4>Confusion Matrix</h4>
      <div className="matrix-grid">
        <div className="matrix-cell label-y">Predicted</div>
        <div className="matrix-cell label-x">Actual Positive</div>
        <div className="matrix-cell label-x">Actual Negative</div>
        
        <div className="matrix-cell label-y">Predicted Positive</div>
        <div className="matrix-cell green">
          <span className="value">{data.truePositive}</span>
          <span className="label">True Positive</span>
        </div>
        <div className="matrix-cell red">
          <span className="value">{data.falsePositive}</span>
          <span className="label">False Positive</span>
        </div>
        
        <div className="matrix-cell label-y">Predicted Negative</div>
        <div className="matrix-cell orange">
          <span className="value">{data.falseNegative}</span>
          <span className="label">False Negative</span>
        </div>
        <div className="matrix-cell green">
          <span className="value">{data.trueNegative}</span>
          <span className="label">True Negative</span>
        </div>
      </div>
    </div>
  );
};

export default ConfusionMatrix;