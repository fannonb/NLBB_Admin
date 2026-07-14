export const CATEGORY_ICON_OPTIONS = [
  { value: 'scissors-cutting', label: 'Hair', glyph: '\u2702' },
  { value: 'hair-dryer', label: 'Salon', glyph: '\u25D2' },
  { value: 'mustache', label: 'Barber', glyph: '\u2312' },
  { value: 'hand-back-right-outline', label: 'Nails', glyph: '\u25C7' },
  { value: 'spa', label: 'Spa', glyph: '\u273F' },
  { value: 'hand-heart', label: 'Massage', glyph: '\u2661' },
  { value: 'face-woman-shimmer', label: 'Facial', glyph: '\u2727' },
  { value: 'lipstick', label: 'Makeup', glyph: '\u25D0' },
  { value: 'eye-outline', label: 'Lashes', glyph: '\u25C9' },
  { value: 'flower-outline', label: 'Waxing', glyph: '\u2740' },
  { value: 'brush', label: 'Tattoo', glyph: '\u2571' },
  { value: 'needle', label: 'Piercing', glyph: '\u25C6' },
  { value: 'leaf-circle-outline', label: 'Wellness', glyph: '\u2767' },
  { value: 'star-four-points-outline', label: 'Other', glyph: '\u2726' },
] as const;

export type CategoryIconValue = (typeof CATEGORY_ICON_OPTIONS)[number]['value'];
export const DEFAULT_CATEGORY_ICON: CategoryIconValue = 'star-four-points-outline';
export const categoryIconGlyph = (value?: string) =>
  CATEGORY_ICON_OPTIONS.find((option) => option.value === value)?.glyph ?? '\u2726';
