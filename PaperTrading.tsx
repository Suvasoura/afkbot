import React, { useState } from 'react';
import { NiftyStock, PortfolioPosition, TradeOrder } from './types';
import { Wallet, TrendingUp, DollarSign, History, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaperTradingProps {
  stocks: NiftyStock[];
  positions: PortfolioPosition[];
  orders: TradeOrder[];
  cashBalance: number;
  onExecuteTrade: (symbol: string, type: 'BUY' | 'SELL', qty: number, price: number) => void;
  onResetPortfolio: () => void;
}

export const PaperTrading: React.FC<PaperTradingProps> = ({
  stocks,
  positions,
  orders,
  cashBalance,
  onExecuteTrade,
  onResetPortfolio,
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(stocks[0]?.symbol || 'RELIANCE');
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeQuantity, setTradeQuantity] = useState<number>(10);

  const activeStock = stocks.find(s => s.symbol === selectedSymbol) || stocks[0];
  const currentPrice = activeStock.price;
  const orderTotal = currentPrice * tradeQuantity;

  // Calculate overall portfolio metrics
  const investedAmount = positions.reduce((sum, pos) => sum + (pos.quantity * pos.buyAvgPrice), 0);
  const currentPortfolioValue = positions.reduce((sum, pos) => {
    const s = stocks.find(item => item.symbol === pos.symbol);
    return sum + (pos.quantity * (s ? s.price : pos.buyAvgPrice));
  }, 0);

  const totalAccountValue = cashBalance + currentPortfolioValue;
  const unrealizedPnL = currentPortfolioValue - investedAmount;
  const unrealizedPnLPercent = investedAmount > 0 ? (unrealizedPnL / investedAmount) * 100 : 0;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (tradeQuantity <= 0) return;

    if (tradeType === 'BUY' && orderTotal > cashBalance) {
      alert('Insufficient virtual balance for this order!');
      return;
    }

    if (tradeType === 'SELL') {
      const existingPos = positions.find(p => p.symbol === selectedSymbol);
      if (!existingPos || existingPos.quantity < tradeQuantity) {
        alert('You do not own enough shares to execute this sell order.');
        return;
      }
    }

    onExecuteTrade(selectedSymbol, tradeType, tradeQuantity, currentPrice);

    if (tradeType === 'SELL' && unrealizedPnL > 0) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <Wallet className="w-4 h-4 text-blue-400" /> Total Net Worth
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            ₹{totalAccountValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Starting Capital: ₹10,00,000</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Cash Available
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            ₹{cashBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Unallocated Funds</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <TrendingUp className="w-4 h-4 text-purple-400" /> Holdings Value
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            ₹{currentPortfolioValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{positions.length} Active Position(s)</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold">Unrealized P&L</span>
            <button
              onClick={onResetPortfolio}
              className="text-[10px] text-slate-500 hover:text-rose-400 flex items-center gap-1"
              title="Reset Virtual Portfolio"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>
          <div className={`text-2xl font-black font-mono mt-2 ${
            unrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {unrealizedPnL >= 0 ? '+' : ''}₹{unrealizedPnL.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className={`text-xs font-bold mt-1 ${
            unrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {unrealizedPnL >= 0 ? '+' : ''}{unrealizedPnLPercent.toFixed(2)}% Overall Return
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trade Execution Form */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
            Paper Order Execution
          </h3>

          <form onSubmit={handleSubmitOrder} className="space-y-4 text-xs">
            {/* Symbol Selector */}
            <div>
              <label className="text-slate-400 block mb-1">Select Stock Ticker</label>
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 font-bold focus:outline-none focus:border-blue-500"
              >
                {stocks.map((s) => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.symbol} — ₹{s.price.toFixed(2)} ({s.pChange >= 0 ? '+' : ''}{s.pChange.toFixed(2)}%)
                  </option>
                ))}
              </select>
            </div>

            {/* Buy / Sell Toggle */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setTradeType('BUY')}
                className={`py-2 rounded-lg font-bold transition-all ${
                  tradeType === 'BUY'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                BUY (Long)
              </button>
              <button
                type="button"
                onClick={() => setTradeType('SELL')}
                className={`py-2 rounded-lg font-bold transition-all ${
                  tradeType === 'SELL'
                    ? 'bg-rose-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                SELL (Close)
              </button>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-slate-400 block mb-1">Quantity (Shares)</label>
              <input
                type="number"
                min="1"
                max="10000"
                value={tradeQuantity}
                onChange={(e) => setTradeQuantity(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 font-mono text-sm font-bold focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Order Total Breakdown */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Execution Price</span>
                <span className="text-white">₹{currentPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-1.5 font-bold">
                <span>Est. Total Order Value</span>
                <span className="text-blue-400">₹{orderTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] ${
                tradeType === 'BUY'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                  : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
              }`}
            >
              Confirm {tradeType} Order
            </button>
          </form>
        </div>

        {/* Portfolio Positions & Order Log */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Holdings */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
              Active Holdings ({positions.length})
            </h3>

            {positions.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No open positions. Use the order execution panel on the left to start paper trading!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="text-slate-400 border-b border-slate-800 font-mono">
                    <tr>
                      <th className="py-2.5 px-3">Symbol</th>
                      <th className="py-2.5 px-3 text-right">Qty</th>
                      <th className="py-2.5 px-3 text-right">Avg Price</th>
                      <th className="py-2.5 px-3 text-right">Current Price</th>
                      <th className="py-2.5 px-3 text-right">Unrealized P&L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {positions.map((pos) => {
                      const st = stocks.find(s => s.symbol === pos.symbol);
                      const curPrice = st ? st.price : pos.buyAvgPrice;
                      const posPnL = (curPrice - pos.buyAvgPrice) * pos.quantity;
                      const posPnLPct = ((curPrice - pos.buyAvgPrice) / pos.buyAvgPrice) * 100;
                      const isUp = posPnL >= 0;

                      return (
                        <tr key={pos.symbol} className="hover:bg-slate-800/40">
                          <td className="py-3 px-3 font-bold text-white">{pos.symbol}</td>
                          <td className="py-3 px-3 text-right text-slate-300">{pos.quantity}</td>
                          <td className="py-3 px-3 text-right text-slate-300">₹{pos.buyAvgPrice.toFixed(2)}</td>
                          <td className="py-3 px-3 text-right text-white font-bold">₹{curPrice.toFixed(2)}</td>
                          <td className={`py-3 px-3 text-right font-bold ${
                            isUp ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {isUp ? '+' : ''}₹{posPnL.toFixed(2)} ({isUp ? '+' : ''}{posPnLPct.toFixed(2)}%)
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Trade History Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <History className="w-4 h-4 text-blue-400" />
              <h3 className="text-base font-bold text-white">Order Execution History</h3>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                No orders executed yet in this session.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        ord.type === 'BUY'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      }`}>
                        {ord.type}
                      </span>
                      <span className="font-bold text-white">{ord.symbol}</span>
                      <span className="text-slate-400">x{ord.quantity} shares</span>
                    </div>

                    <div className="text-right">
                      <div className="text-slate-200 font-bold">₹{ord.price.toFixed(2)}</div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(ord.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};