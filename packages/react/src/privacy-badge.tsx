import { useState, type CSSProperties } from 'react';
import { useGhostPrivacy } from './context.js';

export interface GhostPrivacyBadgeProps {
  /** Badge label. Defaults to "Learns locally · zero servers" */
  text?: string;
  /** If provided the badge renders as an anchor tag pointing here */
  href?: string;
  /** Visual weight. Default "subtle". */
  variant?: 'subtle' | 'prominent';
  className?: string;
  style?: CSSProperties;
}

const LockIcon = () => (
  <svg
    width="11"
    height="13"
    viewBox="0 0 11 13"
    fill="none"
    aria-hidden="true"
    style={{ display: 'block', flexShrink: 0 }}
  >
    <rect x="1" y="5.5" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M3.5 5.5V3.5a2 2 0 0 1 4 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="5.5" cy="9" r="1" fill="currentColor" />
  </svg>
);

const TOOLTIP_TEXT =
  'All interaction data stays in your browser (IndexedDB). Nothing is sent to any server. You can clear it at any time.';

const styles: Record<string, CSSProperties> = {
  subtle: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '4px 10px 4px 8px',
    borderRadius: 20,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.10)',
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    fontWeight: 500,
    letterSpacing: '0.01em',
    lineHeight: 1,
    cursor: 'default',
    userSelect: 'none',
    textDecoration: 'none',
    transition: 'color 180ms ease, border-color 180ms ease',
  },
  prominent: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px 6px 10px',
    borderRadius: 20,
    background: 'rgba(167,139,250,0.12)',
    border: '1px solid rgba(167,139,250,0.30)',
    color: 'rgba(196,181,253,0.90)',
    fontSize: 12,
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    fontWeight: 600,
    letterSpacing: '0.01em',
    lineHeight: 1,
    cursor: 'default',
    userSelect: 'none',
    textDecoration: 'none',
    transition: 'color 180ms ease, border-color 180ms ease, background 180ms ease',
  },
};

const hoverStyles: Record<string, CSSProperties> = {
  subtle: {
    color: 'rgba(255,255,255,0.75)',
    borderColor: 'rgba(255,255,255,0.22)',
  },
  prominent: {
    color: '#e9d5ff',
    borderColor: 'rgba(167,139,250,0.55)',
    background: 'rgba(167,139,250,0.20)',
  },
};

export function GhostPrivacyBadge({
  text = 'Learns locally · zero servers',
  href,
  variant = 'subtle',
  className,
  style,
}: GhostPrivacyBadgeProps) {
  const [hovered, setHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const base = styles[variant] ?? styles.subtle;
  const hover = hoverStyles[variant] ?? hoverStyles.subtle;
  const merged: CSSProperties = {
    ...base,
    ...(hovered ? hover : {}),
    position: 'relative',
    ...style,
  };

  if (href) merged.cursor = 'pointer';

  const inner = (
    <>
      <LockIcon />
      <span>{text}</span>
      {showTooltip && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            maxWidth: 280,
            whiteSpaceCollapse: 'collapse',
            textWrap: 'wrap',
            background: 'rgba(10,10,18,0.96)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 11,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.70)',
            lineHeight: 1.5,
            pointerEvents: 'none',
            zIndex: 9999,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          {TOOLTIP_TEXT}
        </span>
      )}
    </>
  );

  const shared = {
    className,
    style: merged,
    onMouseEnter: () => { setHovered(true); setShowTooltip(true); },
    onMouseLeave: () => { setHovered(false); setShowTooltip(false); },
    'aria-label': `${text}. ${TOOLTIP_TEXT}`,
  };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...shared}>
        {inner}
      </a>
    );
  }

  return <span {...shared}>{inner}</span>;
}

// ─── GhostPrivacyPanel ────────────────────────────────────────────────────────

export interface GhostPrivacyPanelProps {
  className?: string;
  style?: CSSProperties;
}

/**
 * A ready-made privacy control panel. Drop it anywhere inside a GhostProvider.
 * Shows opt-out toggle and a clear-data button. Handles its own state via
 * useGhostPrivacy() — no extra props needed.
 */
export function GhostPrivacyPanel({ className, style }: GhostPrivacyPanelProps) {
  const { optOut, setOptOut, clearData } = useGhostPrivacy();
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  async function handleClear() {
    setClearing(true);
    await clearData();
    setClearing(false);
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  }

  const panelStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: '14px 16px',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    ...style,
  };

  const rowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  };

  const labelStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  };

  const descStyle: CSSProperties = {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
    lineHeight: 1.4,
  };

  const toggleTrack: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    width: 36,
    height: 20,
    borderRadius: 10,
    background: optOut ? 'rgba(255,255,255,0.12)' : 'rgba(92,94,240,0.80)',
    border: '1px solid rgba(255,255,255,0.12)',
    cursor: 'pointer',
    transition: 'background 200ms ease',
    flexShrink: 0,
    outline: 'none',
  };

  const toggleThumb: CSSProperties = {
    position: 'absolute',
    top: 2,
    left: optOut ? 2 : 16,
    width: 14,
    height: 14,
    borderRadius: '50%',
    background: 'white',
    transition: 'left 180ms ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
  };

  const clearBtnStyle: CSSProperties = {
    padding: '5px 12px',
    borderRadius: 7,
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(255,255,255,0.05)',
    color: cleared ? 'rgba(74,222,128,0.85)' : 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontWeight: 500,
    cursor: clearing ? 'default' : 'pointer',
    transition: 'color 180ms ease, background 180ms ease',
    outline: 'none',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  };

  return (
    <div className={className} style={panelStyle} role="region" aria-label="Ghost UI privacy controls">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <LockIcon />
        <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.80)', fontSize: 12 }}>
          Privacy Controls
        </span>
      </div>

      {/* Opt-out toggle */}
      <div style={rowStyle}>
        <div style={labelStyle}>
          <span style={{ fontWeight: 500, color: 'rgba(255,255,255,0.70)' }}>
            Disable learning
          </span>
          <span style={descStyle}>
            {optOut
              ? 'Ghost UI is paused — no events recorded.'
              : 'Ghost UI adapts your layout based on local interactions.'}
          </span>
        </div>
        <button
          role="switch"
          aria-checked={optOut}
          aria-label="Disable Ghost UI learning"
          onClick={() => setOptOut(!optOut)}
          style={toggleTrack}
        >
          <span aria-hidden style={toggleThumb} />
        </button>
      </div>

      {/* Clear data */}
      <div style={rowStyle}>
        <div style={labelStyle}>
          <span style={{ fontWeight: 500, color: 'rgba(255,255,255,0.70)' }}>
            Clear all data
          </span>
          <span style={descStyle}>
            Erases interaction history and resets layout to default.
          </span>
        </div>
        <button
          onClick={handleClear}
          disabled={clearing}
          style={clearBtnStyle}
          aria-label="Clear Ghost UI data"
        >
          {cleared ? '✓ Cleared' : clearing ? 'Clearing…' : 'Clear data'}
        </button>
      </div>

      {/* Footer note */}
      <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.25)', lineHeight: 1.5, margin: 0 }}>
        All data is stored locally in your browser. Nothing is sent to any server.
      </p>
    </div>
  );
}
