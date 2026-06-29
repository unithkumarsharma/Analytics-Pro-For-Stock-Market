/**
 * Portfolio Analytics Utility Functions
 * Calculations for CAGR, Sharpe, Drawdown, Win Rate, Risk Score, etc.
 */

// ===== CAGR =====
export function calculateCAGR(
  beginningValue: number,
  endingValue: number,
  years: number
): number {
  if (beginningValue <= 0 || years <= 0) return 0;
  return (Math.pow(endingValue / beginningValue, 1 / years) - 1) * 100;
}

// ===== Sharpe Ratio =====
export function calculateSharpeRatio(
  returns: number[],
  riskFreeRate: number = 0.065 // ~6.5% India 10Y yield
): number {
  if (returns.length === 0) return 0;
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const annualizedReturn = avgReturn * 252; // 252 trading days
  const stdDev = Math.sqrt(
    returns.reduce((sum, r) => sum + (r - avgReturn) ** 2, 0) / returns.length
  );
  const annualizedStdDev = stdDev * Math.sqrt(252);
  if (annualizedStdDev === 0) return 0;
  return (annualizedReturn - riskFreeRate) / annualizedStdDev;
}

// ===== Maximum Drawdown =====
export interface DrawdownPoint {
  date: string;
  value: number;
  drawdown: number;
  peak: number;
}

export function calculateDrawdown(
  equityCurve: { date: string; value: number }[]
): DrawdownPoint[] {
  let peak = -Infinity;
  return equityCurve.map((point) => {
    if (point.value > peak) peak = point.value;
    const drawdown = ((point.value - peak) / peak) * 100;
    return { ...point, drawdown, peak };
  });
}

export function getMaxDrawdown(drawdownData: DrawdownPoint[]): number {
  return Math.min(...drawdownData.map((d) => d.drawdown));
}

// ===== Win Rate =====
export function calculateWinRate(dailyReturns: number[]): number {
  if (dailyReturns.length === 0) return 0;
  const wins = dailyReturns.filter((r) => r > 0).length;
  return (wins / dailyReturns.length) * 100;
}

// ===== Risk Score =====
export function calculateRiskScore(
  volatility: number,
  maxDrawdown: number,
  sharpe: number,
  beta: number = 1.0
): { score: number; label: string; color: string } {
  // Composite risk: higher vol + deeper drawdown + lower sharpe = higher risk
  const volScore = Math.min(volatility / 30, 1) * 30;
  const ddScore = Math.min(Math.abs(maxDrawdown) / 30, 1) * 30;
  const sharpeScore = Math.max(0, (2 - sharpe) / 2) * 20;
  const betaScore = Math.min(Math.abs(beta - 1) + 0.5, 1) * 20;
  const raw = volScore + ddScore + sharpeScore + betaScore;
  const score = Math.min(Math.round(raw), 100);

  let label: string;
  let color: string;
  if (score <= 25) { label = 'Low'; color = '#10b981'; }
  else if (score <= 50) { label = 'Moderate'; color = '#f59e0b'; }
  else if (score <= 75) { label = 'High'; color = '#f97316'; }
  else { label = 'Very High'; color = '#ef4444'; }

  return { score, label, color };
}

// ===== Generate Equity Curve =====
export function generateEquityCurve(
  days: number = 365,
  startValue: number = 2000000,
  dailyReturn: number = 0.0006,
  volatility: number = 0.012
): { date: string; value: number; dailyReturn: number }[] {
  const data: { date: string; value: number; dailyReturn: number }[] = [];
  let value = startValue;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const ret = dailyReturn + (Math.random() - 0.48) * volatility;
    const prevValue = value;
    value = value * (1 + ret);

    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(value.toFixed(2)),
      dailyReturn: ((value - prevValue) / prevValue) * 100,
    });
  }
  return data;
}

// ===== Generate Daily PnL Data =====
export function generateDailyPnL(
  days: number = 90,
  avgPnl: number = 8000,
  volatility: number = 25000
): { date: string; pnl: number }[] {
  const data: { date: string; pnl: number }[] = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const pnl = avgPnl + (Math.random() - 0.45) * volatility;
    data.push({
      date: date.toISOString().split('T')[0],
      pnl: parseFloat(pnl.toFixed(2)),
    });
  }
  return data;
}

// ===== Monthly Returns =====
export function calculateMonthlyReturns(
  equityCurve: { date: string; value: number }[]
): { month: string; return: number }[] {
  const monthly: Map<string, { first: number; last: number }> = new Map();

  equityCurve.forEach((point) => {
    const month = point.date.substring(0, 7); // YYYY-MM
    if (!monthly.has(month)) {
      monthly.set(month, { first: point.value, last: point.value });
    } else {
      monthly.get(month)!.last = point.value;
    }
  });

  const result: { month: string; return: number }[] = [];
  monthly.forEach((vals, month) => {
    result.push({
      month,
      return: parseFloat(((vals.last - vals.first) / vals.first * 100).toFixed(2)),
    });
  });

  return result;
}

// ===== CSV Export =====
export function generateHoldingsCSV(
  holdings: {
    symbol: string;
    name: string;
    shares: number;
    avgCost: number;
    currentPrice: number;
    totalValue: number;
    totalGain: number;
    gainPercent: number;
    allocation: number;
    dayChange: number;
  }[]
): string {
  const header = 'Symbol,Name,Shares,Avg Cost,Current Price,Total Value,Total Gain,Gain %,Allocation %,Day Change\n';
  const rows = holdings.map((h) =>
    `${h.symbol},"${h.name}",${h.shares},${h.avgCost},${h.currentPrice},${h.totalValue.toFixed(2)},${h.totalGain.toFixed(2)},${h.gainPercent.toFixed(2)}%,${h.allocation}%,${h.dayChange.toFixed(2)}`
  ).join('\n');
  return header + rows;
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function generatePortfolioReport(
  metrics: Record<string, string | number>
): string {
  const now = new Date().toLocaleString('en-IN');
  let report = `Analytics Pro - Portfolio Report\nGenerated: ${now}\n${'='.repeat(50)}\n\n`;

  Object.entries(metrics).forEach(([key, value]) => {
    report += `${key}: ${value}\n`;
  });

  return report;
}
