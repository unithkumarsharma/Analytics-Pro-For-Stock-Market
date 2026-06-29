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
  Sliders,
  Check,
  RotateCcw,
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
      </div>
    ))}
  </div>
);

// ===== Main Component =====
const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Dashboard Custom Widget Arrangement and Visibilities
  const [customizeMode, setCustomizeMode] = useState(false);
  const [widgetOrder, setWidgetOrder] = useState<string[]>([
    'indexCards',
    'marketBreadth',
    'gainersLosers',
    'sectorHeatmap',
    'sentimentSummary',
  ]);
  const [visibleWidgets, setVisibleWidgets] = useState<Record<string, boolean>>({
    indexCards: true,
    marketBreadth: true,
    gainersLosers: true,
    sectorHeatmap: true,
    sentimentSummary: true,
  });

  useEffect(() => {
    // Check local storage for layout preferences
    const savedOrder = localStorage.getItem('db-widget-order');
    const savedVis = localStorage.getItem('db-widget-vis');
    if (savedOrder) setWidgetOrder(JSON.parse(savedOrder));
    if (savedVis) setVisibleWidgets(JSON.parse(savedVis));

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 800);
  }, []);

  const savePreferences = (newOrder: string[], newVis: Record<string, boolean>) => {
    localStorage.setItem('db-widget-order', JSON.stringify(newOrder));
    localStorage.setItem('db-widget-vis', JSON.stringify(newVis));
  };

  const toggleWidgetVisibility = (id: string) => {
    const nextVis = { ...visibleWidgets, [id]: !visibleWidgets[id] };
    setVisibleWidgets(nextVis);
    savePreferences(widgetOrder, nextVis);
  };

  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const nextOrder = [...widgetOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= nextOrder.length) return;

    // Swap
    const temp = nextOrder[index];
    nextOrder[index] = nextOrder[targetIdx];
    nextOrder[targetIdx] = temp;

    setWidgetOrder(nextOrder);
    savePreferences(nextOrder, visibleWidgets);
  };

  const resetLayout = () => {
    const defaultOrder = ['indexCards', 'marketBreadth', 'gainersLosers', 'sectorHeatmap', 'sentimentSummary'];
    const defaultVis = {
      indexCards: true,
      marketBreadth: true,
      gainersLosers: true,
      sectorHeatmap: true,
      sentimentSummary: true,
    };
    setWidgetOrder(defaultOrder);
    setVisibleWidgets(defaultVis);
    savePreferences(defaultOrder, defaultVis);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="skeleton h-8 w-48 rounded mb-2" />
          <div className="skeleton h-4 w-72 rounded" />
        </div>
        <DashboardSkeleton />
      </div>
    );
  }

  const breadthTotal = marketBreadth.advances + marketBreadth.declines + marketBreadth.unchanged;
  const advancePct = (marketBreadth.advances / breadthTotal) * 100;
  const declinePct = (marketBreadth.declines / breadthTotal) * 100;

  // Render Widget Sections helper
  const renderWidget = (id: string, index: number) => {
    if (!visibleWidgets[id]) return null;

    const controlToolbar = customizeMode && (
      <div className="flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded px-1.5 py-0.5 ml-auto shrink-0 select-none">
        <button
          onClick={(e) => { e.stopPropagation(); moveWidget(index, 'up'); }}
          disabled={index === 0}
          className="p-1 rounded hover:bg-white/[0.04] disabled:opacity-30 text-slate-400 hover:text-white"
        >
          <ArrowUp className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); moveWidget(index, 'down'); }}
          disabled={index === widgetOrder.length - 1}
          className="p-1 rounded hover:bg-white/[0.04] disabled:opacity-30 text-slate-400 hover:text-white"
        >
          <ArrowDown className="w-3 h-3" />
        </button>
      </div>
    );

    switch (id) {
      case 'indexCards':
        return (
          <Section key={id} delay={0.05}>
            <div className="flex items-center mb-2 px-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Market Indices</span>
              {controlToolbar}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <ErrorBoundary><IndexCard index={niftyIndex} accentColor="#3b82f6" /></ErrorBoundary>
              <ErrorBoundary><IndexCard index={sensexIndex} accentColor="#8b5cf6" /></ErrorBoundary>
              <ErrorBoundary><IndexCard index={bankNiftyIndex} accentColor="#06b6d4" /></ErrorBoundary>
            </div>
          </Section>
        );

      case 'marketBreadth':
        return (
          <Section key={id} delay={0.15}>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-semibold text-white">Market Breadth</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-mono">{breadthTotal.toLocaleString()} stocks</span>
                  {controlToolbar}
                </div>
              </div>
              <div className="h-3 rounded-full overflow-hidden flex mb-3">
                <motion.div initial={{ width: 0 }} animate={{ width: `${advancePct}%` }} transition={{ duration: 0.8 }} className="h-full bg-emerald-500" />
                <motion.div initial={{ width: 0 }} animate={{ width: `${(marketBreadth.unchanged / breadthTotal) * 100}%` }} transition={{ duration: 0.8 }} className="h-full bg-slate-600" />
                <motion.div initial={{ width: 0 }} animate={{ width: `${declinePct}%` }} transition={{ duration: 0.8 }} className="h-full bg-red-500" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center mt-4">
                <div><div className="text-xs text-slate-500">Advances</div><div className="text-lg font-bold text-emerald-400 font-mono">{marketBreadth.advances} ({advancePct.toFixed(0)}%)</div></div>
                <div><div className="text-xs text-slate-500">Unchanged</div><div className="text-lg font-bold text-slate-400 font-mono">{marketBreadth.unchanged}</div></div>
                <div><div className="text-xs text-slate-500">Declines</div><div className="text-lg font-bold text-red-400 font-mono">{marketBreadth.declines} ({declinePct.toFixed(0)}%)</div></div>
              </div>
            </div>
          </Section>
        );

      case 'gainersLosers':
        return (
          <Section key={id} delay={0.25}>
            <div className="flex items-center mb-2 px-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Market Leaders & Laggards</span>
              {controlToolbar}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Gainers */}
              <div className="glass-card overflow-hidden">
                <div className="p-4 border-b border-white/[0.06] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-white">Top Gainers</span>
                </div>
                <div className="divide-y divide-white/[0.03]">
                  {topGainers.slice(0, 5).map((stock) => (
                    <div key={stock.symbol} className="flex justify-between items-center px-4 py-3">
                      <div><div className="text-xs font-bold text-white">{stock.symbol}</div><div className="text-[10px] text-slate-500">{stock.name}</div></div>
                      <div className="text-right"><div className="text-xs font-mono text-white">₹{stock.price}</div><span className="text-[10px] font-bold text-emerald-400">+{stock.changePercent.toFixed(2)}%</span></div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Losers */}
              <div className="glass-card overflow-hidden">
                <div className="p-4 border-b border-white/[0.06] flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-semibold text-white">Top Losers</span>
                </div>
                <div className="divide-y divide-white/[0.03]">
                  {topLosers.slice(0, 5).map((stock) => (
                    <div key={stock.symbol} className="flex justify-between items-center px-4 py-3">
                      <div><div className="text-xs font-bold text-white">{stock.symbol}</div><div className="text-[10px] text-slate-500">{stock.name}</div></div>
                      <div className="text-right"><div className="text-xs font-mono text-white">₹{stock.price}</div><span className="text-[10px] font-bold text-red-400">{stock.changePercent.toFixed(2)}%</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        );

      case 'sectorHeatmap':
        return (
          <Section key={id} delay={0.35}>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                  <h3 className="text-sm font-semibold text-white">Sector Heatmap</h3>
                </div>
                {controlToolbar}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                {indianSectorHeatmap.slice(0, 12).map((sec) => {
                  const intensity = Math.min(Math.abs(sec.change) / 3, 1);
                  const bg = sec.change >= 0 ? `rgba(16,185,129,${intensity * 0.25})` : `rgba(239,68,68,${intensity * 0.25})`;
                  return (
                    <div key={sec.name} className="p-3 rounded-lg border border-white/[0.04] text-center" style={{ backgroundColor: bg }}>
                      <div className="text-[10px] text-slate-400 truncate mb-1">{sec.name}</div>
                      <div className={`text-sm font-bold font-mono ${sec.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {sec.change >= 0 ? '+' : ''}{sec.change.toFixed(2)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>
        );

      case 'sentimentSummary':
        return (
          <Section key={id} delay={0.45}>
            <div className="flex items-center mb-2 px-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Market Sentiment & Portfolio</span>
              {controlToolbar}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Sentiment */}
              <div className="glass-card p-4 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-400">Market Sentiment</span>
                  <span className="text-[10px] font-bold text-emerald-400">Greed</span>
                </div>
                <div className="flex justify-center">
                  <SentimentGauge value={sentimentData.overall} size={150} label="Greed" />
                </div>
              </div>
              {/* Portfolio Summary */}
              <div className="glass-card p-4 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-400">Portfolio Status</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">+₹42,187</span>
                </div>
                <div className="py-2">
                  <span className="text-xs text-slate-500">Value</span>
                  <div className="text-lg font-bold text-white font-mono">₹28,47,392</div>
                </div>
                <div className="flex items-center gap-1 mt-auto">
                  <PieChart width={32} height={32}>
                    <Pie data={[{ value: 40 }, { value: 60 }]} cx={16} cy={16} innerRadius={8} outerRadius={14} dataKey="value" strokeWidth={0}>
                      <Cell fill="#3b82f6" /><Cell fill="#10b981" />
                    </Pie>
                  </PieChart>
                  <span className="text-[10px] text-slate-500">Top performance: TATAMOTORS</span>
                </div>
              </div>
              {/* AI Outlook */}
              <div className="glass-card p-4 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-400">AI outlook</span>
                  <span className="text-[10px] font-bold text-violet-400">Cautious Bullish</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                  Strong IT & Auto momentum, banking sector consolidation continues.
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-white/[0.04] pt-2">
                  <span>Target: 25,000</span>
                  <span>Support: 24,500</span>
                </div>
              </div>
            </div>
          </Section>
        );

      default:
        return null;
    }
  };

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

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <Clock className="w-3 h-3" />
            <span>Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>

          {/* Customize Layout */}
          <button
            onClick={() => setCustomizeMode(!customizeMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              customizeMode
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                : 'bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-white hover:border-white/10'
            }`}
          >
            <Sliders className="w-3 h-3" />
            {customizeMode ? 'Exit Customizer' : 'Customize Widgets'}
          </button>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-white hover:border-white/10 transition-all text-xs font-medium disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </motion.div>

      {/* Customize Panel Controls */}
      <AnimatePresence>
        {customizeMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-4 space-y-3 border border-blue-500/10">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-400" />
                  Toggle Dashboard Widgets Visibility & Layout
                </span>
                <button
                  onClick={resetLayout}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Default
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'indexCards', label: 'Market Indices' },
                  { id: 'marketBreadth', label: 'Market Breadth' },
                  { id: 'gainersLosers', label: 'Gainers & Losers' },
                  { id: 'sectorHeatmap', label: 'Sector Heatmap' },
                  { id: 'sentimentSummary', label: 'Sentiment & Portfolio' },
                ].map((w) => (
                  <button
                    key={w.id}
                    onClick={() => toggleWidgetVisibility(w.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                      visibleWidgets[w.id]
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        : 'bg-transparent border-white/[0.04] text-slate-500'
                    }`}
                  >
                    <div className="w-3.5 h-3.5 rounded border border-current flex items-center justify-center shrink-0">
                      {visibleWidgets[w.id] && <Check className="w-2.5 h-2.5" />}
                    </div>
                    {w.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render widget list in sequence order */}
      <div className="space-y-5">
        {widgetOrder.map((id, index) => renderWidget(id, index))}
      </div>
    </div>
  );
};

export default Dashboard;
