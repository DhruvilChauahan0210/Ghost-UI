import { useState, useMemo } from 'react';
import { GhostProvider, Ghost } from '@ghost-ui/react';
import { GhostDevtools } from '@ghost-ui/devtools';
import { localStorageAdapter } from '@ghost-ui/core';

interface Product {
  id: string;
  name: string;
  designer: string;
  price: number;
  originalPrice?: number;
  category: string;
  badge?: 'New' | 'Sale' | 'Exclusive';
  sizes: string[];
  image: string;
  description: string;
}

const PRODUCTS: Product[] = [
  { id: 'p01', name: 'Structured Blazer', designer: 'Maison Vell', price: 1240, category: 'Women', badge: 'New', sizes: ['XS','S','M','L'], image: '#8b5cf6', description: 'Precision-cut in Italian wool with a single-button close and sculptural shoulders.' },
  { id: 'p02', name: 'Silk Slip Dress', designer: 'Atelier Mira', price: 890, category: 'Women', sizes: ['XS','S','M'], image: '#c4b5fd', description: 'Fluid 100% silk charmeuse with adjustable straps and a bias-cut hem.' },
  { id: 'p03', name: 'Wide-Leg Trousers', designer: 'Studio Ko', price: 640, originalPrice: 980, category: 'Women', badge: 'Sale', sizes: ['XS','S','M','L','XL'], image: '#38bdf8', description: 'High-waisted in a linen-cotton blend with pressed creases and side seam pockets.' },
  { id: 'p04', name: 'Cashmere Turtleneck', designer: 'Kessler & Co', price: 520, category: 'Men', badge: 'New', sizes: ['S','M','L','XL'], image: '#f59e0b', description: 'Grade A Mongolian cashmere in a relaxed-fit with ribbed cuffs and hem.' },
  { id: 'p05', name: 'Tailored Overcoat', designer: 'Maison Vell', price: 2100, category: 'Men', sizes: ['S','M','L','XL','XXL'], image: '#10b981', description: 'Double-breasted wool-cashmere blend with notched lapels and a half-canvas construction.' },
  { id: 'p06', name: 'Leather Bifold Wallet', designer: 'Cordero', price: 195, category: 'Accessories', badge: 'Exclusive', sizes: ['One Size'], image: '#d4af6e', description: 'Full-grain vegetable-tanned leather with 6 card slots and a note compartment.' },
  { id: 'p07', name: 'Suede Chelsea Boots', designer: 'Atelier Mira', price: 760, originalPrice: 1100, category: 'Women', badge: 'Sale', sizes: ['36','37','38','39','40'], image: '#ec4899', description: 'Nubuck suede upper with elasticated gussets and a stacked leather heel.' },
  { id: 'p08', name: 'Linen Shirt', designer: 'Studio Ko', price: 310, category: 'Men', sizes: ['S','M','L','XL'], image: '#6366f1', description: 'Garment-washed Belgian linen with a mandarin collar and mother-of-pearl buttons.' },
  { id: 'p09', name: 'Merino Wrap Coat', designer: 'Kessler & Co', price: 1650, category: 'Women', badge: 'New', sizes: ['XS','S','M','L'], image: '#f97316', description: 'Lightweight merino wool with a self-tie belt and draped front panels.' },
  { id: 'p10', name: 'Structured Tote', designer: 'Cordero', price: 890, category: 'Accessories', sizes: ['One Size'], image: '#14b8a6', description: 'Buttery calfskin leather with internal suede lining and polished brass hardware.' },
  { id: 'p11', name: 'Pleated Midi Skirt', designer: 'Atelier Mira', price: 480, category: 'Women', sizes: ['XS','S','M','L'], image: '#a78bfa', description: 'Silk-blend satin with accordion pleats and a concealed back zip.' },
  { id: 'p12', name: 'Raw Denim Jeans', designer: 'Studio Ko', price: 390, category: 'Men', sizes: ['28','30','32','34','36'], image: '#0ea5e9', description: 'Japanese selvedge denim in a slim straight cut, raw and unwashed.' },
];

const CATEGORIES = ['All', 'Women', 'Men', 'Accessories'];

const PRODUCT_ACTIONS = [
  { id: 'act-bag',       label: 'Add to Bag',  icon: BagIcon },
  { id: 'act-wishlist',  label: 'Wishlist',    icon: HeartIcon },
  { id: 'act-quickview', label: 'Quick View',  icon: EyeIcon },
];

const BADGE_STYLE: Record<string, string> = {
  'New':       'bg-[#c4b5fd]/[0.15] text-[#c4b5fd] border border-[#c4b5fd]/[0.25]',
  'Sale':      'bg-[#f85149]/[0.15] text-[#f85149] border border-[#f85149]/[0.25]',
  'Exclusive': 'bg-[#d4af6e]/[0.15] text-[#d4af6e] border border-[#d4af6e]/[0.25]',
};

