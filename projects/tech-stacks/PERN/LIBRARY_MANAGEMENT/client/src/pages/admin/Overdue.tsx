import { useEffect, useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { libraryService } from '../../services/libraryService';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { formatDate, getDaysOverdue } from '../../utils/helpers';
import type { BorrowRecord, User } from '../../types';

export function Overdue() {
  const { books } = useLibrary();
  const [overdueRecords, setOverdueRecords] = useState<BorrowRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [records, usersData] = await Promise.all([
        libraryService.getOverdueRecords(),
        libraryService.getUsers(),
      ]);
      setOverdueRecords(records);
      setUsers(usersData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const getUserName = (userId: string) => {
    return users.find((u) => u.id === userId)?.name ?? 'Unknown';
  };

  const getBookTitle = (bookId: string) => {
    return books.find((b) => b.id === bookId)?.title ?? 'Unknown';
  };

  if (loading) return <LoadingSpinner message="Loading overdue report..." />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Overdue Books</h1>
      <p className="text-gray-500 mb-6">
        Books that are past their due date and have not been returned.
      </p>

      {overdueRecords.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-center py-4">
            🎉 No overdue books at the moment!
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
                  Member
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Due Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Days Overdue
                </th>
              </tr>
            </thead>
            <tbody>
              {overdueRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {getBookTitle(record.bookId)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {getUserName(record.userId)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDate(record.dueDate)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
                      {getDaysOverdue(record.dueDate)} days
                    </span>
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
