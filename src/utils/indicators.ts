/**
 * Technical Indicator Calculations
 * All functions operate on arrays of closing prices (or OHLCV data)
 * and return arrays of the same length (with null for insufficient data).
 */

import type { ChartDataPoint } from '../types';

// ===== Exponential Moving Average =====
export function calculateEMA(data: number[], period: number): (number | null)[] {
  if (data.length < period) return new Array(data.length).fill(null);

  const result: (number | null)[] = new Array(data.length).fill(null);
  const multiplier = 2 / (period + 1);

  // Seed with SMA
  let sum = 0;
  for (let i = 0; i < period; i++) sum += data[i];
  result[period - 1] = sum / period;

  for (let i = period; i < data.length; i++) {
    result[i] = (data[i] - (result[i - 1] as number)) * multiplier + (result[i - 1] as number);
  }
  return result;
}

// ===== Simple Moving Average =====
export function calculateSMA(data: number[], period: number): (number | null)[] {
  if (data.length < period) return new Array(data.length).fill(null);

  const result: (number | null)[] = new Array(data.length).fill(null);
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    sum += data[i];
    if (i >= period) sum -= data[i - period];
    if (i >= period - 1) result[i] = sum / period;
  }
  return result;
}

// ===== Relative Strength Index (RSI) =====
export function calculateRSI(data: number[], period: number = 14): (number | null)[] {
  if (data.length < period + 1) return new Array(data.length).fill(null);

  const result: (number | null)[] = new Array(data.length).fill(null);
  const gains: number[] = [];
  const losses: number[] = [];

  // Calculate initial gains/losses
  for (let i = 1; i <= period; i++) {
    const change = data[i] - data[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
  }

  let avgGain = gains.reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.reduce((a, b) => a + b, 0) / period;

  if (avgLoss === 0) {
    result[period] = 100;
  } else {
    const rs = avgGain / avgLoss;
    result[period] = 100 - 100 / (1 + rs);
  }

  // Subsequent values use smoothed averages
  for (let i = period + 1; i < data.length; i++) {
    const change = data[i] - data[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    if (avgLoss === 0) {
      result[i] = 100;
    } else {
      const rs = avgGain / avgLoss;
      result[i] = 100 - 100 / (1 + rs);
    }
  }

  return result;
}

// ===== MACD =====
export interface MACDResult {
  macd: (number | null)[];
  signal: (number | null)[];
  histogram: (number | null)[];
}

export function calculateMACD(
  data: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
): MACDResult {
  const emaFast = calculateEMA(data, fastPeriod);
  const emaSlow = calculateEMA(data, slowPeriod);

  const macd: (number | null)[] = new Array(data.length).fill(null);
  const macdValues: number[] = [];

  for (let i = 0; i < data.length; i++) {
    if (emaFast[i] !== null && emaSlow[i] !== null) {
      macd[i] = (emaFast[i] as number) - (emaSlow[i] as number);
      macdValues.push(macd[i] as number);
    }
  }

  // Signal line = EMA(9) of MACD values
  const signalEMA = calculateEMA(macdValues, signalPeriod);

  // Map signal values back to full-length array
  const signal: (number | null)[] = new Array(data.length).fill(null);
  const histogram: (number | null)[] = new Array(data.length).fill(null);
  let signalIdx = 0;

  for (let i = 0; i < data.length; i++) {
    if (macd[i] !== null) {
      if (signalEMA[signalIdx] !== null) {
        signal[i] = signalEMA[signalIdx];
        histogram[i] = (macd[i] as number) - (signalEMA[signalIdx] as number);
      }
      signalIdx++;
    }
  }

  return { macd, signal, histogram };
}

// ===== Bollinger Bands =====
export interface BollingerBandsResult {
  upper: (number | null)[];
  middle: (number | null)[];
  lower: (number | null)[];
}

export function calculateBollingerBands(
  data: number[],
  period = 20,
  stdDevMultiplier = 2
): BollingerBandsResult {
  const sma = calculateSMA(data, period);
  const upper: (number | null)[] = new Array(data.length).fill(null);
  const lower: (number | null)[] = new Array(data.length).fill(null);

  for (let i = period - 1; i < data.length; i++) {
    if (sma[i] === null) continue;
    const mean = sma[i] as number;

    let sumSquaredDiff = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sumSquaredDiff += (data[j] - mean) ** 2;
    }
    const stdDev = Math.sqrt(sumSquaredDiff / period);

    upper[i] = mean + stdDevMultiplier * stdDev;
    lower[i] = mean - stdDevMultiplier * stdDev;
  }

  return { upper, middle: sma, lower };
}

// ===== Fibonacci Retracement =====
export interface FibLevel {
  ratio: number;
  price: number;
  label: string;
}

export function calculateFibonacciLevels(high: number, low: number): FibLevel[] {
  const range = high - low;
  return [
    { ratio: 0, price: high, label: '0.0%' },
    { ratio: 0.236, price: high - range * 0.236, label: '23.6%' },
    { ratio: 0.382, price: high - range * 0.382, label: '38.2%' },
    { ratio: 0.5, price: high - range * 0.5, label: '50.0%' },
    { ratio: 0.618, price: high - range * 0.618, label: '61.8%' },
    { ratio: 0.786, price: high - range * 0.786, label: '78.6%' },
    { ratio: 1, price: low, label: '100.0%' },
  ];
}

// ===== Trend Detection =====
export interface TrendInfo {
  direction: 'Bullish' | 'Bearish' | 'Sideways';
  strength: 'Strong' | 'Moderate' | 'Weak';
  description: string;
  emaAlignment: string;
  priceVsEma20: 'above' | 'below';
  priceVsEma200: 'above' | 'below';
  goldenCross: boolean;
  deathCross: boolean;
}

export function detectTrend(
  closes: number[],
  ema20: (number | null)[],
  ema50: (number | null)[],
  ema200: (number | null)[]
): TrendInfo {
  const last = closes.length - 1;
  const price = closes[last];
  const e20 = ema20[last] as number | null;
  const e50 = ema50[last] as number | null;
  const e200 = ema200[last] as number | null;

  let direction: TrendInfo['direction'] = 'Sideways';
  let strength: TrendInfo['strength'] = 'Weak';
  let emaAlignment = 'Mixed';
  let description = '';
  let goldenCross = false;
  let deathCross = false;

  if (e20 && e50 && e200) {
    // Check EMA alignment
    if (e20 > e50 && e50 > e200) {
      emaAlignment = 'Bullish (20 > 50 > 200)';
      direction = 'Bullish';
      strength = price > e20 ? 'Strong' : 'Moderate';
    } else if (e20 < e50 && e50 < e200) {
      emaAlignment = 'Bearish (20 < 50 < 200)';
      direction = 'Bearish';
      strength = price < e20 ? 'Strong' : 'Moderate';
    } else {
      emaAlignment = 'Mixed / Transitioning';
      direction = 'Sideways';
      strength = 'Weak';
    }

    // Golden/Death Cross detection (EMA 50 vs EMA 200)
    if (last >= 1) {
      const prevE50 = ema50[last - 1];
      const prevE200 = ema200[last - 1];
      if (prevE50 !== null && prevE200 !== null) {
        if (prevE50 < prevE200 && e50 > e200) goldenCross = true;
        if (prevE50 > prevE200 && e50 < e200) deathCross = true;
      }
    }

    description = direction === 'Bullish'
      ? `Price trading above all EMAs with ${strength.toLowerCase()} upward momentum. ${goldenCross ? 'Golden Cross detected!' : 'EMA alignment confirms uptrend.'}`
      : direction === 'Bearish'
      ? `Price trading below key EMAs with ${strength.toLowerCase()} downward pressure. ${deathCross ? 'Death Cross detected!' : 'Bearish EMA alignment in effect.'}`
      : 'Price consolidating between moving averages. Await directional breakout for confirmation.';
  } else {
    description = 'Insufficient data for full trend analysis. Waiting for EMA calculations.';
  }

  return {
    direction,
    strength,
    description,
    emaAlignment,
    priceVsEma20: e20 ? (price > e20 ? 'above' : 'below') : 'above',
    priceVsEma200: e200 ? (price > e200 ? 'above' : 'below') : 'above',
    goldenCross,
    deathCross,
  };
}

// ===== Enhanced Chart Data Generator =====
export function generateTechnicalData(
  days: number,
  basePrice: number = 24400,
  volatilityPct: number = 0.008
): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  let price = basePrice;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const volatility = price * volatilityPct;
    const drift = price * 0.0003; // slight upward bias
    const open = price;
    const change = (Math.random() - 0.47) * volatility * 2 + drift;
    const close = open + change;
    const intraRange = volatility * (0.5 + Math.random());
    const high = Math.max(open, close) + Math.random() * intraRange;
    const low = Math.min(open, close) - Math.random() * intraRange;
    const volume = Math.floor(8000000 + Math.random() * 24000000);

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
}
