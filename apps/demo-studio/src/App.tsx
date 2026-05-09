import type { ReactNode } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Ghost, GhostProvider, localStorageAdapter, useGhostEngine } from '@ghost-ui/react';
import { GhostDevtools } from '@ghost-ui/devtools';
import type { GhostEvent } from '@ghost-ui/core';

// ─── Types ────────────────────────────────────────────────────────────────────

type NavId = 'overview' | 'create' | 'scheduled' | 'analytics';
type ToastMsg = { id: number; text: string; type: 'success' | 'info' | 'error' };
type Draft = { id: number; text: string; channel: ChannelId; savedAt: string };

// ─── Data ────────────────────────────────────────────────────────────────────

const CHANNELS = [
  { id: 'twitter',   name: 'Twitter / X', handle: '@studio_hq',  followers: '12.4K', color: '#1DA1F2', dot: '#06b6d4', limit: 280  },
  { id: 'linkedin',  name: 'LinkedIn',    handle: 'Studio HQ',   followers: '8.9K',  color: '#0077B5', dot: '#3b82f6', limit: 3000 },
  { id: 'instagram', name: 'Instagram',   handle: '@studio.hq',  followers: '45.2K', color: '#E1306C', dot: '#ec4899', limit: 2200 },
  { id: 'youtube',   name: 'YouTube',     handle: 'StudioHQ',    followers: '3.1K',  color: '#FF0000', dot: '#ef4444', limit: 5000 },
] as const;

type ChannelId = typeof CHANNELS[number]['id'];

const QUEUE = [
  { id: 1, platform: 'twitter'   as ChannelId, text: "The future of content creation isn't about posting more — it's about posting smarter. Here's how AI is changing the game 🧵", time: 'Today · 3:00 PM',     status: 'AI Optimized',  engagement: '4.2K est.' },
  { id: 2, platform: 'instagram' as ChannelId, text: 'Behind the scenes of our latest product shoot. Swipe to see how we built the set from scratch 📸',                           time: 'Today · 5:30 PM',     status: 'Ready',         engagement: '8.1K est.' },
  { id: 3, platform: 'linkedin'  as ChannelId, text: 'We analyzed 10,000 posts to find the optimal posting time for B2B SaaS companies. The results might surprise you.',         time: 'Tomorrow · 9:00 AM',  status: 'Pending Review', engagement: '3.7K est.' },
  { id: 4, platform: 'twitter'   as ChannelId, text: "Hot take: most content strategies fail not because of bad content, but bad timing. Thread on how we fixed this ↓",          time: 'Tomorrow · 12:00 PM', status: 'AI Optimized',  engagement: '6.8K est.' },
  { id: 5, platform: 'youtube'   as ChannelId, text: 'NEW VIDEO: Building a $0 content engine that generates 50K monthly impressions — full breakdown',                             time: 'Thu · 2:00 PM',       status: 'Ready',         engagement: '12K est.'  },
  { id: 6, platform: 'instagram' as ChannelId, text: "This week's content wins, losses, and what we're doing differently next week. Transparency post 💬",                          time: 'Fri · 4:00 PM',       status: 'AI Optimized',  engagement: '5.5K est.' },
];

const STATS = [
  { label: 'Total Reach',     value: '69.8K', delta: '+12%',  up: true  },
  { label: 'Engagement Rate', value: '4.2%',  delta: '+0.8%', up: true  },
  { label: 'Posts This Week', value: '14',    delta: '+3',    up: true  },
  { label: 'AI Assists',      value: '38',    delta: '+11',   up: true  },
];

const ANALYTICS = [
  { channel: 'Twitter / X', color: '#06b6d4', followers: '12.4K', reach: '28.2K', engagement: '5.1%', posts: [4,6,5,7,8,6,9],   growth: '+842'  },
  { channel: 'LinkedIn',    color: '#3b82f6', followers: '8.9K',  reach: '15.4K', engagement: '3.8%', posts: [2,3,2,4,3,4,5],   growth: '+234'  },
  { channel: 'Instagram',   color: '#ec4899', followers: '45.2K', reach: '38.1K', engagement: '6.2%', posts: [7,9,8,10,9,11,12], growth: '+1.2K' },
  { channel: 'YouTube',     color: '#ef4444', followers: '3.1K',  reach: '8.1K',  engagement: '2.9%', posts: [1,1,2,1,2,2,3],   growth: '+89'   },
];

