import { useState, useMemo } from 'react';
import { GhostProvider, Ghost } from '@ghost-ui/react';
import { GhostDevtools } from '@ghost-ui/devtools';
import { localStorageAdapter } from '@ghost-ui/core';

type Status = 'todo' | 'in-progress' | 'in-review' | 'done' | 'cancelled';
type Priority = 'urgent' | 'high' | 'medium' | 'low' | 'none';

interface Issue {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assignee: string;
  initials: string;
  labels: string[];
  project: string;
  cycle: string;
  updatedAt: string;
  description: string;
}

const ISSUES: Issue[] = [
  { id: 'ORB-001', title: 'GhostProvider silently falls back to empty state in Safari 17 cross-origin iframes', status: 'in-progress', priority: 'urgent', assignee: 'Maya Chen', initials: 'MC', labels: ['Bug', 'Ghost UI'], project: 'Platform', cycle: 'Sprint 14', updatedAt: '3m ago', description: 'IndexedDB writes are blocked in Safari 17.x when the embed is cross-origin. The engine returns an empty state on reload instead of surfacing the error. We need to detect this condition and fall back to `localStorageAdapter` gracefully with a visible warning.' },
  { id: 'ORB-002', title: 'Memory leak — ghost-engine event listener never removed on provider unmount', status: 'in-review', priority: 'high', assignee: 'Sam Rivera', initials: 'SR', labels: ['Bug', 'Performance'], project: 'Platform', cycle: 'Sprint 14', updatedAt: '22m ago', description: 'The GhostProvider attaches a visibility-change listener on mount but never removes it on cleanup. Long-running SPAs accumulate these listeners, producing measurable heap growth after 30+ minutes of use.' },
  { id: 'ORB-003', title: 'Onboarding redesign — defer invite step until user has experienced first value', status: 'todo', priority: 'medium', assignee: 'Priya Nair', initials: 'PN', labels: ['Design', 'Growth'], project: 'Growth', cycle: 'Sprint 15', updatedAt: '1h ago', description: "Analytics show 42% drop-off at the \"invite team\" step. Users haven't experienced product value yet and don't have teammates ready. Proposal: move invites post-first-interaction and replace with a workspace setup placeholder." },
  { id: 'ORB-004', title: 'Command palette ⌘K with Ghost UI score-ordered results', status: 'in-progress', priority: 'medium', assignee: 'Maya Chen', initials: 'MC', labels: ['Feature', 'UX'], project: 'Platform', cycle: 'Sprint 14', updatedAt: '2h ago', description: 'Implement a command palette using Ghost UI scores to surface the most-used commands first. Commands should be registered from each feature module via a registry, not hardcoded into the palette component.' },
  { id: 'ORB-005', title: 'Issue export — CSV and Linear JSON schema', status: 'todo', priority: 'low', assignee: 'Alex Torres', initials: 'AT', labels: ['Feature'], project: 'Platform', cycle: 'Sprint 15', updatedAt: '4h ago', description: 'Users need to export their backlog for stakeholder sharing. Support CSV with configurable column order, and Linear\'s JSON schema for one-click migration.' },
  { id: 'ORB-006', title: 'Cycle view — drag-and-drop issue reordering with optimistic updates', status: 'todo', priority: 'high', assignee: 'Sam Rivera', initials: 'SR', labels: ['Feature', 'Cycles'], project: 'Platform', cycle: 'Sprint 15', updatedAt: '6h ago', description: 'Drag-and-drop reordering in the sprint cycle view. Decision needed: use Ghost UI score as default sort order and let manual drag override it, or keep Ghost scoring separate from sprint ordering?' },
  { id: 'ORB-007', title: 'Score decay too aggressive after 4h idle — buttons reset to default on next session', status: 'in-progress', priority: 'urgent', assignee: 'Alex Torres', initials: 'AT', labels: ['Ghost UI', 'Research'], project: 'Platform', cycle: 'Sprint 14', updatedAt: '1d ago', description: 'After 4 hours idle, half-life decay reduces scores to near zero. Users returning the next morning see the default button order. Need a two-tier decay curve: fast within-session recency decay, slow cross-session preference memory.' },
  { id: 'ORB-008', title: 'Roadmap — swimlane grouping by assignee', status: 'todo', priority: 'medium', assignee: 'Priya Nair', initials: 'PN', labels: ['Roadmap', 'Feature'], project: 'Growth', cycle: 'Sprint 15', updatedAt: '2d ago', description: 'Add a swimlane toggle to the roadmap view that groups items by assignee. Default remains grouping by project milestone.' },
  { id: 'ORB-009', title: 'API gateway — 429 handling with exponential backoff and user-visible toast', status: 'done', priority: 'high', assignee: 'Sam Rivera', initials: 'SR', labels: ['Bug', 'API'], project: 'Platform', cycle: 'Sprint 13', updatedAt: '3d ago', description: 'Unhandled 429 responses were crashing the sync loop. Added exponential backoff with ±15% jitter and a toast notification after 3 consecutive failures.' },
  { id: 'ORB-010', title: 'GhostDevtools — score history sparkline per node', status: 'in-progress', priority: 'medium', assignee: 'Maya Chen', initials: 'MC', labels: ['Ghost UI', 'Devtools'], project: 'Platform', cycle: 'Sprint 14', updatedAt: '4d ago', description: 'Add a sparkline inside GhostDevtools panel showing score evolution over the last 50 events per node. Render as SVG path with gradient fill below the line.' },
  { id: 'ORB-011', title: 'Mobile — swipe-to-status gesture on issue rows', status: 'todo', priority: 'low', assignee: 'Priya Nair', initials: 'PN', labels: ['Feature', 'UX'], project: 'Growth', cycle: 'Sprint 15', updatedAt: '5d ago', description: 'Swipe left to reveal quick resolve/archive actions; swipe right to mark done. Uses the native pointer event API, no external drag library.' },
  { id: 'ORB-012', title: 'Dark mode contrast audit — all muted text must pass WCAG AA', status: 'done', priority: 'low', assignee: 'Priya Nair', initials: 'PN', labels: ['Design'], project: 'Growth', cycle: 'Sprint 13', updatedAt: '6d ago', description: 'Sidebar muted text failed WCAG AA at 3.8:1. Bumped --color-muted to pass at 4.7:1 across all dark surfaces.' },
];

