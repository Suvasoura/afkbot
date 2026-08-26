import React, { useState } from 'react';
import { NiftyStock } from './types';
import { TrendingUp, TrendingDown, Layers, BarChart2, Zap } from 'lucide-react';

interface StockChartProps {
  stock: NiftyStock;
}

export const StockChart: React.FC<StockChartProps> = ({ stock }) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | '5Y'>('1M');
  const [chartType, setChartType] = useState<'line' | 'candle'>('candle');
  const [showMA20, setShowMA20] = useState(true);
  const [showRSI, setShowRSI] = useState(true);

  // Generate deterministic synthetic candlestick chart data for demonstration
  const generateChartData = () => {
    const pointsCount = timeframe === '1D' ? 24 : timeframe === '1W' ? 35 : timeframe === '1M' ? 30 : 60;
    const basePrice = stock.price;
    const volatility = stock.price * 0.015;
    const data = [];
    let current = basePrice * 0.94;

    for (let i = 0; i < pointsCount; i++) {
      const open = current;
      const change = (Math.sin(i * 0.4) + (Math.random() - 0.48)) * volatility;
      const close = Math.max(stock.fiftyTwoWeekLow, Math.min(stock.fiftyTwoWeekHigh, open + change));
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;
      const volume = Math.floor(stock.volume * (0.6 + Math.random() * 0.8));
      
      data.push({
        label: `T-${pointsCount - i}`,
        open,
        high,
        low,
        close,
        volume
      });
      current = close;
    }
    // Ensure final point matches stock current price
    if (data.length > 0) {
      data[data.length - 1].close = stock.price;
    }
    return data;
  };

  const chartData = generateChartData();
  const prices = chartData.map(d => d.close);
  const minPrice = Math.min(...chartData.map(d => d.low)) * 0.99;
  const maxPrice = Math.max(...chartData.map(d => d.high)) * 1.01;
  const maxVolume = Math.max(...chartData.map(d => d.volume));

  // Compute 20-period Moving Average
  const ma20Data = chartData.map((_, idx) => {
    if (idx < 5) return null;
    const slice = chartData.slice(Math.max(0, idx - 10), idx + 1);
    const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
    return sum / slice.length;
  });

  const chartHeight = 240;
  const chartWidth = 700;

  const getY = (val: number) => {
    return chartHeight - ((val - minPrice) / (maxPrice - minPrice)) * chartHeight;
  };

  const isPositive = stock.change >= 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Chart Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white tracking-wide">{stock.symbol}</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              {stock.sector}
            </span>
          </div>
          <p className="text-xs text-slate-400">{stock.name}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-black text-white font-mono">
              ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className={`text-xs font-semibold flex items-center justify-end gap-1 ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.pChange.toFixed(2)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar: Timeframes & Indicator Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800/80 text-xs">
        {/* Timeframe selector */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 font-medium">
          {(['1D', '1W', '1M', '1Y', '5Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-md transition-all ${
                timeframe === tf
                  ? 'bg-blue-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart type & indicator toggles */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setChartType('candle')}
              className={`px-2.5 py-1 rounded flex items-center gap-1 ${
                chartType === 'candle' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
              }`}
              title="Candlestick Chart"
            >
              <BarChart2 className="w-3.5 h-3.5 text-blue-400" /> Candles
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2.5 py-1 rounded flex items-center gap-1 ${
                chartType === 'line' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
              }`}
              title="Line Chart"
            >
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Line
            </button>
          </div>

          <button
            onClick={() => setShowMA20(!showMA20)}
            className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 font-medium ${
              showMA20
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Zap className="w-3 h-3" /> MA(20)
          </button>

          <button
            onClick={() => setShowRSI(!showRSI)}
            className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 font-medium ${
              showRSI
                ? 'bg-purple-500/10 border-purple-500/40 text-purple-300'
                : 'border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Layers className="w-3 h-3" /> RSI(14)
          </button>
        </div>
      </div>

      {/* Primary SVG Chart Viewport */}
      <div className="relative bg-slate-950 rounded-xl p-3 border border-slate-800/80 overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 50}`} className="w-full h-auto font-mono text-[10px]">
          {/* Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const priceVal = maxPrice - ratio * (maxPrice - minPrice);
            const y = ratio * chartHeight;
            return (
              <g key={idx}>
                <line x1="0" y1={y} x2={chartWidth} y2={y} stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1" />
                <text x={chartWidth - 5} y={y - 4} fill="#64748b" textAnchor="end">
                  ₹{priceVal.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Volume Bars */}
          {chartData.map((d, i) => {
            const x = (i / (chartData.length - 1)) * (chartWidth - 60) + 20;
            const volHeight = (d.volume / maxVolume) * 35;
            const isUp = d.close >= d.open;
            return (
              <rect
                key={`vol-${i}`}
                x={x - 3}
                y={chartHeight - volHeight}
                width="6"
                height={volHeight}
                fill={isUp ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}
              />
            );
          })}

          {/* Candlesticks or Line */}
          {chartType === 'candle' ? (
            chartData.map((d, i) => {
              const x = (i / (chartData.length - 1)) * (chartWidth - 60) + 20;
              const yOpen = getY(d.open);
              const yClose = getY(d.close);
              const yHigh = getY(d.high);
              const yLow = getY(d.low);
              const isUp = d.close >= d.open;
              const color = isUp ? '#10b981' : '#f43f5e';
              const candleTop = Math.min(yOpen, yClose);
              const candleHeight = Math.max(2, Math.abs(yClose - yOpen));

              return (
                <g key={`candle-${i}`}>
                  {/* Wick */}
                  <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.5" />
                  {/* Body */}
                  <rect
                    x={x - 4}
                    y={candleTop}
                    width="8"
                    height={candleHeight}
                    fill={color}
                    rx="1"
                  />
                </g>
              );
            })
          ) : (
            <g>
              {/* Line chart gradient path */}
              <path
                d={chartData.reduce((acc, d, i) => {
                  const x = (i / (chartData.length - 1)) * (chartWidth - 60) + 20;
                  const y = getY(d.close);
                  return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                }, '')}
                fill="none"
                stroke={isPositive ? '#10b981' : '#f43f5e'}
                strokeWidth="2.5"
              />
            </g>
          )}

          {/* Moving Average Line Overlay */}
          {showMA20 && (
            <path
              d={ma20Data.reduce((acc, val, i) => {
                if (val === null) return acc;
                const x = (i / (chartData.length - 1)) * (chartWidth - 60) + 20;
                const y = getY(val);
                return acc === '' ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
              }, '')}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
          )}
        </svg>

        {/* RSI Sub-Pane */}
        {showRSI && (
          <div className="mt-3 border-t border-slate-800 pt-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
              <span>RSI (14 Period Oscillator)</span>
              <span className={`font-bold ${stock.rsi14 > 70 ? 'text-rose-400' : stock.rsi14 < 30 ? 'text-emerald-400' : 'text-blue-400'}`}>
                {stock.rsi14.toFixed(1)} {stock.rsi14 > 70 ? '(Overbought)' : stock.rsi14 < 30 ? '(Oversold)' : '(Neutral Zone)'}
              </span>
            </div>
            <div className="w-full h-8 bg-slate-900 rounded-lg relative overflow-hidden border border-slate-800 flex items-center px-2">
              <div className="absolute inset-0 flex flex-col justify-between py-1 opacity-20 pointer-events-none">
                <div className="border-b border-rose-500 border-dashed w-full" />
                <div className="border-b border-emerald-500 border-dashed w-full" />
              </div>
              <div
                className="h-2 rounded-full bg-gradient-to-r from-emerald-500 via-blue-500 to-rose-500 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, stock.rsi14))}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Fundamentals Quick Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[11px]">52W High / Low</span>
          <span className="font-semibold text-white font-mono mt-0.5 block">
            ₹{stock.fiftyTwoWeekHigh.toFixed(0)} / ₹{stock.fiftyTwoWeekLow.toFixed(0)}
          </span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[11px]">P/E Ratio</span>
          <span className="font-semibold text-white font-mono mt-0.5 block">{stock.peRatio}</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[11px]">Market Cap</span>
          <span className="font-semibold text-white font-mono mt-0.5 block">
            ₹{(stock.marketCapCr / 1000).toFixed(1)}k Cr
          </span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[11px]">Nifty Weightage</span>
          <span className="font-semibold text-blue-400 font-mono mt-0.5 block">
            {stock.weightagePercent}%
          </span>
        </div>
      </div>
    </div>
  );
};