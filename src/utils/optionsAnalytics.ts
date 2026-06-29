import type { OptionChain } from '../types';

export interface OptionGreeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

export interface OptionChainItem extends OptionChain {
  callChangeOI: number;
  putChangeOI: number;
  callGreeks: OptionGreeks;
  putGreeks: OptionGreeks;
}

// Compute Max Pain
export function calculateMaxPain(chain: OptionChain[]): number {
  if (chain.length === 0) return 0;
  
  let minPain = Infinity;
  let maxPainStrike = chain[0].strike;

  for (const targetStrike of chain.map(c => c.strike)) {
    let totalPain = 0;
    for (const option of chain) {
      // Payoff for Call buyers if closed at targetStrike
      const callPayoff = Math.max(0, targetStrike - option.strike) * option.callOI;
      // Payoff for Put buyers if closed at targetStrike
      const putPayoff = Math.max(0, option.strike - targetStrike) * option.putOI;
      totalPain += callPayoff + putPayoff;
    }
    if (totalPain < minPain) {
      minPain = totalPain;
      maxPainStrike = targetStrike;
    }
  }

  return maxPainStrike;
}

// Generate enriched option chain data with Greeks and Change in OI
export function getEnrichedOptionChain(chain: OptionChain[]): OptionChainItem[] {
  // Let's assume the underlying price is $235
  const underlying = 234.82;
  
  return chain.map((o) => {
    // Generate realistic Change in OI
    const callChangeOI = Math.round((o.callOI * 0.05) + (Math.random() - 0.4) * (o.callOI * 0.08));
    const putChangeOI = Math.round((o.putOI * 0.06) + (Math.random() - 0.4) * (o.putOI * 0.09));

    // Approximate Greeks based on Black-Scholes style behavior
    const d = (o.strike - underlying) / 15; // distance from ATM (-1 to 1)
    
    // Call Delta: 0 to 1
    const callDelta = Math.min(Math.max(1 / (1 + Math.exp(d)), 0.01), 0.99);
    // Put Delta: -1 to 0
    const putDelta = callDelta - 1;

    // Gamma: bell curve peaking at ATM
    const gamma = parseFloat((0.05 * Math.exp(-0.5 * d * d)).toFixed(4));

    // Vega: bell curve peaking at ATM
    const vega = parseFloat((0.45 * Math.exp(-0.5 * d * d)).toFixed(2));

    // Theta: negative decay, highest near ATM
    const callTheta = parseFloat((-0.18 * Math.exp(-0.5 * d * d) - 0.05).toFixed(2));
    const putTheta = parseFloat((-0.15 * Math.exp(-0.5 * d * d) - 0.06).toFixed(2));

    return {
      ...o,
      callChangeOI,
      putChangeOI,
      callGreeks: {
        delta: parseFloat(callDelta.toFixed(2)),
        gamma,
        theta: callTheta,
        vega
      },
      putGreeks: {
        delta: parseFloat(putDelta.toFixed(2)),
        gamma,
        theta: putTheta,
        vega
      }
    };
  });
}

// Identify Support and Resistance levels from Option Chain Open Interest
export interface OILevel {
  price: number;
  oi: number;
  type: 'support' | 'resistance';
  strength: number; // percentage of max OI
}

export function calculateSupportResistance(chain: OptionChain[]): OILevel[] {
  if (chain.length === 0) return [];

  // Find max Call OI (strongest Resistance)
  const maxCallOI = Math.max(...chain.map(o => o.callOI));
  const maxCallItem = chain.find(o => o.callOI === maxCallOI);

  // Find max Put OI (strongest Support)
  const maxPutOI = Math.max(...chain.map(o => o.putOI));
  const maxPutItem = chain.find(o => o.putOI === maxPutOI);

  const levels: OILevel[] = [];

  if (maxPutItem) {
    levels.push({
      price: maxPutItem.strike,
      oi: maxPutItem.putOI,
      type: 'support',
      strength: Math.round((maxPutItem.putOI / maxPutOI) * 100),
    });
  }

  if (maxCallItem) {
    levels.push({
      price: maxCallItem.strike,
      oi: maxCallItem.callOI,
      type: 'resistance',
      strength: Math.round((maxCallItem.callOI / maxCallOI) * 100),
    });
  }

  // Find secondary levels
  const remainingCalls = chain.filter(o => o.strike !== maxCallItem?.strike);
  if (remainingCalls.length > 0) {
    const secCallMax = Math.max(...remainingCalls.map(o => o.callOI));
    const secCallItem = remainingCalls.find(o => o.callOI === secCallMax);
    if (secCallItem && secCallItem.callOI > maxCallOI * 0.5) {
      levels.push({
        price: secCallItem.strike,
        oi: secCallItem.callOI,
        type: 'resistance',
        strength: Math.round((secCallItem.callOI / maxCallOI) * 100),
      });
    }
  }

  const remainingPuts = chain.filter(o => o.strike !== maxPutItem?.strike);
  if (remainingPuts.length > 0) {
    const secPutMax = Math.max(...remainingPuts.map(o => o.putOI));
    const secPutItem = remainingPuts.find(o => o.putOI === secPutMax);
    if (secPutItem && secPutItem.putOI > maxPutOI * 0.5) {
      levels.push({
        price: secPutItem.strike,
        oi: secPutItem.putOI,
        type: 'support',
        strength: Math.round((secPutItem.putOI / maxPutOI) * 100),
      });
    }
  }

  return levels.sort((a, b) => b.strength - a.strength);
}
