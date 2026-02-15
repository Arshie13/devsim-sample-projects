import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Books } from './pages/Books';
import { Members } from './pages/Members';
import { BorrowRecords } from './pages/BorrowRecords';
import { Overdue } from './pages/Overdue';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/members" element={<Members />} />
        <Route path="/borrow" element={<BorrowRecords />} />
        <Route path="/overdue" element={<Overdue />} />
      </Route>
    </Routes>
  );
}

export default App;
