import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import CryptoExchange from './pages/CryptoExchange';
import Home from './pages/Home';

function App() {
  return (
    <>
      <Navbar />
      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<Home></Home>} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<h1>About Page</h1>} />
          <Route path="/contact" element={<h1>Contact Page</h1>} />
          <Route path="/exchange" element={<ProtectedRoute><CryptoExchange></CryptoExchange></ProtectedRoute>} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </main>
      <footer className="bg-light text-center py-3 mt-5">
        <p className="mb-0">&copy; 2025 Frontend Demo</p>
      </footer>
    </>
  );
}

export default App;
