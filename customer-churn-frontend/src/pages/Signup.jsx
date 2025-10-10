import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/api';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.companyName || !formData.email || !formData.password) {
      setError('All fields are required.');
      return;
    }
    if (!file) {
      setError('Please upload a dataset file.');
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append('companyName', formData.companyName);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('dataset', file);

    try {
      await signup(data);
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Your Account</h2>
        <p className="subtitle">Get started by entering your details and uploading your customer data.</p>
        
        {error && <p className="error-message">{error}</p>}

        <div className="input-group">
          <input type="text" id="companyName" name="companyName" placeholder="Company Name" onChange={handleChange} required />
        </div>
        <div className="input-group">
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
        </div>
        <div className="input-group">
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        </div>

        <div className="file-upload-area">
          <label htmlFor="dataset-upload" className="file-label">
            {file ? `Selected: ${file.name}` : 'Click to Upload Your CSV Dataset'}
          </label>
          <input id="dataset-upload" type="file" accept=".csv" onChange={handleFileChange} />
        </div>

        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? 'Processing...' : 'Create Account'}
        </button>
        
        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;