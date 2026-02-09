import { useEffect, useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { libraryService } from '../../services/libraryService';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { formatDate, isOverdue } from '../../utils/helpers';
import type { User } from '../../types';

export function BorrowRecords() {
  const { books, borrowRecords, fetchBorrowRecords, loading } = useLibrary();
  const [users, setUsers] = useState<User[]>([]);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchBorrowRecords();
    libraryService.getUsers().then(setUsers);
  }, [fetchBorrowRecords]);

  const getUserName = (userId: string) => {
    return users.find((u) => u.id === userId)?.name ?? 'Unknown';
  };

  const getBookTitle = (bookId: string) => {
    return books.find((b) => b.id === bookId)?.title ?? 'Unknown';
  };

  const filteredRecords = borrowRecords.filter((r) => {
    if (!statusFilter) return true;
    if (statusFilter === 'OVERDUE') {
      return r.status !== 'RETURNED' && isOverdue(r.dueDate, r.returnedAt);
    }
    return r.status === statusFilter;
  });

  if (loading) return <LoadingSpinner message="Loading records..." />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        All Borrow Records
      </h1>

      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="">All Statuses</option>
          <option value="BORROWED">Borrowed</option>
          <option value="RETURNED">Returned</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>

      {filteredRecords.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Member
                </th>
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
              {filteredRecords.map((record) => {
                const overdue = isOverdue(record.dueDate, record.returnedAt);
                return (
                  <tr
                    key={record.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {getUserName(record.userId)}
                    </td>
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
                      {record.returnedAt
                        ? formatDate(record.returnedAt)
                        : '—'}
                    </td>
                    <td className="py-3 px-4">
                      {record.status === 'RETURNED' ? (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600">
                          Returned
                        </span>
                      ) : overdue ? (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
                          Overdue
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
                          Borrowed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
