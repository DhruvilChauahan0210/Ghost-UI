import type { Metadata } from 'next';
import { CodePreview } from '../../CodePreview';
import { InstallCommand } from '../../InstallCommand';

export const metadata: Metadata = {
  title: 'Avatar — Ghost UI Library',
  description: 'User representation with image fallback, status indicators, and group stacking.',
};

function ComponentSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-1.5 text-[18px] font-medium tracking-[-0.02em] text-[#f4f4f7]">{title}</h2>
        <p className="text-[13.5px] leading-[1.55] text-muted">{description}</p>
      </div>
      {children}
    </div>
  );
}

export default function AvatarPage() {
  return (
    <div className="px-[clamp(24px,4vw,56px)] py-[clamp(40px,6vw,72px)]">

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 font-mono text-[12px] text-muted" aria-label="breadcrumb">
        <a href="/library" className="transition-colors hover:text-fg">Library</a>
        <span className="text-line-3">/</span>
        <span>Components</span>
        <span className="text-line-3">/</span>
        <span className="text-fg">Avatar</span>
      </nav>

      {/* Header */}
      <div className="mb-10 max-w-[640px]">
        <h1 className="mb-3 text-[clamp(32px,4vw,48px)] font-medium tracking-[-0.045em] text-[#f5f5f7]">Avatar</h1>
        <p className="text-[15px] leading-[1.65] text-muted">
          Represent users or entities with an image or initials fallback. Supports status indicators and stacked group display.
        </p>
      </div>

      {/* Install */}
      <div className="mb-10 max-w-[480px]">
        <div className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-2">Installation</div>
        <InstallCommand command="npx @ghost-ui/cli add avatar" />
      </div>

      {/* Variants */}
      <div className="flex flex-col gap-10 max-w-[860px]">

        {/* Initials */}
        <ComponentSection
          title="Default (Initials)"
          description="Shows generated initials when no image is available. A gradient background provides visual distinction between users."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-4">
                {[
                  { initials: 'JD', from: 'from-violet-500', to: 'to-purple-700' },
                  { initials: 'AK', from: 'from-sky-500', to: 'to-blue-700' },
                  { initials: 'MR', from: 'from-emerald-500', to: 'to-teal-700' },
                  { initials: 'SP', from: 'from-rose-500', to: 'to-pink-700' },
                ].map((a) => (
                  <div
                    key={a.initials}
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${a.from} ${a.to} font-medium text-[13px] text-white shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.18)]`}
                  >
                    {a.initials}
                  </div>
                ))}
              </div>
            }
            react={`function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 font-medium text-[13px] text-white shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.18)]">
      {initials}
    </div>
  );
}

<Avatar name="Jane Doe" />`}
            html={`<div class="avatar" aria-label="Jane Doe">JD</div>`}
            css={`.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  font-size: 13px;
  font-weight: 500;
  color: white;
  box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.18);
}`}
          />
        </ComponentSection>

        {/* With image */}
        <ComponentSection
          title="With Image"
          description="Renders a user photo clipped to a circle. Include a meaningful alt attribute for accessibility."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-4">
                {[32, 40, 48, 56].map((size) => (
                  <div
                    key={size}
                    className="overflow-hidden rounded-full shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.14)]"
                    style={{ width: size, height: size }}
                  >
                    <div
                      className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-violet-400/60 to-purple-600/60 font-medium text-white"
                      style={{ fontSize: Math.round(size * 0.35) }}
                    >
                      GU
                    </div>
                  </div>
                ))}
              </div>
            }
            react={`<img
  src="/avatars/jane.jpg"
  alt="Jane Doe"
  width={40}
  height={40}
  className="h-10 w-10 rounded-full object-cover shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.14)]"
/>

// With Next.js Image:
import Image from 'next/image';
<Image
  src="/avatars/jane.jpg"
  alt="Jane Doe"
  width={40}
  height={40}
  className="rounded-full shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.14)]"
