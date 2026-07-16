/**
 * Central configuration for all external links used across the site.
 *
 * To add or update a link, change it here — every button, icon, and CTA
 * across the application reads from this single source of truth.
 *
 * Usage in any component:
 *   import { SITE_CONFIG } from '@/lib/config';
 *   <a href={SITE_CONFIG.discord} target="_blank" rel="noopener noreferrer">...</a>
 *
 * Empty strings are treated as "not configured" — the Footer social row
 * automatically hides any entry with an empty href.
 */
export const SITE_CONFIG = {
  // Active social + community links
  discord:   'https://discord.gg/tqJXrzUX9h',
  youtube:   'https://www.youtube.com/channel/UCro3AjNRHR1Jbd-P2IVztFA?sub_confirmation=1',
  twitter:   'https://x.com/llratattackll',
  twitch:    'https://www.twitch.tv/llratattackll',
  tiktok:    'https://www.tiktok.com/@llratattackll?is_from_webapp=1&sender_device=pc',
  instagram: 'https://www.instagram.com/llratattackll/',

  // Not configured yet — hidden automatically
  github:    '',

  // Contact
  email:     'contact@ratattack.gg',
};

// YouTube channel id kept separate so the /api/videos route can reach it.
export const YOUTUBE_CHANNEL_ID = 'UCro3AjNRHR1Jbd-P2IVztFA';
