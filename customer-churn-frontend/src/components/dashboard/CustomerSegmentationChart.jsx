// src/components/dashboard/CustomerSegmentationChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042']; // Green (Low), Yellow (Medium), Red (High)

const CustomerSegmentationChart = ({ data }) => {
  return (
    // REMOVE inline style that forces white background
    <div style={{ padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow)', marginTop: '20px',
                 // Set a card background that matches the app's theme
                 background: 'linear-gradient(180deg, rgba(18, 26, 43, 0.65), rgba(18, 26, 43, 0.35))',
                 border: '1px solid var(--border-color)'
             }}>
      <h4 style={{ color: 'var(--text-light)', marginTop: 0 }}>Customer Segmentation by Risk</h4>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              // Use fixed COLORS array (and handle potential overflow safely)
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          {/* Use a dark-compatible content style for Tooltip and Legend */}
          <Tooltip 
             contentStyle={{ backgroundColor: 'var(--background-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-light)' }}
             labelStyle={{ color: 'var(--text-light)' }}
             itemStyle={{ color: 'var(--text-light)' }}
          />
          <Legend wrapperStyle={{ color: 'var(--text-light)' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerSegmentationChart;