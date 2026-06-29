import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useNotifications } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import {
  X,
  Bell,
  CheckCheck,
  Trash2,
  Keyboard,
  Info,
  Calendar,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Custom panels states
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [keyboardModalOpen, setKeyboardModalOpen] = useState(false);

  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const { t } = useLanguage();

  // Register Keyboard Shortcuts
  useKeyboardShortcuts(() => setKeyboardModalOpen((prev) => !prev));

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
    <div className="min-h-screen bg-[#0a0e17] text-white grid-bg noise-overlay relative">
      {/* Sidebar */}
      <Sidebar
        collapsed={isMobile ? !mobileMenuOpen : sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onMobileClose={() => setMobileMenuOpen(false)}
        isMobile={isMobile}
      />

      {/* Main Content container */}
      <div
        className="transition-all duration-300"
        style={{
          marginLeft: isMobile ? 0 : sidebarCollapsed ? 72 : 260,
        }}
      >
        <TopBar
          onMenuClick={handleMenuClick}
          onNotificationClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
        />

        <main className="p-4 lg:p-6 min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>

      {/* ===== Notification Flyout Panel ===== */}
      <AnimatePresence>
        {notificationPanelOpen && (
          <>
            {/* Backdrop click closer */}
            <div
              className="fixed inset-0 z-40 bg-black/20"
              onClick={() => setNotificationPanelOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 sm:w-96 bg-[#0c1017]/95 border-l border-white/10 z-50 shadow-2xl backdrop-blur-xl flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-sm">Notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllAsRead}
                    className="p-1.5 rounded hover:bg-white/[0.04] text-slate-400 hover:text-white transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={clearAll}
                    className="p-1.5 rounded hover:bg-white/[0.04] text-slate-400 hover:text-red-400 transition-colors"
                    title="Clear all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setNotificationPanelOpen(false)}
                    className="p-1.5 rounded hover:bg-white/[0.04] text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04] p-2 space-y-2">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer relative ${
                        n.read
                          ? 'bg-transparent border-transparent hover:bg-white/[0.02]'
                          : 'bg-blue-500/[0.02] border-blue-500/10 hover:border-blue-500/20'
                      }`}
                    >
                      {!n.read && <div className="absolute left-1.5 top-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full" />}
                      <div className="flex justify-between items-start gap-2 mb-1 pl-1">
                        <span className="font-bold text-xs text-white">{n.title}</span>
                        <span className="text-[9px] text-slate-500 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 pl-1 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-500 text-xs py-12">
                    No new notifications.
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== Keyboard Shortcuts Helper Modal ===== */}
      <AnimatePresence>
        {keyboardModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setKeyboardModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#0d121c] border border-white/10 rounded-xl p-5 max-w-md w-full shadow-2xl z-10 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-blue-400" />
                  <h3 className="font-bold text-sm text-white">Keyboard Navigation Shortcuts</h3>
                </div>
                <button
                  onClick={() => setKeyboardModalOpen(false)}
                  className="p-1 rounded hover:bg-white/[0.04] text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                {[
                  { keys: ['g', 'd'], desc: 'Go to Dashboard' },
                  { keys: ['g', 'm'], desc: 'Go to Markets' },
                  { keys: ['g', 'p'], desc: 'Go to Portfolio' },
                  { keys: ['g', 't'], desc: 'Go to Technical Analysis' },
                  { keys: ['g', 'o'], desc: 'Go to Options Chain' },
                  { keys: ['g', 'a'], desc: 'Go to AI Prediction Signals' },
                  { keys: ['g', 'w'], desc: 'Go to Watchlist' },
                  { keys: ['g', 'n'], desc: 'Go to News Center' },
                  { keys: ['g', 's'], desc: 'Go to Settings' },
                  { keys: ['?'], desc: 'Open this helper guide' },
                ].map((s) => (
                  <div key={s.desc} className="flex justify-between items-center gap-3 py-1 border-b border-white/[0.02]">
                    <span className="text-slate-400">{s.desc}</span>
                    <div className="flex gap-1 shrink-0">
                      {s.keys.map((k) => (
                        <kbd key={k} className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 text-[10px] font-mono text-white">
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-blue-500/5 border border-blue-500/10 rounded-lg text-[10px] text-slate-400">
                <Info className="w-4 h-4 text-blue-400 shrink-0" />
                Type the keys in sequence on any page (without focus in input fields) to trigger navigation.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainLayout;
