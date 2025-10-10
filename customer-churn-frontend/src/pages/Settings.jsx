import React, { useState, useEffect } from 'react';
import { getUserDetails, updateUserDetails, startCompanyVerification, retrainModel } from '../services/api';
import './Settings.css';

const Settings = () => {
  const [userDetails, setUserDetails] = useState({
    companyName: '',
    email: '',
    password: '',
  });
  const [isVerified, setIsVerified] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [modelType, setModelType] = useState('logistic_regression');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getUserDetails();
        setUserDetails({
          companyName: response.data.companyName,
          email: response.data.email,
          password: '', // Keep password field empty for security
        });
        setVerificationEmail(response.data.email); // Pre-fill with user's email
        setIsVerified(response.data.isVerified);
      } catch (err) {
        setError('Could not fetch user details.');
      }
    };
    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const dataToUpdate = {
        companyName: userDetails.companyName,
        email: userDetails.email,
      };
      // Only include the password if the user entered a new one
      if (userDetails.password) {
        dataToUpdate.password = userDetails.password;
      }
      const response = await updateUserDetails(dataToUpdate);
      setMessage(response.data.message);
      setUserDetails(prev => ({ ...prev, password: '' })); // Clear password field after submission
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
        const response = await startCompanyVerification({ email: verificationEmail });
        setMessage(response.data.message);
        setShowVerificationInput(false); // Hide input after sending
    } catch(err) {
        setError(err.response?.data?.error || 'Failed to send verification email.');
    } finally {
        setLoading(false);
    }
  }

  const handleRetrain = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
        const response = await retrainModel({ modelType });
        setMessage(response.data.message);
    } catch(err) {
        setError(err.response?.data?.error || 'Failed to retrain model.');
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="settings-section">
        <h3>Account Information</h3>
        <form onSubmit={handleDetailsSubmit}>
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input type="text" id="companyName" name="companyName" value={userDetails.companyName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" value={userDetails.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input type="password" id="password" name="password" value={userDetails.password} onChange={handleChange} placeholder="Leave blank to keep current password" />
          </div>
          <button type="submit" className="update-button" disabled={loading}>
            {loading ? 'Updating...' : 'Update Details'}
          </button>
        </form>
      </div>

      <div className="settings-section">
        <h3>Company Verification</h3>
        <div className="verification-status">
          <span>Status:</span>
          {isVerified ? (
            <span className="verified-badge">Verified</span>
          ) : (
            <span className="unverified-badge">Not Verified</span>
          )}
        </div>
        
        {!isVerified && !showVerificationInput && (
          <>
            <p>Verify your company to gain access to additional features.</p>
            <button onClick={() => setShowVerificationInput(true)} className="verify-button">Verify Company</button>
          </>
        )}

        {showVerificationInput && (
          <form onSubmit={handleSendVerification} className="verification-form">
            <p>Enter your official company email address to receive a verification link.</p>
            <div className="form-group">
                <label htmlFor="verificationEmail">Company Email</label>
                <input 
                    type="email" 
                    id="verificationEmail" 
                    name="verificationEmail" 
                    value={verificationEmail} 
                    onChange={(e) => setVerificationEmail(e.target.value)} 
                    required 
                />
            </div>
            <div className='verification-actions'>
                <button type="submit" className="verify-button" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Verification Email'}
                </button>
                <button type="button" className="cancel-button" onClick={() => setShowVerificationInput(false)}>
                    Cancel
                </button>
            </div>
          </form>
        )}
      </div>

        <div className="settings-section">
            <h3>Model Management</h3>
            <div className="form-group">
                <label htmlFor="modelType">Model Type</label>
                <select id="modelType" name="modelType" value={modelType} onChange={(e) => setModelType(e.target.value)}>
                    <option value="logistic_regression">Logistic Regression</option>
                    <option value="random_forest">Random Forest</option>
                </select>
            </div>
            <button onClick={handleRetrain} className="update-button" disabled={loading}>
                {loading ? 'Retraining...' : 'Retrain Model'}
            </button>
        </div>

      <div className="settings-section">
        <h3>Help & Support</h3>
        <p>If you are facing any issues or have any questions, please visit our help center.</p>
        <a href="/help-center" className="help-button">Go to Help Center</a>
      </div>
    </div>
  );
};

export default Settings;