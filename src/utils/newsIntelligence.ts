export interface NewsIntelligence {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  tickers: string[];
  summary: string;
  impactScore: number; // 0-100
  sector: 'Technology' | 'Financials' | 'Consumer Discretionary' | 'Energy' | 'Macro' | 'Cryptocurrency';
  companies: string[]; // full names mapped
}

export const enrichedNewsArticles: NewsIntelligence[] = [
  {
    id: '1',
    title: 'NVIDIA Surpasses Apple as Most Valuable Company After Record AI Chip Demand',
    source: 'Bloomberg',
    time: '2 min ago',
    sentiment: 'bullish',
    tickers: ['NVDA', 'AAPL'],
    summary: "NVIDIA's market capitalization reached $3.5 trillion after reporting better-than-expected earnings driven by unprecedented demand for AI accelerators.",
    impactScore: 95,
    sector: 'Technology',
    companies: ['NVIDIA Corporation', 'Apple Inc.']
  },
  {
    id: '2',
    title: 'Fed Signals Potential Rate Cut in September Amid Cooling Inflation',
    source: 'Reuters',
    time: '18 min ago',
    sentiment: 'bullish',
    tickers: ['SPX', 'TLT'],
    summary: 'Federal Reserve Chair Jerome Powell indicated that conditions may be appropriate for rate reductions as inflation continues trending toward the 2% target.',
    impactScore: 88,
    sector: 'Macro',
    companies: ['S&P 500 Index', 'iShares 20+ Year Treasury Bond ETF']
  },
  {
    id: '3',
    title: 'Tesla Recalls 1.2M Vehicles Over Autopilot Software Issue',
    source: 'CNBC',
    time: '34 min ago',
    sentiment: 'bearish',
    tickers: ['TSLA'],
    summary: 'Tesla is issuing a voluntary recall affecting 1.2 million vehicles due to a software bug in the Autopilot system that may reduce driver attention monitoring.',
    impactScore: 72,
    sector: 'Consumer Discretionary',
    companies: ['Tesla Inc.']
  },
  {
    id: '4',
    title: 'Bitcoin Approaches $100K as Institutional Adoption Accelerates',
    source: 'CoinDesk',
    time: '1 hr ago',
    sentiment: 'bullish',
    tickers: ['BTC', 'COIN', 'MSTR'],
    summary: 'Bitcoin surged past $98,000 as major financial institutions expand their cryptocurrency offerings and ETF inflows reach record levels.',
    impactScore: 84,
    sector: 'Cryptocurrency',
    companies: ['Bitcoin', 'Coinbase Global Inc.', 'MicroStrategy Inc.']
  },
  {
    id: '5',
    title: 'Apple Unveils AI-Powered iPhone Features at WWDC 2025',
    source: 'TechCrunch',
    time: '2 hr ago',
    sentiment: 'bullish',
    tickers: ['AAPL', 'GOOGL'],
    summary: 'Apple announced a suite of AI features integrated into iOS 19, including an enhanced Siri with real-time language translation and context awareness.',
    impactScore: 80,
    sector: 'Technology',
    companies: ['Apple Inc.', 'Alphabet Inc.']
  },
  {
    id: '6',
    title: 'Oil Prices Drop 3% as OPEC+ Considers Production Increase',
    source: 'Financial Times',
    time: '3 hr ago',
    sentiment: 'bearish',
    tickers: ['XOM', 'CVX', 'USO'],
    summary: 'Crude oil fell sharply after reports that OPEC+ members are discussing a production increase to address concerns about demand growth.',
    impactScore: 65,
    sector: 'Energy',
    companies: ['Exxon Mobil Corp', 'Chevron Corp', 'United States Oil Fund']
  },
  {
    id: '7',
    title: 'Microsoft Azure Revenue Growth Exceeds Expectations at 32%',
    source: 'Wall Street Journal',
    time: '4 hr ago',
    sentiment: 'bullish',
    tickers: ['MSFT', 'AMZN', 'GOOGL'],
    summary: 'Microsoft reported Azure cloud revenue growth of 32%, surpassing analyst estimates of 28%, driven by AI workload migrations.',
    impactScore: 90,
    sector: 'Technology',
    companies: ['Microsoft Corp', 'Amazon.com Inc.', 'Alphabet Inc.']
  },
  {
    id: '8',
    title: 'Global Semiconductor Shortage Expected to Ease by Q3 2026',
    source: 'Nikkei Asia',
    time: '5 hr ago',
    sentiment: 'neutral',
    tickers: ['TSM', 'INTC', 'AMD'],
    summary: 'Industry analysts predict the global chip shortage will significantly ease by the third quarter of 2026 as new fabrication facilities come online.',
    impactScore: 55,
    sector: 'Technology',
    companies: ['Taiwan Semiconductor Manufacturing', 'Intel Corporation', 'Advanced Micro Devices']
  }
];
