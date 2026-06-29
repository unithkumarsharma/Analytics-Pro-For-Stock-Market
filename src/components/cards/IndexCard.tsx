import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { SparklineChart } from '../../charts/SparklineChart';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import type { IndianIndex } from '../../types';

interface IndexCardProps {
  index: IndianIndex;
  delay?: number;
  accentColor?: string;
}

export const IndexCard: React.FC<IndexCardProps> = ({
  index,
  delay = 0,
  accentColor = '#3b82f6',
}) => {
  const isPositive = index.change >= 0;
  const changeColor = isPositive ? '#10b981' : '#ef4444';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card group relative overflow-hidden p-5"
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, ${accentColor}, transparent)`,
        }}
      />

      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
        style={{
          background: `radial-gradient(circle at 50% 80%, ${accentColor}08, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              <Activity className="w-4 h-4" style={{ color: accentColor }} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                {index.symbol}
              </h3>
              <p className="text-[10px] text-slate-500">{index.name}</p>
            </div>
          </div>
          <div className="live-dot" />
        </div>

        {/* Value */}
        <div className="mb-2">
          <AnimatedCounter
            value={index.value}
            decimals={2}
            formatIndian
            className="text-2xl font-bold tracking-tight text-white font-mono"
          />
        </div>

        {/* Change row */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-bold font-mono"
            style={{
              backgroundColor: `${changeColor}15`,
              color: changeColor,
            }}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {isPositive ? '+' : ''}
            {index.change.toFixed(2)} ({isPositive ? '+' : ''}
            {index.changePercent.toFixed(2)}%)
          </span>
        </div>

        {/* Sparkline */}
        <div className="mb-3">
          <SparklineChart
            data={index.sparkline}
            width={220}
            height={40}
            color={changeColor}
            strokeWidth={1.5}
          />
        </div>

        {/* OHLC Stats */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-3 border-t border-white/[0.04]">
          {[
            { label: 'Open', value: index.open },
            { label: 'Prev Close', value: index.prevClose },
            { label: 'High', value: index.high },
            { label: 'Low', value: index.low },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500">{stat.label}</span>
              <span className="text-[10px] font-mono text-slate-400">
                {stat.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500">Volume</span>
            <span className="text-[10px] font-mono text-slate-400">{index.volume}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500">Turnover</span>
            <span className="text-[10px] font-mono text-slate-400">{index.turnover}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IndexCard;
