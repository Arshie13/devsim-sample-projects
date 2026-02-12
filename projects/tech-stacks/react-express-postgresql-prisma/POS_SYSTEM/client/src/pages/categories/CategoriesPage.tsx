import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import { Card, CardHeader, Button, Input, Modal } from '../../components/ui';
import { Category } from '../../types';

// Demo categories for testing without backend
const demoCategories: Category[] = [
  { id: 1, name: 'Coffee', _count: { products: 4 } },
  { id: 2, name: 'Pastries', _count: { products: 2 } },
  { id: 3, name: 'Food', _count: { products: 2 } },
  { id: 4, name: 'Beverages', _count: { products: 0 } },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(demoCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Demo user is admin
  const isAdmin = true;

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: '',
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id ? { ...c, name: formData.name } : c
        )
      );
    } else {
      const newCategory: Category = {
        id: Math.max(...categories.map((c) => c.id)) + 1,
        name: formData.name,
        _count: { products: 0 },
      };
      setCategories((prev) => [...prev, newCategory]);
    }

    setIsSubmitting(false);
    handleCloseModal();
  };

  const handleDelete = (category: Category) => {
    setCategories((prev) => prev.filter((c) => c.id !== category.id));
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500">Organize your products by category</p>
        </div>
        {isAdmin && (
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        )}
      </div>

      <Card>
        <CardHeader title="All Categories" />

        {/* Search */}
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="border rounded-lg p-4 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">
                      {category._count?.products ?? 0} products
                    </p>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenModal(category)}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(category)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No categories found
            </div>
          )}
        </div>
      </Card>

      {/* Add/Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {formError}
            </div>
          )}

          <Input
            label="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} className="flex-1">
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Category"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>? This action
            cannot be undone.
          </p>
          {(deleteConfirm?._count?.products ?? 0) > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
              This category has {deleteConfirm?._count?.products} products. They will need to be
              reassigned to another category.
            </div>
          )}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDeleteConfirm(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
