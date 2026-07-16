'use client';
import { useEffect } from 'react';
import { useRecentlyViewed } from '@/lib/account-hooks';

/**
 * Silent client component that records a product handle on mount.
 * Placed inside server-rendered product detail pages.
 */
export function RecordRecentlyViewed({ handle }) {
  const { record } = useRecentlyViewed();
  useEffect(() => { if (handle) record(handle); }, [handle, record]);
  return null;
}
