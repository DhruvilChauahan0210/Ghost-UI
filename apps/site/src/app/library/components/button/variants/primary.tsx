import type { ComponentDesign } from '../ComponentGrid';

export const PRIMARY_DESIGNS: ComponentDesign[] = [
  {
    name: 'Classic',
    description: 'High contrast white fill. Subtle purple glow on hover. The default Ghost UI primary.',
    preview: (
      <button className="inline-flex items-center gap-2 rounded-[10px] border border-transparent bg-[var(--btn-surface-light)] px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text)] transition-all duration-200 hover:bg-[var(--btn-surface-white)] hover:shadow-[0_18px_40px_-16px_var(--btn-shadow-soft)]">
        Get started →
      </button>
    ),
    code: `<button className="inline-flex items-center gap-2 rounded-[10px]
  border border-transparent bg-[var(--btn-surface-light)]
  px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text-dark)]
  transition-all duration-200
  hover:bg-[var(--btn-surface-white)]
  hover:shadow-[0_18px_40px_-16px_var(--btn-shadow-soft)]">
  Get started →
</button>`,
    html: `<button class="btn-classic">Get started →</button>`,
    css: `.btn-classic {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: var(--btn-surface-light);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--btn-text-invert);
  transition: background 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.btn-classic:hover {
  background: var(--btn-surface-white);
  box-shadow: 0 18px 40px -16px var(--btn-shadow-soft);
}`,
    prompt: `Create a classic primary button with a light off-white fill (#ededf0) that brightens to pure white on hover. The button has 10px border radius, 14px semi-bold text in near-black (#0a0a10), and gains a soft purple glow shadow on hover (rgba(196,181,253,0.55)). No visible border at rest — clean, high-contrast, and minimal.`,
  },
  {
    name: 'Gradient',
    description: 'Violet to cyan diagonal gradient. Bold and attention-grabbing for hero CTAs.',
    preview: (
      <button
        className="inline-flex items-center gap-2 rounded-[10px] border-0 px-4 py-[11px] text-[14px] font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-[0_12px_32px_-8px_rgba(139,92,246,0.6)]"
        style={{ background: 'linear-gradient(135deg,#6d28d9,#c4b5fd,#38bdf8)' }}
      >
        Get started →
      </button>
    ),
    code: `<button
  style={{ background: 'linear-gradient(135deg,#6d28d9,#c4b5fd,#38bdf8)' }}
  className="inline-flex items-center gap-2 rounded-[10px] border-0
    px-4 py-[11px] text-[14px] font-semibold text-white
    transition-all duration-300
    hover:opacity-90
    hover:shadow-[0_12px_32px_-8px_rgba(139,92,246,0.6)]">
  Get started →
</button>`,
    html: `<button class="btn-gradient">Get started →</button>`,
    css: `.btn-gradient {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #6d28d9, #c4b5fd, #38bdf8);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  transition: opacity 0.3s, box-shadow 0.3s;
  cursor: pointer;
}
.btn-gradient:hover {
  opacity: 0.9;
  box-shadow: 0 12px 32px -8px rgba(139,92,246,0.6);
}`,
    prompt: `Design a bold gradient primary button flowing diagonally from deep violet (#6d28d9) through lavender (#c4b5fd) to sky cyan (#38bdf8) at 135 degrees. White semi-bold text, 10px border radius, no border. On hover it fades to 90% opacity and emits a purple glow shadow beneath it. Ideal for hero sections and main calls-to-action.`,
  },
  {
    name: 'Sunset',
    description: 'Pink → orange → yellow. Warm, energetic — great for creative or consumer products.',
    preview: (
      <button
        className="inline-flex items-center gap-2 rounded-[10px] border-0 px-4 py-[11px] text-[14px] font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-[0_12px_28px_-8px_rgba(236,72,153,0.5)]"
        style={{ background: 'linear-gradient(135deg,#ec4899,#f97316,#eab308)' }}
      >
        Get started →
      </button>
    ),
    code: `<button
  style={{ background: 'linear-gradient(135deg,#ec4899,#f97316,#eab308)' }}
  className="inline-flex items-center gap-2 rounded-[10px] border-0
    px-4 py-[11px] text-[14px] font-semibold text-white
    transition-all duration-300
    hover:opacity-90
    hover:shadow-[0_12px_28px_-8px_rgba(236,72,153,0.5)]">
  Get started →
</button>`,
    html: `<button class="btn-sunset">Get started →</button>`,
    css: `.btn-sunset {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #ec4899, #f97316, #eab308);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  transition: opacity 0.3s, box-shadow 0.3s;
  cursor: pointer;
}
.btn-sunset:hover {
  opacity: 0.9;
  box-shadow: 0 12px 28px -8px rgba(236,72,153,0.5);
}`,
    prompt: `Create a warm sunset gradient button flowing from hot pink (#ec4899) through orange (#f97316) to golden yellow (#eab308) at 135 degrees. White semi-bold text on a borderless pill-shaped button with 10px radius. Hover slightly dims the button and adds a pink glow shadow. Perfect for energetic consumer or creative product CTAs.`,
  },
  {
    name: 'Neon',
    description: 'Dark background, glowing accent border. Sci-fi / gaming / dark-product aesthetic.',
    preview: (
      <button
        className="inline-flex items-center gap-2 rounded-[10px] border px-4 py-[11px] text-[14px] font-medium transition-all duration-300 hover:shadow-[0_0_28px_rgba(196,181,253,0.5),inset_0_0_24px_rgba(196,181,253,0.08)]"
        style={{ borderColor: 'rgba(196,181,253,0.55)', color: 'var(--btn-text-accent)', background: 'var(--btn-surface-4)', boxShadow: '0 0 14px rgba(196,181,253,0.22),inset 0 0 14px rgba(196,181,253,0.04)' }}
      >
        Get started →
      </button>
    ),
    code: `<button
  style={{
    borderColor: 'rgba(196,181,253,0.55)',
    color: 'var(--btn-text-accent)',
    background: 'var(--btn-surface-4)',
    boxShadow: '0 0 14px var(--btn-shadow-soft), inset 0 0 14px var(--btn-border)',
  }}
  className="inline-flex items-center gap-2 rounded-[10px] border
    px-4 py-[11px] text-[14px] font-medium
    transition-all duration-300
    hover:shadow-[0_0_28px_rgba(196,181,253,0.5),inset_0_0_24px_rgba(196,181,253,0.08)]">
  Get started →
</button>`,
    html: `<button class="btn-neon">Get started →</button>`,
    css: `.btn-neon {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid var(--btn-border-accent);
  background: var(--btn-surface-4);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--btn-text-accent);
  box-shadow: 0 0 14px rgba(196,181,253,0.22), inset 0 0 14px rgba(196,181,253,0.04);
  transition: box-shadow 0.3s;
  cursor: pointer;
}
.btn-neon:hover {
  box-shadow: 0 0 28px rgba(196,181,253,0.5), inset 0 0 24px rgba(196,181,253,0.08);
}`,
    prompt: `Design a neon-glow button with a near-black deep purple background (#08021a) and a semi-transparent lavender border (rgba(196,181,253,0.55)). The lavender text (#c4b5fd) and ambient outer glow give a sci-fi feel. On hover the glow intensifies outward and inward. Perfect for dark-mode apps, games, or cyberpunk-inspired products.`,
  },
  {
    name: 'Glass',
    description: 'Frosted glass surface. Designed for placement over images, gradients, or blurred backgrounds.',
    preview: (
      <div className="flex items-center justify-center rounded-xl p-4" style={{ background: 'linear-gradient(135deg,#1a0533,#0a1a33)' }}>
        <button
          className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--btn-border-bright)] px-4 py-[11px] text-[14px] font-medium text-white/90 transition-all duration-200 hover:bg-[var(--btn-surface-white)]/[0.14] hover:border-[var(--btn-border-bright)]"
          style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(12px)' }}
        >
          Get started →
        </button>
      </div>
    ),
    code: `// Place over an image or gradient background
<button
  style={{ backdropFilter: 'blur(12px)' }}
  className="inline-flex items-center gap-2 rounded-[10px]
    border border-[var(--btn-border-bright)] bg-white/[0.10]
    px-4 py-[11px] text-[14px] font-medium text-white/90
    transition-all duration-200
    hover:bg-[var(--btn-surface-white)]/[0.14] hover:border-[var(--btn-border-bright)]">
  Get started →
</button>`,
    html: `<button class="btn-glass">Get started →</button>`,
    css: `.btn-glass {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid var(--btn-border-bright);
  background: rgba(255,255,255,0.10);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,0.90);
  transition: background 0.2s, border-color 0.2s;
  cursor: pointer;
}
.btn-glass:hover {
  background: rgba(255,255,255,0.14);
  border-color: rgba(255,255,255,0.35);
}`,
    prompt: `Create a frosted glass button with 10% white background fill, 12px backdrop blur, and a 20% white border. Text is white at 90% opacity. On hover the fill increases to 14% and border to 35% opacity. Must be placed over a colorful image or gradient to show the glassmorphism effect. Smooth 200ms transitions on all properties.`,
  },
  {
    name: 'Soft',
    description: 'Light accent tint. Lower emphasis than Classic — works as a secondary primary in dense UIs.',
    preview: (
      <button className="inline-flex items-center gap-2 rounded-[10px] border border-accent/[0.30] bg-accent/[0.12] px-4 py-[11px] text-[14px] font-semibold text-accent transition-all duration-200 hover:border-accent/[0.50] hover:bg-accent/[0.20] hover:shadow-[0_0_20px_var(--btn-shadow-soft)]">
        Get started →
      </button>
    ),
    code: `<button className="inline-flex items-center gap-2 rounded-[10px]
  border border-accent/[0.30] bg-accent/[0.12]
  px-4 py-[11px] text-[14px] font-semibold text-accent
  transition-all duration-200
  hover:border-accent/[0.50] hover:bg-accent/[0.20]
  hover:shadow-[0_0_20px_var(--btn-shadow-soft)]">
  Get started →
</button>`,
    html: `<button class="btn-soft">Get started →</button>`,
    css: `.btn-soft {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid rgba(196,181,253,0.30);
  background: rgba(196,181,253,0.12);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--btn-text-accent);
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.btn-soft:hover {
  border-color: var(--btn-border-accent);
  background: rgba(196,181,253,0.20);
  box-shadow: 0 0 20px rgba(196,181,253,0.15);
}`,
    prompt: `Design a soft tinted button using a 12% lavender background fill (rgba(196,181,253,0.12)) with a matching 30% opacity border. Text is full lavender (#c4b5fd) at semi-bold weight. On hover the tint intensifies to 20%, border becomes 50% opaque, and a faint ambient glow appears. Ideal as a secondary emphasis button in dark interfaces.`,
  },
  {
    name: 'Outline → Fill',
    description: 'Transparent at rest, fills on hover. Elegant reveal effect — great for minimal UIs.',
    preview: (
      <button className="inline-flex items-center gap-2 rounded-[10px] border-2 border-[var(--btn-surface-light)] bg-transparent px-4 py-[10px] text-[14px] font-semibold text-[var(--btn-text-invert)] transition-all duration-200 hover:bg-[var(--btn-surface-light)] hover:text-[var(--btn-text-invert)]">
        Get started →
      </button>
    ),
    code: `<button className="inline-flex items-center gap-2 rounded-[10px]
  border-2 border-[var(--btn-surface-light)] bg-transparent
  px-4 py-[10px] text-[14px] font-semibold text-[var(--btn-text)]
  transition-all duration-200
  hover:bg-[var(--btn-surface-light)] hover:text-[var(--btn-text-dark)]">
  Get started →
</button>`,
    html: `<button class="btn-outline-fill">Get started →</button>`,
    css: `.btn-outline-fill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 2px solid #ededf0;
  background: transparent;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--btn-text-invert);
  transition: background 0.2s, color 0.2s;
  cursor: pointer;
}
.btn-outline-fill:hover {
  background: var(--btn-surface-light);
  color: var(--btn-text-dark);
}`,
    prompt: `Create an outline-to-fill button that starts as a fully transparent ghost with a 2px solid off-white border (#ededf0) and matching text. On hover it instantly fills with the same off-white color and flips the text to near-black (#0a0a10). The 200ms color transition creates an elegant reveal. Works beautifully on dark backgrounds.`,
  },
  {
    name: 'Pill',
    description: 'Same visual weight as Classic but fully rounded. Friendly, approachable feel.',
    preview: (
      <button className="inline-flex items-center gap-2 rounded-full border border-transparent bg-[var(--btn-surface-light)] px-5 py-[11px] text-[14px] font-semibold text-[var(--btn-text-invert)] transition-all duration-200 hover:bg-[var(--btn-surface-white)] hover:shadow-[0_12px_28px_-8px_var(--btn-shadow-soft)]">
        Get started →
      </button>
    ),
    code: `<button className="inline-flex items-center gap-2 rounded-full
  border border-transparent bg-[var(--btn-surface-light)]
  px-5 py-[11px] text-[14px] font-semibold text-[var(--btn-text-dark)]
  transition-all duration-200
  hover:bg-[var(--btn-surface-white)] hover:shadow-[0_12px_28px_-8px_var(--btn-shadow-soft)]">
  Get started →
</button>`,
    html: `<button class="btn-pill">Get started →</button>`,
    css: `.btn-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 9999px;
  border: 1px solid transparent;
  background: var(--btn-surface-light);
  padding: 11px 20px;
  font-size: 14px;
  font-weight: 600;
  color: var(--btn-text-dark);
  transition: background 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.btn-pill:hover {
  background: var(--btn-surface-white);
  box-shadow: 0 12px 28px -8px var(--btn-shadow-soft);
}`,
    prompt: `Design a fully pill-shaped primary button (border-radius: 9999px) with the same off-white fill as the Classic variant (#ededf0). Semi-bold near-black text, slightly wider horizontal padding. On hover it brightens to white and reveals a soft purple elevation shadow beneath. The rounded shape gives a friendly, modern feel compared to the squared Classic.`,
  },
  {
    name: '3D / Raised',
    description: 'Hard offset bottom shadow creates depth. Clicks press flush — strong tactile feedback.',
    preview: (
      <button
        className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--btn-border)] bg-[var(--btn-surface-light)] px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text)] shadow-[0_3px_0_0_var(--btn-surface-3)] transition-all duration-75 active:translate-y-[3px] active:shadow-none"
      >
        Get started →
      </button>
    ),
    code: `<button className="inline-flex items-center gap-2 rounded-[10px]
  border border-[var(--btn-border)] bg-[var(--btn-surface-light)]
  px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text-dark)]
  shadow-[0_3px_0_0_var(--btn-surface-3)]
  transition-all duration-75
  active:translate-y-[3px] active:shadow-none">
  Get started →
</button>`,
    html: `<button class="btn-3d">Get started →</button>`,
    css: `.btn-3d {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid #c8c8d0;
  background: var(--btn-surface-light);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--btn-text-dark);
  box-shadow: 0 3px 0 0 #b0b0b8;
  transition: transform 0.075s, box-shadow 0.075s;
  cursor: pointer;
}
.btn-3d:active {
  transform: translateY(3px);
  box-shadow: none;
}`,
    prompt: `Create a 3D raised button with a solid 3px bottom box-shadow in a slightly darker grey (#b0b0b8) than the button fill (#ededf0), creating a physical depth illusion. When pressed (active state) the button translates down 3px and the shadow disappears, simulating a physical click. Very fast 75ms transition for snappy tactile feedback. Bordered with a subtle grey outline.`,
  },
  {
    name: 'Shimmer',
    description: 'Animated metallic gradient sweep. Maximum attention — use sparingly.',
    preview: (
      <button
        className="inline-flex items-center gap-2 rounded-[10px] border-0 px-4 py-[11px] text-[14px] font-semibold text-white"
        style={{ backgroundImage: 'linear-gradient(90deg,#6d28d9 0%,#c4b5fd 30%,#38bdf8 50%,#c4b5fd 70%,#6d28d9 100%)', backgroundSize: '200% auto', animation: 'btn-shimmer 3s linear infinite' }}
      >
        Get started →
      </button>
    ),
    code: `// Requires @keyframes btn-shimmer in globals.css:
// { 0%{background-position:200% center} 100%{background-position:-200% center} }

<button
  style={{
    backgroundImage: 'linear-gradient(90deg,#6d28d9 0%,#c4b5fd 30%,#38bdf8 50%,#c4b5fd 70%,#6d28d9 100%)',
    backgroundSize: '200% auto',
    animation: 'btn-shimmer 3s linear infinite',
  }}
  className="inline-flex items-center gap-2 rounded-[10px] border-0
    px-4 py-[11px] text-[14px] font-semibold text-white">
  Get started →
</button>`,
    html: `<button class="btn-shimmer">Get started →</button>`,
    css: `@keyframes btn-shimmer {
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
}
.btn-shimmer {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: none;
  background-image: linear-gradient(90deg, #6d28d9 0%, #c4b5fd 30%, #38bdf8 50%, #c4b5fd 70%, #6d28d9 100%);
  background-size: 200% auto;
  animation: btn-shimmer 3s linear infinite;
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
}`,
    prompt: `Design a continuously animated shimmer button with a wide horizontal gradient spanning violet (#6d28d9), lavender (#c4b5fd), cyan (#38bdf8), back to lavender and violet. Set background-size to 200% and animate background-position with a 3-second linear infinite loop to create a smooth metallic sweep. White semi-bold text, 10px radius, no border. Reserve for maximum-attention moments.`,
  },
  {
    name: 'Brutalist',
    description: 'Zero border-radius, hard offset shadow. Raw, bold, and unforgettable.',
    preview: (
      <button className="inline-flex items-center gap-2 rounded-none border-2 border-[var(--btn-surface-light)] bg-[var(--btn-surface-light)] px-4 py-[11px] text-[14px] font-bold text-[var(--btn-text-invert)] shadow-[4px_4px_0_0_var(--btn-accent)] transition-all duration-100 hover:-translate-y-[2px] hover:shadow-[4px_6px_0_0_var(--btn-accent)] active:translate-y-0 active:shadow-[2px_2px_0_0_var(--btn-accent)]">
        GET STARTED →
      </button>
    ),
    code: `<button className="inline-flex items-center gap-2 rounded-none
  border-2 border-[var(--btn-surface-light)] bg-[var(--btn-surface-light)]
  px-4 py-[11px] text-[14px] font-bold text-[var(--btn-text-dark)]
  shadow-[4px_4px_0_0_var(--btn-accent)]
  transition-all duration-100
  hover:-translate-y-[2px] hover:shadow-[4px_6px_0_0_var(--btn-accent)]
  active:translate-y-0 active:shadow-[2px_2px_0_0_var(--btn-accent)]">
  GET STARTED →
</button>`,
    html: `<button class="btn-brutalist">GET STARTED →</button>`,
    css: `.btn-brutalist {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 0;
  border: 2px solid #ededf0;
  background: var(--btn-surface-light);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 700;
  color: var(--btn-text-dark);
  text-transform: uppercase;
  box-shadow: 4px 4px 0 0 #c4b5fd;
  transition: transform 0.1s, box-shadow 0.1s;
  cursor: pointer;
}
.btn-brutalist:hover {
  transform: translateY(-2px);
  box-shadow: 4px 6px 0 0 #c4b5fd;
}
.btn-brutalist:active {
  transform: translateY(0);
  box-shadow: 2px 2px 0 0 #c4b5fd;
}`,
    prompt: `Create a brutalist-style button with absolutely zero border radius, a 2px solid off-white border matching the fill, bold uppercase text, and a hard 4px offset lavender box-shadow (#c4b5fd) creating a stark 3D offset. On hover the button lifts 2px and shadow grows; on active it presses back down. No softness — raw, graphic, and intentionally anti-design.`,
  },
  {
    name: 'Dark',
    description: 'Near-black fill with subtle border. Refined, low-key — works in any color scheme.',
    preview: (
      <button className="inline-flex items-center gap-2 rounded-[10px] border border-white/[0.12] bg-[var(--btn-surface)] px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text)] transition-all duration-200 hover:border-[var(--btn-border-bright)] hover:bg-[var(--btn-surface-2)] hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.6)]">
        Get started →
      </button>
    ),
    code: `<button className="inline-flex items-center gap-2 rounded-[10px]
  border border-white/[0.12] bg-[var(--btn-surface)]
  px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text)]
  transition-all duration-200
  hover:border-[var(--btn-border-bright)] hover:bg-[var(--btn-surface-2)]
  hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.6)]">
  Get started →
</button>`,
    html: `<button class="btn-dark">Get started →</button>`,
    css: `.btn-dark {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid var(--btn-border);
  background: var(--btn-surface);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--btn-text);
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.btn-dark:hover {
  border-color: rgba(255,255,255,0.22);
  background: var(--btn-surface-2);
  box-shadow: 0 12px 28px -8px var(--btn-shadow-deep);
}`,
    prompt: `Design a refined dark button with a near-black fill (#0c0c14) and a 12% white border that gives just enough definition. Off-white text (#ededf0) at semi-bold weight. On hover the background lightens slightly to #141420, border brightens to 22% opacity, and a deep black elevation shadow appears. Universally compatible with both dark and light surrounding UIs.`,
  },
  {
    name: 'Duotone',
    description: 'Two-color horizontal split fill. Bold, editorial-style contrast between purple and cyan halves.',
    preview: (
      <button
        className="inline-flex items-center gap-2 rounded-[10px] border-0 px-4 py-[11px] text-[14px] font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-[0_12px_32px_-8px_rgba(139,92,246,0.5)]"
        style={{ background: 'linear-gradient(90deg,#6d28d9 50%,#38bdf8 50%)' }}
      >
        Get started →
      </button>
    ),
    code: `<button
  style={{ background: 'linear-gradient(90deg,#6d28d9 50%,#38bdf8 50%)' }}
  className="inline-flex items-center gap-2 rounded-[10px] border-0
    px-4 py-[11px] text-[14px] font-semibold text-white
    transition-all duration-300
    hover:opacity-90
    hover:shadow-[0_12px_32px_-8px_rgba(139,92,246,0.5)]">
  Get started →
</button>`,
    html: `<button class="btn-duotone">Get started →</button>`,
    css: `.btn-duotone {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, #6d28d9 50%, #38bdf8 50%);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  transition: opacity 0.3s, box-shadow 0.3s;
  cursor: pointer;
}
.btn-duotone:hover {
  opacity: 0.9;
  box-shadow: 0 12px 32px -8px var(--btn-shadow-soft);
}`,
    prompt: `Create a duotone button with an exact horizontal split at 50%: deep violet (#6d28d9) on the left, sky cyan (#38bdf8) on the right. White semi-bold text sits over the sharp color divide. On hover the button fades slightly and emits a violet glow shadow. The hard color split creates an editorial, almost print-design feel.`,
  },
  {
    name: 'Text Glow',
    description: 'Glowing neon text with a subtle dark fill. The glow is in the letters, not the border — distinct from Neon.',
    preview: (
      <button
        className="inline-flex items-center gap-2 rounded-[10px] border border-white/[0.08] bg-[var(--btn-surface)] px-4 py-[11px] text-[14px] font-semibold text-white transition-all duration-300 hover:border-white/[0.18]"
        style={{ textShadow: '0 0 18px rgba(196,181,253,0.7), 0 0 40px rgba(139,92,246,0.25)' }}
      >
        Get started →
      </button>
    ),
    code: `<button
  style={{ textShadow: '0 0 18px rgba(196,181,253,0.7), 0 0 40px rgba(139,92,246,0.25)' }}
  className="inline-flex items-center gap-2 rounded-[10px]
    border border-white/[0.08] bg-[var(--btn-surface)]
    px-4 py-[11px] text-[14px] font-semibold text-white
    transition-all duration-300
    hover:border-white/[0.18]">
  Get started →
</button>`,
    html: `<button class="btn-text-glow">Get started →</button>`,
    css: `.btn-text-glow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid var(--btn-border-subtle);
  background: var(--btn-surface);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 0 18px rgba(196,181,253,0.7), 0 0 40px rgba(139,92,246,0.25);
  transition: border-color 0.3s;
  cursor: pointer;
}
.btn-text-glow:hover {
  border-color: var(--btn-border-bright);
}`,
    prompt: `Design a button where the text itself glows, not the border. Use text-shadow with two layers: a tight 18px lavender glow (rgba(196,181,253,0.7)) and a wider 40px violet glow (rgba(139,92,246,0.25)). The button has a near-black fill (#0c0c14) with a very subtle 8% white border that brightens to 18% on hover. White semi-bold text. This is distinct from the Neon variant which glows via border/box-shadow — here the focus is on luminous typography.`,
  },
  {
    name: 'Skewed',
    description: 'Parallelogram shape with a -7° skew. Dynamic, off-axis — great for editorial or fashion brands.',
    preview: (
      <button
        className="inline-flex items-center gap-2 border-0 px-5 py-[11px] text-[14px] font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-[0_12px_28px_-8px_rgba(139,92,246,0.5)]"
        style={{ background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)', transform: 'skewX(-7deg)', borderRadius: '4px' }}
      >
        <span style={{ transform: 'skewX(7deg)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          Get started →
        </span>
      </button>
    ),
    code: `<button
  style={{
    background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
    transform: 'skewX(-7deg)',
    borderRadius: '4px',
  }}
  className="inline-flex items-center gap-2 border-0
    px-5 py-[11px] text-[14px] font-semibold text-white
    transition-all duration-200
    hover:opacity-90
    hover:shadow-[0_12px_28px_-8px_rgba(139,92,246,0.5)]">
  <span style={{ transform: 'skewX(7deg)', display: 'inline-flex',
    alignItems: 'center', gap: '8px' }}>
    Get started →
  </span>
</button>`,
    html: `<button class="btn-skewed">
  <span>Get started →</span>
</button>`,
    css: `.btn-skewed {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 4px;
  background: linear-gradient(135deg, #6d28d9, #8b5cf6);
  padding: 11px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  transform: skewX(-7deg);
  transition: opacity 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.btn-skewed span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transform: skewX(7deg);
}
.btn-skewed:hover {
  opacity: 0.9;
  box-shadow: 0 12px 28px -8px rgba(139,92,246,0.5);
}`,
    prompt: `Create a skewed parallelogram button using CSS transform: skewX(-7deg) on the button wrapper and a counter-skewX(7deg) on the inner span to keep the text upright. Use a violet-to-purple diagonal gradient fill (#6d28d9 → #8b5cf6) with white semi-bold text. A subtle 4px border radius softens the sharp corners just enough. On hover, dim to 90% opacity and emit a purple glow shadow. The dynamic off-axis shape makes it stand out from all standard rectangular buttons.`,
  },
  {
    name: 'Gradient Border',
    description: 'Border is a violet-to-cyan gradient while the fill stays dark. Uses background-clip for a seamless ring.',
    preview: (
      <button
        className="inline-flex items-center gap-2 rounded-[10px] border-2 border-transparent px-4 py-[10px] text-[14px] font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-[0_0_24px_rgba(139,92,246,0.3)]"
        style={{ background: 'linear-gradient(var(--btn-surface), var(--btn-surface)) padding-box, linear-gradient(135deg, #6d28d9, #c4b5fd, #38bdf8) border-box' }}
      >
        Get started →
      </button>
    ),
    code: `<button
  style={{
    background:
      'linear-gradient(var(--btn-surface), var(--btn-surface)) padding-box, ' +
      'linear-gradient(135deg, #6d28d9, #c4b5fd, #38bdf8) border-box',
  }}
  className="inline-flex items-center gap-2 rounded-[10px]
    border-2 border-transparent
    px-4 py-[10px] text-[14px] font-semibold text-white
    transition-all duration-200
    hover:opacity-90
    hover:shadow-[0_0_24px_rgba(139,92,246,0.3)]">
  Get started →
</button>`,
    html: `<button class="btn-gradient-border">Get started →</button>`,
    css: `.btn-gradient-border {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 2px solid transparent;
  background:
    linear-gradient(var(--btn-surface), var(--btn-surface)) padding-box,
    linear-gradient(135deg, #6d28d9, #c4b5fd, #38bdf8) border-box;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  transition: opacity 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.btn-gradient-border:hover {
  opacity: 0.9;
  box-shadow: 0 0 24px rgba(139,92,246,0.3);
}`,
    prompt: `Design a button with a gradient border ring using the background-clip technique. Set a 2px transparent border, then use two layered background gradients: a solid dark fill (#0c0c14) clipped to the padding-box for the interior, and a violet→lavender→cyan gradient (135deg) clipped to the border-box for the border itself. This creates a seamless gradient ring around a dark button. White semi-bold text inside, subtle purple glow shadow on hover. Distinct from Outline→Fill which uses a solid border.`,
  },
  {
    name: 'Inset',
    description: 'Inner shadows create a sunken, debossed appearance. Refined and tactile for panel headers.',
    preview: (
      <button
        className="inline-flex items-center gap-2 rounded-[10px] border border-white/[0.06] bg-[var(--btn-surface-3)] px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text-accent)] transition-all duration-200 hover:border-white/[0.14] hover:text-white"
        style={{ boxShadow: 'inset 0 1px 2px var(--btn-shadow-deep), inset 0 -1px 0 var(--btn-border-subtle)' }}
      >
        Get started →
      </button>
    ),
    code: `<button
  style={{ boxShadow: 'inset 0 1px 2px var(--btn-shadow-deep), inset 0 -1px 0 var(--btn-border-subtle)' }}
  className="inline-flex items-center gap-2 rounded-[10px]
    border border-white/[0.06] bg-[var(--btn-surface-3)]
    px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text-accent)]
    transition-all duration-200
    hover:border-white/[0.14] hover:text-white">
  Get started →
</button>`,
    html: `<button class="btn-inset">Get started →</button>`,
    css: `.btn-inset {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid var(--btn-border-subtle);
  background: var(--btn-surface-3);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--btn-text-accent);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.5), inset 0 -1px 0 rgba(255,255,255,0.05);
  transition: border-color 0.2s, color 0.2s;
  cursor: pointer;
}
.btn-inset:hover {
  border-color: rgba(255,255,255,0.14);
  color: #ffffff;
}`,
    prompt: `Create a debossed/inset button using inner box-shadows: a dark inner shadow at the top for depth and a subtle white highlight at the bottom edge. The surface appears sunken into the background. Use a near-black fill (#0a0a10) with a barely-visible 6% white border and lavender text (#c4b5fd). On hover the border brightens and text turns pure white. No outer shadows — the depth comes from the inside.`,
  },
  {
    name: 'Stripe',
    description: 'Animated diagonal stripe fill. Energetic and sporty — great for limited-time or launch CTAs.',
    preview: (
      <button
        className="inline-flex items-center gap-2 rounded-[10px] border-0 px-4 py-[11px] text-[14px] font-semibold text-white animate-[btn-stripe-slide_0.8s_linear_infinite]"
        style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #6d28d9 0px, #6d28d9 3px, transparent 3px, transparent 8px, #7c3aed 8px, #7c3aed 11px, transparent 11px, transparent 16px)', backgroundSize: '28px 28px', backgroundColor: 'var(--btn-surface)' }}
      >
        Get started →
      </button>
    ),
    code: `// Requires @keyframes btn-stripe-slide in globals.css:
// { 0%{background-position:0 0} 100%{background-position:28px 0} }

<button
  style={{
    backgroundImage: 'repeating-linear-gradient(-45deg, #6d28d9 0px, #6d28d9 3px, transparent 3px, transparent 8px, #7c3aed 8px, #7c3aed 11px, transparent 11px, transparent 16px)',
    backgroundSize: '28px 28px',
    backgroundColor: 'var(--btn-surface)',
  }}
  className="inline-flex items-center gap-2 rounded-[10px] border-0
    px-4 py-[11px] text-[14px] font-semibold text-white
    animate-[btn-stripe-slide_0.8s_linear_infinite]">
  Get started →
</button>`,
    html: `<button class="btn-stripe">Get started →</button>`,
    css: `@keyframes btn-stripe-slide {
  0%   { background-position: 0 0; }
  100% { background-position: 28px 0; }
}
.btn-stripe {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: none;
  background-color: #2e1065;
  background-image: repeating-linear-gradient(-45deg, #6d28d9 0px, #6d28d9 3px, transparent 3px, transparent 8px, #7c3aed 8px, #7c3aed 11px, transparent 11px, transparent 16px);
  background-size: 28px 28px;
  animation: btn-stripe-slide 0.8s linear infinite;
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
}`,
    prompt: `Design an energetic stripe-pattern button with animated -45° diagonal stripes in two shades of purple (#6d28d9 and #7c3aed) over a deep violet base (#2e1065). Use repeating-linear-gradient to create a pattern of 3px and 2px stripe fragments separated by transparent gaps, tiled at 28px. Animate background-position to slide the stripes continuously. White semi-bold text over the stripes. No border, 10px radius. Feels sporty and urgent.`,
  },
  {
    name: 'Metallic',
    description: 'Cool silver gradient with a subtle luminous sheen. Premium, understated, high-end SaaS feel.',
    preview: (
      <button
        className="inline-flex items-center gap-2 rounded-[10px] border-0 px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text-dark)] transition-all duration-200 hover:opacity-90 hover:shadow-[0_8px_24px_-6px_rgba(148,163,184,0.35)]"
        style={{ background: 'linear-gradient(180deg,#e8ecf1 0%,#c8cdd5 40%,#a0a8b4 100%)' }}
      >
        Get started →
      </button>
    ),
    code: `<button
  style={{ background: 'linear-gradient(180deg,#e8ecf1 0%,#c8cdd5 40%,#a0a8b4 100%)' }}
  className="inline-flex items-center gap-2 rounded-[10px] border-0
    px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text-dark)]
    transition-all duration-200
    hover:opacity-90
    hover:shadow-[0_8px_24px_-6px_rgba(148,163,184,0.35)]">
  Get started →
</button>`,
    html: `<button class="btn-metallic">Get started →</button>`,
    css: `.btn-metallic {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(180deg, #e8ecf1 0%, #c8cdd5 40%, #a0a8b4 100%);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--btn-text-dark);
  transition: opacity 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.btn-metallic:hover {
  opacity: 0.9;
  box-shadow: 0 8px 24px -6px rgba(148,163,184,0.35);
}`,
    prompt: `Create a metallic silver button using a top-to-bottom gradient from bright silver (#e8ecf1) through mid-grey (#c8cdd5) to darker slate (#a0a8b4). This creates a cylindrical light reflection effect. Near-black semi-bold text provides strong contrast against the light metallic surface. On hover the button dims slightly and emits a subtle silver glow shadow. Perfect for premium SaaS and financial products.`,
  },
  {
    name: 'Minimal',
    description: 'Text-only with an underline that draws in from the center on hover. The lightest-weight primary.',
    preview: (
      <button
        className="inline-flex items-center gap-2 rounded-none border-0 bg-transparent px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text)] [transition:color_0.2s,background-size_0.3s] hover:text-white [background-size:0%_2px] hover:[background-size:100%_2px]"
        style={{ background: 'linear-gradient(#c4b5fd,#c4b5fd) 50% 100% / 0% 2px no-repeat' }}
      >
        Get started →
      </button>
    ),
    code: `// Underline drawn via a background gradient that expands on hover
<button
  style={{ background: 'linear-gradient(#c4b5fd,#c4b5fd) 50% 100% / 0% 2px no-repeat' }}
  className="inline-flex items-center gap-2 rounded-none border-0
    bg-transparent px-4 py-[11px]
    text-[14px] font-semibold text-[var(--btn-text)]
    [transition:color_0.2s,background-size_0.3s]
    [background-size:0%_2px]
    hover:text-white
    hover:[background-size:100%_2px]">
  Get started →
</button>`,
    html: `<button class="btn-minimal">Get started →</button>`,
    css: `.btn-minimal {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 0;
  border: none;
  background: linear-gradient(#c4b5fd, #c4b5fd) 50% 100% / 0% 2px no-repeat;
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--btn-text);
  transition: color 0.2s, background-size 0.3s;
  cursor: pointer;
}
.btn-minimal:hover {
  color: #ffffff;
  background-size: 100% 2px;
}`,
    prompt: `Design the lightest-weight possible primary button — just text with no fill and no border. The visual anchor is a 2px lavender underline that expands from the center outward (0% width → 100% width) on hover using background-size transition on a gradient background. Off-white text brightens to pure white on hover. No border radius, no fill, no shadow — pure typographic elegance. Ideal for minimal interfaces where the primary CTA should not dominate.`,
  },
  {
    name: 'Liquid',
    description: 'Border-radius morphs into an organic blob on hover. Feels alive — like a drop of ink spreading.',
    preview: (
      <>
        <style>{`.btn-liquid-pv{border-radius:10px;transition:border-radius .5s cubic-bezier(.68,-.55,.27,1.55),box-shadow .5s}.btn-liquid-pv:hover{border-radius:30% 70% 70% 30% / 30% 30% 70% 70%;box-shadow:0 12px 32px -8px rgba(139,92,246,.5)}`}</style>
        <button
          className="btn-liquid-pv inline-flex items-center gap-2 border-0 px-5 py-[11px] text-[14px] font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)' }}
        >
          Get started →
        </button>
      </>
    ),
    code: `// Morphs border-radius into an organic blob on hover
<button
  style={{
    background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
    borderRadius: '10px',
    transition: 'border-radius 0.5s cubic-bezier(0.68,-0.55,0.27,1.55), box-shadow 0.5s',
  }}
  className="inline-flex items-center gap-2 border-0
    px-5 py-[11px] text-[14px] font-semibold text-white"
  onMouseEnter={e => e.currentTarget.style.borderRadius =
    '30% 70% 70% 30% / 30% 30% 70% 70%'}
  onMouseLeave={e => e.currentTarget.style.borderRadius = '10px'}>
  Get started →
</button>`,
    html: `<button class="btn-liquid">Get started →</button>`,
    css: `.btn-liquid {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #6d28d9, #8b5cf6);
  padding: 11px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  transition: border-radius 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55), box-shadow 0.5s;
  cursor: pointer;
}
.btn-liquid:hover {
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  box-shadow: 0 12px 32px -8px var(--btn-shadow-soft);
}`,
    prompt: `Design a morphing "liquid" button where the border-radius transitions from a clean 10px to an asymmetrical organic blob shape (30% 70% 70% 30% / 30% 30% 70% 70%) on hover using an overshoot cubic-bezier easing (0.68, -0.55, 0.27, 1.55). The button has a violet-to-purple diagonal gradient fill with white semi-bold text. On hover it also emits a purple glow shadow. The organic shape change feels like a drop of liquid spreading.`,
  },
  {
    name: 'Pixel',
    description: 'Pixelated stepped corners using clip-path. An 8-bit / retro gaming aesthetic.',
    preview: (
      <button
        className="inline-flex items-center gap-2 border-0 px-4 py-[11px] text-[14px] font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-[0_8px_24px_-6px_rgba(139,92,246,0.5)]"
        style={{
          background: 'linear-gradient(135deg, #6d28d9, #2e1065)',
          clipPath: 'polygon(0 6px, 6px 6px, 6px 0, calc(100% - 6px) 0, calc(100% - 6px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 6px), 0 calc(100% - 6px))',
        }}
      >
        Get started →
      </button>
    ),
    code: `<button
  style={{
    background: 'linear-gradient(135deg, #6d28d9, #2e1065)',
    clipPath: 'polygon(0 6px, 6px 6px, 6px 0, ' +
      'calc(100% - 6px) 0, calc(100% - 6px) 6px, 100% 6px, ' +
      '100% calc(100% - 6px), calc(100% - 6px) calc(100% - 6px), ' +
      'calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 6px), ' +
      '0 calc(100% - 6px))',
  }}
  className="inline-flex items-center gap-2 border-0
    px-4 py-[11px] text-[14px] font-semibold text-white
    transition-all duration-200
    hover:opacity-90
    hover:shadow-[0_8px_24px_-6px_rgba(139,92,246,0.5)]">
  Get started →
</button>`,
    html: `<button class="btn-pixel">Get started →</button>`,
    css: `.btn-pixel {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: linear-gradient(135deg, #6d28d9, #2e1065);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  clip-path: polygon(0 6px, 6px 6px, 6px 0, calc(100% - 6px) 0, calc(100% - 6px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 6px), 0 calc(100% - 6px));
  transition: opacity 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.btn-pixel:hover {
  opacity: 0.9;
  box-shadow: 0 8px 24px -6px rgba(139,92,246,0.5);
}`,
    prompt: `Design a button with pixelated stepped corners using clip-path: polygon() that carves 6px steps at every corner. The resulting shape has an 8-bit, retro gaming aesthetic — all corners are stair-stepped. Use a dark violet gradient fill (#6d28d9 → #2e1065) with white semi-bold text. No border needed since clip-path defines the shape. On hover, fade slightly and emit a purple shadow.`,
  },
  {
    name: 'Glitch',
    description: 'Chromatic aberration text split on hover. Cyan and magenta text-shadows offset in opposite directions.',
    preview: (
      <>
        <style>{`.btn-glitch-pv{transition:border-color .075s,text-shadow .075s}.btn-glitch-pv:hover{border-color:var(--btn-border-bright);text-shadow:2px 0 #ec4899,-2px 0 #38bdf8}`}</style>
        <button className="btn-glitch-pv inline-flex items-center gap-2 rounded-[10px] border border-white/[0.08] bg-[var(--btn-surface)] px-4 py-[11px] text-[14px] font-semibold text-white">
          Get started →
        </button>
      </>
    ),
    code: `// Chromatic aberration glitch — layered colored text-shadows on hover
<button
  style={{ transition: 'border-color 0.075s, text-shadow 0.075s' }}
  className="inline-flex items-center gap-2 rounded-[10px]
    border border-white/[0.08] bg-[var(--btn-surface)]
    px-4 py-[11px] text-[14px] font-semibold text-white"
  onMouseEnter={e => e.currentTarget.style.textShadow =
    '2px 0 #ec4899, -2px 0 #38bdf8'}
  onMouseLeave={e => e.currentTarget.style.textShadow = 'none'}>
  Get started →
</button>`,
    html: `<button class="btn-glitch">Get started →</button>`,
    css: `.btn-glitch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid var(--btn-border-subtle);
  background: var(--btn-surface);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  transition: border-color 0.075s, text-shadow 0.075s;
  cursor: pointer;
}
.btn-glitch:hover {
  border-color: var(--btn-border-bright);
  text-shadow: 2px 0 #ec4899, -2px 0 #38bdf8;
}`,
    prompt: `Design a glitch-effect button where the text splits into chromatic aberration on hover. Apply two offset text-shadows: magenta (#ec4899) shifted 2px right and cyan (#38bdf8) shifted 2px left, creating the illusion of RGB channel separation. The button itself is dark (#0c0c14) with a subtle white border that brightens on hover. The transition is a sharp 75ms — abrupt like a digital glitch. White base text stays visible between the colored offsets.`,
  },
  {
    name: 'Radial',
    description: 'Radial-gradient spotlight emanating from center. Light appears to shine from within the button.',
    preview: (
      <button
        className="inline-flex items-center gap-2 rounded-[10px] border-0 px-4 py-[11px] text-[14px] font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_32px_rgba(139,92,246,0.45)]"
        style={{ background: 'radial-gradient(circle at 50% 50%, #8b5cf6 0%, #4c1d95 45%, var(--btn-surface) 100%)' }}
      >
        Get started →
      </button>
    ),
    code: `<button
  style={{ background: 'radial-gradient(circle at 50% 50%, #8b5cf6 0%, #4c1d95 45%, var(--btn-surface) 100%)' }}
  className="inline-flex items-center gap-2 rounded-[10px] border-0
    px-4 py-[11px] text-[14px] font-semibold text-white
    transition-all duration-300
    hover:opacity-90
    hover:shadow-[0_0_32px_rgba(139,92,246,0.45)]">
  Get started →
</button>`,
    html: `<button class="btn-radial">Get started →</button>`,
    css: `.btn-radial {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: none;
  background: radial-gradient(circle at 50% 50%, #8b5cf6 0%, #4c1d95 45%, var(--btn-surface) 100%);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  transition: opacity 0.3s, box-shadow 0.3s;
  cursor: pointer;
}
.btn-radial:hover {
  opacity: 0.9;
  box-shadow: 0 0 32px rgba(139,92,246,0.45);
}`,
    prompt: `Design a button with a radial-gradient spotlight that emanates from the center outward. The gradient transitions from bright violet (#8b5cf6) at center through deep purple (#4c1d95) at 45% to near-black (#0c0c14) at edges, creating the illusion of inner light. White semi-bold text, 10px radius, no border. On hover the button dims slightly and emits a matching violet ambient glow. Distinct from linear gradients — this uses circular light falloff.`,
  },
  {
    name: 'Glare',
    description: 'A bright reflection stripe sweeps across on hover — like light gliding over polished glass.',
    preview: (
      <>
        <style>{`.btn-glare-pv{transition:background-position .6s,box-shadow .2s}.btn-glare-pv:hover{background-position:-20% 0;box-shadow:0 12px 28px -8px rgba(139,92,246,.5)}`}</style>
        <button
          className="btn-glare-pv inline-flex items-center gap-2 rounded-[10px] border-0 px-4 py-[11px] text-[14px] font-semibold text-white"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 100%) 120% 0 / 200% 100%, linear-gradient(135deg, #6d28d9, #8b5cf6)',
          }}
        >
          Get started →
        </button>
      </>
    ),
    code: `// A glare stripe sweeps across the button on hover
<button
  style={{
    background:
      'linear-gradient(90deg, transparent 0%, ' +
      'rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, ' +
      'rgba(255,255,255,0.15) 55%, transparent 100%) 120% 0 / 200% 100%, ' +
      'linear-gradient(135deg, #6d28d9, #8b5cf6)',
    transition: 'background-position 0.6s, box-shadow 0.2s',
  }}
  className="inline-flex items-center gap-2 rounded-[10px] border-0
    px-4 py-[11px] text-[14px] font-semibold text-white"
  onMouseEnter={e => e.currentTarget.style.backgroundPosition = '-20% 0'}
  onMouseLeave={e => e.currentTarget.style.backgroundPosition = '120% 0'}>
  Get started →
</button>`,
    html: `<button class="btn-glare">Get started →</button>`,
    css: `.btn-glare {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: none;
  background:
    linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 100%) 120% 0 / 200% 100%,
    linear-gradient(135deg, #6d28d9, #8b5cf6);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  transition: background-position 0.6s, box-shadow 0.2s;
  cursor: pointer;
}
.btn-glare:hover {
  background-position: -20% 0;
  box-shadow: 0 12px 28px -8px rgba(139,92,246,0.5);
}`,
    prompt: `Design a button with a glossy reflection stripe that sweeps across on hover. Layer a semi-transparent white stripe gradient (transparent→15%→25%→15%→transparent at 200% width) on top of a violet diagonal gradient. On hover, animate background-position from 120% to -20% over 0.6s, making the glare stripe glide from right to left across the button. The effect mimics light sliding over polished glass. Purple glow shadow on hover.`,
  },
  {
    name: 'Dashed',
    description: 'Dashed border outline. Airy, lightweight — completely different from every solid-border button.',
    preview: (
      <>
        <style>{`.btn-dashed-pv{border-color:var(--btn-border-accent);color:var(--btn-text-accent);transition:border-color .2s,color .2s}.btn-dashed-pv:hover{border-color:#c4b5fd;color:var(--btn-surface-white)}`}</style>
        <button className="btn-dashed-pv inline-flex items-center gap-2 rounded-[10px] border-2 border-dashed bg-transparent px-4 py-[10px] text-[14px] font-semibold">
          Get started →
        </button>
      </>
    ),
    code: `<button
  style={{ borderColor: 'rgba(196,181,253,0.45)', color: 'var(--btn-text-accent)' }}
  className="inline-flex items-center gap-2 rounded-[10px]
    border-2 border-dashed bg-transparent
    px-4 py-[10px] text-[14px] font-semibold"
  onMouseEnter={e => {
    e.currentTarget.style.borderColor = '#c4b5fd';
    e.currentTarget.style.color = '#ffffff';
  }}
  onMouseLeave={e => {
    e.currentTarget.style.borderColor = 'rgba(196,181,253,0.45)';
    e.currentTarget.style.color = '#c4b5fd';
  }}>
  Get started →
</button>`,
    html: `<button class="btn-dashed">Get started →</button>`,
    css: `.btn-dashed {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 2px dashed rgba(196,181,253,0.45);
  background: transparent;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--btn-text-accent);
  transition: border-color 0.2s, color 0.2s;
  cursor: pointer;
}
.btn-dashed:hover {
  border-color: var(--btn-text-accent);
  color: #ffffff;
}`,
    prompt: `Design a button with a dashed border — the only design using border-style: dashed. Transparent fill with a 2px dashed lavender border (45% opacity) and matching lavender text. On hover, the border solidifies to full lavender and the text brightens to white. 10px border radius so the dashes follow the rounded corners. Airy, lightweight, and completely distinct from every solid-border variant.`,
  },
  {
    name: 'Breathing',
    description: 'Continuously pulses scale and opacity in a slow breathing rhythm. Feels alive — like a heartbeat.',
    preview: (
      <>
        <style>{`.btn-breathe-pv{animation:btn-breathe 3s ease-in-out infinite}.btn-breathe-pv:hover{animation:none;background:var(--btn-surface-white);box-shadow:0 12px 28px -8px rgba(196,181,253,.5)}`}</style>
        <button className="btn-breathe-pv inline-flex items-center gap-2 rounded-[10px] border border-transparent bg-[var(--btn-surface-light)] px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text)]">
          Get started →
        </button>
      </>
    ),
    code: `// Requires @keyframes btn-breathe in globals.css:
// { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.04);opacity:0.65} }

<button
  style={{ animation: 'btn-breathe 3s ease-in-out infinite' }}
  className="inline-flex items-center gap-2 rounded-[10px]
    border border-transparent bg-[var(--btn-surface-light)]
    px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text-dark)]
    hover:bg-[var(--btn-surface-white)]
    hover:shadow-[0_12px_28px_-8px_var(--btn-shadow-soft)]"
  onMouseEnter={e => e.currentTarget.style.animation = 'none'}
  onMouseLeave={e => e.currentTarget.style.animation =
    'btn-breathe 3s ease-in-out infinite'}>
  Get started →
</button>`,
    html: `<button class="btn-breathing">Get started →</button>`,
    css: `@keyframes btn-breathe {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(1.04); opacity: 0.65; }
}
.btn-breathing {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: var(--btn-surface-light);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--btn-text-invert);
  animation: btn-breathe 3s ease-in-out infinite;
  cursor: pointer;
}
.btn-breathing:hover {
  animation: none;
  background: var(--btn-surface-white);
  box-shadow: 0 12px 28px -8px var(--btn-shadow-soft);
}`,
    prompt: `Design a breathing button that continuously pulses in a slow 3-second rhythm: inflating to 104% scale and fading to 65% opacity, then back. On hover the animation stops, the button brightens to pure white, and a purple glow shadow appears. Based on the Classic fill (#ededf0) with semi-bold near-black text. The breathing animation gives the button a living, organic quality — like a resting heartbeat. Cancels animation on hover so it stays solid when interacted with.`,
  },
  {
    name: 'Cutout',
    description: 'A 14px triangular notch cut from the bottom-right corner via clip-path. Architectural and precise.',
    preview: (
      <button
        className="inline-flex items-center gap-2 border-0 px-5 py-[11px] text-[14px] font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-[0_8px_24px_-6px_rgba(139,92,246,0.45)]"
        style={{
          background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)',
        }}
      >
        Get started →
      </button>
    ),
    code: `<button
  style={{
    background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), ' +
      'calc(100% - 14px) 100%, 0 100%)',
  }}
  className="inline-flex items-center gap-2 border-0
    px-5 py-[11px] text-[14px] font-semibold text-white
    transition-all duration-200
    hover:opacity-90
    hover:shadow-[0_8px_24px_-6px_rgba(139,92,246,0.45)]">
  Get started →
</button>`,
    html: `<button class="btn-cutout">Get started →</button>`,
    css: `.btn-cutout {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: linear-gradient(135deg, #6d28d9, #8b5cf6);
  padding: 11px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%);
  transition: opacity 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.btn-cutout:hover {
  opacity: 0.9;
  box-shadow: 0 8px 24px -6px rgba(139,92,246,0.45);
}`,
    prompt: `Design a button with a triangular notch cut from the bottom-right corner using clip-path: polygon(). The cut removes a 14px isosceles right triangle, creating an architectural, almost industrial aesthetic. Violet diagonal gradient fill with white semi-bold text. Slightly wider horizontal padding to compensate for the cut corner. On hover the button dims slightly and emits a purple shadow. No border needed — clip-path defines the entire silhouette.`,
  },
  {
    name: 'Flicker',
    description: 'Irregular neon glow flickers like a faulty fluorescent sign. Unpredictable, edgy, and hypnotic.',
    preview: (
      <>
        <style>{`.btn-flicker-pv{animation:btn-flicker 4s linear infinite}.btn-flicker-pv:hover{animation:none;box-shadow:0 0 28px rgba(196,181,253,.5),inset 0 0 24px rgba(196,181,253,.08)}`}</style>
        <button
          className="btn-flicker-pv inline-flex items-center gap-2 rounded-[10px] border px-4 py-[11px] text-[14px] font-medium"
          style={{ borderColor: 'rgba(196,181,253,0.55)', color: 'var(--btn-text-accent)', background: 'var(--btn-surface-4)', boxShadow: '0 0 14px var(--btn-shadow-soft), inset 0 0 14px var(--btn-border)' }}
        >
          Get started →
        </button>
      </>
    ),
    code: `// Requires @keyframes btn-flicker in globals.css — irregular glow flicker

<button
  style={{
    borderColor: 'rgba(196,181,253,0.55)',
    color: 'var(--btn-text-accent)',
    background: 'var(--btn-surface-4)',
    boxShadow: '0 0 14px var(--btn-shadow-soft), inset 0 0 14px var(--btn-border)',
    animation: 'btn-flicker 4s linear infinite',
  }}
  className="inline-flex items-center gap-2 rounded-[10px] border
    px-4 py-[11px] text-[14px] font-medium
    hover:shadow-[0_0_28px_rgba(196,181,253,0.5),inset_0_0_24px_rgba(196,181,253,0.08)]"
  onMouseEnter={e => e.currentTarget.style.animation = 'none'}
  onMouseLeave={e => e.currentTarget.style.animation =
    'btn-flicker 4s linear infinite'}>
  Get started →
</button>`,
    html: `<button class="btn-flicker">Get started →</button>`,
    css: `@keyframes btn-flicker {
  0%, 18%, 22%, 25%, 53%, 57%, 100% { box-shadow: 0 0 8px rgba(196,181,253,0.18); }
  20%, 24%, 55%                    { box-shadow: 0 0 28px rgba(196,181,253,0.7), 0 0 52px rgba(139,92,246,0.35); }
}
.btn-flicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid var(--btn-border-accent);
  background: var(--btn-surface-4);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--btn-text-accent);
  box-shadow: 0 0 8px rgba(196,181,253,0.18);
  animation: btn-flicker 4s linear infinite;
  cursor: pointer;
}
.btn-flicker:hover {
  animation: none;
  box-shadow: 0 0 28px rgba(196,181,253,0.5), inset 0 0 24px rgba(196,181,253,0.08);
}`,
    prompt: `Design a flickering neon button where the glow intensity jumps unpredictably — like a faulty sign. Based on the Neon design (dark bg #08021a, lavender border and text), but animate the box-shadow through irregular keyframes: dim at most stops, then suddenly bright at the 20%, 24%, and 55% marks of a 4-second loop. On hover the flicker stops and the glow stabilizes at full intensity. This creates an edgy, dystopian feel distinct from the smooth Neon variant.`,
  },
  {
    name: 'Hue Shift',
    description: 'Entire button shifts hue on hover via CSS filter. The color spectrum slides — like tuning a radio dial.',
    preview: (
      <>
        <style>{`.btn-hue-pv{filter:hue-rotate(0deg);transition:filter .7s,box-shadow .2s}.btn-hue-pv:hover{filter:hue-rotate(60deg);box-shadow:0 12px 28px -8px rgba(139,92,246,.5)}`}</style>
        <button
          className="btn-hue-pv inline-flex items-center gap-2 rounded-[10px] border-0 px-4 py-[11px] text-[14px] font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)' }}
        >
          Get started →
        </button>
      </>
    ),
    code: `// Entire button shifts through the color spectrum on hover
<button
  style={{
    background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
    filter: 'hue-rotate(0deg)',
    transition: 'filter 0.7s, box-shadow 0.2s',
  }}
  className="inline-flex items-center gap-2 rounded-[10px] border-0
    px-4 py-[11px] text-[14px] font-semibold text-white"
  onMouseEnter={e => e.currentTarget.style.filter = 'hue-rotate(60deg)'}
  onMouseLeave={e => e.currentTarget.style.filter = 'hue-rotate(0deg)'}>
  Get started →
</button>`,
    html: `<button class="btn-hue-shift">Get started →</button>`,
    css: `.btn-hue-shift {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #6d28d9, #8b5cf6);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  filter: hue-rotate(0deg);
  transition: filter 0.7s, box-shadow 0.2s;
  cursor: pointer;
}
.btn-hue-shift:hover {
  filter: hue-rotate(60deg);
  box-shadow: 0 12px 28px -8px rgba(139,92,246,0.5);
}`,
    prompt: `Design a button that shifts through the color spectrum on hover using CSS filter: hue-rotate(). Start at 0deg (violet/purple) and transition smoothly to 60deg over 0.7s, cycling the colors toward pinks and teals. The base is a violet diagonal gradient fill with white semi-bold text. On hover the button also emits a purple shadow. The slow hue rotation feels like tuning a radio dial — a completely different interaction model from opacity or transform-based hovers.`,
  },
  {
    name: 'Prismatic',
    description: 'Rainbow spectrum glow via layered colored box-shadows. Light refracting through a prism onto the button edge.',
    preview: (
      <>
        <style>{`.btn-pris-pv:hover{box-shadow:3px_0_10px_rgba(239,68,68,.45),-3px_0_10px_rgba(59,130,246,.45),0_3px_10px_rgba(34,197,94,.4),0_-3px_10px_rgba(168,85,247,.4),0_0_24px_rgba(196,181,253,.3)}`}</style>
        <button
          className="btn-pris-pv inline-flex items-center gap-2 rounded-[10px] border border-white/[0.08] bg-[var(--btn-surface)] px-4 py-[11px] text-[14px] font-semibold text-white transition-all duration-300"
          style={{ boxShadow: '0 0 0 0 transparent' }}
        >
          Get started →
        </button>
      </>
    ),
    code: `<button
  style={{ boxShadow: 'none' }}
  className="inline-flex items-center gap-2 rounded-[10px]
    border border-white/[0.08] bg-[var(--btn-surface)]
    px-4 py-[11px] text-[14px] font-semibold text-white
    transition-all duration-300"
  onMouseEnter={e => e.currentTarget.style.boxShadow =
    '3px 0 10px rgba(239,68,68,0.45), ' +
    '-3px 0 10px rgba(59,130,246,0.45), ' +
    '0 3px 10px rgba(34,197,94,0.4), ' +
    '0 -3px 10px rgba(168,85,247,0.4), ' +
    '0 0 24px rgba(196,181,253,0.3)'}
  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
  Get started →
</button>`,
    html: `<button class="btn-prismatic">Get started →</button>`,
    css: `.btn-prismatic {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid var(--btn-border-subtle);
  background: var(--btn-surface);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  transition: box-shadow 0.3s;
  cursor: pointer;
}
.btn-prismatic:hover {
  box-shadow:
    3px 0 10px rgba(239,68,68,0.45),
    -3px 0 10px rgba(59,130,246,0.45),
    0 3px 10px rgba(34,197,94,0.4),
    0 -3px 10px rgba(168,85,247,0.4),
    0 0 24px rgba(196,181,253,0.3);
}`,
    prompt: `Design a prismatic button where light appears to refract into a spectrum around the edges on hover. Use four directional box-shadows in red (right, #ef4444), blue (left, #3b82f6), green (bottom, #22c55e), and purple (top, #a855f7) with micro offsets, plus a soft lavender ambient glow. The button itself is near-black (#0c0c14) with a subtle white border. White semi-bold text. The rainbow edge glow creates a physics-inspired light dispersion effect.`,
  },
  {
    name: 'Ink Bleed',
    description: 'Dark ink spot spreads from center on hover, consuming the button. Organic, fluid, almost menacing.',
    preview: (
      <>
        <style>{`.btn-ink-pv{background:radial-gradient(circle at center,rgba(0,0,0,.65) 0,transparent 60%),linear-gradient(135deg,#6d28d9,#8b5cf6);background-size:0% 0%,100% 100%;background-repeat:no-repeat;transition:background-size .45s ease-out,box-shadow .3s}.btn-ink-pv:hover{background-size:350% 350%,100% 100%;box-shadow:0 12px 28px -8px rgba(139,92,246,.5)}`}</style>
        <button className="btn-ink-pv inline-flex items-center gap-2 rounded-[10px] border-0 px-4 py-[11px] text-[14px] font-semibold text-white">
          Get started →
        </button>
      </>
    ),
    code: `// Dark ink spot expands from center on hover via background-size
<button
  style={{
    background: 'radial-gradient(circle at center, rgba(0,0,0,0.65) 0, transparent 60%), linear-gradient(135deg, #6d28d9, #8b5cf6)',
    backgroundSize: '0% 0%, 100% 100%',
    backgroundRepeat: 'no-repeat',
    transition: 'background-size 0.45s ease-out, box-shadow 0.3s',
  }}
  className="inline-flex items-center gap-2 rounded-[10px] border-0
    px-4 py-[11px] text-[14px] font-semibold text-white"
  onMouseEnter={e => e.currentTarget.style.backgroundSize =
    '350% 350%, 100% 100%'}
  onMouseLeave={e => e.currentTarget.style.backgroundSize =
    '0% 0%, 100% 100%'}>
  Get started →
</button>`,
    html: `<button class="btn-ink-bleed">Get started →</button>`,
    css: `.btn-ink-bleed {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: none;
  background: radial-gradient(circle at center, rgba(0,0,0,0.65) 0, transparent 60%), linear-gradient(135deg, #6d28d9, #8b5cf6);
  background-size: 0% 0%, 100% 100%;
  background-repeat: no-repeat;
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  transition: background-size 0.45s ease-out, box-shadow 0.3s;
  cursor: pointer;
}
.btn-ink-bleed:hover {
  background-size: 350% 350%, 100% 100%;
  box-shadow: 0 12px 28px -8px rgba(139,92,246,0.5);
}`,
    prompt: `Design an ink-bleed button where a dark radial spot expands from the center outward on hover, consuming the vibrant violet gradient. Start with background-size 0% 0% for the ink layer (a near-black radial gradient) over a violet gradient fill. On hover, expand the ink to 350% 350% with an ease-out curve over 0.45s. The effect is organic and fluid — like a drop of ink spreading through paper. White semi-bold text remains readable as the dark spot passes beneath.`,
  },
  {
    name: 'Orbit',
    description: 'Three concentric dashed rings orbit at different speeds. Feels like an atomic model or planetary system.',
    preview: (
      <>
        <style>{`.btn-orbit-r1,.btn-orbit-r2,.btn-orbit-r3{position:absolute;inset:0;border-radius:10px;pointer-events:none}.btn-orbit-r1{outline:1px_dashed_rgba(196,181,253,.4);outline-offset:5px;animation:spin_4s linear infinite}.btn-orbit-r2{outline:1px_dashed_rgba(139,92,246,.3);outline-offset:10px;animation:spin_3s linear infinite reverse}.btn-orbit-r3{outline:1px_dashed_rgba(56,189,248,.25);outline-offset:15px;animation:spin_5s linear infinite}`}</style>
        <div className="relative inline-flex">
          <span className="btn-orbit-r1" />
          <span className="btn-orbit-r2" />
          <span className="btn-orbit-r3" />
          <button className="relative inline-flex items-center gap-2 rounded-[10px] border border-transparent bg-[var(--btn-surface)] px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text)] transition-all duration-200 hover:bg-[var(--btn-surface-2)]">
            Get started →
          </button>
        </div>
      </>
    ),
    code: `// Three concentric dashed rings orbiting at different speeds

<div className="relative inline-flex">
  <span className="absolute inset-0 rounded-[10px] pointer-events-none
    outline outline-1 outline-dashed outline-[rgba(196,181,253,0.4)]
    outline-offset-[5px] animate-[spin_4s_linear_infinite]" />
  <span className="absolute inset-0 rounded-[10px] pointer-events-none
    outline outline-1 outline-dashed outline-[rgba(139,92,246,0.3)]
    outline-offset-[10px] animate-[spin_3s_linear_infinite_reverse]" />
  <span className="absolute inset-0 rounded-[10px] pointer-events-none
    outline outline-1 outline-dashed outline-[rgba(56,189,248,0.25)]
    outline-offset-[15px] animate-[spin_5s_linear_infinite]" />
  <button className="relative inline-flex items-center gap-2 rounded-[10px]
    border border-transparent bg-[var(--btn-surface)]
    px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text)]
    transition-all duration-200 hover:bg-[var(--btn-surface-2)]">
    Get started →
  </button>
</div>`,
    html: `<div class="btn-orbit-wrapper">
  <span class="orbit-r1"></span>
  <span class="orbit-r2"></span>
  <span class="orbit-r3"></span>
  <button class="btn-orbit">Get started →</button>
</div>`,
    css: `.btn-orbit-wrapper {
  position: relative;
  display: inline-flex;
}
.orbit-r1, .orbit-r2, .orbit-r3 {
  position: absolute;
  inset: 0;
  border-radius: 10px;
  pointer-events: none;
}
.orbit-r1 {
  outline: 1px dashed rgba(196,181,253,0.4);
  outline-offset: 5px;
  animation: spin 4s linear infinite;
}
.orbit-r2 {
  outline: 1px dashed rgba(139,92,246,0.3);
  outline-offset: 10px;
  animation: spin 3s linear infinite reverse;
}
.orbit-r3 {
  outline: 1px dashed rgba(56,189,248,0.25);
  outline-offset: 15px;
  animation: spin 5s linear infinite;
}
.btn-orbit {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: var(--btn-surface);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--btn-text);
  transition: background 0.2s;
  cursor: pointer;
}
.btn-orbit:hover {
  background: var(--btn-surface-2);
}`,
    prompt: `Design a button surrounded by three orbiting concentric dashed rings at staggered distances (5px, 10px, 15px offset) and speeds (4s, 3s reverse, 5s). Use absolute-positioned spans behind the button with outline: dashed and outline-offset, animated with CSS spin. The rings are in lavender (#c4b5fd), violet (#8b5cf6), and cyan (#38bdf8) at decreasing opacities. The button itself is dark (#0c0c14) with off-white text. Feels like an atomic or planetary model.`,
  },
  {
    name: 'Holographic',
    description: 'Iridescent chromatic foil with 8-stop rainbow gradient. Shifts color depending on viewing angle illusion.',
    preview: (
      <>
        <style>{`.btn-holo-pv:hover{opacity:.85;box-shadow:0 12px 32px -8px rgba(236,72,153,.4)}`}</style>
        <button
          className="btn-holo-pv inline-flex items-center gap-2 rounded-[10px] border-0 px-4 py-[11px] text-[14px] font-semibold text-white transition-all duration-300"
          style={{ background: 'linear-gradient(125deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3)' }}
        >
          Get started →
        </button>
      </>
    ),
    code: `<button
  style={{ background: 'linear-gradient(125deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3)' }}
  className="inline-flex items-center gap-2 rounded-[10px] border-0
    px-4 py-[11px] text-[14px] font-semibold text-white
    transition-all duration-300
    hover:opacity-85
    hover:shadow-[0_12px_32px_-8px_rgba(236,72,153,0.4)]">
  Get started →
</button>`,
    html: `<button class="btn-holographic">Get started →</button>`,
    css: `.btn-holographic {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(125deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  transition: opacity 0.3s, box-shadow 0.3s;
  cursor: pointer;
}
.btn-holographic:hover {
  opacity: 0.85;
  box-shadow: 0 12px 32px -8px rgba(236,72,153,0.4);
}`,
    prompt: `Create a holographic/iridescent button using an 8-stop rainbow linear gradient at 125 degrees spanning red, orange, yellow, green, cyan, blue, magenta, and back to magenta. The full spectrum creates a chromatic foil illusion — like a holographic trading card. White semi-bold text, 10px radius, no border. On hover, dim to 85% opacity and emit a pink glow shadow. The multi-stop gradient is the star — no other design uses the full visible spectrum in one fill.`,
  },
  {
    name: 'Perspective',
    description: '3D card tilt on hover — rotates in X and Y axes with perspective. Feels like it lifts off the screen.',
    preview: (
      <>
        <style>{`.btn-persp-pv{transition:transform .45s cubic-bezier(.34,1.56,.64,1),box-shadow .3s}.btn-persp-pv:hover{transform:perspective(500px) rotateY(-8deg) rotateX(3deg) scale(1.04);box-shadow:0 16px 40px -12px rgba(139,92,246,.5)}`}</style>
        <button
          className="btn-persp-pv inline-flex items-center gap-2 rounded-[10px] border-0 px-4 py-[11px] text-[14px] font-semibold text-white shadow-[0_4px_14px_rgba(0,0,0,.3)]"
          style={{ background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)' }}
        >
          Get started →
        </button>
      </>
    ),
    code: `// 3D perspective tilt on hover
<button
  style={{
    background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
    transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)',
  }}
  className="inline-flex items-center gap-2 rounded-[10px] border-0
    px-4 py-[11px] text-[14px] font-semibold text-white
    shadow-[0_4px_14px_rgba(0,0,0,0.3)]"
  onMouseEnter={e => e.currentTarget.style.transform =
    'perspective(500px) rotateY(-8deg) rotateX(3deg) scale(1.04)'}
  onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
  Get started →
</button>`,
    html: `<button class="btn-perspective">Get started →</button>`,
    css: `.btn-perspective {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #6d28d9, #8b5cf6);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(0,0,0,0.3);
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s;
  cursor: pointer;
}
.btn-perspective:hover {
  transform: perspective(500px) rotateY(-8deg) rotateX(3deg) scale(1.04);
  box-shadow: 0 16px 40px -12px rgba(139,92,246,0.5);
}`,
    prompt: `Design a 3D perspective-tilt button using CSS perspective() and rotate transforms. On hover, apply perspective(500px) rotateY(-8deg) (tilting left edge away) and rotateX(3deg) (top edge away), plus a subtle scale(1.04). Use a spring-like cubic-bezier easing (0.34, 1.56, 0.64, 1) for an overshoot feel. Violet gradient fill with white text and a base shadow that deepens on hover. The 3D tilt creates genuine depth — distinct from 2D translate or scale transforms.`,
  },
  {
    name: 'Scan Line',
    description: 'A bright horizontal beam sweeps top-to-bottom continuously. CRT monitor / sci-fi scanner aesthetic.',
    preview: (
      <>
        <style>{`.btn-scan-pv{background:linear-gradient(to bottom,transparent 0,rgba(255,255,255,.06) 44%,rgba(255,255,255,.22) 48%,rgba(255,255,255,.35) 50%,rgba(255,255,255,.22) 52%,rgba(255,255,255,.06) 56%,transparent 100%) 0 -100%/100% 300% no-repeat,linear-gradient(135deg,#1a0533,#0d0330);animation:btn-scan 3s linear infinite}.btn-scan-pv:hover{animation:none}`}</style>
        <button className="btn-scan-pv inline-flex items-center gap-2 rounded-[10px] border border-white/[0.06] px-4 py-[11px] text-[14px] font-semibold text-white">
          Get started →
        </button>
      </>
    ),
    code: `// Requires @keyframes btn-scan in globals.css:
// { 0%{background-position:0 -100%} 100%{background-position:0 200%} }

<button
  style={{
    background: 'linear-gradient(to bottom, transparent 0, ' +
      'rgba(255,255,255,0.06) 44%, rgba(255,255,255,0.22) 48%, ' +
      'rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.22) 52%, ' +
      'rgba(255,255,255,0.06) 56%, transparent 100%) ' +
      '0 -100% / 100% 300% no-repeat, ' +
      'linear-gradient(135deg, #1a0533, #0d0330)',
    animation: 'btn-scan 3s linear infinite',
  }}
  className="inline-flex items-center gap-2 rounded-[10px]
    border border-white/[0.06]
    px-4 py-[11px] text-[14px] font-semibold text-white"
  onMouseEnter={e => e.currentTarget.style.animation = 'none'}
  onMouseLeave={e => e.currentTarget.style.animation =
    'btn-scan 3s linear infinite'}>
  Get started →
</button>`,
    html: `<button class="btn-scan-line">Get started →</button>`,
    css: `@keyframes btn-scan {
  0%   { background-position: 0 -100%; }
  100% { background-position: 0 200%; }
}
.btn-scan-line {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid var(--btn-border-subtle);
  background:
    linear-gradient(to bottom, transparent 0, rgba(255,255,255,0.06) 44%, rgba(255,255,255,0.22) 48%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.22) 52%, rgba(255,255,255,0.06) 56%, transparent 100%) 0 -100% / 100% 300% no-repeat,
    linear-gradient(135deg, #1a0533, #0d0330);
  animation: btn-scan 3s linear infinite;
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
}
.btn-scan-line:hover {
  animation: none;
}`,
    prompt: `Design a CRT scan-line button where a luminous horizontal beam sweeps continuously from top to bottom. Layer a semi-transparent white stripe gradient (with a bright 35% peak flanked by soft 6% edges) over a deep dark violet fill. Set background-size to 300% height and animate background-position from -100% to 200% over 3 seconds. A subtle 6% white border frames the dark interior. The scan pauses on hover. Distinct from Shimmer which sweeps horizontally — this moves vertically like a monitor scan.`,
  },
  {
    name: 'Strobe',
    description: 'Rapid strobe flash using step-end keyframes. Jarring, nightclub energy — maximum attention grabber.',
    preview: (
      <>
        <style>{`.btn-strobe-pv{animation:btn-strobe .6s step-end infinite}.btn-strobe-pv:hover{animation:none}`}</style>
        <button
          className="btn-strobe-pv inline-flex items-center gap-2 rounded-[10px] border-0 px-4 py-[11px] text-[14px] font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)' }}
        >
          Get started →
        </button>
      </>
    ),
    code: `// Requires @keyframes btn-strobe in globals.css:
// { 0%,4%,8%,100%{opacity:1} 2%,6%{opacity:0.15} }

<button
  style={{
    background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
    animation: 'btn-strobe 0.6s step-end infinite',
  }}
  className="inline-flex items-center gap-2 rounded-[10px] border-0
    px-4 py-[11px] text-[14px] font-semibold text-white"
  onMouseEnter={e => e.currentTarget.style.animation = 'none'}
  onMouseLeave={e => e.currentTarget.style.animation =
    'btn-strobe 0.6s step-end infinite'}>
  Get started →
</button>`,
    html: `<button class="btn-strobe">Get started →</button>`,
    css: `@keyframes btn-strobe {
  0%, 4%, 8%, 100% { opacity: 1; }
  2%, 6%            { opacity: 0.15; }
}
.btn-strobe {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #6d28d9, #8b5cf6);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  animation: btn-strobe 0.6s step-end infinite;
  cursor: pointer;
}
.btn-strobe:hover {
  animation: none;
}`,
    prompt: `Design a strobe-flash button that rapidly blinks between full opacity and 15% using step-end keyframes — no smooth transition, just hard cuts. Use a 0.6s loop with flashes at the 2% and 6% marks (each lasting ~12ms). The base is a violet gradient fill with white semi-bold text. On hover the strobe stops and the button stays solid. The aggressive, rhythmic flashing creates nightclub/rave energy — completely different from smooth breathing or flicker animations.`,
  },
  {
    name: 'Magnetic',
    description: 'Pulsing aura breathes around the button rim. Feels like a magnetic field expanding and contracting.',
    preview: (
      <>
        <style>{`.btn-mag-pv{animation:btn-magnetic 2.5s ease-in-out infinite}.btn-mag-pv:hover{animation:none;box-shadow:0 0 36px rgba(196,181,253,.7),0 0 0 5px rgba(196,181,253,.45)}`}</style>
        <button className="btn-mag-pv inline-flex items-center gap-2 rounded-[10px] border border-transparent bg-[var(--btn-surface)] px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text)]">
          Get started →
        </button>
      </>
    ),
    code: `// Requires @keyframes btn-magnetic in globals.css:
// { 0%,100%{box-shadow:0 0 6px ...,0 0 0 1px ...} 50%{box-shadow:0 0 28px ...,0 0 0 4px ...} }

<button
  style={{ animation: 'btn-magnetic 2.5s ease-in-out infinite' }}
  className="inline-flex items-center gap-2 rounded-[10px]
    border border-transparent bg-[var(--btn-surface)]
    px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text)]"
  onMouseEnter={e => {
    e.currentTarget.style.animation = 'none';
    e.currentTarget.style.boxShadow =
      '0 0 36px rgba(196,181,253,0.7), 0 0 0 5px rgba(196,181,253,0.45)';
  }}
  onMouseLeave={e => {
    e.currentTarget.style.boxShadow = '';
    e.currentTarget.style.animation =
      'btn-magnetic 2.5s ease-in-out infinite';
  }}>
  Get started →
</button>`,
    html: `<button class="btn-magnetic">Get started →</button>`,
    css: `@keyframes btn-magnetic {
  0%, 100% { box-shadow: 0 0 6px rgba(196,181,253,0.25), 0 0 0 1px rgba(196,181,253,0.15); }
  50%      { box-shadow: 0 0 28px rgba(196,181,253,0.6), 0 0 0 4px rgba(196,181,253,0.35); }
}
.btn-magnetic {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: var(--btn-surface);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--btn-text);
  animation: btn-magnetic 2.5s ease-in-out infinite;
  cursor: pointer;
}
.btn-magnetic:hover {
  animation: none;
  box-shadow: 0 0 36px rgba(196,181,253,0.7), 0 0 0 5px rgba(196,181,253,0.45);
}`,
    prompt: `Design a magnetic-field button where a glowing aura ring pulses outward and inward like a breathing magnetic field. Animate two layered box-shadows: an ambient glow (6px → 28px blur) and a solid ring (1px → 4px spread) that expand and contract in a 2.5s ease-in-out cycle. The button itself is dark (#0c0c14) with off-white text. On hover, the animation stops and the aura locks at max intensity. Distinct from Breathing (which scales the button itself) — this animates only the surrounding energy field.`,
  },
  {
    name: 'Velocity',
    description: 'Chevron speed-lines slide diagonally. Manga / comic action energy — the button feels fast even at rest.',
    preview: (
      <>
        <style>{`.btn-vel-pv{background:repeating-linear-gradient(45deg,transparent,transparent 4px,rgba(255,255,255,.07) 4px,rgba(255,255,255,.07) 6px),repeating-linear-gradient(-45deg,transparent,transparent 3px,rgba(255,255,255,.05) 3px,rgba(255,255,255,.05) 5px),linear-gradient(135deg,#6d28d9,#2e1065);background-size:12px 12px,10px 10px,100% 100%;animation:btn-stripe-slide .6s linear infinite}.btn-vel-pv:hover{animation:none}`}</style>
        <button className="btn-vel-pv inline-flex items-center gap-2 rounded-[10px] border-0 px-4 py-[11px] text-[14px] font-semibold text-white">
          Get started →
        </button>
      </>
    ),
    code: `// Chevron speed-lines slide diagonally — uses existing btn-stripe-slide keyframes

<button
  style={{
    background:
      'repeating-linear-gradient(45deg, transparent, transparent 4px, ' +
      'rgba(255,255,255,0.07) 4px, rgba(255,255,255,0.07) 6px), ' +
      'repeating-linear-gradient(-45deg, transparent, transparent 3px, ' +
      'rgba(255,255,255,0.05) 3px, rgba(255,255,255,0.05) 5px), ' +
      'linear-gradient(135deg, #6d28d9, #2e1065)',
    backgroundSize: '12px 12px, 10px 10px, 100% 100%',
    animation: 'btn-stripe-slide 0.6s linear infinite',
  }}
  className="inline-flex items-center gap-2 rounded-[10px] border-0
    px-4 py-[11px] text-[14px] font-semibold text-white"
  onMouseEnter={e => e.currentTarget.style.animation = 'none'}
  onMouseLeave={e => e.currentTarget.style.animation =
    'btn-stripe-slide 0.6s linear infinite'}>
  Get started →
</button>`,
    html: `<button class="btn-velocity">Get started →</button>`,
    css: `.btn-velocity {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: none;
  background:
    repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.07) 4px, rgba(255,255,255,0.07) 6px),
    repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.05) 3px, rgba(255,255,255,0.05) 5px),
    linear-gradient(135deg, #6d28d9, #2e1065);
  background-size: 12px 12px, 10px 10px, 100% 100%;
  animation: btn-stripe-slide 0.6s linear infinite;
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
}
.btn-velocity:hover {
  animation: none;
}`,
    prompt: `Design a manga-style velocity button with two layers of chevron speed-lines sliding at different angles (45° and -45°) and densities. Use repeating-linear-gradient with semi-transparent white stripes over a dark violet gradient fill. Animate background-position using the existing btn-stripe-slide keyframe at 0.6s for rapid motion. White semi-bold text, 10px radius, no border. The dual-angle chevrons create comic-book action energy — distinct from Stripe which uses single-angle blocks.`,
  },
  {
    name: 'Neon Sign',
    description: 'Realistic neon glass tube simulation. Multi-layer text-shadow builds a glowing tube with a soft outer halo.',
    preview: (
      <>
        <style>{`.btn-neon-sign-pv{text-shadow:0 0 7px #fff,0 0 10px #fff,0 0 21px #fff,0 0 42px #c4b5fd,0 0 70px #c4b5fd,0 0 90px #c4b5fd,0 0 120px #8b5cf6;transition:text-shadow .3s}.btn-neon-sign-pv:hover{text-shadow:0 0 7px #fff,0 0 10px #fff,0 0 21px #fff,0 0 42px #c4b5fd,0 0 80px #c4b5fd,0 0 110px #c4b5fd,0 0 150px #8b5cf6,0 0 200px #6d28d9}`}</style>
        <button className="btn-neon-sign-pv inline-flex items-center gap-2 rounded-[10px] border border-white/[0.06] bg-[var(--btn-surface-4)] px-4 py-[11px] text-[14px] font-semibold text-white">
          Get started →
        </button>
      </>
    ),
    code: `// Multi-layer text-shadow simulates a neon glass tube

<button
  className="inline-flex items-center gap-2 rounded-[10px]
    border border-white/[0.06] bg-[var(--btn-surface-4)]
    px-4 py-[11px] text-[14px] font-semibold text-white"
  style={{ textShadow:
    '0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, ' +
    '0 0 42px #c4b5fd, 0 0 70px #c4b5fd, ' +
    '0 0 90px #c4b5fd, 0 0 120px #8b5cf6' }}
  onMouseEnter={e => e.currentTarget.style.textShadow =
    '0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, ' +
    '0 0 42px #c4b5fd, 0 0 80px #c4b5fd, ' +
    '0 0 110px #c4b5fd, 0 0 150px #8b5cf6, 0 0 200px #6d28d9'}
  onMouseLeave={e => e.currentTarget.style.textShadow =
    '0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, ' +
    '0 0 42px #c4b5fd, 0 0 70px #c4b5fd, ' +
    '0 0 90px #c4b5fd, 0 0 120px #8b5cf6'}>
  Get started →
</button>`,
    html: `<button class="btn-neon-sign">Get started →</button>`,
    css: `.btn-neon-sign {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid var(--btn-border-subtle);
  background: var(--btn-surface-4);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  text-shadow:
    0 0 7px #fff,
    0 0 10px #fff,
    0 0 21px #fff,
    0 0 42px #c4b5fd,
    0 0 70px #c4b5fd,
    0 0 90px #c4b5fd,
    0 0 120px #8b5cf6;
  transition: text-shadow 0.3s;
  cursor: pointer;
}
.btn-neon-sign:hover {
  text-shadow:
    0 0 7px #fff,
    0 0 10px #fff,
    0 0 21px #fff,
    0 0 42px #c4b5fd,
    0 0 80px #c4b5fd,
    0 0 110px #c4b5fd,
    0 0 150px #8b5cf6,
    0 0 200px #6d28d9;
}`,
    prompt: `Design a realistic neon sign button using seven layered text-shadows to simulate a glass tube: a tight white hot-core (7px, 10px), a warm white tube glow (21px), then expanding lavender halos (42px, 70px, 90px) and a deep violet outer scatter (120px). The text appears to be made of glowing gas inside a glass tube. Dark navy background (#08021a) with a barely-visible border. On hover the glow intensifies with larger blur radii. Distinct from Text Glow which uses only two shadows — this builds a complete neon tube illusion.`,
  },
  {
    name: 'Border Draw',
    description: 'Two border lines draw from opposite corners on hover using ::before and ::after. Elegant reveal animation.',
    preview: (
      <>
        <style>{`.btn-borderdraw-pv{position:relative;overflow:hidden;z-index:1}.btn-borderdraw-pv::before,.btn-borderdraw-pv::after{content:'';position:absolute;background:var(--btn-accent);transition:width .3s ease,height .3s ease .3s;z-index:-1}.btn-borderdraw-pv::before{width:0;height:2px;top:0;right:0}.btn-borderdraw-pv::after{width:0;height:2px;bottom:0;left:0}.btn-borderdraw-pv:hover::before{width:100%;height:2px}.btn-borderdraw-pv:hover::after{width:100%;height:2px}`}</style>
        <button className="btn-borderdraw-pv inline-flex items-center gap-2 rounded-none border-0 bg-transparent px-5 py-[11px] text-[14px] font-semibold text-[var(--btn-text)] transition-colors duration-300 hover:text-white">
          Get started →
        </button>
      </>
    ),
    code: `// Border lines draw from opposite corners on hover
<button className="relative overflow-hidden z-[1] inline-flex
  items-center gap-2 rounded-none border-0 bg-transparent
  px-5 py-[11px] text-[14px] font-semibold text-[var(--btn-text)]
  transition-colors duration-300 hover:text-white
  [&::before]:absolute [&::before]:content-['']
  [&::before]:top-0 [&::before]:right-0
  [&::before]:h-[2px] [&::before]:w-0
  [&::before]:bg-[#c4b5fd] [&::before]:z-[-1]
  [&::before]:transition-[width_.3s,height_.3s_.3s]
  [&]:hover:[&::before]:w-full
  [&::after]:absolute [&::after]:content-['']
  [&::after]:bottom-0 [&::after]:left-0
  [&::after]:h-[2px] [&::after]:w-0
  [&::after]:bg-[#c4b5fd] [&::after]:z-[-1]
  [&]:hover:[&::after]:w-full">
  Get started →
</button>`,
    html: `<button class="btn-border-draw">Get started →</button>`,
    css: `.btn-border-draw {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 0;
  border: none;
  background: transparent;
  padding: 11px 20px;
  font-size: 14px;
  font-weight: 600;
  color: var(--btn-text);
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: color 0.3s;
  cursor: pointer;
}
.btn-border-draw::before,
.btn-border-draw::after {
  content: '';
  position: absolute;
  background: #c4b5fd;
  transition: width 0.3s ease, height 0.3s ease 0.3s;
  z-index: -1;
}
.btn-border-draw::before {
  width: 0;
  height: 2px;
  top: 0;
  right: 0;
}
.btn-border-draw::after {
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
}
.btn-border-draw:hover {
  color: #ffffff;
}
.btn-border-draw:hover::before,
.btn-border-draw:hover::after {
  width: 100%;
}`,
    prompt: `Design a border-draw animation button where two 2px lavender lines (#c4b5fd) animate in from opposite corners using ::before (top-right → left) and ::after (bottom-left → right). The button has transparent fill, zero border-radius, and off-white text that brightens on hover. The lines use width transitions to create a "drawing" effect. No fill, no shadow — pure typographic restraint with animated edges. Inspired by neumorphic reveal patterns but adapted for dark UI.`,
  },
  {
    name: 'Slide Fill',
    description: 'Background fills upward from bottom on hover via ::after. The fill rises like liquid — smooth and satisfying.',
    preview: (
      <>
        <style>{`.btn-slidefill-pv{position:relative;overflow:hidden;z-index:1}.btn-slidefill-pv::after{content:'';position:absolute;bottom:0;left:0;width:100%;height:0;background:linear-gradient(0deg,var(--btn-accent-3),var(--btn-accent-2));transition:height .4s ease;z-index:-1;border-radius:10px}.btn-slidefill-pv:hover::after{height:100%}`}</style>
        <button className="btn-slidefill-pv inline-flex items-center gap-2 rounded-[10px] border-0 bg-transparent px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text)] transition-colors duration-300 hover:text-white">
          Get started →
        </button>
      </>
    ),
    code: `// Background slides up from bottom on hover via ::after
<button className="relative overflow-hidden z-[1] inline-flex
  items-center gap-2 rounded-[10px] border-0 bg-transparent
  px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text)]
  transition-colors duration-300 hover:text-white
  after:absolute after:bottom-0 after:left-0
  after:w-full after:h-0
  after:bg-gradient-to-t from-[#6d28d9] to-[#8b5cf6]
  after:transition-[height_.4s] after:z-[-1]
  after:rounded-[10px]
  hover:after:h-full">
  Get started →
</button>`,
    html: `<button class="btn-slide-fill">Get started →</button>`,
    css: `.btn-slide-fill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: none;
  background: transparent;
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--btn-text);
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: color 0.3s;
  cursor: pointer;
}
.btn-slide-fill::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0;
  background: linear-gradient(0deg, #6d28d9, #8b5cf6);
  transition: height 0.4s ease;
  z-index: -1;
  border-radius: 10px;
}
.btn-slide-fill:hover {
  color: #ffffff;
}
.btn-slide-fill:hover::after {
  height: 100%;
}`,
    prompt: `Design a slide-fill button where a gradient fill (violet #6d28d9 to purple #8b5cf6, bottom to top) rises from the bottom edge on hover using ::after with a height transition from 0 to 100%. The button starts transparent with off-white text; on hover the gradient fills the entire button and the text brightens to white. The ::after element has the same 10px border-radius and sits behind the text at z-index: -1. The fill rises like liquid — a 0.4s ease transition creates a smooth, satisfying effect.`,
  },
  {
    name: 'Scale Burst',
    description: 'A gradient layer behind the button scales from 0 to 100% on hover with a 90° rotation. Dramatic reveal effect.',
    preview: (
      <>
        <style>{`.btn-burst-pv{position:relative;overflow:hidden;z-index:1}.btn-burst-pv::after{content:'';position:absolute;top:50%;left:50%;width:100%;height:100%;background:linear-gradient(135deg,var(--btn-accent-3),var(--btn-cyan));transform:translate(-50%,-50%) scale(0) rotate(90deg);border-radius:10px;transition:transform .5s cubic-bezier(.34,1.56,.64,1);z-index:-1}.btn-burst-pv:hover::after{transform:translate(-50%,-50%) scale(1) rotate(0deg)}`}</style>
        <button className="btn-burst-pv inline-flex items-center gap-2 rounded-[10px] border border-white/[0.12] bg-transparent px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text)] transition-colors duration-300 hover:text-white">
          Get started →
        </button>
      </>
    ),
    code: `// Gradient burst scales from center with rotation on hover
<button className="relative overflow-hidden z-[1] inline-flex
  items-center gap-2 rounded-[10px]
  border border-white/[0.12] bg-transparent
  px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text)]
  transition-colors duration-300 hover:text-white">
  Get started →
</button>

// CSS for ::after pseudo-element:
// .btn::after {
//   content: ''; position: absolute;
//   top: 50%; left: 50%;
//   width: 100%; height: 100%;
//   background: linear-gradient(135deg, #6d28d9, #38bdf8);
//   transform: translate(-50%,-50%) scale(0) rotate(90deg);
//   border-radius: 10px;
//   transition: transform .5s cubic-bezier(.34,1.56,.64,1);
//   z-index: -1;
// }
// .btn:hover::after {
//   transform: translate(-50%,-50%) scale(1) rotate(0deg);
// }`,
    html: `<button class="btn-scale-burst">Get started →</button>`,
    css: `.btn-scale-burst {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid var(--btn-border);
  background: transparent;
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--btn-text);
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: color 0.3s;
  cursor: pointer;
}
.btn-scale-burst::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #6d28d9, #38bdf8);
  transform: translate(-50%, -50%) scale(0) rotate(90deg);
  border-radius: 10px;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: -1;
}
.btn-scale-burst:hover {
  color: #ffffff;
}
.btn-scale-burst:hover::after {
  transform: translate(-50%, -50%) scale(1) rotate(0deg);
}`,
    prompt: `Design a scale-burst button where a gradient fill layer (::after, positioned center with scale(0) and rotate(90deg)) expands to fill the entire button on hover with a spring-like cubic-bezier overshoot (0.34, 1.56, 0.64, 1). The burst rotates from 90° to 0° as it scales, creating a dramatic entrance. The button starts transparent with a subtle 12% white border and off-white text. On hover, text brightens to white. The 0.5s transition overshoots slightly before settling for a playful, energetic feel.`,
  },
  {
    name: 'Shine Sweep',
    description: 'A bright diagonal glare stripe sweeps across continuously. Polished, premium — like light on glass.',
    preview: (
      <>
        <style>{`.btn-shine-pv{position:relative;overflow:hidden;z-index:1}.btn-shine-pv::after{content:'';position:absolute;top:-50%;left:-60%;width:40%;height:200%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),rgba(255,255,255,.35),rgba(255,255,255,.18),transparent);transform:skewX(-20deg);animation:btn-shine-sweep 3s ease-in-out infinite;z-index:1;pointer-events:none}`}</style>
        <button
          className="btn-shine-pv inline-flex items-center gap-2 rounded-[10px] border-0 px-4 py-[11px] text-[14px] font-semibold text-white relative z-[2]"
          style={{ background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)' }}
        >
          Get started →
        </button>
      </>
    ),
    code: `// Requires @keyframes btn-shine-sweep in globals.css:
// { 0%{left:-60%} 100%{left:120%} }

<button
  style={{ background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)' }}
  className="relative overflow-hidden z-[1] inline-flex items-center
    gap-2 rounded-[10px] border-0 px-4 py-[11px]
    text-[14px] font-semibold text-white">
  Get started →
</button>

// CSS for ::after:
// .btn::after {
//   content: ''; position: absolute;
//   top: -50%; left: -60%;
//   width: 40%; height: 200%;
//   background: linear-gradient(90deg, transparent,
//     rgba(255,255,255,0.18), rgba(255,255,255,0.35),
//     rgba(255,255,255,0.18), transparent);
//   transform: skewX(-20deg);
//   animation: btn-shine-sweep 3s ease-in-out infinite;
//   z-index: 1;
//   pointer-events: none;
// }`,
    html: `<button class="btn-shine-sweep">Get started →</button>`,
    css: `@keyframes btn-shine-sweep {
  0%   { left: -60%; }
  100% { left: 120%; }
}
.btn-shine-sweep {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #6d28d9, #8b5cf6);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  position: relative;
  overflow: hidden;
  z-index: 1;
  cursor: pointer;
}
.btn-shine-sweep::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -60%;
  width: 40%;
  height: 200%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), rgba(255,255,255,0.35), rgba(255,255,255,0.18), transparent);
  transform: skewX(-20deg);
  animation: btn-shine-sweep 3s ease-in-out infinite;
  z-index: 1;
  pointer-events: none;
}`,
    prompt: `Design a shine-sweep button where a bright diagonal glare stripe continuously sweeps from left to right using ::after. The stripe is a 40% wide, 200% tall gradient (transparent → 18% white → 35% white → 18% white → transparent) skewed -20° and animated from left:-60% to left:120% over 3 seconds. The button has a violet gradient fill with white text, overflow:hidden, and z-index layering to keep the text above. Distinct from Glare (which sweeps on hover) — this sweeps continuously for a premium, always-alive feel.`,
  },
  {
    name: 'Neumorphic',
    description: 'Dark neumorphic raised-surface effect. Soft outer + inner shadows create a tactile 3D feel on dark backgrounds.',
    preview: (
      <>
        <style>{`.btn-neumorph-pv:hover{box-shadow:inset 2px 2px 4px var(--btn-shadow-deep),inset -2px -2px 4px var(--btn-border-subtle)}`}</style>
        <button
          className="btn-neumorph-pv inline-flex items-center gap-2 rounded-[10px] border-0 px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text)] transition-shadow duration-200"
          style={{ background: '#14141e', boxShadow: '4px 4px 10px var(--btn-shadow-deep), -4px -4px 10px var(--btn-border-subtle), inset 1px 1px 2px var(--btn-border-subtle)' }}
        >
          Get started →
        </button>
      </>
    ),
    code: `// Dark neumorphic raised button
<button
  style={{
    background: '#14141e',
    boxShadow:
      '4px 4px 10px rgba(0,0,0,0.5), ' +
      '-4px -4px 10px rgba(255,255,255,0.03), ' +
      'inset 1px 1px 2px rgba(255,255,255,0.02)',
    transition: 'box-shadow 0.2s',
  }}
  className="inline-flex items-center gap-2 rounded-[10px] border-0
    px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text)]">
  Get started →
</button>`,
    html: `<button class="btn-neumorphic">Get started →</button>`,
    css: `.btn-neumorphic {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: none;
  background: var(--btn-surface-2);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--btn-text);
  box-shadow:
    4px 4px 10px rgba(0,0,0,0.5),
    -4px -4px 10px rgba(255,255,255,0.03),
    inset 1px 1px 2px rgba(255,255,255,0.02);
  transition: box-shadow 0.2s;
  cursor: pointer;
}
.btn-neumorphic:hover {
  box-shadow:
    inset 2px 2px 4px rgba(0,0,0,0.6),
    inset -2px -2px 4px rgba(255,255,255,0.04);
}`,
    prompt: `Design a dark neumorphic button adapted for the Ghost UI dark theme. The raised state uses dual outer shadows: a dark shadow (4px 4px 10px black at 50%) on the bottom-right and a faint reverse light shadow (-4px -4px 10px white at 3%) on the top-left, plus a subtle inner highlight. The surface color (#14141e) matches the surrounding darkness. On hover, the outer shadows vanish and are replaced by inset shadows (inset 2px 2px 4px black at 60%, inset -2px -2px 4px white at 4%), making the button appear to press inward. This creates a tactile, physical feel.`,
  },
  {
    name: 'Reveal Fill',
    description: 'Background slides in from the left on hover via ::after. Content stays in front — clean directional fill.',
    preview: (
      <>
        <style>{`.btn-reveal-pv{position:relative;overflow:hidden;z-index:1}.btn-reveal-pv::after{content:'';position:absolute;top:0;left:0;width:0;height:100%;background:var(--btn-accent);transition:width .4s cubic-bezier(.65,0,.35,1);z-index:-1;border-radius:10px}.btn-reveal-pv:hover::after{width:100%}`}</style>
        <button className="btn-reveal-pv inline-flex items-center gap-2 rounded-[10px] border border-white/[0.12] bg-transparent px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text)] transition-colors duration-300 hover:text-[var(--btn-text-dark)]">
          Get started →
        </button>
      </>
    ),
    code: `// Background slides in from left via ::after
<button className="relative overflow-hidden z-[1] inline-flex
  items-center gap-2 rounded-[10px]
  border border-white/[0.12] bg-transparent
  px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text)]
  transition-colors duration-300
  hover:text-[var(--btn-text-dark)]">
  Get started →
</button>

// CSS for ::after:
// .btn::after {
//   content: ''; position: absolute;
//   top: 0; left: 0; width: 0; height: 100%;
//   background: #c4b5fd;
//   transition: width 0.4s cubic-bezier(0.65,0,0.35,1);
//   z-index: -1; border-radius: 10px;
// }
// .btn:hover::after { width: 100%; }`,
    html: `<button class="btn-reveal-fill">Get started →</button>`,
    css: `.btn-reveal-fill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid var(--btn-border);
  background: transparent;
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--btn-text);
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: color 0.3s;
  cursor: pointer;
}
.btn-reveal-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: #c4b5fd;
  transition: width 0.4s cubic-bezier(0.65, 0, 0.35, 1);
  z-index: -1;
  border-radius: 10px;
}
.btn-reveal-fill:hover {
  color: var(--btn-text-dark);
}
.btn-reveal-fill:hover::after {
  width: 100%;
}`,
    prompt: `Design a reveal-fill button where a solid lavender (#c4b5fd) background slides in from the left edge on hover using ::after with a width transition from 0 to 100%. The cubic-bezier easing (0.65, 0, 0.35, 1) creates a smooth ease-in-out feel. The button starts transparent with a 12% white border and off-white text. On hover, text flips to near-black (#0a0a10) for contrast over the lavender fill. The fill sweeps behind the text (z-index: -1) at the same 10px border-radius, creating a clean directional wipe effect.`,
  },
  {
    name: 'Curtains',
    description: 'Two halves slide apart from center on hover, revealing a gradient behind. Theatrical curtain-open reveal.',
    preview: (
      <>
        <style>{`.btn-curtain-pv{position:relative;overflow:hidden;z-index:1}.btn-curtain-pv::before,.btn-curtain-pv::after{content:'';position:absolute;top:0;height:100%;width:50%;background:var(--btn-surface-2);transition:transform .5s cubic-bezier(.77,0,.18,1);z-index:0}.btn-curtain-pv::before{left:0;transform:translateX(0)}.btn-curtain-pv::after{right:0;transform:translateX(0)}.btn-curtain-pv:hover::before{transform:translateX(-100%)}.btn-curtain-pv:hover::after{transform:translateX(100%)}`}</style>
        <button
          className="btn-curtain-pv inline-flex items-center gap-2 rounded-[10px] border border-white/[0.12] px-4 py-[11px] text-[14px] font-semibold text-white relative z-[2]"
          style={{ background: 'linear-gradient(135deg, #6d28d9, #8b5cf6, #38bdf8)' }}
        >
          Get started →
        </button>
      </>
    ),
    code: `// Two halves slide apart on hover like curtains
<button
  style={{ background: 'linear-gradient(135deg, #6d28d9, #8b5cf6, #38bdf8)' }}
  className="relative overflow-hidden z-[1] inline-flex items-center
    gap-2 rounded-[10px] border border-white/[0.12]
    px-4 py-[11px] text-[14px] font-semibold text-white
    relative z-[2]">
  Get started →
</button>

// CSS for ::before and ::after:
// .btn::before, .btn::after {
//   content: ''; position: absolute; top: 0;
//   height: 100%; width: 50%;
//   background: var(--btn-surface-2);
//   transition: transform .5s cubic-bezier(.77,0,.18,1);
//   z-index: 0;
// }
// .btn::before { left: 0; }
// .btn::after  { right: 0; }
// .btn:hover::before { transform: translateX(-100%); }
// .btn:hover::after  { transform: translateX(100%); }`,
    html: `<button class="btn-curtains">Get started →</button>`,
    css: `.btn-curtains {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid var(--btn-border);
  background: linear-gradient(135deg, #6d28d9, #8b5cf6, #38bdf8);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  position: relative;
  overflow: hidden;
  z-index: 1;
  cursor: pointer;
}
.btn-curtains::before,
.btn-curtains::after {
  content: '';
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
  background: var(--btn-surface-2);
  transition: transform 0.5s cubic-bezier(0.77, 0, 0.18, 1);
  z-index: 0;
}
.btn-curtains::before { left: 0; }
.btn-curtains::after { right: 0; }
.btn-curtains:hover::before { transform: translateX(-100%); }
.btn-curtains:hover::after { transform: translateX(100%); }`,
    prompt: `Design a curtain-reveal button where two dark panels (::before on the left half, ::after on the right half) cover a vibrant violet-to-cyan gradient. The panels match the #14141e background so they're invisible at rest. On hover, ::before slides left (-100% translateX) and ::after slides right (100% translateX) with a smooth cubic-bezier (0.77, 0, 0.18, 1) easing over 0.5s, revealing the gradient beneath. White text sits above everything. The text layer needs z-index: 2 to stay above the curtains. Theatrical and surprising.`,
  },
  {
    name: 'Cross Draw',
    description: 'Two diagonal lines cross through the button on hover using ::before and ::after. Precise, geometric reveal.',
    preview: (
      <>
        <style>{`.btn-cross-pv{position:relative;overflow:hidden;z-index:1}.btn-cross-pv::before,.btn-cross-pv::after{content:'';position:absolute;width:0;height:2px;background:var(--btn-accent);transition:width .3s ease,transform .3s ease}.btn-cross-pv::before{top:50%;left:0;transform:rotate(45deg);transform-origin:0 50%}.btn-cross-pv::after{bottom:50%;right:0;transform:rotate(-45deg);transform-origin:100% 50%}.btn-cross-pv:hover::before,.btn-cross-pv:hover::after{width:141%}`}</style>
        <button className="btn-cross-pv inline-flex items-center gap-2 rounded-none border border-white/[0.12] bg-transparent px-5 py-[11px] text-[14px] font-semibold text-[var(--btn-text)] transition-colors duration-300 hover:text-white">
          Get started →
        </button>
      </>
    ),
    code: `// Two diagonal lines cross through the button on hover
<button className="relative overflow-hidden z-[1] inline-flex
  items-center gap-2 rounded-none border border-white/[0.12]
  bg-transparent px-5 py-[11px] text-[14px] font-semibold
  text-[var(--btn-text)] transition-colors duration-300 hover:text-white">
  Get started →
</button>

// CSS for ::before and ::after:
// .btn::before, .btn::after {
//   content: ''; position: absolute;
//   width: 0; height: 2px;
//   background: #c4b5fd;
//   transition: width 0.3s ease, transform 0.3s ease;
// }
// .btn::before { top: 50%; left: 0;
//   transform: rotate(45deg); transform-origin: 0 50%; }
// .btn::after  { bottom: 50%; right: 0;
//   transform: rotate(-45deg); transform-origin: 100% 50%; }
// .btn:hover::before, .btn:hover::after { width: 141%; }`,
    html: `<button class="btn-cross-draw">Get started →</button>`,
    css: `.btn-cross-draw {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 0;
  border: 1px solid var(--btn-border);
  background: transparent;
  padding: 11px 20px;
  font-size: 14px;
  font-weight: 600;
  color: var(--btn-text);
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: color 0.3s;
  cursor: pointer;
}
.btn-cross-draw::before,
.btn-cross-draw::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  background: #c4b5fd;
  transition: width 0.3s ease;
}
.btn-cross-draw::before {
  top: 50%;
  left: 0;
  transform: rotate(45deg);
  transform-origin: 0 50%;
}
.btn-cross-draw::after {
  bottom: 50%;
  right: 0;
  transform: rotate(-45deg);
  transform-origin: 100% 50%;
}
.btn-cross-draw:hover {
  color: #ffffff;
}
.btn-cross-draw:hover::before,
.btn-cross-draw:hover::after {
  width: 141%;
}`,
    prompt: `Design a cross-draw button where two 2px lavender lines (#c4b5fd) slice diagonally through the button on hover. ::before starts at top-left center rotated 45°, ::after starts at bottom-right center rotated -45°. On hover, both lines expand to 141% width (the diagonal of the button), creating an X-pattern that draws itself. The button is transparent with a 12% white border and zero border-radius. Off-white text brightens on hover. The precise geometric lines give an editorial, design-system feel.`,
  },
  {
    name: 'Ripple Fill',
    description: 'A circular fill expands from center on hover via ::after with border-radius. Satisfying radial spread.',
    preview: (
      <>
        <style>{`.btn-ripple-pv{position:relative;overflow:hidden;z-index:1}.btn-ripple-pv::after{content:'';position:absolute;top:50%;left:50%;width:0;height:0;background:var(--btn-border);border-radius:50%;transform:translate(-50%,-50%);transition:width .5s ease,height .5s ease;z-index:-1}.btn-ripple-pv:hover::after{width:300%;height:300%}`}</style>
        <button className="btn-ripple-pv inline-flex items-center gap-2 rounded-[10px] border-0 bg-[var(--btn-surface)] px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text)] transition-colors duration-300 hover:text-white">
          Get started →
        </button>
      </>
    ),
    code: `// Circular fill expands from center on hover via ::after
<button className="relative overflow-hidden z-[1] inline-flex
  items-center gap-2 rounded-[10px] border-0 bg-[var(--btn-surface)]
  px-4 py-[11px] text-[14px] font-semibold text-[var(--btn-text)]
  transition-colors duration-300 hover:text-white">
  Get started →
</button>

// CSS for ::after:
// .btn::after {
//   content: ''; position: absolute;
//   top: 50%; left: 50%;
//   width: 0; height: 0;
//   background: rgba(196,181,253,0.15);
//   border-radius: 50%;
//   transform: translate(-50%,-50%);
//   transition: width 0.5s ease, height 0.5s ease;
//   z-index: -1;
// }
// .btn:hover::after { width: 300%; height: 300%; }`,
    html: `<button class="btn-ripple-fill">Get started →</button>`,
    css: `.btn-ripple-fill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: none;
  background: var(--btn-surface);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--btn-text);
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: color 0.3s;
  cursor: pointer;
}
.btn-ripple-fill::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(196,181,253,0.15);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.5s ease, height 0.5s ease;
  z-index: -1;
}
.btn-ripple-fill:hover {
  color: #ffffff;
}
.btn-ripple-fill:hover::after {
  width: 300%;
  height: 300%;
}`,
    prompt: `Design a ripple-fill button where a circular ::after element expands from the button's center outward on hover. The circle starts at width:0 height:0, positioned at top:50% left:50% with translate(-50%,-50%) and 50% border-radius, making it a growing circle. On hover it expands to 300% width/height, creating a radial spread from center. The fill is a subtle 15% lavender tint over the near-black surface (#0c0c14). Text brightens from off-white to pure white on hover. overflow: hidden clips the circle to the button's rounded bounds.`,
  },
  {
    name: 'Shutter',
    description: 'Two dark panels slide up and down from center, revealing gradient. Like a camera shutter opening.',
    preview: (
      <>
        <style>{`.btn-shutter-pv{position:relative;overflow:hidden;z-index:1}.btn-shutter-pv::before,.btn-shutter-pv::after{content:'';position:absolute;width:100%;height:50%;left:0;background:var(--btn-surface-2);transition:transform .45s cubic-bezier(.4,0,.2,1);z-index:0}.btn-shutter-pv::before{top:0;transform:translateY(0)}.btn-shutter-pv::after{bottom:0;transform:translateY(0)}.btn-shutter-pv:hover::before{transform:translateY(-100%)}.btn-shutter-pv:hover::after{transform:translateY(100%)}`}</style>
        <button
          className="btn-shutter-pv inline-flex items-center gap-2 rounded-[10px] border border-white/[0.12] px-4 py-[11px] text-[14px] font-semibold text-white relative z-[2]"
          style={{ background: 'linear-gradient(135deg, #6d28d9, #c4b5fd)' }}
        >
          Get started →
        </button>
      </>
    ),
    code: `// Two panels slide up/down from center on hover
<button
  style={{ background: 'linear-gradient(135deg, #6d28d9, #c4b5fd)' }}
  className="relative overflow-hidden z-[1] inline-flex items-center
    gap-2 rounded-[10px] border border-white/[0.12]
    px-4 py-[11px] text-[14px] font-semibold text-white
    relative z-[2]">
  Get started →
</button>

// CSS for ::before and ::after:
// .btn::before, .btn::after {
//   content: ''; position: absolute;
//   width: 100%; height: 50%; left: 0;
//   background: var(--btn-surface-2);
//   transition: transform .45s cubic-bezier(.4,0,.2,1);
//   z-index: 0;
// }
// .btn::before { top: 0; }
// .btn::after  { bottom: 0; }
// .btn:hover::before { transform: translateY(-100%); }
// .btn:hover::after  { transform: translateY(100%); }`,
    html: `<button class="btn-shutter">Get started →</button>`,
    css: `.btn-shutter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid var(--btn-border);
  background: linear-gradient(135deg, #6d28d9, #c4b5fd);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  position: relative;
  overflow: hidden;
  z-index: 1;
  cursor: pointer;
}
.btn-shutter::before,
.btn-shutter::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 50%;
  left: 0;
  background: var(--btn-surface-2);
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
}
.btn-shutter::before { top: 0; }
.btn-shutter::after { bottom: 0; }
.btn-shutter:hover::before { transform: translateY(-100%); }
.btn-shutter:hover::after { transform: translateY(100%); }`,
    prompt: `Design a camera-shutter button where two dark panels (::before covering the top half, ::after covering the bottom half) hide the gradient fill underneath. The panels match #14141e so they're invisible at rest. On hover, the top panel slides up (-100% translateY) and the bottom panel slides down (100% translateY) simultaneously with a 0.45s Material easing (cubic-bezier 0.4, 0, 0.2, 1), revealing a violet-to-lavender gradient. White text sits above both panels. The vertical split-open creates a cinematic, shutter-like reveal.`,
  },
  {
    name: 'Morph Fill',
    description: 'Rounded pill shape morphs from corners to fully rounded on hover while gradient fill appears. Shape + color transform together.',
    preview: (
      <>
        <style>{`.btn-morph-pv{transition:all .4s cubic-bezier(.34,1.56,.64,1);border-radius:10px;background:var(--btn-surface-2)}.btn-morph-pv:hover{border-radius:9999px;background:linear-gradient(135deg,#6d28d9,#38bdf8);box-shadow:0 8px 24px -4px var(--btn-shadow-soft)}`}</style>
        <button className="btn-morph-pv inline-flex items-center gap-2 border border-white/[0.1] px-4 py-[11px] text-[14px] font-semibold text-white">
          Get started →
        </button>
      </>
    ),
    code: `// Shape morphs from squared to pill on hover with fill transition
<button
  className="inline-flex items-center gap-2 border border-white/[0.1]
    px-4 py-[11px] text-[14px] font-semibold text-white"
  style={{
    borderRadius: '10px',
    background: '#14141e',
    transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
  }}
  onMouseEnter={e => {
    e.currentTarget.style.borderRadius = '9999px';
    e.currentTarget.style.background =
      'linear-gradient(135deg, #6d28d9, #38bdf8)';
    e.currentTarget.style.boxShadow =
      '0 8px 24px -4px rgba(109,40,217,0.4)';
  }}
  onMouseLeave={e => {
    e.currentTarget.style.borderRadius = '10px';
    e.currentTarget.style.background = '#14141e';
    e.currentTarget.style.boxShadow = 'none';
  }}>
  Get started →
</button>`,
    html: `<button class="btn-morph-fill">Get started →</button>`,
    css: `.btn-morph-fill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  background: var(--btn-surface-2);
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
}
.btn-morph-fill:hover {
  border-radius: 9999px;
  background: linear-gradient(135deg, #6d28d9, #38bdf8);
  box-shadow: 0 8px 24px -4px rgba(109,40,217,0.4);
}`,
    prompt: `Design a morph-fill button that transforms on two axes simultaneously: shape and color. At rest the button has squared 10px border-radius and a dark #14141e fill. On hover, border-radius morphs to 9999px (full pill) and the fill cross-fades to a violet-to-cyan gradient, with a purple glow shadow appearing. The spring-like cubic-bezier (0.34, 1.56, 0.64, 1) overshoots the pill shape before settling for a bouncy, playful feel. Both transitions happen in one 0.4s declaration. The shape change is as dramatic as the color change.`,
  },
];
