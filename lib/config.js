/**
 * SITE_CONFIG — single source of truth for RatAttacK brand information.
 *
 * This file replaces piecemeal constants across the codebase. Every module
 * that referenced discord / youtube / email / copy year now imports the
 * relevant sub-object from here.
 *
 * Type-safety: annotated with JSDoc so IDEs and future .ts migration
 * both get the shape without introducing TypeScript files today.
 *
 * @typedef {Object} SiteConfig
 * @property {Object} brand
 * @property {Object} website
 * @property {Object} email
 * @property {Object} social
 * @property {Object} store
 * @property {Object} seo
 * @property {Object} theme
 * @property {Object} audio
 */

/** @type {SiteConfig} */
export const SITE_CONFIG = {
  brand: {
    name: 'RatAttacK',
    tagline: 'Collect. Conquer. Create.',
    description:
      'RatAttacK creates cinematic gaming content, competitive gameplay, and an active community built around great games, unforgettable moments, and the love of collecting.',
    logoAvatar: '/ratattack-avatar.png',
  },

  website: {
    url: 'https://ratattack.gg',
    launchYear: 2026,
    get copyright() {
      return `\u00a9 ${new Date().getFullYear()} RatAttacK. All Rights Reserved.`;
    },
  },

  email: {
    contact:  'contact@ratattack.gg',
    business: 'business@ratattack.gg',
    support:  'support@ratattack.gg',
    orders:   'orders@ratattack.gg',
  },

  // Social links preserved exactly as previously configured.
  // Empty strings mean "not configured" — Footer auto-hides those icons.
  social: {
    discord:   'https://discord.gg/tqJXrzUX9h',
    youtube:   'https://www.youtube.com/channel/UCro3AjNRHR1Jbd-P2IVztFA?sub_confirmation=1',
    twitter:   'https://x.com/llratattackll',
    twitch:    'https://www.twitch.tv/llratattackll',
    tiktok:    'https://www.tiktok.com/@llratattackll?is_from_webapp=1&sender_device=pc',
    instagram: 'https://www.instagram.com/llratattackll/',
    github:    '',
  },

  store: {
    currency: 'USD',
    currencySymbol: '$',
    freeShippingThreshold: 75,
    taxRate: 0.08,
    supportEmail: 'orders@ratattack.gg',
  },

  seo: {
    defaultTitle: 'RatAttacK — Dark Fantasy Gaming Content',
    defaultDescription:
      'RatAttacK creates funny, high-quality gaming content on Dark and Darker, Escape from Tarkov, extraction shooters, survival games, and other multiplayer chaos. Join the horde.',
    defaultKeywords: [
      'RatAttacK', 'Dark and Darker', 'Escape from Tarkov', 'gaming', 'YouTube',
      'extraction shooter', 'survival games', 'Pokémon TCG', 'trading card game',
    ],
    ogImage: '/ratattack-avatar.png',
  },

  theme: {
    primary:   '#dc2626', // crimson
    secondary: '#0a0a0a', // dark surface
    accent:    '#f59e0b', // amber highlight
    background:'#050505',
    foreground:'#f5f5f4',
    font: {
      display: 'Cinzel',
      body:    'Inter',
    },
  },

  audio: {
    // Ambient loop served from /public/audio/ambience.mp3
    ambientSrc: '/audio/ambience.mp3',
    defaultVolume: 0.35,
    label: 'Echoes in the Static',
  },

  // UI polish flags
  ui: {
    customCursor: true,       // Set false to disable the medieval dagger cursor globally
    routeTransitions: true,   // Enables branded loading screen during route changes
  },
};

// ---- Backwards-compatible flat exports ----
// Existing imports of these named symbols keep working unchanged.
export const YOUTUBE_CHANNEL_ID = 'UCro3AjNRHR1Jbd-P2IVztFA';
export const YOUTUBE_CHANNEL_URL = SITE_CONFIG.social.youtube;

/**
 * ⚔️ SINGLE SOURCE OF TRUTH for the Discord invite URL used by every
 * Discord button, icon, CTA, and footer link across the site.
 * Update ONLY this value — every Discord link updates automatically.
 */
export const DISCORD_INVITE_URL = SITE_CONFIG.social.discord;

// Legacy alias — kept for any older imports; both point to the same value.
export const DISCORD_URL = DISCORD_INVITE_URL;

// Legacy shape: components that read `SITE_CONFIG.discord` (flat) also work,
// so we expose a top-level view alongside the structured version.
Object.assign(SITE_CONFIG, {
  discord:   SITE_CONFIG.social.discord,
  youtube:   SITE_CONFIG.social.youtube,
  twitter:   SITE_CONFIG.social.twitter,
  twitch:    SITE_CONFIG.social.twitch,
  tiktok:    SITE_CONFIG.social.tiktok,
  instagram: SITE_CONFIG.social.instagram,
  github:    SITE_CONFIG.social.github,
});
