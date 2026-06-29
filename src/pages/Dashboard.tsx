import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Flame,
  BarChart3,
  Brain,
  Briefcase,
  RefreshCw,
  AlertTriangle,
  Inbox,
  Shield,
  Zap,
  Target,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Activity,
  Wifi,
  Clock,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { IndexCard } from '../components/cards/IndexCard';
import { SentimentGauge } from '../components/ui/SentimentGauge';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import {
  niftyIndex,
  sensexIndex,
  bankNiftyIndex,
  marketBreadth,
  topGainers,
  topLosers,
  indianSectorHeatmap,
  sentimentData,
  portfolioSummaryData,
  aiOutlookData,
} from '../data/mockData';
import { formatNumber, formatPercent, getChangeColor } from '../utils/formatters';

// ===== Sub-components =====

/** Empty state placeholder */
const EmptyState: React.FC<{ message: string; icon?: React.ReactNode }> = ({ message, icon }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
    {icon || <Inbox className="w-10 h-10 text-slate-600" />}
    <p className="text-sm text-slate-500">{message}</p>
  </div>
);

/** Error state placeholder */
const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
      <AlertTriangle className="w-6 h-6 text-red-400" />
    </div>
    <p className="text-sm text-slate-400">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-medium transition-colors"
      >
        <RefreshCw className="w-3 h-3" /> Retry
      </button>
    )}
  </div>
);

/** Section wrapper with consistent animation */
const Section: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

/** Inline skeleton for loading rows inside widgets */
const RowSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-2 p-4">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="skeleton h-4 w-20 rounded" />
        <div className="skeleton h-4 flex-1 rounded" />
        <div className="skeleton h-4 w-16 rounded" />
      </div>
    ))}
  </div>
);

