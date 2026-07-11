import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { providerApi } from '../../lib/api/providers';
import type { Category, Provider } from '../../types';

export const CustomerExplorePage = () => {
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

      <div className="filter-bar">
        <input
          type="search"
          placeholder="Search salons, barbers, spas..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? <p className="subtle">Loading providers...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      <div className="provider-grid">
        {providers.map((provider) => (
          <article key={provider.id} className="provider-card">
            <div className="provider-meta">
              <h2>{provider.name}</h2>
              <span className={provider.isOpen ? 'open-pill' : 'closed-pill'}>
                {provider.isOpen ? 'Open now' : 'Closed'}
              </span>
            </div>
            <p>{provider.description}</p>
            <p className="subtle">
              {provider.location} • From KES {provider.priceFrom}
            </p>
            <p className="subtle">
              Rating {provider.rating.toFixed(1)} ({provider.reviewCount} reviews)
            </p>
            <Link className="primary-btn provider-link" to={`/customer/provider/${provider.id}`}>
              View Provider
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};
