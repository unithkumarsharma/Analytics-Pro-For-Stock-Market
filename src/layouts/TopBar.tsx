import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Bell,
  Menu,
  Wifi,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { marketIndices } from '../data/mockData';
import { formatNumber, formatPercent, getChangeColor } from '../utils/formatters';
import { useNotifications } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';

interface TopBarProps {
  onMenuClick: () => void;
  onNotificationClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick, onNotificationClick }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const { notifications } = useNotifications();
  const { t } = useLanguage();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <header className="h-16 border-b border-white/[0.06] bg-[#0d1117]/80 backdrop-blur-xl sticky top-0 z-30">
      <div className="h-full flex items-center px-4 lg:px-6 gap-4">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Market Ticker */}
        <div className="hidden md:flex items-center gap-4 overflow-x-auto no-scrollbar flex-1 min-w-0">
          {marketIndices.slice(0, 6).map((idx) => (
            <div
              key={idx.symbol}
              className="flex items-center gap-2 shrink-0 px-2.5 py-1.5 rounded-md hover:bg-white/[0.03] transition-colors cursor-pointer"
            >
              <span className="text-xs font-semibold text-slate-300">
                {idx.symbol}
              </span>
              <span className="text-xs font-mono text-slate-200">
                {formatNumber(idx.value, idx.value > 1000 ? 0 : 2)}
              </span>
              <span className={`text-xs font-mono font-semibold ${getChangeColor(idx.changePercent)}`}>
                {formatPercent(idx.changePercent)}
              </span>
            </div>
          ))}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          {/* Search */}
          <motion.div
            className={`relative hidden sm:flex items-center rounded-lg transition-all ${
              searchFocused
                ? 'bg-white/[0.08] border border-blue-500/30 w-64'
                : 'bg-white/[0.04] border border-transparent w-48'
            }`}
            animate={{ width: searchFocused ? 256 : 192 }}
          >
            <Search className="w-4 h-4 text-slate-500 absolute left-3" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="w-full py-2 pl-9 pr-3 bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <span className="absolute right-3 text-[10px] text-slate-600 font-mono border border-white/10 rounded px-1">
              ⌘K
            </span>
          </motion.div>

          {/* Clock */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-mono">{timeString}</span>
            <span className="text-[10px] text-slate-600">ET</span>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 px-2 py-1.5">
            <div className="live-dot" />
            <span className="text-xs font-medium text-emerald-400 hidden sm:inline">LIVE</span>
          </div>

          {/* Connection */}
          <div className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-colors">
            <Wifi className="w-4 h-4" />
          </div>

          {/* Notifications */}
          <button
            onClick={onNotificationClick}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 text-[8px] font-bold text-white rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User */}
          <button className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <span className="text-xs font-bold text-white">AP</span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-500 hidden sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
