// ===== Navigation Types =====
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
}

// ===== Market Data Types =====
export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  high52w: number;
  low52w: number;
  pe: number;
  sector: string;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  sparkline: number[];
}

export interface PortfolioHolding {
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
  dayChangePercent: number;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  alert?: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  tickers: string[];
  summary: string;
  imageUrl?: string;
}

export interface AISignal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  strategy: string;
  entry: number;
  target: number;
  stopLoss: number;
  riskReward: string;
  timeframe: string;
  timestamp: string;
}

export interface OptionChain {
  strike: number;
  callBid: number;
  callAsk: number;
  callVolume: number;
  callOI: number;
  callIV: number;
  callDelta: number;
  putBid: number;
  putAsk: number;
  putVolume: number;
  putOI: number;
  putIV: number;
  putDelta: number;
}

export interface TechnicalIndicator {
  name: string;
  value: string;
  signal: 'buy' | 'sell' | 'neutral';
}

export interface ChartDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: string;
  color: string;
  sparkline: number[];
}

export interface SectorPerformance {
  name: string;
  change: number;
  volume: string;
  leaders: string[];
}

// ===== Indian Market Types =====
export interface IndianIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  sparkline: number[];
  status: 'up' | 'down' | 'flat';
  volume: string;
  turnover: string;
}

export interface MarketBreadth {
  advances: number;
  declines: number;
  unchanged: number;
  advanceVolume: string;
  declineVolume: string;
  newHighs: number;
  newLows: number;
  bullishPercent: number;
}

export interface IndianStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  sector: string;
  marketCap: string;
  dayHigh: number;
  dayLow: number;
}

export interface IndianSectorHeatmap {
  name: string;
  change: number;
  marketCap: string;
  topStock: string;
  topStockChange: number;
  stocks: number;
  color: string;
}

export interface SentimentData {
  overall: number; // 0-100 (0=extreme fear, 50=neutral, 100=extreme greed)
  label: string;
  fiiFlow: number;
  diiFlow: number;
  putCallRatio: number;
  vix: number;
  vixChange: number;
  advanceDecline: number;
  momentum: 'bullish' | 'bearish' | 'neutral';
}

export interface PortfolioSummaryData {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  invested: number;
  totalPnl: number;
  totalPnlPercent: number;
  holdings: number;
  topPerformer: { symbol: string; changePercent: number };
  worstPerformer: { symbol: string; changePercent: number };
  sectorAllocation: { name: string; value: number; color: string }[];
}

export interface AIOutlook {
  overallSentiment: 'Bullish' | 'Bearish' | 'Neutral' | 'Cautiously Bullish' | 'Cautiously Bearish';
  confidence: number;
  summary: string;
  keyLevels: { type: string; level: number; label: string }[];
  signals: { indicator: string; signal: 'buy' | 'sell' | 'neutral'; strength: number }[];
  riskFactors: string[];
  catalysts: string[];
  prediction: string;
}
