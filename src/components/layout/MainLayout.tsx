import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarCollapsed(true);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMenuClick = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] grid-bg noise-overlay">
      {/* Sidebar */}
      <Sidebar
        collapsed={isMobile ? !mobileMenuOpen : sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onMobileClose={() => setMobileMenuOpen(false)}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div
        className="transition-all duration-300"
        style={{
          marginLeft: isMobile ? 0 : sidebarCollapsed ? 72 : 260,
        }}
      >
        <TopBar onMenuClick={handleMenuClick} />

        <main className="p-4 lg:p-6 min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
