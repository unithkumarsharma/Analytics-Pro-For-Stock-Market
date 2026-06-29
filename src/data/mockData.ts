import type {
  MarketIndex,
  PortfolioHolding,
  StockQuote,
  WatchlistItem,
  NewsArticle,
  AISignal,
  OptionChain,
  TechnicalIndicator,
  DashboardMetric,
  SectorPerformance,
  ChartDataPoint,
} from '../types';
import { generateSparkline } from '../utils/formatters';

// ===== Dashboard Metrics =====
export const dashboardMetrics: DashboardMetric[] = [
  {
    id: 'portfolio',
    label: 'Portfolio Value',
    value: '$2,847,392.58',
    change: 2.34,
    changeLabel: '+$65,124.30 today',
    icon: 'Wallet',
    color: '#3b82f6',
    sparkline: generateSparkline(24, 2800000, 15000),
  },
  {
    id: 'pnl',
    label: 'Unrealized P&L',
    value: '+$412,847.20',
    change: 18.72,
    changeLabel: 'All-time return',
    icon: 'TrendingUp',
    color: '#10b981',
    sparkline: generateSparkline(24, 400000, 8000),
  },
  {
    id: 'dayReturn',
    label: "Today's Return",
    value: '+$65,124.30',
    change: 2.34,
    changeLabel: 'vs S&P +1.12%',
    icon: 'BarChart3',
    color: '#06b6d4',
    sparkline: generateSparkline(24, 60000, 3000),
  },
  {
    id: 'winRate',
    label: 'Win Rate',
    value: '73.4%',
    change: 4.2,
    changeLabel: '30-day rolling',
    icon: 'Target',
    color: '#8b5cf6',
    sparkline: generateSparkline(24, 73, 2),
  },
  {
    id: 'sharpe',
    label: 'Sharpe Ratio',
    value: '2.41',
    change: 0.12,
    changeLabel: 'Annualized',
    icon: 'Activity',
    color: '#f59e0b',
    sparkline: generateSparkline(24, 2.4, 0.1),
  },
  {
    id: 'alpha',
    label: 'Alpha (β-adj)',
    value: '+8.24%',
    change: 8.24,
    changeLabel: 'vs benchmark',
    icon: 'Zap',
    color: '#ec4899',
    sparkline: generateSparkline(24, 8, 0.5),
  },
];

// ===== Market Indices =====
export const marketIndices: MarketIndex[] = [
  { symbol: 'SPX', name: 'S&P 500', value: 5892.47, change: 42.18, changePercent: 0.72, sparkline: generateSparkline() },
  { symbol: 'DJI', name: 'Dow Jones', value: 43127.84, change: 318.24, changePercent: 0.74, sparkline: generateSparkline() },
  { symbol: 'IXIC', name: 'Nasdaq', value: 19847.32, change: 187.42, changePercent: 0.95, sparkline: generateSparkline() },
  { symbol: 'RUT', name: 'Russell 2000', value: 2284.91, change: -12.47, changePercent: -0.54, sparkline: generateSparkline() },
  { symbol: 'VIX', name: 'CBOE VIX', value: 14.82, change: -0.94, changePercent: -5.96, sparkline: generateSparkline(20, 15, 1) },
  { symbol: 'TNX', name: '10Y Treasury', value: 4.284, change: 0.032, changePercent: 0.75, sparkline: generateSparkline(20, 4.3, 0.05) },
  { symbol: 'DXY', name: 'US Dollar', value: 103.42, change: -0.18, changePercent: -0.17, sparkline: generateSparkline(20, 103, 0.5) },
  { symbol: 'BTC', name: 'Bitcoin', value: 98472.30, change: 2847.50, changePercent: 2.98, sparkline: generateSparkline(20, 98000, 2000) },
];

