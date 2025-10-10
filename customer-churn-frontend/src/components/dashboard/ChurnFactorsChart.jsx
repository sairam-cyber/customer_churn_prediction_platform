// src/components/dashboard/ChurnFactorsChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ChurnFactorsChart = ({ data }) => {
  return (
    // REMOVE inline style that forces white background
    <div style={{ padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow)', 
                 // Set a card background that matches the app's theme
                 background: 'linear-gradient(180deg, rgba(18, 26, 43, 0.65), rgba(18, 26, 43, 0.35))',
                 border: '1px solid var(--border-color)'
             }}>
      <h4 style={{ color: 'var(--text-light)', marginTop: 0 }}>Top Churn Factors</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {/* Change stroke for CartesianGrid for visibility */}
          <CartesianGrid stroke="rgba(148, 163, 184, 0.1)" strokeDasharray="3 3" />
          {/* Change colors for X and Y axis */}
          <XAxis dataKey="name" stroke="var(--text-muted)" />
          <YAxis stroke="var(--text-muted)" />
          {/* Use a dark-compatible content style for Tooltip */}
          <Tooltip 
             contentStyle={{ backgroundColor: 'var(--background-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-light)' }} 
             labelStyle={{ color: 'var(--text-light)' }}
          />
          <Legend />
          <Bar dataKey="value" fill="var(--secondary-color)" name="Feature Importance" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChurnFactorsChart;