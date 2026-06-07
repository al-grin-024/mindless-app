/**
 * Mindless — Default Categories
 * Each category has a default color from the user's chosen palettes.
 * Users can reassign colors during onboarding and in settings.
 */

export const defaultCategories = [
  {
    id: 'school',
    name: 'School',
    color: '#80B0E8',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  },
  {
    id: 'health',
    name: 'Health',
    color: '#CAE8C8',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  },
  {
    id: 'home',
    name: 'Home',
    color: '#FFD576',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  },
  {
    id: 'work',
    name: 'Work',
    color: '#D1CAEA',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  },
  {
    id: 'family',
    name: 'Family',
    color: '#FFC0C0',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  {
    id: 'leisure',
    name: 'Leisure',
    color: '#A4CCC4',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`,
  },
  {
    id: 'shopping',
    name: 'Shopping',
    color: '#FBB94B',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
  },
  {
    id: 'returns',
    name: 'Returns',
    color: '#FFBBA6',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>`,
  },
  {
    id: 'finance',
    name: 'Finance',
    color: '#E8E2FF',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  },
];

/**
 * All available color swatches from the user's reference palettes.
 * Used in the color picker during onboarding and settings.
 */
export const colorPalettes = {
  earthyWarmth: [
    { name: 'Lilac Grey', hex: '#D3C2CD' },
    { name: 'Spring Leaves', hex: '#849E15' },
    { name: 'Good Surf', hex: '#92A2A6' },
    { name: 'Gold Velvet', hex: '#B28622' },
    { name: 'Brink of Pink', hex: '#F8CABA' },
    { name: 'Poppy', hex: '#D8560E' },
    { name: 'Butter Yellow', hex: '#EFCE7B' },
    { name: 'Florida Oranges', hex: '#E1903E' },
    { name: 'Pea Flower', hex: '#6777B6' },
    { name: 'Night Forest', hex: '#2B2B23' },
    { name: 'Dusty Berry', hex: '#D17089' },
    { name: 'Pistachio', hex: '#CBD183' },
  ],
  softWarm: [
    { name: 'Suzie Pink', hex: '#FFBBA6' },
    { name: 'Mint Mist', hex: '#D9E9D9' },
    { name: 'Blackbird', hex: '#333333' },
    { name: 'Red Beanie', hex: '#EE583F' },
    { name: 'Aquatic', hex: '#A4CCC4' },
    { name: 'Moonrise', hex: '#FCF3EA' },
    { name: 'Scout', hex: '#97AA6A' },
    { name: 'Marigold', hex: '#FBB94B' },
  ],
  vibrantJoy: [
    { name: 'Cornflower Blue', hex: '#61A6F7' },
    { name: 'Pale Rose', hex: '#FFE2FF' },
    { name: 'Mango Orange', hex: '#FF7029' },
    { name: 'Ocean Teal', hex: '#035063' },
    { name: 'Sunflower Yellow', hex: '#FFD576' },
    { name: 'Spring Green', hex: '#CAE8C8' },
    { name: 'Pale Lilac', hex: '#E8E2FF' },
    { name: 'Raspberry Red', hex: '#C21047' },
    { name: 'Cream Peach', hex: '#FFD6C9' },
  ],
  playfulPastels: [
    { name: 'Airplane View', hex: '#80B0E8' },
    { name: 'Peony Bundle', hex: '#FFC0C0' },
    { name: 'Tropical Rain', hex: '#008471' },
    { name: 'Autumn Lavender', hex: '#D1CAEA' },
    { name: 'Limeade', hex: '#D6D35F' },
    { name: 'Tomato Jam', hex: '#C45F3F' },
    { name: 'Pure Sun', hex: '#F4D242' },
    { name: 'Monet Ponds', hex: '#898E46' },
    { name: 'Bubble Gum', hex: '#F29CC3' },
  ],
  boldNatural: [
    { name: 'Pool at Sunset', hex: '#2488C5' },
    { name: 'Mint Chip', hex: '#B2DD9E' },
    { name: 'Pink Guava', hex: '#FFA9A5' },
    { name: 'Fresh Snow', hex: '#F4E4D9' },
    { name: 'Olive Jar', hex: '#AD9547' },
    { name: 'Ox-Blood', hex: '#601A00' },
    { name: 'Fire Hydrant', hex: '#D2423A' },
    { name: 'Green Velvet', hex: '#2D3F35' },
    { name: 'Hay Stacks', hex: '#EFCB84' },
  ],
};

/**
 * Get all colors as a flat array for the color picker.
 */
export function getAllColors() {
  return Object.values(colorPalettes).flat();
}
