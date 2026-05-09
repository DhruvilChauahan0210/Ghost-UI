import { useState, useMemo } from 'react';
import { GhostProvider, Ghost } from '@ghost-ui/react';
import { GhostDevtools } from '@ghost-ui/devtools';
import { localStorageAdapter } from '@ghost-ui/core';

type Status = 'todo' | 'in-progress' | 'in-review' | 'done' | 'cancelled';
type Priority = 'urgent' | 'high' | 'medium' | 'low' | 'none';

interface Issue {
  id: string;
  number: number;
  title: string;
  status: Status;
  priority: Priority;
  assignee: string;
  assigneeInitials: string;
  labels: string[];
  project: string;
  updatedAt: string;
  description: string;
}

const ISSUES: Issue[] = [
  { id: 'ORB-001', number: 1, title: 'Integrate GhostProvider into dashboard nav', status: 'in-progress', priority: 'urgent', assignee: 'Maya Chen', assigneeInitials: 'MC', labels: ['Ghost UI', 'Feature'], project: 'Platform', updatedAt: '2m ago', description: 'Wrap the top navigation with GhostProvider so action buttons self-optimize. The resolver, comment, and archive buttons should reorder based on how frequently engineers use them throughout the day.' },
  { id: 'ORB-002', number: 2, title: 'Fix memory leak in event stream subscription', status: 'in-review', priority: 'high', assignee: 'Sam Rivera', assigneeInitials: 'SR', labels: ['Bug', 'Performance'], project: 'Platform', updatedAt: '14m ago', description: 'The ghost engine event listener is not being cleaned up when components unmount. This causes a steady memory growth in long-running sessions.' },
  { id: 'ORB-003', number: 3, title: 'Design new onboarding flow for workspace setup', status: 'todo', priority: 'medium', assignee: 'Priya Nair', assigneeInitials: 'PN', labels: ['Design', 'Onboarding'], project: 'Growth', updatedAt: '1h ago', description: 'Current onboarding has a 42% drop-off at the "invite team" step. Redesign to defer invites until after the user has experienced value.' },
  { id: 'ORB-004', number: 4, title: 'Add keyboard shortcut overlay (⌘K)', status: 'in-progress', priority: 'medium', assignee: 'Maya Chen', assigneeInitials: 'MC', labels: ['Feature', 'UX'], project: 'Platform', updatedAt: '2h ago', description: 'Implement a command palette accessible via ⌘K. Ghost UI should learn which commands get used most and surface them at the top.' },
  { id: 'ORB-005', number: 5, title: 'Export issues to CSV and Linear format', status: 'todo', priority: 'low', assignee: 'Alex Torres', assigneeInitials: 'AT', labels: ['Feature'], project: 'Platform', updatedAt: '3h ago', description: 'Users need to export their issue backlog to share with external stakeholders. Support CSV and Linear JSON format.' },
  { id: 'ORB-006', number: 6, title: 'Cycle planning view — drag to reorder', status: 'todo', priority: 'high', assignee: 'Sam Rivera', assigneeInitials: 'SR', labels: ['Feature', 'Cycles'], project: 'Platform', updatedAt: '5h ago', description: 'Allow drag-and-drop reordering within a cycle. Consider whether Ghost UI scoring should influence the default order.' },
  { id: 'ORB-007', number: 7, title: 'Dark mode polish pass — sidebar contrast', status: 'done', priority: 'low', assignee: 'Priya Nair', assigneeInitials: 'PN', labels: ['Design'], project: 'Growth', updatedAt: '1d ago', description: 'Sidebar text contrast failed WCAG AA at muted opacity. Bumped --color-muted to pass at 4.6:1.' },
  { id: 'ORB-008', number: 8, title: 'Ghost UI: tune scoring decay for idle sessions', status: 'in-progress', priority: 'urgent', assignee: 'Alex Torres', assigneeInitials: 'AT', labels: ['Ghost UI', 'Research'], project: 'Platform', updatedAt: '1d ago', description: 'After 4 hours of inactivity the score decay is too aggressive, causing buttons to reset to default order. We need a softer decay curve for sessions spanning multiple days.' },
  { id: 'ORB-009', number: 9, title: 'Roadmap: swimlane grouping by assignee', status: 'todo', priority: 'medium', assignee: 'Maya Chen', assigneeInitials: 'MC', labels: ['Roadmap', 'Feature'], project: 'Growth', updatedAt: '2d ago', description: 'Add a toggle to group roadmap items by assignee as swimlanes. Default remains grouping by project.' },
  { id: 'ORB-010', number: 10, title: 'API rate limiting — 429 handling', status: 'done', priority: 'high', assignee: 'Sam Rivera', assigneeInitials: 'SR', labels: ['Bug', 'API'], project: 'Platform', updatedAt: '3d ago', description: 'Unhandled 429 responses were crashing the event sync. Added exponential backoff with jitter.' },
  { id: 'ORB-011', number: 11, title: 'Mobile: swipe gesture to change issue status', status: 'todo', priority: 'low', assignee: 'Priya Nair', assigneeInitials: 'PN', labels: ['Mobile', 'UX'], project: 'Growth', updatedAt: '4d ago', description: 'On mobile, swipe left on an issue row to reveal quick actions (resolve, archive). Swipe right to mark done.' },
  { id: 'ORB-012', number: 12, title: 'Devtools: show Ghost score timeline chart', status: 'in-progress', priority: 'medium', assignee: 'Alex Torres', assigneeInitials: 'AT', labels: ['Ghost UI', 'Devtools'], project: 'Platform', updatedAt: '5d ago', description: 'Add a sparkline chart inside GhostDevtools showing score evolution for each node over the last 50 interactions.' },
];

