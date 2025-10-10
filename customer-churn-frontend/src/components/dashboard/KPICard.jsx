// src/components/dashboard/KPICard.jsx
import React from 'react';
import './KPICard.css';

const KPICard = ({ title, value, icon }) => {
  return (
    <div className="kpi-card">
      <div className="kpi-icon">{icon}</div>
      <div className="kpi-content">
        <p className="kpi-title">{title}</p>
        <h3 className="kpi-value">{value}</h3>
      </div>
    </div>
  );
};

export default KPICard;