export const CATEGORY_ICON_OPTIONS = [
  { value: 'scissors-cutting', label: 'Hair', glyph: '\u2702' },
  { value: 'content-cut', label: 'Cut', glyph: '\u2700' },
  { value: 'hair-dryer', label: 'Salon', glyph: '\u2600' },
  { value: 'mustache', label: 'Barber', glyph: '\u263A' },
  { value: 'razor', label: 'Shave', glyph: '\u2694' },
  { value: 'hand-back-right-outline', label: 'Nails', glyph: '\u272A' },
  { value: 'spa', label: 'Spa', glyph: '\u273F' },
  { value: 'hand-heart', label: 'Massage', glyph: '\u2661' },
  { value: 'hand-wave', label: 'Hands', glyph: '\u270B' },
  { value: 'face-woman-shimmer', label: 'Facial', glyph: '\u2727' },
  { value: 'emoticon-happy-outline', label: 'Skincare', glyph: '\u263A' },
  { value: 'lipstick', label: 'Makeup', glyph: '\u25D0' },
  { value: 'palette', label: 'Beauty', glyph: '\u25C8' },
  { value: 'eye-outline', label: 'Lashes', glyph: '\u25C9' },
  { value: 'flower-outline', label: 'Waxing', glyph: '\u2740' },
  { value: 'perfume', label: 'Fragrance', glyph: '\u2726' },
  { value: 'mirror', label: 'Grooming', glyph: '\u25CE' },
  { value: 'brush', label: 'Tattoo', glyph: '\u270E' },
  { value: 'needle', label: 'Piercing', glyph: '\u25C6' },
  { value: 'tooth', label: 'Dental', glyph: '\u25B3' },
  { value: 'yoga', label: 'Yoga', glyph: '\u2638' },
  { value: 'dumbbell', label: 'Fitness', glyph: '\u26A1' },
  { value: 'heart-pulse', label: 'Wellness', glyph: '\u2665' },
  { value: 'leaf-circle-outline', label: 'Natural', glyph: '\u2767' },
  { value: 'baby-carriage', label: 'Kids', glyph: '\u2605' },
  { value: 'gender-female', label: 'Women', glyph: '\u2640' },
  { value: 'camera', label: 'Photos', glyph: '\u25A3' },
  { value: 'star-four-points-outline', label: 'Other', glyph: '\u2726' },
] as const;

export type CategoryIconValue = (typeof CATEGORY_ICON_OPTIONS)[number]['value'];
export const DEFAULT_CATEGORY_ICON: CategoryIconValue = 'star-four-points-outline';
export const categoryIconGlyph = (value?: string) =>
  CATEGORY_ICON_OPTIONS.find((option) => option.value === value)?.glyph ?? '\u2726';
