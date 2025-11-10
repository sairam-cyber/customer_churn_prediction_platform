import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login({ email, password });
      if (response.data && response.data.token) {
        // Store the token in localStorage to stay logged in
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard'); // Redirect on successful login
      } else {
        throw new Error("Login response did not contain a token.");
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMessage('');
    setForgotLoading(true);

    try {
      // Simulate API call for forgot password
      // In a real app, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      
      setForgotMessage('✅ Password reset link sent to your email! Please check your inbox and follow the instructions to reset your password.');
      setForgotEmail('');
    } catch (err) {
      setForgotMessage('❌ Failed to send reset email. Please try again or contact support.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="login-container">
      {!showForgotPassword ? (
        <form className="login-form" onSubmit={handleSubmit}>
          <h2> Welcome Back!</h2>
          <p className="subtitle">Log in to access your dashboard.</p>

          {error && <p className="error-message">{error}</p>}

          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* UPDATED className */}
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Logging In...' : 'Log In'}
          </button>
          
          <div className="login-links">
            <button 
              type="button" 
              className="forgot-password-link"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </button>
            <p className="signup-link">
              Don't have an account? <a href="/signup">Sign up</a>
            </p>
          </div>
        </form>
      ) : (
        <form className="login-form" onSubmit={handleForgotPassword}>
          <h2>Reset Password</h2>
          <p className="subtitle">Enter your email address and we'll send you a link to reset your password.</p>

          {forgotMessage && <p className={`forgot-message ${forgotMessage.includes('✅') ? 'success' : 'error'}`}>{forgotMessage}</p>}

          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email address"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="forgot-actions">
            {/* UPDATED className */}
            <button type="submit" className="btn" disabled={forgotLoading}>
              {forgotLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button 
              type="button" 
              className="back-to-login"
              onClick={() => {
                setShowForgotPassword(false);
                setForgotMessage('');
                setForgotEmail('');
              }}
            >
              ← Back to Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;