// ===== Stock Quotes =====
export const stockQuotes: StockQuote[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 234.82, change: 4.27, changePercent: 1.85, volume: '52.3M', marketCap: '3.58T', high52w: 260.10, low52w: 164.08, pe: 32.4, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corp', price: 467.21, change: 8.93, changePercent: 1.95, volume: '24.7M', marketCap: '3.47T', high52w: 498.50, low52w: 332.00, pe: 37.8, sector: 'Technology' },
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: 142.87, change: 6.42, changePercent: 4.71, volume: '312.4M', marketCap: '3.50T', high52w: 152.89, low52w: 47.32, pe: 64.2, sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 187.43, change: 2.18, changePercent: 1.18, volume: '28.1M', marketCap: '2.31T', high52w: 201.42, low52w: 130.67, pe: 26.1, sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com', price: 215.64, change: 3.47, changePercent: 1.64, volume: '42.8M', marketCap: '2.24T', high52w: 232.51, low52w: 151.61, pe: 42.7, sector: 'Consumer' },
  { symbol: 'META', name: 'Meta Platforms', price: 582.31, change: 12.84, changePercent: 2.26, volume: '18.4M', marketCap: '1.48T', high52w: 638.40, low52w: 390.42, pe: 28.9, sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 342.18, change: -8.47, changePercent: -2.42, volume: '98.7M', marketCap: '1.09T', high52w: 488.54, low52w: 138.80, pe: 89.4, sector: 'Auto' },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 248.92, change: 3.21, changePercent: 1.31, volume: '8.4M', marketCap: '714.2B', high52w: 268.90, low52w: 182.45, pe: 12.8, sector: 'Finance' },
  { symbol: 'V', name: 'Visa Inc.', price: 312.47, change: 1.89, changePercent: 0.61, volume: '6.2M', marketCap: '624.8B', high52w: 328.72, low52w: 252.70, pe: 31.4, sector: 'Finance' },
  { symbol: 'UNH', name: 'UnitedHealth', price: 524.18, change: -4.32, changePercent: -0.82, volume: '3.8M', marketCap: '484.2B', high52w: 630.73, low52w: 436.38, pe: 19.7, sector: 'Healthcare' },
  { symbol: 'XOM', name: 'Exxon Mobil', price: 108.42, change: 1.24, changePercent: 1.16, volume: '14.2M', marketCap: '453.1B', high52w: 122.34, low52w: 95.77, pe: 13.4, sector: 'Energy' },
  { symbol: 'LLY', name: 'Eli Lilly', price: 892.47, change: 18.42, changePercent: 2.11, volume: '4.2M', marketCap: '848.7B', high52w: 972.53, low52w: 544.83, pe: 124.3, sector: 'Healthcare' },
];

// ===== Portfolio Holdings =====
export const portfolioHoldings: PortfolioHolding[] = [
  { symbol: 'NVDA', name: 'NVIDIA Corp', shares: 850, avgCost: 48.20, currentPrice: 142.87, totalValue: 121439.50, totalGain: 80469.50, gainPercent: 196.53, allocation: 24.8, dayChange: 5457.00, dayChangePercent: 4.71 },
  { symbol: 'AAPL', name: 'Apple Inc.', shares: 420, avgCost: 142.50, currentPrice: 234.82, totalValue: 98624.40, totalGain: 38774.40, gainPercent: 64.81, allocation: 20.1, dayChange: 1793.40, dayChangePercent: 1.85 },
  { symbol: 'MSFT', name: 'Microsoft Corp', shares: 180, avgCost: 285.30, currentPrice: 467.21, totalValue: 84097.80, totalGain: 32743.80, gainPercent: 63.76, allocation: 17.2, dayChange: 1607.40, dayChangePercent: 1.95 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 320, avgCost: 108.40, currentPrice: 187.43, totalValue: 59977.60, totalGain: 25289.60, gainPercent: 72.93, allocation: 12.3, dayChange: 697.60, dayChangePercent: 1.18 },
  { symbol: 'AMZN', name: 'Amazon.com', shares: 200, avgCost: 128.90, currentPrice: 215.64, totalValue: 43128.00, totalGain: 17348.00, gainPercent: 67.29, allocation: 8.8, dayChange: 694.00, dayChangePercent: 1.64 },
  { symbol: 'META', name: 'Meta Platforms', shares: 55, avgCost: 312.40, currentPrice: 582.31, totalValue: 32027.05, totalGain: 14845.05, gainPercent: 86.38, allocation: 6.5, dayChange: 706.20, dayChangePercent: 2.26 },
  { symbol: 'TSLA', name: 'Tesla Inc.', shares: 120, avgCost: 198.70, currentPrice: 342.18, totalValue: 41061.60, totalGain: 17417.60, gainPercent: 73.61, allocation: 8.4, dayChange: -1016.40, dayChangePercent: -2.42 },
  { symbol: 'JPM', name: 'JPMorgan Chase', shares: 40, avgCost: 172.80, currentPrice: 248.92, totalValue: 9956.80, totalGain: 3044.80, gainPercent: 44.03, allocation: 2.0, dayChange: 128.40, dayChangePercent: 1.31 },
];

