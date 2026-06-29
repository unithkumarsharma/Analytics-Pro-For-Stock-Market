import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  BarChart3,
  Target,
  Shield,
  Zap,
  Download,
  FileText,
  ChevronDown,
  ChevronUp,
  PieChart as PieIcon,
  Calendar,
  AlertTriangle,
  Award,
  Layers,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import { portfolioHoldings } from '../data/mockData';
import { formatNumber, formatPercent, getChangeColor } from '../utils/formatters';
import {
  calculateCAGR,
  calculateSharpeRatio,
  calculateDrawdown,
  getMaxDrawdown,
  calculateWinRate,
  calculateRiskScore,
  generateEquityCurve,
  generateDailyPnL,
  calculateMonthlyReturns,
  generateHoldingsCSV,
  downloadCSV,
  generatePortfolioReport,
} from '../utils/portfolioAnalytics';

// ===== Constants =====
const SECTOR_COLORS: Record<string, string> = {
  Technology: '#3b82f6',
  Finance: '#8b5cf6',
  Auto: '#06b6d4',
  Healthcare: '#10b981',
  Consumer: '#f59e0b',
  Energy: '#ef4444',
  Infra: '#ec4899',
  Other: '#64748b',
};

const HOLDING_COLORS = [
  '#3b82f6', '#10b981', '#8b5cf6', '#06b6d4',
  '#f59e0b', '#ec4899', '#ef4444', '#6366f1',
];

