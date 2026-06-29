import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Maximize2,
  Minimize2,
  TrendingUp,
  TrendingDown,
  Minus,
  Crosshair,
  Trash2,
  BarChart3,
  Activity,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Target,
  Zap,
  Shield,
  Layers,
  PenTool,
  MinusIcon,
} from 'lucide-react';
import {
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
  Cell,
} from 'recharts';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import {
  calculateEMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  calculateFibonacciLevels,
  detectTrend,
  generateTechnicalData,
} from '../utils/indicators';

// ===== Types =====
interface IndicatorState {
  ema20: boolean;
  ema50: boolean;
  ema200: boolean;
  bollingerBands: boolean;
  rsi: boolean;
  macd: boolean;
  volume: boolean;
  fibonacci: boolean;
}

interface Drawing {
  id: string;
  type: 'hline';
  price: number;
  color: string;
}

type DrawingMode = 'none' | 'crosshair' | 'hline';

type Timeframe = '1W' | '1M' | '3M' | '6M' | '1Y';

// ===== Constants =====
const TIMEFRAMES: { key: Timeframe; label: string; days: number }[] = [
  { key: '1W', label: '1W', days: 10 },
  { key: '1M', label: '1M', days: 35 },
  { key: '3M', label: '3M', days: 95 },
  { key: '6M', label: '6M', days: 185 },
  { key: '1Y', label: '1Y', days: 370 },
];

const INDICATOR_COLORS = {
  ema20: '#f59e0b',
  ema50: '#3b82f6',
  ema200: '#ec4899',
  bbUpper: '#6366f1',
  bbLower: '#6366f1',
  bbMiddle: '#6366f180',
  rsiLine: '#f59e0b',
  macdLine: '#3b82f6',
  macdSignal: '#ef4444',
  volumeUp: '#10b98140',
  volumeDown: '#ef444440',
};

// ===== Custom Candlestick Shape =====
const CandlestickShape = (props: any) => {
  const { x, y, width, height, payload } = props;
  if (!payload || x === undefined || width === undefined) return null;

  const { open, close, high, low } = payload;
  const isUp = close >= open;
  const bodyColor = isUp ? '#22c55e' : '#ef4444';
  const wickColor = isUp ? '#22c55e90' : '#ef444490';

  const bodyHigh = Math.max(open, close);
  const bodyLow = Math.min(open, close);
  const bodyRange = bodyHigh - bodyLow || 0.01;

  const absH = Math.max(Math.abs(height || 0), 1);
  const barY = height >= 0 ? y : y + (height || 0);

  const pxPerPrice = absH / bodyRange;
  const wickTopY = barY - (high - bodyHigh) * pxPerPrice;
  const wickBottomY = barY + absH + (bodyLow - low) * pxPerPrice;
  const cx = x + width / 2;
  const cw = Math.max(width * 0.65, 2);
  const cxOff = x + (width - cw) / 2;

  return (
    <g>
      <line x1={cx} y1={wickTopY} x2={cx} y2={barY} stroke={wickColor} strokeWidth={1} />
      <line x1={cx} y1={barY + absH} x2={cx} y2={wickBottomY} stroke={wickColor} strokeWidth={1} />
      <rect x={cxOff} y={barY} width={cw} height={absH} fill={bodyColor} rx={0.5} />
    </g>
  );
};

