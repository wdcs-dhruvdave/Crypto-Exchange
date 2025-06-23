import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import CryptoExchange from './pages/CryptoExchange';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<h1>About Page</h1>} />
        <Route
          path="/exchange" element={<ProtectedRoute> <CryptoExchange /></ProtectedRoute>}/>
        <Route path="/contact" element={<h1>Contact Page</h1>} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
      <footer className="text-center mt-4">
        <p>&copy; 2025 Frontend Demo</p>
      </footer>
    </>
  );
}

export default App;
