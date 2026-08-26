import React, { useState } from 'react';
import { NiftyStock, Sector } from './types';
import { Search, Filter, ArrowUpDown, ShieldAlert, Sparkles, Check } from 'lucide-react';

interface StockScreenerProps {
  stocks: NiftyStock[];
  onSelectStock: (stock: NiftyStock) => void;
  onTradeStock: (stock: NiftyStock) => void;
}

export const StockScreener: React.FC<StockScreenerProps> = ({
  stocks,
  onSelectStock,
  onTradeStock,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [quickFilter, setQuickFilter] = useState<'ALL' | 'GAINERS' | 'LOSERS' | 'RSI_OVERSOLD' | 'HIGH_WEIGHTAGE'>('ALL');
  const [sortBy, setSortBy] = useState<'pChange' | 'price' | 'marketCapCr' | 'peRatio'>('pChange');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'ALL' || stock.sector === selectedSector;
    
    let matchesQuick = true;
    if (quickFilter === 'GAINERS') matchesQuick = stock.pChange > 0;
    if (quickFilter === 'LOSERS') matchesQuick = stock.pChange < 0;
    if (quickFilter === 'RSI_OVERSOLD') matchesQuick = stock.rsi14 < 45;
    if (quickFilter === 'HIGH_WEIGHTAGE') matchesQuick = stock.weightagePercent >= 2.0;

    return matchesSearch && matchesSector && matchesQuick;
  }).sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];
    return sortOrder === 'desc' ? valB - valA : valA - valB;
  });

  const sectorsList = Array.from(new Set(stocks.map(s => s.sector)));

  return (
    <div className="space-y-5">
      {/* Search & Filter Header Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search ticker or company name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Filter Preset:</span>
            {[
              { id: 'ALL', label: 'All Stocks' },
              { id: 'GAINERS', label: '🚀 Gainers' },
              { id: 'LOSERS', label: '🔻 Losers' },
              { id: 'RSI_OVERSOLD', label: '⚡ Oversold RSI' },
              { id: 'HIGH_WEIGHTAGE', label: '👑 High Weightage' },
            ].map((preset) => (
              <button
                key={preset.id}
                onClick={() => setQuickFilter(preset.id as any)}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  quickFilter === preset.id
                    ? 'bg-blue-600 border-blue-500 text-white font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sector dropdown & sorting controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400">Sector:</span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Sectors ({stocks.length})</option>
              {sectorsList.map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="pChange">% Change</option>
              <option value="price">Price (₹)</option>
              <option value="marketCapCr">Market Cap</option>
              <option value="peRatio">P/E Ratio</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-bold uppercase"
            >
              {sortOrder}
            </button>
          </div>
        </div>
      </div>

      {/* Stocks Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Symbol / Company</th>
                <th className="py-3.5 px-4 font-semibold">Sector</th>
                <th className="py-3.5 px-4 font-semibold text-right">LTP (₹)</th>
                <th className="py-3.5 px-4 font-semibold text-right">24h Change</th>
                <th className="py-3.5 px-4 font-semibold text-right">RSI (14)</th>
                <th className="py-3.5 px-4 font-semibold text-right">P/E</th>
                <th className="py-3.5 px-4 font-semibold text-center">AI Signal</th>
                <th className="py-3.5 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No Nifty 50 stocks matched your screener parameters.
                  </td>
                </tr>
              ) : (
                filteredStocks.map((stock) => {
                  const isUp = stock.change >= 0;
                  return (
                    <tr
                      key={stock.symbol}
                      onClick={() => onSelectStock(stock)}
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{stock.symbol}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({stock.weightagePercent}%)</span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {stock.name}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 text-[10px]">
                          {stock.sector}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                        ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      <td className={`py-3.5 px-4 text-right font-mono font-bold ${
                        isUp ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {isUp ? '+' : ''}{stock.change.toFixed(2)} ({isUp ? '+' : ''}{stock.pChange.toFixed(2)}%)
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          stock.rsi14 > 70
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : stock.rsi14 < 35
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'text-slate-300'
                        }`}>
                          {stock.rsi14.toFixed(1)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                        {stock.peRatio}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          stock.signal === 'Strong Buy'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : stock.signal === 'Buy'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : stock.signal === 'Sell'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {stock.signal}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTradeStock(stock);
                          }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold rounded-lg shadow transition-all hover:scale-105"
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};