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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatNumber } from '../utils/formatters';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
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

  // Conforming to IndianIndex type
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
    { name: 'IT', change: 3.42 }, // Col 1 Item 0
    { name: 'PHARMA', change: 1.92 }, // Col 2 Item 0
    { name: 'ENERGY', change: -1.68 }, // Col 3 Item 0
    { name: 'CONSUMER GOODS', change: 1.64 }, // Col 4 Item 0
    { name: 'BANKING', change: -1.24 }, // Col 1 Item 1
    { name: 'FINANCIAL SERVICES', change: 0.84 }, // Col 2 Item 1
    { name: 'METAL', change: 0.42 }, // Col 3 Item 1
    { name: 'INFRASTRUCTURE', change: 0.18 }, // Col 4 Item 1
    { name: 'AUTO', change: 2.84 }, // Col 2 Item 2
    { name: 'FMCG', change: 0.84 }, // Col 3 Item 2
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

  // Nifty 50 main chart mock data
  const chartTimelineData = [
    { time: '09:15', price: 24520 },
    { time: '10:00', price: 24580 },
    { time: '11:00', price: 24510 },
    { time: '12:00', price: 24640 },
    { time: '13:00', price: 24690 },
    { time: '14:00', price: 24710 },
    { time: '15:00', price: 24782 },
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

  const renderHeatmapCell = (sector: typeof sectorHeatmapData[0]) => {
    const isUp = sector.change >= 0;
    const intensity = Math.min(Math.abs(sector.change) / 2.5, 1);
    const bg = isUp
      ? `rgba(0, 192, 118, ${intensity * 0.15})`
      : `rgba(255, 77, 79, ${intensity * 0.15})`;
    const borderColor = isUp
      ? `rgba(0, 192, 118, 0.15)`
      : `rgba(255, 77, 79, 0.15)`;

    return (
      <div
        key={sector.name}
        className="p-2 rounded border text-left flex flex-col justify-center transition-all truncate h-full"
        style={{ backgroundColor: bg, borderColor }}
      >
        <span className="text-[8px] font-bold text-slate-400 truncate w-full uppercase tracking-wider block">
          {sector.name}
        </span>
        <span className={`text-[10px] font-bold font-mono ${isUp ? 'text-[#00c076]' : 'text-[#ff4d4f]'} mt-0.5 block`}>
          {isUp ? '+' : ''}{sector.change.toFixed(2)}%
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* ===== Row 1: Index Cards & Market Sentiment ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <ErrorBoundary>
          <IndexCard index={niftyData} accentColor="#2563eb" />
        </ErrorBoundary>
        <ErrorBoundary>
          <IndexCard index={sensexData} accentColor="#7c3aed" />
        </ErrorBoundary>
        <ErrorBoundary>
          <IndexCard index={bankNiftyData} accentColor="#0891b2" />
        </ErrorBoundary>
        
        {/* Market Sentiment Card */}
        <ErrorBoundary>
          <div className="glass-card p-4 flex flex-col justify-between h-full bg-[#161925] border border-white/[0.08] rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Market Sentiment</h3>
                <span className="text-sm font-bold text-[#00c076] mt-0.5 block">Bullish</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-200">72 / 100</span>
            </div>
            
            <div className="flex-1 flex items-center justify-center my-1.5">
              <SentimentGauge value={72} size={110} label="Greed" />
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-white/[0.04] pt-2.5 text-[9px] font-mono select-none">
              <div>
                <span className="text-slate-500 block">Today</span>
                <span className="font-bold text-[#00c076] flex items-center gap-0.5">
                  <ArrowUpRight className="w-2.5 h-2.5" /> 12
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Yesterday</span>
                <span className="font-bold text-slate-400">60 / 100</span>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </div>

      {/* ===== Row 2: Market Breadth & Sector Heatmap ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Market Breadth */}
        <div className="col-span-12 lg:col-span-5 glass-card p-4 bg-[#161925] border border-white/[0.08] rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Market Breadth</span>
              <span className="text-[9px] font-mono text-slate-500">3382 STOCKS</span>
            </div>
            
            <div className="grid grid-cols-12 items-center gap-3">
              {/* Advances column */}
              <div className="col-span-3 text-left">
                <span className="text-[9px] text-slate-500 block uppercase font-mono">Advances</span>
                <span className="text-sm font-extrabold text-[#00c076] block font-mono mt-0.5">1847</span>
                <span className="text-[9px] text-slate-400 block font-mono">(55%)</span>
              </div>

              {/* Progress gauge */}
              <div className="col-span-6 flex flex-col items-center justify-center relative">
                <SentimentGauge value={55} size={90} label="Advances" />
                <span className="text-[9px] font-mono text-slate-500 absolute bottom-[-4px]">UNCHANGED 112 (3%)</span>
              </div>

              {/* Declines column */}
              <div className="col-span-3 text-right">
                <span className="text-[9px] text-slate-500 block uppercase font-mono">Declines</span>
                <span className="text-sm font-extrabold text-[#ff4d4f] block font-mono mt-0.5">1423</span>
                <span className="text-[9px] text-slate-400 block font-mono">(42%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sector Heatmap */}
        <div className="col-span-12 lg:col-span-7 glass-card p-4 bg-[#161925] border border-white/[0.08] rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Sector Heatmap
              </span>
              <span className="text-[9px] text-slate-500 font-mono uppercase">INDICES CHANGE</span>
            </div>

            {/* Asymmetrical columns matching mockup exactly */}
            <div className="grid grid-cols-4 gap-2 h-[116px]">
              {/* Column 1: 2 items (IT, BANKING) */}
              <div className="grid grid-rows-2 gap-2 h-full">
                {[sectorHeatmapData[0], sectorHeatmapData[4]].map(renderHeatmapCell)}
              </div>
              {/* Column 2: 3 items (PHARMA, FINANCIAL SERVICES, AUTO) */}
              <div className="grid grid-rows-3 gap-2 h-full">
                {[sectorHeatmapData[1], sectorHeatmapData[5], sectorHeatmapData[8]].map(renderHeatmapCell)}
              </div>
              {/* Column 3: 3 items (ENERGY, METAL, FMCG) */}
              <div className="grid grid-rows-3 gap-2 h-full">
                {[sectorHeatmapData[2], sectorHeatmapData[6], sectorHeatmapData[9]].map(renderHeatmapCell)}
              </div>
              {/* Column 4: 2 items (CONSUMER GOODS, INFRASTRUCTURE) */}
              <div className="grid grid-rows-2 gap-2 h-full">
                {[sectorHeatmapData[3], sectorHeatmapData[7]].map(renderHeatmapCell)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Row 3: Top Gainers, Top Losers, Market News ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Top Gainers */}
        <div className="glass-card bg-[#161925] border border-white/[0.08] rounded-lg flex flex-col justify-between">
          <div>
            <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Top Gainers</span>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {gainersList.map((stock, i) => (
                <div key={stock.symbol} className="grid grid-cols-12 items-center px-4 py-2 text-[11px] h-[40px]">
                  <div className="col-span-6 flex items-center gap-2 truncate">
                    <span className="text-[9px] font-mono text-slate-600 w-3">{i + 1}</span>
                    <span className="font-semibold text-slate-200 truncate">{stock.symbol}</span>
                  </div>
                  <div className="col-span-3 text-right font-mono text-slate-300">
                    ₹{formatNumber(stock.price)}
                  </div>
                  <div className="col-span-3 text-right font-mono font-bold text-[#00c076]">
                    +{stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="px-4 py-2 border-t border-white/[0.04] bg-white/[0.01]">
            <span className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer block">
              View All Gainers &gt;
            </span>
          </div>
        </div>

        {/* Top Losers */}
        <div className="glass-card bg-[#161925] border border-white/[0.08] rounded-lg flex flex-col justify-between">
          <div>
            <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Top Losers</span>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {losersList.map((stock, i) => (
                <div key={stock.symbol} className="grid grid-cols-12 items-center px-4 py-2 text-[11px] h-[40px]">
                  <div className="col-span-6 flex items-center gap-2 truncate">
                    <span className="text-[9px] font-mono text-slate-600 w-3">{i + 1}</span>
                    <span className="font-semibold text-slate-200 truncate">{stock.symbol}</span>
                  </div>
                  <div className="col-span-3 text-right font-mono text-slate-300">
                    ₹{formatNumber(stock.price)}
                  </div>
                  <div className="col-span-3 text-right font-mono font-bold text-[#ff4d4f]">
                    {stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="px-4 py-2 border-t border-white/[0.04] bg-white/[0.01]">
            <span className="text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer block">
              View All Losers &gt;
            </span>
          </div>
        </div>

        {/* Market News */}
        <div className="glass-card bg-[#161925] border border-white/[0.08] rounded-lg flex flex-col justify-between">
          <div>
            <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                Market News
              </span>
              <span className="text-[9px] text-blue-400 hover:text-blue-300 transition-colors cursor-pointer font-bold">View All</span>
            </div>
            <div className="divide-y divide-white/[0.03] px-4">
              {marketNewsList.map((news) => (
                <div key={news.title} className="py-2 min-w-0">
                  <p className="text-[11px] font-semibold text-slate-200 leading-snug line-clamp-1 hover:text-blue-400 transition-colors cursor-pointer">
                    {news.title}
                  </p>
                  <div className="flex items-center gap-2 text-[9px] text-slate-500 font-mono mt-0.5">
                    <span>{news.source}</span>
                    <span>•</span>
                    <span>{news.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Row 4: Chart View & AI Market Outlook ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Nifty 50 Chart */}
        <div className="col-span-12 lg:col-span-8 glass-card p-4 bg-[#161925] border border-white/[0.08] rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">NIFTY 50 CHART</span>
              <span className="text-xs font-mono font-bold text-[#00c076] ml-2">
                24,782.45 <span className="text-[10px] font-normal font-sans text-slate-400">+287.35 (1.17%)</span>
              </span>
            </div>
            
            {/* Timeline switch buttons */}
            <div className="flex gap-1.5 bg-[#11131c] border border-white/[0.06] rounded p-0.5 text-[10px] font-mono select-none self-start">
              {['1D', '1W', '1M', '3M', '1Y', '5Y'].map((time) => (
                <button
                  key={time}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    time === '1D' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[148px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartTimelineData}>
                <defs>
                  <linearGradient id="niftyMainGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00c076" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#00c076" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={9} className="font-mono" tickLine={false} />
                <YAxis domain={['dataMin - 50', 'dataMax + 50']} stroke="#475569" fontSize={9} className="font-mono" tickLine={false} orientation="right" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1d27', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px' }} />
                <Area type="monotone" dataKey="price" stroke="#00c076" strokeWidth={1.5} fill="url(#niftyMainGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Market Outlook */}
        <div className="col-span-12 lg:col-span-4 glass-card p-4 bg-[#161925] border border-white/[0.08] rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                AI Market Outlook
              </span>
              <span className="text-[9px] text-[#00c076] font-bold font-mono">Confidence: 72% &gt;</span>
            </div>
            
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-xs font-mono font-bold text-[#00c076] px-1.5 py-0.5 rounded bg-[#00c076]/10 border border-[#00c076]/20">
                BULLISH
              </span>
            </div>

            {/* Tiny forecast chart */}
            <div className="h-[56px] w-full mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={aiForecastData}>
                  <defs>
                    <linearGradient id="aiForecastGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00c076" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#00c076" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="price" stroke="#00c076" strokeWidth={1.2} fill="url(#aiForecastGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Key factors */}
            <div className="border-t border-white/[0.04] pt-2">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider font-mono block mb-1">Key Factors</span>
              <div className="space-y-0.5 text-[10px] text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00c076] shrink-0" />
                  <span>Strong global cues</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00c076] shrink-0" />
                  <span>RBI policy support</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00c076] shrink-0" />
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
