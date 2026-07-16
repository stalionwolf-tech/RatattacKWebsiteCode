/**
 * Backwards-compatible shim.
 * All external links live in `lib/config.js` — SITE_CONFIG.
 * The named exports below simply forward to that single source of truth
 * so existing imports keep working while we migrate.
 */
import { SITE_CONFIG, YOUTUBE_CHANNEL_ID as _CID } from './config';

export const YOUTUBE_CHANNEL_URL = SITE_CONFIG.youtube;
export const YOUTUBE_CHANNEL_ID = _CID;
export const DISCORD_URL = SITE_CONFIG.discord;

// Re-export the object itself for anyone who wants it directly.
export { SITE_CONFIG };