// ===== Watchlist =====
export const watchlistItems: WatchlistItem[] = [
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 184.32, change: 5.47, changePercent: 3.06, volume: '48.2M', alert: 190.00 },
  { symbol: 'CRM', name: 'Salesforce Inc.', price: 342.18, change: -2.84, changePercent: -0.82, volume: '5.4M' },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 892.47, change: 14.32, changePercent: 1.63, volume: '4.8M', alert: 900.00 },
  { symbol: 'AVGO', name: 'Broadcom Inc.', price: 184.52, change: 8.24, changePercent: 4.68, volume: '22.1M' },
  { symbol: 'COST', name: 'Costco Wholesale', price: 924.18, change: 4.72, changePercent: 0.51, volume: '2.1M' },
  { symbol: 'PLTR', name: 'Palantir Tech', price: 78.42, change: 3.84, changePercent: 5.15, volume: '84.7M', alert: 80.00 },
  { symbol: 'COIN', name: 'Coinbase Global', price: 284.53, change: 12.47, changePercent: 4.58, volume: '12.4M' },
  { symbol: 'SNOW', name: 'Snowflake Inc.', price: 168.42, change: -3.18, changePercent: -1.85, volume: '6.8M' },
  { symbol: 'CRWD', name: 'CrowdStrike', price: 372.84, change: 8.42, changePercent: 2.31, volume: '4.2M' },
  { symbol: 'SQ', name: 'Block Inc.', price: 84.27, change: 1.92, changePercent: 2.33, volume: '9.4M', alert: 85.00 },
];

// ===== News Articles =====
export const newsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'NVIDIA Surpasses Apple as Most Valuable Company After Record AI Chip Demand',
    source: 'Bloomberg',
    time: '2 min ago',
    sentiment: 'bullish',
    tickers: ['NVDA', 'AAPL'],
    summary: 'NVIDIA\'s market capitalization reached $3.5 trillion after reporting better-than-expected earnings driven by unprecedented demand for AI accelerators.',
  },
  {
    id: '2',
    title: 'Fed Signals Potential Rate Cut in September Amid Cooling Inflation',
    source: 'Reuters',
    time: '18 min ago',
    sentiment: 'bullish',
    tickers: ['SPX', 'TLT'],
    summary: 'Federal Reserve Chair Jerome Powell indicated that conditions may be appropriate for rate reductions as inflation continues trending toward the 2% target.',
  },
  {
    id: '3',
    title: 'Tesla Recalls 1.2M Vehicles Over Autopilot Software Issue',
    source: 'CNBC',
    time: '34 min ago',
    sentiment: 'bearish',
    tickers: ['TSLA'],
    summary: 'Tesla is issuing a voluntary recall affecting 1.2 million vehicles due to a software bug in the Autopilot system that may reduce driver attention monitoring.',
  },
  {
    id: '4',
    title: 'Bitcoin Approaches $100K as Institutional Adoption Accelerates',
    source: 'CoinDesk',
    time: '1 hr ago',
    sentiment: 'bullish',
    tickers: ['BTC', 'COIN', 'MSTR'],
    summary: 'Bitcoin surged past $98,000 as major financial institutions expand their cryptocurrency offerings and ETF inflows reach record levels.',
  },
  {
    id: '5',
    title: 'Apple Unveils AI-Powered iPhone Features at WWDC 2025',
    source: 'TechCrunch',
    time: '2 hr ago',
    sentiment: 'bullish',
    tickers: ['AAPL', 'GOOGL'],
    summary: 'Apple announced a suite of AI features integrated into iOS 19, including an enhanced Siri with real-time language translation and context awareness.',
  },
  {
    id: '6',
    title: 'Oil Prices Drop 3% as OPEC+ Considers Production Increase',
    source: 'Financial Times',
    time: '3 hr ago',
    sentiment: 'bearish',
    tickers: ['XOM', 'CVX', 'USO'],
    summary: 'Crude oil fell sharply after reports that OPEC+ members are discussing a production increase to address concerns about demand growth.',
  },
  {
    id: '7',
    title: 'Microsoft Azure Revenue Growth Exceeds Expectations at 32%',
    source: 'Wall Street Journal',
    time: '4 hr ago',
    sentiment: 'bullish',
    tickers: ['MSFT', 'AMZN', 'GOOGL'],
    summary: 'Microsoft reported Azure cloud revenue growth of 32%, surpassing analyst estimates of 28%, driven by AI workload migrations.',
  },
  {
    id: '8',
    title: 'Global Semiconductor Shortage Expected to Ease by Q3 2026',
    source: 'Nikkei Asia',
    time: '5 hr ago',
    sentiment: 'neutral',
    tickers: ['TSM', 'INTC', 'AMD'],
    summary: 'Industry analysts predict the global chip shortage will significantly ease by the third quarter of 2026 as new fabrication facilities come online.',
  },
];

