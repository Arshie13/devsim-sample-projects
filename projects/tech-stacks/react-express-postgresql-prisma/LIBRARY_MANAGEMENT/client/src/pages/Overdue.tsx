import { useEffect, useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { libraryService } from '../services/libraryService';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { formatDate, getDaysOverdue } from '../utils/helpers';
import type { BorrowRecord } from '../types';

export function Overdue() {
  const { books, getBorrowerName } = useLibrary();
  const [overdueRecords, setOverdueRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOverdue() {
      setLoading(true);
      const records = await libraryService.getOverdueRecords();
      setOverdueRecords(records);
      setLoading(false);
    }
    fetchOverdue();
  }, []);

  const getBookTitle = (id: string) =>
    books.find((b) => b.id === id)?.title ?? 'Unknown';

  if (loading) return <LoadingSpinner message="Loading overdue report..." />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Overdue Books</h1>
      <p className="text-gray-500 mb-6">
        Books that are past their due date and have not been returned.
      </p>

      {overdueRecords.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-center py-4">
            No overdue books at the moment.
          </p>
        </Card>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Book
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Borrower
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Due Date
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Days Overdue
                </th>
              </tr>
            </thead>
            <tbody>
              {overdueRecords.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {getBookTitle(r.bookId)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {getBorrowerName(r)}
                  </td>
                  <td className="py-3 px-4">
                    {r.borrowerType === 'MEMBER' ? (
                      <span className="px-2 py-0.5 text-xs font-medium rounded bg-indigo-100 text-indigo-700">
                        Member
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs font-medium rounded bg-amber-100 text-amber-700">
                        Walk-in
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDate(r.dueDate)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
                      {getDaysOverdue(r.dueDate)} days
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
