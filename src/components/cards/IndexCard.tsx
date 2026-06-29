import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
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
}) => {
  const isPositive = index.change >= 0;
  const changeColor = isPositive ? '#00c076' : '#ff4d4f';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-4 h-full flex flex-col justify-between"
    >
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-2 select-none">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              {index.symbol}
            </h3>
            <p className="text-[9px] text-slate-500 font-mono mt-0.5">{index.name}</p>
          </div>
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
        <div className="h-12 w-full mb-4 overflow-hidden">
          <SparklineChart
            data={index.sparkline}
            width={180}
            height={44}
            color={changeColor}
            strokeWidth={1.5}
          />
        </div>

        {/* Muted High / Low Footer Row */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-3.5 border-t border-white/[0.04] mt-auto select-none">
          <div className="flex items-center gap-1">
            <span>High</span>
            <span className="text-slate-400 font-bold">{index.high.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Low</span>
            <span className="text-slate-400 font-bold">{index.low.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IndexCard;
