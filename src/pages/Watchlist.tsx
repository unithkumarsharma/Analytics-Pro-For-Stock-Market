import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
} from 'lucide-react';
import { SparklineChart } from '../charts/SparklineChart';
import { TableSkeleton } from '../components/ui/Skeleton';
import { watchlistItems } from '../data/mockData';
import { formatNumber, formatPercent, generateSparkline } from '../utils/formatters';

const Watchlist: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState(watchlistItems);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-32 rounded" />
        <TableSkeleton />
      </div>
    );
  }

  const handleRemove = (symbol: string) => {
    setItems((prev) => prev.filter((i) => i.symbol !== symbol));
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Watchlist</h1>
          <p className="text-sm text-slate-500">{items.length} symbols tracked</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" />
          Add Symbol
        </button>
      </motion.div>

      {/* Watchlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((item, i) => {
          const sparkline = generateSparkline(30, item.price, item.price * 0.02);
          return (
            <motion.div
              key={item.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-5 group relative"
            >
              {/* Actions */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                {item.alert && (
                  <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                )}
                <button
                  onClick={() => handleRemove(item.symbol)}
                  className="p-1.5 rounded-md hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center border border-white/[0.06]">
                  <span className="text-xs font-bold text-blue-400">{item.symbol.slice(0, 2)}</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{item.symbol}</div>
                  <div className="text-[10px] text-slate-500 max-w-[140px] truncate">{item.name}</div>
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xl font-bold font-mono text-white">
                    ${formatNumber(item.price)}
                  </div>
                  <div className={`inline-flex items-center gap-0.5 text-xs font-mono font-semibold mt-1 px-2 py-0.5 rounded ${
                    item.changePercent >= 0
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {item.changePercent >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {formatPercent(item.changePercent)}
                  </div>
                </div>
                <SparklineChart data={sparkline} width={80} height={32} />
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
                <span className="text-[10px] text-slate-500">Vol: {item.volume}</span>
                {item.alert && (
                  <span className="text-[10px] text-amber-400 flex items-center gap-1">
                    <Bell className="w-3 h-3" /> Alert @ ${item.alert.toFixed(2)}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Watchlist;