const NAV_ITEMS = [
  { id: 'nav-inbox',   label: 'Inbox',      count: 4,    Icon: IcInbox },
  { id: 'nav-my',      label: 'My Issues',  count: null, Icon: IcPerson },
  { id: 'nav-all',     label: 'All Issues', count: null, Icon: IcLayers },
  { id: 'nav-cycles',  label: 'Cycles',     count: null, Icon: IcCycle },
  { id: 'nav-roadmap', label: 'Roadmap',    count: null, Icon: IcRoadmap },
  { id: 'nav-backlog', label: 'Backlog',    count: null, Icon: IcBacklog },
];

const ISSUE_ACTIONS = [
  { id: 'act-resolve', label: 'Resolve', Icon: IcCheck,   hover: 'hover:text-[#22c55e] hover:border-[#22c55e]/30 hover:bg-[#22c55e]/[0.07]' },
  { id: 'act-comment', label: 'Comment', Icon: IcComment, hover: 'hover:text-[#dddde8] hover:border-white/[0.16] hover:bg-white/[0.05]' },
  { id: 'act-assign',  label: 'Assign',  Icon: IcPerson2, hover: 'hover:text-[#6366f1] hover:border-[#6366f1]/30 hover:bg-[#6366f1]/[0.07]' },
  { id: 'act-label',   label: 'Label',   Icon: IcTag,    hover: 'hover:text-[#f59e0b] hover:border-[#f59e0b]/30 hover:bg-[#f59e0b]/[0.07]' },
  { id: 'act-archive', label: 'Archive', Icon: IcArchive, hover: 'hover:text-[#dddde8] hover:border-white/[0.16] hover:bg-white/[0.05]' },
  { id: 'act-close',   label: 'Close',   Icon: IcXCircle, hover: 'hover:text-[#ef4444] hover:border-[#ef4444]/30 hover:bg-[#ef4444]/[0.07]' },
];

