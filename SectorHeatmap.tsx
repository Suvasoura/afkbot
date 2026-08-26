import React from 'react';
import { NiftyStock, Sector } from './types';

interface SectorHeatmapProps {
  stocks: NiftyStock[];
  onSelectStock: (stock: NiftyStock) => void;
}

export const SectorHeatmap: React.FC<SectorHeatmapProps> = ({ stocks, onSelectStock }) => {
  // Group stocks by sector
  const sectorGroups = stocks.reduce<Record<string, NiftyStock[]>>((acc, stock) => {
    acc[stock.sector] = acc[stock.sector] || [];
    acc[stock.sector].push(stock);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Nifty 50 Sector Weightage Heatmap</h2>
          <p className="text-xs text-slate-400">
            Tile proportions represent sector market capitalization weight. Colors indicate real-time daily price performance.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-600" />
            <span className="text-slate-300">&gt; +1.5%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-900/60 border border-emerald-700" />
            <span className="text-slate-300">0% to +1.5%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-900/60 border border-rose-700" />
            <span className="text-slate-300">-1.5% to 0%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-600" />
            <span className="text-slate-300">&lt; -1.5%</span>
          </div>
        </div>
      </div>

      {/* Grid of Sector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(sectorGroups).map(([sectorName, sectorStocks]) => {
          const totalWeight = sectorStocks.reduce((sum, s) => sum + s.weightagePercent, 0);
          const avgChange = sectorStocks.reduce((sum, s) => sum + s.pChange, 0) / sectorStocks.length;

          return (
            <div
              key={sectorName}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg"
            >
              {/* Sector Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h3 className="font-bold text-sm text-white">{sectorName}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {totalWeight.toFixed(2)}% Index Weight
                  </span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  avgChange >= 0
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
                </span>
              </div>

              {/* Stock Tiles in Sector */}
              <div className="grid grid-cols-2 gap-2">
                {sectorStocks.map((stock) => {
                  const pChange = stock.pChange;
                  let bgClass = 'bg-slate-800 hover:bg-slate-700 text-slate-200';
                  
                  if (pChange > 1.5) {
                    bgClass = 'bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-emerald-900/30';
                  } else if (pChange > 0) {
                    bgClass = 'bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-200 border border-emerald-800/60';
                  } else if (pChange < -1.5) {
                    bgClass = 'bg-rose-600/90 hover:bg-rose-500 text-white shadow-rose-900/30';
                  } else if (pChange < 0) {
                    bgClass = 'bg-rose-950/80 hover:bg-rose-900/90 text-rose-200 border border-rose-800/60';
                  }

                  return (
                    <button
                      key={stock.symbol}
                      onClick={() => onSelectStock(stock)}
                      className={`p-2.5 rounded-xl text-left transition-all duration-200 shadow hover:scale-[1.02] active:scale-[0.98] ${bgClass}`}
                    >
                      <div className="font-bold text-xs truncate">{stock.symbol}</div>
                      <div className="text-[11px] font-mono mt-1 flex items-center justify-between">
                        <span>₹{stock.price.toFixed(0)}</span>
                        <span className="font-bold">
                          {pChange >= 0 ? '+' : ''}{pChange.toFixed(2)}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};