const RECENT_POSTS = [
  { platform: 'twitter'   as ChannelId, preview: 'The future of content creation...',   reach: '12.4K', engagement: '6.2%', date: 'May 7' },
  { platform: 'instagram' as ChannelId, preview: 'Behind the scenes...',                reach: '18.2K', engagement: '8.4%', date: 'May 6' },
  { platform: 'linkedin'  as ChannelId, preview: 'We analyzed 10,000 posts...',         reach: '5.8K',  engagement: '4.1%', date: 'May 5' },
  { platform: 'twitter'   as ChannelId, preview: 'Hot take: most content strategies...', reach: '9.3K', engagement: '5.7%', date: 'May 4' },
  { platform: 'youtube'   as ChannelId, preview: 'Building a $0 content engine...',     reach: '3.1K',  engagement: '3.2%', date: 'May 3' },
];

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function IconOverview(): ReactNode {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="1" width="5.5" height="5.5" rx="1.25" fill="currentColor" opacity=".9"/>
      <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.25" fill="currentColor" opacity=".5"/>
      <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.25" fill="currentColor" opacity=".5"/>
      <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.25" fill="currentColor" opacity=".5"/>
    </svg>
  );
}
function IconCreate(): ReactNode {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M7.5 4.5v6M4.5 7.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}
function IconScheduled(): ReactNode {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M7.5 4v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconAnalytics(): ReactNode {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M1.5 13L5 9l3 2.5L11 6l2.5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconTwitter({ size = 13 }: { size?: number }): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}
function IconLinkedIn({ size = 13 }: { size?: number }): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}
function IconInstagram({ size = 13 }: { size?: number }): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function IconYouTube({ size = 13 }: { size?: number }): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 001.95-1.97A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
      <polygon fill="#080b10" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
    </svg>
  );
}
function IconEdit(): ReactNode {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconTrash(): ReactNode {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M1.5 3h9M4.5 3V2h3v1M3 3l.5 7.5h5L9 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconClose(): ReactNode {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconHeart(): ReactNode {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 13.5S1.5 9.5 1.5 5.5a3 3 0 015.5-1.6A3 3 0 0114.5 5.5c0 4-6.5 8-6.5 8z" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  );
}
function IconComment(): ReactNode {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H5l-3 3V3z" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  );
}
function IconShare(): ReactNode {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M11 1l4 4-4 4M15 5H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PlatformIcon({ platform, size = 13 }: { platform: ChannelId; size?: number }): ReactNode {
  const ch = CHANNELS.find(c => c.id === platform)!;
  return (
    <span style={{ color: ch.color }}>
      {platform === 'twitter'   && <IconTwitter size={size} />}
      {platform === 'linkedin'  && <IconLinkedIn size={size} />}
      {platform === 'instagram' && <IconInstagram size={size} />}
      {platform === 'youtube'   && <IconYouTube size={size} />}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }): ReactNode {
  const map: Record<string, { bg: string; text: string }> = {
    'AI Optimized':   { bg: 'rgba(6,182,212,0.12)',  text: '#06b6d4' },
    'Ready':          { bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
    'Pending Review': { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  };
  const s = map[status] ?? { bg: 'rgba(255,255,255,0.06)', text: '#8892a4' };
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium leading-none whitespace-nowrap"
      style={{ background: s.bg, color: s.text }}
    >
      {status === 'AI Optimized' && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
          <path d="M4 0l.9 2.6H7.7L5.5 4.2l.9 2.7L4 5.3 1.6 6.9l.9-2.7L.3 2.6H3.1z"/>
        </svg>
      )}
      {status}
    </span>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function ToastContainer({ toasts }: { toasts: ToastMsg[] }): ReactNode {
  const colorMap: Record<ToastMsg['type'], string> = {
    success: '#10b981',
    info: '#06b6d4',
    error: '#ef4444',
  };
  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-[1000] pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium pointer-events-auto"
          style={{
            background: 'var(--color-card)',
            border: `1px solid ${colorMap[t.type]}40`,
            color: 'var(--color-fg)',
            boxShadow: `0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px ${colorMap[t.type]}20`,
            animation: 'fade-in 0.2s ease',
          }}
        >
          <span
            className="shrink-0 rounded-full"
            style={{ width: 7, height: 7, background: colorMap[t.type], boxShadow: `0 0 6px ${colorMap[t.type]}` }}
          />
          {t.text}
        </div>
      ))}
    </div>
  );
}

// ─── Preview Modal ────────────────────────────────────────────────────────────

function PreviewModal({
  text,
  channel,
  onClose,
}: {
  text: string;
  channel: ChannelId;
  onClose: () => void;
}): ReactNode {
  const ch = CHANNELS.find(c => c.id === channel)!;
  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.65)' }}
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl p-5 w-80 flex flex-col gap-4"
        style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-line-2)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1 transition-colors"
          style={{ color: 'var(--color-muted)', background: 'var(--color-faint)' }}
        >
          <IconClose />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <PlatformIcon platform={channel} size={14} />
          <span className="text-xs font-medium" style={{ color: 'var(--color-secondary)' }}>Preview on {ch.name}</span>
        </div>

        <div
          className="rounded-xl p-4 flex flex-col gap-3"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', color: '#fff' }}
            >
              JL
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--color-fg)' }}>Jordan Lee</p>
              <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{ch.handle}</p>
            </div>
          </div>

          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-fg)' }}>
            {text || 'Your post content will appear here…'}
          </p>

          <div className="flex items-center gap-4 pt-1" style={{ color: 'var(--color-muted)', borderTop: '1px solid var(--color-line)', paddingTop: 8 }}>
            <button className="flex items-center gap-1.5 text-xs transition-colors hover:text-pink-400">
              <IconHeart /> 0
            </button>
            <button className="flex items-center gap-1.5 text-xs transition-colors hover:text-blue-400">
              <IconComment /> 0
            </button>
            <button className="flex items-center gap-1.5 text-xs transition-colors hover:text-green-400">
              <IconShare /> 0
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Bar Chart (SVG) ─────────────────────────────────────────────────────────

