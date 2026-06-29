import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Check,
  Zap,
} from 'lucide-react';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';
import { useLanguage, LanguageCode } from '../contexts/LanguageContext';

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative w-11 h-6 rounded-full transition-colors ${
      enabled ? 'bg-blue-500' : 'bg-white/10'
    }`}
  >
    <div
      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
        enabled ? 'left-6' : 'left-1'
      }`}
    />
  </button>
);

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    soundEffects: false,
    compactView: false,
    animations: true,
    realTimeData: true,
    premarketData: true,
    extendedHours: true,
    twoFactor: false,
    apiAccess: false,
    dataExport: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <DashboardSkeleton />;

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const themesList: { key: ThemeMode; name: string; description: string; colors: string[] }[] = [
    { key: 'dark', name: 'Premium Dark', description: 'Deep tech space gray theme', colors: ['#0a0e17', '#111827', '#3b82f6'] },
    { key: 'light', name: 'Premium Light', description: 'Clean daylight white theme', colors: ['#f8fafc', '#ffffff', '#3b82f6'] },
    { key: 'cyberpunk', name: 'Cyberpunk Neon', description: 'High contrast rose/magenta theme', colors: ['#050508', '#0d0e15', '#f43f5e'] },
    { key: 'bloomberg', name: 'Bloomberg Terminal', description: 'Classic financial terminal theme', colors: ['#000000', '#080808', '#ff9900'] },
  ];

  const languagesList: { key: LanguageCode; name: string }[] = [
    { key: 'en', name: 'English (US)' },
    { key: 'hi', name: 'हिन्दी (Hindi)' },
    { key: 'es', name: 'Español (Spanish)' },
    { key: 'de', name: 'Deutsch (German)' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-1">Settings & Configurations</h1>
        <p className="text-sm text-slate-500">Manage your system themes, language overrides, and notifications</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/10">
            <User className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-white">Profile</h3>
        </div>
        <div className="divide-y divide-white/[0.04] px-5">
          <div className="flex items-center justify-between py-4">
            <span className="text-sm text-slate-300">Display Name</span>
            <span className="text-sm text-slate-500 font-mono">Analytics Pro</span>
          </div>
          <div className="flex items-center justify-between py-4">
            <span className="text-sm text-slate-300">Email</span>
            <span className="text-sm text-slate-500 font-mono">trader@analyticspro.com</span>
          </div>
        </div>
      </motion.div>

      {/* Multi-Theme Selector Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500/10">
            <Palette className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-sm font-semibold text-white">Multi-Theme support</h3>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {themesList.map((t) => {
            const isSelected = theme === t.key;
            return (
              <div
                key={t.key}
                onClick={() => setTheme(t.key)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected ? 'bg-blue-500/[0.03] border-blue-500/40 shadow-lg' : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-white mb-0.5">{t.name}</div>
                  <p className="text-[10px] text-slate-500 mb-4">{t.description}</p>
                </div>
                <div className="flex gap-1.5 mt-auto">
                  {t.colors.map((c, idx) => (
                    <div key={idx} className="w-5 h-5 rounded-full border border-white/10 shadow-sm" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Multi-Language Selector Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-cyan-500/10">
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="text-sm font-semibold text-white">Multi-Language Support</h3>
        </div>
        <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {languagesList.map((l) => {
            const isSelected = language === l.key;
            return (
              <button
                key={l.key}
                onClick={() => setLanguage(l.key)}
                className={`p-3 rounded-lg border text-center transition-all ${
                  isSelected
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 font-bold'
                    : 'bg-white/[0.02] text-slate-400 border-white/[0.06] hover:border-white/10 hover:text-slate-300'
                } text-xs`}
              >
                {l.name}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Notifications Configuration */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/10">
            <Bell className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-sm font-semibold text-white">Notifications</h3>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {[
            { label: 'Push Notifications', key: 'notifications' as const },
            { label: 'Email Alerts', key: 'emailAlerts' as const },
            { label: 'Sound Effects', key: 'soundEffects' as const },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
              <span className="text-sm text-slate-300">{item.label}</span>
              <Toggle enabled={settings[item.key]} onToggle={() => toggleSetting(item.key)} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security & Data Configurations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10">
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold text-white">Security & API</h3>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {[
            { label: 'Two-Factor Authentication', key: 'twoFactor' as const },
            { label: 'Developer API Access Key', key: 'apiAccess' as const },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
              <span className="text-sm text-slate-300">{item.label}</span>
              <Toggle enabled={settings[item.key]} onToggle={() => toggleSetting(item.key)} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* System Data configurations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-pink-500/10">
            <Database className="w-4 h-4 text-pink-400" />
          </div>
          <h3 className="text-sm font-semibold text-white">System Logs</h3>
        </div>
        <div className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
          <span className="text-sm text-slate-300">Detailed Telemetry Diagnostics</span>
          <Toggle enabled={settings.dataExport} onToggle={() => toggleSetting('dataExport')} />
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
