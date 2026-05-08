const STYLE_ID = 'ghost-ui-shake-keyframes';

if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
@keyframes ghost-intent-pulse {
  0%, 100% { box-shadow: inherit; opacity: 1; }
  50%       { opacity: 0.85; }
}
@keyframes ghost-shake {
  0%  { transform: translateX(0); }
  15% { transform: translateX(-5px) rotate(-1deg); }
  30% { transform: translateX(5px) rotate(1deg); }
  45% { transform: translateX(-4px) rotate(-0.5deg); }
  60% { transform: translateX(4px) rotate(0.5deg); }
  75% { transform: translateX(-2px); }
  90% { transform: translateX(2px); }
  100%{ transform: translateX(0); }
}`.trim();
  document.head.appendChild(style);
}
