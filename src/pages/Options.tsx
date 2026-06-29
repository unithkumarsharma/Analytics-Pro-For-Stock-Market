import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Binary, TrendingUp, BarChart3, Activity } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import { optionsChain } from '../data/mockData';
import { formatNumber } from '../utils/formatters';

// IV smile data
const ivSmileData = optionsChain.map((o) => ({
  strike: o.strike,
  callIV: o.callIV,
  putIV: o.putIV,
}));

const Options: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [chainType, setChainType] = useState<'all' | 'calls' | 'puts'>('all');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <DashboardSkeleton />;

  const totalCallOI = optionsChain.reduce((s, o) => s + o.callOI, 0);
  const totalPutOI = optionsChain.reduce((s, o) => s + o.putOI, 0);
  const pcRatio = totalPutOI / totalCallOI;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-1">Options Analytics</h1>
        <p className="text-sm text-slate-500">AAPL options chain analysis and Greeks</p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Put/Call Ratio', value: pcRatio.toFixed(3), color: '#3b82f6', icon: Binary },
          { label: 'Max Pain', value: '$235.00', color: '#f59e0b', icon: Activity },
          { label: 'Avg Call IV', value: '26.2%', color: '#10b981', icon: TrendingUp },
          { label: 'Avg Put IV', value: '29.4%', color: '#ef4444', icon: BarChart3 },
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${metric.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: metric.color }} />
                </div>
                <span className="text-xs text-slate-400 uppercase tracking-wide">{metric.label}</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">{metric.value}</div>
            </motion.div>
          );
        })}
      </div>

      {/* IV Smile Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Implied Volatility Smile</h3>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ivSmileData}>
              <defs>
                <linearGradient id="callIVGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="putIVGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="strike"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickFormatter={(v) => `$${v}`}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickFormatter={(v) => `${v}%`}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a2035',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#f1f5f9',
                }}
              />
              <Area type="monotone" dataKey="callIV" stroke="#3b82f6" strokeWidth={2} fill="url(#callIVGrad)" name="Call IV" />
              <Area type="monotone" dataKey="putIV" stroke="#ef4444" strokeWidth={2} fill="url(#putIVGrad)" name="Put IV" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 rounded bg-blue-500" />
            <span className="text-xs text-slate-400">Call IV</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 rounded bg-red-500" />
            <span className="text-xs text-slate-400">Put IV</span>
          </div>
        </div>
      </motion.div>

      {/* Options Chain Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card overflow-hidden"
      >
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Options Chain — AAPL Jun 28 Expiry</h3>
          <div className="flex gap-1 bg-white/[0.04] rounded-lg p-0.5">
            {(['all', 'calls', 'puts'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setChainType(type)}
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                  chainType === type ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {chainType !== 'puts' && (
                  <>
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-blue-400/70 uppercase tracking-wider">Bid</th>
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-blue-400/70 uppercase tracking-wider">Ask</th>
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-blue-400/70 uppercase tracking-wider">Vol</th>
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-blue-400/70 uppercase tracking-wider">OI</th>
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-blue-400/70 uppercase tracking-wider">IV</th>
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-blue-400/70 uppercase tracking-wider">Δ</th>
                  </>
                )}
                <th className="text-center px-3 py-2 text-[10px] font-semibold text-white uppercase tracking-wider bg-white/[0.03]">Strike</th>
                {chainType !== 'calls' && (
                  <>
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-red-400/70 uppercase tracking-wider">Bid</th>
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-red-400/70 uppercase tracking-wider">Ask</th>
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-red-400/70 uppercase tracking-wider">Vol</th>
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-red-400/70 uppercase tracking-wider">OI</th>
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-red-400/70 uppercase tracking-wider">IV</th>
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-red-400/70 uppercase tracking-wider">Δ</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {optionsChain.map((row, i) => {
                const isATM = row.strike === 235;
                return (
                  <tr
                    key={row.strike}
                    className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer ${
                      isATM ? 'bg-blue-500/[0.03]' : ''
                    }`}
                  >
                    {chainType !== 'puts' && (
                      <>
                        <td className="px-3 py-2.5 text-xs font-mono text-blue-300">{row.callBid.toFixed(2)}</td>
                        <td className="px-3 py-2.5 text-xs font-mono text-blue-300">{row.callAsk.toFixed(2)}</td>
                        <td className="px-3 py-2.5 text-xs font-mono text-slate-400">{(row.callVolume / 1000).toFixed(1)}K</td>
                        <td className="px-3 py-2.5 text-xs font-mono text-slate-400">{(row.callOI / 1000).toFixed(1)}K</td>
                        <td className="px-3 py-2.5 text-xs font-mono text-slate-400">{row.callIV.toFixed(1)}%</td>
                        <td className="px-3 py-2.5 text-xs font-mono text-emerald-400">{row.callDelta.toFixed(2)}</td>
                      </>
                    )}
                    <td className={`px-3 py-2.5 text-xs font-mono font-bold text-center ${isATM ? 'text-blue-400' : 'text-white'} bg-white/[0.03]`}>
                      ${row.strike}
                      {isATM && <span className="ml-1 text-[9px] text-blue-400">ATM</span>}
                    </td>
                    {chainType !== 'calls' && (
                      <>
                        <td className="px-3 py-2.5 text-xs font-mono text-red-300">{row.putBid.toFixed(2)}</td>
                        <td className="px-3 py-2.5 text-xs font-mono text-red-300">{row.putAsk.toFixed(2)}</td>
                        <td className="px-3 py-2.5 text-xs font-mono text-slate-400">{(row.putVolume / 1000).toFixed(1)}K</td>
                        <td className="px-3 py-2.5 text-xs font-mono text-slate-400">{(row.putOI / 1000).toFixed(1)}K</td>
                        <td className="px-3 py-2.5 text-xs font-mono text-slate-400">{row.putIV.toFixed(1)}%</td>
                        <td className="px-3 py-2.5 text-xs font-mono text-red-400">{row.putDelta.toFixed(2)}</td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Options;
