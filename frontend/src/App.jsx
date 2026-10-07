import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Sales from './pages/Sales';
import Accounting from './pages/Accounting';
import Releasing from './pages/Releasing';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
        {/* Navigation Bar */}
        <nav style={{ background: '#003366', padding: '15px 20px', display: 'flex', gap: '20px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Sales (QR)</Link>
          <Link to="/accounting" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Accounting</Link>
          <Link to="/releasing" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Releasing Scanner</Link>
          <Link to="/reports" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Reports & KPIs</Link>
        </nav>

        {/* Page Routes */}
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Sales />} />
            <Route path="/accounting" element={<Accounting />} />
            <Route path="/releasing" element={<Releasing />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;