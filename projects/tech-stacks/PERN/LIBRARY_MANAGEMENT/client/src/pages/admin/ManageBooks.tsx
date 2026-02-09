import { useState, useEffect, type FormEvent } from 'react';
import { z } from 'zod';
import { useLibrary } from '../../context/LibraryContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { GENRES } from '../../types';
import type { Book } from '../../types';

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  genre: z.string().min(1, 'Genre is required'),
  description: z.string().min(1, 'Description is required'),
  isbn: z.string().min(1, 'ISBN is required'),
  totalCopies: z.number().min(1, 'Must have at least 1 copy'),
});

const emptyForm = {
  title: '',
  author: '',
  genre: '',
  description: '',
  isbn: '',
  totalCopies: '1',
};

export function ManageBooks() {
  const { books, loading, addBook, updateBook, archiveBook } = useLibrary();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        genre: editingBook.genre,
        description: editingBook.description,
        isbn: editingBook.isbn,
        totalCopies: String(editingBook.totalCopies),
      });
    } else {
      setFormData(emptyForm);
    }
    setFieldErrors({});
  }, [editingBook]);

  const openAdd = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const openEdit = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const parsed = bookSchema.safeParse({
      ...formData,
      totalCopies: parseInt(formData.totalCopies, 10) || 0,
    });

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? '');
        if (key && !errors[key]) {
          errors[key] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    let success: boolean;

    if (editingBook) {
      success = await updateBook(editingBook.id, parsed.data);
    } else {
      success = await addBook(parsed.data);
    }

    setSubmitting(false);
    if (success) {
      closeModal();
    }
  };

  const handleArchive = async (id: string) => {
    if (window.confirm('Are you sure you want to archive this book?')) {
      await archiveBook(id);
    }
  };

  if (loading) return <LoadingSpinner message="Loading books..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Books</h1>
        <Button onClick={openAdd}>+ Add Book</Button>
      </div>

      {books.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          No books in the system yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Title
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Author
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Genre
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Copies
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr
                  key={book.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {book.title}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {book.author}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700">
                      {book.genre}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {book.availableCopies}/{book.totalCopies}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => openEdit(book)}
                        className="text-xs px-3 py-1"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleArchive(book.id)}
                        className="text-xs px-3 py-1"
                      >
                        Archive
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingBook ? 'Edit Book' : 'Add New Book'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="title"
            label="Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.currentTarget.value)}
            error={fieldErrors.title}
          />
          <Input
            id="author"
            label="Author"
            value={formData.author}
            onChange={(e) => handleChange('author', e.currentTarget.value)}
            error={fieldErrors.author}
          />

          <div className="flex flex-col gap-1">
            <label
              htmlFor="genre"
              className="text-sm font-medium text-gray-700"
            >
              Genre
            </label>
            <select
              id="genre"
              value={formData.genre}
              onChange={(e) => handleChange('genre', e.target.value)}
              className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${
                fieldErrors.genre ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a genre</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {fieldErrors.genre && (
              <p className="text-sm text-red-600">{fieldErrors.genre}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                fieldErrors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {fieldErrors.description && (
              <p className="text-sm text-red-600">{fieldErrors.description}</p>
            )}
          </div>

          <Input
            id="isbn"
            label="ISBN"
            value={formData.isbn}
            onChange={(e) => handleChange('isbn', e.currentTarget.value)}
            error={fieldErrors.isbn}
          />
          <Input
            id="totalCopies"
            label="Total Copies"
            type="number"
            min="1"
            value={formData.totalCopies}
            onChange={(e) => handleChange('totalCopies', e.currentTarget.value)}
            error={fieldErrors.totalCopies}
          />

          <div className="flex gap-3 mt-2">
            <Button type="submit" loading={submitting}>
              {editingBook ? 'Update Book' : 'Add Book'}
            </Button>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
