import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Globe,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';
import { TableSkeleton } from '../components/ui/Skeleton';
import { stockQuotes, marketIndices, sectorPerformance } from '../data/mockData';
import { formatNumber, formatPercent, getChangeColor } from '../utils/formatters';

const Markets: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const sectors = ['All', ...new Set(stockQuotes.map((s) => s.sector))];
  const filteredStocks = stockQuotes.filter((stock) => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'All' || stock.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-32 rounded" />
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white mb-1">Markets</h1>
        <p className="text-sm text-slate-500">Global market data and stock screener</p>
      </motion.div>

      {/* Market Index Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
        {marketIndices.map((idx, i) => (
          <motion.div
            key={idx.symbol}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-3 cursor-pointer"
          >
            <div className="text-[10px] text-slate-500 mb-1">{idx.name}</div>
            <div className="text-sm font-bold text-white font-mono">
              {formatNumber(idx.value, idx.value > 1000 ? 0 : 2)}
            </div>
            <div className={`text-xs font-mono font-semibold ${getChangeColor(idx.changePercent)}`}>
              {formatPercent(idx.changePercent)}
            </div>
            <div className="mt-2">
              <ResponsiveContainer width="100%" height={24}>
                <AreaChart data={idx.sparkline.map((v, j) => ({ v, i: j }))}>
                  <defs>
                    <linearGradient id={`idx-${idx.symbol}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={idx.changePercent >= 0 ? '#10b981' : '#ef4444'}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="100%"
                        stopColor={idx.changePercent >= 0 ? '#10b981' : '#ef4444'}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={idx.changePercent >= 0 ? '#10b981' : '#ef4444'}
                    strokeWidth={1.5}
                    fill={`url(#idx-${idx.symbol})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/30"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          {sectors.map((sector) => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedSector === sector
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-white/[0.04] text-slate-400 border border-transparent hover:bg-white/[0.06]'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      {/* Stocks Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Symbol', 'Price', 'Change', 'Volume', 'Market Cap', 'P/E', '52W High', '52W Low', 'Sector'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((stock, i) => (
                <motion.tr
                  key={stock.symbol}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
                        <span className="text-[10px] font-bold text-blue-400">
                          {stock.symbol.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{stock.symbol}</div>
                        <div className="text-[10px] text-slate-500 max-w-[120px] truncate">{stock.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono font-semibold text-slate-200">
                    ${formatNumber(stock.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-0.5 text-xs font-mono font-semibold px-2 py-1 rounded-md ${
                      stock.changePercent >= 0
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {stock.changePercent >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(stock.changePercent).toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{stock.volume}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{stock.marketCap}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{stock.pe.toFixed(1)}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">${formatNumber(stock.high52w)}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">${formatNumber(stock.low52w)}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/[0.04] text-slate-400">
                      {stock.sector}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Sector Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Sector Performance</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {sectorPerformance.map((sector) => {
            const intensity = Math.min(Math.abs(sector.change) / 3, 1);
            const bg = sector.change >= 0
              ? `rgba(16, 185, 129, ${intensity * 0.2})`
              : `rgba(239, 68, 68, ${intensity * 0.2})`;

            return (
              <div
                key={sector.name}
                className="p-3 rounded-lg border border-white/[0.04] hover:border-white/10 transition-all cursor-pointer"
                style={{ backgroundColor: bg }}
              >
                <div className="text-xs text-slate-400 mb-1 truncate">{sector.name}</div>
                <div className={`text-base font-bold font-mono ${getChangeColor(sector.change)}`}>
                  {formatPercent(sector.change)}
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {sector.leaders.map((l) => (
                    <span key={l} className="text-[9px] font-semibold px-1 py-0.5 rounded bg-white/[0.06] text-slate-500">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Markets;
