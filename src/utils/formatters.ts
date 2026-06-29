/** Format a number as currency */
export const formatCurrency = (value: number, decimals = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/** Format a number with commas */
export const formatNumber = (value: number, decimals = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/** Format large numbers (1.2B, 340M, etc.) */
export const formatCompact = (value: number): string => {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toFixed(2);
};

/** Format percentage */
export const formatPercent = (value: number, decimals = 2): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

/** Get color class based on value */
export const getChangeColor = (value: number): string => {
  if (value > 0) return 'text-emerald-400';
  if (value < 0) return 'text-red-400';
  return 'text-slate-400';
};

/** Get background color class based on value */
export const getChangeBg = (value: number): string => {
  if (value > 0) return 'bg-emerald-500/10 text-emerald-400';
  if (value < 0) return 'bg-red-500/10 text-red-400';
  return 'bg-slate-500/10 text-slate-400';
};

/** Generate random sparkline data */
export const generateSparkline = (points = 20, base = 100, volatility = 5): number[] => {
  const data: number[] = [];
  let value = base;
  for (let i = 0; i < points; i++) {
    value += (Math.random() - 0.48) * volatility;
    data.push(Math.max(0, value));
  }
  return data;
};

/** Clamp a number between min and max */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/** Simple class name joiner */
export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};