// ===== AI Signals =====
export const aiSignals: AISignal[] = [
  { id: '1', symbol: 'NVDA', type: 'BUY', confidence: 94, strategy: 'Momentum + Volume Surge', entry: 142.87, target: 168.00, stopLoss: 132.50, riskReward: '1:2.4', timeframe: '2-4 weeks', timestamp: '2 min ago' },
  { id: '2', symbol: 'AAPL', type: 'BUY', confidence: 87, strategy: 'Golden Cross + RSI Reversal', entry: 234.82, target: 258.00, stopLoss: 224.00, riskReward: '1:2.1', timeframe: '1-3 weeks', timestamp: '15 min ago' },
  { id: '3', symbol: 'TSLA', type: 'SELL', confidence: 78, strategy: 'Head & Shoulders Breakdown', entry: 342.18, target: 298.00, stopLoss: 362.00, riskReward: '1:2.2', timeframe: '1-2 weeks', timestamp: '32 min ago' },
  { id: '4', symbol: 'META', type: 'BUY', confidence: 91, strategy: 'Ascending Triangle Breakout', entry: 582.31, target: 640.00, stopLoss: 558.00, riskReward: '1:2.4', timeframe: '2-3 weeks', timestamp: '1 hr ago' },
  { id: '5', symbol: 'AMD', type: 'BUY', confidence: 82, strategy: 'Cup & Handle Formation', entry: 184.32, target: 210.00, stopLoss: 172.00, riskReward: '1:2.1', timeframe: '3-5 weeks', timestamp: '2 hr ago' },
  { id: '6', symbol: 'AMZN', type: 'HOLD', confidence: 65, strategy: 'Consolidation Zone', entry: 215.64, target: 238.00, stopLoss: 205.00, riskReward: '1:2.1', timeframe: 'Awaiting breakout', timestamp: '3 hr ago' },
  { id: '7', symbol: 'GOOGL', type: 'BUY', confidence: 88, strategy: 'Fibonacci Retracement + MACD', entry: 187.43, target: 208.00, stopLoss: 178.00, riskReward: '1:2.2', timeframe: '2-4 weeks', timestamp: '4 hr ago' },
  { id: '8', symbol: 'JPM', type: 'BUY', confidence: 76, strategy: 'Sector Rotation Signal', entry: 248.92, target: 272.00, stopLoss: 238.00, riskReward: '1:2.1', timeframe: '3-6 weeks', timestamp: '5 hr ago' },
];