// ===== Custom Tooltip =====
const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  const isUp = d.close >= d.open;

  return (
    <div className="glass-card p-3 border border-white/10 shadow-2xl min-w-[200px] text-xs">
      <div className="font-semibold text-slate-300 mb-2 font-mono">{d.date}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {[
          { k: 'Open', v: d.open },
          { k: 'High', v: d.high },
          { k: 'Low', v: d.low },
          { k: 'Close', v: d.close },
        ].map((r) => (
          <div key={r.k} className="flex justify-between gap-2">
            <span className="text-slate-500">{r.k}</span>
            <span className="font-mono text-slate-300">{r.v?.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-white/[0.06] flex justify-between">
        <span className="text-slate-500">Change</span>
        <span className={`font-mono font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
          {isUp ? '+' : ''}{(d.close - d.open).toFixed(2)} ({((d.close - d.open) / d.open * 100).toFixed(2)}%)
        </span>
      </div>
      {d.volume && (
        <div className="flex justify-between mt-1">
          <span className="text-slate-500">Volume</span>
          <span className="font-mono text-slate-400">
            {(d.volume / 1000000).toFixed(1)}M
          </span>
        </div>
      )}
    </div>
  );
};

const RSITooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]?.payload?.rsi) return null;
  const rsi = payload[0].payload.rsi;
  return (
    <div className="glass-card p-2 border border-white/10 text-xs">
      <span className="text-slate-500">RSI(14): </span>
      <span className={`font-mono font-bold ${rsi > 70 ? 'text-red-400' : rsi < 30 ? 'text-emerald-400' : 'text-amber-400'}`}>
        {rsi.toFixed(2)}
      </span>
    </div>
  );
};

const MACDTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-card p-2 border border-white/10 text-xs space-y-0.5">
      <div><span className="text-slate-500">MACD: </span><span className="font-mono text-blue-400">{d.macdLine?.toFixed(2) ?? '–'}</span></div>
      <div><span className="text-slate-500">Signal: </span><span className="font-mono text-red-400">{d.macdSignal?.toFixed(2) ?? '–'}</span></div>
      <div><span className="text-slate-500">Hist: </span><span className={`font-mono ${(d.macdHist ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{d.macdHist?.toFixed(2) ?? '–'}</span></div>
    </div>
  );
};

// ===== Main Component =====
const TechnicalAnalysis: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<Timeframe>('3M');
  const [fullscreen, setFullscreen] = useState(false);
  const [showIndicatorPanel, setShowIndicatorPanel] = useState(false);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('crosshair');
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [indicators, setIndicators] = useState<IndicatorState>({
    ema20: true,
    ema50: true,
    ema200: false,
    bollingerBands: false,
    rsi: true,
    macd: true,
    volume: true,
    fibonacci: false,
  });

  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Generate OHLCV data for the selected timeframe
  const rawData = useMemo(() => {
    const tf = TIMEFRAMES.find((t) => t.key === timeframe)!;
    return generateTechnicalData(tf.days, 24200, 0.008);
  }, [timeframe]);

  const closes = useMemo(() => rawData.map((d) => d.close), [rawData]);

  // Calculate all indicators
  const ema20 = useMemo(() => calculateEMA(closes, 20), [closes]);
  const ema50 = useMemo(() => calculateEMA(closes, 50), [closes]);
  const ema200 = useMemo(() => calculateEMA(closes, 200), [closes]);
  const rsiData = useMemo(() => calculateRSI(closes, 14), [closes]);
  const macdData = useMemo(() => calculateMACD(closes), [closes]);
  const bbData = useMemo(() => calculateBollingerBands(closes, 20, 2), [closes]);

  // Fibonacci levels
  const fibLevels = useMemo(() => {
    const highPrice = Math.max(...rawData.map((d) => d.high));
    const lowPrice = Math.min(...rawData.map((d) => d.low));
    return calculateFibonacciLevels(highPrice, lowPrice);
  }, [rawData]);

  // Trend detection
  const trendInfo = useMemo(
    () => detectTrend(closes, ema20, ema50, ema200),
    [closes, ema20, ema50, ema200]
  );

  // Merge all data into chart-ready format
  const chartData = useMemo(
    () =>
      rawData.map((d, i) => ({
        ...d,
        candleBody: [Math.min(d.open, d.close), Math.max(d.open, d.close)] as [number, number],
        isUp: d.close >= d.open,
        ema20: ema20[i],
        ema50: ema50[i],
        ema200: ema200[i],
        rsi: rsiData[i],
        macdLine: macdData.macd[i],
        macdSignal: macdData.signal[i],
        macdHist: macdData.histogram[i],
        bbUpper: bbData.upper[i],
        bbMiddle: bbData.middle[i],
        bbLower: bbData.lower[i],
      })),
    [rawData, ema20, ema50, ema200, rsiData, macdData, bbData]
  );

  // Current price info
  const lastCandle = rawData[rawData.length - 1];
  const prevCandle = rawData[rawData.length - 2];
  const priceChange = lastCandle.close - prevCandle.close;
  const priceChangePct = (priceChange / prevCandle.close) * 100;

  // Y-axis domain for main chart
  const priceMin = Math.min(...rawData.map((d) => d.low));
  const priceMax = Math.max(...rawData.map((d) => d.high));
  const pricePadding = (priceMax - priceMin) * 0.05;

  // Drawing handlers
  const handleChartClick = useCallback(
    (e: any) => {
      if (drawingMode === 'hline' && e?.activePayload?.[0]?.payload) {
        const p = e.activePayload[0].payload;
        const price = p.close;
        setDrawings((prev) => [
          ...prev,
          {
            id: `d-${Date.now()}`,
            type: 'hline',
            price: parseFloat(price.toFixed(2)),
            color: '#f59e0b',
          },
        ]);
        setDrawingMode('crosshair');
      }
    },
    [drawingMode]
  );

  const removeDrawing = (id: string) => setDrawings((d) => d.filter((x) => x.id !== id));
  const clearAllDrawings = () => setDrawings([]);

  const toggleIndicator = (key: keyof IndicatorState) => {
    setIndicators((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) return <DashboardSkeleton />;

  const Wrapper = fullscreen ? 'div' : React.Fragment;
  const wrapperProps = fullscreen
    ? {
        className:
          'fixed inset-0 z-50 bg-[#0a0e17] overflow-auto p-4 flex flex-col',
      }
    : {};

  const indicatorDefs: {
    key: keyof IndicatorState;
    label: string;
    color: string;
    group: string;
  }[] = [
    { key: 'ema20', label: 'EMA 20', color: INDICATOR_COLORS.ema20, group: 'Overlay' },
    { key: 'ema50', label: 'EMA 50', color: INDICATOR_COLORS.ema50, group: 'Overlay' },
    { key: 'ema200', label: 'EMA 200', color: INDICATOR_COLORS.ema200, group: 'Overlay' },
    { key: 'bollingerBands', label: 'Bollinger Bands', color: INDICATOR_COLORS.bbUpper, group: 'Overlay' },
    { key: 'fibonacci', label: 'Fibonacci Ret.', color: '#8b5cf6', group: 'Overlay' },
    { key: 'volume', label: 'Volume', color: '#10b981', group: 'Panel' },
    { key: 'rsi', label: 'RSI (14)', color: INDICATOR_COLORS.rsiLine, group: 'Panel' },
    { key: 'macd', label: 'MACD', color: INDICATOR_COLORS.macdLine, group: 'Panel' },
  ];

  const mainChartHeight = fullscreen ? 480 : 380;

  return (
    // @ts-ignore
    <Wrapper {...wrapperProps}>
      <div className={`space-y-4 ${fullscreen ? 'flex-1 flex flex-col' : ''}`}>
        {/* ===== Header ===== */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3"
        >
          {/* Symbol + Price */}
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">NIFTY 50</h1>
                <span className="text-xs text-slate-500 bg-white/[0.04] px-2 py-0.5 rounded">NSE</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg font-bold font-mono text-white">
                  {lastCandle.close.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span
                  className={`text-sm font-mono font-bold ${
                    priceChange >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePct.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Timeframe buttons */}
            <div className="flex items-center bg-white/[0.03] rounded-lg border border-white/[0.06] p-0.5">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf.key}
                  onClick={() => setTimeframe(tf.key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    timeframe === tf.key
                      ? 'bg-blue-500/20 text-blue-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>

            {/* Indicators toggle */}
            <button
              onClick={() => setShowIndicatorPanel(!showIndicatorPanel)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                showIndicatorPanel
                  ? 'bg-violet-500/15 text-violet-400 border-violet-500/30'
                  : 'bg-white/[0.04] text-slate-400 border-white/[0.06] hover:border-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Indicators
              {showIndicatorPanel ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {/* Drawing tools */}
            <div className="flex items-center bg-white/[0.03] rounded-lg border border-white/[0.06] p-0.5">
              <button
                onClick={() => setDrawingMode('crosshair')}
                className={`p-1.5 rounded-md transition-all ${
                  drawingMode === 'crosshair' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Crosshair"
              >
                <Crosshair className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDrawingMode('hline')}
                className={`p-1.5 rounded-md transition-all ${
                  drawingMode === 'hline' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Horizontal Line"
              >
                <MinusIcon className="w-3.5 h-3.5" />
              </button>
              {drawings.length > 0 && (
                <button
                  onClick={clearAllDrawings}
                  className="p-1.5 rounded-md text-slate-500 hover:text-red-400 transition-all"
                  title="Clear All"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={() => setFullscreen(!fullscreen)}
              className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-white hover:border-white/10 transition-all"
              title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        {/* ===== Indicator Toggle Panel ===== */}
        <AnimatePresence>
          {showIndicatorPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-card p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                  {indicatorDefs.map((ind) => (
                    <button
                      key={ind.key}
                      onClick={() => toggleIndicator(ind.key)}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                        indicators[ind.key]
                          ? 'bg-white/[0.06] border-white/10 text-white'
                          : 'bg-transparent border-white/[0.04] text-slate-500 hover:border-white/[0.08]'
                      }`}
                    >
                      <div
                        className="w-3 h-3 rounded-sm shrink-0"
                        style={{
                          backgroundColor: indicators[ind.key] ? ind.color : 'transparent',
                          border: indicators[ind.key] ? 'none' : `1.5px solid ${ind.color}40`,
                        }}
                      />
                      <span className="truncate">{ind.label}</span>
                      {indicators[ind.key] ? (
                        <Eye className="w-3 h-3 ml-auto shrink-0 text-slate-400" />
                      ) : (
                        <EyeOff className="w-3 h-3 ml-auto shrink-0 text-slate-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== Chart Area ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          ref={chartContainerRef}
          className={`glass-card overflow-hidden ${fullscreen ? 'flex-1' : ''}`}
        >
          {/* Drawing mode indicator */}
          {drawingMode === 'hline' && (
            <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2">
              <PenTool className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-amber-400 font-medium">
                Click on the chart to place a horizontal line · Press ESC or click Crosshair to cancel
              </span>
            </div>
          )}

          {/* Main Candlestick Chart */}
          <div className="px-2 pt-2" style={{ cursor: drawingMode === 'hline' ? 'crosshair' : 'default' }}>
            <ResponsiveContainer width="100%" height={mainChartHeight}>
              <ComposedChart
                data={chartData}
                margin={{ top: 10, right: 50, left: 10, bottom: 0 }}
                onClick={handleChartClick}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.03)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#475569' }}
                  tickFormatter={(d: string) => {
                    const date = new Date(d);
                    return `${date.getDate()} ${date.toLocaleString('en', { month: 'short' })}`;
                  }}
                  minTickGap={40}
                />
                <YAxis
                  domain={[priceMin - pricePadding, priceMax + pricePadding]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#475569' }}
                  orientation="right"
                  tickFormatter={(v: number) => v.toFixed(0)}
                  width={55}
                />
                <Tooltip content={<ChartTooltip />} />

                {/* Bollinger Bands Area */}
                {indicators.bollingerBands && (
                  <Area
                    dataKey="bbUpper"
                    stroke="none"
                    fill="none"
                    activeDot={false}
                    legendType="none"
                  />
                )}
                {indicators.bollingerBands && (
                  <Area
                    dataKey="bbLower"
                    stroke="none"
                    fill="rgba(99, 102, 241, 0.06)"
                    activeDot={false}
                    legendType="none"
                  />
                )}
                {indicators.bollingerBands && (
                  <Line
                    dataKey="bbUpper"
                    stroke={INDICATOR_COLORS.bbUpper}
                    strokeWidth={1}
                    dot={false}
                    activeDot={false}
                    strokeDasharray="4 2"
                    connectNulls={false}
                  />
                )}
                {indicators.bollingerBands && (
                  <Line
                    dataKey="bbLower"
                    stroke={INDICATOR_COLORS.bbLower}
                    strokeWidth={1}
                    dot={false}
                    activeDot={false}
                    strokeDasharray="4 2"
                    connectNulls={false}
                  />
                )}
                {indicators.bollingerBands && (
                  <Line
                    dataKey="bbMiddle"
                    stroke={INDICATOR_COLORS.bbMiddle}
                    strokeWidth={1}
                    dot={false}
                    activeDot={false}
                    strokeDasharray="2 2"
                    connectNulls={false}
                  />
                )}

                {/* Candlestick Bodies */}
                <Bar
                  dataKey="candleBody"
                  shape={<CandlestickShape />}
                  isAnimationActive={false}
                />

                {/* EMA Lines */}
                {indicators.ema20 && (
                  <Line
                    dataKey="ema20"
                    stroke={INDICATOR_COLORS.ema20}
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={false}
                    connectNulls={false}
                    name="EMA 20"
                  />
                )}
                {indicators.ema50 && (
                  <Line
                    dataKey="ema50"
                    stroke={INDICATOR_COLORS.ema50}
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={false}
                    connectNulls={false}
                    name="EMA 50"
                  />
                )}
                {indicators.ema200 && (
                  <Line
                    dataKey="ema200"
                    stroke={INDICATOR_COLORS.ema200}
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={false}
                    connectNulls={false}
                    name="EMA 200"
                  />
                )}

                {/* Fibonacci Retracement Lines */}
                {indicators.fibonacci &&
                  fibLevels.map((fib) => (
                    <ReferenceLine
                      key={fib.label}
                      y={fib.price}
                      stroke="#8b5cf680"
                      strokeDasharray="6 3"
                      strokeWidth={1}
                      label={{
                        value: `${fib.label} (${fib.price.toFixed(0)})`,
                        position: 'right',
                        fill: '#8b5cf6',
                        fontSize: 9,
                      }}
                    />
                  ))}

                {/* User Drawings */}
                {drawings.map((d) => (
                  <ReferenceLine
                    key={d.id}
                    y={d.price}
                    stroke={d.color}
                    strokeWidth={1.5}
                    strokeDasharray="8 4"
                    label={{
                      value: `${d.price.toFixed(2)}`,
                      position: 'right',
                      fill: d.color,
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Volume Sub-Panel */}
          {indicators.volume && (
            <div className="px-2 border-t border-white/[0.04]">
              <div className="flex items-center gap-1.5 px-3 pt-2">
                <BarChart3 className="w-3 h-3 text-slate-500" />
                <span className="text-[10px] text-slate-500 font-semibold">VOLUME</span>
              </div>
              <ResponsiveContainer width="100%" height={70}>
                <ComposedChart
                  data={chartData}
                  margin={{ top: 4, right: 50, left: 10, bottom: 0 }}
                >
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Bar dataKey="volume" isAnimationActive={false}>
                    {chartData.map((d, i) => (
                      <Cell
                        key={i}
                        fill={d.isUp ? INDICATOR_COLORS.volumeUp : INDICATOR_COLORS.volumeDown}
                      />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* RSI Sub-Panel */}
          {indicators.rsi && (
            <div className="px-2 border-t border-white/[0.04]">
              <div className="flex items-center gap-1.5 px-3 pt-2">
                <Activity className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] text-amber-400 font-semibold">RSI (14)</span>
                {rsiData[rsiData.length - 1] !== null && (
                  <span className={`text-[10px] font-mono font-bold ml-1 ${
                    (rsiData[rsiData.length - 1] as number) > 70 ? 'text-red-400' :
                    (rsiData[rsiData.length - 1] as number) < 30 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {(rsiData[rsiData.length - 1] as number).toFixed(1)}
                  </span>
                )}
              </div>
              <ResponsiveContainer width="100%" height={100}>
                <ComposedChart
                  data={chartData}
                  margin={{ top: 8, right: 50, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                  <XAxis dataKey="date" hide />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: '#475569' }}
                    orientation="right"
                    ticks={[30, 50, 70]}
                    width={55}
                  />
                  <Tooltip content={<RSITooltip />} />
                  <ReferenceLine y={70} stroke="#ef444440" strokeDasharray="3 3" />
                  <ReferenceLine y={30} stroke="#10b98140" strokeDasharray="3 3" />
                  <ReferenceLine y={50} stroke="rgba(255,255,255,0.06)" strokeDasharray="2 4" />
                  {/* Overbought zone */}
                  <Area
                    dataKey={() => 100}
                    baseValue={70}
                    fill="rgba(239,68,68,0.04)"
                    stroke="none"
                    isAnimationActive={false}
                  />
                  {/* Oversold zone */}
                  <Area
                    dataKey={() => 30}
                    baseValue={0}
                    fill="rgba(16,185,129,0.04)"
                    stroke="none"
                    isAnimationActive={false}
                  />
                  <Line
                    dataKey="rsi"
                    stroke={INDICATOR_COLORS.rsiLine}
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{ r: 3, fill: INDICATOR_COLORS.rsiLine }}
                    connectNulls={false}
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* MACD Sub-Panel */}
          {indicators.macd && (
            <div className="px-2 pb-2 border-t border-white/[0.04]">
              <div className="flex items-center gap-1.5 px-3 pt-2">
                <TrendingUp className="w-3 h-3 text-blue-400" />
                <span className="text-[10px] text-blue-400 font-semibold">MACD (12,26,9)</span>
              </div>
              <ResponsiveContainer width="100%" height={100}>
                <ComposedChart
                  data={chartData}
                  margin={{ top: 8, right: 50, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                  <XAxis dataKey="date" hide />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: '#475569' }}
                    orientation="right"
                    width={55}
                  />
                  <Tooltip content={<MACDTooltip />} />
                  <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
                  <Bar dataKey="macdHist" isAnimationActive={false}>
                    {chartData.map((d, i) => (
                      <Cell
                        key={i}
                        fill={(d.macdHist ?? 0) >= 0 ? '#10b98150' : '#ef444450'}
                      />
                    ))}
                  </Bar>
                  <Line
                    dataKey="macdLine"
                    stroke={INDICATOR_COLORS.macdLine}
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{ r: 3, fill: INDICATOR_COLORS.macdLine }}
                    connectNulls={false}
                    isAnimationActive={false}
                  />
                  <Line
                    dataKey="macdSignal"
                    stroke={INDICATOR_COLORS.macdSignal}
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{ r: 3, fill: INDICATOR_COLORS.macdSignal }}
                    connectNulls={false}
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* ===== Info Panels: Trend + Fibonacci + Signals ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Trend Detection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                trendInfo.direction === 'Bullish' ? 'bg-emerald-500/10' :
                trendInfo.direction === 'Bearish' ? 'bg-red-500/10' : 'bg-slate-500/10'
              }`}>
                {trendInfo.direction === 'Bullish' ? (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : trendInfo.direction === 'Bearish' ? (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                ) : (
                  <Minus className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Trend Detection</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-xs font-bold ${
                    trendInfo.direction === 'Bullish' ? 'text-emerald-400' :
                    trendInfo.direction === 'Bearish' ? 'text-red-400' : 'text-slate-400'
                  }`}>
                    {trendInfo.direction}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                    trendInfo.strength === 'Strong' ? 'bg-emerald-500/10 text-emerald-400' :
                    trendInfo.strength === 'Moderate' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-slate-500/10 text-slate-400'
                  }`}>
                    {trendInfo.strength}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">{trendInfo.description}</p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500">EMA Alignment</span>
                <span className="text-slate-300 font-mono">{trendInfo.emaAlignment}</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500">Price vs EMA 20</span>
                <span className={trendInfo.priceVsEma20 === 'above' ? 'text-emerald-400' : 'text-red-400'}>
                  {trendInfo.priceVsEma20 === 'above' ? '▲ Above' : '▼ Below'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500">Price vs EMA 200</span>
                <span className={trendInfo.priceVsEma200 === 'above' ? 'text-emerald-400' : 'text-red-400'}>
                  {trendInfo.priceVsEma200 === 'above' ? '▲ Above' : '▼ Below'}
                </span>
              </div>
              {(trendInfo.goldenCross || trendInfo.deathCross) && (
                <div className={`mt-2 p-2 rounded-lg text-[10px] font-bold flex items-center gap-1.5 ${
                  trendInfo.goldenCross
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  <Zap className="w-3 h-3" />
                  {trendInfo.goldenCross ? '🔥 Golden Cross Detected' : '⚠️ Death Cross Detected'}
                </div>
              )}
            </div>
          </motion.div>

          {/* Fibonacci Levels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-violet-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">Fibonacci Levels</h3>
            </div>

            <div className="space-y-1.5">
              {fibLevels.map((fib) => {
                const isNear = Math.abs(lastCandle.close - fib.price) / lastCandle.close < 0.005;
                return (
                  <div
                    key={fib.label}
                    className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                      isNear ? 'bg-violet-500/10 border border-violet-500/20' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-0.5 rounded-full bg-violet-500" style={{ opacity: 0.3 + fib.ratio * 0.7 }} />
                      <span className="text-xs text-slate-400 font-mono">{fib.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold ${isNear ? 'text-violet-400' : 'text-slate-300'}`}>
                        {fib.price.toFixed(2)}
                      </span>
                      {isNear && (
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-bold">
                          NEAR
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Signal Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">Signal Summary</h3>
            </div>

            <div className="space-y-2.5">
              {(() => {
                const lastRSI = rsiData[rsiData.length - 1] as number | null;
                const lastMACD = macdData.macd[macdData.macd.length - 1] as number | null;
                const lastMACDSignal = macdData.signal[macdData.signal.length - 1] as number | null;
                const lastE20 = ema20[ema20.length - 1] as number | null;
                const lastE50 = ema50[ema50.length - 1] as number | null;
                const lastBBUpper = bbData.upper[bbData.upper.length - 1] as number | null;
                const lastBBLower = bbData.lower[bbData.lower.length - 1] as number | null;

                const signals: { name: string; signal: string; color: string; value: string }[] = [];

                // RSI Signal
                if (lastRSI !== null) {
                  signals.push({
                    name: 'RSI (14)',
                    signal: lastRSI > 70 ? 'SELL' : lastRSI < 30 ? 'BUY' : 'NEUTRAL',
                    color: lastRSI > 70 ? 'text-red-400' : lastRSI < 30 ? 'text-emerald-400' : 'text-amber-400',
                    value: lastRSI.toFixed(1),
                  });
                }

                // MACD Signal
                if (lastMACD !== null && lastMACDSignal !== null) {
                  const isBull = lastMACD > lastMACDSignal;
                  signals.push({
                    name: 'MACD',
                    signal: isBull ? 'BUY' : 'SELL',
                    color: isBull ? 'text-emerald-400' : 'text-red-400',
                    value: lastMACD.toFixed(2),
                  });
                }

                // EMA 20/50 Crossover
                if (lastE20 !== null && lastE50 !== null) {
                  const isBull = lastE20 > lastE50;
                  signals.push({
                    name: 'EMA Cross',
                    signal: isBull ? 'BUY' : 'SELL',
                    color: isBull ? 'text-emerald-400' : 'text-red-400',
                    value: isBull ? '20 > 50' : '20 < 50',
                  });
                }

                // Price vs Bollinger
                if (lastBBUpper !== null && lastBBLower !== null) {
                  const p = lastCandle.close;
                  signals.push({
                    name: 'Bollinger',
                    signal: p > lastBBUpper ? 'SELL' : p < lastBBLower ? 'BUY' : 'NEUTRAL',
                    color: p > lastBBUpper ? 'text-red-400' : p < lastBBLower ? 'text-emerald-400' : 'text-amber-400',
                    value: p > lastBBUpper ? 'Overbought' : p < lastBBLower ? 'Oversold' : 'In Band',
                  });
                }

                // Price vs EMA 200
                if (ema200[ema200.length - 1] !== null) {
                  const above = lastCandle.close > (ema200[ema200.length - 1] as number);
                  signals.push({
                    name: 'EMA 200',
                    signal: above ? 'BUY' : 'SELL',
                    color: above ? 'text-emerald-400' : 'text-red-400',
                    value: above ? 'Above' : 'Below',
                  });
                }

                const buyCount = signals.filter((s) => s.signal === 'BUY').length;
                const sellCount = signals.filter((s) => s.signal === 'SELL').length;

                return (
                  <>
                    {/* Summary bar */}
                    <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-white/[0.03]">
                      <div className="flex-1">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-emerald-400 font-bold text-xs">{buyCount} Buy</span>
                          <span className="text-slate-600 text-xs">·</span>
                          <span className="text-red-400 font-bold text-xs">{sellCount} Sell</span>
                          <span className="text-slate-600 text-xs">·</span>
                          <span className="text-amber-400 font-bold text-xs">{signals.length - buyCount - sellCount} Neutral</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden flex bg-white/[0.06]">
                          <div
                            className="bg-emerald-500 transition-all"
                            style={{ width: `${(buyCount / signals.length) * 100}%` }}
                          />
                          <div
                            className="bg-amber-500 transition-all"
                            style={{ width: `${((signals.length - buyCount - sellCount) / signals.length) * 100}%` }}
                          />
                          <div
                            className="bg-red-500 transition-all"
                            style={{ width: `${(sellCount / signals.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Individual signals */}
                    {signals.map((s) => (
                      <div key={s.name} className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">{s.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400">{s.value}</span>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            s.signal === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' :
                            s.signal === 'SELL' ? 'bg-red-500/10 text-red-400' :
                            'bg-amber-500/10 text-amber-400'
                          }`}>
                            {s.signal}
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>
          </motion.div>
        </div>

        {/* Drawings list (if any) */}
        {drawings.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <PenTool className="w-3 h-3 text-slate-500" />
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Active Drawings</span>
              <button
                onClick={clearAllDrawings}
                className="ml-auto text-[10px] text-red-400/60 hover:text-red-400 transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {drawings.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]"
                >
                  <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[10px] text-slate-400 font-mono">{d.type === 'hline' ? 'H-Line' : d.type}</span>
                  <span className="text-[10px] text-white font-mono font-bold">{d.price}</span>
                  <button
                    onClick={() => removeDrawing(d.id)}
                    className="text-slate-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </Wrapper>
  );
};

export default TechnicalAnalysis;
