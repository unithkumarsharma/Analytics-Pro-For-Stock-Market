import React from 'react';

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  filled?: boolean;
  strokeWidth?: number;
  className?: string;
}

export const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  width = 120,
  height = 32,
  color,
  filled = true,
  strokeWidth = 1.5,
  className = '',
}) => {
  if (!data || data.length < 2) return null;

  const isPositive = data[data.length - 1] >= data[0];
  const lineColor = color || (isPositive ? '#10b981' : '#ef4444');

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = padding + (1 - (value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const fillD = `${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;
  const gradientId = `spark-gradient-${Math.random().toString(36).slice(2)}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {filled && (
        <path d={fillD} fill={`url(#${gradientId})`} />
      )}

      <path
        d={pathD}
        fill="none"
        stroke={lineColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* End dot */}
      <circle
        cx={parseFloat(points[points.length - 1].split(',')[0])}
        cy={parseFloat(points[points.length - 1].split(',')[1])}
        r={2}
        fill={lineColor}
      />
    </svg>
  );
};

export default SparklineChart;
