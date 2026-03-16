import { useState, type SubmitEvent } from 'react';
import { z } from 'zod';
import { useLibrary } from '../context/LibraryContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
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
    loading,
    borrowBookMember,
    borrowBookWalkIn,
    error,
    clearError,
  } = useLibrary();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Issue form state
  const [borrowerType, setBorrowerType] = useState<BorrowerType>('MEMBER');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [walkInForm, setWalkInForm] = useState(emptyWalkInForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [issuing, setIssuing] = useState(false);
  const [issueError, setIssueError] = useState<string | null>(null);

  const availableBooks = books.filter((b) => b.availableCopies > 0);

  const openModal = () => {
    clearError();
    setIssueError(null);
    setFieldErrors({});
    setBorrowerType('MEMBER');
    setSelectedBook('');
    setSelectedMember('');
    setWalkInForm(emptyWalkInForm);
    setIsModalOpen(true);
  };

  const handleWalkInChange = (field: string, value: string) => {
    setWalkInForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleIssue = async (e: React.SubmitEvent<HTMLFormElement>) => {
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
        idPhoto: '',
      });
    }

    setIssuing(false);
    if (success) {
      setIsModalOpen(false);
    } else {
      setIssueError(error ?? 'Failed to issue book');
    }
  };

  if (loading) return <LoadingSpinner message="Loading records..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Borrow / Return</h1>
        <Button onClick={openModal}>+ Issue Book</Button>
      </div>
       
       {/* ── Insert Level-4 Codes Below ── */}


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
