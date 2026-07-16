/**
 * Backwards-compatible shim.
 * All external links live in `lib/config.js` — SITE_CONFIG.
 * The named exports below simply forward to that single source of truth
 * so existing imports keep working while we migrate.
 */
import {
  SITE_CONFIG,
  YOUTUBE_CHANNEL_ID as _CID,
  YOUTUBE_CHANNEL_URL as _YURL,
  DISCORD_INVITE_URL as _DURL,
  DISCORD_URL as _DURL_LEGACY,
} from './config';

export const YOUTUBE_CHANNEL_URL = _YURL;
export const YOUTUBE_CHANNEL_ID  = _CID;

// Canonical Discord invite URL. Every Discord link on the site funnels here.
export const DISCORD_INVITE_URL = _DURL;
export const DISCORD_URL       = _DURL_LEGACY;

// Re-export the object itself for anyone who wants it directly.
export { SITE_CONFIG };
