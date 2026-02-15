import { useState, type SubmitEvent } from 'react';
import { z } from 'zod';
import { useLibrary } from '../context/LibraryContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { CameraCapture } from '../components/ui/CameraCapture';
import { formatDate, isOverdue, getDaysOverdue } from '../utils/helpers';
import type { BorrowerType } from '../types';

const walkInSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email({ message: 'Invalid email' }),
  phone: z.string().min(1, 'Phone is required'),
  idNumber: z.string().min(1, 'ID number is required'),
});

const emptyWalkInForm = {
  name: '',
  email: '',
  phone: '',
  idNumber: '',
};

export function BorrowRecords() {
  const {
    books,
    members,
    borrowRecords,
    loading,
    borrowBookMember,
    borrowBookWalkIn,
    returnBook,
    getBorrowerName,
    error,
    clearError,
  } = useLibrary();

  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Issue form state
  const [borrowerType, setBorrowerType] = useState<BorrowerType>('MEMBER');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [walkInForm, setWalkInForm] = useState(emptyWalkInForm);
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [issuing, setIssuing] = useState(false);
  const [issueError, setIssueError] = useState<string | null>(null);
  const [returningId, setReturningId] = useState<string | null>(null);

  const getBookTitle = (id: string) =>
    books.find((b) => b.id === id)?.title ?? 'Unknown';

  const availableBooks = books.filter((b) => b.availableCopies > 0);

  const filteredRecords = borrowRecords.filter((r) => {
    if (!statusFilter) return true;
    if (statusFilter === 'OVERDUE') {
      return r.status !== 'RETURNED' && isOverdue(r.dueDate, r.returnedAt);
    }
    return r.status === statusFilter;
  });

  const openModal = () => {
    clearError();
    setIssueError(null);
    setFieldErrors({});
    setBorrowerType('MEMBER');
    setSelectedBook('');
    setSelectedMember('');
    setWalkInForm(emptyWalkInForm);
    setIdPhoto(null);
    setIsModalOpen(true);
  };

  const handleWalkInChange = (field: string, value: string) => {
    setWalkInForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleIssue = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBook) {
      setIssueError('Please select a book.');
      return;
    }

    setIssuing(true);
    setIssueError(null);
    setFieldErrors({});

    let success = false;

    if (borrowerType === 'MEMBER') {
      if (!selectedMember) {
        setIssueError('Please select a member.');
        setIssuing(false);
        return;
      }
      success = await borrowBookMember(selectedBook, selectedMember);
    } else {
      // Validate walk-in form
      const result = walkInSchema.safeParse(walkInForm);
      if (!result.success) {
        const errs: Record<string, string> = {};
        for (const issue of result.error.issues) {
          const key = String(issue.path[0]);
          if (!errs[key]) errs[key] = issue.message;
        }
        setFieldErrors(errs);
        setIssuing(false);
        return;
      }

      success = await borrowBookWalkIn(selectedBook, {
        name: walkInForm.name,
        email: walkInForm.email,
        phone: walkInForm.phone,
        idNumber: walkInForm.idNumber,
        idPhoto,
      });
    }

    setIssuing(false);
    if (success) {
      setIsModalOpen(false);
    } else {
      setIssueError(error ?? 'Failed to issue book');
    }
  };

  const handleReturn = async (recordId: string) => {
    setReturningId(recordId);
    await returnBook(recordId);
    setReturningId(null);
  };

  if (loading) return <LoadingSpinner message="Loading records..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Borrow / Return</h1>
        <Button onClick={openModal}>+ Issue Book</Button>
      </div>

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
                  Borrowed
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Due Date
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Returned
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r) => {
                const overdue =
                  r.status !== 'RETURNED' && isOverdue(r.dueDate, r.returnedAt);
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
                      {formatDate(r.borrowedAt)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(r.dueDate)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {r.returnedAt ? formatDate(r.returnedAt) : '—'}
                    </td>
                    <td className="py-3 px-4">
                      {r.status === 'RETURNED' ? (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600">
                          Returned
                        </span>
                      ) : overdue ? (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
                          Overdue ({getDaysOverdue(r.dueDate)}d)
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
                          Borrowed
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {r.status !== 'RETURNED' && (
                        <Button
                          variant="secondary"
                          onClick={() => handleReturn(r.id)}
                          loading={returningId === r.id}
                          className="text-xs px-3 py-1"
                        >
                          Return
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Issue Book Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Issue Book"
      >
        <form onSubmit={handleIssue} className="flex flex-col gap-4">
          {issueError && (
            <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {issueError}
            </p>
          )}

          {/* Book selection */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Book</label>
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Select a book</option>
              {availableBooks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} ({b.availableCopies} available)
                </option>
              ))}
            </select>
          </div>

          {/* Borrower type toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Who is borrowing?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBorrowerType('MEMBER')}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  borrowerType === 'MEMBER'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className={`block font-medium ${
                  borrowerType === 'MEMBER' ? 'text-indigo-700' : 'text-gray-900'
                }`}>
                  📋 Registered Member
                </span>
                <span className="text-xs text-gray-500">
                  Quick select from existing members
                </span>
              </button>
              <button
                type="button"
                onClick={() => setBorrowerType('WALK_IN')}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  borrowerType === 'WALK_IN'
                    ? 'border-amber-600 bg-amber-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className={`block font-medium ${
                  borrowerType === 'WALK_IN' ? 'text-amber-700' : 'text-gray-900'
                }`}>
                  🚶 Walk-in Borrower
                </span>
                <span className="text-xs text-gray-500">
                  New visitor — fill in their details
                </span>
              </button>
            </div>
          </div>

          {/* ── Member Quick Select ── */}
          {borrowerType === 'MEMBER' && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Select Member
              </label>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">— Choose a member —</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* ── Walk-in Form ── */}
          {borrowerType === 'WALK_IN' && (
            <div className="flex flex-col gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800 font-medium">
                Enter the walk-in borrower's details below:
              </p>

              <Input
                label="Full Name"
                value={walkInForm.name}
                onChange={(e) => handleWalkInChange('name', e.target.value)}
                error={fieldErrors.name}
                placeholder="e.g. Juan Dela Cruz"
              />
              <Input
                label="Email"
                type="email"
                value={walkInForm.email}
                onChange={(e) => handleWalkInChange('email', e.target.value)}
                error={fieldErrors.email}
                placeholder="e.g. juan@email.com"
              />
              <Input
                label="Phone"
                value={walkInForm.phone}
                onChange={(e) => handleWalkInChange('phone', e.target.value)}
                error={fieldErrors.phone}
                placeholder="e.g. 09171234567"
              />
              <Input
                label="ID Number"
                value={walkInForm.idNumber}
                onChange={(e) => handleWalkInChange('idNumber', e.target.value)}
                error={fieldErrors.idNumber}
                placeholder="e.g. DL-1234-5678 or SSS-12-345678"
              />

              {/* Camera Capture for ID photo */}
              <CameraCapture
                onCapture={(dataUrl) => setIdPhoto(dataUrl)}
                capturedImage={idPhoto}
                onClear={() => setIdPhoto(null)}
              />
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <Button type="submit" loading={issuing}>
              Issue Book
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
