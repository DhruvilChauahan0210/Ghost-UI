import { useState, useMemo, useEffect } from 'react';
import { GhostProvider, Ghost, GhostPrivacyPanel, useGhostEngine } from '@ghost-ui/react';
import { GhostDevtools } from '@ghost-ui/devtools';
import { localStorageAdapter, type GhostEvent } from '@ghost-ui/core';

interface Product {
  id: string;
  name: string;
  designer: string;
  price: number;
  originalPrice?: number;
  category: string;
  badge?: 'New' | 'Sale' | 'Exclusive';
  sizes: string[];
  img: string;
  description: string;
  material: string;
  scarcity?: string;
}

const PRODUCTS: Product[] = [
  { id: 'p01', name: 'Structured Blazer', designer: 'Maison Vell', price: 1240, category: 'Women', badge: 'New', sizes: ['XS','S','M','L'], img: 'https://images.unsplash.com/photo-1592960362714-0e753879ace5?auto=format&fit=crop&w=600&q=80', description: 'Precision-cut in Italian wool with sculptural shoulders and a single-button close.', material: 'Italian Wool 98%, Elastane 2%' },
  { id: 'p02', name: 'Silk Slip Dress', designer: 'Atelier Mira', price: 890, category: 'Women', sizes: ['XS','S','M'], img: 'https://images.unsplash.com/photo-1777894851675-c787ecde9acb?auto=format&fit=crop&w=600&q=80', description: 'Fluid 100% silk charmeuse with adjustable straps and a bias-cut hem.', material: 'Silk Charmeuse 100%', scarcity: 'Only 3 left' },
  { id: 'p03', name: 'Wide-Leg Trousers', designer: 'Studio Ko', price: 640, originalPrice: 980, category: 'Women', badge: 'Sale', sizes: ['XS','S','M','L','XL'], img: 'https://images.unsplash.com/photo-1772987311922-1f2a837bcf59?auto=format&fit=crop&w=600&q=80', description: 'High-waisted in a linen-cotton blend with pressed creases and side seam pockets.', material: 'Linen 60%, Cotton 40%' },
  { id: 'p04', name: 'Cashmere Turtleneck', designer: 'Kessler & Co', price: 520, category: 'Men', badge: 'New', sizes: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1630952588478-ee3231931243?auto=format&fit=crop&w=600&q=80', description: 'Grade A Mongolian cashmere in a relaxed-fit with ribbed cuffs and hem.', material: 'Grade A Cashmere 100%' },
  { id: 'p05', name: 'Tailored Overcoat', designer: 'Maison Vell', price: 2100, category: 'Men', sizes: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1619603364937-8d7af41ef206?auto=format&fit=crop&w=600&q=80', description: 'Double-breasted wool-cashmere blend with notched lapels and half-canvas construction.', material: 'Wool 80%, Cashmere 20%', scarcity: 'Only 2 left' },
  { id: 'p06', name: 'Vegetable-Tanned Tote', designer: 'Cordero', price: 1190, category: 'Accessories', badge: 'Exclusive', sizes: ['One Size'], img: 'https://images.unsplash.com/photo-1760624294504-211e763ee0fb?auto=format&fit=crop&w=600&q=80', description: 'Full-grain vegetable-tanned leather. Develops a rich patina over years of wear.', material: 'Full-Grain Leather, Brass Hardware' },
  { id: 'p07', name: 'Suede Chelsea Boots', designer: 'Atelier Mira', price: 760, originalPrice: 1100, category: 'Women', badge: 'Sale', sizes: ['36','37','38','39','40'], img: 'https://images.unsplash.com/photo-1577387224391-5de31164a0e0?auto=format&fit=crop&w=600&q=80', description: 'Nubuck suede upper with elasticated gussets and a stacked leather heel.', material: 'Nubuck Suede, Leather Sole' },
  { id: 'p08', name: 'Belgian Linen Shirt', designer: 'Studio Ko', price: 310, category: 'Men', sizes: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1591357037205-166318b51afd?auto=format&fit=crop&w=600&q=80', description: 'Garment-washed Belgian linen with a mandarin collar and mother-of-pearl buttons.', material: 'Belgian Linen 100%' },
  { id: 'p09', name: 'Merino Wrap Coat', designer: 'Kessler & Co', price: 1650, category: 'Women', badge: 'New', sizes: ['XS','S','M','L'], img: 'https://images.unsplash.com/photo-1724709972210-4beb408de580?auto=format&fit=crop&w=600&q=80', description: 'Lightweight merino with a self-tie belt and draped front panels. Weightless warmth.', material: 'Merino Wool 100%' },
  { id: 'p10', name: 'Calfskin Clutch', designer: 'Cordero', price: 590, category: 'Accessories', sizes: ['One Size'], img: 'https://images.unsplash.com/photo-1749294435694-ce3c586591e6?auto=format&fit=crop&w=600&q=80', description: "Buttery calfskin with a concealed clasp and suede lining. Fits an evening's essentials.", material: 'Calfskin Leather, Suede Interior' },
  { id: 'p11', name: 'Accordion Pleated Skirt', designer: 'Atelier Mira', price: 480, category: 'Women', sizes: ['XS','S','M','L'], img: 'https://images.unsplash.com/photo-1600681103852-5f6df72461aa?auto=format&fit=crop&w=600&q=80', description: 'Silk-blend satin with fine accordion pleats and a concealed back zip.', material: 'Silk 70%, Polyester 30%', scarcity: 'Only 4 left' },
  { id: 'p12', name: 'Selvedge Denim', designer: 'Studio Ko', price: 390, category: 'Men', sizes: ['28','30','32','34','36'], img: 'https://images.unsplash.com/photo-1592878849122-facb97520f9e?auto=format&fit=crop&w=600&q=80', description: 'Japanese selvedge in a slim-straight cut. Raw and unwashed — every pair ages uniquely.', material: 'Japanese Selvedge Denim 100%' },
];

const CATEGORIES = ['All', 'Women', 'Men', 'Accessories'];

const PRODUCT_ACTIONS = [
  { id: 'act-bag',       label: 'Add to Bag',  Icon: IcBag },
  { id: 'act-wishlist',  label: 'Wishlist',    Icon: IcHeart },
  { id: 'act-quickview', label: 'Quick View',  Icon: IcEye },
];

export function App() {
  return (
    <GhostProvider persistence={localStorageAdapter('luxe-v3')}>
      <LuxeApp />
      <GhostDemoBar />
      <GhostDevtools defaultOpen={true} />
    </GhostProvider>
  );
}

function LuxeApp() {
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState<Set<string>>(new Set());
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({});

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
    <div className="min-h-full bg-[#f8f5f0]">
      <AnnouncementBar />
      <SiteHeader cartCount={cart.size} wishlistCount={wishlist.size} />
      <CategoryNav category={category} setCategory={setCategory} />
      <main className="max-w-[1400px] mx-auto px-8 py-10">
        <CollectionHeader category={category} count={filtered.length} />
        <GhostHintBar />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 mt-6">
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              inCart={cart.has(product.id)}
              inWishlist={wishlist.has(product.id)}
              selectedSize={selectedSize[product.id] ?? ''}
              onSizeSelect={s => setSelectedSize(prev => ({ ...prev, [product.id]: s }))}
              onAction={aid => handleAction(aid, product)}
              index={i}
            />
          ))}
        </div>
      </main>
      <SiteFooter />
      {quickView && (
        <QuickViewModal
          product={quickView}
          inCart={cart.has(quickView.id)}
          inWishlist={wishlist.has(quickView.id)}
          onAction={aid => handleAction(aid, quickView)}
          onClose={() => setQuickView(null)}
        />
      )}
    </div>
  );
}

