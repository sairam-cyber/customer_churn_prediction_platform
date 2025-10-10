// src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="app-shell" style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, marginLeft: '250px', padding: '2rem', position: 'relative', zIndex: 1 }}>
        <Outlet /> {/* Child routes will render here */}
      </main>
    </div>
  );
};

export default MainLayout;