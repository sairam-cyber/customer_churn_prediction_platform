// src/components/common/ErrorDisplay.jsx
import React from 'react';
import './ErrorDisplay.css';

const ErrorDisplay = ({ message }) => (
  <div className="error-display">
    <h4>Oops! Something went wrong.</h4>
    <p>{message || "Could not fetch data. Please try again later."}</p>
  </div>
);

export default ErrorDisplay;