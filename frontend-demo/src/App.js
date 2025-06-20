import React from 'react';
import { Route,Router, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import CryptoExchange from './pages/CryptoExchange';
import ProtecedRoute from './components/ProtectedRoute';

function App() {
  return (
   <>
   <Navbar></Navbar>
    <Routes>
      <Route path="/" element={<h1>Home Page</h1>} />
      <Route path="/login" element={<Login></Login>} />
      <Route path="/about" element={<h1>About Page</h1>} />
      <Route path="/exchange" element={<CryptoExchange/>} />
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
