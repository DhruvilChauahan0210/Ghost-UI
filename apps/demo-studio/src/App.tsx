import type { ReactNode } from 'react';
import { useState } from 'react';
import { Ghost, GhostProvider, localStorageAdapter } from '@ghost-ui/react';

// ─── Data ────────────────────────────────────────────────────────────────────

const CHANNELS = [
  { id: 'twitter',   name: 'Twitter / X', handle: '@studio_hq',  followers: '12.4K', color: '#1DA1F2', dot: '#06b6d4' },
  { id: 'linkedin',  name: 'LinkedIn',    handle: 'Studio HQ',   followers: '8.9K',  color: '#0077B5', dot: '#3b82f6' },
  { id: 'instagram', name: 'Instagram',   handle: '@studio.hq',  followers: '45.2K', color: '#E1306C', dot: '#ec4899' },
  { id: 'youtube',   name: 'YouTube',     handle: 'StudioHQ',    followers: '3.1K',  color: '#FF0000', dot: '#ef4444' },
] as const;

type ChannelId = typeof CHANNELS[number]['id'];

const QUEUE = [
  { platform: 'twitter'   as ChannelId, text: "The future of content creation isn't about posting more — it's about posting smarter. Here's how AI is changing the game 🧵", time: 'Today · 3:00 PM',     status: 'AI Optimized',   engagement: '4.2K est.' },
  { platform: 'instagram' as ChannelId, text: 'Behind the scenes of our latest product shoot. Swipe to see how we built the set from scratch 📸',                                   time: 'Today · 5:30 PM',     status: 'Ready',           engagement: '8.1K est.' },
  { platform: 'linkedin'  as ChannelId, text: 'We analyzed 10,000 posts to find the optimal posting time for B2B SaaS companies. The results might surprise you.',                            time: 'Tomorrow · 9:00 AM',  status: 'Pending Review',  engagement: '3.7K est.' },
  { platform: 'twitter'   as ChannelId, text: "Hot take: most content strategies fail not because of bad content, but bad timing. Thread on how we fixed this ↓",                        time: 'Tomorrow · 12:00 PM', status: 'AI Optimized',   engagement: '6.8K est.' },
  { platform: 'youtube'   as ChannelId, text: 'NEW VIDEO: Building a $0 content engine that generates 50K monthly impressions — full breakdown',                                         time: 'Thu · 2:00 PM',       status: 'Ready',           engagement: '12K est.'  },
  { platform: 'instagram' as ChannelId, text: "This week's content wins, losses, and what we're doing differently next week. Transparency post 💬",                                 time: 'Fri · 4:00 PM',       status: 'AI Optimized',   engagement: '5.5K est.' },
];

const RECENT = [
  { platform: 'twitter'   as ChannelId, text: "We just crossed 10K followers — here's everything that actually worked", reach: '18.4K', engagement: '6.1%'  },
  { platform: 'linkedin'  as ChannelId, text: "The B2B content playbook: what changed in 2024 and what's coming next",  reach: '11.2K', engagement: '4.8%'  },
  { platform: 'instagram' as ChannelId, text: 'Day in the life of a content team running 4 channels with 2 people',     reach: '29.7K', engagement: '8.3%'  },
  { platform: 'twitter'   as ChannelId, text: 'Unpopular opinion: your content calendar is hurting you. Thread ↓',      reach: '22.1K', engagement: '9.2%'  },
  { platform: 'youtube'   as ChannelId, text: 'Full content audit — what got 100K views and what flopped completely',   reach: '41.5K', engagement: '5.7%'  },
];

const STATS = [
  { label: 'Total Reach',      value: '69.8K', delta: '+12%',  up: true  },
  { label: 'Engagement Rate',  value: '4.2%',  delta: '+0.8%', up: true  },
  { label: 'Posts This Week',  value: '14',    delta: null,    up: null  },
  { label: 'AI Assists',       value: '38',    delta: null,    up: null  },
];

