import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Flame,
  BarChart3,
  RefreshCw,
  Clock,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  GripVertical,
  RotateCcw,
  Shield,
  Zap,
} from 'lucide-react';
import { IndexCard } from '../components/cards/IndexCard';
import { SentimentGauge } from '../components/ui/SentimentGauge';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import {
  niftyIndex,
  sensexIndex,
  bankNiftyIndex,
  marketBreadth,
  topGainers,
  topLosers,
  indianSectorHeatmap,
  sentimentData,
} from '../data/mockData';
import { formatNumber } from '../utils/formatters';

const DEFAULT_WIDGET_ORDER = [
  'nifty',
  'sensex',
  'banknifty',
  'sentiment',
  'breadth',
  'heatmap',
  'gainers',
  'losers',
];

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Drag and drop widget order state
  const [widgets, setWidgets] = useState<string[]>(() => {
    const saved = localStorage.getItem('dashboard-widgets-order-dnd');
    return saved ? JSON.parse(saved) : DEFAULT_WIDGET_ORDER;
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 700);
  }, []);

  const resetLayout = () => {
    setWidgets(DEFAULT_WIDGET_ORDER);
    localStorage.setItem('dashboard-widgets-order-dnd', JSON.stringify(DEFAULT_WIDGET_ORDER));
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.4';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const reordered = [...widgets];
    const temp = reordered[draggedIndex];
    reordered[draggedIndex] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    setWidgets(reordered);
    localStorage.setItem('dashboard-widgets-order-dnd', JSON.stringify(reordered));
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
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
  const unchangedPct = (marketBreadth.unchanged / breadthTotal) * 100;

  // Render Widget Helper based on ID
  const renderWidget = (id: string, index: number) => {
    const isDragging = draggedIndex === index;
    const isDragOver = dragOverIndex === index;

    // Col Spans using 12-column Grid:
    // - Indices & Sentiment: xl:col-span-3, md:col-span-6, col-span-12
    // - Breadth, Heatmap, Gainers, Losers: xl:col-span-6, col-span-12
    let colSpanClass = 'col-span-12';
    if (['nifty', 'sensex', 'banknifty', 'sentiment', 'portfolio', 'aiOutlook'].includes(id)) {
      colSpanClass = 'col-span-12 md:col-span-6 xl:col-span-3';
    } else {
      colSpanClass = 'col-span-12 xl:col-span-6';
    }

    const cardClass = `relative glass-card flex flex-col justify-between h-full select-none transition-all duration-200 overflow-hidden rounded-lg border border-white/[0.08] bg-[#1a1d27] ${
      isDragging ? 'opacity-30 border-blue-500/30' : ''
    } ${isDragOver ? 'border-blue-500 bg-blue-500/[0.02] scale-[0.99]' : ''}`;

    // Drag Handle element
    const dragHeader = (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, index)}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => handleDragOver(e, index)}
        onDrop={(e) => handleDrop(e, index)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.02] border-b border-white/[0.04] cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 transition-colors select-none"
      >
        <GripVertical className="w-3 h-3" />
        <span className="text-[8px] font-mono tracking-widest uppercase">Drag to Reorder</span>
      </div>
    );

    switch (id) {
      case 'nifty':
        return (
          <div
            key={id}
            className={`${colSpanClass} transition-all`}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className={cardClass}>
              {dragHeader}
              <div className="flex-1 p-4 h-full flex flex-col justify-between">
                <ErrorBoundary>
                  <IndexCard index={niftyIndex} accentColor="#2563eb" />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        );

      case 'sensex':
        return (
          <div
            key={id}
            className={`${colSpanClass} transition-all`}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className={cardClass}>
              {dragHeader}
              <div className="flex-1 p-4 h-full flex flex-col justify-between">
                <ErrorBoundary>
                  <IndexCard index={sensexIndex} accentColor="#7c3aed" />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        );

      case 'banknifty':
        return (
          <div
            key={id}
            className={`${colSpanClass} transition-all`}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className={cardClass}>
              {dragHeader}
              <div className="flex-1 p-4 h-full flex flex-col justify-between">
                <ErrorBoundary>
                  <IndexCard index={bankNiftyIndex} accentColor="#0891b2" />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        );

      case 'sentiment':
        return (
          <div
            key={id}
            className={`${colSpanClass} transition-all`}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className={cardClass}>
              {dragHeader}
              <div className="flex-1 p-4 flex flex-col justify-between h-full">
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Market Sentiment</h3>
                    <p className="text-[9px] text-slate-500 leading-normal">FII/DII net flow bias</p>
                  </div>
                  <Activity className="w-3.5 h-3.5 text-amber-500" />
                </div>
                
                <div className="flex-1 flex items-center justify-center my-2">
                  <SentimentGauge value={sentimentData.overall} size={110} label="Greed" />
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-white/[0.04] pt-2 text-[9px] font-mono">
                  <div>
                    <span className="text-slate-500 block">FII Net</span>
                    <span className={`font-bold block ${sentimentData.fiiFlow >= 0 ? 'text-[#00c076]' : 'text-[#ff4d4f]'}`}>
                      {sentimentData.fiiFlow >= 0 ? '+' : ''}₹{sentimentData.fiiFlow.toLocaleString()} Cr
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">DII Net</span>
                    <span className={`font-bold block ${sentimentData.diiFlow >= 0 ? 'text-[#00c076]' : 'text-[#ff4d4f]'}`}>
                      {sentimentData.diiFlow >= 0 ? '+' : ''}₹{sentimentData.diiFlow.toLocaleString()} Cr
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'breadth':
        return (
          <div
            key={id}
            className={`${colSpanClass} transition-all`}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className={cardClass}>
              {dragHeader}
              <div className="flex-1 p-4 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Market Breadth</h3>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500">
                      {breadthTotal.toLocaleString()} ACTIVE
                    </span>
                  </div>

                  {/* Proportional Segmented Progress Bar */}
                  <div className="h-2 rounded-full overflow-hidden flex bg-white/[0.02] mb-3">
                    <div className="h-full bg-[#00c076]" style={{ width: `${advancePct}%` }} />
                    <div className="h-full bg-slate-600" style={{ width: `${unchangedPct}%` }} />
                    <div className="h-full bg-[#ff4d4f]" style={{ width: `${declinePct}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center border-t border-white/[0.04] pt-2">
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase font-mono">Advances</div>
                    <div className="text-xs font-bold text-[#00c076] font-mono mt-0.5">
                      {marketBreadth.advances} <span className="text-[10px] font-normal text-slate-400">({advancePct.toFixed(0)}%)</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase font-mono">Unchanged</div>
                    <div className="text-xs font-bold text-slate-400 font-mono mt-0.5">
                      {marketBreadth.unchanged} <span className="text-[10px] font-normal text-slate-400">({unchangedPct.toFixed(0)}%)</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase font-mono">Declines</div>
                    <div className="text-xs font-bold text-[#ff4d4f] font-mono mt-0.5">
                      {marketBreadth.declines} <span className="text-[10px] font-normal text-slate-400">({declinePct.toFixed(0)}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'heatmap':
        return (
          <div
            key={id}
            className={`${colSpanClass} transition-all`}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className={cardClass}>
              {dragHeader}
              <div className="flex-1 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sector Heatmap</h3>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono uppercase">Indices change</span>
                </div>

                {/* 3-Column, 2-Row Uniform layout with exactly equal heights */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {indianSectorHeatmap.slice(0, 6).map((sector) => {
                    const isUp = sector.change >= 0;
                    const intensity = Math.min(Math.abs(sector.change) / 2.5, 1);
                    const bg = isUp
                      ? `rgba(0, 192, 118, ${intensity * 0.15})`
                      : `rgba(255, 77, 79, ${intensity * 0.15})`;
                    const borderColor = isUp
                      ? `rgba(0, 192, 118, 0.12)`
                      : `rgba(255, 77, 79, 0.12)`;

                    return (
                      <div
                        key={sector.name}
                        className="h-[64px] p-2.5 rounded border text-center flex flex-col justify-center items-center transition-all truncate"
                        style={{ backgroundColor: bg, borderColor }}
                      >
                        <div className="text-[9px] font-bold text-slate-400 truncate w-full mb-0.5">
                          {sector.name}
                        </div>
                        <div className={`text-sm font-bold font-mono ${isUp ? 'text-[#00c076]' : 'text-[#ff4d4f]'}`}>
                          {isUp ? '+' : ''}{sector.change.toFixed(2)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 'gainers':
        return (
          <div
            key={id}
            className={`${colSpanClass} transition-all`}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className={cardClass}>
              {dragHeader}
              <div className="flex-1 pb-2">
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#00c076]" />
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Gainers (Nifty 50)</h3>
                </div>
                <div className="divide-y divide-white/[0.03]">
                  {topGainers.slice(0, 5).map((stock, i) => (
                    <div key={stock.symbol} className="grid grid-cols-12 items-center px-4 py-2 hover:bg-white/[0.01] transition-colors gap-2 text-xs h-[48px]">
                      <div className="col-span-6 flex items-center gap-2.5 min-w-0">
                        <span className="text-[9px] font-mono text-slate-600 w-3">{i + 1}</span>
                        <div className="min-w-0 truncate">
                          <span className="font-semibold text-slate-200 block truncate leading-tight">{stock.symbol}</span>
                          <span className="text-[9px] text-slate-500 block truncate leading-normal">{stock.name}</span>
                        </div>
                      </div>
                      <div className="col-span-3 text-right font-mono text-slate-300">
                        ₹{formatNumber(stock.price)}
                      </div>
                      <div className="col-span-3 text-right font-mono font-bold flex items-center justify-end gap-0.5 text-[#00c076]">
                        <ArrowUpRight className="w-3 h-3" />
                        <span>+{stock.changePercent.toFixed(2)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'losers':
        return (
          <div
            key={id}
            className={`${colSpanClass} transition-all`}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className={cardClass}>
              {dragHeader}
              <div className="flex-1 pb-2">
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-[#ff4d4f]" />
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Losers (Nifty 50)</h3>
                </div>
                <div className="divide-y divide-white/[0.03]">
                  {topLosers.slice(0, 5).map((stock, i) => (
                    <div key={stock.symbol} className="grid grid-cols-12 items-center px-4 py-2 hover:bg-white/[0.01] transition-colors gap-2 text-xs h-[48px]">
                      <div className="col-span-6 flex items-center gap-2.5 min-w-0">
                        <span className="text-[9px] font-mono text-slate-600 w-3">{i + 1}</span>
                        <div className="min-w-0 truncate">
                          <span className="font-semibold text-slate-200 block truncate leading-tight">{stock.symbol}</span>
                          <span className="text-[9px] text-slate-500 block truncate leading-normal">{stock.name}</span>
                        </div>
                      </div>
                      <div className="col-span-3 text-right font-mono text-slate-300">
                        ₹{formatNumber(stock.price)}
                      </div>
                      <div className="col-span-3 text-right font-mono font-bold flex items-center justify-end gap-0.5 text-[#ff4d4f]">
                        <ArrowDownRight className="w-3 h-3" />
                        <span>{stock.changePercent.toFixed(2)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'portfolio':
        return (
          <div
            key={id}
            className={`${colSpanClass} transition-all`}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className={cardClass}>
              {dragHeader}
              <div className="flex-1 p-4 flex flex-col justify-center items-center text-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Portfolio Value</span>
                <h2 className="text-xl font-bold text-white font-mono mt-1 mb-2">₹28,47,392</h2>
                <span className="text-[10px] text-[#00c076] font-mono">+₹42,187 (+1.50%) today</span>
              </div>
            </div>
          </div>
        );

      case 'aiOutlook':
        return (
          <div
            key={id}
            className={`${colSpanClass} transition-all`}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className={cardClass}>
              {dragHeader}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 mb-2">
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">AI Outlook Report</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3 pr-1">
                  Indian markets showing consolidation range. IT & Auto sectors lead performance trends.
                </p>
                <div className="flex items-center justify-between text-[9px] text-slate-500 border-t border-white/[0.04] pt-2">
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-[#00c076]" /> Target: 25,000</span>
                  <span>Support: 24,500</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* ===== Page Header ===== */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-0.5">Terminal Dashboard</h1>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
            Institutional Market Overview · NSE & BSE
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>UPDATED {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>

          <button
            onClick={resetLayout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-white hover:border-white/10 transition-all text-xs font-semibold cursor-pointer"
            title="Reset to default order"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET LAYOUT</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-white hover:border-white/10 transition-all text-xs font-semibold disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'REFRESHING...' : 'REFRESH'}
          </button>
        </div>
      </motion.div>

      {/* ===== Widgets Grid System - Enforce consistent gap: 12px (gap-3) ===== */}
      <div className="grid grid-cols-12 gap-3">
        {widgets.map((id, index) => renderWidget(id, index))}
      </div>
    </div>
  );
};

export default Dashboard;
