import { useState, useMemo, useEffect, useRef, type ReactNode } from 'react';
import {
  GhostProvider,
  Ghost,
  GhostMenu,
  GhostToastProvider,
  GhostPrivacyPanel,
  GhostCommandPaletteProvider,
  GhostBreadcrumb,
  GhostBreadcrumbItem,
  useGhostEngine,
  useGhostToast,
  type GhostCommand,
} from '@ghost-ui/react';
import { GhostDevtools } from '@ghost-ui/devtools';
import { localStorageAdapter, type GhostEvent } from '@ghost-ui/core';

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
  { id: 'ORB-001', title: 'GhostProvider silently falls back to empty state in Safari 17 cross-origin iframes', status: 'in-progress', priority: 'urgent', assignee: 'Maya Chen', initials: 'MC', labels: ['Bug', 'Ghost UI'], project: 'Platform', cycle: 'Sprint 14', updatedAt: '3m', description: 'IndexedDB writes are blocked in Safari 17.x when the embed is cross-origin. The engine returns an empty state on reload instead of surfacing the error. We need to detect this condition and fall back to `localStorageAdapter` gracefully with a visible warning.' },
  { id: 'ORB-002', title: 'Memory leak — ghost-engine event listener never removed on provider unmount', status: 'in-review', priority: 'high', assignee: 'Sam Rivera', initials: 'SR', labels: ['Bug', 'Performance'], project: 'Platform', cycle: 'Sprint 14', updatedAt: '22m', description: 'The GhostProvider attaches a visibility-change listener on mount but never removes it on cleanup. Long-running SPAs accumulate these listeners, producing measurable heap growth after 30+ minutes of use.' },
  { id: 'ORB-003', title: 'Onboarding redesign — defer invite step until user has experienced first value', status: 'todo', priority: 'medium', assignee: 'Priya Nair', initials: 'PN', labels: ['Design', 'Growth'], project: 'Growth', cycle: 'Sprint 15', updatedAt: '1h', description: "Analytics show 42% drop-off at the \"invite team\" step. Users haven't experienced product value yet and don't have teammates ready. Proposal: move invites post-first-interaction and replace with a workspace setup placeholder." },
  { id: 'ORB-004', title: 'Command palette ⌘K with Ghost UI score-ordered results', status: 'in-progress', priority: 'medium', assignee: 'Maya Chen', initials: 'MC', labels: ['Feature', 'UX'], project: 'Platform', cycle: 'Sprint 14', updatedAt: '2h', description: 'Implement a command palette using Ghost UI scores to surface the most-used commands first. Commands should be registered from each feature module via a registry, not hardcoded into the palette component.' },
  { id: 'ORB-005', title: 'Issue export — CSV and Linear JSON schema', status: 'todo', priority: 'low', assignee: 'Alex Torres', initials: 'AT', labels: ['Feature'], project: 'Platform', cycle: 'Sprint 15', updatedAt: '4h', description: "Users need to export their backlog for stakeholder sharing. Support CSV with configurable column order, and Linear's JSON schema for one-click migration." },
  { id: 'ORB-006', title: 'Cycle view — drag-and-drop issue reordering with optimistic updates', status: 'todo', priority: 'high', assignee: 'Sam Rivera', initials: 'SR', labels: ['Feature', 'Cycles'], project: 'Platform', cycle: 'Sprint 15', updatedAt: '6h', description: 'Drag-and-drop reordering in the sprint cycle view. Decision needed: use Ghost UI score as default sort order and let manual drag override it, or keep Ghost scoring separate from sprint ordering?' },
  { id: 'ORB-007', title: 'Score decay too aggressive after 4h idle — buttons reset to default on next session', status: 'in-progress', priority: 'urgent', assignee: 'Alex Torres', initials: 'AT', labels: ['Ghost UI', 'Research'], project: 'Platform', cycle: 'Sprint 14', updatedAt: '1d', description: 'After 4 hours idle, half-life decay reduces scores to near zero. Users returning the next morning see the default button order. Need a two-tier decay curve: fast within-session recency decay, slow cross-session preference memory.' },
  { id: 'ORB-008', title: 'Roadmap — swimlane grouping by assignee', status: 'todo', priority: 'medium', assignee: 'Priya Nair', initials: 'PN', labels: ['Roadmap', 'Feature'], project: 'Growth', cycle: 'Sprint 15', updatedAt: '2d', description: 'Add a swimlane toggle to the roadmap view that groups items by assignee. Default remains grouping by project milestone.' },
  { id: 'ORB-009', title: 'API gateway — 429 handling with exponential backoff and user-visible toast', status: 'done', priority: 'high', assignee: 'Sam Rivera', initials: 'SR', labels: ['Bug', 'API'], project: 'Platform', cycle: 'Sprint 13', updatedAt: '3d', description: 'Unhandled 429 responses were crashing the sync loop. Added exponential backoff with ±15% jitter and a toast notification after 3 consecutive failures.' },
  { id: 'ORB-010', title: 'GhostDevtools — score history sparkline per node', status: 'in-progress', priority: 'medium', assignee: 'Maya Chen', initials: 'MC', labels: ['Ghost UI', 'Devtools'], project: 'Platform', cycle: 'Sprint 14', updatedAt: '4d', description: 'Add a sparkline inside GhostDevtools panel showing score evolution over the last 50 events per node. Render as SVG path with gradient fill below the line.' },
  { id: 'ORB-011', title: 'Mobile — swipe-to-status gesture on issue rows', status: 'todo', priority: 'low', assignee: 'Priya Nair', initials: 'PN', labels: ['Feature', 'UX'], project: 'Growth', cycle: 'Sprint 15', updatedAt: '5d', description: 'Swipe left to reveal quick resolve/archive actions; swipe right to mark done. Uses the native pointer event API, no external drag library.' },
  { id: 'ORB-012', title: 'Dark mode contrast audit — all muted text must pass WCAG AA', status: 'done', priority: 'low', assignee: 'Priya Nair', initials: 'PN', labels: ['Design'], project: 'Growth', cycle: 'Sprint 13', updatedAt: '6d', description: 'Sidebar muted text failed WCAG AA at 3.8:1. Bumped --color-muted to pass at 4.7:1 across all dark surfaces.' },
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
  { id: 'act-resolve', label: 'Resolve',  Icon: IcCheck,   hover: 'hover:text-[#22c55e] hover:border-[#22c55e]/25 hover:bg-[#22c55e]/[0.06]' },
  { id: 'act-comment', label: 'Comment',  Icon: IcComment, hover: 'hover:text-[#e6e6f0] hover:border-white/[0.14] hover:bg-white/[0.05]' },
  { id: 'act-assign',  label: 'Assign',   Icon: IcPerson2, hover: 'hover:text-[#8b8df8] hover:border-[#5c5ef0]/25 hover:bg-[#5c5ef0]/[0.07]' },
  { id: 'act-label',   label: 'Label',    Icon: IcTag,     hover: 'hover:text-[#f59e0b] hover:border-[#f59e0b]/25 hover:bg-[#f59e0b]/[0.06]' },
  { id: 'act-archive', label: 'Archive',  Icon: IcArchive, hover: 'hover:text-[#e6e6f0] hover:border-white/[0.14] hover:bg-white/[0.05]' },
  { id: 'act-close',   label: 'Close',    Icon: IcXCircle, hover: 'hover:text-[#ef4444] hover:border-[#ef4444]/25 hover:bg-[#ef4444]/[0.06]' },
];

