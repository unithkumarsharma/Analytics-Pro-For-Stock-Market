import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Briefcase,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';

interface TopBarProps {
  onMenuClick: () => void;
  onNotificationClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onNotificationClick }) => {
  const { notifications } = useNotifications();
  const { theme, setTheme } = useTheme();
  const [time, setTime] = useState(new Date());

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatISTTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const tickerData = [
    { symbol: 'NIFTY 50', value: '24,782.45', change: '+1.17%', isUp: true },
    { symbol: 'SENSEX', value: '81,742.38', change: '+1.22%', isUp: true },
    { symbol: 'BANKNIFTY', value: '53,218.75', change: '-0.27%', isUp: false },
    { symbol: 'INDIAVIX', value: '14.82', change: '+5.96%', isUp: true },
    { symbol: 'USD/INR', value: '83.12', change: '-0.12%', isUp: false },
  ];

  return (
    <header className="border-b border-white/[0.08] bg-[#0c0e14] z-30 shrink-0">
      {/* Row 1: Search & Controls */}
      <div className="h-14 flex items-center justify-between px-4 lg:px-6">
        {/* Search Input */}
        <div className="flex-1 max-w-md relative flex items-center">
          <Search className="w-4 h-4 text-slate-500 absolute left-3" />
          <input
            type="text"
            placeholder="Search any symbol, company or index...   ⌘K"
            className="w-full bg-[#161a25] border border-white/[0.06] hover:border-white/10 focus:border-blue-500/50 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none transition-all font-mono"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3.5">
          {/* Theme switcher */}
          <div className="flex items-center gap-1 bg-[#161a25] border border-white/[0.06] rounded-full p-0.5 select-none">
            <button
              onClick={() => setTheme('light')}
              className={`p-1 rounded-full transition-colors ${
                theme === 'light' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1 rounded-full transition-colors ${
                theme === 'dark' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Portfolio/Briefcase icon */}
          <button className="p-2 rounded-lg bg-[#161a25] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.02] transition-colors cursor-pointer">
            <Briefcase className="w-4 h-4" />
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onNotificationClick}
            className="relative p-2 rounded-lg bg-[#161a25] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-[8px] font-bold text-white rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Live Status indicator */}
          <div className="flex items-center gap-2 text-right">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c076] live-dot animate-pulse" />
            <div className="leading-tight text-left">
              <span className="text-[10px] font-bold text-slate-400 block tracking-wide">Market Open</span>
              <span className="text-[9px] font-mono text-slate-500">{formatISTTime(time)} IST</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Live Index Ticker */}
      <div className="h-9 bg-[#11131c] border-t border-white/[0.04] flex items-center px-4 lg:px-6 gap-6 overflow-x-auto no-scrollbar scroll-smooth">
        {tickerData.map((t) => (
          <div key={t.symbol} className="flex items-center gap-2 shrink-0 text-[10px] font-mono select-none">
            <span className="text-slate-400 font-semibold">{t.symbol}</span>
            <span className="text-slate-200 font-bold">{t.value}</span>
            <span className={`flex items-center gap-0.5 font-bold ${t.isUp ? 'text-[#00c076]' : 'text-[#ff4d4f]'}`}>
              {t.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {t.change}
            </span>
          </div>
        ))}
      </div>
    </header>
  );
};

export default TopBar;
