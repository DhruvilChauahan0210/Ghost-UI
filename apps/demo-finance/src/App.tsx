import { useState } from 'react';
import type { ReactNode } from 'react';
import { GhostProvider, Ghost } from '@ghost-ui/react';
import { localStorageAdapter } from '@ghost-ui/core';

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

interface Allocation {
  label: string;
  pct: number;
  color: string;
}

interface Transaction {
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

const POSITIONS: Position[] = [
  { ticker: 'NVDA', name: 'NVIDIA Corp',     price: 924.19,  change: +3.82, value: 18483, shares: 20,    sparkline: [780,800,810,790,830,870,910,924], sector: 'Tech'   },
  { ticker: 'AAPL', name: 'Apple Inc',        price: 187.44,  change: -0.43, value: 12381, shares: 66,    sparkline: [195,192,188,190,186,189,187,187], sector: 'Tech'   },
  { ticker: 'BTC',  name: 'Bitcoin',          price: 67221,   change: +5.14, value: 11227, shares: 0.167, sparkline: [58000,60000,63000,61000,65000,64000,68000,67221], sector: 'Crypto' },
  { ticker: 'MSFT', name: 'Microsoft Corp',   price: 420.55,  change: +1.21, value: 8411,  shares: 20,    sparkline: [405,408,412,418,415,420,421,420], sector: 'Tech'   },
  { ticker: 'VOO',  name: 'Vanguard S&P 500', price: 493.20,  change: +0.66, value: 7398,  shares: 15,    sparkline: [485,487,490,488,492,491,493,493], sector: 'ETF'    },
  { ticker: 'ETH',  name: 'Ethereum',         price: 3582,    change: -1.88, value: 5015,  shares: 1.4,   sparkline: [3800,3700,3650,3600,3580,3550,3590,3582], sector: 'Crypto' },
];

const ALLOC: Allocation[] = [
  { label: 'Tech',   pct: 52, color: '#3d7fff' },
  { label: 'Crypto', pct: 27, color: '#9d5fff' },
  { label: 'ETF',    pct: 13, color: '#00d97e' },
  { label: 'Cash',   pct:  8, color: '#ffb020' },
];

const TXNS: Transaction[] = [
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

const CHART_PTS = [52200, 53100, 55400, 54200, 57000, 56300, 59100, 58700, 61200, 60800, 62915];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sparkPath(pts: number[], w = 60, h = 22): string {
  const lo = Math.min(...pts), hi = Math.max(...pts), rng = hi - lo || 1;
  return 'M' + pts.map((v, i) => `${(i / (pts.length - 1)) * w},${h - ((v - lo) / rng) * h * 0.85}`).join('L');
}

function fmtPrice(n: number): string {
  if (n >= 1000) return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtValue(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtShares(n: number): string {
  if (n < 1) return n.toFixed(3);
  return n.toLocaleString('en-US');
}

const SECTOR_COLORS: Record<string, string> = {
  Tech:   '#3d7fff',
  Crypto: '#9d5fff',
  ETF:    '#00d97e',
  Cash:   '#ffb020',
};

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

// ─── Donut Chart ─────────────────────────────────────────────────────────────

function DonutChart({ data }: { data: Allocation[] }) {
  const r = 34, cx = 50, cy = 50, sw = 16;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg viewBox="0 0 100 100" className="w-[90px] h-[90px] shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={sw} />
      {data.map((seg) => {
        const dash = (seg.pct / 100) * circ;
        const strokeDasharray = `${dash} ${circ}`;
        const strokeDashoffset = -offset;
        offset += dash;
        return (
          <circle
            key={seg.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={sw}
            strokeDasharray={strokeDasharray}
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

function PerformanceChart() {
  const w = 400, h = 80;
  const lo = Math.min(...CHART_PTS), hi = Math.max(...CHART_PTS), rng = hi - lo;
  const pts = CHART_PTS.map((v, i) => ({
    x: (i / (CHART_PTS.length - 1)) * w,
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
    <svg viewBox={`0 0 60 22`} className="w-[60px] h-[22px]">
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

type NavId = 'portfolio' | 'markets' | 'trade' | 'history';

interface SidebarProps {
  active: NavId;
  onNav: (id: NavId) => void;
}

function Sidebar({ active, onNav }: SidebarProps) {
  const navItems: { id: NavId; label: string; Icon: () => ReactNode; liveDot?: boolean }[] = [
    { id: 'portfolio', label: 'Portfolio', Icon: IcPortfolio },
    { id: 'markets',   label: 'Markets',   Icon: IcMarkets, liveDot: true },
    { id: 'trade',     label: 'Trade',     Icon: IcTrade },
    { id: 'history',   label: 'History',   Icon: IcHistory },
  ];

  return (
    <aside className="w-[220px] shrink-0 flex flex-col bg-surface border-r border-line h-full">
      {/* Logo */}
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

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        {navItems.map(({ id, label, Icon, liveDot }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              className={[
                'flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium w-full text-left transition-colors cursor-pointer',
                isActive
                  ? 'bg-accent-dim text-accent-text border border-accent/20'
                  : 'text-secondary hover:text-fg hover:bg-white/[0.04]',
              ].join(' ')}
            >
              <Icon />
              <span>{label}</span>
              {liveDot && (
                <span
                  className="ml-auto w-[6px] h-[6px] rounded-full bg-green"
                  style={{ animation: 'pulse-green 2s ease-in-out infinite' }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
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

// ─── Topbar / Ticker ─────────────────────────────────────────────────────────

function Topbar() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <header className="flex items-center h-9 border-b border-line bg-surface shrink-0 overflow-hidden">
      {/* Ticker */}
      <div className="flex-1 overflow-hidden relative">
        <div
          className="flex items-center gap-0 whitespace-nowrap"
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

      {/* Right controls */}
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

// ─── Balance Header ───────────────────────────────────────────────────────────

function BalanceHeader({ range, onRange }: { range: string; onRange: (r: string) => void }) {
  const ranges = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];
  return (
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
            onClick={() => onRange(r)}
            className={[
              'px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer',
              range === r
                ? 'bg-accent text-white'
                : 'text-secondary hover:text-fg',
            ].join(' ')}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Quick Actions ────────────────────────────────────────────────────────────

function QuickActions() {
  const btnCls = 'flex flex-col items-center gap-1.5 px-4 py-3 rounded-lg border border-line-2 bg-card hover:border-accent/30 hover:bg-accent-dim transition-colors cursor-pointer group min-w-[80px]';
  const iconCls = 'text-accent';
  const labelCls = 'text-[11px] text-secondary group-hover:text-fg transition-colors font-medium';

  return (
    <div>
      <div className="text-[10px] font-mono text-secondary/60 mb-2 flex items-center gap-1.5">
        <span className="text-accent">⚡</span>
        Ghost AI — actions reorder as you use them
      </div>
      <Ghost.Slot zone="apex.actions" className="flex gap-2 flex-wrap">
        <Ghost.Button id="transfer" zone="apex.actions" className={btnCls}>
          <span className={iconCls}><IcTransfer /></span>
          <span className={labelCls}>Transfer</span>
        </Ghost.Button>
        <Ghost.Button id="invest" zone="apex.actions" className={btnCls}>
          <span className={iconCls}><IcInvest /></span>
          <span className={labelCls}>Invest</span>
        </Ghost.Button>
        <Ghost.Button id="deposit" zone="apex.actions" className={btnCls}>
          <span className={iconCls}><IcDeposit /></span>
          <span className={labelCls}>Deposit</span>
        </Ghost.Button>
        <Ghost.Button id="withdraw" zone="apex.actions" className={btnCls}>
          <span className={iconCls}><IcWithdraw /></span>
          <span className={labelCls}>Withdraw</span>
        </Ghost.Button>
        <Ghost.Button id="statement" zone="apex.actions" className={btnCls}>
          <span className={iconCls}><IcStatement /></span>
          <span className={labelCls}>Statement</span>
        </Ghost.Button>
      </Ghost.Slot>
    </div>
  );
}

// ─── Positions Table ──────────────────────────────────────────────────────────

function PositionsTable() {
  return (
    <div className="bg-card rounded-xl border border-line overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-line">
        <span className="text-[13px] font-semibold text-fg">Positions</span>
        <button className="text-[11px] text-accent-text hover:text-accent transition-colors cursor-pointer">See all</button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-line">
            {['Asset', 'Price', 'Value', '7D', 'Holdings'].map(h => (
              <th key={h} className="px-4 py-2.5 text-left text-[10px] font-medium text-secondary uppercase tracking-wider first:pl-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {POSITIONS.map((pos, i) => (
            <tr
              key={pos.ticker}
              className={[
                'border-b border-line last:border-0 hover:bg-white/[0.02] transition-colors',
                i % 2 === 0 ? '' : '',
              ].join(' ')}
            >
              {/* Asset */}
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
                </div>
              </td>
              {/* Price */}
              <td className="px-4 py-3">
                <span className="font-mono text-[12px] text-fg tabular-nums">${fmtPrice(pos.price)}</span>
              </td>
              {/* Value */}
              <td className="px-4 py-3">
                <span className="font-mono text-[12px] text-fg tabular-nums">{fmtValue(pos.value)}</span>
              </td>
              {/* 7D */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Sparkline pts={pos.sparkline} up={pos.change >= 0} />
                  <span className={`font-mono text-[11px] tabular-nums ${pos.change >= 0 ? 'text-green' : 'text-red'}`}>
                    {pos.change >= 0 ? '+' : ''}{pos.change.toFixed(2)}%
                  </span>
                </div>
              </td>
              {/* Holdings */}
              <td className="px-4 py-3">
                <span className="font-mono text-[12px] text-secondary tabular-nums">{fmtShares(pos.shares)} {pos.ticker}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Allocation Card ──────────────────────────────────────────────────────────

function AllocationCard() {
  return (
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
  );
}

// ─── Activity / Transactions Card ────────────────────────────────────────────

const TXN_COLORS: Record<Transaction['type'], { bg: string; text: string }> = {
  BUY:  { bg: 'rgba(0,217,126,0.1)',  text: '#00d97e' },
  SELL: { bg: 'rgba(255,61,90,0.1)',  text: '#ff3d5a' },
  DIV:  { bg: 'rgba(255,176,32,0.1)', text: '#ffb020' },
};

function ActivityCard() {
  return (
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
              <span
                className="font-mono text-[12px] tabular-nums shrink-0"
                style={{ color: cfg.text }}
              >
                {sign}${txn.amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Portfolio View ──────────────────────────────────────────────────────

function PortfolioView() {
  const [range, setRange] = useState('1Y');

  return (
    <div className="flex-1 grid grid-cols-[1fr_280px] overflow-hidden">
      {/* Left column */}
      <div className="overflow-y-auto p-6 flex flex-col gap-5 border-r border-line">
        <BalanceHeader range={range} onRange={setRange} />
        <QuickActions />
        {/* Chart card */}
        <div className="bg-card rounded-xl border border-line p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-medium text-secondary">Performance</span>
            <span className="text-[11px] font-mono text-green">+18.4%</span>
          </div>
          <PerformanceChart />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] font-mono text-secondary">Jan 2024</span>
            <span className="text-[10px] font-mono text-secondary">May 2025</span>
          </div>
        </div>
        <PositionsTable />
      </div>

      {/* Right column */}
      <div className="overflow-y-auto p-5 flex flex-col gap-5">
        <AllocationCard />
        <ActivityCard />
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export function App() {
  const [activeNav, setActiveNav] = useState<NavId>('portfolio');

  return (
    <GhostProvider persistence={localStorageAdapter('apex-v1')}>
      <div className="flex h-full bg-bg overflow-hidden" style={{ animation: 'fade-in 0.25s ease-out both' }}>
        <Sidebar active={activeNav} onNav={setActiveNav} />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <PortfolioView />
        </div>
      </div>
    </GhostProvider>
  );
}
