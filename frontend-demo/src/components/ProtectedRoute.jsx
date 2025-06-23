import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user || !token) {
    toast.error('You need to login first');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
