export interface XAIFeature {
  name: string;
  weight: number; // percentage (0-100)
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface AIPrediction {
  id: string;
  symbol: string;
  name: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  trendPrediction: 'Uptrend' | 'Downtrend' | 'Consolidating';
  probabilityScore: number; // 0-100 % chance of trend prediction holding true
  confidenceScore: number; // 0-100 % confidence in model estimation
  riskScore: {
    score: number; // 0-100
    level: 'Low' | 'Medium' | 'High';
  };
  metrics: {
    entryPrice: number;
    targetPrice: number;
    stopLoss: number;
    timeframe: string;
  };
  xaiAttribution: XAIFeature[]; // Explainable AI attribution weights
  modelNotes: string;
}

export const aiPredictions: AIPrediction[] = [
  {
    id: '1',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    signal: 'BUY',
    trendPrediction: 'Uptrend',
    probabilityScore: 88,
    confidenceScore: 92,
    riskScore: { score: 75, level: 'High' },
    metrics: { entryPrice: 142.87, targetPrice: 168.00, stopLoss: 132.50, timeframe: '2-4 weeks' },
    xaiAttribution: [
      { name: 'Technicals (EMA/MACD)', weight: 35, impact: 'positive', description: 'Strong golden cross and high volume support' },
      { name: 'Sentiment (News/Social)', weight: 28, impact: 'positive', description: 'Extremely bullish tech blog/news mentions' },
      { name: 'Institutional Flow', weight: 22, impact: 'positive', description: 'Heavy block trade purchase signals' },
      { name: 'Fundamental Outlook', weight: 15, impact: 'positive', description: 'Q3 earnings projections revised upwards' }
    ],
    modelNotes: 'Attributed to strong AI sector momentum and positive block trade signals. Watch stop loss level closely at $132.50.'
  },
  {
    id: '2',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    signal: 'BUY',
    trendPrediction: 'Uptrend',
    probabilityScore: 78,
    confidenceScore: 87,
    riskScore: { score: 32, level: 'Low' },
    metrics: { entryPrice: 234.82, targetPrice: 258.00, stopLoss: 224.00, timeframe: '1-3 weeks' },
    xaiAttribution: [
      { name: 'Technicals (EMA/MACD)', weight: 40, impact: 'positive', description: 'Rebound from EMA 50 support line' },
      { name: 'Institutional Flow', weight: 25, impact: 'positive', description: 'Steady accumulation by long-term funds' },
      { name: 'Fundamental Outlook', weight: 20, impact: 'neutral', description: 'Device demand in line with estimations' },
      { name: 'Sentiment (News/Social)', weight: 15, impact: 'positive', description: 'Stable positive feedback loop from developer conference' }
    ],
    modelNotes: 'Solid entry signal with high probability and low volatility risk profile. Favorable risk-reward ratio.'
  },
  {
    id: '3',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    signal: 'SELL',
    trendPrediction: 'Downtrend',
    probabilityScore: 82,
    confidenceScore: 78,
    riskScore: { score: 85, level: 'High' },
    metrics: { entryPrice: 342.18, targetPrice: 298.00, stopLoss: 362.00, timeframe: '1-2 weeks' },
    xaiAttribution: [
      { name: 'Technicals (EMA/MACD)', weight: 45, impact: 'negative', description: 'Head & Shoulders pattern confirmed on daily chart' },
      { name: 'Sentiment (News/Social)', weight: 25, impact: 'negative', description: 'Increased regulatory mentions and social media bearishness' },
      { name: 'Fundamental Outlook', weight: 18, impact: 'neutral', description: 'Margins slightly pressured under competition' },
      { name: 'Institutional Flow', weight: 12, impact: 'negative', description: 'Minor distribution signals from major holders' }
    ],
    modelNotes: 'Strong breakdown pattern accompanied by rising volume. Sell signal active with target at $298.00.'
  },
  {
    id: '4',
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    signal: 'BUY',
    trendPrediction: 'Uptrend',
    probabilityScore: 85,
    confidenceScore: 91,
    riskScore: { score: 48, level: 'Medium' },
    metrics: { entryPrice: 582.31, targetPrice: 640.00, stopLoss: 558.00, timeframe: '2-3 weeks' },
    xaiAttribution: [
      { name: 'Fundamental Outlook', weight: 35, impact: 'positive', description: 'Ad monetization rates beating prior forecast' },
      { name: 'Technicals (EMA/MACD)', weight: 30, impact: 'positive', description: 'Ascending triangle breakout confirmation' },
      { name: 'Sentiment (News/Social)', weight: 20, impact: 'positive', description: 'Positive PR regarding new open-source models' },
      { name: 'Institutional Flow', weight: 15, impact: 'positive', description: 'Options sweeps observed in calls' }
    ],
    modelNotes: 'Breakout above horizontal resistance confirmed. Strong ad revenue attribution supporting the move.'
  },
  {
    id: '5',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    signal: 'BUY',
    trendPrediction: 'Uptrend',
    probabilityScore: 74,
    confidenceScore: 80,
    riskScore: { score: 35, level: 'Low' },
    metrics: { entryPrice: 187.43, targetPrice: 208.00, stopLoss: 178.00, timeframe: '2-4 weeks' },
    xaiAttribution: [
      { name: 'Technicals (EMA/MACD)', weight: 40, impact: 'positive', description: 'Oversold bounce on 14-day RSI indicator' },
      { name: 'Fundamental Outlook', weight: 25, impact: 'positive', description: 'Steady cloud service margin expansion' },
      { name: 'Institutional Flow', weight: 20, impact: 'neutral', description: 'Balanced institutional buy/sell flows' },
      { name: 'Sentiment (News/Social)', weight: 15, impact: 'neutral', description: 'Average general press and search index interest' }
    ],
    modelNotes: 'RSI divergence and support zone confluence. Low risk/reward entry point for long positions.'
  },
  {
    id: '6',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    signal: 'HOLD',
    trendPrediction: 'Consolidating',
    probabilityScore: 65,
    confidenceScore: 68,
    riskScore: { score: 25, level: 'Low' },
    metrics: { entryPrice: 215.64, targetPrice: 238.00, stopLoss: 205.00, timeframe: 'Awaiting breakout' },
    xaiAttribution: [
      { name: 'Technicals (EMA/MACD)', weight: 50, impact: 'neutral', description: 'Price channel consolidation with declining volatility' },
      { name: 'Fundamental Outlook', weight: 20, impact: 'neutral', description: 'Operating income aligned with consensus' },
      { name: 'Sentiment (News/Social)', weight: 15, impact: 'neutral', description: 'No major news catalyst pending' },
      { name: 'Institutional Flow', weight: 15, impact: 'neutral', description: 'Low institutional volume' }
    ],
    modelNotes: 'Trading in a tight sideways range. Hold position until a clear breakout/breakdown occurs.'
  }
];
