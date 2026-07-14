import React from 'react';
import { categoryIconGlyph } from '../constants/categoryIcons';
import type { Category } from '../types';

interface CategoryPillProps {
  category: Category;
  isActive: boolean;
  onPress: () => void;
  variant?: 'circle' | 'pill';
}

export const CategoryPill = ({ category, isActive, onPress, variant = 'pill' }: CategoryPillProps) => (
  <button
    type="button"
    className={`category-item ${isActive ? 'is-active' : ''} category-${variant}`}
    onClick={onPress}
    aria-pressed={isActive}
  >
    <span className="category-icon">{categoryIconGlyph(category.icon)}</span>
    <span className="category-label">{category.name}</span>
  </button>
);