const STATUS_CFG: Record<Status, { label: string; color: string; Icon: () => JSX.Element }> = {
  'todo':        { label: 'Todo',        color: '#5a5a72', Icon: StTodo },
  'in-progress': { label: 'In Progress', color: '#3b82f6', Icon: StProgress },
  'in-review':   { label: 'In Review',   color: '#f59e0b', Icon: StReview },
  'done':        { label: 'Done',        color: '#22c55e', Icon: StDone },
  'cancelled':   { label: 'Cancelled',   color: '#5a5a72', Icon: StCancelled },
};

const PRIORITY_CFG: Record<Priority, { label: string; bar: string }> = {
  'urgent': { label: 'Urgent', bar: 'bg-[#ef4444]' },
  'high':   { label: 'High',   bar: 'bg-[#f97316]' },
  'medium': { label: 'Medium', bar: 'bg-[#6366f1]' },
  'low':    { label: 'Low',    bar: 'bg-[#363648]' },
  'none':   { label: 'None',   bar: 'bg-transparent' },
};

const AVATAR_CFG: Record<string, { bg: string; text: string }> = {
  MC: { bg: 'bg-violet-950/80', text: 'text-violet-300' },
  SR: { bg: 'bg-teal-950/80',   text: 'text-teal-300' },
  PN: { bg: 'bg-rose-950/80',   text: 'text-rose-300' },
  AT: { bg: 'bg-amber-950/80',  text: 'text-amber-300' },
};

const LABEL_CFG: Record<string, string> = {
  'Bug':         'bg-red-950/60    text-red-400    border-red-900/50',
  'Ghost UI':    'bg-indigo-950/60 text-indigo-400 border-indigo-900/50',
  'Performance': 'bg-amber-950/60  text-amber-400  border-amber-900/50',
  'Feature':     'bg-emerald-950/60 text-emerald-400 border-emerald-900/50',
  'Design':      'bg-pink-950/60   text-pink-400   border-pink-900/50',
  'Growth':      'bg-teal-950/60   text-teal-400   border-teal-900/50',
  'Cycles':      'bg-violet-950/60 text-violet-400 border-violet-900/50',
  'Roadmap':     'bg-blue-950/60   text-blue-400   border-blue-900/50',
  'API':         'bg-white/[0.04]  text-[#6a6a82]  border-white/[0.08]',
  'UX':          'bg-orange-950/60 text-orange-400 border-orange-900/50',
  'Research':    'bg-purple-950/60 text-purple-400 border-purple-900/50',
  'Devtools':    'bg-sky-950/60    text-sky-400    border-sky-900/50',
};

function lc(l: string) {
  return (LABEL_CFG[l] ?? 'bg-white/[0.04] text-[#6a6a82] border-white/[0.08]') + ' text-[10px] font-medium px-1.5 py-0.5 rounded border tracking-wide';
}

export function App() {
  return (
    <GhostProvider persistence={localStorageAdapter('orbit-v2')}>
      <OrbitShell />
      <GhostDevtools defaultOpen={false} />
    </GhostProvider>
  );
}