const STATUS_CFG: Record<Status, { label: string; color: string; Icon: () => ReactNode }> = {
  'todo':        { label: 'Todo',        color: '#5a5a72', Icon: StTodo },
  'in-progress': { label: 'In Progress', color: '#3b82f6', Icon: StProgress },
  'in-review':   { label: 'In Review',   color: '#f59e0b', Icon: StReview },
  'done':        { label: 'Done',        color: '#22c55e', Icon: StDone },
  'cancelled':   { label: 'Cancelled',   color: '#3a3a52', Icon: StCancelled },
};

const PRIORITY_CFG: Record<Priority, { label: string; bar: string; dot: string }> = {
  'urgent': { label: 'Urgent', bar: 'bg-[#ef4444]',   dot: 'text-[#ef4444]' },
  'high':   { label: 'High',   bar: 'bg-[#f97316]',   dot: 'text-[#f97316]' },
  'medium': { label: 'Medium', bar: 'bg-[#5c5ef0]',   dot: 'text-[#8b8df8]' },
  'low':    { label: 'Low',    bar: 'bg-[#2e2e42]',   dot: 'text-[#5a5a72]' },
  'none':   { label: 'None',   bar: 'bg-transparent', dot: 'text-[#2e2e42]' },
};

const AVATAR_CFG: Record<string, { bg: string; text: string }> = {
  MC: { bg: 'bg-violet-950',  text: 'text-violet-300' },
  SR: { bg: 'bg-teal-950',    text: 'text-teal-300' },
  PN: { bg: 'bg-rose-950',    text: 'text-rose-300' },
  AT: { bg: 'bg-amber-950',   text: 'text-amber-300' },
};

const LABEL_CFG: Record<string, string> = {
  'Bug':         'bg-red-950/50     text-red-400     border-red-900/40',
  'Ghost UI':    'bg-indigo-950/50  text-indigo-300  border-indigo-900/40',
  'Performance': 'bg-amber-950/50   text-amber-400   border-amber-900/40',
  'Feature':     'bg-emerald-950/50 text-emerald-400 border-emerald-900/40',
  'Design':      'bg-pink-950/50    text-pink-400    border-pink-900/40',
  'Growth':      'bg-teal-950/50    text-teal-400    border-teal-900/40',
  'Cycles':      'bg-violet-950/50  text-violet-400  border-violet-900/40',
  'Roadmap':     'bg-blue-950/50    text-blue-400    border-blue-900/40',
  'API':         'bg-white/[0.03]   text-[#5a5a72]   border-white/[0.07]',
  'UX':          'bg-orange-950/50  text-orange-400  border-orange-900/40',
  'Research':    'bg-purple-950/50  text-purple-400  border-purple-900/40',
  'Devtools':    'bg-sky-950/50     text-sky-400     border-sky-900/40',
};

function lc(l: string) {
  return (LABEL_CFG[l] ?? 'bg-white/[0.03] text-[#5a5a72] border-white/[0.07]') + ' text-[10px] font-semibold px-1.5 py-0.5 rounded-md border tracking-wide';
}

export function App() {
  return (
    <GhostProvider persistence={localStorageAdapter('orbit-v3')}>
      <GhostToastProvider position="bottom-right">
        <GhostCommandPaletteProvider>
          <OrbitShell />
          <GhostDemoBar />
          <GhostDevtools defaultOpen={true} />
        </GhostCommandPaletteProvider>
      </GhostToastProvider>
    </GhostProvider>
  );
}

function OrbitShell() {
  const [activeNav, setActiveNav] = useState('nav-all');
  const [selected, setSelected] = useState<Issue | null>(ISSUES[0] ?? null);
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all');
  const { toast } = useGhostToast();

  const visible = useMemo(() => {
    const base = activeNav === 'nav-my' ? ISSUES.filter(i => i.initials === 'MC') : ISSUES;
    return filterStatus === 'all' ? base : base.filter(i => i.status === filterStatus);
  }, [activeNav, filterStatus]);

  const commands: GhostCommand[] = useMemo(() => [
    { id: 'nav-inbox',   label: 'Go to Inbox',         group: 'Navigate', onSelect: () => { setActiveNav('nav-inbox');   setFilterStatus('all'); } },
    { id: 'nav-my',      label: 'Go to My Issues',     group: 'Navigate', onSelect: () => { setActiveNav('nav-my');      setFilterStatus('all'); } },
    { id: 'nav-all',     label: 'Go to All Issues',    group: 'Navigate', onSelect: () => { setActiveNav('nav-all');     setFilterStatus('all'); } },
    { id: 'nav-cycles',  label: 'Go to Cycles',        group: 'Navigate', onSelect: () => { setActiveNav('nav-cycles');  setFilterStatus('all'); } },
    { id: 'nav-roadmap', label: 'Go to Roadmap',       group: 'Navigate', onSelect: () => { setActiveNav('nav-roadmap'); setFilterStatus('all'); } },
    { id: 'nav-backlog', label: 'Go to Backlog',       group: 'Navigate', onSelect: () => { setActiveNav('nav-backlog'); setFilterStatus('all'); } },
    { id: 'act-resolve', label: 'Resolve issue',       group: 'Actions',  onSelect: () => { if (selected) toast({ zone: 'orbit.cmd', variant: 'success', message: `${selected.id} marked as done` }); } },
    { id: 'act-comment', label: 'Add comment',         group: 'Actions',  onSelect: () => { if (selected) toast({ zone: 'orbit.cmd', variant: 'info',    message: `Comment added to ${selected.id}` }); } },
    { id: 'act-assign',  label: 'Assign issue',        group: 'Actions',  onSelect: () => { if (selected) toast({ zone: 'orbit.cmd', variant: 'success', message: `${selected.id} assigned to you` }); } },
    { id: 'act-label',   label: 'Add label',           group: 'Actions',  onSelect: () => { if (selected) toast({ zone: 'orbit.cmd', variant: 'info',    message: `Label added to ${selected.id}` }); } },
    { id: 'act-archive', label: 'Archive issue',       group: 'Actions',  onSelect: () => { if (selected) toast({ zone: 'orbit.cmd', variant: 'info',    message: `${selected.id} archived` }); } },
    { id: 'act-close',   label: 'Close issue',         group: 'Actions',  onSelect: () => { if (selected) { toast({ zone: 'orbit.cmd', variant: 'success', message: `${selected.id} closed` }); setSelected(null); } } },
    { id: 'filter-status-todo',     label: 'Filter: Todo',        group: 'Filter', onSelect: () => setFilterStatus('todo') },
    { id: 'filter-status-progress', label: 'Filter: In Progress', group: 'Filter', onSelect: () => setFilterStatus('in-progress') },
    { id: 'filter-status-done',     label: 'Filter: Done',        group: 'Filter', onSelect: () => setFilterStatus('done') },
  ], [selected, toast]);

  return (
    <div className="flex h-full overflow-hidden text-[#e6e6f0]" style={{ background: 'radial-gradient(ellipse 100% 40% at 50% -5%, rgba(92,94,240,0.10) 0%, transparent 55%), #060609' }}>
      <Ghost.CommandPalette zone="orbit.cmd" commands={commands} hotkey={true} />
      <Sidebar active={activeNav} setActive={setActiveNav} />
      <div className="flex flex-1 min-w-0">
        <IssueList
          issues={visible}
          selected={selected}
          onSelect={setSelected}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          activeNav={activeNav}
        />
        {selected ? (
          <DetailPanel
            key={selected.id}
            issue={selected}
            onClose={() => setSelected(null)}
          />
        ) : (
          <EmptyDetail />
        )}
      </div>
    </div>
  );
}

