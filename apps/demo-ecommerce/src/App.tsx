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
  art: string;
  description: string;
  material: string;
  scarcity?: string;
}

const PRODUCTS: Product[] = [
  { id: 'p01', name: 'Structured Blazer', designer: 'Maison Vell', price: 1240, category: 'Women', badge: 'New', sizes: ['XS','S','M','L'], art: 'radial-gradient(ellipse at 35% 25%, #3d1c6e 0%, #1a0b3d 45%, #0d0819 100%)', description: 'Precision-cut in Italian wool with sculptural shoulders and a single-button close.', material: 'Italian Wool, 98% / Elastane, 2%' },
  { id: 'p02', name: 'Silk Slip Dress', designer: 'Atelier Mira', price: 890, category: 'Women', sizes: ['XS','S','M'], art: 'radial-gradient(ellipse at 60% 30%, #7c4a6e 0%, #4a1d44 40%, #1a0a18 100%)', description: 'Fluid 100% silk charmeuse with adjustable straps and a bias-cut hem.', material: 'Silk Charmeuse, 100%', scarcity: 'Only 3 left' },
  { id: 'p03', name: 'Wide-Leg Trousers', designer: 'Studio Ko', price: 640, originalPrice: 980, category: 'Women', badge: 'Sale', sizes: ['XS','S','M','L','XL'], art: 'radial-gradient(ellipse at 40% 40%, #1e3a5f 0%, #0f2040 50%, #060d1a 100%)', description: 'High-waisted in a linen-cotton blend with pressed creases and side seam pockets.', material: 'Linen, 60% / Cotton, 40%' },
  { id: 'p04', name: 'Cashmere Turtleneck', designer: 'Kessler & Co', price: 520, category: 'Men', badge: 'New', sizes: ['S','M','L','XL'], art: 'radial-gradient(ellipse at 50% 30%, #6b3a1c 0%, #3d1f0a 45%, #150a03 100%)', description: 'Grade A Mongolian cashmere in a relaxed-fit with ribbed cuffs and hem.', material: 'Grade A Cashmere, 100%' },
  { id: 'p05', name: 'Tailored Overcoat', designer: 'Maison Vell', price: 2100, category: 'Men', sizes: ['S','M','L','XL'], art: 'radial-gradient(ellipse at 45% 25%, #1a3a1e 0%, #0c2010 48%, #050e07 100%)', description: 'Double-breasted wool-cashmere blend with notched lapels and half-canvas construction.', material: 'Wool, 80% / Cashmere, 20%', scarcity: 'Only 2 left' },
  { id: 'p06', name: 'Vegetable-Tanned Tote', designer: 'Cordero', price: 1190, category: 'Accessories', badge: 'Exclusive', sizes: ['One Size'], art: 'radial-gradient(ellipse at 55% 35%, #7a5c1e 0%, #4a3510 45%, #1a1206 100%)', description: 'Full-grain vegetable-tanned leather that develops a rich patina over years of use.', material: 'Full-Grain Leather, Brass Hardware' },
  { id: 'p07', name: 'Suede Chelsea Boots', designer: 'Atelier Mira', price: 760, originalPrice: 1100, category: 'Women', badge: 'Sale', sizes: ['36','37','38','39','40'], art: 'radial-gradient(ellipse at 40% 30%, #5c1a1a 0%, #35100a 48%, #140604 100%)', description: 'Nubuck suede upper with elasticated gussets and a stacked leather heel.', material: 'Nubuck Suede / Leather Sole' },
  { id: 'p08', name: 'Belgian Linen Shirt', designer: 'Studio Ko', price: 310, category: 'Men', sizes: ['S','M','L','XL'], art: 'radial-gradient(ellipse at 35% 40%, #1a3550 0%, #0d1f30 48%, #050c15 100%)', description: 'Garment-washed Belgian linen with a mandarin collar and mother-of-pearl buttons.', material: 'Belgian Linen, 100%' },
  { id: 'p09', name: 'Merino Wrap Coat', designer: 'Kessler & Co', price: 1650, category: 'Women', badge: 'New', sizes: ['XS','S','M','L'], art: 'radial-gradient(ellipse at 50% 25%, #5c2d0a 0%, #3a1a05 45%, #150a02 100%)', description: 'Lightweight merino with a self-tie belt and draped front panels. Weightless warmth.', material: 'Merino Wool, 100%' },
  { id: 'p10', name: 'Calfskin Clutch', designer: 'Cordero', price: 590, category: 'Accessories', sizes: ['One Size'], art: 'radial-gradient(ellipse at 45% 35%, #1a4a3a 0%, #0d2820 48%, #050f0c 100%)', description: 'Buttery calfskin with a concealed clasp and suede lining. Fits an evening\'s essentials.', material: 'Calfskin Leather, Suede Interior' },
  { id: 'p11', name: 'Accordion Pleated Skirt', designer: 'Atelier Mira', price: 480, category: 'Women', sizes: ['XS','S','M','L'], art: 'radial-gradient(ellipse at 55% 30%, #3a1f5c 0%, #21103a 48%, #0c0717 100%)', description: 'Silk-blend satin with fine accordion pleats and a concealed back zip.', material: 'Silk, 70% / Polyester, 30%', scarcity: 'Only 4 left' },
  { id: 'p12', name: 'Selvedge Denim', designer: 'Studio Ko', price: 390, category: 'Men', sizes: ['28','30','32','34','36'], art: 'radial-gradient(ellipse at 40% 30%, #0f1e3a 0%, #081224 48%, #030710 100%)', description: 'Japanese selvedge in a slim-straight cut. Raw and unwashed — every pair ages uniquely.', material: 'Japanese Selvedge Denim, 100%' },
];

