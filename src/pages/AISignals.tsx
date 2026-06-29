import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Zap,
  Target,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import { aiSignals } from '../data/mockData';

const typeConfig = {
  BUY: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    icon: ArrowUpRight,
    glow: '0 0 20px rgba(16,185,129,0.1)',
  },
  SELL: {
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    icon: ArrowDownRight,
    glow: '0 0 20px rgba(239,68,68,0.1)',
  },
  HOLD: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    icon: Minus,
    glow: '0 0 20px rgba(245,158,11,0.1)',
  },
};

const AISignals: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'BUY' | 'SELL' | 'HOLD'>('ALL');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <DashboardSkeleton />;

  const filtered = filter === 'ALL' ? aiSignals : aiSignals.filter((s) => s.type === filter);
  const buyCount = aiSignals.filter((s) => s.type === 'BUY').length;
  const sellCount = aiSignals.filter((s) => s.type === 'SELL').length;
  const avgConfidence = Math.round(aiSignals.reduce((s, a) => s + a.confidence, 0) / aiSignals.length);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-1">AI Signals</h1>
        <p className="text-sm text-slate-500">ML-powered trading signals with confidence scores</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Signals', value: aiSignals.length.toString(), icon: Brain, color: '#3b82f6' },
          { label: 'Buy Signals', value: buyCount.toString(), icon: ArrowUpRight, color: '#10b981' },
          { label: 'Sell Signals', value: sellCount.toString(), icon: ArrowDownRight, color: '#ef4444' },
          { label: 'Avg Confidence', value: `${avgConfidence}%`, icon: Target, color: '#8b5cf6' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <span className="text-xs text-slate-400 uppercase tracking-wide">{card.label}</span>
              </div>
              <div className="text-2xl font-bold text-white">{card.value}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['ALL', 'BUY', 'SELL', 'HOLD'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              filter === f
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-white/[0.04] text-slate-400 border border-transparent hover:bg-white/[0.06]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Signal Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((signal, i) => {
          const config = typeConfig[signal.type];
          const TypeIcon = config.icon;

          return (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`glass-card p-5 border ${config.bg} hover:shadow-lg transition-all cursor-pointer`}
              style={{ boxShadow: config.glow }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{signal.symbol.slice(0, 2)}</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{signal.symbol}</div>
                    <div className="text-[10px] text-slate-500">{signal.strategy}</div>
                  </div>
                </div>
                <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold ${config.bg} ${config.color}`}>
                  <TypeIcon className="w-3.5 h-3.5" />
                  {signal.type}
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Confidence</span>
                  <span className={`text-sm font-bold font-mono ${config.color}`}>{signal.confidence}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${signal.confidence}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full rounded-full ${
                      signal.type === 'BUY' ? 'bg-emerald-500' : signal.type === 'SELL' ? 'bg-red-500' : 'bg-amber-500'
                    }`}
                  />
                </div>
              </div>

              {/* Trade Details */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="p-2 rounded-lg bg-white/[0.03]">
                  <div className="text-[9px] text-slate-500 mb-0.5">Entry</div>
                  <div className="text-xs font-mono font-semibold text-white">${signal.entry.toFixed(2)}</div>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.03]">
                  <div className="text-[9px] text-slate-500 mb-0.5">Target</div>
                  <div className="text-xs font-mono font-semibold text-emerald-400">${signal.target.toFixed(2)}</div>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.03]">
                  <div className="text-[9px] text-slate-500 mb-0.5">Stop Loss</div>
                  <div className="text-xs font-mono font-semibold text-red-400">${signal.stopLoss.toFixed(2)}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" /> R/R {signal.riskReward}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {signal.timeframe}
                  </span>
                </div>
                <span>{signal.timestamp}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AISignals;
