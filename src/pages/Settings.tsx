import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Monitor,
  Globe,
  Database,
  Download,
  Moon,
  Sun,
  ChevronRight,
  Check,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { DashboardSkeleton } from '../components/ui/Skeleton';

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
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    soundEffects: false,
    darkMode: true,
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

  const sections = [
    {
      title: 'Profile',
      icon: User,
      color: '#3b82f6',
      items: [
        { label: 'Display Name', value: 'Analytics Pro', type: 'text' as const },
        { label: 'Email', value: 'trader@analyticspro.com', type: 'text' as const },
        { label: 'Timezone', value: 'Eastern (ET)', type: 'text' as const },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      color: '#f59e0b',
      items: [
        { label: 'Push Notifications', key: 'notifications' as const, type: 'toggle' as const },
        { label: 'Email Alerts', key: 'emailAlerts' as const, type: 'toggle' as const },
        { label: 'Sound Effects', key: 'soundEffects' as const, type: 'toggle' as const },
      ],
    },
    {
      title: 'Appearance',
      icon: Palette,
      color: '#8b5cf6',
      items: [
        { label: 'Dark Mode', key: 'darkMode' as const, type: 'toggle' as const },
        { label: 'Compact View', key: 'compactView' as const, type: 'toggle' as const },
        { label: 'Animations', key: 'animations' as const, type: 'toggle' as const },
      ],
    },
    {
      title: 'Market Data',
      icon: Globe,
      color: '#06b6d4',
      items: [
        { label: 'Real-Time Data', key: 'realTimeData' as const, type: 'toggle' as const },
        { label: 'Pre-market Data', key: 'premarketData' as const, type: 'toggle' as const },
        { label: 'Extended Hours', key: 'extendedHours' as const, type: 'toggle' as const },
      ],
    },
    {
      title: 'Security',
      icon: Shield,
      color: '#10b981',
      items: [
        { label: 'Two-Factor Auth', key: 'twoFactor' as const, type: 'toggle' as const },
        { label: 'API Access', key: 'apiAccess' as const, type: 'toggle' as const },
      ],
    },
    {
      title: 'Data',
      icon: Database,
      color: '#ec4899',
      items: [
        { label: 'Data Export', key: 'dataExport' as const, type: 'toggle' as const },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-sm text-slate-500">Manage your preferences and account</p>
      </motion.div>

      {sections.map((section, si) => {
        const Icon = section.icon;
        return (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.08 }}
            className="glass-card overflow-hidden"
          >
            <div className="p-4 border-b border-white/[0.06] flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${section.color}15` }}
              >
                <Icon className="w-4 h-4" style={{ color: section.color }} />
              </div>
              <h3 className="text-sm font-semibold text-white">{section.title}</h3>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm text-slate-300">{item.label}</span>
                  {item.type === 'toggle' && 'key' in item ? (
                    <Toggle
                      enabled={settings[item.key]}
                      onToggle={() => toggleSetting(item.key)}
                    />
                  ) : (
                    <span className="text-sm text-slate-500 font-mono">
                      {'value' in item ? item.value : ''}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card overflow-hidden border border-red-500/10"
      >
        <div className="p-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-red-400">Danger Zone</h3>
        </div>
        <div className="p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-300">Delete Account</p>
            <p className="text-xs text-slate-500 mt-0.5">Permanently delete your account and all data</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors text-xs font-semibold">
            Delete Account
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
