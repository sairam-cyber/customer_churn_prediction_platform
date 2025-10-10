import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { predictChurn } from '../services/api';
import ProbabilityGauge from '../components/predictor/ProbabilityGauge';
import Loader from '../components/common/Loader';
import ErrorDisplay from '../components/common/ErrorDisplay';
import ShapChart from '../components/predictor/ShapChart';
import './Predictor.css';

const Predictor = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    CreditScore: '',
    Age: '',
    Tenure: '',
    Balance: '',
    NumOfProducts: '',
    HasCrCard: '1',
    IsActiveMember: '1',
    EstimatedSalary: '',
    Geography: 'France',
    Gender: 'Male',
  });
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (location.state && location.state.customer) {
      const { customer } = location.state;
      setFormData({
        CreditScore: customer.CreditScore || '',
        Age: customer.Age || '',
        Tenure: customer.Tenure || '',
        Balance: customer.Balance || '',
        NumOfProducts: customer.NumOfProducts || '',
        HasCrCard: customer.HasCrCard?.toString() || '1',
        IsActiveMember: customer.IsActiveMember?.toString() || '1',
        EstimatedSalary: customer.EstimatedSalary || '',
        Geography: customer.Geography || 'France',
        Gender: customer.Gender || 'Male',
      });
    }
  }, [location.state]);

  const validateField = (name, value) => {
    if (name === 'CreditScore') {
      if (value && (Number(value) < 300 || Number(value) > 850)) {
        return 'Credit Score must be between 300 and 850.';
      }
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const errorMessage = validateField(name, value);
    setFieldErrors({ ...fieldErrors, [name]: errorMessage });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const key in formData) {
      if (validateField(key, formData[key])) {
        setError('Please fix the errors before submitting.');
        return;
      }
    }

    setIsLoading(true);
    setError('');
    setPrediction(null);
    try {
      const submissionData = {
          ...formData,
          CreditScore: Number(formData.CreditScore),
          Age: Number(formData.Age),
          Tenure: Number(formData.Tenure),
          Balance: Number(formData.Balance),
          NumOfProducts: Number(formData.NumOfProducts),
          HasCrCard: Number(formData.HasCrCard),
          IsActiveMember: Number(formData.IsActiveMember),
          EstimatedSalary: Number(formData.EstimatedSalary),
      };
      const response = await predictChurn(submissionData);
      setPrediction(response.data);
    } catch (err) {
      // --- FIXED ERROR HANDLING ---
      // This ensures we always get a string, even from nested error objects.
      const errorMessage =
        err.response?.data?.detail?.error ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        'An unknown error occurred while fetching the prediction.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="predictor-container">
      <h2>Churn Predictor</h2>
      <p>Enter customer details to predict the probability of churn.</p>
      <div className="predictor-content">
        <form onSubmit={handleSubmit} className="predictor-form">
            <div className="form-grid">
                <div className="form-group">
                    <label>Credit Score</label>
                    <input type="number" name="CreditScore" value={formData.CreditScore} onChange={handleChange} required />
                    {fieldErrors.CreditScore && <p className="error-text">{fieldErrors.CreditScore}</p>}
                </div>
                <div className="form-group">
                    <label>Age</label>
                    <input type="number" name="Age" value={formData.Age} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Tenure (years)</label>
                    <input type="number" name="Tenure" value={formData.Tenure} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Balance</label>
                    <input type="number" step="0.01" name="Balance" value={formData.Balance} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Number of Products</label>
                    <input type="number" name="NumOfProducts" value={formData.NumOfProducts} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Estimated Salary</label>
                    <input type="number" step="0.01" name="EstimatedSalary" value={formData.EstimatedSalary} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Has Credit Card?</label>
                    <select name="HasCrCard" value={formData.HasCrCard} onChange={handleChange}>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Is Active Member?</label>
                    <select name="IsActiveMember" value={formData.IsActiveMember} onChange={handleChange}>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                    </select>
                </div>
                 <div className="form-group">
                    <label>Geography</label>
                    <select name="Geography" value={formData.Geography} onChange={handleChange}>
                        <option value="France">France</option>
                        <option value="Spain">Spain</option>
                        <option value="Germany">Germany</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Gender</label>
                    <select name="Gender" value={formData.Gender} onChange={handleChange}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
            </div>
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Predicting...' : 'Predict Churn'}
            </button>
        </form>
        <div className="prediction-results">
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {prediction && (
                <div className="results-display">
                    <h3>Prediction Result</h3>
                    <ProbabilityGauge probability={prediction.churnProbability} />
                    <div className="strategy-recommendation">
                        <h4>Recommended Strategy</h4>
                        <p>{prediction.recommendedStrategy}</p>
                    </div>
                    {prediction.shapValues && (
                        <div className="shap-explanation">
                            <h4>Prediction Explanation</h4>
                            <ShapChart shapData={prediction.shapValues} />
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Predictor;