import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Book } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { libraryService } from '../services/libraryService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function BookDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { borrowBook } = useLibrary();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBook() {
      if (!id) return;
      setLoading(true);
      const data = await libraryService.getBookById(id);
      setBook(data);
      setLoading(false);
    }
    fetchBook();
  }, [id]);

  const handleBorrow = async () => {
    if (!book || !user) return;
    setBorrowing(true);
    setMessage(null);
    const success = await borrowBook(book.id, user.id);
    if (success) {
      setMessage('Book borrowed successfully!');
      // Refresh book data
      const updated = await libraryService.getBookById(book.id);
      setBook(updated);
    } else {
      setMessage('Failed to borrow book.');
    }
    setBorrowing(false);
  };

  if (loading) return <LoadingSpinner message="Loading book details..." />;

  if (!book) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Book not found.</p>
        <Link to="/catalog" className="text-indigo-600 hover:text-indigo-800">
          ← Back to Catalog
        </Link>
      </div>
    );
  }

  // BUG: This should be <= 0, not <= 1 (Level 2 challenge)
  const isUnavailable = book.availableCopies <= 1;

  return (
    <div>
      <Link
        to="/catalog"
        className="text-indigo-600 hover:text-indigo-800 mb-6 inline-block"
      >
        ← Back to Catalog
      </Link>

      <Card className="max-w-3xl">
        <div className="flex items-start justify-between mb-4">
          <span className="text-sm font-medium px-3 py-1 rounded bg-indigo-100 text-indigo-700">
            {book.genre}
          </span>
          <span
            className={`text-sm font-medium px-3 py-1 rounded ${
              !isUnavailable
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {!isUnavailable ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
        <p className="text-lg text-gray-600 mb-4">by {book.author}</p>

        <p className="text-gray-700 mb-6 leading-relaxed">
          {book.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <span className="text-gray-500">ISBN:</span>{' '}
            <span className="text-gray-800 font-medium">{book.isbn}</span>
          </div>
          <div>
            <span className="text-gray-500">Copies:</span>{' '}
            <span className="text-gray-800 font-medium">
              {book.availableCopies} of {book.totalCopies} available
            </span>
          </div>
        </div>

        {message && (
          <p
            className={`mb-4 text-sm font-medium ${
              message.includes('success') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}

        {isAuthenticated ? (
          <Button
            onClick={handleBorrow}
            disabled={isUnavailable}
            loading={borrowing}
          >
            {isUnavailable ? 'Not Available' : 'Borrow This Book'}
          </Button>
        ) : (
          <p className="text-gray-500 text-sm">
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Log in
            </Link>{' '}
            to borrow this book.
          </p>
        )}
      </Card>
    </div>
  );
}
