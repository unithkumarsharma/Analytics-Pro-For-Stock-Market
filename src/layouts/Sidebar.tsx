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
  Flame,
  Search,
  Calendar,
  BellRing,
  FileSpreadsheet,
  Award,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onMobileClose?: () => void;
  isMobile?: boolean;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string;
  badgeType?: 'blue' | 'purple' | 'red';
  section: string;
}

const navItems: NavItem[] = [
  // MARKET
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, section: 'market' },
  { path: '/markets', label: 'Markets', icon: BarChart3, section: 'market' },
  { path: '/watchlist', label: 'Watchlist', icon: Star, section: 'market' },
  { path: '/heatmap', label: 'Heatmap', icon: Flame, section: 'market' },
  { path: '/news', label: 'News & Insights', icon: Newspaper, badge: 'NEW', badgeType: 'blue', section: 'market' },
  
  // ANALYTICS
  { path: '/technical', label: 'Technical Analysis', icon: LineChart, section: 'analytics' },
  { path: '/options', label: 'Options Analytics', icon: Binary, section: 'analytics' },
  { path: '/signals', label: 'AI Signals', icon: Brain, section: 'analytics' },
  { path: '/scanner', label: 'Market Scanner', icon: Search, section: 'analytics' },

  // PORTFOLIO
  { path: '/portfolio', label: 'Portfolio Overview', icon: Briefcase, section: 'portfolio' },
  { path: '/holdings', label: 'Holdings', icon: FileSpreadsheet, section: 'portfolio' },
  { path: '/performance', label: 'Performance', icon: Award, section: 'portfolio' },
  { path: '/transactions', label: 'Transactions', icon: Activity, section: 'portfolio' },

  // TOOLS
  { path: '/calendar', label: 'Economic Calendar', icon: Calendar, section: 'tools' },
  { path: '/alerts', label: 'Alerts', icon: BellRing, section: 'tools' },
  { path: '/reports', label: 'Reports', icon: FileSpreadsheet, section: 'tools' },
];

const sectionLabels: Record<string, string> = {
  market: 'MARKET',
  analytics: 'ANALYTICS',
  portfolio: 'PORTFOLIO',
  tools: 'TOOLS',
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
        className="fixed top-0 left-0 h-full z-50 flex flex-col bg-[#0d0f14] border-r border-[#1e2130] transition-all duration-300 ease-in-out font-sans select-none"
        style={{ width: collapsed && !isMobile ? 72 : 220 }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-[#1e2130] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4 text-white" />
            </div>
            {(!collapsed || isMobile) && (
              <div className="overflow-hidden whitespace-nowrap leading-tight">
                <div className="text-sm font-bold text-white tracking-wide">
                  Analytics <span className="text-blue-500 font-extrabold">Pro</span>
                </div>
                <div className="text-[8px] text-slate-500 font-mono tracking-widest uppercase mt-0.5">
                  Stock Market Intelligence
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4 no-scrollbar">
          {Object.entries(groupedItems).map(([section, items]) => (
            <div key={section} className="space-y-1">
              {(!collapsed || isMobile) && (
                <div className="px-3 mb-1 text-[9px] font-bold tracking-[0.12em] text-slate-600">
                  {sectionLabels[section]}
                </div>
              )}

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
                          relative flex items-center gap-2.5 px-3 py-2 rounded-md
                          transition-all duration-150 group text-xs
                          ${isActive
                            ? 'bg-[#1a3a6b] text-white font-semibold border-l-[3px] border-[#3b82f6] rounded-r-md rounded-l-none pl-2'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'}
                        `}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[#3b82f6] rounded-full hidden" />
                        )}

                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />

                        {(!collapsed || isMobile) && (
                          <span className="truncate">{item.label}</span>
                        )}

                        {item.badge && (!collapsed || isMobile) && (
                          <span className={`ml-auto text-[8px] font-bold px-1 py-0.2 rounded font-mono ${
                            item.badgeType === 'blue'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
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

        {/* Upgrade to Pro Card */}
        {(!collapsed || isMobile) && (
          <div className="px-4 py-3 border-t border-white/[0.04] bg-white/[0.01]">
            <div className="p-3 rounded-lg bg-gradient-to-br from-[#1b1c2b] to-[#121320] border border-violet-500/20 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-md bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs text-violet-400">★</span>
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-white block">Upgrade to Pro</span>
                <span className="text-[9px] text-slate-500 block leading-tight mt-0.5">Unlock advanced options analytics & scanner</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Profile controls */}
        <div className="p-3 border-t border-white/[0.08] bg-[#090b10] shrink-0">
          <div className="space-y-0.5">
            <NavLink to="/settings" className="block">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] text-xs">
                <Settings className="w-4 h-4 text-slate-500" />
                {(!collapsed || isMobile) && <span>Settings</span>}
              </div>
            </NavLink>
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] text-xs cursor-pointer">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              {(!collapsed || isMobile) && <span>Help & Support</span>}
            </div>
          </div>

          {/* Profile Card */}
          {(!collapsed || isMobile) && (
            <div className="mt-3 p-2 rounded-lg bg-[#161a25] border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-white">US</span>
                </div>
                <div className="min-w-0 leading-tight">
                  <span className="text-xs font-bold text-slate-200 block truncate">Unith Sharma</span>
                  <span className="text-[9px] text-slate-500 block font-mono">Premium Plan</span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </div>
          )}

          {/* Collapse Button */}
          {!isMobile && (
            <button
              onClick={onToggle}
              className="w-full flex items-center justify-center gap-2 py-1.5 mt-2 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/[0.03] transition-colors"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
