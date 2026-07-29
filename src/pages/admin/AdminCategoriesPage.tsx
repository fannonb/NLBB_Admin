import React, { FormEvent, useEffect, useState } from 'react';
import '../../styles/adminCategories.css';
import { ConfirmModal } from '../../components/Modal';
import { showToast } from '../../components/Toast';
import {
  CATEGORY_ICON_OPTIONS,
  CategoryIconValue,
  DEFAULT_CATEGORY_ICON,
  categoryIconGlyph,
} from '../../constants/categoryIcons';
import { ApiClientError } from '../../lib/api/client';
import { adminApi, AdminCategoryRecord } from '../../lib/api/admin';
import {
  AdminError,
  AdminLoading,
  AdminPageHeader,
  EmptyAdminState,
  StatusBadge,
  toErrorMessage,
} from './AdminShared';

interface CategoryFormState {
  name: string;
  icon: CategoryIconValue;
}

const EMPTY_FORM: CategoryFormState = { name: '', icon: DEFAULT_CATEGORY_ICON };

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<AdminCategoryRecord[]>([]);
  const [form, setForm] = useState<CategoryFormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<AdminCategoryRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminCategoryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      setCategories(await adminApi.listCategories());
    } catch (err) {
      setError(toErrorMessage(err, 'Could not load service categories.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const startEditing = (category: AdminCategoryRecord) => {
    const icon = CATEGORY_ICON_OPTIONS.some((option) => option.value === category.icon)
      ? (category.icon as CategoryIconValue)
      : DEFAULT_CATEGORY_ICON;
    setEditingId(category.id);
    setForm({ name: category.name, icon });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveCategory = async (event: FormEvent) => {
    event.preventDefault();
    const name = form.name.trim();
    if (name.length < 2) {
      showToast('Enter a category name.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const updated = await adminApi.updateCategory(editingId, { name, icon: form.icon });
        setCategories((current) => current.map((item) => (item.id === updated.id ? updated : item)));
        showToast('Category updated.', 'success');
      } else {
        const created = await adminApi.createCategory({ name, icon: form.icon });
        setCategories((current) => [...current, created].sort((a, b) => a.sortOrder - b.sortOrder));
        showToast('Category added. Providers can now use it for services.', 'success');
      }
      resetForm();
    } catch (err) {
      showToast(toErrorMessage(err, 'Could not save category.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async () => {
    if (!pendingStatus) return;
    try {
      const updated = await adminApi.updateCategory(pendingStatus.id, { isActive: !pendingStatus.isActive });
      setCategories((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      showToast(updated.isActive ? 'Category activated.' : 'Category deactivated.', 'success');
    } catch (err) {
      showToast(toErrorMessage(err, 'Could not update category status.'), 'error');
    } finally {
      setPendingStatus(null);
    }
  };

  const confirmDelete = async () => {
    const target = pendingDelete;
    if (!target) return;

    const removeFromList = () => {
      setCategories((current) => current.filter((item) => item.id !== target.id));
      if (editingId === target.id) {
        resetForm();
      }
    };

    try {
      await adminApi.deleteCategory(target.id);
      removeFromList();
      showToast('Category permanently deleted.', 'success');
    } catch (err) {
      if (err instanceof Error && (err as ApiClientError).name === 'ApiClientError' && (err as ApiClientError).status === 404) {
        removeFromList();
        showToast('Category was already removed.', 'success');
      } else {
        showToast(toErrorMessage(err, 'Could not delete category.'), 'error');
      }
    } finally {
      setPendingDelete(null);
    }
  };

  if (loading && categories.length === 0) return <AdminLoading label="Loading categories..." />;
  if (error && categories.length === 0) return <AdminError message={error} onRetry={loadCategories} />;

  return (
    <section className="page-stack admin-page">
      <AdminPageHeader
        title="Service Categories"
        subtitle="Create the categories providers use for services and choose the icon customers will see."
        action={<button type="button" className="outline-btn" onClick={loadCategories}>Refresh</button>}
      />
      {error ? <p className="error-text">{error}</p> : null}

      <div className="admin-category-workspace">
        <form className="admin-panel admin-category-form" onSubmit={saveCategory}>
          <div className="admin-panel-header">
            <div>
              <p className="admin-kicker">{editingId ? 'Editing' : 'New category'}</p>
              <h2>{editingId ? 'Update category' : 'Add a category'}</h2>
            </div>
            {editingId ? <button type="button" className="ghost-btn" onClick={resetForm}>Cancel</button> : null}
          </div>

          <label className="admin-category-field">
            <span>Category name</span>
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="e.g. Body Treatments"
              maxLength={120}
              autoComplete="off"
            />
          </label>

          <div className="admin-category-preview" aria-live="polite">
            <span className="admin-category-preview-icon">{categoryIconGlyph(form.icon)}</span>
            <div><small>Customer app preview</small><strong>{form.name.trim() || 'Category name'}</strong></div>
          </div>

          <fieldset className="admin-icon-picker">
            <legend>Choose an icon</legend>
            <div className="admin-icon-grid">
              {CATEGORY_ICON_OPTIONS.map((option) => (
                <label key={option.value} className={`admin-icon-option ${form.icon === option.value ? 'is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="category-icon"
                    value={option.value}
                    checked={form.icon === option.value}
                    onChange={() => setForm((current) => ({ ...current, icon: option.value }))}
                  />
                  <span aria-hidden="true">{option.glyph}</span>
                  <small>{option.label}</small>
                </label>
              ))}
            </div>
          </fieldset>

          <button type="submit" className="primary-btn" disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add category'}
          </button>
        </form>

        <div className="admin-panel admin-category-list-panel">
          <div className="admin-panel-header">
            <div><h2>Managed categories</h2><span>{categories.filter((category) => category.isActive).length} active of {categories.length}</span></div>
          </div>
          {categories.length === 0 ? (
            <EmptyAdminState title="No service categories" subtitle="Add the first category to make it available to providers and customers." />
          ) : (
            <div className="admin-category-list">
              {categories.map((category) => (
                <article key={category.id} className={`admin-category-row ${category.isActive ? '' : 'is-inactive'}`}>
                  <span className="admin-category-row-icon" aria-hidden="true">{categoryIconGlyph(category.icon)}</span>
                  <div className="admin-category-row-copy">
                    <strong>{category.name}</strong>
                    <span>/{category.slug} - {category.serviceCount} service{category.serviceCount === 1 ? '' : 's'}</span>
                  </div>
                  <StatusBadge status={category.isActive ? 'active' : 'disabled'} />
                  <div className="admin-row-actions">
                    <button type="button" className="outline-btn" onClick={() => startEditing(category)}>Edit</button>
                    <button type="button" className="ghost-btn" onClick={() => setPendingStatus(category)}>{category.isActive ? 'Deactivate' : 'Activate'}</button>
                    {!category.isActive ? (
                      <button
                        type="button"
                        className="ghost-btn danger-link"
                        disabled={category.serviceCount > 0}
                        title={category.serviceCount > 0 ? 'Reassign or remove linked services before deleting.' : undefined}
                        onClick={() => setPendingDelete(category)}
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        visible={!!pendingStatus}
        title={pendingStatus?.isActive ? 'Deactivate Category' : 'Activate Category'}
        message={pendingStatus?.isActive
          ? `${pendingStatus.name} will no longer be available for new provider services or customer filtering. Existing services remain linked.`
          : `${pendingStatus?.name} will become available to providers and customers again.`}
        confirmLabel={pendingStatus?.isActive ? 'Deactivate' : 'Activate'}
        destructive={pendingStatus?.isActive}
        onDismiss={() => setPendingStatus(null)}
        onConfirm={toggleStatus}
      />

      <ConfirmModal
        visible={!!pendingDelete}
        title="Delete Category"
        message={`Permanently delete ${pendingDelete?.name}? This cannot be undone.`}
        confirmLabel="Delete forever"
        busyLabel="Deleting..."
        destructive
        onDismiss={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
};
