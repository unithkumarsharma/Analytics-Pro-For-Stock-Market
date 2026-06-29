import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Zap,
  Target,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Clock,
  CheckCircle2,
  Info,
  Sliders,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
} from 'lucide-react';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import { aiPredictions, AIPrediction } from '../utils/aiEngine';

const signalConfig = {
  BUY: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    icon: ArrowUpRight,
    glow: '0 0 20px rgba(16,185,129,0.08)',
    barColor: 'bg-emerald-500',
  },
  SELL: {
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    icon: ArrowDownRight,
    glow: '0 0 20px rgba(239,68,68,0.08)',
    barColor: 'bg-red-500',
  },
  HOLD: {
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    icon: Minus,
    glow: '0 0 20px rgba(245,158,11,0.08)',
    barColor: 'bg-amber-500',
  },
};

const AISignals: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'BUY' | 'SELL' | 'HOLD'>('ALL');
  const [selectedPrediction, setSelectedPrediction] = useState<AIPrediction | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Auto-select the first prediction on load
      if (aiPredictions.length > 0) {
        setSelectedPrediction(aiPredictions[0]);
      }
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  const filtered = filter === 'ALL' ? aiPredictions : aiPredictions.filter((s) => s.signal === filter);
  
  const buyCount = aiPredictions.filter((s) => s.signal === 'BUY').length;
  const sellCount = aiPredictions.filter((s) => s.signal === 'SELL').length;
  const holdCount = aiPredictions.filter((s) => s.signal === 'HOLD').length;

  const avgConfidence = Math.round(
    aiPredictions.reduce((s, a) => s + a.confidenceScore, 0) / aiPredictions.length
  );

  const avgProbability = Math.round(
    aiPredictions.reduce((s, a) => s + a.probabilityScore, 0) / aiPredictions.length
  );

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">AI Prediction Engine</h1>
          <p className="text-sm text-slate-500">Machine learning models attributions, confidence ranges and predictions</p>
        </div>
      </motion.div>

      {/* Summary Dashboard Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Predictions', value: aiPredictions.length.toString(), icon: Brain, color: '#3b82f6' },
          { label: 'Buy / Sell / Hold', value: `${buyCount} / ${sellCount} / ${holdCount}`, icon: Sliders, color: '#06b6d4' },
          { label: 'Model Confidence', value: `${avgConfidence}%`, icon: Target, color: '#8b5cf6' },
          { label: 'Directional Probability', value: `${avgProbability}%`, icon: TrendingUp, color: '#10b981' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card p-4 hover:border-white/10 transition-all"
            >
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{card.label}</span>
              </div>
              <div className="text-xl font-bold text-white font-mono">{card.value}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Signal Type Filters */}
      <div className="flex gap-2">
        {(['ALL', 'BUY', 'SELL', 'HOLD'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all border ${
              filter === f
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                : 'bg-white/[0.04] text-slate-400 border-transparent hover:bg-white/[0.06]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Primary Split View: List on Left, Explainable AI panel on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Prediction Cards List */}
        <div className="xl:col-span-2 space-y-4">
          {filtered.map((pred, i) => {
            const config = signalConfig[pred.signal];
            const TypeIcon = config.icon;
            const isSelected = selectedPrediction?.id === pred.id;

            return (
              <motion.div
                key={pred.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedPrediction(pred)}
                className={`glass-card p-5 border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected ? 'border-blue-500/40 bg-blue-500/[0.02]' : config.bg
                } hover:shadow-lg`}
                style={{ boxShadow: isSelected ? '0 0 20px rgba(59,130,246,0.06)' : config.glow }}
              >
                {/* Active Border Glow indicator */}
                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center border border-white/[0.06]">
                      <span className="text-sm font-bold text-white">{pred.symbol}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{pred.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono">Spot: ${pred.metrics.entryPrice}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                        <span>Trend: <span className="text-white font-bold">{pred.trendPrediction}</span></span>
                        <span>•</span>
                        <span>Timeframe: <span className="text-slate-400">{pred.metrics.timeframe}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Risk Badge */}
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      pred.riskScore.level === 'Low' ? 'bg-emerald-500/10 text-emerald-400' :
                      pred.riskScore.level === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {pred.riskScore.level} Risk
                    </span>

                    {/* Signal Badge */}
                    <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold ${config.bg} ${config.color}`}>
                      <TypeIcon className="w-3.5 h-3.5" />
                      {pred.signal}
                    </div>
                  </div>
                </div>

                {/* Score Indicators Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-b border-white/[0.04] py-3.5 my-3.5">
                  {/* Probability */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 font-mono uppercase">
                      <span>Direction Probability</span>
                      <span className="font-bold text-white">{pred.probabilityScore}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${pred.probabilityScore}%` }} />
                    </div>
                  </div>

                  {/* Confidence */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 font-mono uppercase">
                      <span>Model Confidence</span>
                      <span className="font-bold text-white">{pred.confidenceScore}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: `${pred.confidenceScore}%` }} />
                    </div>
                  </div>

                  {/* Risk Score */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 font-mono uppercase">
                      <span>Attributed Risk</span>
                      <span className="font-bold text-white">{pred.riskScore.score}/100</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                      <div className="h-full bg-pink-500" style={{ width: `${pred.riskScore.score}%` }} />
                    </div>
                  </div>
                </div>

                {/* Pricing Levels Details */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-3">
                  <div className="flex items-center gap-4">
                    <span>Entry: <span className="font-mono text-white font-semibold">${pred.metrics.entryPrice.toFixed(2)}</span></span>
                    <span>Target: <span className="font-mono text-emerald-400 font-semibold">${pred.metrics.targetPrice.toFixed(2)}</span></span>
                    <span>Stop: <span className="font-mono text-red-400 font-semibold">${pred.metrics.stopLoss.toFixed(2)}</span></span>
                  </div>
                  <span className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 font-bold">
                    View Attribution Details →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Explainable AI (XAI) Panel */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {selectedPrediction ? (
              <motion.div
                key={selectedPrediction.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="glass-card p-5 border border-blue-500/20"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-blue-400 animate-pulse" />
                  <h3 className="text-sm font-bold text-white">Explainable AI (XAI)</h3>
                </div>

                <div className="mb-4">
                  <span className="text-xs text-slate-500">Selected Asset</span>
                  <div className="text-base font-bold text-white">{selectedPrediction.name} ({selectedPrediction.symbol})</div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                    <span>Current Signal:</span>
                    <span className={`font-bold ${signalConfig[selectedPrediction.signal].color}`}>{selectedPrediction.signal}</span>
                  </div>
                </div>

                {/* Model Attribution Bar Chart */}
                <div className="space-y-3.5 my-5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sliders className="w-3 h-3 text-slate-500" />
                    Feature Weights & Impact
                  </div>

                  {selectedPrediction.xaiAttribution.map((feat) => (
                    <div key={feat.name} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-300 font-medium">{feat.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-slate-500">{feat.weight}%</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            feat.impact === 'positive' ? 'bg-emerald-500' :
                            feat.impact === 'negative' ? 'bg-red-500' : 'bg-slate-500'
                          }`} />
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                        <div className={`h-full ${
                          feat.impact === 'positive' ? 'bg-emerald-500/80' :
                          feat.impact === 'negative' ? 'bg-red-500/80' : 'bg-slate-500/80'
                        }`} style={{ width: `${feat.weight}%` }} />
                      </div>
                      <div className="text-[9px] text-slate-500 leading-tight">{feat.description}</div>
                    </div>
                  ))}
                </div>

                {/* Model Note / Analysis */}
                <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg mt-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 mb-1">
                    <Lightbulb className="w-3.5 h-3.5 text-blue-400" />
                    Model Decision Summary
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                    {selectedPrediction.modelNotes}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-5 text-center text-slate-500 flex flex-col items-center justify-center h-48">
                <HelpCircle className="w-8 h-8 text-slate-600 mb-2" />
                <span className="text-xs">Select an asset from the list to view model explanation attribution.</span>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default AISignals;
