// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { FiGrid, FiTarget, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    // Correctly remove the 'token' from local storage
    localStorage.removeItem('token');
    // Redirect to landing page
    navigate('/');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>🛡️ ChurnGuard</h3>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard"><FiGrid /> 📊 Dashboard</NavLink>
        <NavLink to="/predictor"><FiTarget /> 🎯 Predictor</NavLink>
        <NavLink to="/performance"><FiBarChart2 /> 📈 Performance</NavLink>
        <NavLink to="/settings"><FiSettings /> ⚙️ Settings</NavLink>
      </nav>
      <div className="sidebar-footer">
        <a href="#" onClick={handleLogout}><FiLogOut /> 🚪 Logout</a>
      </div>
    </div>
  );
};

export default Sidebar;