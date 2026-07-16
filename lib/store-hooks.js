'use client';
import { useCallback, useEffect, useState } from 'react';

// Small event bus so any component can react to cart/wishlist changes.
const CART_KEY = 'ratattack_cart_v2';
const WISH_KEY = 'ratattack_wishlist_v1';
const RECENT_KEY = 'ratattack_recent_v1';
const CART_OPEN_EVT = 'ratattack:cart:open';
const CART_EVT = 'ratattack:cart';
const WISH_EVT = 'ratattack:wishlist';

function readJSON(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
}
function writeJSON(key, value, evt) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    if (evt) window.dispatchEvent(new Event(evt));
  } catch {}
}

export function openCartDrawer()  { if (typeof window !== 'undefined') window.dispatchEvent(new Event(CART_OPEN_EVT)); }
export const CART_OPEN_EVENT = CART_OPEN_EVT;

// -------- Cart --------
export function useCart() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(readJSON(CART_KEY, []));
    const on = () => setItems(readJSON(CART_KEY, []));
    window.addEventListener(CART_EVT, on);
    window.addEventListener('storage', on);
    return () => { window.removeEventListener(CART_EVT, on); window.removeEventListener('storage', on); };
  }, []);

  const persist = useCallback((next) => { setItems(next); writeJSON(CART_KEY, next, CART_EVT); }, []);

  const add = useCallback((product, qty = 1, variantId = null) => {
    const key = variantId || product.variants?.[0]?.id || product.handle;
    const current = readJSON(CART_KEY, []);
    const idx = current.findIndex((c) => c.key === key);
    if (idx >= 0) current[idx].quantity += qty;
    else current.push({
      key, handle: product.handle, title: product.title,
      variantTitle: product.variants?.[0]?.title || 'Default',
      price: Number(product.priceRange.minVariantPrice.amount),
      currency: product.priceRange.minVariantPrice.currencyCode,
      image: product.featuredImage,
      quantity: qty,
      maxQuantity: Math.max(1, product.totalInventory || 10),
    });
    persist(current);
  }, [persist]);

  const setQuantity = useCallback((key, qty) => {
    const next = readJSON(CART_KEY, []).map((c) => c.key === key ? { ...c, quantity: Math.max(1, Math.min(qty, c.maxQuantity)) } : c);
    persist(next);
  }, [persist]);

  const remove = useCallback((key) => { persist(readJSON(CART_KEY, []).filter((c) => c.key !== key)); }, [persist]);
  const clear = useCallback(() => { persist([]); }, [persist]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 0 && subtotal < 75 ? 6.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return { items, count, subtotal, shipping, tax, total, add, remove, setQuantity, clear };
}

// -------- Wishlist --------
export function useWishlist() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(readJSON(WISH_KEY, []));
    const on = () => setItems(readJSON(WISH_KEY, []));
    window.addEventListener(WISH_EVT, on);
    window.addEventListener('storage', on);
    return () => { window.removeEventListener(WISH_EVT, on); window.removeEventListener('storage', on); };
  }, []);

  const toggle = useCallback((product) => {
    const cur = readJSON(WISH_KEY, []);
    const exists = cur.some((h) => h === product.handle);
    const next = exists ? cur.filter((h) => h !== product.handle) : [...cur, product.handle];
    writeJSON(WISH_KEY, next, WISH_EVT);
    setItems(next);
    return !exists;
  }, []);
  const has = useCallback((handle) => items.includes(handle), [items]);
  const remove = useCallback((handle) => {
    const next = readJSON(WISH_KEY, []).filter((h) => h !== handle);
    writeJSON(WISH_KEY, next, WISH_EVT);
    setItems(next);
  }, []);
  return { items, has, toggle, remove, count: items.length };
}

// -------- Recently Viewed --------
export function useRecentlyViewed() {
  const [items, setItems] = useState([]);
  useEffect(() => { setItems(readJSON(RECENT_KEY, [])); }, []);
  const record = useCallback((handle) => {
    const cur = readJSON(RECENT_KEY, []).filter((h) => h !== handle);
    const next = [handle, ...cur].slice(0, 8);
    writeJSON(RECENT_KEY, next);
    setItems(next);
  }, []);
  return { items, record };
}
