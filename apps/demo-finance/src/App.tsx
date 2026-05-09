import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { GhostProvider, Ghost, GhostPrivacyPanel, useGhostEngine } from '@ghost-ui/react';
import { localStorageAdapter, type GhostEvent } from '@ghost-ui/core';
import { GhostDevtools } from '@ghost-ui/devtools';

// ─── Types ────────────────────────────────────────────────────────────────────

type NavId = 'portfolio' | 'markets' | 'trade' | 'history';
type OrderSide = 'buy' | 'sell';
type ToastMsg = { id: number; text: string; type: 'success' | 'info' | 'error' };

// ─── Data ────────────────────────────────────────────────────────────────────

interface Position {
  ticker: string;
  name: string;
  price: number;
  change: number;
  value: number;
  shares: number;
  sparkline: number[];
  sector: string;
}

interface WatchlistItem {
  ticker: string;
  name: string;
  price: number;
  change: number;
  sparkline: number[];
}

interface Allocation {
  label: string;
  pct: number;
  color: string;
}

interface ActivityTxn {
  type: 'BUY' | 'SELL' | 'DIV';
  ticker: string;
  amt: number;
  time: string;
}

interface TickerItem {
  sym: string;
  px: string;
  chg: string;
  up: boolean;
}

interface HistoryTxn {
  id: number;
  type: 'BUY' | 'SELL' | 'DIV';
  ticker: string;
  name: string;
  shares: number;
  price: number;
  total: number;
  date: string;
  time: string;
}

const POSITIONS: Position[] = [
  { ticker: 'NVDA', name: 'NVIDIA Corp',      price: 924.19, change: +3.82, value: 18483, shares: 20,    sparkline: [780,800,810,790,830,870,910,924], sector: 'Tech'   },
  { ticker: 'AAPL', name: 'Apple Inc',         price: 187.44, change: -0.43, value: 12381, shares: 66,    sparkline: [195,192,188,190,186,189,187,187], sector: 'Tech'   },
  { ticker: 'BTC',  name: 'Bitcoin',           price: 67221,  change: +5.14, value: 11227, shares: 0.167, sparkline: [58000,60000,63000,61000,65000,64000,68000,67221], sector: 'Crypto' },
  { ticker: 'MSFT', name: 'Microsoft Corp',    price: 420.55, change: +1.21, value: 8411,  shares: 20,    sparkline: [405,408,412,418,415,420,421,420], sector: 'Tech'   },
  { ticker: 'VOO',  name: 'Vanguard S&P 500',  price: 493.20, change: +0.66, value: 7398,  shares: 15,    sparkline: [485,487,490,488,492,491,493,493], sector: 'ETF'    },
  { ticker: 'ETH',  name: 'Ethereum',          price: 3582,   change: -1.88, value: 5015,  shares: 1.4,   sparkline: [3800,3700,3650,3600,3580,3550,3590,3582], sector: 'Crypto' },
];

const WATCHLIST_BASE: WatchlistItem[] = [
  { ticker: 'TSLA', name: 'Tesla Inc',       price: 175.22, change: +2.41, sparkline: [160,165,168,163,170,172,178,175] },
  { ticker: 'AMZN', name: 'Amazon.com',      price: 185.33, change: -0.88, sparkline: [192,190,188,186,184,186,185,185] },
  { ticker: 'GOOGL', name: 'Alphabet Inc',   price: 172.45, change: +1.12, sparkline: [165,167,170,168,172,171,174,172] },
  { ticker: 'META', name: 'Meta Platforms',  price: 492.11, change: +3.55, sparkline: [460,468,475,470,480,485,490,492] },
  { ticker: 'SOL',  name: 'Solana',          price: 145.88, change: -2.14, sparkline: [160,155,150,148,152,148,146,145] },
  { ticker: 'AVGO', name: 'Broadcom Inc',    price: 1312.5, change: +1.82, sparkline: [1280,1285,1295,1290,1305,1308,1315,1312] },
];

const HISTORY_TXNS: HistoryTxn[] = [
  { id: 1, type: 'BUY',  ticker: 'NVDA', name: 'NVIDIA Corp',    shares: 5,    price: 888.20,  total: 4441,  date: 'May 7, 2025',  time: '10:42 AM' },
  { id: 2, type: 'SELL', ticker: 'ETH',  name: 'Ethereum',       shares: 0.25, price: 3568.00, total: 892,   date: 'May 4, 2025',  time: '3:15 PM'  },
  { id: 3, type: 'BUY',  ticker: 'BTC',  name: 'Bitcoin',        shares: 0.032,price: 67187.5, total: 2149,  date: 'May 1, 2025',  time: '9:08 AM'  },
  { id: 4, type: 'BUY',  ticker: 'MSFT', name: 'Microsoft Corp', shares: 2,    price: 420.00,  total: 840,   date: 'Apr 28, 2025', time: '11:30 AM' },
  { id: 5, type: 'DIV',  ticker: 'VOO',  name: 'Vanguard S&P',   shares: 15,   price: 0,       total: 12.4,  date: 'Apr 25, 2025', time: '—'        },
  { id: 6, type: 'BUY',  ticker: 'AAPL', name: 'Apple Inc',      shares: 10,   price: 182.50,  total: 1825,  date: 'Apr 20, 2025', time: '2:00 PM'  },
  { id: 7, type: 'SELL', ticker: 'TSLA', name: 'Tesla Inc',      shares: 8,    price: 172.30,  total: 1378,  date: 'Apr 15, 2025', time: '1:20 PM'  },
];

