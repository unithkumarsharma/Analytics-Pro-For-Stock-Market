import React from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  BarChart3,
  Target,
  Activity,
  Zap,
} from 'lucide-react';
import { SparklineChart } from '../../charts/SparklineChart';
import type { DashboardMetric } from '../../types';

const iconMap: Record<string, React.ComponentType<any>> = {
  Wallet,
  TrendingUp,
  BarChart3,
  Target,
  Activity,
  Zap,
};

interface MetricCardProps {
  metric: DashboardMetric;
  index: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, index }) => {
  const IconComponent = iconMap[metric.icon] || Activity;
  const isPositive = metric.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="glass-card group relative overflow-hidden p-5"
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${metric.color}10, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${metric.color}15` }}
            >
              <IconComponent
                className="w-[18px] h-[18px]"
                style={{ color: metric.color }}
              />
            </div>
            <span className="text-xs font-medium text-slate-400 tracking-wide uppercase">
              {metric.label}
            </span>
          </div>
          <SparklineChart
            data={metric.sparkline}
            width={64}
            height={24}
            color={metric.color}
          />
        </div>

        {/* Value */}
        <div className="mb-1.5">
          <span className="text-2xl font-bold tracking-tight text-white">
            {metric.value}
          </span>
        </div>

        {/* Change */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold font-mono ${
              isPositive
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-red-500/10 text-red-400'
            }`}
          >
            {isPositive ? '▲' : '▼'} {Math.abs(metric.change).toFixed(2)}%
          </span>
          <span className="text-xs text-slate-500">{metric.changeLabel}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;
