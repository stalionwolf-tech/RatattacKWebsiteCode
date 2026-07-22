// Mock Pokémon card data for the RatAttacK Inventory Manager.
// No external APIs — this is static seed data for the admin dashboard preview.

export const MOCK_CARDS = [
  {
    id: 'sv1-125',
    name: 'Emberfox',
    set: 'Scarlet Ember',
    number: '125/198',
    rarity: 'Illustration Rare',
    hp: '120',
    types: ['Fire'],
    artist: 'A. Kusube',
    image: '/admin/cards/ember-fox.png',
  },
  {
    id: 'sv2-044',
    name: 'Aquashell',
    set: 'Tidal Paradox',
    number: '044/167',
    rarity: 'Double Rare',
    hp: '150',
    types: ['Water'],
    artist: 'M. Tanaka',
    image: '/admin/cards/aqua-turtle.png',
  },
  {
    id: 'sv3-018',
    name: 'Leafsprout',
    set: 'Verdant Bloom',
    number: '018/182',
    rarity: 'Common',
    hp: '70',
    types: ['Grass'],
    artist: 'K. Yamamoto',
    image: '/admin/cards/leaf-sprout.png',
  },
  {
    id: 'sv4-071',
    name: 'Voltmouse',
    set: 'Static Surge',
    number: '071/091',
    rarity: 'Special Illustration Rare',
    hp: '90',
    types: ['Lightning'],
    artist: 'S. Ito',
    image: '/admin/cards/volt-mouse.png',
  },
  {
    id: 'sv5-133',
    name: 'Shadowing',
    set: 'Twilight Veil',
    number: '133/162',
    rarity: 'Ultra Rare',
    hp: '110',
    types: ['Psychic', 'Darkness'],
    artist: 'R. Nakamura',
    image: '/admin/cards/shadow-bat.png',
  },
  {
    id: 'sv6-089',
    name: 'Rockgolem',
    set: 'Iron Foundation',
    number: '089/145',
    rarity: 'Rare',
    hp: '160',
    types: ['Fighting'],
    artist: 'T. Watanabe',
    image: '/admin/cards/rock-golem.png',
  },
];

export const CONDITIONS = [
  'Near Mint',
  'Lightly Played',
  'Moderately Played',
  'Heavily Played',
  'Damaged',
];

// Tailwind tint classes keyed by energy type — used for the type chips.
export const TYPE_STYLES = {
  Fire: 'bg-orange-950/60 text-orange-300 border-orange-800/70',
  Water: 'bg-sky-950/60 text-sky-300 border-sky-800/70',
  Grass: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/70',
  Lightning: 'bg-yellow-950/60 text-yellow-300 border-yellow-800/70',
  Psychic: 'bg-fuchsia-950/60 text-fuchsia-300 border-fuchsia-800/70',
  Darkness: 'bg-neutral-800/80 text-neutral-300 border-neutral-700',
  Fighting: 'bg-amber-950/60 text-amber-300 border-amber-800/70',
};