const CATEGORIES = ['All', 'Women', 'Men', 'Accessories'];

const PRODUCT_ACTIONS = [
  { id: 'act-bag',       label: 'Add to Bag',  icon: BagIcon },
  { id: 'act-wishlist',  label: 'Wishlist',    icon: HeartIcon },
  { id: 'act-quickview', label: 'Quick View',  icon: EyeIcon },
];

export function App() {
  return (
    <GhostProvider persistence={localStorageAdapter('luxe-v2')}>
      <LuxeApp />
      <GhostDevtools defaultOpen={false} />
    </GhostProvider>
  );
}

function LuxeApp() {
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState<Set<string>>(new Set());
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [quickView, setQuickView] = useState<Product | null>(null);

  const filtered = useMemo(
    () => category === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === category),
    [category]
  );

  function handleAction(actionId: string, product: Product) {
    if (actionId === 'act-bag') setCart(p => new Set([...p, product.id]));
    else if (actionId === 'act-wishlist') setWishlist(p => { const n = new Set(p); n.has(product.id) ? n.delete(product.id) : n.add(product.id); return n; });
    else if (actionId === 'act-quickview') setQuickView(product);
  }

  return (
    <div className="min-h-full bg-[#060604]" style={{ fontFamily: "'Jost', ui-sans-serif, sans-serif" }}>
      <AnnouncementBar />
      <SiteHeader cartCount={cart.size} wishlistCount={wishlist.size} />
      <CategoryNav category={category} setCategory={setCategory} />
      <CollectionHero category={category} count={filtered.length} />

      <main className="max-w-[1360px] mx-auto px-8 pb-24">
        <Ghost.Slot
          zone="luxe.ai-hint"
          className="mb-8 flex items-start gap-4 p-4 rounded-xl border border-[#c4a35a]/[0.18] bg-[#c4a35a]/[0.04]"
        >
          <Ghost.Button id="hint-msg" zone="luxe.ai-hint" className="flex items-center gap-3 cursor-default border-0 outline-none bg-transparent p-0 text-left">
            <div className="h-7 w-7 rounded-lg flex-none flex items-center justify-center bg-[conic-gradient(from_200deg_at_50%_50%,#c4a35a,#e8c97e,#c4a35a)] shadow-[0_0_12px_rgba(196,163,90,0.3)]" />
            <p className="text-[12.5px] text-[#88837a] leading-relaxed">
              <span className="text-[#c4a35a] font-medium">Ghost UI is learning your taste.</span>
              {' '}The category tabs and the buttons that appear on each product reorder silently as you browse — the ones you use most float to the front.
            </p>
            <div className="ml-2 h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse flex-none" />
          </Ghost.Button>
        </Ghost.Slot>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              inCart={cart.has(product.id)}
              inWishlist={wishlist.has(product.id)}
              onAction={(aid) => handleAction(aid, product)}
              index={i}
            />
          ))}
        </div>
      </main>

      <SiteFooter />
      {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />}
    </div>
  );
}

