import React from 'react';
import './HelpCenter.css';

const HelpCenter = () => {
  return (
    <div className="help-center-container">
      <div className="help-header">
        <h2>🆘 Help Center</h2>
        <p>Welcome to the ChurnGuard Help Center. Here you can find answers to common questions and get in touch with our support team.</p>
      </div>

      <div className="help-section">
        <h3>❓ Frequently Asked Questions</h3>
        <div className="faq-grid">
          <div className="faq-card">
            <h4>📊 How do I format my CSV file for training?</h4>
            <p>Your CSV file must contain the following columns: <code>CreditScore</code>, <code>Geography</code>, <code>Gender</code>, <code>Age</code>, <code>Tenure</code>, <code>Balance</code>, <code>NumOfProducts</code>, <code>HasCrCard</code>, <code>IsActiveMember</code>, <code>EstimatedSalary</code>, and <code>Exited</code>.</p>
          </div>
          <div className="faq-card">
            <h4>🎯 What does the churn probability score mean?</h4>
            <p>The churn probability is a score between 0 and 1 that represents the likelihood of a customer churning. A higher score means a higher risk of churn.</p>
          </div>
          <div className="faq-card">
            <h4>🔒 Is my data secure?</h4>
            <p>Yes! We use enterprise-grade encryption and security measures to protect your data. Your information is never shared with third parties.</p>
          </div>
          <div className="faq-card">
            <h4>⚡ How accurate are the predictions?</h4>
            <p>Our AI models achieve 85%+ accuracy in churn prediction. We continuously improve our algorithms with new data and feedback.</p>
          </div>
        </div>
      </div>

      <div className="help-section">
        <h3>📞 Contact Us</h3>
        <p>If you can't find the answer you're looking for, please fill out the form below to contact our support team.</p>
        <form className="contact-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">👤 Your Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">📧 Your Email</label>
              <input type="email" id="email" name="email" required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="subject">📝 Subject</label>
            <select id="subject" name="subject" required>
              <option value="">Select a topic</option>
              <option value="technical">🔧 Technical Support</option>
              <option value="billing">💳 Billing Question</option>
              <option value="feature">✨ Feature Request</option>
              <option value="bug">🐛 Bug Report</option>
              <option value="other">❓ Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="message">💬 Your Message</label>
            <textarea id="message" name="message" rows="5" required placeholder="Please describe your question or issue in detail..."></textarea>
          </div>
          <button type="submit" className="submit-button">🚀 Send Message</button>
        </form>
      </div>

      <div className="help-section">
        <h3>📚 Additional Resources</h3>
        <div className="resources-grid">
          <div className="resource-card">
            <h4>📖 Documentation</h4>
            <p>Comprehensive guides and API documentation</p>
            <button className="resource-btn">View Docs</button>
          </div>
          <div className="resource-card">
            <h4>🎥 Video Tutorials</h4>
            <p>Step-by-step video guides for getting started</p>
            <button className="resource-btn">Watch Videos</button>
          </div>
          <div className="resource-card">
            <h4>💬 Community Forum</h4>
            <p>Connect with other users and share experiences</p>
            <button className="resource-btn">Join Forum</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;