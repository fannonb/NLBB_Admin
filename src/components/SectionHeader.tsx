import React from 'react';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

export const SectionHeader = ({ title, onSeeAll }: SectionHeaderProps) => {
  return (
    <div className="section-header">
      <h2 className="section-title">{title}</h2>
      {onSeeAll ? (
        <button type="button" className="section-see-all" onClick={onSeeAll}>
          See all
        </button>
      ) : null}
    </div>
  );
};