function Sidebar({ active, setActive }: { active: string; setActive: (id: string) => void }) {
  return (
    <div className="w-[218px] flex-none flex flex-col border-r border-white/[0.05]" style={{ background: '#09090f' }}>
      {/* Workspace header */}
      <div className="flex items-center gap-2.5 px-3.5 h-12 border-b border-white/[0.05] flex-none">
        <div className="relative h-6 w-6 flex-none">
          <div className="h-6 w-6 rounded-[7px] bg-[#5c5ef0] flex items-center justify-center shadow-[0_0_14px_rgba(92,94,240,0.55)]">
            <OrbitIcon />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-semibold tracking-[-0.02em] text-[#e6e6f0]">Orbit</span>
            <span className="text-[9px] font-bold tracking-[0.07em] uppercase px-1.5 py-[2px] rounded-md bg-[#5c5ef0]/[0.18] text-[#8b8df8] border border-[#5c5ef0]/[0.3]">Pro</span>
          </div>
        </div>
        <button aria-label="Settings" className="flex-none h-5 w-5 flex items-center justify-center rounded text-[#2e2e42] hover:text-[#5a5a72] hover:bg-white/[0.05] transition-colors cursor-pointer">
          <IcDots />
        </button>
      </div>

      {/* Search */}
      <div className="px-2 py-2 flex-none border-b border-white/[0.04]">
        <button className="w-full flex items-center gap-2 h-8 px-2.5 rounded-lg text-[12px] text-[#5a5a72] hover:text-[#9898b2] hover:bg-white/[0.04] transition-colors cursor-pointer border border-transparent hover:border-white/[0.06]">
          <IcSearch />
          <span>Search…</span>
          <span className="ml-auto text-[10px] text-[#2e2e42] font-mono tracking-tight">⌘K</span>
        </button>
      </div>

      {/* Nav */}
      <div className="px-2 pt-3 flex-1 overflow-y-auto min-h-0">
        <SidebarSection label="Workspace">
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
                    'relative w-full flex items-center gap-2.5 h-[31px] px-2.5 rounded-lg text-[12.5px] font-medium transition-all text-left border-0 outline-none cursor-pointer',
                    isActive
                      ? 'bg-[#5c5ef0]/[0.14] text-[#b0b2ff]'
                      : 'text-[#5a5a72] hover:text-[#b8b8cc] hover:bg-white/[0.04]',
                  ].join(' ')}
                >
                  {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2.5px] rounded-r bg-[#5c5ef0]" />}
                  <span className={isActive ? 'text-[#8b8df8]' : 'opacity-50'}><Icon /></span>
                  <span>{item.label}</span>
                  {item.count && (
                    <span className="ml-auto text-[9.5px] h-[17px] min-w-[17px] px-1 rounded-full bg-[#ef4444]/[0.18] text-[#f87171] font-bold flex items-center justify-center tabular-nums">
                      {item.count}
                    </span>
                  )}
                </Ghost.Button>
              );
            })}
          </Ghost.Slot>
        </SidebarSection>

        <SidebarSection label="Projects" className="mt-3">
          {[
            { name: 'Platform', color: 'from-[#5c5ef0] to-[#8b8df8]', count: 8 },
            { name: 'Growth',   color: 'from-[#22c55e] to-[#4ade80]', count: 4 },
          ].map(p => (
            <button key={p.name} className="w-full flex items-center gap-2.5 h-[31px] px-2.5 rounded-lg text-[12.5px] text-[#5a5a72] hover:text-[#b8b8cc] hover:bg-white/[0.04] transition-colors cursor-pointer">
              <span className={`h-3.5 w-3.5 rounded-[4px] bg-gradient-to-br ${p.color} flex-none opacity-90`} />
              <span>{p.name}</span>
              <span className="ml-auto text-[10px] text-[#2e2e42] tabular-nums font-mono">{p.count}</span>
            </button>
          ))}
        </SidebarSection>

        <SidebarSection label="Members" className="mt-3">
          {[
            { initials: 'MC', name: 'Maya Chen',   ...AVATAR_CFG.MC },
            { initials: 'SR', name: 'Sam Rivera',  ...AVATAR_CFG.SR },
            { initials: 'PN', name: 'Priya Nair',  ...AVATAR_CFG.PN },
            { initials: 'AT', name: 'Alex Torres', ...AVATAR_CFG.AT },
          ].map(m => (
            <button key={m.initials} className="w-full flex items-center gap-2 h-[31px] px-2.5 rounded-lg text-[12.5px] text-[#5a5a72] hover:text-[#b8b8cc] hover:bg-white/[0.04] transition-colors cursor-pointer">
              <div className={`h-4.5 w-4.5 h-[18px] w-[18px] rounded-full ${m.bg} border border-white/[0.08] flex items-center justify-center text-[7.5px] font-bold ${m.text} flex-none`}>{m.initials}</div>
              <span className="truncate">{m.name}</span>
            </button>
          ))}
        </SidebarSection>
      </div>

      {/* Sprint + user footer */}
      <div className="border-t border-white/[0.05] p-3 flex flex-col gap-3 flex-none">
        <div className="px-0.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-[#9898b2]">Sprint 14</span>
            <span className="text-[10px] text-[#2e2e42] font-mono">8d left</span>
          </div>
          <div className="h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full w-[62%] rounded-full" style={{ background: 'linear-gradient(90deg, #5c5ef0, #8b8df8)' }} />
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[10px] text-[#2e2e42]">7 / 11 closed</p>
            <p className="text-[10px] text-[#5c5ef0]/70 font-semibold">62%</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative flex-none">
            <div className="h-7 w-7 rounded-full bg-violet-950 border border-violet-800/40 flex items-center justify-center text-[9px] font-bold text-violet-300">MC</div>
            <span className="absolute -bottom-px -right-px h-2 w-2 rounded-full bg-[#22c55e] border border-[#09090f]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-[#c8c8dc] leading-none truncate">Maya Chen</p>
            <p className="text-[10px] text-[#5a5a72] mt-0.5 leading-none truncate">maya@orbitapp.io</p>
          </div>
          <button aria-label="User menu" className="flex-none h-6 w-6 flex items-center justify-center rounded-md hover:bg-white/[0.06] text-[#2e2e42] hover:text-[#5a5a72] transition-colors cursor-pointer">
            <IcDots />
          </button>
        </div>
        <GhostPrivacyPanel style={{ borderRadius: 10, padding: '10px 12px', gap: 8 }} />
      </div>
    </div>
  );
}

function SidebarSection({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#2e2e42] px-2.5 mb-1">{label}</p>
      {children}
    </div>
  );
}

const ASSIGNEES = [
  { id: 'assignee-mc', initials: 'MC', name: 'Maya Chen',   ...AVATAR_CFG.MC },
  { id: 'assignee-sr', initials: 'SR', name: 'Sam Rivera',  ...AVATAR_CFG.SR },
  { id: 'assignee-pn', initials: 'PN', name: 'Priya Nair',  ...AVATAR_CFG.PN },
  { id: 'assignee-at', initials: 'AT', name: 'Alex Torres', ...AVATAR_CFG.AT },
];

