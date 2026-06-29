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
import { formatNumber, formatPercent, getChangeColor } from '../utils/formatters';

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
    // Create custom transparent drag image or styling
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

  // Render Widget Helper based on ID
  const renderWidget = (id: string, index: number) => {
    const isDragging = draggedIndex === index;
    const isDragOver = dragOverIndex === index;

    // Responsive Col Spans:
    // - Nifty, Sensex, BankNifty, Sentiment: xl:col-span-3, md:col-span-6, col-span-12
    // - Breadth, Heatmap: xl:col-span-6, col-span-12
    // - Gainers, Losers: xl:col-span-6, col-span-12
    let colSpanClass = 'col-span-12';
    if (['nifty', 'sensex', 'banknifty', 'sentiment'].includes(id)) {
      colSpanClass = 'col-span-12 md:col-span-6 xl:col-span-3';
    } else {
      colSpanClass = 'col-span-12 xl:col-span-6';
    }

    const cardClass = `relative glass-card flex flex-col justify-between h-full select-none transition-all duration-200 ${
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
        className="flex items-center gap-1.5 p-2 bg-white/[0.02] border-b border-white/[0.04] cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 transition-colors rounded-t-2xl select-none"
      >
        <GripVertical className="w-3.5 h-3.5" />
        <span className="text-[9px] font-mono tracking-wider uppercase">Drag to Reorder</span>
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
              <div className="flex-1 p-5">
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
              <div className="flex-1 p-5">
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
              <div className="flex-1 p-5">
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
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Market Sentiment</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">FII/DII flow & volume bias</p>
                  </div>
                  <Activity className="w-4 h-4 text-amber-500" />
                </div>
                
                <div className="flex justify-center my-1">
                  <SentimentGauge value={sentimentData.overall} size={135} label="Greed" />
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-white/[0.04] pt-3 text-[10px] font-mono">
                  <div>
                    <span className="text-slate-500 block">FII Net Flow</span>
                    <span className={`font-bold ${sentimentData.fiiFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {sentimentData.fiiFlow >= 0 ? '+' : ''}₹{sentimentData.fiiFlow.toLocaleString()} Cr
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">DII Net Flow</span>
                    <span className={`font-bold ${sentimentData.diiFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
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
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-500" />
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Market Breadth</h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {breadthTotal.toLocaleString()} STOCKS ACTIVE
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-3 rounded-full overflow-hidden flex bg-white/[0.02]">
                    <div className="h-full bg-emerald-500" style={{ width: `${advancePct}%` }} />
                    <div className="h-full bg-slate-700" style={{ width: `${(marketBreadth.unchanged / breadthTotal) * 100}%` }} />
                    <div className="h-full bg-red-500" style={{ width: `${declinePct}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center mt-6 border-t border-white/[0.04] pt-4">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Advances</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                      {marketBreadth.advances} <span className="text-xs font-normal text-slate-400">({advancePct.toFixed(0)}%)</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Unchanged</div>
                    <div className="text-sm font-bold text-slate-400 font-mono mt-0.5">
                      {marketBreadth.unchanged}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Declines</div>
                    <div className="text-sm font-bold text-red-400 font-mono mt-0.5">
                      {marketBreadth.declines} <span className="text-xs font-normal text-slate-400">({declinePct.toFixed(0)}%)</span>
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
              <div className="flex-1 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sector Heatmap</h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">NSE Sectoral Indices</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {indianSectorHeatmap.slice(0, 6).map((sector) => {
                    const intensity = Math.min(Math.abs(sector.change) / 3, 1);
                    const bg = sector.change >= 0
                      ? `rgba(16, 185, 129, ${intensity * 0.18})`
                      : `rgba(239, 68, 68, ${intensity * 0.18})`;
                    const borderColor = sector.change >= 0
                      ? `rgba(16, 185, 129, ${intensity * 0.15})`
                      : `rgba(239, 68, 68, ${intensity * 0.15})`;

                    return (
                      <div
                        key={sector.name}
                        className="p-3 rounded-lg border text-left transition-all"
                        style={{ backgroundColor: bg, borderColor }}
                      >
                        <div className="text-[10px] font-semibold text-slate-400 truncate mb-1">
                          {sector.name}
                        </div>
                        <div className={`text-base font-bold font-mono ${getChangeColor(sector.change)}`}>
                          {formatPercent(sector.change)}
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
              <div className="flex-1">
                <div className="p-4 border-b border-white/[0.06] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Gainers (Nifty 50)</h3>
                </div>
                <div className="divide-y divide-white/[0.03] overflow-x-auto">
                  <div className="min-w-[320px]">
                    {topGainers.slice(0, 5).map((stock, i) => (
                      <div key={stock.symbol} className="flex justify-between items-center px-4 py-3 hover:bg-white/[0.01] transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-slate-600 w-3">{i + 1}</span>
                          <div>
                            <span className="text-xs font-semibold text-slate-200">{stock.symbol}</span>
                            <span className="text-[10px] text-slate-500 ml-2 hidden sm:inline">{stock.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          <span className="text-xs font-mono text-slate-300">₹{formatNumber(stock.price)}</span>
                          <span className="inline-flex items-center gap-0.5 text-xs font-mono font-bold text-emerald-400 min-w-[70px] justify-end">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            +{stock.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
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
              <div className="flex-1">
                <div className="p-4 border-b border-white/[0.06] flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Losers (Nifty 50)</h3>
                </div>
                <div className="divide-y divide-white/[0.03] overflow-x-auto">
                  <div className="min-w-[320px]">
                    {topLosers.slice(0, 5).map((stock, i) => (
                      <div key={stock.symbol} className="flex justify-between items-center px-4 py-3 hover:bg-white/[0.01] transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-slate-600 w-3">{i + 1}</span>
                          <div>
                            <span className="text-xs font-semibold text-slate-200">{stock.symbol}</span>
                            <span className="text-[10px] text-slate-500 ml-2 hidden sm:inline">{stock.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          <span className="text-xs font-mono text-slate-300">₹{formatNumber(stock.price)}</span>
                          <span className="inline-flex items-center gap-0.5 text-xs font-mono font-bold text-red-400 min-w-[70px] justify-end">
                            <ArrowDownRight className="w-3.5 h-3.5" />
                            {stock.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
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
    <div className="space-y-6">
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

      {/* ===== Widgets Grid System ===== */}
      <div className="grid grid-cols-12 gap-5">
        {widgets.map((id, index) => renderWidget(id, index))}
      </div>
    </div>
  );
};

export default Dashboard;
