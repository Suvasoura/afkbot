export type Sector = 
  | 'Financial Services'
  | 'Information Technology'
  | 'Oil & Gas'
  | 'FMCG'
  | 'Automobile'
  | 'Metals & Mining'
  | 'Healthcare'
  | 'Consumer Durables'
  | 'Power & Utilities'
  | 'Construction'
  | 'Telecommunication'
  | 'Chemicals';

export interface NiftyStock {
  symbol: string;
  name: string;
  sector: Sector;
  price: number;
  change: number;
  pChange: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  marketCapCr: number; // in Crores INR
  peRatio: number;
  pbRatio: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  rsi14: number;
  weightagePercent: number; // Nifty 50 weightage %
  signal: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  dayHistory: number[]; // Price trend points for mini sparkline
}

export interface PortfolioPosition {
  symbol: string;
  quantity: number;
  buyAvgPrice: number;
  buyTimestamp: number;
}

export interface TradeOrder {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  timestamp: number;
  totalValue: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  summary: string;
  relatedSymbols: string[];
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  url: string;
}

export interface IndexMetric {
  name: string;
  value: number;
  change: number;
  pChange: number;
  high: number;
  low: number;
}