function AnnouncementBar() {
  return (
    <div className="bg-[#1a1714] text-[#f8f5f0] flex items-center justify-center gap-6 h-9 text-[11.5px] tracking-[0.05em]">
      <span>Complimentary shipping on orders over $250</span>
      <span className="opacity-30">·</span>
      <span>Free returns within 30 days</span>
      <span className="opacity-30">·</span>
      <span>Summer Collection now available</span>
    </div>
  );
}

function SiteHeader({ cartCount, wishlistCount }: { cartCount: number; wishlistCount: number }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#1a1714]/[0.08]">
      <div className="max-w-[1400px] mx-auto px-8 h-16 flex items-center gap-8">
        <div className="flex items-center gap-3 flex-none">
          <div className="h-6 w-6 rounded-sm bg-[#1a1714] flex items-center justify-center">
            <span className="text-white text-[8px] font-bold tracking-widest">L</span>
          </div>
          <span
            className="text-[26px] text-[#1a1714] tracking-[0.10em] leading-none select-none"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 500 }}
          >
            LUXE
          </span>
        </div>

        <div className="flex-1" />

        <nav className="flex items-center gap-7">
          {['New Arrivals', 'Designers', 'The Edit', 'Sale'].map(item => (
            <a
              key={item}
              href="#"
              className="text-[12.5px] tracking-[0.06em] uppercase text-[#6e6560] hover:text-[#1a1714] transition-colors font-medium"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-0.5">
          <button className="h-9 w-9 flex items-center justify-center text-[#6e6560] hover:text-[#1a1714] transition-colors hover:bg-black/[0.04] rounded-md cursor-pointer"><IcSearch /></button>
          <button className="relative h-9 w-9 flex items-center justify-center text-[#6e6560] hover:text-[#1a1714] transition-colors hover:bg-black/[0.04] rounded-md cursor-pointer">
            <IcHeart />
            {wishlistCount > 0 && <span className="absolute top-1.5 right-1.5 h-3 w-3 rounded-full bg-[#1a1714] text-white text-[7px] font-bold flex items-center justify-center">{wishlistCount}</span>}
          </button>
          <button className="relative h-9 w-9 flex items-center justify-center text-[#6e6560] hover:text-[#1a1714] transition-colors hover:bg-black/[0.04] rounded-md cursor-pointer">
            <IcBag />
            {cartCount > 0 && <span className="absolute top-1.5 right-1.5 h-3 w-3 rounded-full bg-[#b5892a] text-white text-[7px] font-bold flex items-center justify-center">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

function CategoryNav({ category, setCategory }: { category: string; setCategory: (c: string) => void }) {
  return (
    <div className="bg-white border-b border-[#1a1714]/[0.08]">
      <div className="max-w-[1400px] mx-auto px-8">
        <Ghost.Slot zone="luxe.categories" className="flex items-center gap-1">
          {CATEGORIES.map(cat => (
            <Ghost.Button
              key={cat}
              id={`cat-${cat}`}
              zone="luxe.categories"
              onClick={() => setCategory(cat)}
              className={[
                'relative px-4 py-3 text-[12.5px] tracking-[0.05em] uppercase font-medium transition-colors cursor-pointer border-0 outline-none bg-transparent',
                category === cat
                  ? 'text-[#1a1714]'
                  : 'text-[#a09890] hover:text-[#6e6560]',
              ].join(' ')}
            >
              {cat}
              {category === cat && (
                <span className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-[#1a1714]" />
              )}
            </Ghost.Button>
          ))}
        </Ghost.Slot>
      </div>
    </div>
  );
}

function CollectionHeader({ category, count }: { category: string; count: number }) {
  const title = category === 'All' ? 'The Summer Edit' : category;
  return (
    <div className="flex items-end justify-between pb-6 border-b border-[#1a1714]/[0.08]">
      <div>
        <p className="text-[11px] tracking-[0.14em] uppercase text-[#b5892a] mb-1.5 font-medium">SS 2025 Collection</p>
        <h1
          className="text-[38px] leading-none text-[#1a1714]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400 }}
        >
          {title}
        </h1>
        <p className="text-[14px] text-[#6e6560] mt-2">{count} pieces — curated for the considered wardrobe</p>
      </div>
      <div className="flex items-center gap-4 text-[12px] text-[#a09890]">
        <button className="flex items-center gap-1.5 hover:text-[#1a1714] transition-colors cursor-pointer">
          <IcSort /> Sort: Featured
        </button>
        <div className="h-4 w-px bg-[#1a1714]/[0.12]" />
        <button className="flex items-center gap-1.5 hover:text-[#1a1714] transition-colors cursor-pointer">
          <IcFilter /> Filter
        </button>
      </div>
    </div>
  );
}

function GhostHintBar() {
  return (
    <div className="flex items-center gap-3 mt-5 px-4 py-3 bg-white border border-[#1a1714]/[0.08] rounded-lg">
      <div className="h-5 w-5 rounded-sm bg-[#1a1714] flex items-center justify-center flex-none">
        <span className="text-white text-[8px] font-bold">G</span>
      </div>
      <p className="text-[12.5px] text-[#6e6560] leading-none">
        <span className="text-[#1a1714] font-medium">Ghost UI is active.</span>
        {' '}The category tabs and the action buttons on each product reorder silently as you browse — most-used float to the front.
      </p>
      <div className="ml-auto flex items-center gap-1.5 text-[11px] text-[#a09890] flex-none">
        <span className="h-1.5 w-1.5 rounded-full bg-[#22a352] animate-pulse" />
        Learning
      </div>
    </div>
  );
}

function ProductCard({ product, inCart, inWishlist, selectedSize, onSizeSelect, onAction, index }: {
  product: Product;
  inCart: boolean;
  inWishlist: boolean;
  selectedSize: string;
  onSizeSelect: (s: string) => void;
  onAction: (id: string) => void;
  index: number;
}) {
  return (
    <div
      className="group flex flex-col"
      style={{ animation: 'fade-up 0.4s ease both', animationDelay: `${Math.min(index * 40, 400)}ms` }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#ede9e3] rounded mb-3">
        <img
          src={product.img}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          {product.badge ? (
            <span className={[
              'text-[9.5px] font-semibold tracking-[0.10em] uppercase px-2 py-1',
              product.badge === 'Sale'      ? 'bg-white text-[#b53a22]' :
              product.badge === 'New'       ? 'bg-[#1a1714] text-white' :
              'bg-[#b5892a] text-white',
            ].join(' ')}>
              {product.badge}
            </span>
          ) : <span />}
          {product.scarcity && (
            <span className="text-[9.5px] font-medium tracking-wide bg-white/90 text-[#b53a22] px-2 py-1">
              {product.scarcity}
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" style={{ animation: undefined }}>
          <Ghost.Slot zone="luxe.product-actions" className="flex flex-col gap-1.5">
            {PRODUCT_ACTIONS.map(action => {
              const Icon = action.Icon;
              const active = action.id === 'act-bag' ? inCart : action.id === 'act-wishlist' ? inWishlist : false;
              return (
                <Ghost.Button
                  key={action.id}
                  id={action.id}
                  zone="luxe.product-actions"
                  onClick={() => onAction(action.id)}
                  className={[
                    'w-full flex items-center justify-center gap-2 py-2.5 text-[11.5px] font-medium tracking-[0.05em] uppercase cursor-pointer border-0 outline-none transition-colors',
                    action.id === 'act-bag'
                      ? active
                        ? 'bg-[#22a352] text-white'
                        : 'bg-[#1a1714] text-white hover:bg-[#333]'
                      : active
                        ? 'bg-white text-[#b5892a] border border-[#b5892a]/40'
                        : 'bg-white/90 text-[#1a1714] hover:bg-white border border-black/[0.06]',
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

      <div className="flex-1 flex flex-col">
        <p className="text-[10px] tracking-[0.12em] uppercase text-[#a09890] mb-1">{product.designer}</p>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="text-[16px] leading-snug text-[#1a1714] flex-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400 }}
          >
            {product.name}
          </h3>
          <div className="text-right flex-none">
            <p className="text-[14px] font-semibold text-[#1a1714] tabular-nums">${product.price.toLocaleString()}</p>
            {product.originalPrice && (
              <p className="text-[11px] text-[#b53a22] line-through tabular-nums">${product.originalPrice.toLocaleString()}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-auto">
          {product.sizes.slice(0, 5).map(s => (
            <button
              key={s}
              onClick={() => onSizeSelect(s)}
              className={[
                'text-[10px] px-1.5 py-0.5 border transition-colors cursor-pointer',
                selectedSize === s
                  ? 'border-[#1a1714] text-[#1a1714] bg-[#1a1714]/[0.05]'
                  : 'border-[#1a1714]/[0.14] text-[#a09890] hover:border-[#1a1714]/[0.35] hover:text-[#6e6560]',
              ].join(' ')}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickViewModal({ product, inCart, inWishlist, onAction, onClose }: {
  product: Product;
  inCart: boolean;
  inWishlist: boolean;
  onAction: (id: string) => void;
  onClose: () => void;
}) {
  const [size, setSize] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-[800px] bg-white rounded shadow-2xl overflow-hidden flex"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'fade-up 0.25s ease' }}
      >
        <div className="w-[360px] flex-none relative bg-[#ede9e3]">
          <img src={product.img} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
        </div>

        <div className="flex-1 flex flex-col p-10 max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 h-8 w-8 flex items-center justify-center text-[#a09890] hover:text-[#1a1714] hover:bg-black/[0.05] rounded transition-colors cursor-pointer"
          >
            <IcClose />
          </button>

          <p className="text-[10px] tracking-[0.12em] uppercase text-[#a09890] mb-2">{product.designer}</p>
          <h2
            className="text-[28px] leading-tight text-[#1a1714] mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400 }}
          >
            {product.name}
          </h2>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-[22px] font-semibold text-[#1a1714] tabular-nums">${product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-[16px] text-[#b53a22] line-through tabular-nums">${product.originalPrice.toLocaleString()}</span>
            )}
            {product.badge && (
              <span className={[
                'text-[9.5px] font-semibold tracking-[0.10em] uppercase px-2 py-1',
                product.badge === 'Sale' ? 'bg-[#b53a22]/[0.08] text-[#b53a22]' :
                product.badge === 'New'  ? 'bg-[#1a1714]/[0.07] text-[#1a1714]' :
                'bg-[#b5892a]/[0.10] text-[#b5892a]',
              ].join(' ')}>
                {product.badge}
              </span>
            )}
          </div>

          <p className="text-[13.5px] text-[#6e6560] leading-relaxed mb-5">{product.description}</p>

          <div className="mb-5">
            <p className="text-[10px] tracking-[0.10em] uppercase text-[#a09890] mb-1.5">Material</p>
            <p className="text-[13px] text-[#6e6560]">{product.material}</p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[10px] tracking-[0.10em] uppercase text-[#a09890]">Select Size</p>
              <a href="#" className="text-[10px] tracking-[0.06em] uppercase text-[#b5892a] hover:text-[#1a1714] transition-colors">Size Guide</a>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={[
                    'px-3 py-2 text-[12px] border transition-colors cursor-pointer',
                    size === s
                      ? 'border-[#1a1714] text-[#1a1714] bg-[#1a1714]/[0.04] font-medium'
                      : 'border-[#1a1714]/[0.15] text-[#6e6560] hover:border-[#1a1714]/[0.4] hover:text-[#1a1714]',
                  ].join(' ')}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {product.scarcity && (
            <p className="text-[12px] text-[#b53a22] mb-3 font-medium">{product.scarcity}</p>
          )}

          <div className="flex flex-col gap-2 mt-auto">
            <button
              onClick={() => onAction('act-bag')}
              className={[
                'w-full py-3.5 text-[12px] font-semibold tracking-[0.08em] uppercase transition-colors cursor-pointer border-0',
                inCart ? 'bg-[#22a352] text-white' : 'bg-[#1a1714] text-white hover:bg-[#333]',
              ].join(' ')}
            >
              {inCart ? 'Added to Bag ✓' : 'Add to Bag'}
            </button>
            <button
              onClick={() => onAction('act-wishlist')}
              className={[
                'w-full py-3 text-[12px] font-medium tracking-[0.08em] uppercase transition-colors cursor-pointer border',
                inWishlist
                  ? 'border-[#b5892a] text-[#b5892a] bg-[#b5892a]/[0.06]'
                  : 'border-[#1a1714]/[0.18] text-[#6e6560] hover:border-[#1a1714]/[0.40] hover:text-[#1a1714]',
              ].join(' ')}
            >
              {inWishlist ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-[#1a1714] text-[#f8f5f0] mt-20">
      <div className="max-w-[1400px] mx-auto px-8 py-14 grid grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="h-6 w-6 rounded-sm bg-white/10 flex items-center justify-center">
              <span className="text-white text-[8px] font-bold tracking-widest">L</span>
            </div>
            <span
              className="text-[22px] text-white tracking-[0.10em]"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
            >
              LUXE
            </span>
          </div>
          <p className="text-[12.5px] text-white/40 leading-relaxed">Considered pieces from the world's finest makers. Each item selected for craft, longevity, and beauty.</p>
          <div className="flex items-center gap-2 mt-5">
            <div className="h-1 w-1 rounded-full bg-[#22a352]" />
            <p className="text-[11px] text-white/30">Powered by <span className="text-[#b5892a]">Ghost UI</span></p>
          </div>
        </div>
        {[
          { title: 'Collections', links: ['Women', 'Men', 'Accessories', 'Designers', 'New Arrivals'] },
          { title: 'Customer Care', links: ['Size Guide', 'Shipping & Returns', 'Care Instructions', 'Contact Us'] },
          { title: 'Company', links: ['Our Story', 'Sustainability', 'Careers', 'Press'] },
        ].map(col => (
          <div key={col.title}>
            <p className="text-[9.5px] font-semibold tracking-[0.14em] uppercase text-white/40 mb-4">{col.title}</p>
            <ul className="flex flex-col gap-2.5">
              {col.links.map(l => (
                <li key={l}><a href="#" className="text-[13px] text-white/60 hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/[0.08] px-8 py-5 max-w-[1400px] mx-auto flex items-center justify-between">
        <p className="text-[11px] text-white/25">© 2025 Luxe. All rights reserved.</p>
        <div className="flex gap-5">
          {['Privacy', 'Terms', 'Accessibility'].map(l => (
            <a key={l} href="#" className="text-[11px] text-white/30 hover:text-white/60 transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function IcBag() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M5.5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><rect x="2" y="6" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>; }
function IcHeart() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 13.5S2 9.5 2 5.5A3.5 3.5 0 0 1 8.01 4 3.5 3.5 0 0 1 14 5.5C14 9.5 8 13.5 8 13.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>; }
function IcEye() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1.5 8S4 3 8 3s6.5 5 6.5 5S12 13 8 13 1.5 8 1.5 8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>; }
function IcSearch() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>; }
function IcSort() { return <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>; }
function IcFilter() { return <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 3.5h12l-4.5 5.5v4l-3-1.5V9L2 3.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>; }
function IcClose() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>; }

const LUXE_SIM_EVENTS: Array<{ id: string; zone: string; count: number }> = [
  { id: 'cat-All',         zone: 'luxe.categories',     count: 15 },
  { id: 'cat-Women',       zone: 'luxe.categories',     count:  8 },
  { id: 'cat-Men',         zone: 'luxe.categories',     count:  4 },
  { id: 'cat-Accessories', zone: 'luxe.categories',     count: 22 },
  { id: 'act-bag',         zone: 'luxe.product-actions', count: 38 },
  { id: 'act-wishlist',    zone: 'luxe.product-actions', count: 24 },
  { id: 'act-quickview',   zone: 'luxe.product-actions', count: 10 },
];

function GhostDemoBar() {
  const engine = useGhostEngine();
  const [eventCount, setEventCount] = useState(() => engine.events().length);
  const [simulated, setSimulated] = useState(false);

  useEffect(() => engine.subscribe(() => setEventCount(engine.events().length)), [engine]);

  function handleSimulate() {
    const now = Date.now();
    const DAY = 86_400_000;
    const events: GhostEvent[] = LUXE_SIM_EVENTS.flatMap(({ id, zone, count }) =>
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

  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex flex-col gap-2.5 rounded-xl border border-white/[0.08] bg-[#0a0804]/90 backdrop-blur-md p-3.5 w-60 shadow-2xl shadow-black/60">
      <div className="flex items-center justify-between">
        <span className="font-bold text-[#c9a05a] tracking-widest uppercase text-[9px]">Ghost Engine</span>
        <span className="rounded-full bg-[#b5892a]/20 text-[#c9a05a] px-2 py-0.5 text-[10px] font-mono tabular-nums">{eventCount} events</span>
      </div>
      <p className="text-[10px] text-[#5a4a2a] leading-relaxed">Inject 4 weeks of realistic usage — watch Ghost UI reorder categories and actions by purchase intent.</p>
      <button
        onClick={handleSimulate}
        disabled={simulated}
        className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all ${simulated ? 'bg-[#b5892a]/15 text-[#c9a05a] cursor-default' : 'bg-[#b5892a] text-white hover:bg-[#9e7622] active:scale-[0.97]'}`}
      >
        {simulated ? '✓ Simulated' : '⚡ Simulate 4-week usage'}
      </button>
      <button
        onClick={handleReset}
        className="rounded-lg px-3 py-1.5 text-[11px] font-medium text-[#5a4a2a] hover:text-[#8a7450] hover:bg-white/[0.04] transition-all"
      >
        ↺ Reset all scores
      </button>
      <div className="border-t border-white/[0.06] pt-2.5">
        <GhostPrivacyPanel style={{ borderRadius: 8, padding: '8px 10px', gap: 6 }} />
      </div>
    </div>
  );
}
