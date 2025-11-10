// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Spotlight } from '../components/ui/Spotlight';
import { SplineScene } from '../components/ui/SplineScene';
import TextType from '../components/ui/TextType';
import { Timeline } from '../components/ui/Timeline';
import { motion } from "framer-motion";
import './LandingPage.css';

// --- (timelineData remains unchanged) ---
const timelineData = [
  {
    title: "Project Inception",
    content: (
      <div className="timeline-content-card">
        <TextType
          as="p"
          className="timeline-content-paragraph"
          text={[
            "From day one, our mission was clear: create a predictive tool that was both technically powerful and simple to integrate. Our research and development focused on a core AI model that could turn raw business data into actionable retention insights, right out of the box."
          ]}
          typingSpeed={30}
          loop={false}
          showCursor={true}
          startOnVisible={true} // Start animation when scrolled into view
        />
      </div>
    )
  },
  {
    title: "V1.0 Launch",
    content: (
      <div className="timeline-content-card">
        <TextType
          as="p"
          className="timeline-content-paragraph"
          text={[
            "Our initial platform launched with the essential tools for churn management. This included the high-level Dashboard, the granular Predictor tool, and our simple CSV-to-model pipeline. We proudly onboarded our first beta users, validating our core assumption: businesses needed this."
          ]}
          typingSpeed={30}
          loop={false}
          showCursor={true}
          startOnVisible={true}
        />
      </div>
    )
  },
  {
    title: "Platform Evolution & Key Insights",
    content: (
      <div className="timeline-content-card">
        <TextType
          as="p"
          className="timeline-content-paragraph"
          text={[
            "Driven by user feedback, we moved beyond just predictions. We added a transparent Model Performance page so you can trust your data. We integrated SHAP explainability to not only show who is at-risk, but why. Finally, we added model retraining to ensure your AI stays sharp as your customers change."
          ]}
          typingSpeed={30}
          loop={false}
          showCursor={true}
          startOnVisible={true}
        />
      </div>
    )
  }
];
// --- END OF TIMELINE DATA ---

const TimelineDemo = () => (
  <Timeline data={timelineData} />
);


const LandingPage = () => {
  return (
    <div className="landing-container aurora-bg">
      <header className="landing-header">
        <h1 className="landing-title"></h1>
        <nav className="landing-nav">
          <Link to="/signup" className="btn">Register</Link>
        </nav>
      </header>
      <main className="landing-main">

        {/* --- SPLINE HERO SECTION --- */}
        <Card className="spline-card">
          {/* ... (rest of spline card) ... */}
          <div className="spline-card-content">
            <div className="spline-text-content">
              
              {/* --- UPDATED TEXT STRUCTURE --- */}
              
              {/* Static Part */}
              <h2 
                className="spline-description" // Use class for base styling
                style={{ 
                  fontWeight: 'bold', 
                  fontSize: '3rem',
                  margin: 0, // Reset margin
                  minHeight: 0, // Reset minHeight
                  color: 'var(--text-light, #FAFAFA)' // Ensure bright color
                }}
              >
                CHURNGUARD
              </h2>
              
              {/* Animated Part */}
              <TextType
                as="p"
                text={["The platform helps businesses keep their customer momentum."]} // Removed leading space
                typingSpeed={50}
                loop={false}
                showCursor={true}
                cursorCharacter="|"
                className="spline-description" // Use class for styling
                style={{ 
                  fontWeight: 'bold', 
                  fontSize: '2rem', // <-- UPDATED FONT SIZE
                  minHeight: '100px' // Keep layout stable
                }}
              />
              
              {/* REMOVED the p tag with TextType */}
              <div 
                className="hero-actions"
                style={{ paddingLeft: '40px' }} // <-- INCREASED PADDING SIGNIFICANTLY
              >
                <Link to="/signup" className="btn"> Register</Link>
                <Link to="/login" className="btn">login</Link>
              </div>
            </div>
            <div className="spline-scene-container">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="spline-scene"
              />
            </div>
          </div>
        </Card>
        {/* --- END HERO SECTION --- */}

        {/* --- (rest of the page remains unchanged) --- */}
        <div className="features-section">
          {/* ... (features grid) ... */}
        </div>
        <div className="use-cases-section">
          {/* ... (use cases list) ... */}
        </div>

        {/* --- UPDATED ABOUT SECTION --- */}
        <div className="use-cases-section">

          {/* Centering wrapper for the badge - NOW OUTSIDE THE BOX */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            {/* Internal Title (styled as a badge) */}
            <h3 style={{
              display: 'inline-block', // Makes background fit text
              padding: '6px 16px',     // Adds padding
              borderRadius: '999px',   // Pill shape
              
              // --- UPDATED STYLES ---
              // Use the gradient from the button for the background
              background: 'linear-gradient(-45deg, #ffae00, #7e03aa, #00fffb)', 
              // Use a dark color for text to contrast with the bright gradient
              color: '#080312', 
              // --- END UPDATED STYLES ---

              fontSize: '1.75rem', 
              fontWeight: '700',
              textTransform: 'uppercase',
              margin: '0' // Remove default margins
            }}>
              🛡️ ABOUT CHURNGUARD
            </h3>
          </div>
          
          {/* The glassmorphism box - NO TITLE INSIDE */}
          <div style={{
            padding: '24px',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(26, 26, 46, 0.6))',
            backdropFilter: 'blur(10px)',
            minHeight: '150px',
            textAlign: 'left' // <-- TextType will be left-aligned
          }}>
            
            {/* Animated TextType (remains left-aligned) */}
            <TextType
              as="p"
              text={[
                "ChurnGuard is an AI platform to help businesses stop customer churn. Users upload their customer data (CSV) to instantly train a personalized machine learning model. The system provides a dashboard to identify high-risk customers, a predictor tool to score individuals, and clear explanations (SHAP) for why a customer might leave."
              ]}
              typingSpeed={30}
              loop={false}
              showCursor={true}
              cursorCharacter="|"
              className="spline-description" // Re-using this class for font styling
              style={{ 
                minHeight: '0', 
                marginTop: '0',
                maxWidth: '100%' // Allow text to fill the container width
              }}
            />
          </div>
        </div>

        {/* --- ADDED TIMELINE SECTION --- */}
        <TimelineDemo />

      </main>
      <footer className="landing-footer">
        <p>&copy; 🛡️2050 ChurnGuard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;