// ===== Sub-Components =====
const StatCard: React.FC<{
  label: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  delay?: number;
  trend?: 'up' | 'down' | 'neutral';
}> = ({ label, value, subtitle, icon: Icon, color, delay = 0, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-4 group hover:border-white/10 transition-all"
  >
    <div className="flex items-center gap-2 mb-2.5">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>
      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
        {label}
      </span>
    </div>
    <div className="text-lg font-bold text-white font-mono">{value}</div>
    {subtitle && (
      <div className={`text-[10px] font-mono mt-0.5 flex items-center gap-1 ${
        trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-500'
      }`}>
        {trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
        {trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
        {subtitle}
      </div>
    )}
  </motion.div>
);

const RiskGauge: React.FC<{ score: number; label: string; color: string }> = ({
  score,
  label,
  color,
}) => (
  <div className="flex flex-col items-center">
    <div className="relative w-32 h-16 mb-2">
      <svg width="128" height="68" viewBox="0 0 128 68">
        {/* Background arc */}
        <path
          d="M 10 64 A 54 54 0 0 1 118 64"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Colored arc */}
        <motion.path
          d="M 10 64 A 54 54 0 0 1 118 64"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: score / 100 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <text x="64" y="58" textAnchor="middle" fill={color} fontSize="20" fontWeight="800" fontFamily="monospace">
          {score}
        </text>
      </svg>
    </div>
    <span className="text-xs font-bold" style={{ color }}>
      {label} Risk
    </span>
  </div>
);

// ===== Main Component =====
const Portfolio: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'holdings' | 'analytics'>('overview');
  const [sortField, setSortField] = useState<string>('allocation');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [pnlPeriod, setPnlPeriod] = useState<'1M' | '3M' | '6M' | '1Y'>('3M');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // ===== Compute Portfolio Metrics =====
  const totalValue = useMemo(
    () => portfolioHoldings.reduce((s, h) => s + h.totalValue, 0),
    []
  );
  const totalInvested = useMemo(
    () => portfolioHoldings.reduce((s, h) => s + h.avgCost * h.shares, 0),
    []
  );
  const totalGain = useMemo(
    () => portfolioHoldings.reduce((s, h) => s + h.totalGain, 0),
    []
  );
  const dayChange = useMemo(
    () => portfolioHoldings.reduce((s, h) => s + h.dayChange, 0),
    []
  );

  // Equity curve
  const pnlDays = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365 }[pnlPeriod];
  const equityCurve = useMemo(
    () => generateEquityCurve(365, totalInvested, 0.0006, 0.013),
    [totalInvested]
  );
  const dailyPnL = useMemo(() => generateDailyPnL(pnlDays), [pnlDays]);
  const dailyReturns = useMemo(
    () => equityCurve.map((d) => d.dailyReturn / 100),
    [equityCurve]
  );

  // Key analytics
  const cagr = useMemo(
    () => calculateCAGR(totalInvested, totalValue, 1.5),
    [totalInvested, totalValue]
  );
  const sharpeRatio = useMemo(
    () => calculateSharpeRatio(dailyReturns),
    [dailyReturns]
  );
  const drawdownData = useMemo(
    () => calculateDrawdown(equityCurve),
    [equityCurve]
  );
  const maxDrawdown = useMemo(
    () => getMaxDrawdown(drawdownData),
    [drawdownData]
  );
  const winRate = useMemo(
    () => calculateWinRate(dailyReturns),
    [dailyReturns]
  );
  const volatility = useMemo(() => {
    const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
    const variance = dailyReturns.reduce((s, r) => s + (r - mean) ** 2, 0) / dailyReturns.length;
    return Math.sqrt(variance) * Math.sqrt(252) * 100;
  }, [dailyReturns]);
  const riskScore = useMemo(
    () => calculateRiskScore(volatility, maxDrawdown, sharpeRatio),
    [volatility, maxDrawdown, sharpeRatio]
  );
  const monthlyReturns = useMemo(
    () => calculateMonthlyReturns(equityCurve),
    [equityCurve]
  );

  // Sector allocation
  const sectorAllocation = useMemo(() => {
    const sectors: Record<string, number> = {};
    portfolioHoldings.forEach((h) => {
      const sector = h.name.includes('NVIDIA') || h.name.includes('Apple') || h.name.includes('Microsoft') || h.name.includes('Alphabet') || h.name.includes('Meta')
        ? 'Technology'
        : h.name.includes('Amazon') || h.name.includes('Tesla')
        ? 'Consumer'
        : h.name.includes('JPMorgan') || h.name.includes('Visa')
        ? 'Finance'
        : 'Other';
      sectors[sector] = (sectors[sector] || 0) + h.allocation;
    });
    return Object.entries(sectors)
      .map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(1)),
        color: SECTOR_COLORS[name] || SECTOR_COLORS.Other,
      }))
      .sort((a, b) => b.value - a.value);
  }, []);

  // Holding allocation for pie
  const holdingAllocation = useMemo(
    () =>
      portfolioHoldings.map((h, i) => ({
        name: h.symbol,
        value: h.allocation,
        color: HOLDING_COLORS[i % HOLDING_COLORS.length],
      })),
    []
  );

  // Sorted holdings
  const sortedHoldings = useMemo(() => {
    const sorted = [...portfolioHoldings];
    sorted.sort((a, b) => {
      const aVal = (a as any)[sortField] ?? 0;
      const bVal = (b as any)[sortField] ?? 0;
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });
    return sorted;
  }, [sortField, sortDir]);

  // Download handlers
  const handleDownloadCSV = useCallback(() => {
    const csv = generateHoldingsCSV(portfolioHoldings);
    downloadCSV(csv, `analytics-pro-holdings-${new Date().toISOString().split('T')[0]}.csv`);
  }, []);

  const handleDownloadReport = useCallback(() => {
    const metrics: Record<string, string | number> = {
      'Portfolio Value': `₹${totalValue.toLocaleString('en-IN')}`,
      'Total Invested': `₹${totalInvested.toLocaleString('en-IN')}`,
      'Total P&L': `₹${totalGain.toLocaleString('en-IN')}`,
      'Total Return': `${((totalGain / totalInvested) * 100).toFixed(2)}%`,
      'CAGR': `${cagr.toFixed(2)}%`,
      'Sharpe Ratio': sharpeRatio.toFixed(2),
      'Win Rate': `${winRate.toFixed(1)}%`,
      'Max Drawdown': `${maxDrawdown.toFixed(2)}%`,
      'Annualized Volatility': `${volatility.toFixed(2)}%`,
      'Risk Score': `${riskScore.score}/100 (${riskScore.label})`,
      'Holdings Count': portfolioHoldings.length,
      "Today's Change": `₹${dayChange.toLocaleString('en-IN')}`,
    };
    const report = generatePortfolioReport(metrics);
    downloadCSV(report, `analytics-pro-report-${new Date().toISOString().split('T')[0]}.txt`);
  }, [totalValue, totalInvested, totalGain, cagr, sharpeRatio, winRate, maxDrawdown, volatility, riskScore, dayChange]);

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-5">
      {/* ===== Header ===== */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold text-white mb-0.5">Portfolio Analytics</h1>
          <p className="text-sm text-slate-500">
            Comprehensive portfolio performance & risk analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Tab switcher */}
          <div className="flex bg-white/[0.03] rounded-lg border border-white/[0.06] p-0.5">
            {(['overview', 'holdings', 'analytics'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Download buttons */}
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-white hover:border-white/10 transition-all text-xs font-medium"
          >
            <Download className="w-3 h-3" /> CSV
          </button>
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all text-xs font-medium"
          >
            <FileText className="w-3 h-3" /> Report
          </button>
        </div>
      </motion.div>

      {/* ===== Key Metrics Row ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          label="Portfolio Value"
          value={`₹${(totalValue / 100000).toFixed(1)}L`}
          subtitle={`₹${dayChange.toLocaleString('en-IN')} today`}
          icon={Briefcase}
          color="#3b82f6"
          delay={0.05}
          trend={dayChange >= 0 ? 'up' : 'down'}
        />
        <StatCard
          label="Total Return"
          value={formatPercent((totalGain / totalInvested) * 100)}
          subtitle={`₹${totalGain.toLocaleString('en-IN')}`}
          icon={TrendingUp}
          color="#10b981"
          delay={0.08}
          trend="up"
        />
        <StatCard
          label="CAGR"
          value={`${cagr.toFixed(1)}%`}
          subtitle="1.5 year annualized"
          icon={Zap}
          color="#8b5cf6"
          delay={0.11}
          trend={cagr > 12 ? 'up' : 'neutral'}
        />
        <StatCard
          label="Sharpe Ratio"
          value={sharpeRatio.toFixed(2)}
          subtitle={sharpeRatio > 1 ? 'Above benchmark' : 'Below optimal'}
          icon={Target}
          color="#06b6d4"
          delay={0.14}
          trend={sharpeRatio > 1 ? 'up' : 'down'}
        />
        <StatCard
          label="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          subtitle={`${Math.round(winRate * equityCurve.length / 100)}/${equityCurve.length} days`}
          icon={Award}
          color="#f59e0b"
          delay={0.17}
          trend={winRate > 50 ? 'up' : 'down'}
        />
        <StatCard
          label="Max Drawdown"
          value={`${maxDrawdown.toFixed(1)}%`}
          subtitle="Peak to trough"
          icon={AlertTriangle}
          color="#ef4444"
          delay={0.2}
          trend="down"
        />
      </div>

      {/* ===== Tab Content ===== */}
      <AnimatePresence mode="wait">
        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Equity Curve + Sector Allocation */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {/* Equity Curve */}
              <div className="xl:col-span-2 glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-semibold text-white">Portfolio Growth</h3>
                  </div>
                  <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-0.5">
                    {(['1M', '3M', '6M', '1Y'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPnlPeriod(p)}
                        className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                          pnlPeriod === p
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={equityCurve.slice(-pnlDays)}>
                    <defs>
                      <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 9, fill: '#475569' }}
                      tickFormatter={(d) => {
                        const date = new Date(d);
                        return `${date.getDate()} ${date.toLocaleString('en', { month: 'short' })}`;
                      }}
                      minTickGap={50}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 9, fill: '#475569' }}
                      tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                      orientation="right"
                      width={55}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.[0]) return null;
                        const d = payload[0].payload;
                        return (
                          <div className="glass-card p-3 border border-white/10 text-xs">
                            <div className="text-slate-500 mb-1">{d.date}</div>
                            <div className="font-bold text-white font-mono">₹{d.value.toLocaleString('en-IN')}</div>
                            <div className={`font-mono mt-1 ${d.dailyReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {d.dailyReturn >= 0 ? '+' : ''}{d.dailyReturn.toFixed(2)}% daily
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#eqGrad)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Sector Allocation */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <PieIcon className="w-4 h-4 text-violet-400" />
                  <h3 className="text-sm font-semibold text-white">Sector Allocation</h3>
                </div>
                <div className="flex justify-center mb-4">
                  <PieChart width={180} height={180}>
                    <Pie
                      data={sectorAllocation}
                      cx={90}
                      cy={90}
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {sectorAllocation.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </div>
                <div className="space-y-2">
                  {sectorAllocation.map((s) => (
                    <div key={s.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
                        <span className="text-xs text-slate-400">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${s.value}%`, backgroundColor: s.color }} />
                        </div>
                        <span className="text-xs font-mono text-slate-300 w-10 text-right">{s.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Risk Score */}
                <div className="mt-6 pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Risk Score</span>
                  </div>
                  <RiskGauge score={riskScore.score} label={riskScore.label} color={riskScore.color} />
                </div>
              </div>
            </div>

            {/* Daily PnL + Drawdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Daily PnL */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="glass-card p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-semibold text-white">Daily P&L</h3>
                  <span className="ml-auto text-[10px] text-slate-500 font-mono">{pnlPeriod}</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={dailyPnL.slice(-60)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 9, fill: '#475569' }}
                      tickFormatter={(d) => new Date(d).getDate().toString()}
                      minTickGap={20}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 9, fill: '#475569' }}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                      orientation="right"
                      width={40}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.[0]) return null;
                        const d = payload[0].payload;
                        return (
                          <div className="glass-card p-2 border border-white/10 text-xs">
                            <div className="text-slate-500">{d.date}</div>
                            <div className={`font-mono font-bold ${d.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {d.pnl >= 0 ? '+' : ''}₹{d.pnl.toLocaleString('en-IN')}
                            </div>
                          </div>
                        );
                      }}
                    />
                    <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
                    <Bar dataKey="pnl" radius={[2, 2, 0, 0]} isAnimationActive={false}>
                      {dailyPnL.slice(-60).map((d, i) => (
                        <Cell key={i} fill={d.pnl >= 0 ? '#10b98150' : '#ef444450'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Drawdown Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <h3 className="text-sm font-semibold text-white">Drawdown Analysis</h3>
                  <span className="ml-auto text-[10px] font-mono text-red-400">
                    Max: {maxDrawdown.toFixed(2)}%
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={drawdownData.slice(-pnlDays)}>
                    <defs>
                      <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0} />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0.25} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 9, fill: '#475569' }}
                      tickFormatter={(d) => {
                        const date = new Date(d);
                        return `${date.getDate()} ${date.toLocaleString('en', { month: 'short' })}`;
                      }}
                      minTickGap={50}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 9, fill: '#475569' }}
                      tickFormatter={(v) => `${v.toFixed(0)}%`}
                      orientation="right"
                      width={40}
                      domain={['dataMin', 0]}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.[0]) return null;
                        const d = payload[0].payload;
                        return (
                          <div className="glass-card p-2 border border-white/10 text-xs">
                            <div className="text-slate-500">{d.date}</div>
                            <div className="font-mono font-bold text-red-400">
                              {d.drawdown.toFixed(2)}%
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              Peak: ₹{d.peak.toLocaleString('en-IN')}
                            </div>
                          </div>
                        );
                      }}
                    />
                    <ReferenceLine y={0} stroke="rgba(255,255,255,0.06)" />
                    <Area
                      type="monotone"
                      dataKey="drawdown"
                      stroke="#ef4444"
                      strokeWidth={1.5}
                      fill="url(#ddGrad)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Monthly Returns Heatmap */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="glass-card p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Monthly Returns</h3>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
                {monthlyReturns.slice(-12).map((m) => {
                  const intensity = Math.min(Math.abs(m.return) / 5, 1);
                  const bg = m.return >= 0
                    ? `rgba(16,185,129,${intensity * 0.35})`
                    : `rgba(239,68,68,${intensity * 0.35})`;
                  const border = m.return >= 0
                    ? `rgba(16,185,129,${intensity * 0.2})`
                    : `rgba(239,68,68,${intensity * 0.2})`;
                  return (
                    <div
                      key={m.month}
                      className="p-3 rounded-lg border text-center hover:scale-105 transition-transform cursor-default"
                      style={{ backgroundColor: bg, borderColor: border }}
                    >
                      <div className="text-[9px] text-slate-500 mb-1">
                        {new Date(m.month + '-01').toLocaleString('en', { month: 'short', year: '2-digit' })}
                      </div>
                      <div className={`text-sm font-bold font-mono ${m.return >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {m.return >= 0 ? '+' : ''}{m.return.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ===== HOLDINGS TAB ===== */}
        {activeTab === 'holdings' && (
          <motion.div
            key="holdings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Holdings Pie + Top/Bottom */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="glass-card p-5 flex flex-col items-center">
                <h3 className="text-sm font-semibold text-white mb-4 self-start">Allocation</h3>
                <PieChart width={200} height={200}>
                  <Pie
                    data={holdingAllocation}
                    cx={100}
                    cy={100}
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {holdingAllocation.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 w-full">
                  {holdingAllocation.map((h) => (
                    <div key={h.name} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: h.color }} />
                      <span className="text-[10px] text-slate-400">{h.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 ml-auto">{h.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top performer */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Top Performers</h3>
                </div>
                <div className="space-y-2">
                  {[...portfolioHoldings]
                    .sort((a, b) => b.gainPercent - a.gainPercent)
                    .slice(0, 4)
                    .map((h, i) => (
                      <div key={h.symbol} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-600 font-mono w-3">{i + 1}</span>
                          <span className="text-xs font-semibold text-white">{h.symbol}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          +{h.gainPercent.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Bottom performer */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center">
                    <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Lagging Positions</h3>
                </div>
                <div className="space-y-2">
                  {[...portfolioHoldings]
                    .sort((a, b) => a.dayChangePercent - b.dayChangePercent)
                    .slice(0, 4)
                    .map((h, i) => (
                      <div key={h.symbol} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-600 font-mono w-3">{i + 1}</span>
                          <span className="text-xs font-semibold text-white">{h.symbol}</span>
                        </div>
                        <span className={`text-xs font-mono font-bold ${getChangeColor(h.dayChangePercent)}`}>
                          {h.dayChangePercent >= 0 ? '+' : ''}{h.dayChangePercent.toFixed(2)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Holdings Table */}
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-semibold text-white">All Holdings</h3>
                  <span className="text-[10px] bg-white/[0.06] px-2 py-0.5 rounded text-slate-400 font-mono">
                    {portfolioHoldings.length} positions
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {[
                        { key: 'symbol', label: 'Symbol' },
                        { key: 'shares', label: 'Shares' },
                        { key: 'avgCost', label: 'Avg Cost' },
                        { key: 'currentPrice', label: 'Price' },
                        { key: 'totalValue', label: 'Value' },
                        { key: 'dayChange', label: 'Day P&L' },
                        { key: 'totalGain', label: 'Total P&L' },
                        { key: 'gainPercent', label: 'Return' },
                        { key: 'allocation', label: 'Alloc' },
                      ].map((col) => (
                        <th
                          key={col.key}
                          onClick={() => toggleSort(col.key)}
                          className="text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors select-none"
                        >
                          <span className="flex items-center gap-1">
                            {col.label}
                            {sortField === col.key && (
                              sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
                            )}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedHoldings.map((h, i) => (
                      <motion.tr
                        key={h.symbol}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3">
                          <div className="text-xs font-semibold text-white">{h.symbol}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{h.name}</div>
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-slate-300">{h.shares}</td>
                        <td className="px-4 py-3 text-xs font-mono text-slate-400">${formatNumber(h.avgCost)}</td>
                        <td className="px-4 py-3 text-xs font-mono font-semibold text-slate-200">${formatNumber(h.currentPrice)}</td>
                        <td className="px-4 py-3 text-xs font-mono text-slate-300">${formatNumber(h.totalValue, 0)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-mono font-semibold ${getChangeColor(h.dayChange)}`}>
                            {h.dayChange >= 0 ? '+' : ''}${formatNumber(h.dayChange, 0)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-mono font-semibold ${getChangeColor(h.totalGain)}`}>
                            {h.totalGain >= 0 ? '+' : ''}${formatNumber(h.totalGain, 0)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                            h.gainPercent >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {h.gainPercent >= 0 ? '+' : ''}{h.gainPercent.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-14 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                              <div className="h-full rounded-full bg-blue-500" style={{ width: `${h.allocation * 4}%` }} />
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">{h.allocation}%</span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== ANALYTICS TAB ===== */}
        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Risk Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Risk Score */}
              <div className="glass-card p-5 flex flex-col items-center">
                <h3 className="text-sm font-semibold text-white mb-4 self-start">Risk Score</h3>
                <RiskGauge score={riskScore.score} label={riskScore.label} color={riskScore.color} />
                <div className="mt-4 w-full space-y-2">
                  {[
                    { label: 'Volatility', value: `${volatility.toFixed(1)}%` },
                    { label: 'Max DD', value: `${maxDrawdown.toFixed(1)}%` },
                    { label: 'Beta (est.)', value: '1.12' },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between text-[10px]">
                      <span className="text-slate-500">{r.label}</span>
                      <span className="text-slate-300 font-mono">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sharpe Detail */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Return Metrics</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Sharpe Ratio', value: sharpeRatio.toFixed(2), color: sharpeRatio > 1 ? '#10b981' : '#f59e0b' },
                    { label: 'CAGR', value: `${cagr.toFixed(2)}%`, color: cagr > 12 ? '#10b981' : '#f59e0b' },
                    { label: 'Total Return', value: formatPercent((totalGain / totalInvested) * 100), color: '#10b981' },
                    { label: 'Annualized Vol.', value: `${volatility.toFixed(2)}%`, color: volatility < 20 ? '#10b981' : '#ef4444' },
                    { label: 'Risk-Free Rate', value: '6.50%', color: '#64748b' },
                    { label: 'Excess Return', value: `${(cagr - 6.5).toFixed(2)}%`, color: cagr > 6.5 ? '#10b981' : '#ef4444' },
                  ].map((m) => (
                    <div key={m.label} className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">{m.label}</span>
                      <span className="text-xs font-mono font-bold" style={{ color: m.color }}>
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Win/Loss Stats */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Win/Loss Analysis</h3>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-24 h-24">
                    <svg width="96" height="96" viewBox="0 0 96 96">
                      <circle cx="48" cy="48" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                      <motion.circle
                        cx="48"
                        cy="48"
                        r="38"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${winRate * 2.39} ${(100 - winRate) * 2.39}`}
                        strokeDashoffset={59.7}
                        initial={{ strokeDasharray: '0 239' }}
                        animate={{ strokeDasharray: `${winRate * 2.39} ${(100 - winRate) * 2.39}` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-white font-mono">{winRate.toFixed(0)}%</span>
                      <span className="text-[8px] text-slate-500">WIN RATE</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Winning Days', value: Math.round(winRate * equityCurve.length / 100), color: 'text-emerald-400' },
                    { label: 'Losing Days', value: equityCurve.length - Math.round(winRate * equityCurve.length / 100), color: 'text-red-400' },
                    { label: 'Total Days', value: equityCurve.length, color: 'text-slate-300' },
                    { label: 'Best Day', value: `+${Math.max(...dailyReturns.map(r => r * 100)).toFixed(2)}%`, color: 'text-emerald-400' },
                    { label: 'Worst Day', value: `${Math.min(...dailyReturns.map(r => r * 100)).toFixed(2)}%`, color: 'text-red-400' },
                  ].map((s) => (
                    <div key={s.label} className="flex justify-between text-[10px]">
                      <span className="text-slate-500">{s.label}</span>
                      <span className={`font-mono font-bold ${s.color}`}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drawdown Stats */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Drawdown Stats</h3>
                <div className="space-y-3">
                  {(() => {
                    // Find top 3 drawdown periods
                    const ddPeriods: { start: string; end: string; depth: number }[] = [];
                    let currentStart = '';
                    let currentMin = 0;

                    drawdownData.forEach((d) => {
                      if (d.drawdown < -0.5 && !currentStart) {
                        currentStart = d.date;
                        currentMin = d.drawdown;
                      } else if (d.drawdown < currentMin) {
                        currentMin = d.drawdown;
                      } else if (d.drawdown === 0 && currentStart) {
                        ddPeriods.push({ start: currentStart, end: d.date, depth: currentMin });
                        currentStart = '';
                        currentMin = 0;
                      }
                    });

                    if (currentStart) {
                      ddPeriods.push({
                        start: currentStart,
                        end: drawdownData[drawdownData.length - 1].date,
                        depth: currentMin,
                      });
                    }

                    const topDD = ddPeriods.sort((a, b) => a.depth - b.depth).slice(0, 3);

                    return (
                      <>
                        <div className="flex justify-between text-[10px] pb-2 border-b border-white/[0.04]">
                          <span className="text-slate-500">Max Drawdown</span>
                          <span className="font-mono font-bold text-red-400">{maxDrawdown.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-500">Avg Drawdown</span>
                          <span className="font-mono font-bold text-amber-400">
                            {(drawdownData.reduce((s, d) => s + d.drawdown, 0) / drawdownData.length).toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-500">Current Drawdown</span>
                          <span className="font-mono font-bold text-red-400">
                            {drawdownData[drawdownData.length - 1].drawdown.toFixed(2)}%
                          </span>
                        </div>
                        <div className="pt-2 border-t border-white/[0.04]">
                          <div className="text-[9px] text-slate-600 uppercase tracking-wider mb-2">Deepest Drawdowns</div>
                          {topDD.map((dd, i) => (
                            <div key={i} className="flex items-center justify-between text-[10px] mb-1">
                              <span className="text-slate-500 font-mono">
                                {new Date(dd.start).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                              </span>
                              <span className="font-mono font-bold text-red-400">{dd.depth.toFixed(2)}%</span>
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Drawdown Chart Full Width */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-semibold text-white">Underwater Chart (Drawdown)</h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={drawdownData}>
                  <defs>
                    <linearGradient id="ddGradFull" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: '#475569' }}
                    tickFormatter={(d) => {
                      const date = new Date(d);
                      return `${date.toLocaleString('en', { month: 'short' })} '${date.getFullYear().toString().slice(2)}`;
                    }}
                    minTickGap={60}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: '#475569' }}
                    tickFormatter={(v) => `${v.toFixed(0)}%`}
                    orientation="right"
                    width={40}
                    domain={['dataMin', 0]}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="glass-card p-2 border border-white/10 text-xs">
                          <div className="text-slate-500">{d.date}</div>
                          <div className="font-mono font-bold text-red-400">{d.drawdown.toFixed(2)}%</div>
                        </div>
                      );
                    }}
                  />
                  <ReferenceLine y={0} stroke="rgba(255,255,255,0.08)" />
                  <Area
                    type="monotone"
                    dataKey="drawdown"
                    stroke="#ef4444"
                    strokeWidth={1.5}
                    fill="url(#ddGradFull)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Returns Full Width */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Monthly Returns Distribution</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyReturns}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: '#475569' }}
                    tickFormatter={(m) => {
                      const d = new Date(m + '-01');
                      return d.toLocaleString('en', { month: 'short' });
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: '#475569' }}
                    tickFormatter={(v) => `${v.toFixed(0)}%`}
                    orientation="right"
                    width={35}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="glass-card p-2 border border-white/10 text-xs">
                          <div className="text-slate-500">{d.month}</div>
                          <div className={`font-mono font-bold ${d.return >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {d.return >= 0 ? '+' : ''}{d.return.toFixed(2)}%
                          </div>
                        </div>
                      );
                    }}
                  />
                  <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
                  <Bar dataKey="return" radius={[3, 3, 0, 0]} isAnimationActive={false}>
                    {monthlyReturns.map((m, i) => (
                      <Cell key={i} fill={m.return >= 0 ? '#10b98160' : '#ef444460'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
