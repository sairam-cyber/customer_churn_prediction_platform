// src/pages/CustomerProfile.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const CustomerProfile = () => {
    const location = useLocation();
    const { customer } = location.state || {};

    if(!customer) {
        return <div>No customer data provided.</div>
    }

    return (
        <div>
            <h1>Customer Profile</h1>
            <h2>{customer.Surname}, {customer.CustomerId}</h2>
            <p><strong>Geography:</strong> {customer.Geography}</p>
            <p><strong>Gender:</strong> {customer.Gender}</p>
            <p><strong>Age:</strong> {customer.Age}</p>
            <p><strong>Tenure:</strong> {customer.Tenure}</p>
            <p><strong>Balance:</strong> {customer.Balance}</p>
            <p><strong>Number of Products:</strong> {customer.NumOfProducts}</p>
            <p><strong>Has Credit Card:</strong> {customer.HasCrCard ? 'Yes' : 'No'}</p>
            <p><strong>Is Active Member:</strong> {customer.IsActiveMember ? 'Yes' : 'No'}</p>
            <p><strong>Estimated Salary:</strong> {customer.EstimatedSalary}</p>
            <p><strong>Churn Probability:</strong> {(customer.ChurnProbability * 100).toFixed(1)}%</p>
        </div>
    );
};

export default CustomerProfile;