function BarChart({ data, color }: { data: number[]; color: string }): ReactNode {
  const max = Math.max(...data);
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const W = 180;
  const H = 60;
  const barW = 18;
  const gap = (W - data.length * barW) / (data.length + 1);

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {data.map((v, i) => {
        const barH = max > 0 ? (v / max) * (H - 18) : 0;
        const x = gap + i * (barW + gap);
        const y = H - 14 - barH;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx="4"
              fill={color}
              opacity="0.75"
            />
            <text
              x={x + barW / 2}
              y={H - 2}
              textAnchor="middle"
              fontSize="8"
              fill="#4a5568"
            >
              {days[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Overview View ────────────────────────────────────────────────────────────

function OverviewView({ onLoadQueueItem }: {
  onLoadQueueItem: (item: typeof QUEUE[number]) => void;
}): ReactNode {
  return (
    <div className="flex flex-col gap-4">
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3">
        {STATS.map(stat => (
          <div
            key={stat.label}
            className="rounded-xl p-4 border"
            style={{ background: 'var(--color-card)', borderColor: 'var(--color-line)' }}
          >
            <p style={{ color: 'var(--color-muted)', fontSize: 11.5, fontWeight: 500, letterSpacing: '0.02em' }}>
              {stat.label}
            </p>
            <div className="flex items-end gap-2 mt-1.5">
              <span className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--color-fg)' }}>
                {stat.value}
              </span>
              {stat.delta && (
                <span
                  className="mb-0.5 text-[11px] font-medium"
                  style={{ color: stat.up ? 'var(--color-green)' : 'var(--color-red)' }}
                >
                  {stat.delta}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Queue */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: 'var(--color-card)', borderColor: 'var(--color-line)' }}
      >
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{ borderColor: 'var(--color-line)' }}
        >
          <h2 className="font-semibold" style={{ color: 'var(--color-fg)', fontSize: 13.5 }}>Upcoming Queue</h2>
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
            style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent-text)' }}
          >
            {QUEUE.length} posts
          </span>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--color-line)' }}>
          {QUEUE.slice(0, 4).map(post => (
            <button
              key={post.id}
              onClick={() => onLoadQueueItem(post)}
              className="flex items-center gap-3 px-5 py-3 w-full text-left transition-colors group"
              style={{ borderColor: 'var(--color-line)' }}
            >
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: 30, height: 30, background: 'var(--color-faint)' }}
              >
                <PlatformIcon platform={post.platform} size={13} />
              </div>
              <p
                className="flex-1 min-w-0 truncate text-left"
                style={{ color: 'var(--color-fg)', fontSize: 12.5 }}
              >
                {post.text.length > 80 ? post.text.slice(0, 80) + '…' : post.text}
              </p>
              <span style={{ color: 'var(--color-muted)', fontSize: 11.5, whiteSpace: 'nowrap', minWidth: 130 }}>
                {post.time}
              </span>
              <StatusBadge status={post.status} />
              <span
                className="font-medium tabular-nums"
                style={{ color: 'var(--color-secondary)', fontSize: 11.5, minWidth: 64, textAlign: 'right', whiteSpace: 'nowrap' }}
              >
                {post.engagement}
              </span>
              <span
                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                style={{ color: 'var(--color-accent-text)' }}
              >
                Edit →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Performance */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: 'var(--color-card)', borderColor: 'var(--color-line)' }}
      >
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{ borderColor: 'var(--color-line)' }}
        >
          <h2 className="font-semibold" style={{ color: 'var(--color-fg)', fontSize: 13.5 }}>Recent Performance</h2>
        </div>
        <div>
          <div
            className="grid px-5 py-2 border-b"
            style={{
              gridTemplateColumns: '1fr 70px 90px 90px',
              borderColor: 'var(--color-line)',
              color: 'var(--color-muted)',
              fontSize: 11,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            <span>Post</span>
            <span>Date</span>
            <span className="text-right">Reach</span>
            <span className="text-right">Engagement</span>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--color-line)' }}>
            {RECENT_POSTS.map((post, i) => (
              <div
                key={i}
                className="grid items-center px-5 py-3"
                style={{ gridTemplateColumns: '1fr 70px 90px 90px', borderColor: 'var(--color-line)' }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <PlatformIcon platform={post.platform} size={12} />
                  <p className="truncate" style={{ color: 'var(--color-fg)', fontSize: 12.5 }}>{post.preview}</p>
                </div>
                <p style={{ color: 'var(--color-muted)', fontSize: 12 }}>{post.date}</p>
                <p className="text-right font-medium tabular-nums" style={{ color: 'var(--color-secondary)', fontSize: 12.5 }}>{post.reach}</p>
                <p className="text-right font-semibold tabular-nums" style={{ color: 'var(--color-green)', fontSize: 12.5 }}>{post.engagement}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Create View ──────────────────────────────────────────────────────────────

function CreateView(): ReactNode {
  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-xl p-6 border text-center"
        style={{ background: 'var(--color-card)', borderColor: 'var(--color-line)' }}
      >
        <div
          className="mx-auto rounded-full flex items-center justify-center mb-3"
          style={{
            width: 48, height: 48,
            background: 'var(--color-accent-dim)',
            color: 'var(--color-accent-text)',
          }}
        >
          <IconCreate />
        </div>
        <h2 className="font-semibold mb-1" style={{ color: 'var(--color-fg)', fontSize: 15 }}>Create New Content</h2>
        <p style={{ color: 'var(--color-secondary)', fontSize: 13 }}>Use the compose panel on the right to draft and publish your post.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Thread', desc: 'Multi-post Twitter thread', color: '#06b6d4' },
          { label: 'Carousel', desc: 'LinkedIn or Instagram slides', color: '#3b82f6' },
          { label: 'Video Script', desc: 'YouTube or Reels script', color: '#ef4444' },
        ].map(t => (
          <div
            key={t.label}
            className="rounded-xl p-4 border cursor-pointer transition-all"
            style={{
              background: 'var(--color-card)',
              borderColor: 'var(--color-line)',
            }}
          >
            <div
              className="rounded-lg mb-3 flex items-center justify-center"
              style={{ width: 32, height: 32, background: `${t.color}20` }}
            >
              <span style={{ color: t.color, fontSize: 16 }}>+</span>
            </div>
            <p className="font-medium text-sm" style={{ color: 'var(--color-fg)' }}>{t.label}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>{t.desc}</p>
          </div>
        ))}
      </div>

      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: 'var(--color-card)', borderColor: 'var(--color-line)' }}
      >
        <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--color-line)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--color-fg)', fontSize: 13.5 }}>AI Content Ideas</h3>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--color-line)' }}>
          {[
            'How we grew our LinkedIn from 0 to 8K in 6 months — the exact playbook',
            'The algorithm changed again. Here\'s what\'s actually working now',
            '5 content frameworks that work across every platform in 2026',
          ].map((idea, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M5.5 0l1.2 3.5h3.7L7.5 5.7l1.2 3.6L5.5 7.5 2.3 9.3l1.2-3.6L.6 3.5H4.3z" fill="#06b6d4" opacity=".8"/>
              </svg>
              <p className="flex-1 text-sm" style={{ color: 'var(--color-fg)' }}>{idea}</p>
              <span className="text-xs" style={{ color: 'var(--color-accent-text)' }}>Use →</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Scheduled View ───────────────────────────────────────────────────────────

function ScheduledView({
  queue,
  onEdit,
  onDelete,
}: {
  queue: typeof QUEUE;
  onEdit: (item: typeof QUEUE[number]) => void;
  onDelete: (id: number) => void;
}): ReactNode {
  const today = queue.filter(q => q.time.startsWith('Today'));
  const tomorrow = queue.filter(q => q.time.startsWith('Tomorrow'));
  const later = queue.filter(q => !q.time.startsWith('Today') && !q.time.startsWith('Tomorrow'));

  function Group({ label, items }: { label: string; items: typeof QUEUE }): ReactNode {
    if (items.length === 0) return null;
    return (
      <div>
        <p
          className="px-1 mb-2 uppercase tracking-widest font-semibold"
          style={{ color: 'var(--color-muted)', fontSize: 10.5 }}
        >
          {label}
        </p>
        <div
          className="rounded-xl border overflow-hidden"
          style={{ background: 'var(--color-card)', borderColor: 'var(--color-line)' }}
        >
          <div className="divide-y" style={{ borderColor: 'var(--color-line)' }}>
            {items.map(post => (
              <div key={post.id} className="flex items-start gap-3 px-5 py-4">
                <div
                  className="flex items-center justify-center rounded-lg shrink-0 mt-0.5"
                  style={{ width: 32, height: 32, background: 'var(--color-faint)' }}
                >
                  <PlatformIcon platform={post.platform} size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--color-fg)' }}>
                    {post.text}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span style={{ color: 'var(--color-muted)', fontSize: 11.5 }}>{post.time}</span>
                    <StatusBadge status={post.status} />
                    <span style={{ color: 'var(--color-secondary)', fontSize: 11.5 }}>{post.engagement}</span>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => onEdit(post)}
                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors"
                    style={{ background: 'var(--color-faint)', color: 'var(--color-secondary)', border: '1px solid var(--color-line)' }}
                  >
                    <IconEdit /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(post.id)}
                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors"
                    style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)' }}
                  >
                    <IconTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Group label="Today" items={today} />
      <Group label="Tomorrow" items={tomorrow} />
      <Group label="This Week" items={later} />
      {queue.length === 0 && (
        <div
          className="rounded-xl p-10 border text-center"
          style={{ background: 'var(--color-card)', borderColor: 'var(--color-line)' }}
        >
          <p className="font-medium mb-1" style={{ color: 'var(--color-fg)' }}>No scheduled posts</p>
          <p style={{ color: 'var(--color-muted)', fontSize: 13 }}>Posts you schedule will appear here.</p>
        </div>
      )}
    </div>
  );
}

// ─── Analytics View ───────────────────────────────────────────────────────────

function AnalyticsView(): ReactNode {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {ANALYTICS.map(a => (
          <div
            key={a.channel}
            className="rounded-xl p-5 border"
            style={{ background: 'var(--color-card)', borderColor: 'var(--color-line)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span
                  className="rounded-full shrink-0"
                  style={{ width: 8, height: 8, background: a.color, display: 'inline-block', boxShadow: `0 0 6px ${a.color}` }}
                />
                <span className="font-semibold text-sm" style={{ color: 'var(--color-fg)' }}>{a.channel}</span>
              </div>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: `${a.color}20`, color: a.color }}
              >
                {a.growth} this week
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: 'Followers', value: a.followers },
                { label: 'Reach', value: a.reach },
                { label: 'Engagement', value: a.engagement },
              ].map(m => (
                <div key={m.label}>
                  <p style={{ color: 'var(--color-muted)', fontSize: 10.5 }}>{m.label}</p>
                  <p className="font-semibold tabular-nums" style={{ color: 'var(--color-fg)', fontSize: 14 }}>{m.value}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="mb-2" style={{ color: 'var(--color-muted)', fontSize: 10.5 }}>Posts / day (last 7 days)</p>
              <BarChart data={a.posts} color={a.color} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'overview'  as NavId, label: 'Overview',  icon: <IconOverview />,  badge: null },
  { id: 'create'    as NavId, label: 'Create',    icon: <IconCreate />,    badge: null },
  { id: 'scheduled' as NavId, label: 'Scheduled', icon: <IconScheduled />, badge: '6'  },
  { id: 'analytics' as NavId, label: 'Analytics', icon: <IconAnalytics />, badge: null },
];

function Sidebar({ nav, onNav }: { nav: NavId; onNav: (id: NavId) => void }): ReactNode {
  return (
    <aside
      className="flex flex-col h-full shrink-0 border-r"
      style={{ width: 220, background: 'var(--color-surface)', borderColor: 'var(--color-line)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b" style={{ borderColor: 'var(--color-line)' }}>
        <div
          className="flex items-center justify-center rounded-lg text-sm font-bold shrink-0"
          style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
            color: '#fff',
            boxShadow: '0 0 16px rgba(6,182,212,0.3)',
          }}
        >
          S
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm tracking-tight" style={{ color: 'var(--color-fg)' }}>Studio</span>
          <span
            className="rounded px-1 py-px text-[9px] font-bold uppercase tracking-wider"
            style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent-text)' }}
          >
            AI
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-2 py-3">
        <Ghost.Slot zone="studio.nav" className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(item => {
            const active = nav === item.id;
            return (
              <Ghost.Button
                key={item.id}
                id={item.id}
                zone="studio.nav"
                onClick={() => onNav(item.id)}
                className="flex items-center gap-2.5 w-full rounded-md px-2.5 py-2 text-left transition-colors"
                style={{
                  color: active ? 'var(--color-accent-text)' : 'var(--color-secondary)',
                  background: active ? 'var(--color-accent-dim)' : 'transparent',
                  fontSize: 13,
                  fontWeight: active ? 500 : 400,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <span style={{ opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                {item.label}
                {item.badge && (
                  <span
                    className="ml-auto rounded-full px-1.5 py-px text-[10px] font-semibold"
                    style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent-text)' }}
                  >
                    {item.badge}
                  </span>
                )}
              </Ghost.Button>
            );
          })}
        </Ghost.Slot>
      </nav>

      {/* Channels section */}
      <div className="px-2 mt-2">
        <p
          className="px-2.5 mb-1.5 uppercase tracking-widest font-semibold"
          style={{ color: 'var(--color-muted)', fontSize: 10 }}
        >
          Channels
        </p>
        <div className="flex flex-col gap-0.5">
          {CHANNELS.map(ch => (
            <div
              key={ch.id}
              className="flex items-center gap-2.5 rounded-md px-2.5 py-2"
              style={{ fontSize: 12.5 }}
            >
              <span
                className="shrink-0 rounded-full"
                style={{ width: 7, height: 7, background: ch.dot, boxShadow: `0 0 5px ${ch.dot}`, display: 'inline-block' }}
              />
              <span className="flex-1 truncate" style={{ color: 'var(--color-fg)', fontWeight: 450 }}>{ch.name}</span>
              <span style={{ color: 'var(--color-muted)', fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>{ch.followers}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1" />

      {/* User */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-t" style={{ borderColor: 'var(--color-line)' }}>
        <div
          className="flex items-center justify-center rounded-full shrink-0 text-xs font-bold"
          style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', color: '#fff' }}
        >
          JL
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate" style={{ color: 'var(--color-fg)', fontSize: 12.5 }}>Jordan Lee</p>
          <p className="truncate" style={{ color: 'var(--color-muted)', fontSize: 11 }}>Content Lead</p>
        </div>
      </div>
    </aside>
  );
}

// ─── Compose Panel ────────────────────────────────────────────────────────────

function ComposePanel({
  compose,
  setCompose,
  activeChannel,
  setActiveChannel,
  scheduleDate,
  setScheduleDate,
  scheduleTime,
  setScheduleTime,
  drafts,
  onPublish,
  onSchedule,
  onDraft,
  onPreview,
  onDiscard,
}: {
  compose: string;
  setCompose: (v: string) => void;
  activeChannel: ChannelId;
  setActiveChannel: (id: ChannelId) => void;
  scheduleDate: string;
  setScheduleDate: (v: string) => void;
  scheduleTime: string;
  setScheduleTime: (v: string) => void;
  drafts: Draft[];
  onPublish: () => void;
  onSchedule: () => void;
  onDraft: () => void;
  onPreview: () => void;
  onDiscard: () => void;
}): ReactNode {
  const ch = CHANNELS.find(c => c.id === activeChannel)!;
  const charLimit = ch.limit;
  const charCount = compose.length;
  const charPct = charLimit > 0 ? charCount / charLimit : 0;
  const charColor = charPct >= 0.95 ? 'var(--color-red)' : charPct >= 0.8 ? 'var(--color-amber)' : 'var(--color-green)';

  function handleSuggestion(s: string): void {
    if (s === 'Add trending hashtags') {
      setCompose(compose ? compose + '\n\n#ContentMarketing #AIContent #GrowthHacking' : '#ContentMarketing #AIContent #GrowthHacking');
    } else if (s === 'Optimize for engagement') {
      setCompose('🔥 ' + compose + '\n\nWhat do you think? Drop a comment below 👇');
    } else if (s === 'Generate variations') {
      const variation = compose
        .replace(/^/, 'Here\'s a fresh take: ')
        .replace(/\.$/, '')
        .replace('isn\'t', 'is not')
        .replace('it\'s', 'it is');
      setCompose(variation !== compose ? variation : compose + ' — rephrased for clarity.');
    }
  }

  const [draftsOpen, setDraftsOpen] = useState(true);

  return (
    <aside
      className="flex flex-col h-full shrink-0 border-l"
      style={{ width: 300, background: 'var(--color-surface)', borderColor: 'var(--color-line)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3.5 border-b"
        style={{ borderColor: 'var(--color-line)' }}
      >
        <h2 className="font-semibold" style={{ color: 'var(--color-fg)', fontSize: 13.5 }}>Compose</h2>
        <span
          className="rounded px-1.5 py-px text-[9px] font-bold uppercase tracking-wider flex items-center gap-1"
          style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent-text)' }}
        >
          <span
            className="rounded-full shrink-0"
            style={{
              width: 5, height: 5,
              background: 'var(--color-accent)',
              display: 'inline-block',
              boxShadow: '0 0 4px var(--color-accent)',
              animation: 'pulse-dot 2s ease infinite',
            }}
          />
          Ghost AI
        </span>
      </div>

      <div className="flex flex-col gap-4 p-4 flex-1 overflow-y-auto">
        {/* Channel selector */}
        <div>
          <p className="mb-2 uppercase tracking-widest font-semibold" style={{ color: 'var(--color-muted)', fontSize: 10 }}>
            Channel
          </p>
          <Ghost.Slot zone="studio.channels" className="flex flex-wrap gap-1.5">
            {CHANNELS.map(c => {
              const active = activeChannel === c.id;
              return (
                <Ghost.Button
                  key={c.id}
                  id={c.id}
                  zone="studio.channels"
                  onClick={() => setActiveChannel(c.id)}
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-all"
                  style={{
                    background: active ? 'var(--color-accent-dim)' : 'var(--color-faint)',
                    color: active ? 'var(--color-accent-text)' : 'var(--color-secondary)',
                    border: `1px solid ${active ? 'var(--color-accent-glow)' : 'transparent'}`,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  <PlatformIcon platform={c.id} size={11} />
                  {c.name.split(' ')[0]}
                </Ghost.Button>
              );
            })}
          </Ghost.Slot>
        </div>

        {/* Textarea */}
        <div
          className="relative rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--color-line-2)' }}
        >
          <textarea
            value={compose}
            onChange={e => setCompose(e.target.value)}
            placeholder="What's on your mind? Let AI help you craft it…"
            className="w-full resize-none px-3 py-3 text-sm leading-relaxed"
            rows={6}
            style={{
              background: 'var(--color-card)',
              color: 'var(--color-fg)',
              outline: 'none',
              border: 'none',
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
            }}
          />
          <div
            className="flex items-center justify-between px-3 py-1.5 border-t"
            style={{ borderColor: 'var(--color-line)', background: 'var(--color-card)' }}
          >
            <span style={{ color: 'var(--color-muted)', fontSize: 11 }}>{ch.handle}</span>
            <span
              className="text-[11px] tabular-nums font-medium"
              style={{ color: charColor }}
            >
              {charCount} / {charLimit}
            </span>
          </div>
        </div>

        {/* AI Suggestions */}
        <div>
          <p className="mb-2 font-medium uppercase tracking-widest" style={{ color: 'var(--color-muted)', fontSize: 10 }}>
            AI Suggestions
          </p>
          <div className="flex flex-col gap-1.5">
            {(['Add trending hashtags', 'Optimize for engagement', 'Generate variations'] as const).map(s => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-left transition-colors"
                style={{
                  background: 'var(--color-faint)',
                  color: 'var(--color-secondary)',
                  fontSize: 12.5,
                  border: '1px solid var(--color-line)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M5.5 0l1.2 3.5h3.7L7.5 5.7l1.2 3.6L5.5 7.5 2.3 9.3l1.2-3.6L.6 3.5H4.3z" fill="#06b6d4" opacity=".8"/>
                </svg>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div>
          <p className="mb-2 font-medium uppercase tracking-widest" style={{ color: 'var(--color-muted)', fontSize: 10 }}>
            Schedule for:
          </p>
          <div className="flex gap-2">
            <input
              type="date"
              value={scheduleDate}
              onChange={e => setScheduleDate(e.target.value)}
              className="flex-1 rounded-lg px-2.5 py-2 text-xs"
              style={{
                background: 'var(--color-faint)',
                color: 'var(--color-fg)',
                border: '1px solid var(--color-line)',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                colorScheme: 'dark',
              }}
            />
            <select
              value={scheduleTime}
              onChange={e => setScheduleTime(e.target.value)}
              className="rounded-lg px-2 py-2 text-xs"
              style={{
                background: 'var(--color-faint)',
                color: 'var(--color-fg)',
                border: '1px solid var(--color-line)',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                colorScheme: 'dark',
              }}
            >
              {['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Post Actions */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span
              className="rounded-full"
              style={{
                width: 6, height: 6,
                background: 'var(--color-accent)',
                boxShadow: '0 0 6px var(--color-accent)',
                display: 'inline-block',
                animation: 'pulse-dot 2s ease infinite',
              }}
            />
            <p className="font-medium uppercase tracking-widest" style={{ color: 'var(--color-accent-text)', fontSize: 9.5 }}>
              Actions reorder by use
            </p>
          </div>

          <Ghost.Slot zone="studio.post-actions" className="flex flex-col gap-1.5">
            <Ghost.Button
              id="publish"
              zone="studio.post-actions"
              onClick={onPublish}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
              style={{
                background: 'var(--color-accent)',
                color: '#fff',
                boxShadow: '0 0 18px rgba(6,182,212,0.3)',
                cursor: 'pointer',
                border: 'none',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Publish now
            </Ghost.Button>

            <Ghost.Button
              id="schedule"
              zone="studio.post-actions"
              onClick={onSchedule}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
              style={{
                background: 'transparent',
                color: 'var(--color-accent-text)',
                border: '1px solid var(--color-accent-glow)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Schedule
            </Ghost.Button>

            <Ghost.Button
              id="draft"
              zone="studio.post-actions"
              onClick={onDraft}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
              style={{
                background: 'var(--color-faint)',
                color: 'var(--color-fg)',
                border: '1px solid var(--color-line)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Save Draft
            </Ghost.Button>

            <Ghost.Button
              id="preview"
              zone="studio.post-actions"
              onClick={onPreview}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
              style={{
                background: 'var(--color-faint)',
                color: 'var(--color-secondary)',
                border: '1px solid var(--color-line)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Preview
            </Ghost.Button>

            <Ghost.Button
              id="discard"
              zone="studio.post-actions"
              onClick={onDiscard}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
              style={{
                background: 'transparent',
                color: 'var(--color-red)',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Discard
            </Ghost.Button>
          </Ghost.Slot>
        </div>

        {/* Drafts */}
        {drafts.length > 0 && (
          <div>
            <button
              onClick={() => setDraftsOpen(o => !o)}
              className="flex items-center justify-between w-full mb-2"
            >
              <p className="font-medium uppercase tracking-widest" style={{ color: 'var(--color-muted)', fontSize: 10 }}>
                Drafts ({drafts.length})
              </p>
              <span style={{ color: 'var(--color-muted)', fontSize: 11 }}>{draftsOpen ? '▲' : '▼'}</span>
            </button>
            {draftsOpen && (
              <div className="flex flex-col gap-1.5">
                {drafts.slice(0, 3).map(d => {
                  const dch = CHANNELS.find(c => c.id === d.channel)!;
                  return (
                    <button
                      key={d.id}
                      className="flex items-start gap-2 w-full rounded-lg p-2.5 text-left transition-colors"
                      style={{ background: 'var(--color-faint)', border: '1px solid var(--color-line)', cursor: 'pointer' }}
                    >
                      <PlatformIcon platform={d.channel} size={11} />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-xs" style={{ color: 'var(--color-fg)' }}>
                          {d.text.slice(0, 55)}{d.text.length > 55 ? '…' : ''}
                        </p>
                        <p className="text-[10.5px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
                          {dch.name} · {d.savedAt}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export function App(): ReactNode {
  const [nav, setNav] = useState<NavId>('overview');
  const [compose, setCompose] = useState('');
  const [activeChannel, setActiveChannel] = useState<ChannelId>('twitter');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [preview, setPreview] = useState(false);
  const [queue, setQueue] = useState(QUEUE.map(q => ({ ...q })));
  const toastId = useRef(0);

  function addToast(text: string, type: ToastMsg['type'] = 'success'): void {
    const id = ++toastId.current;
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }

  function handlePublish(): void {
    if (!compose.trim()) { addToast('Nothing to publish — write something first', 'error'); return; }
    const ch = CHANNELS.find(c => c.id === activeChannel)!;
    addToast(`Published to ${ch.name}!`, 'success');
    setCompose('');
  }

  function handleSchedule(): void {
    if (!compose.trim()) { addToast('Nothing to schedule — write something first', 'error'); return; }
    const ch = CHANNELS.find(c => c.id === activeChannel)!;
    const dateStr = scheduleDate || 'tomorrow';
    addToast(`Scheduled for ${dateStr} ${scheduleTime} on ${ch.name}`, 'info');
    setCompose('');
  }

  function handleDraft(): void {
    if (!compose.trim()) { addToast('Nothing to save — write something first', 'error'); return; }
    const id = Date.now();
    setDrafts(prev => [{ id, text: compose, channel: activeChannel, savedAt: 'just now' }, ...prev.slice(0, 4)]);
    addToast('Draft saved', 'info');
  }

  function handlePreview(): void {
    if (!compose.trim()) { addToast('Nothing to preview — write something first', 'error'); return; }
    setPreview(true);
  }

  function handleDiscard(): void {
    if (!compose.trim()) return;
    if (window.confirm('Discard this post?')) {
      setCompose('');
      addToast('Post discarded', 'info');
    }
  }

  function loadQueueItem(item: typeof QUEUE[number]): void {
    setCompose(item.text);
    setActiveChannel(item.platform);
    setNav('create');
    addToast(`Loaded ${item.platform} post into composer`, 'info');
  }

  function deleteQueueItem(id: number): void {
    setQueue(prev => prev.filter(q => q.id !== id));
    addToast('Post removed from queue', 'info');
  }

  const viewTitle: Record<NavId, string> = {
    overview: 'Overview',
    create: 'Create',
    scheduled: 'Scheduled',
    analytics: 'Analytics',
  };

  return (
    <GhostProvider persistence={localStorageAdapter('studio-v1')}>
      <div className="flex h-full overflow-hidden" style={{ background: 'var(--color-bg)' }}>
        <Sidebar nav={nav} onNav={setNav} />

        {/* Main */}
        <main className="flex-1 overflow-y-auto flex flex-col gap-4 p-5 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-base tracking-tight" style={{ color: 'var(--color-fg)' }}>
                {viewTitle[nav]}
              </h1>
              <p style={{ color: 'var(--color-muted)', fontSize: 12 }}>Friday, May 9, 2026</p>
            </div>
            <button
              onClick={() => setNav('create')}
              className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all"
              style={{
                background: 'var(--color-accent)',
                color: '#fff',
                boxShadow: '0 0 16px rgba(6,182,212,0.35)',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <IconCreate />
              New post
            </button>
          </div>

          {nav === 'overview'   && <OverviewView onLoadQueueItem={loadQueueItem} />}
          {nav === 'create'     && <CreateView />}
          {nav === 'scheduled'  && (
            <ScheduledView
              queue={queue}
              onEdit={loadQueueItem}
              onDelete={deleteQueueItem}
            />
          )}
          {nav === 'analytics'  && <AnalyticsView />}
        </main>

        <ComposePanel
          compose={compose}
          setCompose={setCompose}
          activeChannel={activeChannel}
          setActiveChannel={setActiveChannel}
          scheduleDate={scheduleDate}
          setScheduleDate={setScheduleDate}
          scheduleTime={scheduleTime}
          setScheduleTime={setScheduleTime}
          drafts={drafts}
          onPublish={handlePublish}
          onSchedule={handleSchedule}
          onDraft={handleDraft}
          onPreview={handlePreview}
          onDiscard={handleDiscard}
        />
      </div>

      {preview && (
        <PreviewModal
          text={compose}
          channel={activeChannel}
          onClose={() => setPreview(false)}
        />
      )}

      <ToastContainer toasts={toasts} />
      <GhostDemoBar />
      <GhostDevtools defaultOpen={true} />
    </GhostProvider>
  );
}

const STUDIO_SIM_EVENTS: Array<{ id: string; zone: string; count: number }> = [
  { id: 'schedule', zone: 'studio.post-actions', count: 28 },
  { id: 'publish',  zone: 'studio.post-actions', count: 18 },
  { id: 'draft',    zone: 'studio.post-actions', count: 12 },
  { id: 'preview',  zone: 'studio.post-actions', count:  5 },
  { id: 'discard',  zone: 'studio.post-actions', count:  2 },
  { id: 'twitter',  zone: 'studio.channels',     count: 35 },
  { id: 'linkedin', zone: 'studio.channels',     count: 22 },
  { id: 'instagram',zone: 'studio.channels',     count: 15 },
  { id: 'youtube',  zone: 'studio.channels',     count:  6 },
  { id: 'create',   zone: 'studio.nav',          count: 40 },
  { id: 'overview', zone: 'studio.nav',          count: 25 },
  { id: 'scheduled',zone: 'studio.nav',          count: 18 },
  { id: 'analytics',zone: 'studio.nav',          count: 10 },
];

function GhostDemoBar() {
  const engine = useGhostEngine();
  const [eventCount, setEventCount] = useState(() => engine.events().length);
  const [simulated, setSimulated] = useState(false);

  useEffect(() => engine.subscribe(() => setEventCount(engine.events().length)), [engine]);

  function handleSimulate() {
    const now = Date.now();
    const DAY = 86_400_000;
    const events: GhostEvent[] = STUDIO_SIM_EVENTS.flatMap(({ id, zone, count }) =>
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
    <div className="fixed bottom-4 left-4 z-[9999] flex flex-col gap-2.5 rounded-xl border border-white/[0.08] bg-[#080b10]/90 backdrop-blur-md p-3.5 w-60 shadow-2xl shadow-black/60">
      <div className="flex items-center justify-between">
        <span className="font-bold tracking-widest uppercase text-[9px]" style={{ color: 'var(--color-accent-text)' }}>Ghost Engine</span>
        <span className="rounded-full px-2 py-0.5 text-[10px] font-mono tabular-nums" style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent-text)' }}>{eventCount} events</span>
      </div>
      <p className="text-[10px] leading-relaxed" style={{ color: 'var(--color-muted)' }}>Inject 4 weeks of realistic usage — watch Ghost UI reorder nav and post actions by learned frequency.</p>
      <button
        onClick={handleSimulate}
        disabled={simulated}
        className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all active:scale-[0.97] ${simulated ? 'cursor-default' : ''}`}
        style={simulated
          ? { background: 'var(--color-accent-dim)', color: 'var(--color-accent-text)' }
          : { background: 'var(--color-accent)', color: '#fff' }
        }
      >
        {simulated ? '✓ Simulated' : '⚡ Simulate 4-week usage'}
      </button>
      <button
        onClick={handleReset}
        className="rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all hover:bg-white/[0.04]"
        style={{ color: 'var(--color-muted)' }}
      >
        ↺ Reset all scores
      </button>
    </div>
  );
}
