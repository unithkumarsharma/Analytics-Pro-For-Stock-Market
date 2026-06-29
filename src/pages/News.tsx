import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  ExternalLink,
  Filter,
  Search,
  Building2,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import { enrichedNewsArticles } from '../utils/newsIntelligence';


const sentimentConfig = {
  bullish: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: TrendingUp, label: 'Bullish' },
  bearish: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: TrendingDown, label: 'Bearish' },
  neutral: { color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20', icon: Minus, label: 'Neutral' },
};

const News: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState<'all' | 'bullish' | 'bearish' | 'neutral'>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  // Compute unique sectors
  const sectors = useMemo(() => {
    const set = new Set<string>();
    enrichedNewsArticles.forEach((article) => set.add(article.sector));
    return ['all', ...Array.from(set)];
  }, []);

  // Filter articles based on search, sentiment, and sector
  const filteredArticles = useMemo(() => {
    return enrichedNewsArticles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tickers.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        article.companies.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSentiment = selectedSentiment === 'all' || article.sentiment === selectedSentiment;
      const matchesSector = selectedSector === 'all' || article.sector === selectedSector;

      return matchesSearch && matchesSentiment && matchesSector;
    });
  }, [searchQuery, selectedSentiment, selectedSector]);

  // Aggregate statistics
  const bullishCount = useMemo(() => enrichedNewsArticles.filter((a) => a.sentiment === 'bullish').length, []);
  const bearishCount = useMemo(() => enrichedNewsArticles.filter((a) => a.sentiment === 'bearish').length, []);
  const neutralCount = useMemo(() => enrichedNewsArticles.filter((a) => a.sentiment === 'neutral').length, []);
  const avgImpact = useMemo(() => {
    const sum = enrichedNewsArticles.reduce((s, a) => s + a.impactScore, 0);
    return enrichedNewsArticles.length ? Math.round(sum / enrichedNewsArticles.length) : 0;
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">News Intelligence Center</h1>
          <p className="text-sm text-slate-500">Real-time market sentiment intelligence, company mappings, and macroeconomic impact scores</p>
        </div>
      </motion.div>

      {/* Intelligence Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Bullish Catalysts', value: bullishCount, icon: TrendingUp, color: '#10b981', bg: 'bg-emerald-500/10' },
          { label: 'Bearish Signals', value: bearishCount, icon: TrendingDown, color: '#ef4444', bg: 'bg-red-500/10' },
          { label: 'Neutral Mentions', value: neutralCount, icon: Minus, color: '#64748b', bg: 'bg-slate-500/10' },
          { label: 'Avg News Impact', value: `${avgImpact}/100`, icon: Zap, color: '#f59e0b', bg: 'bg-amber-500/10' },
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
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${card.bg}`}>
                  <Icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{card.label}</span>
              </div>
              <div className="text-xl font-bold text-white font-mono">{card.value}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Controls Panel */}
      <div className="glass-card p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search bar */}
          <div className="relative w-full lg:flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search news by ticker, company name, title, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.06] hover:border-white/10 focus:border-blue-500/50 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>

          {/* Sentiment Filter */}
          <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold shrink-0">Sentiment</span>
            {(['all', 'bullish', 'bearish', 'neutral'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSentiment(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all border ${
                  selectedSentiment === s
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Sector Filters */}
        <div className="flex items-center gap-2 border-t border-white/[0.04] pt-3 overflow-x-auto pb-1">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold shrink-0 mr-1">Sector</span>
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all shrink-0 ${
                selectedSector === sec
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-white/[0.03] text-slate-500 border border-white/[0.04] hover:text-slate-300'
              }`}
            >
              {sec === 'all' ? 'ALL SECTORS' : sec.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* News Feed List */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, i) => {
              const config = sentimentConfig[article.sentiment];
              const SentIcon = config.icon;

              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ delay: i * 0.04 }}
                  className={`glass-card p-5 group transition-all relative overflow-hidden border ${config.bg} hover:shadow-lg`}
                >
                  <div className="flex gap-4">
                    {/* Left sentiment border glow indicator */}
                    <div
                      className={`w-1 rounded-full shrink-0 ${
                        article.sentiment === 'bullish'
                          ? 'bg-emerald-400'
                          : article.sentiment === 'bearish'
                          ? 'bg-red-400'
                          : 'bg-slate-500'
                      }`}
                    />

                    <div className="flex-1 min-w-0">
                      {/* Top Row: Title, External link, and Impact Score */}
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                            {article.sector} Sector
                          </span>
                          <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors leading-snug">
                            {article.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {/* Impact Score Gauge */}
                          <div className="text-right">
                            <span className="text-[9px] text-slate-500 uppercase font-mono tracking-wider block">Impact</span>
                            <span className={`text-xs font-bold font-mono ${
                              article.impactScore >= 80 ? 'text-rose-400' :
                              article.impactScore >= 60 ? 'text-amber-400' :
                              'text-slate-400'
                            }`}>{article.impactScore}/100</span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors cursor-pointer" />
                        </div>
                      </div>

                      {/* Summary */}
                      <p className="text-xs text-slate-400 mb-3.5 leading-relaxed">{article.summary}</p>

                      {/* Company Mappings */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-3.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="text-[9px] text-slate-500 uppercase font-bold mr-1 shrink-0">Mapped Companies:</span>
                        {article.companies.map((c, idx) => (
                          <span key={idx} className="text-[9px] font-semibold px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                            {c}
                          </span>
                        ))}
                      </div>

                      {/* Footer Info */}
                      <div className="flex items-center gap-3 flex-wrap border-t border-white/[0.04] pt-3 text-[10px] text-slate-500">
                        {/* Sentiment badge */}
                        <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-lg border ${config.bg} ${config.color}`}>
                          <SentIcon className="w-3.5 h-3.5" />
                          {config.label}
                        </span>

                        {/* Tickers */}
                        <div className="flex items-center gap-1.5 ml-2">
                          {article.tickers.map((t) => (
                            <span key={t} className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Source */}
                        <span className="font-mono text-slate-600 ml-auto">{article.source}</span>

                        {/* Time */}
                        <span className="flex items-center gap-1 text-slate-600 font-mono">
                          <Clock className="w-3 h-3" />
                          {article.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="glass-card p-8 text-center text-slate-500 flex flex-col items-center justify-center">
              <AlertCircle className="w-8 h-8 text-slate-600 mb-2" />
              <span className="text-xs">No intelligence reports matched your current search and filter combination.</span>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default News;
