import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { BudgetProvider } from './context/BudgetContext';

function App() {
  return (
    <BudgetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </BudgetProvider>
  );
}

export default App;