const CHART_DATA: Record<string, number[]> = {
  '1D':  [62100,62400,62200,62600,62800,62500,62700,62915],
  '1W':  [60200,61000,60800,61500,62000,61800,62400,62915],
  '1M':  [58000,59100,58700,60200,61000,60800,62100,62915],
  '3M':  [54000,55400,56200,57800,58500,60000,61500,62915],
  '1Y':  [52200,53100,55400,54200,57000,56300,59100,62915],
  'ALL': [30000,38000,42000,48000,52000,55000,58000,62915],
};

const ALLOC: Allocation[] = [
  { label: 'Tech',   pct: 52, color: '#3d7fff' },
  { label: 'Crypto', pct: 27, color: '#9d5fff' },
  { label: 'ETF',    pct: 13, color: '#00d97e' },
  { label: 'Cash',   pct:  8, color: '#ffb020' },
];

const TXNS: ActivityTxn[] = [
  { type: 'BUY',  ticker: 'NVDA', amt: 4621,  time: '2h ago' },
  { type: 'DIV',  ticker: 'VOO',  amt:  12.4, time: '1d ago' },
  { type: 'SELL', ticker: 'ETH',  amt:  892,  time: '3d ago' },
  { type: 'BUY',  ticker: 'BTC',  amt: 2150,  time: '5d ago' },
  { type: 'BUY',  ticker: 'MSFT', amt:  840,  time: '8d ago' },
];

const TICKER_ITEMS: TickerItem[] = [
  { sym: 'BTC',  px: '67,221', chg: '+5.14%', up: true  },
  { sym: 'ETH',  px: '3,582',  chg: '-1.88%', up: false },
  { sym: 'NVDA', px: '924.19', chg: '+3.82%', up: true  },
  { sym: 'AAPL', px: '187.44', chg: '-0.43%', up: false },
  { sym: 'MSFT', px: '420.55', chg: '+1.21%', up: true  },
  { sym: 'SPX',  px: '5,123',  chg: '+0.78%', up: true  },
];

const SECTOR_COLORS: Record<string, string> = {
  Tech:   '#3d7fff',
  Crypto: '#9d5fff',
  ETF:    '#00d97e',
  Cash:   '#ffb020',
};

const TXN_COLORS: Record<'BUY' | 'SELL' | 'DIV', { bg: string; text: string }> = {
  BUY:  { bg: 'rgba(0,217,126,0.1)',  text: '#00d97e' },
  SELL: { bg: 'rgba(255,61,90,0.1)',  text: '#ff3d5a' },
  DIV:  { bg: 'rgba(255,176,32,0.1)', text: '#ffb020' },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sparkPath(pts: number[], w = 60, h = 22): string {
  const lo = Math.min(...pts), hi = Math.max(...pts), rng = hi - lo || 1;
  return 'M' + pts.map((v, i) => `${(i / (pts.length - 1)) * w},${h - ((v - lo) / rng) * h * 0.85}`).join('L');
}

function fmtPrice(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtValue(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtShares(n: number): string {
  if (n < 1) return n.toFixed(3);
  return n.toLocaleString('en-US');
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function IcPortfolio() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="5" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M5 5V3.5A1.5 1.5 0 0 1 6.5 2h3A1.5 1.5 0 0 1 11 3.5V5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M1 9h14" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  );
}

function IcMarkets() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <polyline points="1,12 5,7 8,9 12,4 15,6" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

function IcTrade() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 5h12M10 2l4 3-4 3M14 11H2M6 8l-4 3 4 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IcHistory() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IcSettings() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.42 1.42M11.53 11.53l1.42 1.42M3.05 12.95l1.42-1.42M11.53 4.47l1.42-1.42" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function IcTransfer() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M2 5h12M10 2l4 3-4 3M14 11H2M6 8l-4 3 4 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IcInvest() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <polyline points="1,13 5,8 8,10 12,5 15,7" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"/>
      <polyline points="11,5 15,5 15,9" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

function IcDeposit() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 1v9M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 13h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function IcWithdraw() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 10V1M5 4l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 13h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function IcStatement() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="1" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M5 5h6M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function IcSearch() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function IcBell() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M8 1a5 5 0 0 1 5 5v3l1.5 2H1.5L3 9V6a5 5 0 0 1 5-5Z" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  );
}

function IcChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12" fill="none"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
    >
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Toast System ─────────────────────────────────────────────────────────────

function ToastContainer({ toasts }: { toasts: ToastMsg[] }) {
  const toastBg: Record<ToastMsg['type'], string> = {
    success: 'bg-green/10 border-green/20 text-green',
    info:    'bg-accent-dim border-accent/20 text-accent-text',
    error:   'bg-red/10 border-red/20 text-red',
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg border text-[13px] font-medium backdrop-blur-sm shadow-lg min-w-[220px] max-w-[320px] ${toastBg[t.type]}`}
          style={{ animation: 'fade-in 0.2s ease-out both' }}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}

// ─── Transfer Modal ───────────────────────────────────────────────────────────

interface TransferModalProps {
  onClose: () => void;
  onConfirm: (amount: string, account: string) => void;
}

function TransferModal({ onClose, onConfirm }: TransferModalProps) {
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('bank4521');

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{ backdropFilter: 'blur(6px)', background: 'rgba(2,4,9,0.7)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-surface border border-line-2 rounded-2xl p-6 w-full max-w-[360px] shadow-2xl"
        style={{ animation: 'fade-in 0.18s ease-out both' }}
      >
        <div className="flex items-center justify-between mb-5">
          <span className="text-[15px] font-semibold text-fg">Transfer Funds</span>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-full text-secondary hover:text-fg hover:bg-white/[0.06] transition-colors cursor-pointer text-[16px] leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[11px] text-secondary font-medium mb-1.5 block uppercase tracking-wider">Amount</label>
            <div className="flex items-center gap-2 bg-faint border border-line-2 rounded-lg px-3 py-2.5 focus-within:border-accent/40 transition-colors">
              <span className="text-secondary text-[14px] font-mono">$</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-fg font-mono text-[14px] outline-none placeholder:text-muted"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-secondary font-medium mb-1.5 block uppercase tracking-wider">To Account</label>
            <select
              value={account}
              onChange={e => setAccount(e.target.value)}
              className="w-full bg-faint border border-line-2 rounded-lg px-3 py-2.5 text-[13px] text-fg outline-none focus:border-accent/40 transition-colors cursor-pointer appearance-none"
            >
              <option value="bank4521">Bank ···4521</option>
              <option value="savings8832">Savings ···8832</option>
              <option value="wallet">External Wallet</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-line-2 text-secondary text-[13px] font-medium hover:text-fg hover:border-line transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (amount && parseFloat(amount) > 0) {
                onConfirm(amount, account);
              }
            }}
            className="flex-1 py-2.5 rounded-lg bg-accent text-white text-[13px] font-medium hover:bg-accent/90 transition-colors cursor-pointer"
          >
            Confirm Transfer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────

function DonutChart({ data }: { data: Allocation[] }) {
  const r = 34, cx = 50, cy = 50, sw = 16;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg viewBox="0 0 100 100" className="w-[90px] h-[90px] shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={sw} />
      {data.map(seg => {
        const dash = (seg.pct / 100) * circ;
        const strokeDashoffset = -offset;
        offset += dash;
        return (
          <circle
            key={seg.label}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={sw}
            strokeDasharray={`${dash} ${circ}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="butt"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
          />
        );
      })}
      <text x="50" y="46" textAnchor="middle" fill="#dce8f0" fontSize="8" fontFamily="IBM Plex Mono" fontWeight="500">$62,915</text>
      <text x="50" y="56" textAnchor="middle" fill="#7a90a8" fontSize="6" fontFamily="IBM Plex Sans">total</text>
    </svg>
  );
}

