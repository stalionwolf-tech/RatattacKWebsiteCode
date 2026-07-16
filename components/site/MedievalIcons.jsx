'use client';
// Handcrafted pixel-art medieval icon set.
// Each icon is drawn on a 16x16 grid using <rect> elements.
// shape-rendering: crispEdges keeps every pixel razor-sharp at any scale.

const pixelStyle = { shapeRendering: 'crispEdges' };

function Base({ children, size = 48, color = 'currentColor', className = '' }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={className}
      style={{ ...pixelStyle, imageRendering: 'pixelated' }}
      fill={color}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// Crossed swords
export function IconSwords(props) {
  return (
    <Base {...props}>
      {/* Left blade top-right to bottom-left */}
      <rect x="12" y="1" width="2" height="1" />
      <rect x="11" y="2" width="2" height="1" />
      <rect x="10" y="3" width="2" height="1" />
      <rect x="9" y="4" width="2" height="1" />
      <rect x="8" y="5" width="2" height="1" />
      <rect x="7" y="6" width="2" height="1" />
      <rect x="6" y="7" width="2" height="1" />
      {/* Right blade top-left to bottom-right */}
      <rect x="2" y="1" width="2" height="1" />
      <rect x="3" y="2" width="2" height="1" />
      <rect x="4" y="3" width="2" height="1" />
      <rect x="5" y="4" width="2" height="1" />
      <rect x="6" y="5" width="2" height="1" />
      <rect x="7" y="6" width="2" height="1" />
      {/* Hilts + crossguards */}
      <rect x="1" y="9" width="5" height="1" opacity="0.75" />
      <rect x="2" y="10" width="3" height="2" opacity="0.85" />
      <rect x="3" y="12" width="1" height="3" opacity="0.85" />
      <rect x="10" y="9" width="5" height="1" opacity="0.75" />
      <rect x="11" y="10" width="3" height="2" opacity="0.85" />
      <rect x="12" y="12" width="1" height="3" opacity="0.85" />
    </Base>
  );
}

// Rat skull (matching brand)
export function IconSkull(props) {
  return (
    <Base {...props}>
      <rect x="4" y="2" width="8" height="1" />
      <rect x="3" y="3" width="10" height="1" />
      <rect x="2" y="4" width="12" height="5" />
      {/* Eyes */}
      <rect x="4" y="5" width="3" height="2" fill="#0a0000" />
      <rect x="9" y="5" width="3" height="2" fill="#0a0000" />
      {/* Nose */}
      <rect x="7" y="7" width="2" height="1" fill="#0a0000" />
      {/* Jaw */}
      <rect x="3" y="9" width="10" height="1" />
      <rect x="4" y="10" width="8" height="1" />
      <rect x="5" y="11" width="1" height="2" />
      <rect x="7" y="11" width="1" height="2" />
      <rect x="9" y="11" width="1" height="2" />
      <rect x="11" y="11" width="1" height="2" />
    </Base>
  );
}

// Ghost / Wraith
export function IconGhost(props) {
  return (
    <Base {...props}>
      <rect x="5" y="2" width="6" height="1" />
      <rect x="4" y="3" width="8" height="1" />
      <rect x="3" y="4" width="10" height="9" />
      {/* Eyes */}
      <rect x="5" y="6" width="2" height="2" fill="#0a0000" />
      <rect x="9" y="6" width="2" height="2" fill="#0a0000" />
      {/* Mouth */}
      <rect x="7" y="9" width="2" height="1" fill="#0a0000" />
      {/* Bottom ripples */}
      <rect x="3" y="13" width="2" height="1" />
      <rect x="7" y="13" width="2" height="1" />
      <rect x="11" y="13" width="2" height="1" />
      <rect x="4" y="14" width="1" height="1" />
      <rect x="8" y="14" width="1" height="1" />
      <rect x="12" y="14" width="1" height="1" />
    </Base>
  );
}

// Users / Horde (twin knights)
export function IconHorde(props) {
  return (
    <Base {...props}>
      {/* Left figure */}
      <rect x="3" y="3" width="3" height="3" />
      <rect x="2" y="7" width="5" height="5" />
      <rect x="3" y="12" width="1" height="2" />
      <rect x="5" y="12" width="1" height="2" />
      {/* Right figure */}
      <rect x="10" y="3" width="3" height="3" />
      <rect x="9" y="7" width="5" height="5" />
      <rect x="10" y="12" width="1" height="2" />
      <rect x="12" y="12" width="1" height="2" />
      {/* Bond/banner between */}
      <rect x="7" y="8" width="2" height="3" opacity="0.5" />
    </Base>
  );
}

// Shield
export function IconShield(props) {
  return (
    <Base {...props}>
      <rect x="3" y="2" width="10" height="1" />
      <rect x="2" y="3" width="12" height="7" />
      <rect x="3" y="10" width="10" height="1" />
      <rect x="4" y="11" width="8" height="1" />
      <rect x="5" y="12" width="6" height="1" />
      <rect x="6" y="13" width="4" height="1" />
      <rect x="7" y="14" width="2" height="1" />
      {/* Cross emblem */}
      <rect x="7" y="4" width="2" height="6" fill="#0a0000" opacity="0.7" />
      <rect x="4" y="6" width="8" height="2" fill="#0a0000" opacity="0.7" />
    </Base>
  );
}

// Bolt / Rune of Power
export function IconBolt(props) {
  return (
    <Base {...props}>
      <rect x="8" y="1" width="4" height="1" />
      <rect x="7" y="2" width="4" height="1" />
      <rect x="6" y="3" width="4" height="1" />
      <rect x="5" y="4" width="4" height="1" />
      <rect x="4" y="5" width="4" height="1" />
      <rect x="3" y="6" width="8" height="1" />
      <rect x="5" y="7" width="6" height="1" />
      <rect x="6" y="8" width="4" height="1" />
      <rect x="5" y="9" width="4" height="1" />
      <rect x="4" y="10" width="4" height="1" />
      <rect x="3" y="11" width="4" height="1" />
      <rect x="2" y="12" width="4" height="1" />
    </Base>
  );
}

// Chalice / Grail
export function IconChalice(props) {
  return (
    <Base {...props}>
      <rect x="3" y="2" width="10" height="1" />
      <rect x="3" y="3" width="10" height="3" />
      <rect x="4" y="6" width="8" height="1" />
      <rect x="5" y="7" width="6" height="1" />
      <rect x="6" y="8" width="4" height="3" />
      <rect x="5" y="11" width="6" height="1" />
      <rect x="4" y="12" width="8" height="2" />
      {/* Wine */}
      <rect x="4" y="3" width="8" height="2" fill="#0a0000" opacity="0.6" />
    </Base>
  );
}

// Scroll / Contact
export function IconScroll(props) {
  return (
    <Base {...props}>
      <rect x="2" y="3" width="12" height="2" />
      <rect x="3" y="5" width="10" height="6" />
      <rect x="2" y="11" width="12" height="2" />
      {/* Text lines */}
      <rect x="5" y="7" width="6" height="1" fill="#0a0000" opacity="0.5" />
      <rect x="5" y="9" width="4" height="1" fill="#0a0000" opacity="0.5" />
      {/* Rolled ends */}
      <rect x="2" y="2" width="1" height="4" opacity="0.7" />
      <rect x="13" y="2" width="1" height="4" opacity="0.7" />
      <rect x="2" y="10" width="1" height="4" opacity="0.7" />
      <rect x="13" y="10" width="1" height="4" opacity="0.7" />
    </Base>
  );
}

// Tower / Castle
export function IconTower(props) {
  return (
    <Base {...props}>
      {/* Battlements */}
      <rect x="2" y="2" width="2" height="2" />
      <rect x="5" y="2" width="2" height="2" />
      <rect x="9" y="2" width="2" height="2" />
      <rect x="12" y="2" width="2" height="2" />
      {/* Body */}
      <rect x="2" y="4" width="12" height="10" />
      {/* Door */}
      <rect x="7" y="9" width="2" height="5" fill="#0a0000" />
      {/* Windows */}
      <rect x="4" y="6" width="2" height="2" fill="#0a0000" />
      <rect x="10" y="6" width="2" height="2" fill="#0a0000" />
    </Base>
  );
}

// Coin / Treasure
export function IconCoin(props) {
  return (
    <Base {...props}>
      <rect x="5" y="2" width="6" height="1" />
      <rect x="3" y="3" width="10" height="1" />
      <rect x="2" y="4" width="12" height="8" />
      <rect x="3" y="12" width="10" height="1" />
      <rect x="5" y="13" width="6" height="1" />
      {/* Rune */}
      <rect x="6" y="5" width="4" height="1" fill="#0a0000" opacity="0.6" />
      <rect x="7" y="6" width="2" height="4" fill="#0a0000" opacity="0.6" />
      <rect x="6" y="10" width="4" height="1" fill="#0a0000" opacity="0.6" />
    </Base>
  );
}

// Bell / Notify
export function IconBell(props) {
  return (
    <Base {...props}>
      <rect x="7" y="1" width="2" height="1" />
      <rect x="5" y="2" width="6" height="1" />
      <rect x="4" y="3" width="8" height="7" />
      <rect x="3" y="10" width="10" height="1" />
      <rect x="2" y="11" width="12" height="1" />
      <rect x="7" y="12" width="2" height="2" />
      {/* Clapper */}
      <rect x="7" y="14" width="2" height="1" opacity="0.7" />
    </Base>
  );
}

// Play triangle (medieval banner style)
export function IconPlay(props) {
  return (
    <Base {...props}>
      <rect x="4" y="3" width="2" height="10" />
      <rect x="6" y="4" width="2" height="8" />
      <rect x="8" y="5" width="2" height="6" />
      <rect x="10" y="6" width="2" height="4" />
      <rect x="12" y="7" width="1" height="2" />
    </Base>
  );
}

// Send raven / arrow
export function IconRaven(props) {
  return (
    <Base {...props}>
      {/* Body */}
      <rect x="6" y="6" width="5" height="3" />
      {/* Beak */}
      <rect x="11" y="7" width="3" height="1" />
      {/* Wing */}
      <rect x="2" y="3" width="3" height="1" />
      <rect x="3" y="4" width="4" height="1" />
      <rect x="4" y="5" width="5" height="1" />
      {/* Tail */}
      <rect x="3" y="9" width="3" height="1" />
      <rect x="4" y="10" width="3" height="1" />
      {/* Eye */}
      <rect x="9" y="7" width="1" height="1" fill="#0a0000" />
    </Base>
  );
}

// Crown
export function IconCrown(props) {
  return (
    <Base {...props}>
      <rect x="2" y="5" width="2" height="2" />
      <rect x="7" y="3" width="2" height="4" />
      <rect x="12" y="5" width="2" height="2" />
      <rect x="2" y="7" width="12" height="3" />
      <rect x="3" y="10" width="10" height="1" />
      {/* Gems */}
      <rect x="5" y="8" width="1" height="1" fill="#0a0000" opacity="0.7" />
      <rect x="7" y="8" width="2" height="1" fill="#0a0000" opacity="0.7" />
      <rect x="10" y="8" width="1" height="1" fill="#0a0000" opacity="0.7" />
    </Base>
  );
}

// Ornate divider glyph
export function IconDivider(props) {
  return (
    <Base {...props}>
      <rect x="7" y="3" width="2" height="2" />
      <rect x="5" y="5" width="6" height="2" />
      <rect x="3" y="7" width="10" height="2" />
      <rect x="5" y="9" width="6" height="2" />
      <rect x="7" y="11" width="2" height="2" />
    </Base>
  );
}

// Menu / Hamburger (three medieval banners)
export function IconMenu(props) {
  return (
    <Base {...props}>
      <rect x="2" y="3" width="12" height="2" />
      <rect x="2" y="7" width="12" height="2" />
      <rect x="2" y="11" width="12" height="2" />
    </Base>
  );
}

// X / Close (crossed daggers)
export function IconClose(props) {
  return (
    <Base {...props}>
      <rect x="3" y="3" width="2" height="2" />
      <rect x="5" y="5" width="2" height="2" />
      <rect x="7" y="7" width="2" height="2" />
      <rect x="9" y="9" width="2" height="2" />
      <rect x="11" y="11" width="2" height="2" />
      <rect x="11" y="3" width="2" height="2" />
      <rect x="9" y="5" width="2" height="2" />
      <rect x="5" y="9" width="2" height="2" />
      <rect x="3" y="11" width="2" height="2" />
    </Base>
  );
}

// ChevronDown (arrow)
export function IconChevronDown(props) {
  return (
    <Base {...props}>
      <rect x="2" y="5" width="2" height="2" />
      <rect x="4" y="7" width="2" height="2" />
      <rect x="6" y="9" width="4" height="2" />
      <rect x="10" y="7" width="2" height="2" />
      <rect x="12" y="5" width="2" height="2" />
    </Base>
  );
}
