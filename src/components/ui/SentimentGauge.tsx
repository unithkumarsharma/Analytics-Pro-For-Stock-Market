import React from 'react';
import { motion } from 'framer-motion';

interface SentimentGaugeProps {
  value: number; // 0-100
  label?: string;
  lowLabel?: string;
  highLabel?: string;
  size?: number;
  className?: string;
  hideLabels?: boolean;
  hideValueText?: boolean;
}

/**
 * A semicircle gauge showing market sentiment.
 */
export const SentimentGauge: React.FC<SentimentGaugeProps> = ({
  value,
  label,
  lowLabel = 'Fear',
  highLabel = 'Greed',
  size = 200,
  className = '',
  hideLabels = false,
  hideValueText = false,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  // Map 0-100 to -90° to 90° for the needle
  const needleAngle = -90 + (clampedValue / 100) * 180;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const radius = (size / 2) - 20;
  const strokeWidth = 14;

  // Semicircle arc path (from -180° to 0° → left to right)
  const startAngle = -180;
  const endAngle = 0;

  const polarToCartesian = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const start = polarToCartesian(startAngle);
  const end = polarToCartesian(endAngle);

  const arcPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;

  // Needle endpoint
  const needleRad = ((needleAngle - 90) * Math.PI) / 180;
  const needleLength = radius - 8;
  const needleX = cx + needleLength * Math.cos(needleRad);
  const needleY = cy + needleLength * Math.sin(needleRad);

  const getColor = (val: number) => {
    if (val <= 20) return '#ef4444';
    if (val <= 40) return '#f97316';
    if (val <= 60) return '#f59e0b';
    if (val <= 80) return '#84cc16';
    return '#10b981';
  };

  const getLabel = (val: number) => {
    if (val <= 20) return 'Extreme Fear';
    if (val <= 40) return 'Fear';
    if (val <= 60) return 'Neutral';
    if (val <= 80) return 'Greed';
    return 'Extreme Greed';
  };

  const color = getColor(clampedValue);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg width={size} height={size / 2 + 35} viewBox={`0 0 ${size} ${size / 2 + 35}`}>
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="25%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="75%" stopColor="#84cc16" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <filter id="gaugeShadow">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={color} floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Background arc */}
        <path
          d={arcPath}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Colored arc */}
        <motion.path
          d={arcPath}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: clampedValue / 100 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />

        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const angle = -180 + (tick / 100) * 180;
          const innerR = radius - strokeWidth / 2 - 6;
          const outerR = radius - strokeWidth / 2 - 2;
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={tick}
              x1={cx + innerR * Math.cos(rad)}
              y1={cy + innerR * Math.sin(rad)}
              x2={cx + outerR * Math.cos(rad)}
              y2={cy + outerR * Math.sin(rad)}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          );
        })}

        {/* Needle */}
        <motion.line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          filter="url(#gaugeShadow)"
          initial={{ x2: cx, y2: cy - needleLength }}
          animate={{ x2: needleX, y2: needleY }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={5} fill={color} />
        <circle cx={cx} cy={cy} r={2.5} fill="#0a0e17" />

        {/* Value text */}
        {!hideValueText && (
          <text
            x={cx}
            y={cy + 22}
            textAnchor="middle"
            fill={color}
            fontSize="24"
            fontWeight="800"
            fontFamily="Inter, sans-serif"
          >
            {clampedValue}
          </text>
        )}
      </svg>

      {/* Labels below gauge */}
      {!hideLabels && (
        <div className="flex items-center justify-between w-full px-4 -mt-1 select-none">
          <span className="text-[9px] text-slate-500 font-medium">{lowLabel}</span>
          <span
            className="text-xs font-bold"
            style={{ color }}
          >
            {label || getLabel(clampedValue)}
          </span>
          <span className="text-[9px] text-slate-500 font-medium">{highLabel}</span>
        </div>
      )}
    </div>
  );
};

export default SentimentGauge;