// ─── Performance Chart ────────────────────────────────────────────────────────

function PerformanceChart({ chartPts }: { chartPts: number[] }) {
  const w = 400, h = 80;
  const lo = Math.min(...chartPts), hi = Math.max(...chartPts), rng = hi - lo || 1;
  const pts = chartPts.map((v, i) => ({
    x: (i / (chartPts.length - 1)) * w,
    y: h - ((v - lo) / rng) * (h - 12) - 6,
  }));

  const smoothPath = (() => {
    if (pts.length < 2) return '';
    let d = `M${pts[0]!.x},${pts[0]!.y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1]!;
      const cur = pts[i]!;
      const cpx = (prev.x + cur.x) / 2;
      d += ` C${cpx},${prev.y} ${cpx},${cur.y} ${cur.x},${cur.y}`;
    }
    return d;
  })();

  const last = pts[pts.length - 1]!;
  const areaPath = smoothPath + ` L${last.x},${h} L${pts[0]!.x},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-[80px]">
      <defs>
        <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d7fff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#3d7fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#chart-fill)" />
      <path d={smoothPath} fill="none" stroke="#3d7fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r="3" fill="#3d7fff" />
      <circle cx={last.x} cy={last.y} r="3" fill="rgba(61,127,255,0.3)">
        <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

// ─── Sparkline ───────────────────────────────────────────────────────────────

function Sparkline({ pts, up }: { pts: number[]; up: boolean }) {
  return (
    <svg viewBox="0 0 60 22" className="w-[60px] h-[22px]">
      <path
        d={sparkPath(pts)}
        fill="none"
        stroke={up ? '#00d97e' : '#ff3d5a'}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function navCls(active: boolean) {
  return [
    'flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium w-full text-left transition-colors cursor-pointer',
    active
      ? 'bg-accent-dim text-accent-text border border-accent/20'
      : 'text-secondary hover:text-fg hover:bg-white/[0.04] border border-transparent',
  ].join(' ');
}

interface SidebarProps {
  active: NavId;
  onNav: (id: NavId) => void;
}

function Sidebar({ active, onNav }: SidebarProps) {
  return (
    <aside className="w-[220px] shrink-0 flex flex-col bg-surface border-r border-line h-full">
      <div className="flex items-center gap-3 px-5 py-[18px] border-b border-line">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <defs>
            <linearGradient id="hex-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3d7fff" />
              <stop offset="100%" stopColor="#7b5fff" />
            </linearGradient>
          </defs>
          <polygon
            points="14,2 24,8 24,20 14,26 4,20 4,8"
            fill="url(#hex-grad)"
            opacity="0.15"
            stroke="url(#hex-grad)"
            strokeWidth="1.5"
          />
          <path d="M9 14l3 3 7-7" stroke="#3d7fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-[15px] font-semibold tracking-tight text-fg">Apex</span>
        <span className="ml-auto text-[10px] font-medium px-[6px] py-[2px] rounded bg-green/10 text-green border border-green/20 leading-none">Pro</span>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        <Ghost.Slot zone="apex.nav" className="flex flex-col gap-0.5">
          <Ghost.Button id="portfolio" zone="apex.nav" onClick={() => onNav('portfolio')} className={navCls(active === 'portfolio')}>
            <IcPortfolio />
            <span>Portfolio</span>
          </Ghost.Button>
          <Ghost.Button id="markets" zone="apex.nav" onClick={() => onNav('markets')} className={navCls(active === 'markets')}>
            <IcMarkets />
            <span>Markets</span>
            <span
              className="ml-auto w-[6px] h-[6px] rounded-full bg-green"
              style={{ animation: 'pulse-green 2s ease-in-out infinite' }}
            />
          </Ghost.Button>
          <Ghost.Button id="trade" zone="apex.nav" onClick={() => onNav('trade')} className={navCls(active === 'trade')}>
            <IcTrade />
            <span>Trade</span>
          </Ghost.Button>
          <Ghost.Button id="history" zone="apex.nav" onClick={() => onNav('history')} className={navCls(active === 'history')}>
            <IcHistory />
            <span>History</span>
          </Ghost.Button>
        </Ghost.Slot>
      </nav>

      <div className="border-t border-line p-3 flex flex-col gap-2">
        <button className="flex items-center gap-2 px-3 py-2 rounded-md text-secondary hover:text-fg hover:bg-white/[0.04] transition-colors text-[13px] w-full cursor-pointer">
          <IcSettings />
          <span>Settings</span>
        </button>
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md bg-faint border border-line-2">
          <div className="relative shrink-0">
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-[11px] font-semibold text-white">AK</div>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green border border-surface" />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-fg truncate">Alex Kim</div>
            <div className="text-[10px] text-secondary truncate">Premium · Verified</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <header className="flex items-center h-9 border-b border-line bg-surface shrink-0 overflow-hidden">
      <div className="flex-1 overflow-hidden relative">
        <div
          className="flex items-center whitespace-nowrap"
          style={{ animation: 'ticker-scroll 28s linear infinite' }}
        >
          {doubled.map((t, i) => (
            <span key={i} className="flex items-center gap-1.5 px-5 text-[11px]">
              <span className="font-mono font-medium text-fg">{t.sym}</span>
              <span className="font-mono text-secondary">${t.px}</span>
              <span className={`font-mono font-medium ${t.up ? 'text-green' : 'text-red'}`}>{t.chg}</span>
              <span className="text-muted mx-1">·</span>
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1 pr-4 pl-2 shrink-0 border-l border-line h-full">
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-secondary hover:text-fg hover:bg-white/[0.05] transition-colors text-[11px] cursor-pointer">
          <IcSearch />
          <span className="font-mono">Search</span>
        </button>
        <button className="relative p-1.5 rounded text-secondary hover:text-fg hover:bg-white/[0.05] transition-colors cursor-pointer">
          <IcBell />
          <span className="absolute top-1 right-1 w-[5px] h-[5px] rounded-full bg-red" />
        </button>
      </div>
    </header>
  );
}

// ─── Portfolio View ───────────────────────────────────────────────────────────

interface PortfolioViewProps {
  onAction: (action: string) => void;
}

function PortfolioView({ onAction }: PortfolioViewProps) {
  const [range, setRange] = useState('1Y');
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const ranges = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];
  const chartPts = CHART_DATA[range] ?? CHART_DATA['1Y']!;

  const btnCls = 'flex flex-col items-center gap-1.5 px-4 py-3 rounded-lg border border-line-2 bg-card hover:border-accent/30 hover:bg-accent-dim transition-colors cursor-pointer group min-w-[80px]';
  const iconCls = 'text-accent';
  const labelCls = 'text-[11px] text-secondary group-hover:text-fg transition-colors font-medium';

  return (
    <div className="flex-1 grid grid-cols-[1fr_280px] overflow-hidden">
      <div className="overflow-y-auto p-6 flex flex-col gap-5 border-r border-line">
        {/* Balance header */}
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[11px] font-mono text-secondary uppercase tracking-widest mb-1">Total Portfolio</div>
            <div className="text-[32px] font-semibold text-fg leading-none font-mono tracking-tight">$62,915.00</div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[12px] font-mono text-green">+$842.55 today</span>
              <span className="text-[11px] font-mono text-secondary">+18.4% all time</span>
            </div>
          </div>
          <div className="flex items-center gap-0.5 bg-faint rounded-md p-0.5 border border-line">
            {ranges.map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={[
                  'px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer',
                  range === r ? 'bg-accent text-white' : 'text-secondary hover:text-fg',
                ].join(' ')}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <div className="text-[10px] font-mono text-secondary/60 mb-2 flex items-center gap-1.5">
            <span className="text-accent">⚡</span>
            Ghost AI — actions reorder as you use them
          </div>
          <Ghost.Slot zone="apex.actions" className="flex gap-2 flex-wrap">
            <Ghost.Button id="transfer" zone="apex.actions" onClick={() => onAction('transfer')} className={btnCls}>
              <span className={iconCls}><IcTransfer /></span>
              <span className={labelCls}>Transfer</span>
            </Ghost.Button>
            <Ghost.Button id="invest" zone="apex.actions" onClick={() => onAction('invest')} className={btnCls}>
              <span className={iconCls}><IcInvest /></span>
              <span className={labelCls}>Invest</span>
            </Ghost.Button>
            <Ghost.Button id="deposit" zone="apex.actions" onClick={() => onAction('deposit')} className={btnCls}>
              <span className={iconCls}><IcDeposit /></span>
              <span className={labelCls}>Deposit</span>
            </Ghost.Button>
            <Ghost.Button id="withdraw" zone="apex.actions" onClick={() => onAction('withdraw')} className={btnCls}>
              <span className={iconCls}><IcWithdraw /></span>
              <span className={labelCls}>Withdraw</span>
            </Ghost.Button>
            <Ghost.Button id="statement" zone="apex.actions" onClick={() => onAction('statement')} className={btnCls}>
              <span className={iconCls}><IcStatement /></span>
              <span className={labelCls}>Statement</span>
            </Ghost.Button>
          </Ghost.Slot>
        </div>

        {/* Chart card */}
        <div className="bg-card rounded-xl border border-line p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-medium text-secondary">Performance</span>
            <span className="text-[11px] font-mono text-green">+18.4%</span>
          </div>
          <PerformanceChart chartPts={chartPts} />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] font-mono text-secondary">
              {range === '1D' ? 'Today' : range === '1W' ? '7 days ago' : range === '1M' ? '1 month ago' : range === '3M' ? '3 months ago' : range === '1Y' ? 'Jan 2024' : '2020'}
            </span>
            <span className="text-[10px] font-mono text-secondary">May 2025</span>
          </div>
        </div>

        {/* Holdings map — Ghost.Canvas floats most-viewed tickers toward top-left */}
        <div className="bg-card rounded-xl border border-line p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-medium text-secondary">Holdings Map</span>
            <span className="text-[10px] font-mono text-secondary/50">most-watched drift top-left</span>
          </div>
          <Ghost.Canvas zone="apex.holdings" style={{ height: 120, borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            {POSITIONS.map(pos => (
              <Ghost.Item key={pos.ticker} id={`holding-${pos.ticker.toLowerCase()}`} zone="apex.holdings"
                className="flex flex-col items-center gap-0.5 cursor-pointer select-none"
                style={{ transform: 'translate(-50%, -50%)' }}
              >
                <span className="text-[11px] font-bold font-mono text-fg">{pos.ticker}</span>
                <span className={`text-[9px] font-mono ${pos.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {pos.change >= 0 ? '+' : ''}{pos.change.toFixed(2)}%
                </span>
              </Ghost.Item>
            ))}
          </Ghost.Canvas>
        </div>

        {/* Positions table */}
        <div className="bg-card rounded-xl border border-line overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-line">
            <span className="text-[13px] font-semibold text-fg">Positions</span>
            <button className="text-[11px] text-accent-text hover:text-accent transition-colors cursor-pointer">See all</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-line">
                {['Asset', 'Price', 'Value', '7D', 'Holdings'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-medium text-secondary uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {POSITIONS.map(pos => {
                const isExpanded = selectedTicker === pos.ticker;
                const avgCost = pos.value / pos.shares;
                const pnl = (pos.price - avgCost) * pos.shares;
                const pnlPct = ((pos.price - avgCost) / avgCost) * 100;
                return (
                  <>
                    <tr
                      key={pos.ticker}
                      onClick={() => setSelectedTicker(isExpanded ? null : pos.ticker)}
                      className="border-b border-line last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded"
                            style={{
                              color: SECTOR_COLORS[pos.sector] ?? '#7a90a8',
                              background: `${SECTOR_COLORS[pos.sector] ?? '#7a90a8'}1a`,
                            }}
                          >
                            {pos.ticker}
                          </span>
                          <span className="text-[12px] text-secondary truncate max-w-[120px]">{pos.name}</span>
                          <IcChevronDown open={isExpanded} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[12px] text-fg tabular-nums">${fmtPrice(pos.price)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[12px] text-fg tabular-nums">{fmtValue(pos.value)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Sparkline pts={pos.sparkline} up={pos.change >= 0} />
                          <span className={`font-mono text-[11px] tabular-nums ${pos.change >= 0 ? 'text-green' : 'text-red'}`}>
                            {pos.change >= 0 ? '+' : ''}{pos.change.toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[12px] text-secondary tabular-nums">{fmtShares(pos.shares)} {pos.ticker}</span>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${pos.ticker}-detail`} className="border-b border-line bg-faint/60">
                        <td colSpan={5} className="px-4 py-3">
                          <div className="flex items-center gap-8 text-[11px]">
                            <div>
                              <span className="text-secondary block mb-0.5">Avg Cost Basis</span>
                              <span className="font-mono text-fg">${fmtPrice(avgCost)}</span>
                            </div>
                            <div>
                              <span className="text-secondary block mb-0.5">Market Value</span>
                              <span className="font-mono text-fg">{fmtValue(pos.value)}</span>
                            </div>
                            <div>
                              <span className="text-secondary block mb-0.5">Total P&amp;L</span>
                              <span className={`font-mono font-medium ${pnl >= 0 ? 'text-green' : 'text-red'}`}>
                                {pnl >= 0 ? '+' : ''}{fmtValue(Math.round(pnl))} ({pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%)
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right column */}
      <div className="overflow-y-auto p-5 flex flex-col gap-5">
        {/* Allocation */}
        <div className="bg-card rounded-xl border border-line p-4">
          <div className="text-[13px] font-semibold text-fg mb-4">Allocation</div>
          <div className="flex items-center gap-4 mb-4">
            <DonutChart data={ALLOC} />
            <div className="flex flex-col gap-2 min-w-0">
              {ALLOC.map(seg => (
                <div key={seg.label} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: seg.color }} />
                  <span className="text-[11px] text-secondary truncate">{seg.label}</span>
                  <span className="font-mono text-[11px] text-fg ml-auto pl-2 tabular-nums">{seg.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="bg-card rounded-xl border border-line overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-line">
            <span className="text-[13px] font-semibold text-fg">Activity</span>
            <button className="text-[11px] text-accent-text hover:text-accent transition-colors cursor-pointer">All</button>
          </div>
          <div className="divide-y divide-line">
            {TXNS.map((txn, i) => {
              const cfg = TXN_COLORS[txn.type];
              const sign = txn.type === 'SELL' ? '-' : '+';
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                  <span
                    className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded shrink-0"
                    style={{ background: cfg.bg, color: cfg.text }}
                  >
                    {txn.type}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-medium text-fg">{txn.ticker}</div>
                    <div className="text-[10px] text-secondary">{txn.time}</div>
                  </div>
                  <span className="font-mono text-[12px] tabular-nums shrink-0" style={{ color: cfg.text }}>
                    {sign}${txn.amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Markets View ─────────────────────────────────────────────────────────────

interface MarketsViewProps {
  onToast: (text: string, type?: ToastMsg['type']) => void;
}

function MarketsView({ onToast }: MarketsViewProps) {
  const [prices, setPrices] = useState<WatchlistItem[]>(WATCHLIST_BASE);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(item => {
        const noise = 1 + (Math.random() - 0.5) * 0.006;
        const newPrice = item.price * noise;
        return { ...item, price: parseFloat(newPrice.toFixed(2)) };
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[18px] font-semibold text-fg">Markets</h2>
          <p className="text-[12px] text-secondary mt-0.5">Live prices · updates every 2.5s</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-[6px] h-[6px] rounded-full bg-green" style={{ animation: 'pulse-green 2s ease-in-out infinite' }} />
          <span className="text-[11px] font-mono text-green">LIVE</span>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-line overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line">
              {['Asset', 'Price', 'Change', '7D Chart', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-medium text-secondary uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prices.map(item => (
              <tr key={item.ticker} className="border-b border-line last:border-0 hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded bg-accent-dim text-accent-text">{item.ticker}</span>
                    <span className="text-[12px] text-secondary">{item.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="font-mono text-[13px] text-fg tabular-nums">${fmtPrice(item.price)}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`font-mono text-[12px] tabular-nums ${item.change >= 0 ? 'text-green' : 'text-red'}`}>
                    {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <Sparkline pts={item.sparkline} up={item.change >= 0} />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToast(`Buy order placed for ${item.ticker}`, 'success')}
                      className="px-3 py-1.5 rounded-md bg-green/10 text-green text-[11px] font-medium border border-green/20 hover:bg-green/20 transition-colors cursor-pointer"
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => onToast(`Price alert set for ${item.ticker}`, 'info')}
                      className="px-3 py-1.5 rounded-md bg-faint text-secondary text-[11px] font-medium border border-line-2 hover:text-fg hover:border-line transition-colors cursor-pointer"
                    >
                      Alert
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Trade View ───────────────────────────────────────────────────────────────

interface TradeViewProps {
  onToast: (text: string, type?: ToastMsg['type']) => void;
}

function TradeView({ onToast }: TradeViewProps) {
  const [side, setSide] = useState<OrderSide>('buy');
  const [ticker, setTicker] = useState('NVDA');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [amount, setAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState('');

  const selectedPos = POSITIONS.find(p => p.ticker === ticker)!;
  const usdAmt = parseFloat(amount) || 0;
  const estShares = usdAmt > 0 && selectedPos ? usdAmt / selectedPos.price : 0;

  const handleSubmit = () => {
    if (!usdAmt || usdAmt <= 0) {
      onToast('Enter a valid amount', 'error');
      return;
    }
    const verb = side === 'buy' ? 'Bought' : 'Sold';
    const sharesStr = estShares < 0.01 ? estShares.toFixed(6) : estShares.toFixed(4);
    onToast(`${verb} ${sharesStr} ${ticker} for $${usdAmt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'success');
    setAmount('');
    setLimitPrice('');
  };

  const sideBtnCls = (s: OrderSide) => [
    'flex-1 py-2 rounded-md text-[13px] font-medium transition-colors cursor-pointer',
    side === s
      ? s === 'buy' ? 'bg-green text-bg' : 'bg-red text-white'
      : 'text-secondary hover:text-fg',
  ].join(' ');

  return (
    <div className="flex-1 overflow-y-auto p-6 flex items-start justify-center">
      <div className="w-full max-w-[420px] bg-card border border-line rounded-2xl p-6 flex flex-col gap-5">
        <div>
          <h2 className="text-[16px] font-semibold text-fg">Place Order</h2>
          <p className="text-[12px] text-secondary mt-0.5">Market and limit orders</p>
        </div>

        {/* Buy / Sell toggle */}
        <div>
          <label className="text-[10px] font-medium text-secondary uppercase tracking-wider mb-2 block">
            Side — Ghost AI reorders by usage
          </label>
          <Ghost.Slot zone="apex.trade-side" className="flex gap-2 bg-faint rounded-lg p-1 border border-line">
            <Ghost.Button id="buy" zone="apex.trade-side" onClick={() => setSide('buy')} className={sideBtnCls('buy')}>
              Buy
            </Ghost.Button>
            <Ghost.Button id="sell" zone="apex.trade-side" onClick={() => setSide('sell')} className={sideBtnCls('sell')}>
              Sell
            </Ghost.Button>
          </Ghost.Slot>
        </div>

        {/* Asset selector */}
        <div>
          <label className="text-[10px] font-medium text-secondary uppercase tracking-wider mb-1.5 block">Asset</label>
          <select
            value={ticker}
            onChange={e => setTicker(e.target.value)}
            className="w-full bg-faint border border-line-2 rounded-lg px-3 py-2.5 text-[13px] text-fg outline-none focus:border-accent/40 transition-colors cursor-pointer appearance-none"
          >
            {POSITIONS.map(p => (
              <option key={p.ticker} value={p.ticker}>{p.ticker} — {p.name}</option>
            ))}
          </select>
          {selectedPos && (
            <div className="mt-1.5 text-[11px] font-mono text-secondary">
              Current price: <span className="text-fg">${fmtPrice(selectedPos.price)}</span>
              <span className={`ml-2 ${selectedPos.change >= 0 ? 'text-green' : 'text-red'}`}>
                {selectedPos.change >= 0 ? '+' : ''}{selectedPos.change.toFixed(2)}%
              </span>
            </div>
          )}
        </div>

        {/* Order type */}
        <div>
          <label className="text-[10px] font-medium text-secondary uppercase tracking-wider mb-1.5 block">Order Type</label>
          <div className="flex gap-2">
            {(['market', 'limit'] as const).map(t => (
              <button
                key={t}
                onClick={() => setOrderType(t)}
                className={[
                  'flex-1 py-2 rounded-md text-[12px] font-medium border transition-colors cursor-pointer capitalize',
                  orderType === t
                    ? 'bg-accent-dim border-accent/30 text-accent-text'
                    : 'border-line-2 text-secondary hover:text-fg hover:border-line',
                ].join(' ')}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="text-[10px] font-medium text-secondary uppercase tracking-wider mb-1.5 block">Amount (USD)</label>
          <div className="flex items-center gap-2 bg-faint border border-line-2 rounded-lg px-3 py-2.5 focus-within:border-accent/40 transition-colors">
            <span className="text-secondary font-mono">$</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-transparent text-fg font-mono text-[14px] outline-none placeholder:text-muted"
            />
          </div>
        </div>

        {/* Limit price */}
        {orderType === 'limit' && (
          <div>
            <label className="text-[10px] font-medium text-secondary uppercase tracking-wider mb-1.5 block">Limit Price</label>
            <div className="flex items-center gap-2 bg-faint border border-line-2 rounded-lg px-3 py-2.5 focus-within:border-accent/40 transition-colors">
              <span className="text-secondary font-mono">$</span>
              <input
                type="number"
                value={limitPrice}
                onChange={e => setLimitPrice(e.target.value)}
                placeholder={selectedPos ? fmtPrice(selectedPos.price) : '0.00'}
                className="flex-1 bg-transparent text-fg font-mono text-[14px] outline-none placeholder:text-muted"
              />
            </div>
          </div>
        )}

        {/* Estimated shares */}
        {estShares > 0 && (
          <div className="bg-faint rounded-lg px-4 py-3 border border-line-2">
            <div className="text-[10px] text-secondary uppercase tracking-wider mb-1">Estimated</div>
            <div className="font-mono text-[13px] text-fg">{estShares < 0.01 ? estShares.toFixed(6) : estShares.toFixed(4)} <span className="text-secondary">{ticker}</span></div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className={[
            'w-full py-3 rounded-xl text-[14px] font-semibold transition-colors cursor-pointer',
            side === 'buy'
              ? 'bg-green text-bg hover:bg-green/90'
              : 'bg-red text-white hover:bg-red/90',
          ].join(' ')}
        >
          {side === 'buy' ? 'Buy' : 'Sell'} {ticker}
        </button>

        <p className="text-[10px] text-center text-secondary/60">
          Orders are simulated · No real funds involved
        </p>
      </div>
    </div>
  );
}

// ─── History View ─────────────────────────────────────────────────────────────

type HistoryFilter = 'All' | 'Buys' | 'Sells' | 'Dividends';

function HistoryView() {
  const [filter, setFilter] = useState<HistoryFilter>('All');

  const filtered = HISTORY_TXNS.filter(t => {
    if (filter === 'Buys') return t.type === 'BUY';
    if (filter === 'Sells') return t.type === 'SELL';
    if (filter === 'Dividends') return t.type === 'DIV';
    return true;
  });

  const filterBtnCls = (f: HistoryFilter) => [
    'px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors cursor-pointer',
    filter === f
      ? 'bg-accent-dim text-accent-text border border-accent/20'
      : 'text-secondary hover:text-fg border border-transparent',
  ].join(' ');

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[18px] font-semibold text-fg">Transaction History</h2>
          <p className="text-[12px] text-secondary mt-0.5">{HISTORY_TXNS.length} transactions · Ghost AI reorders filters</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-4">
        <Ghost.Slot zone="apex.history-filter" className="flex items-center gap-1 bg-faint border border-line rounded-lg p-1 w-fit">
          <Ghost.Button id="filter-all"       zone="apex.history-filter" onClick={() => setFilter('All')}       className={filterBtnCls('All')}>All</Ghost.Button>
          <Ghost.Button id="filter-buys"      zone="apex.history-filter" onClick={() => setFilter('Buys')}      className={filterBtnCls('Buys')}>Buys</Ghost.Button>
          <Ghost.Button id="filter-sells"     zone="apex.history-filter" onClick={() => setFilter('Sells')}     className={filterBtnCls('Sells')}>Sells</Ghost.Button>
          <Ghost.Button id="filter-dividends" zone="apex.history-filter" onClick={() => setFilter('Dividends')} className={filterBtnCls('Dividends')}>Dividends</Ghost.Button>
        </Ghost.Slot>
      </div>

      <div className="bg-card rounded-xl border border-line overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center text-secondary text-[13px]">No transactions match this filter</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-line">
                {['Type', 'Asset', 'Shares', 'Price', 'Total', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-medium text-secondary uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(txn => {
                const cfg = TXN_COLORS[txn.type];
                return (
                  <tr key={txn.id} className="border-b border-line last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3.5">
                      <span
                        className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded"
                        style={{ background: cfg.bg, color: cfg.text }}
                      >
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-mono font-medium text-fg">{txn.ticker}</span>
                        <span className="text-[11px] text-secondary">{txn.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-[12px] text-secondary tabular-nums">{fmtShares(txn.shares)}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-[12px] text-fg tabular-nums">
                        {txn.price > 0 ? `$${fmtPrice(txn.price)}` : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className="font-mono text-[12px] font-medium tabular-nums"
                        style={{ color: cfg.text }}
                      >
                        {txn.type === 'SELL' ? '-' : '+'}${txn.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-[11px] text-secondary">
                        <div>{txn.date}</div>
                        <div className="font-mono">{txn.time}</div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export function App() {
  const [nav, setNav] = useState<NavId>('portfolio');
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [modal, setModal] = useState<'transfer' | null>(null);
  const toastId = useRef(0);

  function addToast(text: string, type: ToastMsg['type'] = 'success') {
    const id = ++toastId.current;
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }

  function handlePortfolioAction(action: string) {
    if (action === 'transfer') {
      setModal('transfer');
    } else if (action === 'invest') {
      addToast('Opening investment options…', 'info');
    } else if (action === 'deposit') {
      addToast('Deposit initiated — funds arrive in 1–2 days', 'info');
    } else if (action === 'withdraw') {
      addToast('Withdrawal request submitted', 'info');
    } else if (action === 'statement') {
      addToast('Statement PDF generated', 'success');
    }
  }

  function handleTransferConfirm(amount: string, account: string) {
    const accountLabel = account === 'bank4521' ? 'Bank ···4521' : account === 'savings8832' ? 'Savings ···8832' : 'External Wallet';
    addToast(`$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} transferred to ${accountLabel}`, 'success');
    setModal(null);
  }

  return (
    <GhostProvider persistence={localStorageAdapter('apex-v1')}>
      <div className="flex h-full bg-bg overflow-hidden" style={{ animation: 'fade-in 0.25s ease-out both' }}>
        <Sidebar active={nav} onNav={setNav} />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          {nav === 'portfolio' && <PortfolioView onAction={handlePortfolioAction} />}
          {nav === 'markets'   && <MarketsView onToast={addToast} />}
          {nav === 'trade'     && <TradeView onToast={addToast} />}
          {nav === 'history'   && <HistoryView />}
        </div>
      </div>

      <ToastContainer toasts={toasts} />

      {modal === 'transfer' && (
        <TransferModal
          onClose={() => setModal(null)}
          onConfirm={handleTransferConfirm}
        />
      )}
      <GhostDemoBar />
      <GhostDevtools defaultOpen={true} />
    </GhostProvider>
  );
}

const APEX_SIM_EVENTS: Array<{ id: string; zone: string; count: number }> = [
  { id: 'invest',          zone: 'apex.actions',        count: 42 },
  { id: 'transfer',        zone: 'apex.actions',        count: 28 },
  { id: 'deposit',         zone: 'apex.actions',        count: 14 },
  { id: 'withdraw',        zone: 'apex.actions',        count:  7 },
  { id: 'statement',       zone: 'apex.actions',        count:  3 },
  { id: 'portfolio',       zone: 'apex.nav',            count: 35 },
  { id: 'markets',         zone: 'apex.nav',            count: 25 },
  { id: 'trade',           zone: 'apex.nav',            count: 20 },
  { id: 'history',         zone: 'apex.nav',            count:  8 },
  { id: 'buy',             zone: 'apex.trade-side',     count: 30 },
  { id: 'sell',            zone: 'apex.trade-side',     count: 12 },
  { id: 'filter-buys',     zone: 'apex.history-filter', count: 22 },
  { id: 'filter-all',      zone: 'apex.history-filter', count: 15 },
  { id: 'filter-sells',    zone: 'apex.history-filter', count:  8 },
  { id: 'filter-dividends',zone: 'apex.history-filter', count:  4 },
  { id: 'holding-nvda',    zone: 'apex.holdings',       count: 45 },
  { id: 'holding-aapl',    zone: 'apex.holdings',       count: 38 },
  { id: 'holding-btc',     zone: 'apex.holdings',       count: 30 },
  { id: 'holding-msft',    zone: 'apex.holdings',       count: 20 },
  { id: 'holding-voo',     zone: 'apex.holdings',       count: 12 },
  { id: 'holding-eth',     zone: 'apex.holdings',       count:  8 },
];

function GhostDemoBar() {
  const engine = useGhostEngine();
  const [eventCount, setEventCount] = useState(() => engine.events().length);
  const [simulated, setSimulated] = useState(false);

  useEffect(() => engine.subscribe(() => setEventCount(engine.events().length)), [engine]);

  function handleSimulate() {
    const now = Date.now();
    const DAY = 86_400_000;
    const events: GhostEvent[] = APEX_SIM_EVENTS.flatMap(({ id, zone, count }) =>
      Array.from({ length: count }, () => ({
        id, zone, type: 'click' as const,
        ts: now - Math.pow(Math.random(), 1.5) * 28 * DAY,
      }))
    ).sort((a, b) => a.ts - b.ts);
    engine._injectEvents(events);
    setSimulated(true);
  }

  function handleReset() {
    engine.reset();
    setSimulated(false);
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex flex-col gap-2.5 rounded-xl border border-white/[0.08] bg-bg/90 backdrop-blur-md p-3.5 w-60 shadow-2xl shadow-black/60">
      <div className="flex items-center justify-between">
        <span className="font-bold text-accent-text tracking-widest uppercase text-[9px]">Ghost Engine</span>
        <span className="rounded-full bg-accent-dim text-accent-text px-2 py-0.5 text-[10px] font-mono tabular-nums">{eventCount} events</span>
      </div>
      <p className="text-[10px] text-muted leading-relaxed">Inject 4 weeks of realistic usage — watch Ghost UI reorder actions and filters by investment behavior.</p>
      <button
        onClick={handleSimulate}
        disabled={simulated}
        className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all active:scale-[0.97] ${simulated ? 'bg-accent-dim text-accent-text cursor-default' : 'bg-accent text-white hover:opacity-90'}`}
      >
        {simulated ? '✓ Simulated' : '⚡ Simulate 4-week usage'}
      </button>
      <button
        onClick={handleReset}
        className="rounded-lg px-3 py-1.5 text-[11px] font-medium text-muted hover:text-secondary hover:bg-white/[0.04] transition-all"
      >
        ↺ Reset all scores
      </button>
      <div className="border-t border-white/[0.06] pt-2.5">
        <GhostPrivacyPanel style={{ borderRadius: 8, padding: '8px 10px', gap: 6 }} />
      </div>
    </div>
  );
}
