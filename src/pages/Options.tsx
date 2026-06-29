import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Binary,
  TrendingUp,
  BarChart3,
  Activity,
  Award,
  SlidersHorizontal,
  Info,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  ReferenceLine,
  LineChart,
  Line,
} from 'recharts';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import { optionsChain } from '../data/mockData';
import {
  getEnrichedOptionChain,
  calculateMaxPain,
  calculateSupportResistance,
} from '../utils/optionsAnalytics';

// Custom Tooltip component for Option Chain charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-white/10 shadow-2xl text-xs space-y-1.5">
        <p className="font-bold text-slate-300 font-mono">Strike: ${label}</p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex justify-between items-center gap-4">
            <span className="text-slate-400 font-medium" style={{ color: item.color }}>
              {item.name}:
            </span>
            <span className="font-bold text-white font-mono">
              {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Options: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [chainType, setChainType] = useState<'all' | 'calls' | 'puts'>('all');
  const [activeChartTab, setActiveChartTab] = useState<'oi' | 'changeOI' | 'ivSmile' | 'greeks'>('oi');
  const [selectedStrikeFilter, setSelectedStrikeFilter] = useState<'all' | 'itm' | 'otm' | 'nearAtm'>('all');

  // Enriched option chain with Greeks and Change in OI
  const enrichedChain = useMemo(() => getEnrichedOptionChain(optionsChain), []);

  const totalCallOI = useMemo(() => enrichedChain.reduce((s, o) => s + o.callOI, 0), [enrichedChain]);
  const totalPutOI = useMemo(() => enrichedChain.reduce((s, o) => s + o.putOI, 0), [enrichedChain]);
  const pcRatio = useMemo(() => totalPutOI / totalCallOI, [totalPutOI, totalCallOI]);
  const maxPain = useMemo(() => calculateMaxPain(enrichedChain), [enrichedChain]);
  const supportResistance = useMemo(() => calculateSupportResistance(enrichedChain), [enrichedChain]);

  // Derived averages for metrics
  const avgCallIV = useMemo(() => {
    const sum = enrichedChain.reduce((s, o) => s + o.callIV, 0);
    return enrichedChain.length ? sum / enrichedChain.length : 0;
  }, [enrichedChain]);

  const avgPutIV = useMemo(() => {
    const sum = enrichedChain.reduce((s, o) => s + o.putIV, 0);
    return enrichedChain.length ? sum / enrichedChain.length : 0;
  }, [enrichedChain]);

  // Filter chain based on type (calls/puts) and moneyness
  const filteredChain = useMemo(() => {
    const underlying = 234.82;
    return enrichedChain.filter((item) => {
      if (selectedStrikeFilter === 'all') return true;
      if (selectedStrikeFilter === 'nearAtm') {
        return Math.abs(item.strike - underlying) <= 8;
      }
      if (selectedStrikeFilter === 'itm') {
        // Calls are ITM if strike < underlying, Puts are ITM if strike > underlying
        return item.strike < underlying || item.strike > underlying;
      }
      if (selectedStrikeFilter === 'otm') {
        // Calls are OTM if strike > underlying, Puts are OTM if strike < underlying
        return item.strike > underlying || item.strike < underlying;
      }
      return true;
    });
  }, [enrichedChain, selectedStrikeFilter]);

  // Support / Resistance info
  const supports = useMemo(() => supportResistance.filter(l => l.type === 'support'), [supportResistance]);
  const resistances = useMemo(() => supportResistance.filter(l => l.type === 'resistance'), [supportResistance]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Options Analytics</h1>
          <p className="text-sm text-slate-500">Derivative market sentiments, open interest, and volatility profiles</p>
        </div>
        <div className="flex gap-2">
          {/* Strike Filter Selector */}
          <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg p-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wide font-bold px-2">Strikes</span>
            {(['all', 'nearAtm', 'itm', 'otm'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedStrikeFilter(filter)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                  selectedStrikeFilter === filter
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-500 hover:text-slate-300 border border-transparent'
                }`}
              >
                {filter === 'nearAtm' ? 'Near ATM' : filter.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Options Key Dashboard Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Put/Call Ratio (PCR)',
            value: pcRatio.toFixed(3),
            subtitle: pcRatio > 1 ? 'Bullish / Put Heavy' : 'Bearish / Call Heavy',
            color: pcRatio > 1 ? '#10b981' : '#f59e0b',
            icon: Binary,
          },
          {
            label: 'Max Pain Strike',
            value: `$${maxPain.toFixed(2)}`,
            subtitle: 'Minimum option payoff point',
            color: '#3b82f6',
            icon: Award,
          },
          {
            label: 'Implied Volatility (Call/Put)',
            value: `${avgCallIV.toFixed(1)}% / ${avgPutIV.toFixed(1)}%`,
            subtitle: 'Average option IV profile',
            color: '#a855f7',
            icon: Activity,
          },
          {
            label: 'Total Open Interest',
            value: `${((totalCallOI + totalPutOI) / 1000).toFixed(1)}k contracts`,
            subtitle: `Call: ${(totalCallOI / 1000).toFixed(1)}k | Put: ${(totalPutOI / 1000).toFixed(1)}k`,
            color: '#06b6d4',
            icon: BarChart3,
          },
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-4 hover:border-white/10 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${metric.color}15` }}>
                    <Icon className="w-4 h-4" style={{ color: metric.color }} />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{metric.label}</span>
                </div>
                <div className="text-lg font-bold font-mono text-white mb-1">{metric.value}</div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <Info className="w-3 h-3 text-slate-500" />
                {metric.subtitle}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Support & Resistance Levels and Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Support Levels */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-md bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Major Support Levels (Put OI)</h3>
          </div>
          <div className="space-y-2">
            {supports.map((s, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 rounded bg-emerald-500/[0.02] border border-emerald-500/10">
                <span className="text-xs font-mono font-bold text-emerald-400">${s.price.toFixed(2)}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500">{(s.oi / 1000).toFixed(0)}k contracts</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">{s.strength}% Str</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Resistance Levels */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-md bg-red-500/10 flex items-center justify-center">
              <TrendingDown className="w-3 h-3 text-red-400" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Major Resistance Levels (Call OI)</h3>
          </div>
          <div className="space-y-2">
            {resistances.map((r, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 rounded bg-red-500/[0.02] border border-red-500/10">
                <span className="text-xs font-mono font-bold text-red-400">${r.price.toFixed(2)}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500">{(r.oi / 1000).toFixed(0)}k contracts</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-mono">{r.strength}% Str</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Market Outlook derived from Options Chain */}
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Options Sentiment Outlook</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Options distribution indicates robust support at <span className="font-bold text-emerald-400">${supports[0]?.price}</span> (Put OI Peak) and resistance near <span className="font-bold text-red-400">${resistances[0]?.price}</span> (Call OI Peak).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Suggested Bias:</span>
            <span className={`font-bold px-2 py-0.5 rounded font-mono ${pcRatio > 1.1 ? 'bg-emerald-500/10 text-emerald-400' : pcRatio < 0.9 ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
              {pcRatio > 1.1 ? 'BULLISH SPREAD' : pcRatio < 0.9 ? 'BEARISH ACCUMULATION' : 'NEUTRAL RANGE'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Interactive Charts Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 border-b border-white/[0.06] pb-3">
          <div className="flex gap-2">
            {[
              { id: 'oi', label: 'Open Interest (OI)', icon: BarChart3 },
              { id: 'changeOI', label: 'Change in OI', icon: Activity },
              { id: 'ivSmile', label: 'IV Smile', icon: TrendingUp },
              { id: 'greeks', label: 'Greeks Profile', icon: SlidersHorizontal },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveChartTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeChartTab === tab.id
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartTab === 'oi' ? (
              <BarChart data={filteredChain}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="strike" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `$${v}`} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} orientation="right" width={40} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <ReferenceLine x={235} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" label={{ value: 'ATM ($235)', fill: '#94a3b8', fontSize: 10, position: 'top' }} />
                <Bar dataKey="callOI" fill="#3b82f6" name="Call Open Interest" radius={[3, 3, 0, 0]} isAnimationActive={false} />
                <Bar dataKey="putOI" fill="#ef4444" name="Put Open Interest" radius={[3, 3, 0, 0]} isAnimationActive={false} />
              </BarChart>
            ) : activeChartTab === 'changeOI' ? (
              <BarChart data={filteredChain}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="strike" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `$${v}`} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} orientation="right" width={40} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <ReferenceLine x={235} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" label={{ value: 'ATM ($235)', fill: '#94a3b8', fontSize: 10, position: 'top' }} />
                <Bar dataKey="callChangeOI" fill="#60a5fa" name="Call OI Change" radius={[3, 3, 0, 0]} isAnimationActive={false} />
                <Bar dataKey="putChangeOI" fill="#f87171" name="Put OI Change" radius={[3, 3, 0, 0]} isAnimationActive={false} />
              </BarChart>
            ) : activeChartTab === 'ivSmile' ? (
              <LineChart data={filteredChain}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="strike" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `$${v}`} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `${v}%`} orientation="right" width={40} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <ReferenceLine x={235} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" label={{ value: 'ATM ($235)', fill: '#94a3b8', fontSize: 10, position: 'top' }} />
                <Line type="monotone" dataKey="callIV" stroke="#3b82f6" name="Call Implied Volatility" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} isAnimationActive={false} />
                <Line type="monotone" dataKey="putIV" stroke="#ef4444" name="Put Implied Volatility" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} isAnimationActive={false} />
              </LineChart>
            ) : (
              <LineChart data={filteredChain}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="strike" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `$${v}`} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} orientation="right" width={40} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <ReferenceLine x={235} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="callGreeks.delta" stroke="#3b82f6" name="Call Delta (Δ)" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="putGreeks.delta" stroke="#ef4444" name="Put Delta (Δ)" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="callGreeks.gamma" stroke="#10b981" name="Gamma (Γ)" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="callGreeks.vega" stroke="#eab308" name="Vega (ν)" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Options Chain Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">AAPL Option Chain</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Spot Price: $234.82 | Weekly 28-Jun Expiry</p>
          </div>
          <div className="flex gap-1 bg-white/[0.04] rounded-lg p-0.5 self-start">
            {(['all', 'calls', 'puts'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setChainType(type)}
                className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                  chainType === type ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.01]">
                {chainType !== 'puts' && (
                  <>
                    <th colSpan={6} className="px-3 py-1 text-[9px] font-bold text-blue-400 uppercase tracking-widest border-r border-white/[0.04]">Calls</th>
                  </>
                )}
                <th className="px-3 py-1 text-[9px] font-bold text-white uppercase tracking-widest bg-white/[0.03]">Index</th>
                {chainType !== 'calls' && (
                  <>
                    <th colSpan={6} className="px-3 py-1 text-[9px] font-bold text-red-400 uppercase tracking-widest border-l border-white/[0.04]">Puts</th>
                  </>
                )}
              </tr>
              <tr className="border-b border-white/[0.06] text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                {chainType !== 'puts' && (
                  <>
                    <th className="px-2 py-2">Delta</th>
                    <th className="px-2 py-2">IV</th>
                    <th className="px-2 py-2">OI</th>
                    <th className="px-2 py-2">OI Chg</th>
                    <th className="px-2 py-2">Volume</th>
                    <th className="px-2 py-2 border-r border-white/[0.04]">Bid/Ask</th>
                  </>
                )}
                <th className="px-3 py-2 bg-white/[0.03] text-white">Strike</th>
                {chainType !== 'calls' && (
                  <>
                    <th className="px-2 py-2 border-l border-white/[0.04]">Bid/Ask</th>
                    <th className="px-2 py-2">Volume</th>
                    <th className="px-2 py-2">OI Chg</th>
                    <th className="px-2 py-2">OI</th>
                    <th className="px-2 py-2">IV</th>
                    <th className="px-2 py-2">Delta</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredChain.map((row) => {
                const isATM = row.strike === 235;
                const isCallITM = row.strike < 234.82;
                const isPutITM = row.strike > 234.82;

                return (
                  <tr
                    key={row.strike}
                    className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${
                      isATM ? 'bg-blue-500/[0.03]' : ''
                    }`}
                  >
                    {/* Call Side */}
                    {chainType !== 'puts' && (
                      <>
                        <td className="px-2 py-2 text-xs font-mono text-slate-400">{row.callGreeks.delta.toFixed(2)}</td>
                        <td className="px-2 py-2 text-xs font-mono text-slate-400">{row.callIV.toFixed(1)}%</td>
                        <td className="px-2 py-2 text-xs font-mono text-slate-300">{(row.callOI / 1000).toFixed(1)}k</td>
                        <td className={`px-2 py-2 text-xs font-mono font-bold ${row.callChangeOI >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {row.callChangeOI >= 0 ? '+' : ''}{(row.callChangeOI / 1000).toFixed(1)}k
                        </td>
                        <td className="px-2 py-2 text-xs font-mono text-slate-300">{(row.callVolume / 1000).toFixed(1)}k</td>
                        <td className={`px-2 py-2 text-xs font-mono font-semibold border-r border-white/[0.04] ${isCallITM ? 'bg-blue-500/[0.02] text-blue-300' : 'text-slate-300'}`}>
                          {row.callBid.toFixed(2)} / {row.callAsk.toFixed(2)}
                        </td>
                      </>
                    )}

                    {/* Strike */}
                    <td className={`px-3 py-2 text-xs font-mono font-bold ${isATM ? 'text-blue-400' : 'text-white'} bg-white/[0.03]`}>
                      ${row.strike}
                      {isATM && <span className="ml-1 text-[8px] px-1 rounded bg-blue-500/20 text-blue-400 font-bold uppercase">ATM</span>}
                    </td>

                    {/* Put Side */}
                    {chainType !== 'calls' && (
                      <>
                        <td className={`px-2 py-2 text-xs font-mono font-semibold border-l border-white/[0.04] ${isPutITM ? 'bg-red-500/[0.02] text-red-300' : 'text-slate-300'}`}>
                          {row.putBid.toFixed(2)} / {row.putAsk.toFixed(2)}
                        </td>
                        <td className="px-2 py-2 text-xs font-mono text-slate-300">{(row.putVolume / 1000).toFixed(1)}k</td>
                        <td className={`px-2 py-2 text-xs font-mono font-bold ${row.putChangeOI >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {row.putChangeOI >= 0 ? '+' : ''}{(row.putChangeOI / 1000).toFixed(1)}k
                        </td>
                        <td className="px-2 py-2 text-xs font-mono text-slate-300">{(row.putOI / 1000).toFixed(1)}k</td>
                        <td className="px-2 py-2 text-xs font-mono text-slate-400">{row.putIV.toFixed(1)}%</td>
                        <td className="px-2 py-2 text-xs font-mono text-slate-400">{row.putGreeks.delta.toFixed(2)}</td>
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
