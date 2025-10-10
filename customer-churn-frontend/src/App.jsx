import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Predictor from './pages/Predictor';
import Performance from './pages/Performance';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import HelpCenter from './pages/HelpCenter'; // Import HelpCenter
import CustomerProfile from './pages/CustomerProfile'; // Import CustomerProfile

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes wrapped in a layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/predictor" element={<Predictor />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help-center" element={<HelpCenter />} /> {/* Add HelpCenter route */}
            <Route path="/customer/:id" element={<CustomerProfile />} />
          </Route>
        </Route>

        {/* Redirect any unknown paths to the landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;