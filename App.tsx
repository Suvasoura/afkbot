import React, { useState, useEffect } from 'react';
import { NiftyStock, PortfolioPosition, TradeOrder } from './types';
import { INITIAL_INDEX_METRICS, NIFTY_50_STOCKS, MARKET_NEWS } from './niftyData';
import { StockChart } from './StockChart';
import { SectorHeatmap } from './SectorHeatmap';
import { StockScreener } from './StockScreener';
import { PaperTrading } from './PaperTrading';
import { AiMarketCopilot } from './AiMarketCopilot';
import { 
  BarChart3, LayoutGrid, Filter, Wallet, Bot, TrendingUp, TrendingDown, 
  Newspaper, RefreshCw, Sparkles 
} from 'lucide-react';

const STORAGE_KEY_PORTFOLIO = 'nifty50_portfolio_v1';
const STORAGE_KEY_BALANCE = 'nifty50_balance_v1';
const STORAGE_KEY_ORDERS = 'nifty50_orders_v1';

export function App() {
  const [stocks, setStocks] = useState<NiftyStock[]>(NIFTY_50_STOCKS);
  const [indexMetrics, setIndexMetrics] = useState(INITIAL_INDEX_METRICS);
  const [selectedStock, setSelectedStock] = useState<NiftyStock>(NIFTY_50_STOCKS[0]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'screener' | 'heatmap' | 'chart' | 'trading' | 'copilot'>('dashboard');

  // Paper Trading State
  const [cashBalance, setCashBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BALANCE);
      return saved ? parseFloat(saved) : 1000000;
    } catch {
      return 1000000;
    }
  });

  const [positions, setPositions] = useState<PortfolioPosition[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PORTFOLIO);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<TradeOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save trading persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BALANCE, cashBalance.toString());
    localStorage.setItem(STORAGE_KEY_PORTFOLIO, JSON.stringify(positions));
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [cashBalance, positions, orders]);

  // Live price tick simulation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        if (Math.random() > 0.4) {
          const deltaPercent = (Math.random() - 0.49) * 0.004;
          const newPrice = Math.max(stock.fiftyTwoWeekLow, stock.price * (1 + deltaPercent));
          const change = newPrice - stock.previousClose;
          const pChange = (change / stock.previousClose) * 100;
          return {
            ...stock,
            price: newPrice,
            change,
            pChange
          };
        }
        return stock;
      }));

      // Update index ticks
      setIndexMetrics(prev => ({
        ...prev,
        nifty50: {
          ...prev.nifty50,
          value: prev.nifty50.value + (Math.random() - 0.48) * 3
        }
      }));
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  const handleExecuteTrade = (symbol: string, type: 'BUY' | 'SELL', qty: number, price: number) => {
    const totalCost = qty * price;

    if (type === 'BUY') {
      setCashBalance(prev => prev - totalCost);
      setPositions(prev => {
        const existing = prev.find(p => p.symbol === symbol);
        if (existing) {
          const newQty = existing.quantity + qty;
          const newAvg = ((existing.quantity * existing.buyAvgPrice) + totalCost) / newQty;
          return prev.map(p => p.symbol === symbol ? { ...p, quantity: newQty, buyAvgPrice: newAvg } : p);
        } else {
          return [...prev, { symbol, quantity: qty, buyAvgPrice: price, buyTimestamp: Date.now() }];
        }
      });
    } else {
      setCashBalance(prev => prev + totalCost);
      setPositions(prev => {
        const existing = prev.find(p => p.symbol === symbol);
        if (!existing) return prev;
        if (existing.quantity <= qty) {
          return prev.filter(p => p.symbol !== symbol);
        } else {
          return prev.map(p => p.symbol === symbol ? { ...p, quantity: p.quantity - qty } : p);
        }
      });
    }

    // Add Order Log
    const newOrder: TradeOrder = {
      id: 'ord-' + Date.now(),
      symbol,
      type,
      quantity: qty,
      price,
      timestamp: Date.now(),
      totalValue: totalCost
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleResetPortfolio = () => {
    if (confirm('Are you sure you want to reset your paper trading balance back to ₹10,00,000?')) {
      setCashBalance(1000000);
      setPositions([]);
      setOrders([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col">
      {/* Top Real-Time Index Ticker Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-2 text-xs font-mono flex items-center justify-between overflow-x-auto gap-4">
        <div className="flex items-center gap-6">
          {Object.values(indexMetrics).map((idx) => {
            const isUp = idx.change >= 0;
            return (
              <div key={idx.name} className="flex items-center gap-2 whitespace-nowrap">
                <span className="font-bold text-slate-300">{idx.name}:</span>
                <span className="font-bold text-white">
                  {idx.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className={`flex items-center font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isUp ? '+' : ''}{idx.change.toFixed(2)} ({isUp ? '+' : ''}{idx.pChange.toFixed(2)}%)
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px] whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>NSE LIVE DATA STREAM</span>
        </div>
      </header>

      {/* Main Navigation Bar */}
      <nav className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-white tracking-wide">
                NIFTY 50 <span className="text-blue-400 text-xs font-mono font-normal">TERMINAL</span>
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            {[
              { id: 'dashboard', label: 'Overview', icon: BarChart3 },
              { id: 'screener', label: 'Screener', icon: Filter },
              { id: 'heatmap', label: 'Heatmap', icon: LayoutGrid },
              { id: 'chart', label: 'Chart', icon: TrendingUp },
              { id: 'trading', label: 'Paper Trade', icon: Wallet },
              { id: 'copilot', label: 'AI Co-Pilot', icon: Bot },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white font-bold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Market Gainers / Losers Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4" /> Nifty 50 Top Gainers Today
                </h3>
                <div className="space-y-2">
                  {[...stocks].sort((a, b) => b.pChange - a.pChange).slice(0, 4).map((stock) => (
                    <div
                      key={stock.symbol}
                      onClick={() => { setSelectedStock(stock); setActiveTab('chart'); }}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 cursor-pointer transition-colors border border-slate-800/60"
                    >
                      <div>
                        <span className="font-bold text-white text-xs">{stock.symbol}</span>
                        <span className="text-[10px] text-slate-400 block">{stock.sector}</span>
                      </div>
                      <div className="text-right font-mono text-xs">
                        <div className="text-white font-bold">₹{stock.price.toFixed(2)}</div>
                        <div className="text-emerald-400 font-bold">+{stock.pChange.toFixed(2)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2 mb-3">
                  <TrendingDown className="w-4 h-4" /> Nifty 50 Top Drags / Losers
                </h3>
                <div className="space-y-2">
                  {[...stocks].sort((a, b) => a.pChange - b.pChange).slice(0, 4).map((stock) => (
                    <div
                      key={stock.symbol}
                      onClick={() => { setSelectedStock(stock); setActiveTab('chart'); }}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 cursor-pointer transition-colors border border-slate-800/60"
                    >
                      <div>
                        <span className="font-bold text-white text-xs">{stock.symbol}</span>
                        <span className="text-[10px] text-slate-400 block">{stock.sector}</span>
                      </div>
                      <div className="text-right font-mono text-xs">
                        <div className="text-white font-bold">₹{stock.price.toFixed(2)}</div>
                        <div className="text-rose-400 font-bold">{stock.pChange.toFixed(2)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured Interactive Technical Chart */}
            <StockChart stock={selectedStock} />

            {/* Latest Indian Financial News */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Newspaper className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base text-white">Live Market Wire & Institutional Catalysts</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MARKET_NEWS.map((news) => (
                  <a
                    key={news.id}
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-slate-950 hover:bg-slate-800/60 border border-slate-800 rounded-xl space-y-2 group transition-all"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{news.source} • {news.timeAgo}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                        {news.sentiment}
                      </span>
                    </div>
                    <h4 className="font-semibold text-xs text-white group-hover:text-blue-400 transition-colors">
                      {news.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {news.summary}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'screener' && (
          <StockScreener
            stocks={stocks}
            onSelectStock={(s) => { setSelectedStock(s); setActiveTab('chart'); }}
            onTradeStock={(s) => { setSelectedStock(s); setActiveTab('trading'); }}
          />
        )}

        {activeTab === 'heatmap' && (
          <SectorHeatmap
            stocks={stocks}
            onSelectStock={(s) => { setSelectedStock(s); setActiveTab('chart'); }}
          />
        )}

        {activeTab === 'chart' && (
          <StockChart stock={selectedStock} />
        )}

        {activeTab === 'trading' && (
          <PaperTrading
            stocks={stocks}
            positions={positions}
            orders={orders}
            cashBalance={cashBalance}
            onExecuteTrade={handleExecuteTrade}
            onResetPortfolio={handleResetPortfolio}
          />
        )}

        {activeTab === 'copilot' && (
          <AiMarketCopilot
            stocks={stocks}
            selectedStock={selectedStock}
            onSelectStock={setSelectedStock}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        Nifty 50 Real-Time Market Terminal • Educational Paper Trading & AI Market Intelligence
      </footer>
    </div>
  );
}