const NAV_ITEMS = [
  { id: 'nav-inbox',    label: 'Inbox',     icon: InboxIcon,   count: 4 },
  { id: 'nav-issues',  label: 'My Issues', icon: LayersIcon,  count: null },
  { id: 'nav-all',     label: 'All Issues',icon: ListIcon,    count: null },
  { id: 'nav-cycles',  label: 'Cycles',    icon: CycleIcon,   count: null },
  { id: 'nav-roadmap', label: 'Roadmap',   icon: RoadmapIcon, count: null },
  { id: 'nav-backlog', label: 'Backlog',   icon: BacklogIcon, count: null },
];

const ISSUE_ACTIONS = [
  { id: 'act-resolve',  label: 'Resolve',  icon: '✓', color: 'text-green-400' },
  { id: 'act-comment',  label: 'Comment',  icon: '◯', color: 'text-[#7d8590]' },
  { id: 'act-assign',   label: 'Assign',   icon: '◈', color: 'text-[#58a6ff]' },
  { id: 'act-label',    label: 'Label',    icon: '⬡', color: 'text-[#d29922]' },
  { id: 'act-archive',  label: 'Archive',  icon: '⊟', color: 'text-[#7d8590]' },
  { id: 'act-close',    label: 'Close',    icon: '✕', color: 'text-[#f85149]' },
];

const STATUS_META: Record<Status, { label: string; color: string; dot: string }> = {
  'todo':        { label: 'Todo',        color: 'text-[#7d8590]',  dot: 'bg-[#484f58]' },
  'in-progress': { label: 'In Progress', color: 'text-[#58a6ff]',  dot: 'bg-[#1f6feb]' },
  'in-review':   { label: 'In Review',   color: 'text-[#d29922]',  dot: 'bg-[#9e6a03]' },
  'done':        { label: 'Done',        color: 'text-[#3fb950]',  dot: 'bg-[#238636]' },
  'cancelled':   { label: 'Cancelled',   color: 'text-[#7d8590]',  dot: 'bg-[#484f58] opacity-50' },
};

const PRIORITY_META: Record<Priority, { label: string; icon: string; color: string }> = {
  'urgent': { label: 'Urgent', icon: '⚡', color: 'text-[#f85149]' },
  'high':   { label: 'High',   icon: '▲', color: 'text-[#d29922]' },
  'medium': { label: 'Medium', icon: '■', color: 'text-[#7d8590]' },
  'low':    { label: 'Low',    icon: '▼', color: 'text-[#484f58]' },
  'none':   { label: 'None',   icon: '○', color: 'text-[#484f58]' },
};

export function App() {
  return (
    <GhostProvider persistence={localStorageAdapter('orbit-demo-v1')}>
      <OrbitApp />
      <GhostDevtools defaultOpen={false} />
    </GhostProvider>
  );
}

