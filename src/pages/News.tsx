import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import { newsArticles } from '../data/mockData';

const sentimentConfig = {
  bullish: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: TrendingUp, label: 'Bullish' },
  bearish: { color: 'text-red-400', bg: 'bg-red-500/10', icon: TrendingDown, label: 'Bearish' },
  neutral: { color: 'text-slate-400', bg: 'bg-slate-500/10', icon: Minus, label: 'Neutral' },
};

const News: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'bullish' | 'bearish' | 'neutral'>('all');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <DashboardSkeleton />;

  const filtered = sentimentFilter === 'all'
    ? newsArticles
    : newsArticles.filter((a) => a.sentiment === sentimentFilter);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white mb-1">Market News</h1>
        <p className="text-sm text-slate-500">AI-curated financial news with sentiment analysis</p>
      </motion.div>

      {/* Sentiment Summary */}
      <div className="grid grid-cols-3 gap-4">
        {(['bullish', 'bearish', 'neutral'] as const).map((sentiment) => {
          const config = sentimentConfig[sentiment];
          const Icon = config.icon;
          const count = newsArticles.filter((a) => a.sentiment === sentiment).length;
          return (
            <motion.div
              key={sentiment}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 cursor-pointer hover:border-white/10 transition-all"
              onClick={() => setSentimentFilter(sentimentFilter === sentiment ? 'all' : sentiment)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${config.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                </div>
                <span className="text-xs text-slate-400 capitalize">{sentiment}</span>
              </div>
              <div className="text-xl font-bold text-white">{count}</div>
              <div className="text-[10px] text-slate-500">articles</div>
            </motion.div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-500" />
        {(['all', 'bullish', 'bearish', 'neutral'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setSentimentFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              sentimentFilter === f
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-white/[0.04] text-slate-400 border border-transparent hover:bg-white/[0.06]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* News Cards */}
      <div className="space-y-3">
        {filtered.map((article, i) => {
          const config = sentimentConfig[article.sentiment];
          const SentIcon = config.icon;

          return (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 group cursor-pointer"
            >
              <div className="flex gap-4">
                {/* Sentiment bar */}
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
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-slate-400 shrink-0 transition-colors" />
                  </div>

                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{article.summary}</p>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded ${config.bg} ${config.color}`}>
                      <SentIcon className="w-3 h-3" />
                      {config.label}
                    </span>

                    <div className="flex items-center gap-1">
                      {article.tickers.map((t) => (
                        <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">
                          {t}
                        </span>
                      ))}
                    </div>

                    <span className="text-[10px] text-slate-600 ml-auto flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.time}
                    </span>

                    <span className="text-[10px] text-slate-500">{article.source}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default News;