function OrbitShell() {
  const [activeNav, setActiveNav] = useState('nav-all');
  const [selected, setSelected] = useState<Issue | null>(ISSUES[0]);
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all');
  const [usedActions, setUsedActions] = useState<Set<string>>(new Set());

  const visible = useMemo(() => {
    const base = activeNav === 'nav-my' ? ISSUES.filter(i => i.initials === 'MC') : ISSUES;
    return filterStatus === 'all' ? base : base.filter(i => i.status === filterStatus);
  }, [activeNav, filterStatus]);

  return (
    <div className="flex h-full overflow-hidden bg-[#08080d] text-[#dddde8]">
      <Sidebar active={activeNav} setActive={setActiveNav} />
      <div className="flex flex-1 min-w-0">
        <IssueList
          issues={visible}
          selected={selected}
          onSelect={setSelected}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
        {selected && (
          <DetailPanel
            key={selected.id}
            issue={selected}
            usedActions={usedActions}
            onAction={id => setUsedActions(p => new Set([...p, id]))}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
}

function Sidebar({ active, setActive }: { active: string; setActive: (id: string) => void }) {
  return (
    <div className="w-[216px] flex-none flex flex-col border-r border-white/[0.05] bg-[#0a0a10]">
      <div className="flex items-center gap-2.5 px-3.5 h-11 border-b border-white/[0.05]">
        <div className="h-5 w-5 rounded-[5px] bg-[conic-gradient(from_200deg_at_50%_50%,#6366f1,#818cf8,#a5b4fc,#6366f1)] flex-none shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
        <span className="text-[13px] font-semibold tracking-[-0.01em] text-[#dddde8]">Orbit</span>
        <div className="ml-auto flex items-center gap-1">
          <span className="text-[9px] font-semibold tracking-[0.06em] uppercase px-1.5 py-0.5 rounded bg-[#6366f1]/[0.15] text-[#818cf8] border border-[#6366f1]/[0.25]">Pro</span>
        </div>
      </div>

      <div className="px-2 pt-1.5">
        <button className="w-full flex items-center gap-2 h-8 px-2 rounded-md text-[12px] text-[#6a6a82] hover:text-[#dddde8] hover:bg-white/[0.04] transition-colors">
          <IcSearch />
          <span>Search issues…</span>
          <span className="ml-auto text-[10px] opacity-50 font-mono">⌘K</span>
        </button>
      </div>

      <div className="px-2 pt-3 flex-1 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#363648] px-2 mb-1">Workspace</p>
        <Ghost.Slot zone="orbit.nav" className="flex flex-col gap-px">
          {NAV_ITEMS.map(item => {
            const Icon = item.Icon;
            const isActive = active === item.id;
            return (
              <Ghost.Button
                key={item.id}
                id={item.id}
                zone="orbit.nav"
                onClick={() => setActive(item.id)}
                className={[
                  'relative w-full flex items-center gap-2.5 h-[30px] px-2 rounded-md text-[12.5px] font-medium transition-colors text-left border-0 outline-none cursor-pointer',
                  isActive
                    ? 'bg-[#6366f1]/[0.12] text-[#a5b4fc]'
                    : 'text-[#6a6a82] hover:text-[#c4c4d4] hover:bg-white/[0.04]',
                ].join(' ')}
              >
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-3.5 w-[2px] rounded-r bg-[#6366f1]" />}
                <span className={isActive ? 'text-[#6366f1]' : 'opacity-60'}><Icon /></span>
                <span>{item.label}</span>
                {item.count && (
                  <span className="ml-auto text-[10px] h-4 min-w-4 px-1 rounded-full bg-[#6366f1]/[0.2] text-[#818cf8] font-semibold flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </Ghost.Button>
            );
          })}
        </Ghost.Slot>

        <div className="mt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#363648] px-2 mb-1">Projects</p>
          {[{ name: 'Platform', color: 'bg-[#6366f1]' }, { name: 'Growth', color: 'bg-[#22c55e]' }].map(p => (
            <button key={p.name} className="w-full flex items-center gap-2.5 h-[30px] px-2 rounded-md text-[12.5px] text-[#6a6a82] hover:text-[#c4c4d4] hover:bg-white/[0.04] transition-colors">
              <span className={`h-2 w-2 rounded-sm ${p.color} flex-none opacity-80`} />
              {p.name}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#363648] px-2 mb-1">Teams</p>
          {['Engineering', 'Design'].map(t => (
            <button key={t} className="w-full flex items-center gap-2.5 h-[30px] px-2 rounded-md text-[12.5px] text-[#6a6a82] hover:text-[#c4c4d4] hover:bg-white/[0.04] transition-colors">
              <span className="h-4 w-4 rounded bg-white/[0.06] flex-none" />
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-white/[0.05] p-3 flex flex-col gap-2.5">
        <div className="px-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-[#6a6a82] tracking-wide">Sprint 14</span>
            <span className="text-[10px] text-[#363648]">8d left</span>
          </div>
          <div className="h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full w-[62%] rounded-full bg-[#6366f1]/70" />
          </div>
          <p className="text-[10px] text-[#363648] mt-1">7 of 11 issues closed</p>
        </div>
        <div className="flex items-center gap-2 px-1">
          <div className="h-6 w-6 rounded-full bg-violet-950/80 flex items-center justify-center text-[9px] font-semibold text-violet-300 border border-violet-900/40 flex-none">MC</div>
          <div>
            <p className="text-[11px] font-medium text-[#c4c4d4] leading-none">Maya Chen</p>
            <p className="text-[10px] text-[#6a6a82] mt-0.5 leading-none">maya@orbitapp.io</p>
          </div>
          <button className="ml-auto p-1 rounded hover:bg-white/[0.06] text-[#363648] hover:text-[#6a6a82] transition-colors"><IcDots /></button>
        </div>
      </div>
    </div>
  );
}

function IssueList({ issues, selected, onSelect, filterStatus, setFilterStatus }: {
  issues: Issue[];
  selected: Issue | null;
  onSelect: (i: Issue) => void;
  filterStatus: Status | 'all';
  setFilterStatus: (s: Status | 'all') => void;
}) {
  const tabs: Array<{ value: Status | 'all'; label: string; count?: number }> = [
    { value: 'all', label: 'All', count: ISSUES.length },
    { value: 'todo', label: 'Todo' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'in-review', label: 'In Review' },
    { value: 'done', label: 'Done' },
  ];

  return (
    <div className="flex-1 min-w-0 flex flex-col border-r border-white/[0.05] bg-[#0c0c12]">
      <div className="flex items-center gap-2 px-5 h-11 border-b border-white/[0.05]">
        <span className="text-[11px] text-[#6a6a82]">Platform</span>
        <span className="text-[11px] text-[#363648]">/</span>
        <span className="text-[12px] font-semibold text-[#dddde8]">All Issues</span>
        <span className="text-[10px] text-[#363648] bg-white/[0.06] px-1.5 py-0.5 rounded font-mono">{issues.length}</span>
        <div className="ml-auto flex items-center gap-0.5">
          {[['Filter', IcFilter], ['Sort', IcSort], ['Display', IcDisplay]].map(([label, Icon]) => (
            <button key={label as string} className="flex items-center gap-1.5 h-7 px-2.5 rounded text-[11.5px] text-[#6a6a82] hover:text-[#dddde8] hover:bg-white/[0.05] transition-colors">
              <span className="opacity-70"><Icon as any /></span>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1 px-5 h-9 border-b border-white/[0.04]">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilterStatus(tab.value)}
            className={[
              'flex items-center gap-1.5 h-6 px-2.5 rounded text-[11.5px] font-medium transition-colors',
              filterStatus === tab.value
                ? 'bg-[#6366f1]/[0.12] text-[#818cf8]'
                : 'text-[#6a6a82] hover:text-[#c4c4d4] hover:bg-white/[0.04]',
            ].join(' ')}
          >
            {tab.label}
            {tab.count && <span className="text-[10px] opacity-60">{tab.count}</span>}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {issues.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-[#363648]">
            <IcLayers />
            <span className="text-[12px]">No issues match this filter</span>
          </div>
        )}
        {issues.map(issue => {
          const sm = STATUS_CFG[issue.status];
          const pm = PRIORITY_CFG[issue.priority];
          const av = AVATAR_CFG[issue.initials] ?? { bg: 'bg-white/10', text: 'text-white' };
          const isSelected = selected?.id === issue.id;

          return (
            <button
              key={issue.id}
              onClick={() => onSelect(issue)}
              className={[
                'relative w-full flex items-center gap-3 px-5 py-2.5 border-b text-left transition-colors group',
                isSelected
                  ? 'bg-[#6366f1]/[0.07] border-white/[0.06]'
                  : 'border-white/[0.04] hover:bg-white/[0.025]',
              ].join(' ')}
            >
              <span className={`absolute left-0 top-0 bottom-0 w-[2.5px] rounded-r ${pm.bar}`} />
              <span style={{ color: sm.color }} className="flex-none"><sm.Icon /></span>
              <span className="text-[10.5px] text-[#6a6a82] font-mono w-[58px] flex-none tabular-nums shrink-0">{issue.id}</span>
              <span className="text-[12.5px] text-[#c4c4d4] flex-1 truncate leading-none group-hover:text-[#dddde8] transition-colors">{issue.title}</span>
              <div className="flex items-center gap-2 flex-none">
                {issue.labels.slice(0, 1).map(l => (
                  <span key={l} className={lc(l)}>{l}</span>
                ))}
                <div className={`h-[18px] w-[18px] rounded-full ${av.bg} border border-white/[0.06] flex items-center justify-center text-[8px] font-bold ${av.text} flex-none`}>
                  {issue.initials}
                </div>
                <span className="text-[10.5px] text-[#363648] w-12 text-right tabular-nums">{issue.updatedAt}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DetailPanel({ issue, usedActions, onAction, onClose }: {
  issue: Issue;
  usedActions: Set<string>;
  onAction: (id: string) => void;
  onClose: () => void;
}) {
  const sm = STATUS_CFG[issue.status];
  const pm = PRIORITY_CFG[issue.priority];
  const av = AVATAR_CFG[issue.initials] ?? { bg: 'bg-white/10', text: 'text-white' };

  return (
    <div className="w-[372px] flex-none flex flex-col bg-[#09090f] border-l border-white/[0.05] overflow-hidden" style={{ animation: 'slide-in-right 0.18s ease' }}>
      <div className="flex items-center h-11 px-4 border-b border-white/[0.05] gap-1.5">
        <span className="text-[10.5px] font-mono text-[#6a6a82]">{issue.id}</span>
        <span className="text-[10px] text-[#363648]">·</span>
        <span className="text-[10.5px] text-[#6a6a82]">{issue.cycle}</span>
        <div className="ml-auto flex items-center gap-0.5">
          {[IcLink, IcMaximize, IcX].map((Icon, i) => (
            <button
              key={i}
              onClick={i === 2 ? onClose : undefined}
              className="h-6 w-6 flex items-center justify-center rounded hover:bg-white/[0.06] text-[#363648] hover:text-[#6a6a82] transition-colors"
            >
              <Icon />
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
        <h2 className="text-[14.5px] font-semibold text-[#dddde8] leading-[1.45] tracking-[-0.01em]">{issue.title}</h2>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#363648]">Quick Actions</p>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#6366f1]/[0.08] border border-[#6366f1]/[0.2]">
              <span className="h-1 w-1 rounded-full bg-[#6366f1] animate-[pulse-dot_2s_ease-in-out_infinite]" />
              <span className="text-[9px] text-[#818cf8] font-semibold tracking-wide">ADAPTS</span>
            </div>
          </div>
          <Ghost.Slot zone="orbit.actions" className="flex flex-wrap gap-1.5">
            {ISSUE_ACTIONS.map(action => {
              const Icon = action.Icon;
              const done = usedActions.has(action.id);
              return (
                <Ghost.Button
                  key={action.id}
                  id={action.id}
                  zone="orbit.actions"
                  onClick={() => onAction(action.id)}
                  className={[
                    'flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[11.5px] font-medium border transition-all cursor-pointer outline-none',
                    done
                      ? 'bg-[#22c55e]/[0.08] border-[#22c55e]/[0.25] text-[#4ade80]'
                      : `bg-white/[0.03] border-white/[0.08] text-[#6a6a82] ${action.hover}`,
                  ].join(' ')}
                >
                  <Icon />
                  {action.label}
                </Ghost.Button>
              );
            })}
          </Ghost.Slot>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Status', value: <span className="flex items-center gap-1.5 text-[12px]" style={{ color: sm.color }}><sm.Icon />{sm.label}</span> },
            { label: 'Priority', value: <span className={`flex items-center gap-1.5 text-[12px]`}><span className={`h-2 w-2 rounded-full ${pm.bar}`} /><span className="text-[#c4c4d4]">{pm.label}</span></span> },
            { label: 'Assignee', value: <span className="flex items-center gap-1.5 text-[12px]"><span className={`h-4 w-4 rounded-full ${av.bg} border border-white/[0.06] flex items-center justify-center text-[7px] font-bold ${av.text}`}>{issue.initials}</span><span className="text-[#c4c4d4]">{issue.assignee}</span></span> },
            { label: 'Project', value: <span className="text-[12px] text-[#c4c4d4]">{issue.project}</span> },
            { label: 'Updated', value: <span className="text-[12px] text-[#6a6a82]">{issue.updatedAt}</span> },
            { label: 'Labels', value: <div className="flex flex-wrap gap-1">{issue.labels.map(l => <span key={l} className={lc(l)}>{l}</span>)}</div> },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/[0.025] border border-white/[0.06] rounded-lg px-3 py-2">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#363648] mb-1">{label}</p>
              {value}
            </div>
          ))}
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#363648] mb-2">Description</p>
          <p className="text-[12.5px] text-[#6a6a82] leading-relaxed">{issue.description}</p>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#363648] mb-3">Activity</p>
          <div className="flex flex-col gap-3">
            {[
              { initials: 'MC', bg: 'bg-violet-950/80', text: 'text-violet-300', name: 'Maya Chen', action: 'moved to In Progress', time: '3m ago' },
              { initials: 'AT', bg: 'bg-amber-950/80',  text: 'text-amber-300',  name: 'Alex Torres', action: 'set priority to Urgent', time: '1h ago' },
              { initials: 'SR', bg: 'bg-teal-950/80',   text: 'text-teal-300',   name: 'Sam Rivera', action: 'opened this issue', time: '2d ago' },
            ].map((ev, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className={`h-5 w-5 rounded-full ${ev.bg} border border-white/[0.06] flex items-center justify-center text-[7.5px] font-bold ${ev.text} flex-none mt-0.5`}>{ev.initials}</div>
                <div>
                  <span className="text-[11.5px] font-semibold text-[#c4c4d4]">{ev.name} </span>
                  <span className="text-[11.5px] text-[#6a6a82]">{ev.action}</span>
                  <p className="text-[10px] text-[#363648] mt-0.5">{ev.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.05] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-[22px] w-[22px] rounded-full bg-violet-950/80 border border-violet-900/40 flex items-center justify-center text-[8px] font-bold text-violet-300 flex-none">MC</div>
          <input
            placeholder="Leave a comment…"
            className="flex-1 h-8 bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 text-[12px] text-[#dddde8] placeholder:text-[#363648] outline-none focus:border-[#6366f1]/[0.4] transition-colors"
          />
        </div>
      </div>
    </div>
  );
}

function StTodo() { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/></svg>; }
function StProgress() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}
function StReview() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="7" cy="7" r="2.5" fill="currentColor"/>
    </svg>
  );
}
function StDone() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4.5 7l1.8 1.8L9.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function StCancelled() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2.5 2"/>
      <path d="M5 5l4 4M9 5l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function IcInbox() { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M1.5 9h3l1 2h3l1-2h3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>; }
function IcPerson() { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 13c0-2.76 2.24-4 5-4s5 1.24 5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>; }
function IcLayers() { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 4.5l5-3 5 3-5 3-5-3zM2 7.5l5 3 5-3M2 10.5l5 3 5-3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>; }
function IcCycle() { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M12 7a5 5 0 1 1-1.5-3.54" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M10.5 1v3.5H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function IcRoadmap() { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M1 3.5h4l2 2h6M3 7h5l2 2h3M1 10.5h3l2-2h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function IcBacklog() { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" strokeDasharray="3 1.8"/></svg>; }
function IcSearch() { return <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.4"/><path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>; }
function IcFilter() { return <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M4 7h6M6 10.5h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>; }
function IcSort() { return <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h7M2 7h5M2 10.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M11 2v10M11 12l1.5-1.5M11 12l-1.5-1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function IcDisplay() { return <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2.5" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 6.5h4M5 8.5h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>; }
function IcCheck() { return <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function IcComment() { return <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="11" height="8" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M4 12l2-2.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function IcPerson2() { return <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 12c0-2.76 2.24-4 5-4s5 1.24 5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>; }
function IcTag() { return <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 2h5l5 5-5 5-5-5V2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><circle cx="4.5" cy="4.5" r="1" fill="currentColor"/></svg>; }
function IcArchive() { return <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="11" height="3" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M2.5 4.5v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-7" stroke="currentColor" strokeWidth="1.3"/><path d="M5.5 7.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>; }
function IcXCircle() { return <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 5l4 4M9 5l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>; }
function IcLink() { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M5.5 8.5a3 3 0 0 0 4.24 0l2-2a3 3 0 0 0-4.24-4.24l-1 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M8.5 5.5a3 3 0 0 0-4.24 0l-2 2a3 3 0 0 0 4.24 4.24l1-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>; }
function IcMaximize() { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2.5 9v2.5H5M9 2.5h2.5V5M2.5 5V2.5H5M9 11.5h2.5V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function IcX() { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>; }
function IcDots() { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="3" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="11" cy="7" r="1" fill="currentColor"/></svg>; }