function OrbitApp() {
  const [activeNav, setActiveNav] = useState('nav-all');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(ISSUES[0]);
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all');
  const [resolvedActions, setResolvedActions] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const base = activeNav === 'nav-issues'
      ? ISSUES.filter(i => i.assignee === 'Maya Chen')
      : ISSUES;
    return filterStatus === 'all' ? base : base.filter(i => i.status === filterStatus);
  }, [activeNav, filterStatus]);

  return (
    <div className="flex h-full bg-[#080b12] text-[#e6edf3] overflow-hidden">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <div className="flex flex-1 min-w-0 overflow-hidden">
        <IssueList
          issues={filtered}
          selected={selectedIssue}
          onSelect={setSelectedIssue}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
        {selectedIssue && (
          <DetailPanel
            issue={selectedIssue}
            resolvedActions={resolvedActions}
            onAction={(id) => setResolvedActions(prev => new Set([...prev, id]))}
            onClose={() => setSelectedIssue(null)}
          />
        )}
      </div>
    </div>
  );
}

function Sidebar({ activeNav, setActiveNav }: { activeNav: string; setActiveNav: (id: string) => void }) {
  return (
    <div className="w-[220px] flex-none flex flex-col border-r border-white/[0.06] bg-[#0a0e16]">
      <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-white/[0.06]">
        <div className="h-6 w-6 rounded-md bg-[conic-gradient(from_220deg_at_50%_50%,#c4b5fd,#8b5cf6,#38bdf8,#c4b5fd)] flex-none shadow-[0_0_10px_rgba(167,139,250,0.4)]" />
        <span className="text-sm font-semibold tracking-[-0.01em] text-[#e6edf3]">Orbit</span>
        <span className="ml-auto text-[10px] text-[#484f58] border border-white/[0.08] rounded px-1.5 py-0.5">Free</span>
      </div>

      <div className="px-2.5 pt-1 pb-2">
        <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/[0.04] transition-colors">
          <SearchIcon />
          <span>Search…</span>
          <span className="ml-auto text-[11px] opacity-50">⌘K</span>
        </button>
      </div>

      <div className="px-2.5 flex-1 overflow-y-auto">
        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#484f58] px-2 pt-3 pb-1.5">Workspace</div>

        <Ghost.Slot zone="orbit.nav" className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = activeNav === item.id;
            return (
              <Ghost.Button
                key={item.id}
                id={item.id}
                zone="orbit.nav"
                onClick={() => setActiveNav(item.id)}
                className={[
                  'w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] transition-colors text-left cursor-pointer border-0 outline-none',
                  active
                    ? 'bg-[#c4b5fd]/[0.12] text-[#c4b5fd]'
                    : 'text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/[0.04]',
                ].join(' ')}
              >
                <span className={`flex-none opacity-${active ? '100' : '60'}`}><Icon /></span>
                <span>{item.label}</span>
                {item.count && (
                  <span className="ml-auto text-[11px] px-1.5 py-0.5 rounded bg-[#c4b5fd]/[0.15] text-[#c4b5fd] font-medium">{item.count}</span>
                )}
              </Ghost.Button>
            );
          })}
        </Ghost.Slot>

        <div className="mt-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#484f58] px-2 pb-1.5">Projects</div>
          {['Platform', 'Growth'].map(p => (
            <button key={p} className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/[0.04] transition-colors">
              <span className="h-3 w-3 rounded-sm bg-white/20 flex-none" />
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-white/[0.06] p-3">
        <GhostBadge />
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
  const statuses: Array<{ value: Status | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'todo', label: 'Todo' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'in-review', label: 'In Review' },
    { value: 'done', label: 'Done' },
  ];

  return (
    <div className="flex-1 min-w-0 flex flex-col border-r border-white/[0.06]">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06]">
        <h1 className="text-sm font-semibold text-[#e6edf3]">All Issues</h1>
        <span className="text-[11px] text-[#484f58] bg-white/[0.06] px-1.5 py-0.5 rounded">{issues.length}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <button className="flex items-center gap-1.5 text-[12px] text-[#7d8590] hover:text-[#e6edf3] px-2 py-1 rounded hover:bg-white/[0.04] transition-colors">
            <FilterIcon /> Filter
          </button>
          <button className="flex items-center gap-1.5 text-[12px] text-[#7d8590] hover:text-[#e6edf3] px-2 py-1 rounded hover:bg-white/[0.04] transition-colors">
            <SortIcon /> Sort
          </button>
          <button className="flex items-center gap-1.5 text-[12px] text-[#7d8590] hover:text-[#e6edf3] px-2 py-1 rounded hover:bg-white/[0.04] transition-colors">
            <GroupIcon /> Group
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 px-5 py-2 border-b border-white/[0.06]">
        {statuses.map(s => (
          <button
            key={s.value}
            onClick={() => setFilterStatus(s.value)}
            className={[
              'px-2.5 py-1 rounded-md text-[12px] transition-colors',
              filterStatus === s.value
                ? 'bg-[#c4b5fd]/[0.15] text-[#c4b5fd]'
                : 'text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/[0.04]',
            ].join(' ')}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-[#484f58]">
            <LayersIcon />
            <span className="text-sm">No issues match</span>
          </div>
        ) : (
          issues.map(issue => {
            const sm = STATUS_META[issue.status];
            const pm = PRIORITY_META[issue.priority];
            const isSelected = selected?.id === issue.id;
            return (
              <button
                key={issue.id}
                onClick={() => onSelect(issue)}
                className={[
                  'w-full flex items-center gap-3 px-5 py-2.5 border-b border-white/[0.04] text-left transition-colors',
                  isSelected
                    ? 'bg-[#c4b5fd]/[0.07]'
                    : 'hover:bg-white/[0.03]',
                ].join(' ')}
              >
                <span className={`text-[13px] ${pm.color}`}>{pm.icon}</span>
                <span className={`h-2.5 w-2.5 rounded-full flex-none ${sm.dot}`} />
                <span className="text-[11px] text-[#484f58] font-mono w-[60px] flex-none">{issue.id}</span>
                <span className="text-[13px] text-[#e6edf3] flex-1 truncate">{issue.title}</span>
                <div className="flex items-center gap-2 flex-none">
                  {issue.labels.slice(0, 1).map(l => (
                    <span key={l} className="text-[10px] px-1.5 py-0.5 rounded border border-white/[0.10] text-[#7d8590]">{l}</span>
                  ))}
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#c4b5fd]/40 to-[#8b5cf6]/40 flex items-center justify-center text-[9px] text-[#c4b5fd] font-semibold">
                    {issue.assigneeInitials}
                  </div>
                  <span className="text-[11px] text-[#484f58]">{issue.updatedAt}</span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function DetailPanel({ issue, resolvedActions, onAction, onClose }: {
  issue: Issue;
  resolvedActions: Set<string>;
  onAction: (id: string) => void;
  onClose: () => void;
}) {
  const sm = STATUS_META[issue.status];
  const pm = PRIORITY_META[issue.priority];

  return (
    <div className="w-[380px] flex-none flex flex-col bg-[#0a0e16] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <span className="text-[11px] font-mono text-[#484f58]">{issue.id}</span>
        <div className="flex items-center gap-1 ml-auto">
          <button className="p-1.5 rounded hover:bg-white/[0.06] text-[#7d8590] hover:text-[#e6edf3] transition-colors">
            <MaximizeIcon />
          </button>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-white/[0.06] text-[#7d8590] hover:text-[#e6edf3] transition-colors">
            <CloseXIcon />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5">
        <h2 className="text-[15px] font-semibold text-[#e6edf3] leading-snug">{issue.title}</h2>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#484f58] mb-2">Quick Actions</div>
          <div className="text-[10px] text-[#484f58] mb-2 italic">Ghost UI learns which actions you use most — they'll float to the top.</div>
          <Ghost.Slot zone="orbit.actions" className="flex flex-wrap gap-2">
            {ISSUE_ACTIONS.map(action => {
              const done = resolvedActions.has(action.id);
              return (
                <Ghost.Button
                  key={action.id}
                  id={action.id}
                  zone="orbit.actions"
                  onClick={() => onAction(action.id)}
                  className={[
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium border transition-all cursor-pointer',
                    done
                      ? 'bg-[#238636]/20 border-[#3fb950]/30 text-[#3fb950]'
                      : 'bg-white/[0.04] border-white/[0.08] text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/[0.08] hover:border-white/[0.14]',
                  ].join(' ')}
                >
                  <span className={done ? 'text-[#3fb950]' : action.color}>{action.icon}</span>
                  {action.label}
                </Ghost.Button>
              );
            })}
          </Ghost.Slot>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Property label="Status">
            <span className={`flex items-center gap-1.5 text-[12px] ${sm.color}`}>
              <span className={`h-2 w-2 rounded-full ${sm.dot}`} />
              {sm.label}
            </span>
          </Property>
          <Property label="Priority">
            <span className={`flex items-center gap-1.5 text-[12px] ${pm.color}`}>
              {pm.icon} {pm.label}
            </span>
          </Property>
          <Property label="Assignee">
            <span className="flex items-center gap-1.5 text-[12px] text-[#e6edf3]">
              <span className="h-4 w-4 rounded-full bg-gradient-to-br from-[#c4b5fd]/40 to-[#8b5cf6]/40 flex items-center justify-center text-[8px] text-[#c4b5fd] font-semibold">{issue.assigneeInitials}</span>
              {issue.assignee}
            </span>
          </Property>
          <Property label="Project">
            <span className="text-[12px] text-[#e6edf3]">{issue.project}</span>
          </Property>
          <Property label="Updated">
            <span className="text-[12px] text-[#7d8590]">{issue.updatedAt}</span>
          </Property>
          <Property label="Labels">
            <div className="flex flex-wrap gap-1">
              {issue.labels.map(l => (
                <span key={l} className="text-[10px] px-1.5 py-0.5 rounded border border-white/[0.10] text-[#7d8590]">{l}</span>
              ))}
            </div>
          </Property>
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#484f58] mb-2">Description</div>
          <p className="text-[13px] text-[#7d8590] leading-relaxed">{issue.description}</p>
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#484f58] mb-3">Activity</div>
          <div className="flex flex-col gap-3">
            {[
              { user: 'MC', name: 'Maya Chen', action: 'changed status to In Progress', time: '2m ago' },
              { user: 'SR', name: 'Sam Rivera', action: 'left a comment', time: '1h ago' },
              { user: 'AT', name: 'Alex Torres', action: 'assigned to Maya Chen', time: '3h ago' },
            ].map((ev, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#c4b5fd]/40 to-[#8b5cf6]/40 flex items-center justify-center text-[8px] text-[#c4b5fd] font-semibold flex-none mt-0.5">{ev.user}</div>
                <div>
                  <span className="text-[12px] text-[#e6edf3] font-medium">{ev.name} </span>
                  <span className="text-[12px] text-[#7d8590]">{ev.action}</span>
                  <div className="text-[10px] text-[#484f58] mt-0.5">{ev.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#c4b5fd]/40 to-[#8b5cf6]/40 flex items-center justify-center text-[9px] text-[#c4b5fd] font-semibold flex-none">MC</div>
          <input
            placeholder="Add a comment…"
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-md px-3 py-1.5 text-[12px] text-[#e6edf3] placeholder:text-[#484f58] outline-none focus:border-[#c4b5fd]/30 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}

function Property({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-md px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#484f58] mb-1">{label}</div>
      {children}
    </div>
  );
}

function GhostBadge() {
  return (
    <div className="flex items-center gap-2 px-2 py-2 rounded-md bg-[#c4b5fd]/[0.07] border border-[#c4b5fd]/[0.14]">
      <div className="h-4 w-4 rounded flex-none bg-[conic-gradient(from_220deg_at_50%_50%,#c4b5fd,#8b5cf6,#38bdf8,#c4b5fd)]" />
      <div>
        <div className="text-[10px] font-semibold text-[#c4b5fd] leading-none mb-0.5">Ghost UI Active</div>
        <div className="text-[9px] text-[#7d8590] leading-none">Learning your workflow</div>
      </div>
      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#3fb950] animate-pulse" />
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function SortIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h8M2 8h6M2 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 3v10M12 13l2-2M12 13l-2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function GroupIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}
function MaximizeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M3 10v3h3M13 6V3h-3M3 6V3h3M13 10v3h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function CloseXIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function InboxIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2 10h3l1.5 2h3L11 10h3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  );
}
function LayersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M2 5l6-3 6 3-6 3-6-3zM2 8l6 3 6-3M2 11l6 3 6-3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3 4h10M3 8h10M3 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
function CycleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M13 8a5 5 0 11-1.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M11.5 1v3.5H15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function RoadmapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h4l2 2h6M4 8h5l2 2h3M2 12h3l2-2h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function BacklogIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 2"/>
    </svg>
  );
}
