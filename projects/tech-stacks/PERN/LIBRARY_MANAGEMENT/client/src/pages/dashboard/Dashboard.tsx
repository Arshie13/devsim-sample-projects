import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLibrary } from '../../context/LibraryContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { formatDate, isOverdue } from '../../utils/helpers';

export function Dashboard() {
  const { user } = useAuth();
  const { books, borrowRecords, fetchBorrowRecords, returnBook, loading } =
    useLibrary();
  const [returningId, setReturningId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchBorrowRecords(user.id);
    }
  }, [user, fetchBorrowRecords]);

  const currentBorrows = borrowRecords.filter(
    (r) => r.status === 'BORROWED' || r.status === 'OVERDUE',
  );

  const getBookTitle = (bookId: string) => {
    return books.find((b) => b.id === bookId)?.title ?? 'Unknown Book';
  };

  const handleReturn = async (recordId: string) => {
    setReturningId(recordId);
    await returnBook(recordId);
    if (user) {
      await fetchBorrowRecords(user.id);
    }
    setReturningId(null);
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">
        Welcome back, {user?.name}! Here are your current borrows.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <p className="text-sm text-gray-500">Currently Borrowed</p>
          <p className="text-2xl font-bold text-indigo-600">
            {currentBorrows.length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Overdue</p>
          <p className="text-2xl font-bold text-red-600">
            {
              currentBorrows.filter((r) => isOverdue(r.dueDate, r.returnedAt))
                .length
            }
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Total Borrowed</p>
          <p className="text-2xl font-bold text-gray-800">
            {borrowRecords.length}
          </p>
        </Card>
      </div>

      {/* Currently Borrowed Books */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Currently Borrowed
        </h2>
        <Link
          to="/dashboard/history"
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          View Full History →
        </Link>
      </div>

      {currentBorrows.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-center py-4">
            You have no active borrows.{' '}
            <Link
              to="/catalog"
              className="text-indigo-600 hover:text-indigo-800"
            >
              Browse the catalog
            </Link>{' '}
            to find your next read!
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {currentBorrows.map((record) => {
            const overdue = isOverdue(record.dueDate, record.returnedAt);
            return (
              <Card key={record.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {getBookTitle(record.bookId)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Borrowed: {formatDate(record.borrowedAt)}
                    </p>
                    <p
                      className={`text-sm font-medium ${overdue ? 'text-red-600' : 'text-gray-600'}`}
                    >
                      Due: {formatDate(record.dueDate)}{' '}
                      {overdue && '⚠️ OVERDUE'}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => handleReturn(record.id)}
                    loading={returningId === record.id}
                  >
                    Return
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