export function App() {
  return (
    <GhostProvider persistence={localStorageAdapter('luxe-demo-v1')}>
      <LuxeApp />
      <GhostDevtools defaultOpen={false} />
    </GhostProvider>
  );
}

function LuxeApp() {
  const [category, setCategory] = useState('All');
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [cartCount, setCartCount] = useState(0);
  const [quickView, setQuickView] = useState<Product | null>(null);

  const filtered = useMemo(
    () => category === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === category),
    [category]
  );

  const handleAction = (actionId: string, product: Product) => {
    if (actionId === 'act-bag') {
      setAddedItems(prev => new Set([...prev, product.id]));
      setCartCount(c => c + 1);
    } else if (actionId === 'act-wishlist') {
      setWishlist(prev => {
        const next = new Set(prev);
        next.has(product.id) ? next.delete(product.id) : next.add(product.id);
        return next;
      });
    } else if (actionId === 'act-quickview') {
      setQuickView(product);
    }
  };

  return (
    <div className="min-h-full bg-[#0a0a0a] text-[#f5f5f0]">
      <Header cartCount={cartCount} />
      <CategoryNav category={category} setCategory={setCategory} />
      <main className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#f5f5f0]">{category === 'All' ? 'All Collections' : category}</h1>
            <p className="text-sm text-[#888880] mt-0.5">{filtered.length} pieces</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-[13px] text-[#888880] hover:text-[#f5f5f0] transition-colors">
              <SortIcon /> Sort: Featured
            </button>
            <div className="h-4 w-px bg-white/[0.10]" />
            <button className="flex items-center gap-2 text-[13px] text-[#888880] hover:text-[#f5f5f0] transition-colors">
              <GridIcon /> Grid
            </button>
          </div>
        </div>
        <GhostHint />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              added={addedItems.has(product.id)}
              wishlisted={wishlist.has(product.id)}
              onAction={(actionId) => handleAction(actionId, product)}
            />
          ))}
        </div>
      </main>

      {quickView && (
        <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
      )}

      <footer className="mt-16 border-t border-white/[0.06] px-6 py-8">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-5 w-5 rounded-md bg-[conic-gradient(from_220deg_at_50%_50%,#c4b5fd,#8b5cf6,#38bdf8,#c4b5fd)]" />
            <span className="text-sm font-semibold tracking-[-0.01em]">Luxe</span>
            <span className="text-[11px] text-[#555550] ml-2">Powered by Ghost UI — adapts to your browsing habits</span>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-[#555550]">
            {['Privacy', 'Terms', 'Accessibility'].map(l => (
              <a key={l} href="#" className="hover:text-[#888880] transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

function Header({ cartCount }: { cartCount: number }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-xl">
      <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded-md bg-[conic-gradient(from_220deg_at_50%_50%,#c4b5fd,#8b5cf6,#38bdf8,#c4b5fd)] shadow-[0_0_12px_rgba(167,139,250,0.4)]" />
          <span className="text-base font-semibold tracking-[-0.02em]">Luxe</span>
        </div>
        <div className="flex-1" />
        <nav className="flex items-center gap-5">
          {['New Arrivals', 'Designers', 'Editorial'].map(item => (
            <a key={item} href="#" className="text-[13px] text-[#888880] hover:text-[#f5f5f0] transition-colors tracking-[-0.01em]">{item}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button className="p-2 text-[#888880] hover:text-[#f5f5f0] transition-colors">
            <SearchSmIcon />
          </button>
          <button className="p-2 text-[#888880] hover:text-[#f5f5f0] transition-colors">
            <UserIcon />
          </button>
          <button className="relative p-2 text-[#888880] hover:text-[#f5f5f0] transition-colors">
            <BagIcon />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-[#c4b5fd] text-[9px] font-bold text-[#0a0a0a] flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function CategoryNav({ category, setCategory }: { category: string; setCategory: (c: string) => void }) {
  return (
    <div className="border-b border-white/[0.06] bg-[#0a0a0a]">
      <div className="max-w-[1280px] mx-auto px-6">
        <Ghost.Slot zone="luxe.categories" className="flex items-center gap-1 py-1">
          {CATEGORIES.map(cat => (
            <Ghost.Button
              key={cat}
              id={`cat-${cat}`}
              zone="luxe.categories"
              onClick={() => setCategory(cat)}
              className={[
                'px-4 py-2 text-[13px] font-medium rounded-md transition-colors cursor-pointer border-0 outline-none tracking-[-0.01em]',
                category === cat
                  ? 'text-[#f5f5f0] bg-white/[0.08]'
                  : 'text-[#888880] hover:text-[#f5f5f0] hover:bg-white/[0.04]',
              ].join(' ')}
            >
              {cat}
            </Ghost.Button>
          ))}
        </Ghost.Slot>
      </div>
    </div>
  );
}

function GhostHint() {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#c4b5fd]/[0.06] border border-[#c4b5fd]/[0.12]">
      <div className="h-4 w-4 rounded flex-none bg-[conic-gradient(from_220deg_at_50%_50%,#c4b5fd,#8b5cf6,#38bdf8,#c4b5fd)]" />
      <p className="text-[12px] text-[#888880]">
        <span className="text-[#c4b5fd] font-medium">Ghost UI is watching.</span>
        {' '}The category tabs and product action buttons reorder as you interact — most-used ones float to the front.
      </p>
      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#3fb950] flex-none animate-pulse" />
    </div>
  );
}

function ProductCard({ product, added, wishlisted, onAction }: {
  product: Product;
  added: boolean;
  wishlisted: boolean;
  onAction: (actionId: string) => void;
}) {
  return (
    <div className="group flex flex-col">
      <div
        className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3"
        style={{ background: `linear-gradient(135deg, ${product.image}22, ${product.image}44)` }}
      >
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 30% 30%, ${product.image}60, ${product.image}20)` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="h-20 w-20 rounded-full opacity-40"
            style={{ background: product.image, filter: 'blur(24px)' }}
          />
          <span className="absolute text-3xl opacity-20 font-bold tracking-tighter text-white select-none">
            {product.name.slice(0, 1)}
          </span>
        </div>

        {product.badge && (
          <div className={`absolute top-3 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${BADGE_STYLE[product.badge]}`}>
            {product.badge}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Ghost.Slot zone="luxe.product-actions" className="flex flex-col gap-1.5">
            {PRODUCT_ACTIONS.map(action => {
              const Icon = action.icon;
              const isActive = action.id === 'act-bag' ? added : action.id === 'act-wishlist' ? wishlisted : false;
              return (
                <Ghost.Button
                  key={action.id}
                  id={action.id}
                  zone="luxe.product-actions"
                  onClick={() => onAction(action.id)}
                  className={[
                    'w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[12px] font-medium transition-all cursor-pointer border-0 outline-none',
                    action.id === 'act-bag'
                      ? isActive
                        ? 'bg-[#3fb950] text-white'
                        : 'bg-[#f5f5f0] text-[#0a0a0a] hover:bg-white'
                      : isActive
                        ? 'bg-[#c4b5fd]/20 text-[#c4b5fd] backdrop-blur-sm border border-[#c4b5fd]/30'
                        : 'bg-black/50 text-[#f5f5f0] backdrop-blur-sm hover:bg-black/70 border border-white/10',
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

      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] text-[#555550] mb-0.5 tracking-[0.04em] uppercase">{product.designer}</p>
            <h3 className="text-[14px] font-medium text-[#f5f5f0] leading-snug">{product.name}</h3>
          </div>
          <div className="text-right flex-none">
            <p className="text-[14px] font-semibold text-[#f5f5f0]">${product.price.toLocaleString()}</p>
            {product.originalPrice && (
              <p className="text-[11px] text-[#555550] line-through">${product.originalPrice.toLocaleString()}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {product.sizes.slice(0, 4).map(s => (
            <span key={s} className="text-[10px] px-1.5 py-0.5 rounded border border-white/[0.08] text-[#555550]">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-[720px] bg-[#111111] rounded-2xl border border-white/[0.10] overflow-hidden flex"
        onClick={e => e.stopPropagation()}
      >
        <div
          className="w-[320px] flex-none aspect-square"
          style={{ background: `radial-gradient(circle at 35% 35%, ${product.image}50, ${product.image}20)` }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="h-24 w-24 rounded-full opacity-40" style={{ background: product.image, filter: 'blur(32px)' }} />
          </div>
        </div>
        <div className="flex-1 p-8 flex flex-col">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/[0.06] text-[#888880] hover:text-[#f5f5f0] transition-colors">
            <CloseIcon />
          </button>
          <p className="text-[11px] text-[#555550] tracking-[0.04em] uppercase mb-1">{product.designer}</p>
          <h2 className="text-xl font-semibold tracking-[-0.02em] mb-2">{product.name}</h2>
          <p className="text-2xl font-semibold text-[#f5f5f0] mb-4">${product.price.toLocaleString()}</p>
          <p className="text-[13px] text-[#888880] leading-relaxed mb-5">{product.description}</p>
          <div className="mb-5">
            <p className="text-[11px] text-[#555550] uppercase tracking-[0.04em] mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(s => (
                <button key={s} className="px-3 py-1.5 rounded-lg border border-white/[0.10] text-[13px] text-[#888880] hover:border-[#c4b5fd]/40 hover:text-[#c4b5fd] transition-colors">{s}</button>
              ))}
            </div>
          </div>
          <button className="w-full py-3 rounded-xl bg-[#f5f5f0] text-[#0a0a0a] text-[14px] font-semibold hover:bg-white transition-colors mt-auto">
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}

function BagIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M5.5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <rect x="2" y="6" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M8 13.5S2 9.5 2 5.5a3.5 3.5 0 017-0 3.5 3.5 0 017 0C16 9.5 8 13.5 8 13.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M1.5 8S4 3 8 3s6.5 5 6.5 5S12 13 8 13 1.5 8 1.5 8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  );
}
function SearchSmIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
function SortIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
function GridIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