/>`}
            html={`<img src="/avatars/jane.jpg" alt="Jane Doe" class="avatar-img" />`}
            css={`.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.14);
}`}
          />
        </ComponentSection>

        {/* Status indicator */}
        <ComponentSection
          title="Status Indicator"
          description="A coloured dot communicates presence state — online, busy, or offline."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-end gap-8">
                {[
                  { label: 'Online', dot: 'bg-emerald-400', shadow: 'shadow-[0_0_6px_rgba(52,211,153,0.7)]', initials: 'JD', from: 'from-violet-500', to: 'to-purple-700' },
                  { label: 'Busy', dot: 'bg-amber-400', shadow: 'shadow-[0_0_6px_rgba(251,191,36,0.7)]', initials: 'AK', from: 'from-sky-500', to: 'to-blue-700' },
                  { label: 'Offline', dot: 'bg-[#5a5a68]', shadow: '', initials: 'MR', from: 'from-emerald-500', to: 'to-teal-700' },
                ].map((a) => (
                  <div key={a.label} className="flex flex-col items-center gap-2.5">
                    <div className="relative">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${a.from} ${a.to} font-medium text-[13px] text-white shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.18)]`}>
                        {a.initials}
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#07070a] ${a.dot} ${a.shadow}`} />
                    </div>
                    <span className="text-[11px] text-muted">{a.label}</span>
                  </div>
                ))}
              </div>
            }
            react={`// Online
<div className="relative">
  <Avatar name="Jane Doe" />
  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-bg bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
</div>

// Busy
<div className="relative">
  <Avatar name="Alex Kim" />
  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-bg bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.7)]" />
</div>

// Offline
<div className="relative">
  <Avatar name="Maria R" />
  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-bg bg-[#5a5a68]" />
</div>`}
            html={`<div class="avatar-wrapper">
  <div class="avatar">JD</div>
  <span class="avatar-status status-online" aria-label="Online"></span>
</div>`}
            css={`.avatar-wrapper { position: relative; display: inline-flex; }
.avatar-status {
  position: absolute;
  bottom: -2px; right: -2px;
  width: 12px; height: 12px;
  border-radius: 50%;
  border: 2px solid #07070a;
}
.status-online  { background: #34d399; box-shadow: 0 0 6px rgba(52,211,153,0.7); }
.status-busy    { background: #fbbf24; box-shadow: 0 0 6px rgba(251,191,36,0.7); }
.status-offline { background: #5a5a68; }`}
          />
        </ComponentSection>

        {/* Avatar group */}
        <ComponentSection
          title="Avatar Group"
          description="Stack avatars with negative margin to convey multiple people. A count badge handles overflow."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex -space-x-3">
                  {[
                    { initials: 'JD', from: 'from-violet-500', to: 'to-purple-700' },
                    { initials: 'AK', from: 'from-sky-500', to: 'to-blue-700' },
                    { initials: 'MR', from: 'from-emerald-500', to: 'to-teal-700' },
                    { initials: 'SP', from: 'from-rose-500', to: 'to-pink-700' },
                  ].map((a) => (
                    <div
                      key={a.initials}
                      className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${a.from} ${a.to} text-[12px] font-medium text-white shadow-[0_0_0_2px_#07070a]`}
                    >
                      {a.initials}
                    </div>
                  ))}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.10] bg-[#0c0c12] text-[11px] font-medium text-muted shadow-[0_0_0_2px_#07070a]">
                    +5
                  </div>
                </div>
                <span className="text-[13px] text-muted">4 members + 5 more</span>
              </div>
            }
            react={`<div className="flex -space-x-3">
  {members.slice(0, 4).map(member => (
    <Avatar
      key={member.id}
      name={member.name}
      className="h-9 w-9 text-[12px] shadow-[0_0_0_2px_#07070a]"
    />
  ))}
  {remaining > 0 && (
    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.10] bg-[#0c0c12] text-[11px] font-medium text-muted shadow-[0_0_0_2px_#07070a]">
      +{remaining}
    </div>
  )}
</div>`}
            html={`<div class="avatar-group" aria-label="4 members and 5 more">
  <div class="avatar">JD</div>
  <div class="avatar">AK</div>
  <div class="avatar">MR</div>
  <div class="avatar avatar-overflow">+5</div>
</div>`}
            css={`.avatar-group { display: flex; }
.avatar-group .avatar {
  margin-left: -12px;
  box-shadow: 0 0 0 2px #07070a;
}
.avatar-group .avatar:first-child { margin-left: 0; }
.avatar-overflow {
  background: #0c0c12;
  border: 1px solid rgba(255,255,255,0.10);
  font-size: 11px;
  font-weight: 500;
  color: #8a8a98;
}`}
          />
        </ComponentSection>

      </div>
    </div>
  );
}
