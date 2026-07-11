import React from 'react';

interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChangeText, onFilterPress, placeholder = 'Search...' }: SearchBarProps) => {
  return (
    <div className="search-bar">
      <span className="search-icon" aria-hidden="true">&#128269;</span>
      <input
        type="search"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChangeText(event.target.value)}
      />
      {onFilterPress ? (
        <button type="button" className="search-filter-btn" onClick={onFilterPress} aria-label="Filter">
          &#9776;
        </button>
      ) : null}
    </div>
  );
};
