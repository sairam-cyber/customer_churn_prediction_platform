// src/components/predictor/ShapChart.jsx
import React from 'react';
import Plot from 'react-plotly.js';

const ShapChart = ({ shapData }) => {
    const { baseValue, values, featureNames } = shapData;

    const data = [{
        type: 'waterfall',
        orientation: 'h',
        y: featureNames,
        x: values,
        base: baseValue,
        connector: {
          line: {
            // Light connector line for dark background
            color: 'var(--text-muted)' 
          }
        },
        // Customize colors for positive/negative SHAP values
        increasing: {
          marker: { color: 'var(--red)' } // Features increasing churn (positive shap value)
        },
        decreasing: {
          marker: { color: 'var(--green)' } // Features decreasing churn (negative shap value)
        }
    }];

    // Update Plotly layout for dark theme compatibility
    const layout = {
        title: {
            text: 'Feature Contributions (SHAP Values)',
            font: { color: 'var(--text-light)' } // Title text color
        },
        // Set chart background to match card background
        plot_bgcolor: 'transparent',
        paper_bgcolor: 'transparent', 
        font: { color: 'var(--text-light)' }, // General font color
        yaxis: {
            title: 'Features',
            color: 'var(--text-muted)',
            gridcolor: 'rgba(148, 163, 184, 0.1)', // Light grid lines
        },
        xaxis: {
            title: 'SHAP Value (Contribution to Churn Probability)',
            color: 'var(--text-muted)',
            gridcolor: 'rgba(148, 163, 184, 0.1)',
            zerolinecolor: 'var(--border-color)',
        },
        // IMPORTANT: Set modebar color for visible icons/buttons
        modebar: {
            bgcolor: 'var(--background-elevated)',
            color: 'var(--text-light)',
            activecolor: 'var(--accent-cyan)'
        },
        margin: { l: 200, r: 20, t: 50, b: 50 }, // Adjust margin to ensure long feature names fit
        autosize: true
    };

  return (
    <Plot
      data={data}
      layout={layout}
      // Set the containing div's style to allow Plotly to scale
      style={{ width: '100%', height: '400px' }} 
      config={{ responsive: true, displaylogo: false }}
    />
  );
};

export default ShapChart;