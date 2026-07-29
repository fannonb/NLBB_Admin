import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { providerApi } from '../../lib/api/providers';
import { useAppStore } from '../../stores/appStore';
import { SearchBar } from '../../components/SearchBar';
import { CategoryPill } from '../../components/CategoryPill';
import { ProviderCard } from '../../components/ProviderCard';
import { EmptyState } from '../../components/EmptyState';
import type { Category, Provider } from '../../types';

export const CustomerExplorePage = () => {
  const navigate = useNavigate();
  const favorites = useAppStore((state) => state.favorites);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);

  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [categoryData, providerData] = await Promise.all([
          providerApi.listCategories(),
          providerApi.listProviders({
            search: search || undefined,
            category: selectedCategory || undefined,
          }),
        ]);
        if (ignore) {
          return;
        }
        setCategories(categoryData);
        setProviders(providerData);
      } catch (loadError) {
        if (ignore) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : 'Unable to load providers.');
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void load();
    return () => {
      ignore = true;
    };
  }, [search, selectedCategory]);

  return (
    <section className="page-stack">
      <h1>Explore Providers</h1>
      <p className="subtle">Browse by category and book verified providers around Nairobi.</p>

      <SearchBar value={search} onChangeText={setSearch} placeholder="Search salons, barbers, spas..." />

      <div className="h-scroll">
        <CategoryPill
          category={{ id: '', name: 'All', icon: '✦' }}
          isActive={selectedCategory === ''}
          onPress={() => setSelectedCategory('')}
        />
        {categories.map((category) => (
          <CategoryPill
            key={category.id}
            category={category}
            isActive={selectedCategory === category.id}
            onPress={() => setSelectedCategory(category.id)}
          />
        ))}
      </div>

      {isLoading ? <p className="subtle">Loading providers...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {!isLoading && !error && providers.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No providers found"
          subtitle="Try a different search term or category."
        />
      ) : (
        <div className="provider-grid">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              isFavorited={favorites.includes(provider.id)}
              onPress={() => navigate(`/customer/provider/${provider.id}`)}
              onBookPress={() => navigate(`/customer/provider/${provider.id}/book`)}
              onFavoritePress={() => void toggleFavorite(provider.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