function IssueList({ issues, selected, onSelect, filterStatus, setFilterStatus, activeNav }: {
  issues: Issue[];
  selected: Issue | null;
  onSelect: (i: Issue) => void;
  filterStatus: Status | 'all';
  setFilterStatus: (s: Status | 'all') => void;
  activeNav: string;
}) {
  const { toast } = useGhostToast();
  const navLabel = NAV_ITEMS.find(n => n.id === activeNav)?.label ?? 'All Issues';
  const [assigneeQuery, setAssigneeQuery] = useState('');
  const filteredAssignees = ASSIGNEES.filter(a =>
    a.name.toLowerCase().includes(assigneeQuery.toLowerCase())
  );

  const countFor = (v: Status | 'all') =>
    v === 'all' ? ISSUES.length : ISSUES.filter(i => i.status === v).length;

  return (
    <div className="flex-1 min-w-0 flex flex-col border-r border-white/[0.05]" style={{ background: '#0a0a10' }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 h-12 border-b border-white/[0.05] flex-none">
        <div className="flex items-center gap-1.5 mr-1">
          <span className="text-[11.5px] text-[#2e2e42]">Platform</span>
          <IcChevronRight />
          <span className="text-[12.5px] font-semibold text-[#c8c8dc]">{navLabel}</span>
          <span className="text-[10px] text-[#2e2e42] bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.5 rounded-md font-mono tabular-nums">{issues.length}</span>
        </div>
        <div className="ml-auto flex items-center gap-0.5">
          <Ghost.Toolbar zone="orbit.toolbar" className="flex items-center gap-0.5">
            <Ghost.Toolbar.Button
              id="tb-filter"
              zone="orbit.toolbar"
              onClick={() => toast({ zone: 'orbit.toolbar', variant: 'info', message: 'Filter panel coming soon' })}
              className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-[11.5px] text-[#5a5a72] hover:text-[#b8b8cc] hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              <span className="opacity-60"><IcFilter /></span>
              <span>Filter</span>
            </Ghost.Toolbar.Button>
            <Ghost.Toolbar.Button
              id="tb-group"
              zone="orbit.toolbar"
              onClick={() => toast({ zone: 'orbit.toolbar', variant: 'info', message: 'Group by coming soon' })}
              className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-[11.5px] text-[#5a5a72] hover:text-[#b8b8cc] hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              <span className="opacity-60"><IcDisplay /></span>
              <span>Group</span>
            </Ghost.Toolbar.Button>
            <Ghost.Toolbar.Button
              id="tb-sort"
              zone="orbit.toolbar"
              onClick={() => toast({ zone: 'orbit.toolbar', variant: 'info', message: 'Sort options coming soon' })}
              className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-[11.5px] text-[#5a5a72] hover:text-[#b8b8cc] hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              <span className="opacity-60"><IcSort /></span>
              <span>Sort</span>
            </Ghost.Toolbar.Button>
            <Ghost.Toolbar.Button
              id="tb-display"
              zone="orbit.toolbar"
              onClick={() => toast({ zone: 'orbit.toolbar', variant: 'info', message: 'Display settings coming soon' })}
              className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-[11.5px] text-[#5a5a72] hover:text-[#b8b8cc] hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              <span className="opacity-60"><IcDisplay /></span>
              <span>Display</span>
            </Ghost.Toolbar.Button>
          </Ghost.Toolbar>
          {/* Ghost.Combobox assignee filter */}
          <Ghost.Combobox
            zone="orbit.assignee-filter"
            onQueryChange={setAssigneeQuery}
            onSelect={(_, val) => setAssigneeQuery(val === 'All' ? '' : val)}
            className="relative"
          >
            <Ghost.Combobox.Input
              placeholder="Assignee…"
              className="h-7 w-[90px] px-2 rounded-lg text-[11.5px] text-[#5a5a72] bg-transparent border border-transparent hover:border-white/[0.08] hover:bg-white/[0.04] focus:border-[#5c5ef0]/[0.3] focus:bg-white/[0.04] outline-none transition-all placeholder:text-[#2e2e42]"
            />
            <Ghost.Combobox.List
              style={{
                background: '#0e0e18',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                padding: '4px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}
            >
              {filteredAssignees.length === 0
                ? <Ghost.Combobox.Empty style={{ padding: '8px 10px', fontSize: 11.5, color: '#3a3a52' }} />
                : filteredAssignees.map(a => (
                  <Ghost.Combobox.Option
                    key={a.id}
                    id={a.id}
                    value={a.name}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-white/[0.05] transition-colors"
                  >
                    <div className={`h-4 w-4 rounded-full ${a.bg} border border-white/[0.07] flex items-center justify-center text-[7px] font-bold ${a.text} flex-none`}>{a.initials}</div>
                    <span className="text-[12px] text-[#a8a8c2]">{a.name}</span>
                  </Ghost.Combobox.Option>
                ))
              }
            </Ghost.Combobox.List>
          </Ghost.Combobox>
          <div className="w-px h-4 bg-white/[0.06] mx-1" />
          <button className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-[11.5px] font-semibold text-[#8b8df8] bg-[#5c5ef0]/[0.12] hover:bg-[#5c5ef0]/[0.18] border border-[#5c5ef0]/[0.2] transition-colors cursor-pointer">
            <IcPlus />
            <span>New Issue</span>
          </button>
        </div>
      </div>

      {/* Ghost.Tab status filter strip */}
      <Ghost.Tab
        zone="orbit.status-tabs"
        activeTab={filterStatus}
        onTabChange={(id) => setFilterStatus(id as Status | 'all')}
      >
        <Ghost.Tab.List className="flex items-center gap-0.5 px-4 h-9 border-b border-white/[0.04] flex-none">
          {(['all', 'todo', 'in-progress', 'in-review', 'done'] as const).map((value) => {
            const label = value === 'all' ? 'All' : value === 'in-progress' ? 'In Progress' : value === 'in-review' ? 'In Review' : value.charAt(0).toUpperCase() + value.slice(1);
            const isActive = filterStatus === value;
            return (
              <Ghost.Tab.Item
                key={value}
                id={value}
                className={[
                  'flex items-center gap-1.5 h-6 px-2.5 rounded-lg text-[11.5px] font-medium transition-colors cursor-pointer border-0 outline-none',
                  isActive
                    ? 'bg-[#5c5ef0]/[0.14] text-[#a5a7ff]'
                    : 'text-[#5a5a72] hover:text-[#b8b8cc] hover:bg-white/[0.04]',
                ].join(' ')}
              >
                {label}
                <span className={['text-[10px] tabular-nums font-mono transition-colors', isActive ? 'text-[#8b8df8]/70' : 'text-[#2e2e42]'].join(' ')}>
                  {countFor(value)}
                </span>
              </Ghost.Tab.Item>
            );
          })}
        </Ghost.Tab.List>
      </Ghost.Tab>

      {/* Issue rows */}
      <div className="flex-1 overflow-y-auto">
        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-[#2e2e42]">
            <div className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
              <IcLayers />
            </div>
            <p className="text-[12px] text-[#5a5a72]">No issues match this filter</p>
          </div>
        ) : (
          issues.map(issue => {
            const sm = STATUS_CFG[issue.status];
            const pm = PRIORITY_CFG[issue.priority];
            const av = AVATAR_CFG[issue.initials] ?? { bg: 'bg-white/10', text: 'text-white' };
            const isSelected = selected?.id === issue.id;

            return (
              <IssueRow
                key={issue.id}
                issue={issue}
                isSelected={isSelected}
                sm={sm}
                pm={pm}
                av={av}
                onSelect={onSelect}
                toast={toast}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

function IssueRow({ issue, isSelected, sm, pm, av, onSelect, toast }: {
  issue: Issue;
  isSelected: boolean;
  sm: { label: string; color: string; Icon: () => ReactNode };
  pm: { label: string; bar: string; dot: string };
  av: { bg: string; text: string };
  onSelect: (i: Issue) => void;
  toast: ReturnType<typeof useGhostToast>['toast'];
}) {
  return (
    <Ghost.ContextMenu zone="orbit.row-ctx">
      <Ghost.ContextMenu.Trigger>
        <div
          className={[
            'relative w-full flex items-center gap-3 px-4 h-9 border-b text-left transition-all group',
            isSelected
              ? 'bg-[#5c5ef0]/[0.08] border-white/[0.06]'
              : 'border-white/[0.035] hover:bg-white/[0.025]',
          ].join(' ')}
        >
          <span className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-r ${pm.bar}`} />
          <button
            onClick={() => onSelect(issue)}
            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer bg-transparent border-0 outline-none text-left h-full"
          >
            <span style={{ color: sm.color }} className="flex-none shrink-0"><sm.Icon /></span>
            <span className="text-[10px] text-[#3a3a52] font-mono w-[56px] flex-none tabular-nums shrink-0 tracking-tight">{issue.id}</span>
            <span className={[
              'text-[12.5px] flex-1 truncate leading-none transition-colors',
              isSelected ? 'text-[#e6e6f0]' : 'text-[#a8a8c2] group-hover:text-[#d0d0e4]',
            ].join(' ')}>{issue.title}</span>
          </button>
          <div className="flex items-center gap-2 flex-none">
            {issue.labels.slice(0, 1).map(l => (
              <span key={l} className={lc(l)}>{l}</span>
            ))}
            <div className={`h-[18px] w-[18px] rounded-full ${av.bg} border border-white/[0.07] flex items-center justify-center text-[7.5px] font-bold ${av.text} flex-none`}>
              {issue.initials}
            </div>
            <span className="text-[10px] text-[#2e2e42] w-9 text-right tabular-nums font-mono">{issue.updatedAt}</span>
            <IssueRowMenu issue={issue} />
          </div>
        </div>
      </Ghost.ContextMenu.Trigger>
      <Ghost.ContextMenu.Content className="min-w-[180px] rounded-xl border border-white/[0.08] bg-[#0e0e18]/95 backdrop-blur-md shadow-2xl shadow-black/60 py-1 overflow-hidden">
        <Ghost.ContextMenu.Item
          id="ctx-open"
          onClick={() => toast({ zone: 'orbit.row-ctx', variant: 'info', message: `Opening ${issue.id}` })}
          className="px-3 py-2 text-[12px] text-[#c8c8dc] hover:bg-white/[0.06] transition-colors outline-none"
        >
          Open issue
        </Ghost.ContextMenu.Item>
        <Ghost.ContextMenu.Item
          id="ctx-copy-id"
          onClick={() => toast({ zone: 'orbit.row-ctx', variant: 'success', message: `Copied ${issue.id} to clipboard` })}
          className="px-3 py-2 text-[12px] text-[#c8c8dc] hover:bg-white/[0.06] transition-colors outline-none"
        >
          Copy issue ID
        </Ghost.ContextMenu.Item>
        <Ghost.ContextMenu.Item
          id="ctx-assign"
          onClick={() => toast({ zone: 'orbit.row-ctx', variant: 'success', message: `${issue.id} assigned to you` })}
          className="px-3 py-2 text-[12px] text-[#c8c8dc] hover:bg-white/[0.06] transition-colors outline-none"
        >
          Assign to me
        </Ghost.ContextMenu.Item>
        <Ghost.ContextMenu.Item
          id="ctx-status"
          onClick={() => toast({ zone: 'orbit.row-ctx', variant: 'info', message: `Change status for ${issue.id}` })}
          className="px-3 py-2 text-[12px] text-[#c8c8dc] hover:bg-white/[0.06] transition-colors outline-none"
        >
          Change status
        </Ghost.ContextMenu.Item>
        <Ghost.ContextMenu.Separator className="border-white/[0.06]" />
        <Ghost.ContextMenu.Item
          id="ctx-delete"
          destructive
          onClick={() => toast({ zone: 'orbit.row-ctx', variant: 'error', message: `${issue.id} deleted` })}
          className="px-3 py-2 text-[12px] hover:bg-red-950/40 transition-colors outline-none"
        >
          Delete issue
        </Ghost.ContextMenu.Item>
      </Ghost.ContextMenu.Content>
    </Ghost.ContextMenu>
  );
}

function IssueRowMenu({ issue }: { issue: Issue }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <GhostMenu zone="orbit.actions">
        <GhostMenu.Trigger>
          <button
            className={[
              'h-5 w-5 flex items-center justify-center rounded text-[#2e2e42] hover:text-[#8b8df8] hover:bg-[#5c5ef0]/[0.12] transition-all cursor-pointer border-0 outline-none',
              hovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
            ].join(' ')}
            aria-label={`Actions for ${issue.id}`}
          >
            <IcDots />
          </button>
        </GhostMenu.Trigger>
        <GhostMenu.Content placement="bottom-end">
          {ISSUE_ACTIONS.map(action => (
            <GhostMenu.Item
              key={action.id}
              id={action.id}
              icon={<action.Icon />}
            >
              {action.label}
            </GhostMenu.Item>
          ))}
          <GhostMenu.Separator />
          <GhostMenu.Item id="act-delete" variant="danger" icon={<IcXCircle />}>
            Delete issue
          </GhostMenu.Item>
        </GhostMenu.Content>
      </GhostMenu>
    </div>
  );
}

function DetailPanel({ issue, onClose }: {
  issue: Issue;
  onClose: () => void;
}) {
  const { toast } = useGhostToast();
  const [usedActions, setUsedActions] = useState<Set<string>>(new Set());
  const [comment, setComment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Status>(issue.status);
  const [selectedPriority, setSelectedPriority] = useState<Priority>(issue.priority);
  const sm = STATUS_CFG[selectedStatus];
  const pm = PRIORITY_CFG[selectedPriority];
  const av = AVATAR_CFG[issue.initials] ?? { bg: 'bg-white/10', text: 'text-white' };

  return (
    <div
      className="w-[390px] flex-none flex flex-col border-l border-white/[0.05] overflow-hidden"
      style={{ background: '#07070d', animation: 'slide-in-right 0.2s ease-out' }}
    >
      {/* Panel header */}
      <div className="flex items-center h-12 px-4 border-b border-white/[0.05] gap-2 flex-none">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="text-[10px] font-mono text-[#3a3a52] tracking-tight">{issue.id}</span>
          <span className="text-[10px] text-[#2e2e42]">·</span>
          <span className="text-[10px] text-[#3a3a52]">{issue.cycle}</span>
          <span className="text-[10px] text-[#2e2e42]">·</span>
          <span className="text-[10px] text-[#2e2e42]">{issue.project}</span>
        </div>
        <div className="flex items-center gap-0.5 flex-none">
          {([IcLink, IcMaximize] as Array<() => ReactNode>).map((Icon, i) => (
            <button key={i} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-white/[0.05] text-[#2e2e42] hover:text-[#5a5a72] transition-colors cursor-pointer">
              <Icon />
            </button>
          ))}
          <button onClick={onClose} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-[#2e2e42] hover:text-[#9898b2] transition-colors cursor-pointer ml-0.5">
            <IcX />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 pt-5 pb-4 flex flex-col gap-5">

          {/* Breadcrumb */}
          <GhostBreadcrumb zone="orbit.breadcrumb" className="mb-2">
            <GhostBreadcrumbItem id="bc-project" zone="orbit.breadcrumb" href="#">{issue.project}</GhostBreadcrumbItem>
            <GhostBreadcrumbItem id="bc-cycle"   zone="orbit.breadcrumb" href="#">{issue.cycle}</GhostBreadcrumbItem>
            <GhostBreadcrumbItem id="bc-issue"   zone="orbit.breadcrumb" current>{issue.id}</GhostBreadcrumbItem>
          </GhostBreadcrumb>

          {/* Title */}
          <h2 className="text-[15px] font-semibold text-[#e6e6f0] leading-[1.4] tracking-[-0.015em]">
            {issue.title}
          </h2>

          {/* Ghost Actions */}
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/[0.05]">
              <span className="text-[10.5px] font-semibold text-[#5a5a72] uppercase tracking-[0.08em]">Quick Actions</span>
              <div className="flex items-center gap-1.5 px-2 py-[3px] rounded-full bg-[#5c5ef0]/[0.1] border border-[#5c5ef0]/[0.22]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8b8df8] animate-[pulse-dot_2s_ease-in-out_infinite]" />
                <span className="text-[9px] text-[#8b8df8] font-bold tracking-[0.08em] uppercase">Ghost AI</span>
              </div>
            </div>
            <div className="p-3">
              <Ghost.Slot zone="orbit.actions" className="flex flex-wrap gap-1.5">
                {ISSUE_ACTIONS.map(action => {
                  const Icon = action.Icon;
                  const done = usedActions.has(action.id);
                  return (
                    <Ghost.Button
                      key={action.id}
                      id={action.id}
                      zone="orbit.actions"
                      onClick={() => setUsedActions(p => new Set([...p, action.id]))}
                      className={[
                        'flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-[11.5px] font-medium border transition-all cursor-pointer outline-none',
                        done
                          ? 'bg-[#22c55e]/[0.08] border-[#22c55e]/[0.22] text-[#4ade80]'
                          : `bg-white/[0.03] border-white/[0.07] text-[#5a5a72] ${action.hover}`,
                      ].join(' ')}
                    >
                      <Icon />
                      {action.label}
                    </Ghost.Button>
                  );
                })}
              </Ghost.Slot>
            </div>
          </div>

          {/* Metadata grid — Ghost.Grid promotes most-viewed fields to the primary area */}
          <Ghost.Grid
            zone="orbit.metadata"
            gridTemplateAreas='"primary secondary" "primary tertiary"'
            gridTemplateColumns="1fr 1fr"
            gap="0.375rem"
          >
            <Ghost.Item id="meta-status" zone="orbit.metadata" className="bg-white/[0.02] border border-white/[0.05] rounded-lg px-3 py-2.5">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.09em] text-[#2e2e42] mb-1.5">Status</p>
              <Ghost.Select
                zone="orbit.select-status"
                value={selectedStatus}
                onValueChange={(id) => setSelectedStatus(id as Status)}
                className="w-full"
              >
                <Ghost.Select.Trigger className="h-6 px-2 rounded-md text-[11.5px] bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.12] hover:bg-white/[0.05] transition-colors" style={{ color: sm.color }} />
                <Ghost.Select.Content className="rounded-xl border border-white/[0.08] bg-[#0e0e18]/95 backdrop-blur-md shadow-2xl shadow-black/60 py-1 overflow-hidden">
                  {(Object.entries(STATUS_CFG) as Array<[Status, { label: string; color: string; Icon: () => ReactNode }]>).map(([key, cfg]) => (
                    <Ghost.Select.Option
                      key={key}
                      id={key}
                      value={cfg.label}
                      className="px-3 py-2 text-[12px] text-[#c8c8dc] hover:bg-white/[0.06] transition-colors"
                      style={{ color: cfg.color }}
                    >
                      {cfg.label}
                    </Ghost.Select.Option>
                  ))}
                </Ghost.Select.Content>
              </Ghost.Select>
            </Ghost.Item>
            <Ghost.Item id="meta-priority" zone="orbit.metadata" className="bg-white/[0.02] border border-white/[0.05] rounded-lg px-3 py-2.5">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.09em] text-[#2e2e42] mb-1.5">Priority</p>
              <Ghost.Select
                zone="orbit.select-priority"
                value={selectedPriority}
                onValueChange={(id) => setSelectedPriority(id as Priority)}
                className="w-full"
              >
                <Ghost.Select.Trigger className="h-6 px-2 rounded-md text-[11.5px] bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.12] hover:bg-white/[0.05] transition-colors text-[#c8c8dc]" />
                <Ghost.Select.Content className="rounded-xl border border-white/[0.08] bg-[#0e0e18]/95 backdrop-blur-md shadow-2xl shadow-black/60 py-1 overflow-hidden">
                  {(Object.entries(PRIORITY_CFG) as Array<[Priority, { label: string; bar: string; dot: string }]>).map(([key, cfg]) => (
                    <Ghost.Select.Option
                      key={key}
                      id={key}
                      value={cfg.label}
                      className="px-3 py-2 text-[12px] text-[#c8c8dc] hover:bg-white/[0.06] transition-colors"
                    >
                      {cfg.label}
                    </Ghost.Select.Option>
                  ))}
                </Ghost.Select.Content>
              </Ghost.Select>
            </Ghost.Item>
            <Ghost.Item id="meta-assignee" zone="orbit.metadata" className="bg-white/[0.02] border border-white/[0.05] rounded-lg px-3 py-2.5">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.09em] text-[#2e2e42] mb-1.5">Assignee</p>
              <span className="flex items-center gap-1.5">
                <div className={`h-[18px] w-[18px] rounded-full ${av.bg} border border-white/[0.07] flex items-center justify-center text-[7.5px] font-bold ${av.text} flex-none`}>{issue.initials}</div>
                <span className="text-[12px] text-[#c8c8dc] truncate">{issue.assignee}</span>
              </span>
            </Ghost.Item>
          </Ghost.Grid>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { label: 'Project', value: <span className="text-[12px] text-[#c8c8dc]">{issue.project}</span> },
              { label: 'Cycle',   value: <span className="text-[12px] text-[#c8c8dc]">{issue.cycle}</span> },
              { label: 'Updated', value: <span className="text-[12px] text-[#5a5a72]">{issue.updatedAt} ago</span> },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/[0.02] border border-white/[0.05] rounded-lg px-3 py-2.5">
                <p className="text-[9.5px] font-bold uppercase tracking-[0.09em] text-[#2e2e42] mb-1.5">{label}</p>
                {value}
              </div>
            ))}
          </div>

          {/* Labels */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.09em] text-[#2e2e42] mb-2">Labels</p>
            <div className="flex flex-wrap gap-1.5">
              {issue.labels.map(l => (
                <span key={l} className={lc(l)}>{l}</span>
              ))}
            </div>
          </div>

          {/* Accordion: Description, Activity, Relations */}
          <Ghost.Accordion zone="orbit.detail-accordion" multiple className="flex flex-col gap-px">
            <Ghost.Accordion.Item id="acc-description" zone="orbit.detail-accordion" className="rounded-lg border border-white/[0.05] bg-white/[0.02] overflow-hidden">
              <Ghost.Accordion.Trigger className="px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-[0.09em] text-[#5a5a72] hover:text-[#9898b2] transition-colors">
                Description
              </Ghost.Accordion.Trigger>
              <Ghost.Accordion.Content className="px-3.5 pb-3">
                <p className="text-[12px] text-[#9191a8] leading-relaxed">{issue.description}</p>
              </Ghost.Accordion.Content>
            </Ghost.Accordion.Item>
            <Ghost.Accordion.Item id="acc-activity" zone="orbit.detail-accordion" className="rounded-lg border border-white/[0.05] bg-white/[0.02] overflow-hidden">
              <Ghost.Accordion.Trigger className="px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-[0.09em] text-[#5a5a72] hover:text-[#9898b2] transition-colors">
                Activity
              </Ghost.Accordion.Trigger>
              <Ghost.Accordion.Content className="px-3.5 pb-3">
                <div className="flex flex-col gap-0">
                  {[
                    { initials: 'MC', ...AVATAR_CFG.MC, name: 'Maya Chen',   action: 'moved to',     detail: 'In Progress', time: '3m ago' },
                    { initials: 'AT', ...AVATAR_CFG.AT, name: 'Alex Torres', action: 'set priority',  detail: 'Urgent',      time: '1h ago' },
                    { initials: 'SR', ...AVATAR_CFG.SR, name: 'Sam Rivera',  action: 'opened issue',  detail: '',            time: '2d ago' },
                  ].map((ev, i, arr) => (
                    <div key={i} className="relative flex items-start gap-3 pb-4">
                      {i < arr.length - 1 && (
                        <span className="absolute left-[13px] top-5 bottom-0 w-px bg-white/[0.05]" />
                      )}
                      <div className={`h-[26px] w-[26px] rounded-full ${ev.bg} border border-white/[0.07] flex items-center justify-center text-[8px] font-bold ${ev.text} flex-none shrink-0 z-10`}>{ev.initials}</div>
                      <div className="pt-0.5">
                        <p className="text-[12px] leading-snug">
                          <span className="font-semibold text-[#c8c8dc]">{ev.name}</span>
                          {' '}
                          <span className="text-[#5a5a72]">{ev.action}</span>
                          {ev.detail && <> <span className="text-[#9898b2] font-medium">{ev.detail}</span></>}
                        </p>
                        <p className="text-[10px] text-[#2e2e42] mt-0.5 font-mono">{ev.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Ghost.Accordion.Content>
            </Ghost.Accordion.Item>
            <Ghost.Accordion.Item id="acc-relations" zone="orbit.detail-accordion" className="rounded-lg border border-white/[0.05] bg-white/[0.02] overflow-hidden">
              <Ghost.Accordion.Trigger className="px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-[0.09em] text-[#5a5a72] hover:text-[#9898b2] transition-colors">
                Relations
              </Ghost.Accordion.Trigger>
              <Ghost.Accordion.Content className="px-3.5 pb-3">
                <p className="text-[11px] text-[#5a5a72]">No linked issues.</p>
              </Ghost.Accordion.Content>
            </Ghost.Accordion.Item>
          </Ghost.Accordion>

        </div>
      </div>

      {/* Comment footer */}
      <div className="border-t border-white/[0.05] px-4 py-3 flex-none">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-full bg-violet-950 border border-violet-800/40 flex items-center justify-center text-[8.5px] font-bold text-violet-300 flex-none shrink-0" style={{ minWidth: '28px' }}>MC</div>
          <div className="flex-1 flex items-center bg-white/[0.04] border border-white/[0.07] rounded-xl overflow-hidden focus-within:border-[#5c5ef0]/[0.4] transition-colors">
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add a comment…"
              className="flex-1 h-8 px-3 text-[12.5px] text-[#e6e6f0] placeholder:text-[#2e2e42] bg-transparent outline-none"
            />
            {comment && (
              <button
                onClick={() => { toast({ zone: 'orbit.actions', variant: 'success', message: 'Comment added' }); setComment(''); }}
                className="h-8 w-8 flex-none flex items-center justify-center text-[#8b8df8] hover:text-[#b0b2ff] transition-colors cursor-pointer"
              >
                <IcSend />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyDetail() {
  return (
    <div className="w-[390px] flex-none flex flex-col items-center justify-center gap-3 border-l border-white/[0.05]" style={{ background: '#07070d' }}>
      <div className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
        <IcLayers />
      </div>
      <div className="text-center">
        <p className="text-[13px] font-semibold text-[#5a5a72]">Select an issue</p>
        <p className="text-[11.5px] text-[#2e2e42] mt-0.5">Click any row to view details</p>
      </div>
    </div>
  );
}

function PriorityDot({ priority }: { priority: Priority }) {
  const cfg = PRIORITY_CFG[priority];
  if (priority === 'urgent') {
    return (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className={cfg.dot}>
        <path d="M6.5 1.5v6M6.5 10v1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    );
  }
  if (priority === 'high') {
    return (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className={cfg.dot}>
        <path d="M2 9.5l4.5-5 4.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (priority === 'medium') {
    return (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className={cfg.dot}>
        <path d="M2.5 5h8M2.5 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }
  return <span className={`h-2 w-2 rounded-full ${cfg.bar} inline-block`} />;
}

/* Status icons */
function StTodo() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2.5 2"/></svg>;
}
function StProgress() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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
      <circle cx="7" cy="7" r="5.5" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4.5 7l1.8 1.8L9.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function StCancelled() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 1.5"/>
      <path d="M5 5l4 4M9 5l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

/* Nav icons */
function OrbitIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <ellipse cx="7" cy="7" rx="5.5" ry="3" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" transform="rotate(-35 7 7)"/>
      <circle cx="7" cy="7" r="1.8" fill="rgba(255,255,255,0.95)"/>
    </svg>
  );
}
function IcInbox()   { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1.5 9h2.5l1.5 2h3l1.5-2H13" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>; }
function IcPerson()  { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 13c0-2.76 2.24-4 5-4s5 1.24 5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>; }
function IcLayers()  { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 4.5l5-3 5 3-5 3-5-3zM2 7.5l5 3 5-3M2 10.5l5 3 5-3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>; }
function IcCycle()   { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M12 7a5 5 0 1 1-1.5-3.54" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M10.5 1v3.5H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function IcRoadmap() { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M1 3.5h4l2 2h6M3 7h5l2 2h3M1 10.5h3l2-2h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function IcBacklog() { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" strokeDasharray="3 2"/></svg>; }
function IcSearch()  { return <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.4"/><path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>; }
function IcFilter()  { return <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M4 7h6M6 10.5h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>; }
function IcSort()    { return <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h7M2 7h5M2 10.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M11 2v10M11 12l1.5-1.5M11 12l-1.5-1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function IcDisplay() { return <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2.5" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 6.5h4M5 8.5h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>; }
function IcPlus()    { return <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>; }
function IcCheck()   { return <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function IcComment() { return <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="11" height="8" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M4 12l2-2.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function IcPerson2() { return <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 12c0-2.76 2.24-4 5-4s5 1.24 5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>; }
function IcTag()     { return <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 2h5l5 5-5 5-5-5V2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><circle cx="4.5" cy="4.5" r="1" fill="currentColor"/></svg>; }
function IcArchive() { return <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="11" height="3" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M2.5 4.5v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-7" stroke="currentColor" strokeWidth="1.3"/><path d="M5.5 7.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>; }
function IcXCircle() { return <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 5l4 4M9 5l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>; }
function IcLink()    { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M5.5 8.5a3 3 0 0 0 4.24 0l2-2a3 3 0 0 0-4.24-4.24l-1 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M8.5 5.5a3 3 0 0 0-4.24 0l-2 2a3 3 0 0 0 4.24 4.24l1-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>; }
function IcMaximize(){ return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2.5 9v2.5H5M9 2.5h2.5V5M2.5 5V2.5H5M9 11.5h2.5V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function IcX()       { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>; }
function IcDots()    { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="3" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="11" cy="7" r="1" fill="currentColor"/></svg>; }
function IcChevronRight() { return <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3.5 2.5L6 5l-2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function IcSend()    { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M12 7L2 2l2.5 5L2 12l10-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>; }

const ORBIT_SIM_EVENTS: Array<{ id: string; zone: string; count: number }> = [
  { id: 'act-resolve', zone: 'orbit.actions',          count: 32 },
  { id: 'act-comment', zone: 'orbit.actions',          count: 18 },
  { id: 'act-assign',  zone: 'orbit.actions',          count: 10 },
  { id: 'act-label',   zone: 'orbit.actions',          count:  4 },
  { id: 'act-archive', zone: 'orbit.actions',          count:  2 },
  { id: 'nav-all',     zone: 'orbit.nav',              count: 30 },
  { id: 'nav-inbox',   zone: 'orbit.nav',              count: 20 },
  { id: 'nav-cycles',  zone: 'orbit.nav',              count: 15 },
  { id: 'nav-my',      zone: 'orbit.nav',              count:  8 },
  { id: 'act-resolve', zone: 'orbit.cmd',              count: 20 },
  { id: 'act-comment', zone: 'orbit.cmd',              count: 15 },
  { id: 'nav-all',     zone: 'orbit.cmd',              count: 10 },
  { id: 'ctx-open',    zone: 'orbit.row-ctx',          count: 18 },
  { id: 'ctx-assign',  zone: 'orbit.row-ctx',          count: 12 },
  { id: 'ctx-copy-id', zone: 'orbit.row-ctx',          count:  8 },
  { id: 'ctx-status',  zone: 'orbit.row-ctx',          count:  6 },
  { id: 'ctx-delete',  zone: 'orbit.row-ctx',          count:  2 },
  { id: 'in-progress', zone: 'orbit.select-status',    count: 22 },
  { id: 'done',        zone: 'orbit.select-status',    count: 18 },
  { id: 'todo',        zone: 'orbit.select-status',    count: 10 },
  { id: 'high',        zone: 'orbit.select-priority',  count: 20 },
  { id: 'urgent',      zone: 'orbit.select-priority',  count: 15 },
  { id: 'medium',      zone: 'orbit.select-priority',  count: 10 },
  { id: 'tb-filter',   zone: 'orbit.toolbar',          count: 25 },
  { id: 'tb-sort',     zone: 'orbit.toolbar',          count: 18 },
  { id: 'tb-group',    zone: 'orbit.toolbar',          count:  8 },
  { id: 'tb-display',  zone: 'orbit.toolbar',          count:  4 },
  { id: 'acc-description', zone: 'orbit.detail-accordion', count: 30 },
  { id: 'acc-activity',    zone: 'orbit.detail-accordion', count: 15 },
  { id: 'acc-relations',   zone: 'orbit.detail-accordion', count:  5 },
  { id: 'bc-cycle',    zone: 'orbit.breadcrumb',       count: 20 },
  { id: 'bc-project',  zone: 'orbit.breadcrumb',       count: 12 },
];

const TOAST_DEMOS = [
  { zone: 'orbit.actions', variant: 'success' as const, message: 'ORB-004 resolved by Maya Chen', action: { label: 'View', onClick: () => {} } },
  { zone: 'orbit.nav',     variant: 'info' as const,    message: '3 new issues added to Sprint 14' },
  { zone: 'orbit.actions', variant: 'warning' as const, message: 'Merge conflict on ORB-006 branch', action: { label: 'Resolve', onClick: () => {} } },
  { zone: 'orbit.nav',     variant: 'error' as const,   message: 'CI failed on Platform — 2 tests broke' },
];

function GhostDemoBar() {
  const engine = useGhostEngine();
  const { toast } = useGhostToast();
  const [eventCount, setEventCount] = useState(() => engine.events().length);
  const [simulated, setSimulated] = useState(false);
  const toastIdx = useRef(0);

  useEffect(() => engine.subscribe(() => setEventCount(engine.events().length)), [engine]);

  function handleSimulate() {
    const now = Date.now();
    const DAY = 86_400_000;
    const events: GhostEvent[] = ORBIT_SIM_EVENTS.flatMap(({ id, zone, count }) =>
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

  function handleToast() {
    const demo = TOAST_DEMOS[toastIdx.current % TOAST_DEMOS.length]!;
    toastIdx.current += 1;
    toast(demo);
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex flex-col gap-2.5 rounded-xl border border-white/[0.08] bg-[#060609]/90 backdrop-blur-md p-3.5 w-60 shadow-2xl shadow-black/60">
      <div className="flex items-center justify-between">
        <span className="font-bold text-[#8b8df8] tracking-widest uppercase text-[9px]">Ghost Engine</span>
        <span className="rounded-full bg-[#5c5ef0]/20 text-[#8b8df8] px-2 py-0.5 text-[10px] font-mono tabular-nums">{eventCount} events</span>
      </div>
      <p className="text-[10px] text-[#4a5568] leading-relaxed">Inject 4 weeks of realistic usage — watch Ghost UI reorder actions by learned click frequency.</p>
      <button
        onClick={handleSimulate}
        disabled={simulated}
        className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${simulated ? 'bg-[#5c5ef0]/15 text-[#8b8df8] cursor-default' : 'bg-[#5c5ef0] text-white hover:bg-[#4e50e0] active:scale-[0.97]'}`}
      >
        {simulated ? '✓ Simulated' : '⚡ Simulate 4-week usage'}
      </button>
      <button
        onClick={handleToast}
        className="rounded-lg px-3 py-1.5 text-[11px] font-medium text-[#8b8df8] bg-[#5c5ef0]/[0.08] hover:bg-[#5c5ef0]/[0.14] border border-[#5c5ef0]/[0.18] transition-all"
      >
        🔔 Fire a Ghost toast
      </button>
      <button
        onClick={handleReset}
        className="rounded-lg px-3 py-1.5 text-[11px] font-medium text-[#4a5568] hover:text-[#8892a4] hover:bg-white/[0.04] transition-all"
      >
        ↺ Reset all scores
      </button>
    </div>
  );
}
