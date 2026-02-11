import { useLibrary } from '../context/LibraryContext';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { isOverdue, formatDate, getDaysOverdue } from '../utils/helpers';

export function Dashboard() {
  const { books, borrowRecords, loading, getBorrowerName } = useLibrary();

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  const activeRecords = borrowRecords.filter((r) => r.status !== 'RETURNED');
  const overdueRecords = activeRecords.filter((r) =>
    isOverdue(r.dueDate, r.returnedAt),
  );
  const totalAvailable = books.reduce((sum, b) => sum + b.availableCopies, 0);

  const getBookTitle = (id: string) =>
    books.find((b) => b.id === id)?.title ?? 'Unknown';

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <p className="text-sm text-gray-500">Total Books</p>
          <p className="text-3xl font-bold text-indigo-600">{books.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Available Copies</p>
          <p className="text-3xl font-bold text-green-600">{totalAvailable}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Active Borrows</p>
          <p className="text-3xl font-bold text-blue-600">
            {activeRecords.length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Overdue</p>
          <p className="text-3xl font-bold text-red-600">
            {overdueRecords.length}
          </p>
        </Card>
      </div>

      {/* Recent Active Borrows */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Active Borrows
        </h2>
        {activeRecords.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-center py-2">
              No active borrows.
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
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeRecords.map((r) => {
                  const overdue = isOverdue(r.dueDate, r.returnedAt);
                  return (
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
                        {overdue ? (
                          <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
                            Overdue ({getDaysOverdue(r.dueDate)}d)
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
    </div>
  );
}