function AnnouncementBar() {
  return (
    <div className="flex items-center justify-center gap-3 h-9 bg-[#0d0d0a] border-b border-white/[0.05]">
      <span className="text-[11.5px] tracking-[0.04em] text-[#88837a]">
        Complimentary express shipping on orders over <span className="text-[#c4a35a]">$250</span>
      </span>
      <span className="text-[#47443e]">·</span>
      <span className="text-[11.5px] tracking-[0.04em] text-[#88837a]">Free returns within 30 days</span>
    </div>
  );
}

function SiteHeader({ cartCount, wishlistCount }: { cartCount: number; wishlistCount: number }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#060604]/95 backdrop-blur-xl">
      <div className="max-w-[1360px] mx-auto px-8 h-16 flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg flex-none bg-[conic-gradient(from_200deg_at_50%_50%,#c4a35a,#e8c97e,#8a6a2a,#c4a35a)] shadow-[0_0_14px_rgba(196,163,90,0.35)]" />
          <span className="text-[22px] tracking-[0.14em] text-[#ede8df] uppercase" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
            Luxe
          </span>
        </div>

        <div className="flex-1" />

        <nav className="flex items-center gap-6">
          {['New Arrivals', 'Designers', 'The Edit', 'Sale'].map(item => (
            <a key={item} href="#" className="text-[12.5px] tracking-[0.06em] uppercase text-[#88837a] hover:text-[#ede8df] transition-colors">
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button className="h-9 w-9 flex items-center justify-center text-[#88837a] hover:text-[#ede8df] transition-colors rounded-lg hover:bg-white/[0.04]">
            <SearchIcon />
          </button>
          <button className="relative h-9 w-9 flex items-center justify-center text-[#88837a] hover:text-[#ede8df] transition-colors rounded-lg hover:bg-white/[0.04]">
            <HeartIcon />
            {wishlistCount > 0 && <Badge count={wishlistCount} />}
          </button>
          <button className="relative h-9 w-9 flex items-center justify-center text-[#88837a] hover:text-[#ede8df] transition-colors rounded-lg hover:bg-white/[0.04]">
            <BagIcon />
            {cartCount > 0 && <Badge count={cartCount} gold />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Badge({ count, gold }: { count: number; gold?: boolean }) {
  return (
    <span className={`absolute top-1 right-1 h-3.5 min-w-3.5 px-0.5 rounded-full text-[8.5px] font-semibold flex items-center justify-center ${gold ? 'bg-[#c4a35a] text-[#060604]' : 'bg-[#dddde8] text-[#060604]'}`}>
      {count}
    </span>
  );
}

function CategoryNav({ category, setCategory }: { category: string; setCategory: (c: string) => void }) {
  return (
    <div className="border-b border-white/[0.05] bg-[#060604]">
      <div className="max-w-[1360px] mx-auto px-8">
        <Ghost.Slot zone="luxe.categories" className="flex items-center">
          {CATEGORIES.map(cat => (
            <Ghost.Button
              key={cat}
              id={`cat-${cat}`}
              zone="luxe.categories"
              onClick={() => setCategory(cat)}
              className={[
                'relative px-5 py-3.5 text-[12px] tracking-[0.06em] uppercase font-medium transition-colors cursor-pointer border-0 outline-none bg-transparent',
                category === cat
                  ? 'text-[#ede8df]'
                  : 'text-[#88837a] hover:text-[#c4c0b8]',
              ].join(' ')}
            >
              {cat}
              {category === cat && (
                <span className="absolute bottom-0 left-5 right-5 h-[1.5px] bg-[#c4a35a]" />
              )}
            </Ghost.Button>
          ))}
        </Ghost.Slot>
      </div>
    </div>
  );
}

function CollectionHero({ category, count }: { category: string; count: number }) {
  const title = category === 'All' ? 'The Summer Edit' : category;
  const sub = category === 'All'
    ? 'Curated pieces for the considered wardrobe'
    : `${count} pieces from the finest makers`;
  return (
    <div className="max-w-[1360px] mx-auto px-8 py-12 flex items-end justify-between border-b border-white/[0.04] mb-0">
      <div>
        <p className="text-[11px] tracking-[0.12em] uppercase text-[#c4a35a] mb-2">SS 2025 Collection</p>
        <h1 className="text-[44px] leading-none tracking-[-0.01em] text-[#ede8df]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
          {title}
        </h1>
        <p className="text-[14px] text-[#88837a] mt-2 font-light">{sub}</p>
      </div>
      <div className="text-right">
        <p className="text-[11px] tracking-[0.08em] uppercase text-[#47443e] mb-1">{count} pieces</p>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-[11.5px] tracking-[0.04em] text-[#88837a] hover:text-[#ede8df] transition-colors">
            <SortIcon /> Sort by featured
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, inCart, inWishlist, onAction, index }: {
  product: Product;
  inCart: boolean;
  inWishlist: boolean;
  onAction: (id: string) => void;
  index: number;
}) {
  return (
    <div className="group flex flex-col" style={{ animationDelay: `${index * 35}ms`, animation: 'fade-up 0.5s ease both' }}>
      <div className="relative aspect-[3/4] rounded-sm overflow-hidden mb-4" style={{ background: product.art }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {product.badge && (
          <div className={[
            'absolute top-3 left-3 text-[9px] font-medium tracking-[0.10em] uppercase px-2.5 py-1 rounded-sm',
            product.badge === 'Sale'      ? 'bg-[#5c1a1a]/80 text-[#fca5a5] backdrop-blur-sm border border-red-900/30' :
            product.badge === 'New'       ? 'bg-[#c4a35a]/[0.15] text-[#e8c97e] backdrop-blur-sm border border-[#c4a35a]/30' :
            'bg-white/[0.08] text-[#ede8df] backdrop-blur-sm border border-white/[0.12]',
          ].join(' ')}>
            {product.badge}
          </div>
        )}

        {product.scarcity && (
          <div className="absolute top-3 right-3 text-[9px] font-medium tracking-[0.06em] uppercase px-2 py-1 rounded-sm bg-black/60 text-[#fca5a5] backdrop-blur-sm border border-red-900/20">
            {product.scarcity}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <Ghost.Slot zone="luxe.product-actions" className="flex flex-col gap-1.5">
            {PRODUCT_ACTIONS.map(action => {
              const Icon = action.icon;
              const active = action.id === 'act-bag' ? inCart : action.id === 'act-wishlist' ? inWishlist : false;
              return (
                <Ghost.Button
                  key={action.id}
                  id={action.id}
                  zone="luxe.product-actions"
                  onClick={() => onAction(action.id)}
                  className={[
                    'w-full flex items-center justify-center gap-2 py-2.5 text-[11px] font-medium tracking-[0.06em] uppercase transition-all cursor-pointer border-0 outline-none',
                    action.id === 'act-bag'
                      ? active
                        ? 'bg-[#22c55e] text-white'
                        : 'bg-[#ede8df] text-[#060604] hover:bg-white'
                      : active
                        ? 'bg-[#c4a35a]/20 text-[#e8c97e] border border-[#c4a35a]/30 backdrop-blur-sm'
                        : 'bg-black/55 text-[#ede8df] border border-white/[0.10] backdrop-blur-sm hover:bg-black/75',
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

      <div>
        <p className="text-[9.5px] tracking-[0.12em] uppercase text-[#47443e] mb-1">{product.designer}</p>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-[17px] leading-[1.3] text-[#c4c0b8]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
            {product.name}
          </h3>
          <div className="text-right flex-none">
            <p className="text-[14px] font-medium text-[#ede8df]">${product.price.toLocaleString()}</p>
            {product.originalPrice && (
              <p className="text-[11px] text-[#47443e] line-through">${product.originalPrice.toLocaleString()}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {product.sizes.slice(0, 5).map(s => (
            <span key={s} className="text-[10px] px-1.5 py-0.5 border border-white/[0.07] text-[#47443e] hover:border-[#c4a35a]/30 hover:text-[#88837a] transition-colors cursor-pointer">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.05] mt-8">
      <div className="max-w-[1360px] mx-auto px-8 py-12 grid grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-5 w-5 rounded-md bg-[conic-gradient(from_200deg_at_50%_50%,#c4a35a,#e8c97e,#8a6a2a,#c4a35a)]" />
            <span className="text-[18px] tracking-[0.12em] uppercase text-[#ede8df]" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>Luxe</span>
          </div>
          <p className="text-[11.5px] text-[#47443e] leading-relaxed">Considered pieces from the world's finest makers. Each item selected for craft, longevity, and beauty.</p>
        </div>
        {[
          { title: 'Collections', links: ['Women', 'Men', 'Accessories', 'Designers', 'New Arrivals'] },
          { title: 'Customer Care', links: ['Size Guide', 'Shipping & Returns', 'Care Instructions', 'Contact Us'] },
          { title: 'Company', links: ['Our Story', 'Sustainability', 'Careers', 'Press'] },
        ].map(col => (
          <div key={col.title}>
            <p className="text-[9.5px] font-medium tracking-[0.12em] uppercase text-[#88837a] mb-3">{col.title}</p>
            <ul className="flex flex-col gap-2">
              {col.links.map(l => (
                <li key={l}><a href="#" className="text-[11.5px] text-[#47443e] hover:text-[#88837a] transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/[0.04] px-8 py-5 max-w-[1360px] mx-auto flex items-center justify-between">
        <p className="text-[10.5px] text-[#47443e]">© 2025 Luxe. Powered by <span className="text-[#c4a35a]">Ghost UI</span> — buttons reorder as you shop.</p>
        <div className="flex gap-4">
          {['Privacy', 'Terms', 'Accessibility'].map(l => (
            <a key={l} href="#" className="text-[10.5px] text-[#47443e] hover:text-[#88837a] transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [selectedSize, setSelectedSize] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-md" onClick={onClose}>
      <div className="w-full max-w-[760px] bg-[#0d0d0a] rounded-sm border border-white/[0.08] overflow-hidden flex" onClick={e => e.stopPropagation()}>
        <div className="w-[340px] flex-none aspect-[3/4]" style={{ background: product.art }}>
          <div className="w-full h-full bg-gradient-to-t from-black/30 to-transparent" />
        </div>
        <div className="flex-1 p-10 flex flex-col">
          <button onClick={onClose} className="absolute top-5 right-5 h-7 w-7 flex items-center justify-center text-[#47443e] hover:text-[#88837a] transition-colors">
            <CloseIcon />
          </button>
          <p className="text-[9.5px] tracking-[0.12em] uppercase text-[#47443e] mb-2">{product.designer}</p>
          <h2 className="text-[28px] leading-tight text-[#ede8df] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
            {product.name}
          </h2>
          <p className="text-[22px] text-[#c4a35a] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            ${product.price.toLocaleString()}
            {product.originalPrice && <span className="text-[16px] text-[#47443e] line-through ml-3">${product.originalPrice.toLocaleString()}</span>}
          </p>
          <p className="text-[12.5px] text-[#88837a] leading-relaxed mb-6 font-light">{product.description}</p>
          <p className="text-[9.5px] tracking-[0.10em] uppercase text-[#47443e] mb-1">Material</p>
          <p className="text-[12px] text-[#88837a] mb-6 font-light">{product.material}</p>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[9.5px] tracking-[0.10em] uppercase text-[#47443e]">Select Size</p>
              <a href="#" className="text-[9.5px] tracking-[0.06em] uppercase text-[#c4a35a] hover:text-[#e8c97e] transition-colors">Size Guide</a>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={[
                    'px-3.5 py-2 text-[11px] tracking-[0.04em] border transition-colors',
                    selectedSize === s
                      ? 'border-[#c4a35a]/60 text-[#e8c97e] bg-[#c4a35a]/[0.08]'
                      : 'border-white/[0.08] text-[#88837a] hover:border-white/[0.16] hover:text-[#ede8df]',
                  ].join(' ')}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button className="w-full py-3.5 bg-[#ede8df] text-[#060604] text-[11px] font-semibold tracking-[0.10em] uppercase hover:bg-white transition-colors mt-auto">
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}

function BagIcon() { return <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M5.5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><rect x="2" y="6" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>; }
function HeartIcon() { return <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 13.5S2 9.5 2 5.5A3.5 3.5 0 0 1 8.01 4 3.5 3.5 0 0 1 14 5.5C14 9.5 8 13.5 8 13.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>; }
function EyeIcon() { return <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M1.5 8S4 3 8 3s6.5 5 6.5 5S12 13 8 13 1.5 8 1.5 8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>; }
function SearchIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4"/><path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>; }
function SortIcon() { return <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>; }
function CloseIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>; }
