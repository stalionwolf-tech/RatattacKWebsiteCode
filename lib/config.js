/**
 * Central configuration for all external links used across the site.
 *
 * To add or update a link, change it here — every button, icon, and CTA
 * across the application reads from this single source of truth.
 *
 * Usage in any component:
 *   import { SITE_CONFIG } from '@/lib/config';
 *   <a href={SITE_CONFIG.discord} target="_blank" rel="noopener noreferrer">...</a>
 */
export const SITE_CONFIG = {
  // Active
  discord: 'https://discord.gg/tqJXrzUX9h',
  youtube: 'https://www.youtube.com/channel/UCro3AjNRHR1Jbd-P2IVztFA?sub_confirmation=1',

  // Reserved for the future — leave blank until claimed.
  // Any component reading these should hide itself when the value is empty.
  twitter: '',
  twitch: '',
  tiktok: '',
  instagram: '',
  github: '',
  email: 'contact@ratattack.gg',
};

// YouTube channel id kept separate so the /api/videos route can reach it.
export const YOUTUBE_CHANNEL_ID = 'UCro3AjNRHR1Jbd-P2IVztFA';
