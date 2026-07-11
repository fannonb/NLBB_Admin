import React from 'react';
import type { Provider } from '../types';

interface ProviderCardProps {
  provider: Provider;
  onPress: () => void;
  onBookPress: () => void;
  onFavoritePress: () => void;
  isFavorited: boolean;
}

export const ProviderCard = ({ provider, onPress, onBookPress, onFavoritePress, isFavorited }: ProviderCardProps) => {
  return (
    <article className="provider-card" onClick={onPress} style={{ cursor: 'pointer' }}>
      {provider.coverImage ? (
        <div
          className="provider-card-cover"
          style={{ backgroundImage: `url(${provider.coverImage})` }}
          role="img"
          aria-label={`${provider.name} cover`}
        />
      ) : null}

      <div className="provider-card-body">
        <div className="provider-card-header">
          <div className="provider-card-info">
            <h2 className="provider-card-name">{provider.name}</h2>
            <p className="provider-card-category">{provider.category}</p>
          </div>
          <button
            type="button"
            className={`fav-btn ${isFavorited ? 'is-active' : ''}`}
            onClick={(event) => {
              event.stopPropagation();
              onFavoritePress();
            }}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorited ? '♥' : '♡'}
          </button>
        </div>

        <div className="provider-card-meta">
          <span className="provider-rating">
            {provider.rating.toFixed(1)}
          </span>
          <span className="provider-reviews">({provider.reviewCount} reviews)</span>
          <span className={provider.isOpen ? 'open-pill' : 'closed-pill'}>
            {provider.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>

        <p className="provider-card-location">{provider.location}</p>

        <div className="provider-card-footer">
          <span className="provider-price">KES {provider.priceFrom}</span>
          <button type="button" className="primary-btn provider-book-btn" onClick={(event) => {
            event.stopPropagation();
            onBookPress();
          }}>
            Book
          </button>
        </div>
      </div>
    </article>
  );
};