const NAV_ITEMS = [
  { id: 'overview',   label: 'Overview',   active: true  },
  { id: 'create',     label: 'Create',     active: false },
  { id: 'scheduled',  label: 'Scheduled',  active: false },
  { id: 'analytics',  label: 'Analytics',  active: false },
  { id: 'library',    label: 'Library',    active: false },
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
function IconLibrary(): ReactNode {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="3" width="13" height="1.3" rx=".65" fill="currentColor"/>
      <rect x="1" y="6.85" width="13" height="1.3" rx=".65" fill="currentColor"/>
      <rect x="1" y="10.7" width="8" height="1.3" rx=".65" fill="currentColor"/>
    </svg>
  );
}
function IconDots(): ReactNode {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="3" cy="7" r="1.2" fill="currentColor"/>
      <circle cx="7" cy="7" r="1.2" fill="currentColor"/>
      <circle cx="11" cy="7" r="1.2" fill="currentColor"/>
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

function NavIcon({ id }: { id: string }): ReactNode {
  if (id === 'overview')  return <IconOverview />;
  if (id === 'create')    return <IconCreate />;
  if (id === 'scheduled') return <IconScheduled />;
  if (id === 'analytics') return <IconAnalytics />;
  if (id === 'library')   return <IconLibrary />;
  return null;
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

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar(): ReactNode {
  return (
    <aside
      className="flex flex-col h-full shrink-0 border-r"
      style={{
        width: 220,
        background: 'var(--color-surface)',
        borderColor: 'var(--color-line)',
      }}
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
      <nav className="px-2 py-3 flex flex-col gap-0.5">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className="flex items-center gap-2.5 w-full rounded-md px-2.5 py-2 text-left transition-colors"
            style={{
              color: item.active ? 'var(--color-accent-text)' : 'var(--color-secondary)',
              background: item.active ? 'var(--color-accent-dim)' : 'transparent',
              fontSize: 13,
              fontWeight: item.active ? 500 : 400,
            }}
          >
            <span style={{ opacity: item.active ? 1 : 0.6 }}>
              <NavIcon id={item.id} />
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Channels */}
      <div className="px-2 mt-2">
        <p
          className="px-2.5 mb-1.5 uppercase tracking-widest font-semibold"
          style={{ color: 'var(--color-muted)', fontSize: 10 }}
        >
          Channels
        </p>
        <div className="flex flex-col gap-0.5">
          {CHANNELS.map(ch => (
            <button
              key={ch.id}
              className="flex items-center gap-2.5 w-full rounded-md px-2.5 py-2 transition-colors text-left"
              style={{ color: 'var(--color-secondary)', fontSize: 12.5 }}
            >
              <span
                className="shrink-0 rounded-full"
                style={{ width: 7, height: 7, background: ch.dot, boxShadow: `0 0 5px ${ch.dot}` }}
              />
              <span className="flex-1 truncate" style={{ color: 'var(--color-fg)', fontWeight: 450 }}>{ch.name}</span>
              <span style={{ color: 'var(--color-muted)', fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>{ch.followers}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User profile */}
      <div
        className="flex items-center gap-2.5 px-4 py-3 border-t"
        style={{ borderColor: 'var(--color-line)' }}
      >
        <div
          className="flex items-center justify-center rounded-full shrink-0 text-xs font-bold"
          style={{
            width: 30, height: 30,
            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
            color: '#fff',
          }}
        >
          JL
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate" style={{ color: 'var(--color-fg)', fontSize: 12.5 }}>Jordan Lee</p>
          <p className="truncate" style={{ color: 'var(--color-muted)', fontSize: 11 }}>Content Lead</p>
        </div>
        <button style={{ color: 'var(--color-muted)', lineHeight: 1 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="3" r="1.2" fill="currentColor"/>
            <circle cx="7" cy="7" r="1.2" fill="currentColor"/>
            <circle cx="7" cy="11" r="1.2" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </aside>
  );
}

// ─── Stat Cards ───────────────────────────────────────────────────────────────

function StatCards(): ReactNode {
  return (
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
  );
}

// ─── Queue ────────────────────────────────────────────────────────────────────

function QueueSection(): ReactNode {
  return (
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
        {QUEUE.map((post, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-5 py-3 group transition-colors"
            style={{ borderColor: 'var(--color-line)' }}
          >
            <div
              className="flex items-center justify-center rounded-lg shrink-0"
              style={{
                width: 30, height: 30,
                background: 'var(--color-faint)',
              }}
            >
              <PlatformIcon platform={post.platform} size={13} />
            </div>

            <p
              className="flex-1 min-w-0 truncate"
              style={{ color: 'var(--color-fg)', fontSize: 12.5, maxWidth: 320 }}
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

            <button
              className="rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: 'var(--color-muted)', background: 'var(--color-faint)' }}
            >
              <IconDots />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Recent Performance ───────────────────────────────────────────────────────

function RecentPerformance(): ReactNode {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: 'var(--color-card)', borderColor: 'var(--color-line)' }}
    >
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b"
        style={{ borderColor: 'var(--color-line)' }}
      >
        <h2 className="font-semibold" style={{ color: 'var(--color-fg)', fontSize: 13.5 }}>Recent Performance</h2>
        <button
          className="text-xs font-medium transition-colors"
          style={{ color: 'var(--color-accent-text)' }}
        >
          View all →
        </button>
      </div>

      <div>
        <div
          className="grid px-5 py-2 border-b"
          style={{
            gridTemplateColumns: '1fr 90px 90px',
            borderColor: 'var(--color-line)',
            color: 'var(--color-muted)',
            fontSize: 11,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          <span>Post</span>
          <span className="text-right">Reach</span>
          <span className="text-right">Engagement</span>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--color-line)' }}>
          {RECENT.map((post, i) => (
            <div
              key={i}
              className="grid items-center px-5 py-3 group transition-colors"
              style={{ gridTemplateColumns: '1fr 90px 90px', borderColor: 'var(--color-line)' }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span style={{ opacity: 0.85 }}><PlatformIcon platform={post.platform} size={12} /></span>
                <p className="truncate" style={{ color: 'var(--color-fg)', fontSize: 12.5 }}>{post.text}</p>
              </div>
              <p
                className="text-right font-medium tabular-nums"
                style={{ color: 'var(--color-secondary)', fontSize: 12.5 }}
              >
                {post.reach}
              </p>
              <p
                className="text-right font-semibold tabular-nums"
                style={{ color: 'var(--color-green)', fontSize: 12.5 }}
              >
                {post.engagement}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Content ────────────────────────────────────────────────────────────

function MainContent(): ReactNode {
  return (
    <main className="flex-1 overflow-y-auto flex flex-col gap-4 p-5 min-w-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-base tracking-tight" style={{ color: 'var(--color-fg)' }}>Overview</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 12 }}>Friday, May 9, 2026</p>
        </div>
        <button
          className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all"
          style={{
            background: 'var(--color-accent)',
            color: '#fff',
            boxShadow: '0 0 16px rgba(6,182,212,0.35)',
          }}
        >
          <IconCreate />
          New post
        </button>
      </div>

      <StatCards />
      <QueueSection />
      <RecentPerformance />
    </main>
  );
}

// ─── Compose Panel ────────────────────────────────────────────────────────────

function ComposePanel(): ReactNode {
  const [activeChannel, setActiveChannel] = useState<ChannelId>('twitter');
  const [text, setText] = useState('');

  const maxChars = activeChannel === 'twitter' ? 280 : activeChannel === 'linkedin' ? 3000 : 2200;
  const remaining = maxChars - text.length;
  const composeChannels: ChannelId[] = ['twitter', 'linkedin', 'instagram'];

  const suggestions = [
    'Add trending hashtags',
    'Optimize for engagement',
    'Generate variations',
  ];

  function handlePublish() { setText(''); }
  function handleSchedule() { /* schedule action */ }
  function handleDraft() { /* draft action */ }
  function handlePreview() { /* preview action */ }
  function handleDiscard() { setText(''); }
  function handleSuggestion(s: string) {
    if (s === 'Add trending hashtags') {
      setText(prev => prev ? prev + ' #ContentMarketing #AI #SocialMedia' : '#ContentMarketing #AI #SocialMedia');
    }
  }

  return (
    <aside
      className="flex flex-col h-full shrink-0 border-l"
      style={{
        width: 300,
        background: 'var(--color-surface)',
        borderColor: 'var(--color-line)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3.5 border-b"
        style={{ borderColor: 'var(--color-line)' }}
      >
        <h2 className="font-semibold" style={{ color: 'var(--color-fg)', fontSize: 13.5 }}>Compose</h2>
        <button
          className="rounded-md px-2 py-1 text-[11px] font-medium"
          style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent-text)' }}
        >
          AI draft
        </button>
      </div>

      <div className="flex flex-col gap-4 p-4 flex-1 overflow-y-auto">
        {/* Channel selector */}
        <div className="flex gap-1.5">
          {composeChannels.map(id => {
            const ch = CHANNELS.find(c => c.id === id)!;
            const active = activeChannel === id;
            return (
              <button
                key={id}
                onClick={() => setActiveChannel(id)}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-all"
                style={{
                  background: active ? 'var(--color-accent-dim)' : 'var(--color-faint)',
                  color: active ? 'var(--color-accent-text)' : 'var(--color-secondary)',
                  border: `1px solid ${active ? 'var(--color-accent-glow)' : 'transparent'}`,
                }}
              >
                <span style={{ color: ch.color }}><PlatformIcon platform={id} size={11} /></span>
                {ch.name.split(' ')[0]}
              </button>
            );
          })}
        </div>

        {/* Textarea */}
        <div
          className="relative rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--color-line-2)' }}
        >
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What's on your mind? Let AI help you craft it…"
            className="w-full resize-none px-3 py-3 text-sm leading-relaxed"
            rows={6}
            maxLength={maxChars}
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
            className="flex items-center justify-end px-3 py-1.5 border-t"
            style={{ borderColor: 'var(--color-line)', background: 'var(--color-card)' }}
          >
            <span
              className="text-[11px] tabular-nums font-medium"
              style={{ color: remaining < 20 ? 'var(--color-red)' : 'var(--color-muted)' }}
            >
              {text.length} / {maxChars}
            </span>
          </div>
        </div>

        {/* AI Suggestions */}
        <div>
          <p
            className="mb-2 font-medium uppercase tracking-widest"
            style={{ color: 'var(--color-muted)', fontSize: 10 }}
          >
            AI Suggestions
          </p>
          <div className="flex flex-col gap-1.5">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-left transition-colors"
                style={{
                  background: 'var(--color-faint)',
                  color: 'var(--color-secondary)',
                  fontSize: 12.5,
                  border: '1px solid var(--color-line)',
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

        {/* Schedule for */}
        <div>
          <p
            className="mb-2 font-medium uppercase tracking-widest"
            style={{ color: 'var(--color-muted)', fontSize: 10 }}
          >
            Schedule for:
          </p>
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2"
            style={{ background: 'var(--color-faint)', border: '1px solid var(--color-line)' }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <rect x="1" y="2.5" width="11" height="9.5" rx="1.5" stroke="#4a5568" strokeWidth="1.2"/>
              <path d="M4 1v3M9 1v3M1 5.5h11" stroke="#4a5568" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span style={{ color: 'var(--color-secondary)', fontSize: 12.5, flex: 1 }}>Today · 3:00 PM</span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 4l3 3 3-3" stroke="#4a5568" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Ghost Slot — key showcase */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="flex gap-1 items-center">
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
            </span>
            <p
              className="font-medium uppercase tracking-widest"
              style={{ color: 'var(--color-accent-text)', fontSize: 9.5 }}
            >
              Ghost AI · Actions reorder as you use them
            </p>
          </div>

          <Ghost.Slot zone="studio.post-actions" className="flex flex-col gap-1.5">
            <Ghost.Button
              id="publish"
              zone="studio.post-actions"
              onClick={handlePublish}
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
              onClick={handleSchedule}
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
              onClick={handleDraft}
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
              onClick={handlePreview}
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
              onClick={handleDiscard}
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
      </div>
    </aside>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export function App(): ReactNode {
  return (
    <GhostProvider persistence={localStorageAdapter('studio-v1')}>
      <div
        className="flex h-full overflow-hidden"
        style={{ background: 'var(--color-bg)' }}
      >
        <Sidebar />
        <MainContent />
        <ComposePanel />
      </div>
    </GhostProvider>
  );
}
