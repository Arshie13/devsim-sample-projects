'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockBooks, mockBorrowRecords, Book, BorrowRecord, Librarian } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type Tab = 'books' | 'borrowed' | 'overdue';

export default function DashboardPage() {
  const [librarian, setLibrarian] = useState<Librarian | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('books');
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>(mockBorrowRecords);
  const router = useRouter();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const storedLibrarian = localStorage.getItem('librarian');
    if (storedLibrarian) {
      try {
        const librarianData = JSON.parse(storedLibrarian);
        setLibrarian(librarianData);
      } catch {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('librarian');
    router.push('/login');
  };

  if (!librarian) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50 dark:bg-amber-950">
        <div className="text-amber-700">Loading...</div>
      </div>
    );
  }

  const availableBooks = books.filter((book) => book.status === 'available');
  const borrowedBooks = books.filter((book) => book.status === 'borrowed');
  const overdueBooks = books.filter((book) => book.status === 'overdue');

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-amber-950">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-amber-200 dark:border-amber-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h1 className="text-xl font-serif font-bold text-amber-900 dark:text-amber-100">
                SM Tech Library
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-amber-700 dark:text-amber-400">
                Welcome, {librarian.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-amber-200 dark:border-amber-800">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                Total Books
              </p>
              <p className="text-3xl font-bold text-amber-900 dark:text-amber-100 mt-2">
                {books.length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-amber-200 dark:border-amber-800">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                Available
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {availableBooks.length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-amber-200 dark:border-amber-800">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                Overdue
              </p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {overdueBooks.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Tab)}>
          <TabsList className="mb-6 bg-amber-100 dark:bg-amber-900">
            <TabsTrigger value="books" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">All Books</TabsTrigger>
            <TabsTrigger value="borrowed" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">Borrowed Books</TabsTrigger>
            <TabsTrigger value="overdue" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">Overdue Books</TabsTrigger>
          </TabsList>

          <TabsContent value="books">
            <Card className="border-amber-200 dark:border-amber-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>ISBN</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Borrowed By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.isbn}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={book.status === 'available' ? 'success' : book.status === 'borrowed' ? 'secondary' : 'destructive'}
                        >
                          {book.status === 'available' ? 'Available' : book.status === 'borrowed' ? 'Borrowed' : 'Overdue'}
                        </Badge>
                      </TableCell>
                      <TableCell>{book.borrowedBy || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="borrowed">
            <Card className="border-amber-200 dark:border-amber-800">
              {borrowedBooks.length === 0 ? (
                <div className="p-12 text-center text-amber-600 dark:text-amber-400">
                  No borrowed books
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book Title</TableHead>
                      <TableHead>Borrowed By</TableHead>
                      <TableHead>Borrow Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {borrowedBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium">{book.title}</TableCell>
                        <TableCell>{book.borrowedBy}</TableCell>
                        <TableCell>{book.borrowedDate}</TableCell>
                        <TableCell>{book.dueDate}</TableCell>
                        <TableCell>
                        <Badge variant="secondary">
                          Borrowed
                        </Badge>
                      </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="overdue">
            <Card className="border-amber-200 dark:border-amber-800">
              {overdueBooks.length === 0 ? (
                <div className="p-12 text-center text-amber-600 dark:text-amber-400">
                  No overdue books
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book Title</TableHead>
                      <TableHead>Borrowed By</TableHead>
                      <TableHead>Original Due Date</TableHead>
                      <TableHead>Days Overdue</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overdueBooks.map((book) => {
                      const dueDate = new Date(book.dueDate!);
                      const today = new Date();
                      const daysOverdue = Math.floor(
                        (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
                      );

                      return (
                        <TableRow key={book.id}>
                          <TableCell className="font-medium">{book.title}</TableCell>
                          <TableCell>{book.borrowedBy}</TableCell>
                          <TableCell>{book.dueDate}</TableCell>
                          <TableCell className="font-medium text-red-600">
                            {daysOverdue} days
                          </TableCell>
                          <TableCell>
                        <Badge variant="destructive">
                          Overdue
                        </Badge>
                      </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
