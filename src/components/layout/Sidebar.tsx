import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BarChart3,
  Briefcase,
  LineChart,
  Binary,
  Brain,
  Star,
  Newspaper,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  TrendingUp,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onMobileClose?: () => void;
  isMobile?: boolean;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, section: 'main' },
  { path: '/markets', label: 'Markets', icon: BarChart3, section: 'main' },
  { path: '/portfolio', label: 'Portfolio', icon: Briefcase, section: 'main' },
  { path: '/technical', label: 'Technical Analysis', icon: LineChart, section: 'analytics' },
  { path: '/options', label: 'Options Analytics', icon: Binary, section: 'analytics' },
  { path: '/signals', label: 'AI Signals', icon: Brain, badge: '5', section: 'analytics' },
  { path: '/watchlist', label: 'Watchlist', icon: Star, section: 'tools' },
  { path: '/news', label: 'News', icon: Newspaper, badge: '12', section: 'tools' },
  { path: '/settings', label: 'Settings', icon: Settings, section: 'system' },
];

const sectionLabels: Record<string, string> = {
  main: 'OVERVIEW',
  analytics: 'ANALYTICS',
  tools: 'TOOLS',
  system: 'SYSTEM',
};

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle, onMobileClose, isMobile }) => {
  const location = useLocation();

  const groupedItems = navItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof navItems>);

  const handleNavClick = () => {
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && !collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col
          bg-[#0d1117]/95 backdrop-blur-xl border-r border-white/[0.06]
          ${isMobile ? (collapsed ? '-translate-x-full' : 'translate-x-0') : ''}
          transition-all duration-300 ease-in-out`}
        style={{ width: collapsed && !isMobile ? 72 : 260 }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <AnimatePresence>
              {(!collapsed || isMobile) && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <span className="text-base font-bold text-white tracking-tight">
                    Analytics
                  </span>
                  <span className="text-base font-bold text-blue-400 tracking-tight">
                    Pro
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {Object.entries(groupedItems).map(([section, items]) => (
            <div key={section}>
              <AnimatePresence>
                {(!collapsed || isMobile) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-3 mb-2 text-[10px] font-semibold tracking-[0.15em] text-slate-500"
                  >
                    {sectionLabels[section]}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-0.5">
                {items.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={handleNavClick}
                      className="block"
                    >
                      <div
                        className={`
                          relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                          transition-all duration-200 group
                          ${isActive
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'}
                        `}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-400 rounded-full"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}

                        <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-blue-400' : ''}`} />

                        <AnimatePresence>
                          {(!collapsed || isMobile) && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              className="text-sm font-medium whitespace-nowrap overflow-hidden"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {/* Badge */}
                        {item.badge && (!collapsed || isMobile) && (
                          <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-white/[0.06] shrink-0">
          {(!collapsed || isMobile) && (
            <div className="glass rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400">Market Open</span>
              </div>
              <p className="text-[10px] text-slate-500">
                NYSE & NASDAQ · Closes 4:00 PM ET
              </p>
            </div>
          )}

          {/* Collapse toggle - desktop only */}
          {!isMobile && (
            <button
              onClick={onToggle}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-xs">Collapse</span>
                </>
              )}
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
