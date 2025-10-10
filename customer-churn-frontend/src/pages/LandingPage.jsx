// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container aurora-bg">
      <header className="landing-header">
        <h1 className="landing-title">🛡️ ChurnGuard</h1>
        <nav className="landing-nav">
          <Link to="/login" className="nav-link">🔑 Login</Link>
          <Link to="/signup" className="nav-link signup-btn">✨ Sign Up</Link>
        </nav>
      </header>
      <main className="landing-main">
        <div className="hero-section">
          <h2>🤖 Predict and Prevent Customer Churn with AI</h2>
          <p>
            Leverage modern machine learning to surface high-risk segments, uncover churn drivers, and trigger the right actions at the right time.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="cta-button">🚀 Get Started for Free</Link>
            <Link to="/login" className="secondary-link">👀 View Demo</Link>
          </div>
        </div>
        <div className="features-section">
          <h3>🚀 Platform Capabilities</h3>
          <div className="features-grid">
            <div className="feature-card">
              <h4>📊 Smart Data Ingest</h4>
              <p>Securely bring CSVs and enterprise exports. Automatic schema detection and validation ensure clean inputs.</p>
            </div>
            <div className="feature-card">
              <h4>🧠 AI-Powered Insight</h4>
              <p>Model pipelines score churn probability and surface the top drivers with explainability out of the box.</p>
            </div>
            <div className="feature-card">
              <h4>📋 Actionable Playbooks</h4>
              <p>Target the right customers with recommended offers and workflows that improve retention efficiently.</p>
            </div>
          </div>
        </div>
        <div className="use-cases-section">
          <h3>👥 Who It's For</h3>
          <ul className="use-cases-list">
            <li><span className="chip">📈 Growth & Marketing</span> Identify at‑risk cohorts and trigger win‑back journeys.</li>
            <li><span className="chip">💬 Customer Success</span> Prioritize outreach with probability‑based risk tiers.</li>
            <li><span className="chip">🔧 Data Teams</span> Integrate pipelines and monitor model performance over time.</li>
          </ul>
        </div>
      </main>
      <footer className="landing-footer">
        <p>&copy; 2025 🛡️ ChurnGuard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;