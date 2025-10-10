// src/components/dashboard/HighRiskTable.jsx
import React from 'react';
import './HighRiskTable.css';

const HighRiskTable = ({ customers, onViewDetails }) => {
  if (!customers || customers.length === 0) {
    return (
      <div className="table-container">
        <p>No high-risk customer data available.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
        <h4>Top 5 Customers at Risk</h4>
        <table>
            <thead>
                <tr>
                    <th>Customer ID</th>
                    <th>Surname</th>
                    <th>Geography</th>
                    <th>Churn Probability</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {customers.map((customer) => (
                    <tr key={customer.CustomerId}>
                        <td>{customer.CustomerId}</td>
                        <td>{customer.Surname}</td>
                        <td>{customer.Geography}</td>
                        <td>
                            <span 
                              className="probability-score" 
                              style={{color: customer.ChurnProbability > 0.75 ? 'var(--red)' : 'var(--yellow)'}}
                            >
                                {(customer.ChurnProbability * 100).toFixed(1)}%
                            </span>
                        </td>
                        <td>
                          <button 
                            className="details-btn" 
                            onClick={() => onViewDetails(customer)}
                          >
                            View Details
                          </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
};

export default HighRiskTable;