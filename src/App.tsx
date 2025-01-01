import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Simulator } from './pages/Simulator';
import { Comparison } from './pages/Comparison';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/comparison" element={<Comparison />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;