// ===== Options Chain =====
export const optionsChain: OptionChain[] = [
  { strike: 220, callBid: 16.80, callAsk: 17.10, callVolume: 12480, callOI: 45200, callIV: 28.4, callDelta: 0.82, putBid: 1.42, putAsk: 1.58, putVolume: 3240, putOI: 18400, putIV: 31.2, putDelta: -0.18 },
  { strike: 225, callBid: 12.40, callAsk: 12.70, callVolume: 18920, callOI: 62100, callIV: 27.1, callDelta: 0.74, putBid: 2.18, putAsk: 2.34, putVolume: 5480, putOI: 24800, putIV: 30.4, putDelta: -0.26 },
  { strike: 230, callBid: 8.60, callAsk: 8.85, callVolume: 24180, callOI: 78400, callIV: 26.2, callDelta: 0.64, putBid: 3.42, putAsk: 3.58, putVolume: 8920, putOI: 32400, putIV: 29.8, putDelta: -0.36 },
  { strike: 235, callBid: 5.40, callAsk: 5.62, callVolume: 32480, callOI: 94200, callIV: 25.8, callDelta: 0.52, putBid: 5.24, putAsk: 5.42, putVolume: 14200, putOI: 48200, putIV: 29.2, putDelta: -0.48 },
  { strike: 240, callBid: 3.10, callAsk: 3.28, callVolume: 28400, callOI: 82400, callIV: 25.4, callDelta: 0.38, putBid: 7.92, putAsk: 8.12, putVolume: 18400, putOI: 54200, putIV: 28.8, putDelta: -0.62 },
  { strike: 245, callBid: 1.58, callAsk: 1.72, callVolume: 18200, callOI: 58400, callIV: 25.2, callDelta: 0.24, putBid: 11.40, putAsk: 11.62, putVolume: 12400, putOI: 42200, putIV: 28.4, putDelta: -0.76 },
  { strike: 250, callBid: 0.72, callAsk: 0.84, callVolume: 12400, callOI: 42800, callIV: 25.0, callDelta: 0.14, putBid: 15.52, putAsk: 15.78, putVolume: 8200, putOI: 34800, putIV: 28.2, putDelta: -0.86 },
];

// ===== Technical Indicators =====
export const technicalIndicators: TechnicalIndicator[] = [
  { name: 'RSI (14)', value: '62.4', signal: 'buy' },
  { name: 'MACD', value: '2.84 / 1.92', signal: 'buy' },
  { name: 'Stochastic', value: '71.2 / 68.4', signal: 'buy' },
  { name: 'Williams %R', value: '-28.6', signal: 'buy' },
  { name: 'CCI (20)', value: '142.8', signal: 'buy' },
  { name: 'ADX (14)', value: '32.4', signal: 'buy' },
  { name: 'ATR (14)', value: '4.82', signal: 'neutral' },
  { name: 'SMA (20)', value: '228.40', signal: 'buy' },
  { name: 'SMA (50)', value: '218.72', signal: 'buy' },
  { name: 'SMA (200)', value: '198.40', signal: 'buy' },
  { name: 'EMA (12)', value: '231.84', signal: 'buy' },
  { name: 'EMA (26)', value: '224.18', signal: 'buy' },
  { name: 'Bollinger Bands', value: '224.2 / 234.8 / 245.4', signal: 'neutral' },
  { name: 'Ichimoku Cloud', value: 'Above Cloud', signal: 'buy' },
  { name: 'Parabolic SAR', value: '227.42', signal: 'buy' },
  { name: 'OBV', value: '142.8M', signal: 'buy' },
];

// ===== Sector Performance =====
export const sectorPerformance: SectorPerformance[] = [
  { name: 'Technology', change: 2.84, volume: '2.4B', leaders: ['NVDA', 'AAPL', 'MSFT'] },
  { name: 'Healthcare', change: 1.42, volume: '892M', leaders: ['LLY', 'UNH', 'JNJ'] },
  { name: 'Financials', change: 1.18, volume: '1.1B', leaders: ['JPM', 'V', 'MA'] },
  { name: 'Consumer Discretionary', change: 0.84, volume: '1.8B', leaders: ['AMZN', 'TSLA', 'HD'] },
  { name: 'Communication', change: 1.92, volume: '740M', leaders: ['META', 'GOOGL', 'NFLX'] },
  { name: 'Industrials', change: 0.42, volume: '620M', leaders: ['GE', 'CAT', 'RTX'] },
  { name: 'Energy', change: -1.24, volume: '840M', leaders: ['XOM', 'CVX', 'SLB'] },
  { name: 'Real Estate', change: -0.62, volume: '320M', leaders: ['PLD', 'AMT', 'EQIX'] },
  { name: 'Utilities', change: 0.18, volume: '280M', leaders: ['NEE', 'DUK', 'SO'] },
  { name: 'Materials', change: -0.34, volume: '420M', leaders: ['LIN', 'APD', 'FCX'] },
  { name: 'Consumer Staples', change: 0.24, volume: '480M', leaders: ['COST', 'PG', 'KO'] },
];

