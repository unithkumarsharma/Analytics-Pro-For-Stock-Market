import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  ArrowUpRight,
  Flame,
  BarChart3,
  Activity,
} from 'lucide-react';
import { IndexCard } from '../components/cards/IndexCard';
import { SentimentGauge } from '../components/ui/SentimentGauge';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import {
  ComposedChart,
  AreaChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { formatNumber } from '../utils/formatters';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeTab, setTimeTab] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | '5Y'>('1D');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

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

  // Exact mockup data values conforming to IndianIndex type
  const niftyData = {
    symbol: 'NIFTY 50',
    name: 'NSE',
    value: 24782.45,
    change: 287.35,
    changePercent: 1.17,
    status: 'up' as const,
    high: 24831.90,
    low: 24487.65,
    sparkline: [24490, 24530, 24510, 24620, 24590, 24680, 24720, 24690, 24782.45],
    volume: '28.4 Cr',
    turnover: '₹14,287 Cr',
    open: 24520.10,
    prevClose: 24495.10,
  };

  const sensexData = {
    symbol: 'SENSEX',
    name: 'BSE',
    value: 81742.38,
    change: 984.24,
    changePercent: 1.22,
    status: 'up' as const,
    high: 81924.10,
    low: 80718.30,
    sparkline: [80720, 80940, 80850, 81200, 81100, 81450, 81620, 81500, 81742.38],
    volume: '3.1 Cr',
    turnover: '₹5,412 Cr',
    open: 80920.40,
    prevClose: 80758.14,
  };

  const bankNiftyData = {
    symbol: 'BANKNIFTY',
    name: 'NSE',
    value: 53218.75,
    change: -142.80,
    changePercent: -0.27,
    status: 'down' as const,
    high: 53587.40,
    low: 53048.90,
    sparkline: [53580, 53450, 53320, 53410, 53200, 53280, 53150, 53290, 53218.75],
    volume: '12.8 Cr',
    turnover: '₹8,920 Cr',
    open: 53490.20,
    prevClose: 53361.55,
  };

  const sectorHeatmapData = [
    { name: 'IT', change: 3.42 }, // Col 1 Row 1
    { name: 'PHARMA', change: 1.92 }, // Col 2 Row 1
    { name: 'ENERGY', change: -1.68 }, // Col 3 Row 1
    { name: 'CONSUMER GOODS', change: 1.64 }, // Col 4 Row 1
    { name: 'BANKING', change: -1.24 }, // Col 1 Row 2
    { name: 'FINANCIAL SERVICES', change: 0.84 }, // Col 2 Row 2 Item 1
    { name: 'METAL', change: 0.42 }, // Col 3 Row 2 Item 1
    { name: 'INFRASTRUCTURE', change: 0.18 }, // Col 4 Row 2
    { name: 'AUTO', change: 2.84 }, // Col 2 Row 2 Item 2
    { name: 'FMCG', change: 0.84 }, // Col 3 Row 2 Item 2
  ];

  const gainersList = [
    { symbol: 'TATAMOTORS', price: 982.45, changePercent: 5.22 },
    { symbol: 'ADANIENT', price: 3247.80, changePercent: 4.58 },
    { symbol: 'WIPRO', price: 542.30, changePercent: 4.40 },
    { symbol: 'BAJFINANCE', price: 7842.15, changePercent: 3.95 },
    { symbol: 'HCLTECH', price: 1847.90, changePercent: 3.50 },
  ];

  const losersList = [
    { symbol: 'HDFCBANK', price: 1642.30, changePercent: -2.88 },
    { symbol: 'SBIN', price: 824.50, changePercent: -2.65 },
    { symbol: 'ICICIBANK', price: 1284.60, changePercent: -2.49 },
    { symbol: 'KOTAKBANK', price: 1842.70, changePercent: -2.24 },
    { symbol: 'ONGC', price: 284.30, changePercent: -2.00 },
  ];

  const marketNewsList = [
    { title: 'RBI keeps repo rate unchanged; maintains accommodative stance', source: 'Economic Times', time: '2m ago' },
    { title: 'IT stocks rally as US tech spending shows strong growth', source: 'Moneycontrol', time: '15m ago' },
    { title: 'Global markets trade mixed ahead of US Fed decision', source: 'Bloomberg', time: '35m ago' },
    { title: 'Crude oil prices fall on weak global demand outlook', source: 'CNBC TV18', time: '1h ago' },
  ];

  // Nifty 50 Candlestick composed data
  const chartData = [
    { time: '09:30', wick: [24500, 24610], body: [24520, 24580], volume: 15000, isUp: true },
    { time: '10:30', wick: [24560, 24710], body: [24580, 24690], volume: 22000, isUp: true },
    { time: '11:30', wick: [24590, 24720], body: [24690, 24610], volume: 18000, isUp: false },
    { time: '12:30', wick: [24580, 24730], body: [24610, 24680], volume: 32000, isUp: true },
    { time: '13:30', wick: [24650, 24790], body: [24680, 24740], volume: 28000, isUp: true },
    { time: '14:30', wick: [24700, 24780], body: [24740, 24710], volume: 25000, isUp: false },
    { time: '15:30', wick: [24690, 24831.90], body: [24710, 24782.45], volume: 45000, isUp: true },
  ];

  // AI Outlook forecast line data
  const aiForecastData = [
    { day: 'Day 1', price: 24782 },
    { day: 'Day 2', price: 24840 },
    { day: 'Day 3', price: 24810 },
    { day: 'Day 4', price: 24920 },
    { day: 'Day 5', price: 24960 },
    { day: 'Day 6', price: 25040 },
  ];

  // Custom heatmap styling based on weights & changes
  const getSectorStyle = (change: number) => {
    const isUp = change >= 0;
    const absVal = Math.abs(change);
    
    if (isUp) {
      if (absVal > 3.0) return { bg: '#2d7a4f', text: '#22c55e' };
      if (absVal > 2.0) return { bg: '#256641', text: '#22c55e' };
      if (absVal > 1.0) return { bg: '#1c5232', text: '#22c55e' };
      return { bg: '#143c24', text: '#22c55e' };
    } else {
      if (absVal > 1.5) return { bg: '#7a2d2d', text: '#ef4444' };
      return { bg: '#4d1a1a', text: '#ef4444' };
    }
  };

  const renderHeatmapCell = (sector: typeof sectorHeatmapData[0]) => {
    const style = getSectorStyle(sector.change);
    return (
      <div
        key={sector.name}
        className="p-2 rounded border text-left flex flex-col justify-center transition-all truncate h-full select-none hover:brightness-110 cursor-pointer"
        style={{ backgroundColor: style.bg, borderColor: '#1e2130' }}
      >
        <span className="text-[9px] font-bold text-white truncate w-full uppercase tracking-wider block">
          {sector.name}
        </span>
        <span className="text-[10px] font-bold font-mono mt-0.5 block" style={{ color: style.text }}>
          {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)}%
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
      {/* ===== Row 1: Index Cards & Market Sentiment ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ErrorBoundary>
          <IndexCard index={niftyData} />
        </ErrorBoundary>
        <ErrorBoundary>
          <IndexCard index={sensexData} />
        </ErrorBoundary>
        <ErrorBoundary>
          <IndexCard index={bankNiftyData} />
        </ErrorBoundary>
        
        {/* Market Sentiment Card */}
        <ErrorBoundary>
          <div className="glass-card p-5 flex flex-col justify-between h-full bg-[#141720] border border-[#1e2130] rounded-xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider font-mono">MARKET SENTIMENT</h3>
                <span className="text-xl font-bold text-[#22c55e] mt-1 block">Bullish</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#6b7280]">72 / 100</span>
            </div>
            
            <div className="flex-grow flex items-center justify-center my-1">
              <SentimentGauge value={72} size={110} hideLabels={true} />
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-[#1e2130] pt-3 text-[10px] font-mono select-none">
              <div>
                <span className="text-[#6b7280] block">Today</span>
                <span className="font-bold text-[#22c55e] flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> 12
                </span>
              </div>
              <div>
                <span className="text-[#6b7280] block">Yesterday</span>
                <span className="font-bold text-[#6b7280]">60 / 100</span>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </div>

      {/* ===== Row 2: Market Breadth & Sector Heatmap ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Market Breadth */}
        <div className="col-span-12 lg:col-span-5 glass-card p-5 bg-[#141720] border border-[#1e2130] rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider font-mono">MARKET BREADTH</span>
            </div>
            
            <div className="grid grid-cols-12 items-center gap-3">
              {/* Advances column */}
              <div className="col-span-3 text-left">
                <span className="text-[10px] text-[#6b7280] block uppercase font-mono tracking-wide">Advances</span>
                <span className="text-base font-extrabold text-[#22c55e] block font-mono mt-0.5">1847</span>
                <span className="text-[9px] text-[#22c55e]/70 block font-mono font-bold">(55%)</span>
              </div>

              {/* Progress gauge */}
              <div className="col-span-6 flex flex-col items-center justify-center relative">
                <SentimentGauge value={55} size={95} hideLabels={true} hideValueText={true} />
                <span className="text-[9px] font-mono text-[#6b7280] absolute bottom-[-4px] uppercase font-bold tracking-wide">
                  UNCHANGED 112 (3%)
                </span>
              </div>

              {/* Declines column */}
              <div className="col-span-3 text-right">
                <span className="text-[10px] text-[#6b7280] block uppercase font-mono tracking-wide">Declines</span>
                <span className="text-base font-extrabold text-[#ef4444] block font-mono mt-0.5">1423</span>
                <span className="text-[9px] text-[#ef4444]/70 block font-mono font-bold">(42%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sector Heatmap */}
        <div className="col-span-12 lg:col-span-7 glass-card p-5 bg-[#141720] border border-[#1e2130] rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                SECTOR HEATMAP
              </span>
              <span className="text-[9px] text-[#6b7280] font-mono uppercase tracking-wide">INDICES CHANGE</span>
            </div>

            {/* Asymmetrical columns matching weights */}
            <div className="grid grid-cols-4 gap-2 h-[120px]">
              {/* Column 1: 2 items (IT, BANKING) */}
              <div className="flex flex-col gap-2 h-full">
                <div className="flex-1 min-h-0">{renderHeatmapCell(sectorHeatmapData[0])}</div>
                <div className="flex-1 min-h-0">{renderHeatmapCell(sectorHeatmapData[4])}</div>
              </div>
              {/* Column 2: 3 items (PHARMA, FINANCIAL SERVICES, AUTO) */}
              <div className="flex flex-col gap-2 h-full">
                <div className="flex-1 min-h-0">{renderHeatmapCell(sectorHeatmapData[1])}</div>
                <div className="flex-1 min-h-0">{renderHeatmapCell(sectorHeatmapData[5])}</div>
                <div className="flex-1 min-h-0">{renderHeatmapCell(sectorHeatmapData[8])}</div>
              </div>
              {/* Column 3: 3 items (ENERGY, METAL, FMCG) */}
              <div className="flex flex-col gap-2 h-full">
                <div className="flex-1 min-h-0">{renderHeatmapCell(sectorHeatmapData[2])}</div>
                <div className="flex-1 min-h-0">{renderHeatmapCell(sectorHeatmapData[6])}</div>
                <div className="flex-1 min-h-0">{renderHeatmapCell(sectorHeatmapData[9])}</div>
              </div>
              {/* Column 4: 2 items (CONSUMER GOODS, INFRASTRUCTURE) */}
              <div className="flex flex-col gap-2 h-full">
                <div className="flex-1 min-h-0">{renderHeatmapCell(sectorHeatmapData[3])}</div>
                <div className="flex-1 min-h-0">{renderHeatmapCell(sectorHeatmapData[7])}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Row 3: Top Gainers, Top Losers, Market News ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Gainers */}
        <div className="glass-card bg-[#141720] border border-[#1e2130] rounded-xl flex flex-col justify-between">
          <div>
            <div className="px-5 py-3.5 border-b border-[#1e2130] flex items-center justify-between">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">TOP GAINERS</span>
            </div>
            <div className="divide-y divide-[#1e2130]/50">
              {gainersList.map((stock, i) => (
                <div key={stock.symbol} className="grid grid-cols-12 items-center px-5 py-2.5 text-xs h-[42px] hover:bg-white/[0.01] odd:bg-white/[0.005] transition-colors">
                  <div className="col-span-6 flex items-center gap-2 truncate">
                    <span className="text-[9px] font-mono text-[#6b7280] w-3">{i + 1}</span>
                    <span className="font-semibold text-white truncate">{stock.symbol}</span>
                  </div>
                  <div className="col-span-3 text-right font-mono text-slate-300">
                    ₹{formatNumber(stock.price)}
                  </div>
                  <div className="col-span-3 text-right font-mono font-bold text-[#22c55e]">
                    +{stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="px-5 py-3 border-t border-[#1e2130] bg-white/[0.01]">
            <span className="text-[10px] font-bold text-blue-500 hover:text-blue-400 transition-colors cursor-pointer block">
              View All Gainers &gt;
            </span>
          </div>
        </div>

        {/* Top Losers */}
        <div className="glass-card bg-[#141720] border border-[#1e2130] rounded-xl flex flex-col justify-between">
          <div>
            <div className="px-5 py-3.5 border-b border-[#1e2130] flex items-center justify-between">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider font-mono">TOP LOSERS</span>
            </div>
            <div className="divide-y divide-[#1e2130]/50">
              {losersList.map((stock, i) => (
                <div key={stock.symbol} className="grid grid-cols-12 items-center px-5 py-2.5 text-xs h-[42px] hover:bg-white/[0.01] odd:bg-white/[0.005] transition-colors">
                  <div className="col-span-6 flex items-center gap-2 truncate">
                    <span className="text-[9px] font-mono text-[#6b7280] w-3">{i + 1}</span>
                    <span className="font-semibold text-white truncate">{stock.symbol}</span>
                  </div>
                  <div className="col-span-3 text-right font-mono text-slate-300">
                    ₹{formatNumber(stock.price)}
                  </div>
                  <div className="col-span-3 text-right font-mono font-bold text-[#ef4444]">
                    {stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="px-5 py-3 border-t border-[#1e2130] bg-white/[0.01]">
            <span className="text-[10px] font-bold text-red-500 hover:text-red-400 transition-colors cursor-pointer block">
              View All Losers &gt;
            </span>
          </div>
        </div>

        {/* Market News */}
        <div className="glass-card bg-[#141720] border border-[#1e2130] rounded-xl flex flex-col justify-between">
          <div>
            <div className="px-5 py-3.5 border-b border-[#1e2130] flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                MARKET NEWS
              </span>
              <span className="text-[9px] text-blue-500 hover:text-blue-400 transition-colors cursor-pointer font-bold">View All</span>
            </div>
            <div className="divide-y divide-[#1e2130]/50 px-5">
              {marketNewsList.map((news) => (
                <div key={news.title} className="py-2.5 min-w-0">
                  <p className="text-[11px] font-semibold text-white leading-snug line-clamp-1 hover:text-blue-500 transition-colors cursor-pointer">
                    {news.title}
                  </p>
                  <div className="flex items-center justify-between text-[9px] text-[#6b7280] font-mono mt-1">
                    <span>{news.source}</span>
                    <span>{news.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Row 4: Chart View & AI Market Outlook ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Nifty 50 Chart */}
        <div className="col-span-12 lg:col-span-8 glass-card p-5 bg-[#141720] border border-[#1e2130] rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider font-mono">NIFTY 50 CHART</span>
            </div>

            <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
              <span className="text-xs font-mono font-bold text-[#22c55e]">
                24,782.45 <span className="text-[10px] font-normal font-sans text-[#6b7280]">+287.35 (1.17%)</span>
              </span>
              
              {/* Timeline switch buttons */}
              <div className="flex gap-1 bg-[#0d0f14] border border-[#1e2130] rounded p-0.5 text-[9px] font-mono select-none self-start">
                {(['1D', '1W', '1M', '3M', '1Y', '5Y'] as const).map((time) => (
                  <button
                    key={time}
                    onClick={() => setTimeTab(time)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      time === timeTab ? 'bg-blue-600 text-white font-bold' : 'text-[#6b7280] hover:text-slate-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real Candlestick with Volume composed chart */}
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid stroke="#1e2130" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={9} className="font-mono" tickLine={false} />
                <YAxis
                  yAxisId="price"
                  domain={[24400, 24900]}
                  stroke="#6b7280"
                  fontSize={9}
                  className="font-mono"
                  tickLine={false}
                  orientation="right"
                />
                <YAxis
                  yAxisId="volume"
                  domain={[0, 180000]}
                  hide={true}
                />
                <Tooltip contentStyle={{ backgroundColor: '#141720', border: '1px solid #1e2130', borderRadius: '8px' }} />
                
                {/* Candlestick Wicks */}
                <Bar yAxisId="price" dataKey="wick" barSize={1.5}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.isUp ? '#22c55e' : '#ef4444'} />
                  ))}
                </Bar>
                
                {/* Candlestick Bodies */}
                <Bar yAxisId="price" dataKey="body" barSize={10}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.isUp ? '#22c55e' : '#ef4444'} />
                  ))}
                </Bar>

                {/* Subtly Overlayed Volume Bars */}
                <Bar yAxisId="volume" dataKey="volume" barSize={12}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.isUp ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)'} />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Market Outlook */}
        <div className="col-span-12 lg:col-span-4 glass-card p-5 bg-[#141720] border border-[#1e2130] rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                AI MARKET OUTLOOK
              </span>
              <span className="text-[9px] text-blue-500 font-bold font-mono hover:text-blue-400 cursor-pointer">Confidence: 72% &gt;</span>
            </div>
            
            <div className="flex items-center justify-between mb-3 gap-2">
              <span className="text-sm font-mono font-bold text-[#22c55e] px-2 py-0.5 rounded bg-[#22c55e]/10 border border-[#22c55e]/20">
                BULLISH
              </span>

              {/* Tiny forecast chart */}
              <div className="h-[28px] w-[90px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={aiForecastData}>
                    <defs>
                      <linearGradient id="aiForecastGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={1.2} fill="url(#aiForecastGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
              Market showing strong bullish momentum with positive indicators across major sectors. Banking and IT sectors expected to lead the rally.
            </p>

            {/* Key factors */}
            <div className="border-t border-[#1e2130] pt-3.5">
              <span className="text-[9px] text-[#6b7280] uppercase tracking-wider font-mono block mb-2 font-bold">Key Factors</span>
              <div className="space-y-1.5 text-[10px] text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                  <span>Strong global cues</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                  <span>RBI policy support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                  <span>Earnings optimism</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
