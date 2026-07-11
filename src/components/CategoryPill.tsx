import React from 'react';
import type { Category } from '../types';

interface CategoryPillProps {
  category: Category;
  isActive: boolean;
  onPress: () => void;
  variant?: 'circle' | 'pill';
}

const iconMap: Record<string, string> = {
  scissors: '✂',
  spa: '💆',
  brush: '💇',
  makeup: '💄',
  barber: '💈',
  nail: '💅',
  facial: '🧖',
};

export const CategoryPill = ({ category, isActive, onPress, variant = 'pill' }: CategoryPillProps) => {
  const icon = iconMap[category.icon] ?? category.icon ?? '✦';

  return (
    <button
      type="button"
      className={`category-item ${isActive ? 'is-active' : ''} category-${variant}`}
      onClick={onPress}
      aria-pressed={isActive}
    >
      <span className="category-icon">{icon}</span>
      <span className="category-label">{category.name}</span>
    </button>
  );
};