// ===== Chart Data =====
export const generateChartData = (days = 90): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  let price = 200;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const volatility = 3 + Math.random() * 4;
    const drift = 0.15;
    const open = price;
    const change = (Math.random() - 0.47) * volatility + drift;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    const volume = Math.floor(20000000 + Math.random() * 60000000);

    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });

    price = close;
  }

  return data;
};

// ===== Indian Market Data =====
import type {
  IndianIndex,
  MarketBreadth,
  IndianStock,
  IndianSectorHeatmap,
  SentimentData,
  PortfolioSummaryData,
  AIOutlook,
} from '../types';

export const niftyIndex: IndianIndex = {
  symbol: 'NIFTY 50',
  name: 'Nifty 50',
  value: 24782.45,
  change: 287.35,
  changePercent: 1.17,
  open: 24512.10,
  high: 24831.90,
  low: 24487.65,
  prevClose: 24495.10,
  sparkline: generateSparkline(30, 24500, 120),
  status: 'up',
  volume: '18.4 Cr',
  turnover: '₹1,24,847 Cr',
};

export const sensexIndex: IndianIndex = {
  symbol: 'SENSEX',
  name: 'S&P BSE Sensex',
  value: 81742.38,
  change: 984.24,
  changePercent: 1.22,
  open: 80842.50,
  high: 81924.10,
  low: 80718.30,
  prevClose: 80758.14,
  sparkline: generateSparkline(30, 80800, 400),
  status: 'up',
  volume: '4.2 Cr',
  turnover: '₹42,187 Cr',
};

export const bankNiftyIndex: IndianIndex = {
  symbol: 'BANKNIFTY',
  name: 'Nifty Bank',
  value: 53218.75,
  change: -142.80,
  changePercent: -0.27,
  open: 53412.20,
  high: 53587.40,
  low: 53048.90,
  prevClose: 53361.55,
  sparkline: generateSparkline(30, 53400, 180),
  status: 'down',
  volume: '8.7 Cr',
  turnover: '₹67,412 Cr',
};

export const marketBreadth: MarketBreadth = {
  advances: 1847,
  declines: 1423,
  unchanged: 112,
  advanceVolume: '₹84,247 Cr',
  declineVolume: '₹38,142 Cr',
  newHighs: 142,
  newLows: 28,
  bullishPercent: 56.4,
};