// ===== Main Dashboard =====
const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  // Simulated error state (set to symbol to simulate per-widget errors)
  const [errors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  // Auto-refresh every 30 seconds (simulated)
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="skeleton h-8 w-48 rounded mb-2" />
          <div className="skeleton h-4 w-72 rounded" />
        </div>
        <DashboardSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card p-4"><RowSkeleton /></div>
          <div className="glass-card p-4"><RowSkeleton /></div>
        </div>
      </div>
    );
  }

  const breadthTotal = marketBreadth.advances + marketBreadth.declines + marketBreadth.unchanged;
  const advancePct = (marketBreadth.advances / breadthTotal) * 100;
  const declinePct = (marketBreadth.declines / breadthTotal) * 100;

  return (
    <div className="space-y-5">
      {/* ===== Page Header ===== */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold text-white mb-0.5">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Indian Market Overview · NSE & BSE
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <Clock className="w-3 h-3" />
            <span>Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-white hover:border-white/10 transition-all text-xs font-medium disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <div className="flex items-center gap-1.5 px-2 py-1.5">
            <div className="live-dot" />
            <span className="text-xs font-semibold text-emerald-400">LIVE</span>
          </div>
        </div>
      </motion.div>

      {/* ===== 1. Index Cards: Nifty, Sensex, BankNifty ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <ErrorBoundary>
          <IndexCard index={niftyIndex} delay={0.05} accentColor="#3b82f6" />
        </ErrorBoundary>
        <ErrorBoundary>
          <IndexCard index={sensexIndex} delay={0.12} accentColor="#8b5cf6" />
        </ErrorBoundary>
        <ErrorBoundary>
          <IndexCard index={bankNiftyIndex} delay={0.19} accentColor="#06b6d4" />
        </ErrorBoundary>
      </div>

      {/* ===== 2. Market Breadth Card ===== */}
      <Section delay={0.25}>
        <ErrorBoundary>
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Market Breadth</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {breadthTotal.toLocaleString()} stocks
              </span>
            </div>

            {/* Breadth bar */}
            <div className="h-3 rounded-full overflow-hidden flex mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${advancePct}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="bg-emerald-500 rounded-l-full"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(marketBreadth.unchanged / breadthTotal) * 100}%` }}
                transition={{ duration: 1, delay: 0.4 }}
                className="bg-slate-500"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${declinePct}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-red-500 rounded-r-full"
              />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { label: 'Advances', value: marketBreadth.advances, color: 'text-emerald-400', icon: ArrowUp },
                { label: 'Declines', value: marketBreadth.declines, color: 'text-red-400', icon: ArrowDown },
                { label: 'Unchanged', value: marketBreadth.unchanged, color: 'text-slate-400', icon: Activity },
                { label: 'New Highs', value: marketBreadth.newHighs, color: 'text-emerald-400', icon: ChevronUp },
                { label: 'New Lows', value: marketBreadth.newLows, color: 'text-red-400', icon: ChevronDown },
                { label: 'Adv. Volume', value: marketBreadth.advanceVolume, color: 'text-emerald-400', isString: true },
                { label: 'Dec. Volume', value: marketBreadth.declineVolume, color: 'text-red-400', isString: true },
              ].map((stat) => {
                const Icon = 'icon' in stat ? stat.icon : null;
                return (
                  <div key={stat.label} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                    {Icon && <Icon className={`w-3.5 h-3.5 ${stat.color} shrink-0`} />}
                    <div>
                      <div className="text-[10px] text-slate-500">{stat.label}</div>
                      <div className={`text-xs font-bold font-mono ${stat.color}`}>
                        {'isString' in stat ? String(stat.value) : Number(stat.value).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ErrorBoundary>
      </Section>

      {/* ===== 3 & 4. Top Gainers + Top Losers ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Gainers */}
        <Section delay={0.3}>
          <ErrorBoundary>
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-white/[0.06] flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Top Gainers</h3>
                <span className="ml-auto text-[10px] text-slate-500 font-mono">Nifty 500</span>
              </div>

              {topGainers.length === 0 ? (
                <EmptyState message="No gainers data available" />
              ) : (
                <div className="divide-y divide-white/[0.03]">
                  {topGainers.slice(0, 8).map((stock, i) => (
                    <motion.div
                      key={stock.symbol}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.04 }}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[10px] font-mono text-slate-600 w-4">{i + 1}</span>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                            {stock.symbol}
                          </span>
                          <span className="text-[10px] text-slate-500 ml-2 hidden sm:inline truncate">
                            {stock.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-mono text-slate-300">
                          ₹{formatNumber(stock.price)}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 min-w-[68px] justify-end">
                          <ArrowUpRight className="w-3 h-3" />
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </ErrorBoundary>
        </Section>

        {/* Top Losers */}
        <Section delay={0.35}>
          <ErrorBoundary>
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-white/[0.06] flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center">
                  <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Top Losers</h3>
                <span className="ml-auto text-[10px] text-slate-500 font-mono">Nifty 500</span>
              </div>

              {topLosers.length === 0 ? (
                <EmptyState message="No losers data available" />
              ) : (
                <div className="divide-y divide-white/[0.03]">
                  {topLosers.slice(0, 8).map((stock, i) => (
                    <motion.div
                      key={stock.symbol}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.04 }}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[10px] font-mono text-slate-600 w-4">{i + 1}</span>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                            {stock.symbol}
                          </span>
                          <span className="text-[10px] text-slate-500 ml-2 hidden sm:inline truncate">
                            {stock.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-mono text-slate-300">
                          ₹{formatNumber(stock.price)}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400 min-w-[68px] justify-end">
                          <ArrowDownRight className="w-3 h-3" />
                          {Math.abs(stock.changePercent).toFixed(2)}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </ErrorBoundary>
        </Section>
      </div>

      {/* ===== 5. Sector Heatmap ===== */}
      <Section delay={0.4}>
        <ErrorBoundary>
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Sector Heatmap</h3>
              <span className="ml-auto text-[10px] text-slate-500">NSE Sectoral Indices</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5">
              {indianSectorHeatmap.map((sector, i) => {
                const intensity = Math.min(Math.abs(sector.change) / 3.5, 1);
                const bg = sector.change >= 0
                  ? `rgba(16, 185, 129, ${intensity * 0.25})`
                  : `rgba(239, 68, 68, ${intensity * 0.25})`;
                const borderColor = sector.change >= 0
                  ? `rgba(16, 185, 129, ${intensity * 0.2})`
                  : `rgba(239, 68, 68, ${intensity * 0.2})`;

                return (
                  <motion.div
                    key={sector.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45 + i * 0.04 }}
                    className="p-3 rounded-lg border hover:border-white/10 transition-all cursor-pointer group"
                    style={{ backgroundColor: bg, borderColor }}
                  >
                    <div className="text-xs font-semibold text-slate-300 mb-1 group-hover:text-white transition-colors">
                      {sector.name}
                    </div>
                    <div className={`text-lg font-bold font-mono ${getChangeColor(sector.change)}`}>
                      {formatPercent(sector.change)}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[9px] text-slate-500">{sector.marketCap}</span>
                      <span className="text-[9px] font-semibold text-slate-400">{sector.stocks} stocks</span>
                    </div>
                    <div className="mt-1.5 text-[9px] text-slate-500 flex items-center gap-1">
                      <span className="font-semibold text-blue-400">{sector.topStock}</span>
                      <span className={getChangeColor(sector.topStockChange)}>
                        {formatPercent(sector.topStockChange)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </ErrorBoundary>
      </Section>

      {/* ===== 6. Market Sentiment Gauge + 7. Portfolio Summary ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Sentiment Gauge */}
        <Section delay={0.5}>
          <ErrorBoundary>
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Market Sentiment</h3>
              </div>

              <div className="flex justify-center">
                <SentimentGauge
                  value={sentimentData.overall}
                  label={sentimentData.label}
                  size={210}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { label: 'FII Flow', value: `₹${sentimentData.fiiFlow.toLocaleString()} Cr`, color: sentimentData.fiiFlow >= 0 ? 'text-emerald-400' : 'text-red-400' },
                  { label: 'DII Flow', value: `₹${sentimentData.diiFlow.toLocaleString()} Cr`, color: sentimentData.diiFlow >= 0 ? 'text-emerald-400' : 'text-red-400' },
                  { label: 'India VIX', value: sentimentData.vix.toFixed(2), color: 'text-amber-400' },
                  { label: 'P/C Ratio', value: sentimentData.putCallRatio.toFixed(2), color: 'text-blue-400' },
                ].map((item) => (
                  <div key={item.label} className="p-2 rounded-lg bg-white/[0.03]">
                    <div className="text-[9px] text-slate-500 mb-0.5">{item.label}</div>
                    <div className={`text-xs font-bold font-mono ${item.color}`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ErrorBoundary>
        </Section>

        {/* Portfolio Summary */}
        <Section delay={0.55}>
          <ErrorBoundary>
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Portfolio Summary</h3>
              </div>

              <div className="mb-4">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Total Value</div>
                <AnimatedCounter
                  value={portfolioSummaryData.totalValue}
                  prefix="₹"
                  decimals={0}
                  formatIndian
                  className="text-2xl font-bold text-white"
                />
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-mono font-bold ${getChangeColor(portfolioSummaryData.dayChange)}`}>
                    {portfolioSummaryData.dayChange >= 0 ? '+' : ''}₹{portfolioSummaryData.dayChange.toLocaleString('en-IN')}
                  </span>
                  <span className={`text-[10px] font-mono ${getChangeColor(portfolioSummaryData.dayChangePercent)}`}>
                    ({formatPercent(portfolioSummaryData.dayChangePercent)})
                  </span>
                  <span className="text-[10px] text-slate-600">today</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-white/[0.03]">
                  <div className="text-[9px] text-slate-500 mb-0.5">Invested</div>
                  <div className="text-xs font-bold font-mono text-slate-300">
                    ₹{portfolioSummaryData.invested.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.03]">
                  <div className="text-[9px] text-slate-500 mb-0.5">Total P&L</div>
                  <div className={`text-xs font-bold font-mono ${getChangeColor(portfolioSummaryData.totalPnl)}`}>
                    +₹{portfolioSummaryData.totalPnl.toLocaleString('en-IN')}
                    <span className="text-[10px] ml-1">({formatPercent(portfolioSummaryData.totalPnlPercent)})</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.03]">
                  <div className="text-[9px] text-slate-500 mb-0.5">Top Performer</div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-blue-400">{portfolioSummaryData.topPerformer.symbol}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">+{portfolioSummaryData.topPerformer.changePercent}%</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.03]">
                  <div className="text-[9px] text-slate-500 mb-0.5">Worst Performer</div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-blue-400">{portfolioSummaryData.worstPerformer.symbol}</span>
                    <span className="text-[10px] text-red-400 font-mono">{portfolioSummaryData.worstPerformer.changePercent}%</span>
                  </div>
                </div>
              </div>

              {/* Sector Allocation Mini */}
              <div className="flex items-center gap-3">
                <PieChart width={64} height={64}>
                  <Pie
                    data={portfolioSummaryData.sectorAllocation}
                    cx={32}
                    cy={32}
                    innerRadius={18}
                    outerRadius={28}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {portfolioSummaryData.sectorAllocation.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1">
                  {portfolioSummaryData.sectorAllocation.map((s) => (
                    <div key={s.name} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-[10px] text-slate-400">{s.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 ml-auto">{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ErrorBoundary>
        </Section>

        {/* AI Market Outlook */}
        <Section delay={0.6}>
          <ErrorBoundary>
            <div className="glass-card p-5 lg:col-span-2 xl:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-violet-500/10 flex items-center justify-center">
                  <Brain className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">AI Market Outlook</h3>
                <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 font-semibold">
                  AI Powered
                </span>
              </div>

              {/* Sentiment + Confidence */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-lg font-bold text-emerald-400">{aiOutlookData.overallSentiment}</span>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.04]">
                  <Target className="w-3 h-3 text-violet-400" />
                  <span className="text-xs font-mono font-bold text-violet-400">{aiOutlookData.confidence}%</span>
                  <span className="text-[9px] text-slate-500">confidence</span>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {aiOutlookData.summary}
              </p>

              {/* Key Levels */}
              <div className="mb-4">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Key Levels — Nifty 50</div>
                <div className="grid grid-cols-2 gap-2">
                  {aiOutlookData.keyLevels.map((level) => (
                    <div
                      key={level.level}
                      className={`p-2 rounded-lg ${
                        level.type === 'resistance'
                          ? 'bg-red-500/5 border border-red-500/10'
                          : 'bg-emerald-500/5 border border-emerald-500/10'
                      }`}
                    >
                      <div className="text-[9px] text-slate-500">{level.label}</div>
                      <div className={`text-xs font-bold font-mono ${
                        level.type === 'resistance' ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {level.level.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signal Summary */}
              <div className="mb-3">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Technical Signals</div>
                <div className="space-y-1.5">
                  {aiOutlookData.signals.map((signal) => (
                    <div key={signal.indicator} className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 w-28 truncate">{signal.indicator}</span>
                      <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${signal.strength}%` }}
                          transition={{ duration: 1, delay: 0.7 }}
                          className={`h-full rounded-full ${
                            signal.signal === 'buy'
                              ? 'bg-emerald-500'
                              : signal.signal === 'sell'
                              ? 'bg-red-500'
                              : 'bg-amber-500'
                          }`}
                        />
                      </div>
                      <span className={`text-[9px] font-bold uppercase ${
                        signal.signal === 'buy' ? 'text-emerald-400' : signal.signal === 'sell' ? 'text-red-400' : 'text-amber-400'
                      }`}>
                        {signal.signal}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk & Catalysts */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[9px] text-red-400/70 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Risks
                  </div>
                  {aiOutlookData.riskFactors.slice(0, 3).map((r, i) => (
                    <div key={i} className="text-[10px] text-slate-500 leading-relaxed mb-1 flex items-start gap-1">
                      <span className="text-red-400/50 mt-0.5">•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-[9px] text-emerald-400/70 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Catalysts
                  </div>
                  {aiOutlookData.catalysts.slice(0, 3).map((c, i) => (
                    <div key={i} className="text-[10px] text-slate-500 leading-relaxed mb-1 flex items-start gap-1">
                      <span className="text-emerald-400/50 mt-0.5">•</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ErrorBoundary>
        </Section>
      </div>
    </div>
  );
};

export default Dashboard;
