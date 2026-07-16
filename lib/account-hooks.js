'use client';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';

/**
 * ------------------------------------------------------------
 * Per-user localStorage collections (addresses, payment methods,
 * notification prefs). Keyed by the auth user's ID so multiple
 * accounts on the same browser stay isolated.
 *
 * Ready to swap for Shopify Customer Accounts later — the shape
 * matches Shopify's MailingAddress / CustomerPaymentMethod types.
 * ------------------------------------------------------------
 */

const hasWindow = () => typeof window !== 'undefined';
const read  = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const uid   = () => (hasWindow() && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}${Math.random().toString(36).slice(2, 8)}`);

const keyFor = (userId, kind) => `ratattack_account_${kind}_${userId}`;

// -------------- Addresses --------------------------------------------------
export function useAddresses() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user?.id) { setItems([]); return; }
    setItems(read(keyFor(user.id, 'addresses'), []));
  }, [user?.id]);

  const persist = useCallback((next) => {
    setItems(next);
    if (user?.id) write(keyFor(user.id, 'addresses'), next);
  }, [user?.id]);

  const add = useCallback((address) => {
    const record = {
      id: uid(),
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      company: address.company || '',
      address1: address.address1 || '',
      address2: address.address2 || '',
      city: address.city || '',
      province: address.province || '',
      zip: address.zip || '',
      country: address.country || 'United States',
      phone: address.phone || '',
      isDefault: !!address.isDefault,
      createdAt: new Date().toISOString(),
    };
    let next = [...items, record];
    if (record.isDefault || items.length === 0) {
      next = next.map((a) => ({ ...a, isDefault: a.id === record.id }));
    }
    persist(next);
    return record;
  }, [items, persist]);

  const update = useCallback((id, patch) => {
    let next = items.map((a) => a.id === id ? { ...a, ...patch } : a);
    if (patch.isDefault) next = next.map((a) => ({ ...a, isDefault: a.id === id }));
    persist(next);
  }, [items, persist]);

  const remove = useCallback((id) => {
    const wasDefault = items.find((a) => a.id === id)?.isDefault;
    let next = items.filter((a) => a.id !== id);
    if (wasDefault && next.length) next = next.map((a, i) => ({ ...a, isDefault: i === 0 }));
    persist(next);
  }, [items, persist]);

  const setDefault = useCallback((id) => update(id, { isDefault: true }), [update]);

  return { addresses: items, add, update, remove, setDefault };
}

// -------------- Payment methods (mock CRUD, UI only) -----------------------
export function usePaymentMethods() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user?.id) { setItems([]); return; }
    setItems(read(keyFor(user.id, 'payment_methods'), []));
  }, [user?.id]);

  const persist = useCallback((next) => {
    setItems(next);
    if (user?.id) write(keyFor(user.id, 'payment_methods'), next);
  }, [user?.id]);

  const add = useCallback(({ cardNumber, expMonth, expYear, cardholderName, brand }) => {
    const digits = String(cardNumber || '').replace(/\D/g, '');
    const last4 = digits.slice(-4);
    if (last4.length !== 4) throw new Error('Please enter a valid card number.');
    const inferBrand = () => {
      if (/^4/.test(digits)) return 'Visa';
      if (/^(5[1-5]|2[2-7])/.test(digits)) return 'Mastercard';
      if (/^(34|37)/.test(digits)) return 'Amex';
      if (/^6(011|5)/.test(digits)) return 'Discover';
      return 'Card';
    };
    const record = {
      id: uid(),
      brand: brand || inferBrand(),
      last4,
      expMonth: String(expMonth || '').padStart(2, '0'),
      expYear:  String(expYear || ''),
      cardholderName: cardholderName || '',
      isDefault: items.length === 0,
      createdAt: new Date().toISOString(),
    };
    persist([...items, record]);
    return record;
  }, [items, persist]);

  const remove = useCallback((id) => {
    const wasDefault = items.find((a) => a.id === id)?.isDefault;
    let next = items.filter((a) => a.id !== id);
    if (wasDefault && next.length) next[0] = { ...next[0], isDefault: true };
    persist(next);
  }, [items, persist]);

  const setDefault = useCallback((id) => {
    persist(items.map((a) => ({ ...a, isDefault: a.id === id })));
  }, [items, persist]);

  return { methods: items, add, remove, setDefault };
}

// -------------- Notification preferences ---------------------------------
const DEFAULT_PREFS = {
  orderUpdates:      true,
  restockAlerts:     true,
  communityDigest:   true,
  promotionalOffers: true,
  desktopPush:       false,
};

export function useNotificationPrefs() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  useEffect(() => {
    if (!user?.id) { setPrefs(DEFAULT_PREFS); return; }
    setPrefs({ ...DEFAULT_PREFS, ...read(keyFor(user.id, 'notifications'), {}) });
  }, [user?.id]);

  const update = useCallback((patch) => {
    setPrefs((p) => {
      const next = { ...p, ...patch };
      if (user?.id) write(keyFor(user.id, 'notifications'), next);
      return next;
    });
  }, [user?.id]);

  return { prefs, update };
}

// -------------- Recently viewed products ----------------------------------
const RECENT_KEY = 'ratattack_recently_viewed_v1';
const RECENT_MAX = 12;

export function useRecentlyViewed() {
  const [handles, setHandles] = useState([]);
  useEffect(() => { setHandles(read(RECENT_KEY, [])); }, []);
  const record = useCallback((handle) => {
    if (!handle) return;
    setHandles((prev) => {
      const next = [handle, ...prev.filter((h) => h !== handle)].slice(0, RECENT_MAX);
      write(RECENT_KEY, next);
      return next;
    });
  }, []);
  const clear = useCallback(() => { write(RECENT_KEY, []); setHandles([]); }, []);
  return { handles, record, clear };
}
