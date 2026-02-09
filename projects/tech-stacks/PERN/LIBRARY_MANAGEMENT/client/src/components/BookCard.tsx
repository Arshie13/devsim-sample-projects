import { Link } from 'react-router-dom';
import type { Book } from '../types';
import { Card } from './ui/Card';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const isAvailable = book.availableCopies > 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-medium px-2 py-1 rounded bg-indigo-100 text-indigo-700">
            {book.genre}
          </span>
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${
              isAvailable
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 mb-2">by {book.author}</p>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
          {book.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-gray-400">
            {book.availableCopies}/{book.totalCopies} copies
          </span>
          <Link
            to={`/books/${book.id}`}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            View Details →
          </Link>
        </div>
      </div>
    </Card>
  );
}