export const topGainers: IndianStock[] = [
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', price: 982.45, change: 48.70, changePercent: 5.22, volume: '2.8 Cr', sector: 'Auto', marketCap: '₹3,61,842 Cr', dayHigh: 991.20, dayLow: 934.80 },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', price: 3247.80, change: 142.35, changePercent: 4.58, volume: '84.2 L', sector: 'Conglomerate', marketCap: '₹3,70,284 Cr', dayHigh: 3282.40, dayLow: 3108.50 },
  { symbol: 'WIPRO', name: 'Wipro Ltd', price: 542.30, change: 22.85, changePercent: 4.40, volume: '1.4 Cr', sector: 'IT', marketCap: '₹2,82,947 Cr', dayHigh: 548.90, dayLow: 520.40 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', price: 7842.15, change: 298.40, changePercent: 3.95, volume: '42.8 L', sector: 'Finance', marketCap: '₹4,84,218 Cr', dayHigh: 7891.20, dayLow: 7548.30 },
  { symbol: 'HCLTECH', name: 'HCL Technologies', price: 1847.90, change: 62.45, changePercent: 3.50, volume: '52.4 L', sector: 'IT', marketCap: '₹5,01,247 Cr', dayHigh: 1862.40, dayLow: 1787.20 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharma Ind.', price: 1724.50, change: 54.80, changePercent: 3.28, volume: '38.7 L', sector: 'Pharma', marketCap: '₹4,13,847 Cr', dayHigh: 1738.90, dayLow: 1672.30 },
  { symbol: 'INFY', name: 'Infosys Ltd', price: 1892.40, change: 58.20, changePercent: 3.17, volume: '1.2 Cr', sector: 'IT', marketCap: '₹7,84,218 Cr', dayHigh: 1904.80, dayLow: 1838.40 },
  { symbol: 'TITAN', name: 'Titan Company', price: 3542.80, change: 98.45, changePercent: 2.86, volume: '28.4 L', sector: 'Consumer', marketCap: '₹3,14,247 Cr', dayHigh: 3568.20, dayLow: 3448.50 },
  { symbol: 'LT', name: 'Larsen & Toubro', price: 3684.20, change: 94.80, changePercent: 2.64, volume: '34.2 L', sector: 'Infra', marketCap: '₹5,06,847 Cr', dayHigh: 3712.40, dayLow: 3592.80 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', price: 12847.50, change: 318.40, changePercent: 2.54, volume: '8.4 L', sector: 'Auto', marketCap: '₹4,02,147 Cr', dayHigh: 12924.80, dayLow: 12542.30 },
];

export const topLosers: IndianStock[] = [
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1642.30, change: -48.70, changePercent: -2.88, volume: '1.8 Cr', sector: 'Banking', marketCap: '₹12,48,247 Cr', dayHigh: 1694.20, dayLow: 1628.40 },
  { symbol: 'SBIN', name: 'State Bank of India', price: 824.50, change: -22.40, changePercent: -2.65, volume: '2.4 Cr', sector: 'Banking', marketCap: '₹7,36,147 Cr', dayHigh: 848.90, dayLow: 818.20 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', price: 1284.60, change: -32.80, changePercent: -2.49, volume: '1.2 Cr', sector: 'Banking', marketCap: '₹9,02,847 Cr', dayHigh: 1318.40, dayLow: 1272.50 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mah. Bank', price: 1842.70, change: -42.30, changePercent: -2.24, volume: '48.2 L', sector: 'Banking', marketCap: '₹3,66,142 Cr', dayHigh: 1887.40, dayLow: 1832.80 },
  { symbol: 'ONGC', name: 'ONGC Ltd', price: 284.30, change: -5.80, changePercent: -2.00, volume: '1.4 Cr', sector: 'Energy', marketCap: '₹3,57,247 Cr', dayHigh: 292.40, dayLow: 282.10 },
  { symbol: 'BPCL', name: 'Bharat Petroleum', price: 342.80, change: -6.45, changePercent: -1.85, volume: '84.7 L', sector: 'Energy', marketCap: '₹1,48,642 Cr', dayHigh: 351.20, dayLow: 340.50 },
  { symbol: 'COALINDIA', name: 'Coal India Ltd', price: 482.40, change: -8.20, changePercent: -1.67, volume: '62.4 L', sector: 'Mining', marketCap: '₹2,97,247 Cr', dayHigh: 492.80, dayLow: 478.90 },
  { symbol: 'POWERGRID', name: 'Power Grid Corp', price: 324.80, change: -4.90, changePercent: -1.49, volume: '1.1 Cr', sector: 'Power', marketCap: '₹3,02,147 Cr', dayHigh: 331.40, dayLow: 322.50 },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd', price: 1148.90, change: -14.20, changePercent: -1.22, volume: '72.4 L', sector: 'Banking', marketCap: '₹3,55,247 Cr', dayHigh: 1168.40, dayLow: 1142.30 },
  { symbol: 'NTPC', name: 'NTPC Ltd', price: 382.40, change: -4.10, changePercent: -1.06, volume: '1.2 Cr', sector: 'Power', marketCap: '₹3,70,847 Cr', dayHigh: 388.20, dayLow: 380.10 },
];

export const indianSectorHeatmap: IndianSectorHeatmap[] = [
  { name: 'IT', change: 3.42, marketCap: '₹28.4L Cr', topStock: 'INFY', topStockChange: 3.17, stocks: 10, color: '#10b981' },
  { name: 'Auto', change: 2.84, marketCap: '₹14.2L Cr', topStock: 'TATAMOTORS', topStockChange: 5.22, stocks: 15, color: '#10b981' },
  { name: 'Pharma', change: 1.92, marketCap: '₹12.8L Cr', topStock: 'SUNPHARMA', topStockChange: 3.28, stocks: 10, color: '#10b981' },
  { name: 'FMCG', change: 0.84, marketCap: '₹16.4L Cr', topStock: 'HINDUNILVR', topStockChange: 1.24, stocks: 15, color: '#10b981' },
  { name: 'Metal', change: 0.42, marketCap: '₹8.7L Cr', topStock: 'TATASTEEL', topStockChange: 1.84, stocks: 15, color: '#06b6d4' },
  { name: 'Infra', change: 0.18, marketCap: '₹10.2L Cr', topStock: 'LT', topStockChange: 2.64, stocks: 30, color: '#06b6d4' },
  { name: 'Realty', change: -0.42, marketCap: '₹3.4L Cr', topStock: 'DLF', topStockChange: -0.84, stocks: 10, color: '#ef4444' },
  { name: 'Banking', change: -1.24, marketCap: '₹42.8L Cr', topStock: 'HDFCBANK', topStockChange: -2.88, stocks: 12, color: '#ef4444' },
  { name: 'Energy', change: -1.68, marketCap: '₹18.4L Cr', topStock: 'RELIANCE', topStockChange: -0.42, stocks: 10, color: '#ef4444' },
  { name: 'PSU Banks', change: -2.14, marketCap: '₹14.8L Cr', topStock: 'SBIN', topStockChange: -2.65, stocks: 12, color: '#ef4444' },
  { name: 'Media', change: 1.28, marketCap: '₹1.8L Cr', topStock: 'ZEEL', topStockChange: 2.42, stocks: 10, color: '#10b981' },
  { name: 'Consumer', change: 1.64, marketCap: '₹6.2L Cr', topStock: 'TITAN', topStockChange: 2.86, stocks: 15, color: '#10b981' },
];

export const sentimentData: SentimentData = {
  overall: 68,
  label: 'Greed',
  fiiFlow: 2847.42,
  diiFlow: 1284.30,
  putCallRatio: 0.82,
  vix: 13.42,
  vixChange: -8.24,
  advanceDecline: 1.30,
  momentum: 'bullish',
};

export const portfolioSummaryData: PortfolioSummaryData = {
  totalValue: 2847392,
  dayChange: 42187,
  dayChangePercent: 1.50,
  invested: 2248000,
  totalPnl: 599392,
  totalPnlPercent: 26.66,
  holdings: 24,
  topPerformer: { symbol: 'TATAMOTORS', changePercent: 5.22 },
  worstPerformer: { symbol: 'HDFCBANK', changePercent: -2.88 },
  sectorAllocation: [
    { name: 'IT', value: 28.4, color: '#3b82f6' },
    { name: 'Banking', value: 22.8, color: '#8b5cf6' },
    { name: 'Auto', value: 14.2, color: '#06b6d4' },
    { name: 'Pharma', value: 12.4, color: '#10b981' },
    { name: 'FMCG', value: 8.8, color: '#f59e0b' },
    { name: 'Others', value: 13.4, color: '#64748b' },
  ],
};

export const aiOutlookData: AIOutlook = {
  overallSentiment: 'Cautiously Bullish',
  confidence: 74,
  summary: 'Markets are showing strong momentum with IT and Auto sectors leading gains. Banking sector weakness is a concern, but FII inflows and declining VIX support the bullish thesis. Watch 24,800 resistance on Nifty for potential breakout.',
  keyLevels: [
    { type: 'resistance', level: 24850, label: 'Strong Resistance' },
    { type: 'resistance', level: 25000, label: 'Psychological Level' },
    { type: 'support', level: 24500, label: 'Immediate Support' },
    { type: 'support', level: 24200, label: 'Strong Support' },
  ],
  signals: [
    { indicator: 'RSI (14)', signal: 'buy', strength: 78 },
    { indicator: 'MACD', signal: 'buy', strength: 84 },
    { indicator: 'Moving Avg (50)', signal: 'buy', strength: 72 },
    { indicator: 'Bollinger Bands', signal: 'neutral', strength: 55 },
    { indicator: 'Stochastic RSI', signal: 'buy', strength: 68 },
    { indicator: 'ADX Trend', signal: 'buy', strength: 82 },
  ],
  riskFactors: [
    'Global recession fears impacting FII flows',
    'Banking sector NPAs rising modestly',
    'Crude oil prices above $85/barrel',
    'US Fed rate decision uncertainty',
  ],
  catalysts: [
    'Strong Q1 FY26 earnings season ahead',
    'FII inflows turning positive for 3rd consecutive week',
    'India VIX at 3-month low indicating stability',
    'Government infrastructure spending boost',
  ],
  prediction: 'Nifty is expected to test 25,000 levels within the next 2 weeks, supported by strong institutional buying and positive global cues. Short-term consolidation between 24,500-24,850 is likely before the breakout.',
};

