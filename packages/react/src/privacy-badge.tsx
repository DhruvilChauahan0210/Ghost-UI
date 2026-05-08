import { useState, type CSSProperties } from 'react';

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
