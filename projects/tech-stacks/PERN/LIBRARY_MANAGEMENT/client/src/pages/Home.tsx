import { Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import { BookCard } from '../components/BookCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function Home() {
  const { books, loading } = useLibrary();
  const featuredBooks = books.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-2xl mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to BookWise Library
        </h1>
        <p className="text-indigo-200 text-lg mb-8 max-w-2xl mx-auto">
          Discover thousands of books, manage your reading journey, and explore
          a world of knowledge at your community library.
        </p>
        <Link
          to="/catalog"
          className="inline-block bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          Browse Catalog
        </Link>
      </section>

      {/* Featured Books */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Books</h2>
          <Link
            to="/catalog"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading featured books..." />
        ) : featuredBooks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No books available at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="text-4xl mb-3">📖</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Vast Collection
          </h3>
          <p className="text-gray-500 text-sm">
            Browse our extensive catalog of books across all genres and topics.
          </p>
        </div>
        <div className="text-center p-6">
          <div className="text-4xl mb-3">🔄</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Easy Borrowing
          </h3>
          <p className="text-gray-500 text-sm">
            Borrow and return books with just a few clicks from your dashboard.
          </p>
        </div>
        <div className="text-center p-6">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Track Progress
          </h3>
          <p className="text-gray-500 text-sm">
            Keep track of your borrowing history and never miss a due date.
          </p>
        </div>
      </section>
    </div>
  );
}
