import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockBooks, mockBorrowRecords } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  status: 'available' | 'borrowed' | 'overdue';
  borrowedBy?: string;
  borrowedDate?: string;
  dueDate?: string;
}

export default function ReturnsPage() {
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>(mockBooks.filter((book) => book.status === 'borrowed'));
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const router = useRouter();

  const handleReturn = (bookId: string) => {
    setBorrowedBooks((prev) =>
      prev.filter((book) => book.id !== bookId)
    );
    setConfirmDialogOpen(false);
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-amber-950">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-amber-200 dark:border-amber-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-amber-600 dark:text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-serif font-bold text-amber-900 dark:text-amber-100">
                SM Tech Library
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-amber-700 dark:text-amber-400">
                Welcome, Admin Librarian
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem('librarian');
                  router.push('/login');
                }}
                className="border-amber-300 text-amber-800 hover:bg-amber-100"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="text-amber-900 dark:text-amber-100">
              Book Returns
            </CardTitle>
            <CardDescription>
              Process book returns and update availability status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Borrowed By</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrowedBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">
                      {book.title}
                    </TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.isbn}</TableCell>
                    <TableCell>{book.borrowedBy}</TableCell>
                    <TableCell>{book.dueDate}</TableCell>
                    <TableCell>
                      <Dialog
                        open={confirmDialogOpen}
                        onOpenChange={setConfirmDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            Return
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Return</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to return{' '}
                              <strong>{selectedBook?.title}</strong>? This will
                              make the book available again.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setConfirmDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                if (selectedBook) {
                                  handleReturn(selectedBook.id);
                                }
                              }}
                            >
                              Confirm Return
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {borrowedBooks.length === 0 && (
              <div className="text-center py-12 text-amber-600 dark:text-amber-400">
                No books currently borrowed
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}