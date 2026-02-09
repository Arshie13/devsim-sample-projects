import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLibrary } from '../../context/LibraryContext';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { formatDate, isOverdue } from '../../utils/helpers';

export function BorrowHistory() {
  const { user } = useAuth();
  const { books, borrowRecords, fetchBorrowRecords, loading } = useLibrary();

  useEffect(() => {
    if (user) {
      fetchBorrowRecords(user.id);
    }
  }, [user, fetchBorrowRecords]);

  const getBookTitle = (bookId: string) => {
    return books.find((b) => b.id === bookId)?.title ?? 'Unknown Book';
  };

  const statusBadge = (status: string, dueDate: string, returnedAt: string | null) => {
    if (status === 'RETURNED') {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600">
          Returned
        </span>
      );
    }
    if (isOverdue(dueDate, returnedAt)) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
          Overdue
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
        Borrowed
      </span>
    );
  };

  if (loading) return <LoadingSpinner message="Loading history..." />;

  return (
    <div>
      <Link
        to="/dashboard"
        className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
      >
        ← Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Borrowing History
      </h1>

      {borrowRecords.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-center py-4">
            No borrowing history yet.
          </p>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Book
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Borrowed
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Due Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Returned
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {borrowRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {getBookTitle(record.bookId)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDate(record.borrowedAt)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDate(record.dueDate)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {record.returnedAt ? formatDate(record.returnedAt) : '—'}
                  </td>
                  <td className="py-3 px-4">
                    {statusBadge(record.status, record.dueDate, record.returnedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
